// ======
// Cruise Missile
// ======

// Cruise missiles are periodically fired by Brains

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function CruiseMissile(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
	
	// HACKED-IN AUDIO (no preloading)
	this.bombSound = new Audio(g_audioUrls.explosion);

    this.target = entityManager.findProtagonist();
}



CruiseMissile.prototype = new Entity();
CruiseMissile.prototype.lifeSpan = 5 * SECS_TO_NOMINALS;
CruiseMissile.prototype.baseVel = 2;
CruiseMissile.prototype.exploded = false;

CruiseMissile.prototype.update = function (du) {

    spatialManager.unregister(this);
	
	// Handle death
	if (this.target === null || this.target === undefined) {
        this._isDeadNow = true;
    }
	
    if(this._isDeadNow) {
        this.spawnFragment(12);
        if (g_sounds) this.bombSound.play();    
        return entityManager.KILL_ME_NOW;
    }
    
    this.lifeSpan -= du;
    if (this.lifeSpan < 0) {
        this.spawnFragment(12);
        if (g_sounds) this.bombSound.play();
        return entityManager.KILL_ME_NOW;
    }
	
	// Update positions
    this.seekTarget();
	
	this.cx += this.velX * du;
    this.cy += this.velY * du;

    // Handle collisions
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeEnemyHit;
        if (canTakeHit) {
            canTakeHit.call(hitEntity);
            this.spawnFragment(12);
            if (g_sounds) this.bombSound.play();
            return entityManager.KILL_ME_NOW;
        }
    }

    spatialManager.register(this);
};

CruiseMissile.prototype.seekTarget = function () {
    var xOffset = this.target.cx - this.cx;
    var yOffset = this.target.cy - this.cy;

    this.velX = 0;
    if (xOffset > 0) {
        this.velX = this.baseVel;
    } else if (xOffset < 0) {
        this.velX = -this.baseVel;
    }

    this.velY = 0;
    if (yOffset > 0) {
        this.velY = this.baseVel;
    } else if (yOffset < 0) {
        this.velY = -this.baseVel;
    }

    // Clamp velocity to the radius of this.baseVel
	if (this.velX !== 0 && this.velY !== 0) {
		this.velX *= Math.cos(Math.PI / 4);
		this.velY *= Math.sin(Math.PI / 4);
	}
};

CruiseMissile.prototype.takeBulletHit = function () {
    this.kill();
    Player.addScore(Player.scoreValues.CruiseMissile * Player.getMultiplier());
};

CruiseMissile.prototype.getRadius = function () {
    return 4;
};

CruiseMissile.prototype.render = function (ctx) {
    ctx.save();
    var bombThresh = CruiseMissile.prototype.lifeSpan / 15;
    ctx.fillStyle = "grey";
    util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
    var descr = {
        cx: this.cx,
        cy: this.cy,
        color: 0
        };
    entityManager.createParticle(descr);
    ctx.restore();
};