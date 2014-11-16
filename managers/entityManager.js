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
    _ignoredEnemies: [],
    _spawnedEnemies: [],
	_bullets: [],
    _scoreImgs: [],
    _drops: [],
    _particles: [],
	
	_bulletDU: 0,
    _reload: false,

// "PRIVATE" METHODS

    // Accepts an array of objects {n : [number], f : [function]}.
    // Calls each [function] number [times].
    _fillCategories: function (levelDescription) {
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
            this._spawnedEnemies,
			this._drops,
			this._protagonists, 
            this._particles,
			this._family, 
			this._enemies,
            this._ignoredEnemies,
            this._bullets, 
            this._scoreImgs
		];
    },

    init: function (level) {
        
        var descr = [
            { n : 1, f : this.createProtagonist },
            { n : 0, f : this.createFamily },
            { n : 0, f : this.createElectrode },
            { n : 0, f : this.createGrunt },
            { n : 0, f : this.createHulk },
            { n : 0, f : this.createSpheroid },
            { n : 0, f : this.createBrain },
            { n : 0, f : this.createQuark }
        ];

        for (var i = 0; i < level.length; i++) {
            descr[i+1].n =level[i];
        };

        this._fillCategories(descr);
    },

    resetPos: function () {
        for (var c = 2; c < this._categories.length; ++c) {
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
    },

    clearPartial: function () {
        for (var i = 0; i < this._bullets.length; i++) {
            spatialManager.unregister(this._bullets[i]);
        }
        this._bullets.length = 0;
        for (var i = 0; i < this._spawnedEnemies.length; i++) {
            spatialManager.unregister(this._spawnedEnemies[i]);
        }
        this._spawnedEnemies.length = 0;
        this._scoreImgs.length = 0;
        this._particles.length = 0;
        for (var i = 0; i < this._enemies.length; i++) {
            var unit = this._enemies[i];
            if (unit.resetRage) unit.resetRage();
        }
    },

    enemiesIsEmpty: function () {
        if (this._enemies.length === 0 &&
            this._spawnedEnemies.length === 0)
            return true;
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
        descr.person = Math.floor(Math.random()*3);
        this._family.push(new Family(descr));
    },
	
	fire: function (aimX, aimY) {
		if (this._bulletDU < Player.fireRate) {
			this._bulletDU++;
			return;
		}
		
		for (var i in this._protagonists) {
			
            var launchdist = this._protagonists[i].getRadius() * 0.8;
            var pos = this._protagonists[i].getPos();

            var shots = 1;
            if (Player.hasShotgun) shots = 7;
            
            for (var j = 0; j < shots; j++) {
                
                var dirn = util.angleTo(pos.posX, pos.posY, aimX, aimY);
                var scatter = 0;
                if (Player.hasShotgun) scatter = (Math.random()-0.5)/3;
                dirn += scatter;
                var dirnX = Math.cos(dirn);
                var dirnY = Math.sin(dirn);
                
                this.fireBullet(pos.posX + launchdist * dirnX, 
                                pos.posY + launchdist * dirnY, 
                                dirnX, 
                                dirnY
    			);
            }
		}
        if (Player.hasShotgun) this._reload = true;
	},
	
	fireBullet: function(cx, cy, dirnX, dirnY) {
		this._bulletDU = 0;
		this._bullets.push(new Bullet({
			cx   : cx,
			cy   : cy,
			dirnX : dirnX,
			dirnY : dirnY
		}));
        Player.subtractAmmo();
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
	
	createScoreImg: function (descr) {
        this._scoreImgs.push(new ScoreImg(descr));
    },
	
	createPowerup: function (cx,cy) {
        var brand = Math.floor(Math.random()*6);
        this._drops.push(new Powerup({cx: cx, 
                                      cy: cy, 
                                      brand: brand
                                      }));
    },

    createGrunt: function () {
        var playerSafeDist = 120;
		var descr = this.findSpawn(playerSafeDist);
        this._enemies.push(new Grunt(descr));
    },

    createHulk: function () {
        var playerSafeDist = 120;
		var descr = this.findSpawn(playerSafeDist);
        this._ignoredEnemies.push(new Hulk(descr));
    },

    createBrain: function () {
        var playerSafeDist = 120;
		var descr = this.findSpawn(playerSafeDist);
        this._enemies.push(new Brain(descr));
    },

    createElectrode: function () {
        var playerSafeDist = 120;
        var descr = this.findSpawn(playerSafeDist);
        descr.shapes = Math.floor(Math.random()*7);
        this._ignoredEnemies.push(new Electrode(descr));
    },
    
	createProg: function (cx,cy) {
        this._spawnedEnemies.push(new Prog({cx: cx, cy: cy}));
    },

    createQuark: function() {
        var playerSafeDist = 120;
        var descr = this.findSpawn(playerSafeDist);
        this._enemies.push(new Quark(descr));
    },

    createTank: function(cx,cy) {
        this._spawnedEnemies.push(new Tank({cx: cx, cy: cy}));
    },    

    createSpheroid: function () {
        var playerSafeDist = 120;
        var descr = this.findSpawn(playerSafeDist);
        this._enemies.push(new Spheroid(descr));
    },

    createEnforcer: function (cx, cy) {
        this._spawnedEnemies.push(new Enforcer({cx: cx, cy: cy}));
    },
	
	fireCruiseMissile: function (cx,cy) {
        this._bullets.push(new CruiseMissile({cx: cx, cy: cy}));
    },
	
	fireShell: function (cx, cy, angle) {
        this._bullets.push(new Shell({cx: cx, cy: cy, initialAngle: angle}));
    },

    fireSpark: function (cx, cy, angle) {
        this._bullets.push(new Spark({cx: cx, cy: cy, initialAngle: angle}));
    },

// ------------------------
// Particle effects methods

    createCMTrail: function (cx, cy) {
        this._particles.push(new CMTrail({cx: cx, cy: cy}));
    },

    createParticle: function (descr) {
        this._particles.push(new Particle(descr));
    },

// --------------------
// Update & Render
	
    update: function (du) {

		this._bulletDU += du;
		
        if (this._reload && this._bulletDU > Player.fireRate / 4) {
                var gunSound = new Audio(g_audioUrls.shotgunReload);
                gunSound.play();
                this._reload = false;
        }

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
    },

    render: function (ctx) {

        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];

            for (var i = 0; i < aCategory.length; ++i) {

                aCategory[i].render(ctx);

            }
        }
    }

};

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

