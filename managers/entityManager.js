/*

 entityManager.js

 A module which handles arbitrary entity-management for "Robotron"


 We create this module as a single global object, and initialise it
 with suitable 'data' and 'methods'.

 "Private" properties are denoted by an underscore prefix convention.

 */


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

    _protagonists: [],
	_family: [],
	_enemies: [],
    _invincibles: [],
	_bullets: [],
    _scoreImgs: [],
	
	_bulletDU: 0,
	_bulletDuDelay: 20,
	
	_isChangingLevel: false,
	_changingTimer: 2 * SECS_TO_NOMINALS,

// "PRIVATE" METHODS

    // Accepts an array of objects {n : [number], f : [function]}.
    // Calls each [function] number [times].
    _startLevel: function (levelDescription) {
        for (var i = 0; i < levelDescription.length; i++) {
            var entity = levelDescription[i];
            for (var j = 0; j < entity.n; j++) {
                entity.f.call(this);
            }
        }
    },

    _forEachOf: function (aCategory, fn) {
        for (var i = 0; i < aCategory.length; ++i) {
            fn.call(aCategory[i]);
        }
    },
	
	_isFinished: function () {
		// TODO: DIE if you gots no life! ;D
		if (Player.getLives() === 0)
			return; //TODO: transition to main menu
		
		// TODO: DO level up if enemies is empty
		// Need to somehow distinguish between
		// "undead" and killable enemies.
		// Like separate categories?
		if (this._enemies.length === 0)
			levelManager.nextLevel();
	},
	
	_changeLevel: function (ctx) {
		// TODO: Add sound
		var halfWidth = g_canvas.width / 2;
		var halfHeight = (g_canvas.height - consts.wallTop) / 2;
		var yMiddle = consts.wallTop + halfHeight;
		var layerOffsetX = 5;
		var layerOffsetY = halfHeight / (halfWidth / layerOffsetX);
		var layers = halfWidth / layerOffsetX;
		
		var prevfillStyle = ctx.fillStyle;
		ctx.fillStyle = "#FF55A3";
		// TODO: Add a good color sceme
		
		if (this._changingTimer > SECS_TO_NOMINALS) {
		
			var range = (2 * SECS_TO_NOMINALS - this._changingTimer) / SECS_TO_NOMINALS;
			var currentLayer = Math.floor(range * layers);
			
			for (var i = 1; i < currentLayer; i++) {
				if (i % 9 < 9) ctx.fillStyle = "red";
				if (i % 9 < 6) ctx.fillStyle = "#FF55A3";
				if (i % 9 < 3) ctx.fillStyle = "blue";
				ctx.fillRect(
					halfWidth - i * layerOffsetX,
					yMiddle - i * layerOffsetY,
					i * layerOffsetX * 2,
					i * layerOffsetY * 2
				);
			}
			
		} else {
		
			var range = this._changingTimer / SECS_TO_NOMINALS;
			var currentLayer = Math.ceil(range * layers);
			
			for (var i = 1; i < currentLayer; i++) {
				if (i % 6 < 6) ctx.fillStyle = "red";
				if (i % 6 < 4) ctx.fillStyle = "#FF55A3";
				if (i % 6 < 2) ctx.fillStyle = "blue";
				ctx.fillRect(
					i * layerOffsetX,
					consts.wallTop + i * layerOffsetY,
					g_canvas.width - i * layerOffsetX * 2,
					g_canvas.height - consts.wallTop - i * layerOffsetY * 2
				);
			}
			
			range = (SECS_TO_NOMINALS - this._changingTimer) / SECS_TO_NOMINALS;
			currentLayer = Math.ceil(range * layers);
			
			ctx.fillStyle = "black";
			ctx.fillRect(
				halfWidth - currentLayer * layerOffsetX,
				yMiddle - currentLayer * layerOffsetY,
				currentLayer * layerOffsetX * 2,
				currentLayer * layerOffsetY * 2
			);
		}
		
		ctx.fillStyle = prevfillStyle;
		
		// Reset changing timer when level changing is complete
		if (this._changingTimer < 0) {
			this._isChangingLevel = false;
			this._changingTimer = 2 * SECS_TO_NOMINALS;
		}
	},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
    KILL_ME_NOW: -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
    deferredSetup: function () {
        this._categories = [
			this._protagonists, 
			this._bullets, 
			this._family, 
			this._enemies,
            this._invincibles,
            this._scoreImgs
		];
    },

    init: function (level) {
        
        var descr = [
            { n : 1, f : this.createProtagonist },
            { n : 0, f : this.createFamily },
            { n : 0, f : this.createGrunt },
            { n : 0, f : this.createHulk },
            { n : 0, f : this.createBrain },
            { n : 0, f : this.createElectrode }
            //TODO: add more entities
        ];

        for (var i = 0; i < level.length; i++) {
            descr[i+1].n =level[i];
        };

        this._startLevel(descr);
    },

    resetPos: function () {
        for (var c = 1; c < this._categories.length; ++c) {
            for (var i = 0; i < this._categories[c].length; i++) {
                var p = this._categories[c][i].startPos;
                if (p) this._categories[c][i].setPos(p.posX, p.posY);
            };
        }
    },

    respawnSurvivors: function () {
        var level = [];
        for (var c = 1; c < this._categories.length-1; ++c) {
            level.push(this._categories[c].length);
        }
        console.log('new level:',level);
        this.clearAll();
        spatialManager.resetAll();
        this.init(level);
    },

    clearAll: function () {
        for (var c = 0; c < this._categories.length; ++c) {
            this._categories[c].length = 0;
        }
		this._isChangingLevel = true;
    },

