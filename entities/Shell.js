// ======
// Tank Shells
// ======

// Tank shells are fired by tanks.
// They move fast and bounce off the edges.

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Shell(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);

    this.baseVel = 5;
    this.velX = this.baseVel*Math.cos(descr.initialAngle);
    this.velY = this.baseVel*Math.sin(descr.initialAngle);
}

Shell.prototype = new Entity();
Shell.prototype.lifeSpan = 5 * SECS_TO_NOMINALS;

Shell.prototype.update = function (du) {
    spatialManager.unregister(this);
	
	// Handle death
    if(this._isDeadNow) return entityManager.KILL_ME_NOW;
    
    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;
	
	// Update positions
    this.capPositions();
    this.edgeBounce();
	
	this.cx += this.velX * du;
    this.cy += this.velY * du;

    // Handle collisions
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeEnemyHit;
        if (canTakeHit) {
            canTakeHit.call(hitEntity);
            return entityManager.KILL_ME_NOW;
        }
    }

    spatialManager.register(this);
};

Shell.prototype.takeBulletHit = function () {
    this.kill();
    Player.addScore(Player.scoreValues.Shell * Player.getMultiplier());
};

Shell.prototype.getRadius = function () {
    return 6;
};

Shell.prototype.render = function (ctx) {
    ctx.save();
    var fadeThresh = CruiseMissile.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }
    ctx.fillStyle = "cyan";
    util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
    ctx.restore();
};