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

CruiseMissile.prototype = new Entity();
CruiseMissile.prototype.lifeSpan = 5 * SECS_TO_NOMINALS;
CruiseMissile.prototype.killProtagonist = false; //

CruiseMissile.prototype.update = function (du) {

    if (this.target === null || this.target === undefined) {
        this._isDeadNow = true;
    }

    this.lifeSpan += -du;
    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow || this.lifeSpan < 0) {
        return entityManager.KILL_ME_NOW;
    }
    this.seekTarget();

    // Handle collisions
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeEnemyHit;
        console.log(canTakeHit);
        if (canTakeHit) {
            canTakeHit.call(hitEntity);
            return entityManager.KILL_ME_NOW;
        }
    }

    this.cx += this.velX * du;
    this.cy += this.velY * du;
    this.capPositions();

    spatialManager.register(this);
};

CruiseMissile.prototype.seekTarget = function () {
    var xOffset = this.target.cx - this.cx;
    var yOffset = this.target.cy - this.cy;

    this.velX = 0;
    if (xOffset > 0) {
        this.velX = 2;
    } else if (xOffset < 0) {
        this.velX = -2;
    }

    this.velY = 0;
    if (yOffset > 0) {
        this.velY = 2;
    } else if (yOffset < 0) {
        this.velY = -2;
    }

    // TODO: Clamp velocity
};

//CruiseMissile.prototype.takeProtagonistHit = function () {
//    this.kill();
//    //TODO: drepa CM þegar hún lendir á Protagonist
//    //(virkar ekki alveg svona samt)
//};

CruiseMissile.prototype.takeBulletHit = function () {
    this.kill();
    Player.addScore(Player.scoreValues.CM * Player.getMultiplier()); // TODO remove magic number
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