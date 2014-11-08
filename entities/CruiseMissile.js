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

    this.target = entityManager.findProtagonist();
}

CruiseMissile.prototype = Object.create(Enemy.prototype);
CruiseMissile.prototype.lifeSpan = 5 * SECS_TO_NOMINALS;
CruiseMissile.prototype.baseVel = 2;

CruiseMissile.prototype.update = function (du) {

    spatialManager.unregister(this);
	
	// Handle death
	if (this.target === null || this.target === undefined) {
        this._isDeadNow = true;
    }
	
    if(this._isDeadNow) return entityManager.KILL_ME_NOW;
    
    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;
	
	// Update positions
    this.seekTarget();
	
	this.cx += this.velX * du;
    this.cy += this.velY * du;

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
    Player.addScore(Player.scoreValues.CM * Player.getMultiplier());
};

CruiseMissile.prototype.getRadius = function () {
    return 4;
};

CruiseMissile.prototype.render = function (ctx) {
    ctx.save();
    var fadeThresh = CruiseMissile.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }
    ctx.fillStyle = "green";
    util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
    ctx.restore();
};