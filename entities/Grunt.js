// ======
// Grunt
// ======

// Grunts are simple robotrons that walk straight towards the main character
// Grunts rage, getting faster over time

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Grunt(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Grunt[0];
    this.target = entityManager.findProtagonist();
    this.makeWarpParticles();
}

Grunt.prototype = Object.create(Enemy.prototype);
Grunt.prototype.renderPos = {cx: this.cx, cy: this.cy};
Grunt.prototype.stepsize = 3;
Grunt.prototype.baseSpeed = 1;
Grunt.prototype.speed = 1;
Grunt.prototype.maxSpeed = 3;
Grunt.prototype.maxRageReachedTime = 40 * SECS_TO_NOMINALS;

Grunt.prototype.update = function (du) {

    spatialManager.unregister(this);

    if (!this.startPos) this.startPos = this.getPos();

    // Handle death
    if (this._isDeadNow) {
        Player.addScore(Player.scoreValues.Grunt * Player.getMultiplier());
        return entityManager.KILL_ME_NOW;
    }

    if (this.isSpawning) {
        this.warpIn(du);
    } else {

        this.rage(du);
        this.seekTarget();

        this.cx += this.velX * du;
        this.cy += this.velY * du;
        this.capPositions();
    }
    spatialManager.register(this);

};

Grunt.prototype.seekTarget = function () {
    var xOffset = this.target.cx - this.cx;
    var yOffset = this.target.cy - this.cy;

    this.velX = 0;
    if (xOffset > 0) {
        this.velX = this.speed;
    } else if (xOffset < 0) {
        this.velX = -this.speed;
    }

    this.velY = 0;
    if (yOffset > 0) {
        this.velY = this.speed;
    } else if (yOffset < 0) {
        this.velY = -this.speed;
    }

    // Clamp vel
    if (xOffset !== 0 && yOffset !== 0) {
        this.velX *= this.speed * Math.cos(Math.PI / 4);
        this.velY *= this.speed * Math.sin(Math.PI / 4);
    }
};

// Increases the grunt's speed over time.
Grunt.prototype.rage = function (du) {
    var timeFraction = du / this.maxRageReachedTime;
    this.speed += (this.maxSpeed - this.baseSpeed) * timeFraction;
    this.speed = Math.min(this.speed, this.maxSpeed);
};

Grunt.prototype.resetRage = function () {
    this.speed = this.baseSpeed;
};

Grunt.prototype.takeBulletHit = function () {
    this.kill();
    this.makeExplosion();
};
Grunt.prototype.takeElectrodeHit = function () {
    this.takeBulletHit();
};

Grunt.prototype.render = function (ctx) {
    if (this.isSpawning) {
        return;
    }
    var distSq = util.distSq(this.cx, this.cy, this.renderPos.cx, this.renderPos.cy);
    switch (true) {
        case distSq < util.square(this.stepsize):
            g_sprites.Grunt[0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq < util.square(this.stepsize * 2):
            g_sprites.Grunt[1].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq < util.square(this.stepsize * 3):
            g_sprites.Grunt[0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq < util.square(this.stepsize * 4):
            g_sprites.Grunt[2].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        default:
            this.renderPos = {cx: this.cx, cy: this.cy};
            g_sprites.Grunt[0].drawCentredAt(ctx, this.cx, this.cy, 0);
    }
};


Grunt.prototype.colors = [
    {color: "red", ratio: 0.70},
    {color: "yellow", ratio: 0.15},
    {color: "#800080", ratio: 0.05},
    {color: "#00FF00", ratio: 0.05},
    {color: "white", ratio: 0.05}
];
Grunt.prototype.spawnTime = 0.9 * SECS_TO_NOMINALS;
Grunt.prototype.totalParticles = 200;

