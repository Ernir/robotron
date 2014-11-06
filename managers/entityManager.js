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
	_bullets: [],
    _scoreImgs: [],
	
	_bulletDU: 0,
	_bulletDuDelay: 20,

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
	
	_doOrDie: function () {
		// TODO: DIE if you gots no life! ;D
		if (Player.getLives() === 0)
			return //main.gameOver(); //The program shouldn't quit just because you lost the game!
		
		// TODO: DO level up if enemies is empty
		// Need to somehow distinguish between
		// "undead" and killable enemies.
		// Like separate categories?
	},
	
	_clearLevel: function () {
		for (var c = 0; c < this._categories.length; ++c) {
            this._categories[c] = [];
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
            this._scoreImgs
		];
    },

    init: function () {

        var level1 = [ // TODO create more levels and place them somewhere nice
            { n : 1, f : this.createProtagonist },
            { n : 10, f : this.createGrunt },
            { n : 1, f : this.createHulk },
            { n : 1, f : this.createBrain },
            { n : 6, f : this.createFamily }
        ];

        this._startLevel(level1);
    },

    restartGame: function () {
        //TODO: this properly :p
        //TODO: add sound?
        this._protagonists.length=0;
        this._family.length=0;
        this._enemies.length=0;
        this._bullets.length=0;
        this._scoreImgs.length=0;
        this.init();
        spatialManager.resetAll();
        Player.resetAll();
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
        this._enemies.push(new Hulk(descr));
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

// --------------------
// Update & Render
	
    update: function (du) {

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
		this._doOrDie();
    },

    render: function (ctx) {

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

