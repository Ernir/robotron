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

    this.sprite = g_sprites.Spark;

    this.baseVel = 5;
    this.velX = this.baseVel * Math.cos(descr.initialAngle);
    this.velY = this.baseVel * Math.sin(descr.initialAngle);
}

Spark.prototype = new Entity();
Spark.prototype.lifeSpan = 5 * SECS_TO_NOMINALS;

Spark.prototype.update = function (du) {
    spatialManager.unregister(this);

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
    var topWallIntersect = cy + velY < consts.wallTop + r;
    var bottomWallIntersect = cy + velY > consts.wallBottom - r;

    var newVelX = velX;
    var newVelY = velY;

    if (leftWallIntersect || rightWallIntersect) { // LR borders
        newVelX = 0;
        newVelY = util.sign(velY) * baseVel;
    }
    if (topWallIntersect || bottomWallIntersect) { // TB borders
        newVelX = util.sign(velX) * baseVel;
        newVelY = 0;
    }

    this.velX = newVelX;
    this.velY = newVelY;
};

Spark.prototype.takeBulletHit = function () {
    this.kill();
    Player.addScore(Player.scoreValues.Spark * Player.getMultiplier());
};

Spark.prototype.getRadius = function () {
    return 6;
};

Spark.prototype.render = function (ctx) {
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
};