// ---------------------
// Player entity methods
	
    createProtagonist: function (descr) {
        if (descr === undefined) {
            descr = {cx : g_canvas.width/2, cy : g_canvas.height/2};
        }
        this._protagonists.push(new Protagonist(descr));
    },

    createFamily: function () {
		var playerSafeDist = 120;
		var descr = this.findSpawn(playerSafeDist);
        this._family.push(new Family(descr));
    },
	
	fire: function (aimX, aimY) {
		if (this._bulletDU < this._bulletDuDelay) {
			this._bulletDU++;
			return;
		}
		
		for (var i in this._protagonists) {
			
            var pos = this._protagonists[i].getPos();
            var dirn = util.angleTo(pos.posX, pos.posY, aimX, aimY);
            var launchdist = this._protagonists[i].getRadius() * 0.8;
            
            var dirnX = Math.cos(dirn);
            var dirnY = Math.sin(dirn);
            
            this.fireBullet(pos.posX + launchdist * dirnX, 
                            pos.posY + launchdist * dirnY, 
                            dirnX, 
                            dirnY
			);
		}
	},
	
	fireBullet: function(cx, cy, dirnX, dirnY) {
		this._bulletDU = 0;
		this._bullets.push(new Bullet({
			cx   : cx,
			cy   : cy,
			dirnX : dirnX,
			dirnY : dirnY
		}));
	},
	
	fireReset: function() {
		this._bulletDU = this._bulletDuDelay;
	},
	
// --------------------
// Enemy entity methods
	
	findProtagonist: function () {
		var p = Math.floor(util.randRange(
					0, 
					this._protagonists.length)
		);
		return this._protagonists[p];
	},

    findClosestFamilyMember: function (posX, posY) {
        var closest = null;
        var minDistSq = Infinity;
        for (var i = 0; i < this._family.length; i++) {
            var member = this._family[i];
            var distSq = util.distSq(posX, posY,member.cx,member.cy);
            if (distSq < minDistSq) {
                closest = member;
                minDistSq = distSq;
            }
        }
        return closest;
    },
	
	findSpawn: function (playerSafeDist) {
		for (var i = 0; i < 100; i++) {
            var x = util.randRange(0, g_canvas.width);
            var y = util.randRange(0, g_canvas.height);
			
			var locationFound = true;
			
			for (var i in this._protagonists) {
				var pPos = this._protagonists[i].getPos();
				var distSq = util.distSq(x, y, pPos.posX, pPos.posY);
				if (distSq < util.square(playerSafeDist))
					locationFound = false;
			}
			
			if (!locationFound) continue;
			
            return {
                cx: x,
                cy: y
            };
        }
	},

    createGrunt: function () {
        var playerSafeDist = 120;
		var descr = this.findSpawn(playerSafeDist);
        this._enemies.push(new Grunt(descr));
    },

    createHulk: function () {
        var playerSafeDist = 120;
		var descr = this.findSpawn(playerSafeDist);
        this._invincibles.push(new Hulk(descr));
    },

    createBrain: function () {
        var playerSafeDist = 120;
		var descr = this.findSpawn(playerSafeDist);
        this._enemies.push(new Brain(descr));
    },

    fireCruiseMissile: function (cx,cy) {
        this._enemies.push(new CruiseMissile({cx: cx, cy: cy}));
    },

    createScoreImg: function (descr) {
        this._scoreImgs.push(new ScoreImg(descr));
    },

    createElectrode: function() {
        var playerSafeDist = 120;
        var descr = this.findSpawn(playerSafeDist);
        this._enemies.push(new Electrode(descr))
    },

// --------------------
// Update & Render
	
    update: function (du) {

        if (this._isChangingLevel) return this._changingTimer -= du;
		
		this._bulletDU += du;
		
		for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];
            var i = 0;

            while (i < aCategory.length) {

                var status = aCategory[i].update(du);

                if (status === this.KILL_ME_NOW) {
                    // remove the dead guy, and shuffle the others down to
                    // prevent a confusing gap from appearing in the array
                    aCategory.splice(i, 1);
                }
                else {
                    ++i;
                }
            }
		}
		this._isFinished();
    },

    render: function (ctx) {

        if (this._isChangingLevel) return this._changeLevel(ctx);
		
		var debugX = 10, debugY = 100;

        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];

            for (var i = 0; i < aCategory.length; ++i) {

                aCategory[i].render(ctx);

            }
            debugY += 10;
        }
    }

};

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

