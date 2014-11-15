// ======
// Enforcer sparks
// ======

// Sparks are fired by tanks.
// They move fast.
// When they hit a wall, they slide alongside it.

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Spark(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = g_sprites.EnforcerSpark[0];
	
	// HACKED-IN AUDIO (no preloading)
	this.fireSound = new Audio(g_audioUrls.spark);

	// Make a noise when I am created (i.e. fired)
    if (g_sounds) this.fireSound.play();

    this.baseVel = 5;
    this.velX = this.baseVel * Math.cos(descr.initialAngle);
    this.velY = this.baseVel * Math.sin(descr.initialAngle);
}

Spark.prototype = new Entity();
Spark.prototype.lifeSpan = 5 * SECS_TO_NOMINALS;
Spark.prototype.rotationTime = SECS_TO_NOMINALS / 2;

Spark.prototype.update = function (du) {
    spatialManager.unregister(this);

    this.animation += du;
    if (this.animation > this.rotationTime) this.animation = 0;

    // Handle death
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

    // Update positions
    this.capPositions();
    this.edgeHug();

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

Spark.prototype.edgeHug = function () {

    var velX = this.velX;
    var velY = this.velY;
    var cx = this.cx;
    var cy = this.cy;
    var r = this.getRadius();
    var baseVel = this.baseVel;

    var rightWallIntersect = cx + velX > consts.wallRight - r;
    var leftWallIntersect = cx + velX < consts.wallLeft + r;
    var topWallIntersect = cy + velY < consts.wallTop + consts.wallThickness + r;
    var bottomWallIntersect = cy + velY > consts.wallBottom - r;

    if (leftWallIntersect || rightWallIntersect) { // LR borders
        this.velX = 0;
        this.velY = util.sign(velY) * baseVel;
    }
    if (topWallIntersect || bottomWallIntersect) { // TB borders
        this.velX = util.sign(velX) * baseVel;
        this.velY = 0;
    }

    // Literal corner cases below. //TODO: handle all of them, and refactor.
    // Note: A velocity component shouldn't be exactly 0 unless the spark had been
    //       sliding against a wall.
    if (topWallIntersect && this.velX === 0) {
        this.velX = baseVel;
        this.velY = 0;
    }
    if (rightWallIntersect && this.velY === 0) {
        this.velX = 0;
        this.velY = baseVel;
    }
    if (bottomWallIntersect && this.velX === 0) {
        this.velX = -baseVel;
        this.velY = 0;
    }
    if (leftWallIntersect && this.velY === 0) {
        this.velX = 0;
        this.velY = -baseVel;
    }


//    var absVelX = util.abs(newVelX); // Only concerned with edges here
//    var absVelY = util.abs(newVelY);
//    if (topWallIntersect && leftWallIntersect) { // TL corner
//        if (absVelX > absVelY) {
//            // Travel down
//            newVelX = 0;
//            newVelY = baseVel;
//        } else {
//            // Travel right
//            newVelX = baseVel;
//            newVelY = 0;
//        }
//    }
//
//    if (topWallIntersect && rightWallIntersect) { // TR corner
//        if (absVelX > absVelY) {
//            // Travel down
//            newVelX = 0;
//            newVelY = baseVel;
//        } else {
//            // Travel left
//            newVelX = -baseVel;
//            newVelY = 0;
//        }
//    }
//
//    if (rightWallIntersect && bottomWallIntersect) { // BR corner
//        if (absVelX > absVelY) {
//            // Travel up
//            newVelX = 0;
//            newVelY = -baseVel;
//        } else {
//            // Travel left
//            newVelX = -baseVel;
//            newVelY = 0;
//        }
//    }
//
//    if (bottomWallIntersect && leftWallIntersect) { // BL corner
//        if (absVelX > absVelY) {
//            // Travel up
//            newVelX = 0;
//            newVelY = -baseVel;
//        } else {
//            // Travel right
//            newVelX = baseVel;
//            newVelY = 0;
//        }
//    }
//
//    this.velX = newVelX;
//    this.velY = newVelY;
};

Spark.prototype.takeBulletHit = function () {
    this.kill();
    Player.addScore(Player.scoreValues.Spark * Player.getMultiplier());
};

Spark.prototype.getRadius = function () {
    return 6;
};

Spark.prototype.render = function (ctx) {
    var temp = Math.floor(4 * this.animation / this.rotationTime);
    if (temp > 3) temp = 0;
    g_sprites.EnforcerSpark[temp].drawCentredAt(ctx, this.cx, this.cy, 0);
};