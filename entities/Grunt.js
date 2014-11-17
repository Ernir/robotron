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
    this.makeParticles();
}

Grunt.prototype = Object.create(Enemy.prototype);
Grunt.prototype.renderPos = {cx: this.cx, cy: this.cy};
Grunt.prototype.stepsize = 3;
Grunt.prototype.baseSpeed = 1;
Grunt.prototype.speed = 1;
Grunt.prototype.maxSpeed = 3;
Grunt.prototype.maxRageReachedTime = 40 * SECS_TO_NOMINALS;

Grunt.prototype.isDying = false;
Grunt.prototype.isSpawning = true;
Grunt.prototype.spawnTime = 1 * SECS_TO_NOMINALS;
Grunt.prototype.deathTime = 1 * SECS_TO_NOMINALS;
Grunt.prototype.spawnTimeElapsed = 0;
Grunt.prototype.deathTimeElapsed = 0;

Grunt.prototype.update = function (du) {

    spatialManager.unregister(this);

    if (!this.startPos) this.startPos = this.getPos();

    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    if (this.isSpawning) {
        this.warpIn(du);
    } else if (this.isDying) {
        this.explodeOut(du);
    } else {

        this.rage(du);
        this.seekTarget();

        this.cx += this.velX * du;
        this.cy += this.velY * du;
        this.capPositions();
    }

    if (!this.isDying) {
        spatialManager.register(this);
    }
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
    this.isDying = true;
    Player.addScore(Player.scoreValues.Grunt * Player.getMultiplier());
};
Grunt.prototype.takeElectrodeHit = function () {
    this.takeBulletHit();
};

Grunt.prototype.render = function (ctx) {
    if (this.isSpawning || this.isDying) {
        this.renderParticles(ctx, this.cx, this.cy);
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
Grunt.prototype.totalParticles = 200;

Grunt.prototype.makeParticles = function () {
    // TODO: Refactor this monster
    this.particles = [];

    var spawnRange = this.getRadius() * 10;
    var inaccuracy = this.getRadius() * 0.6;

    for (var i = 0; i < this.colors.length; i++) {
        var colorDefinition = this.colors[i];
        var numberOfParticles = colorDefinition.ratio * this.totalParticles;
        for (var j = 0; j < numberOfParticles; j++) {

            var longSign = util.randSign();
            var shortSign = util.randSign();
            var longAxisOffset = longSign * util.randRange(0, spawnRange);
            var shortAxisOffset = shortSign * util.randRange(0, inaccuracy);

            var xOffset, yOffset, xVelocity, yVelocity;
            var isOnXAxis = Math.random() < 0.5;
            if (isOnXAxis) {
                xOffset = longAxisOffset;
                xVelocity = -longSign * 0.2;
                yVelocity = 0;
                yOffset = shortAxisOffset;
            } else {
                xOffset = shortAxisOffset;
                xVelocity = 0;
                yVelocity = -longSign * 0.2;
                yOffset = longAxisOffset;
            }
            this.particles.push(new WarpParticle({
                offX: xOffset,
                offY: yOffset,
                velX: xVelocity,
                velY: yVelocity,
                color: colorDefinition.color
            }));
        }
    }
};

Grunt.prototype.warpIn = function (du) {
    this.spawnTimeElapsed += du;
    if (this.spawnTimeElapsed <= this.spawnTime) {
        this.updateParticles(du);
    } else {
        this.isSpawning = false;
    }
};

Grunt.prototype.explodeOut = function (du) {

    if (!this.hasStartedDying) {
        this.startDying();
        this.expelParticles(du);
    }

    this.deathTimeElapsed += du;
    if(this.deathTimeElapsed <= this.deathTime) {
        this.updateParticles(du);
    } else {
        this.killImmediately();
        this.isDying = false;
    }
};

Grunt.prototype.expelParticles = function () {
    for (var i = 0; i < this.particles.length; i++) {
        var particle = this.particles[i];
        particle.offX = 0;
        particle.offY = 0;
        particle.velX = util.randRange(-2,2);
        particle.velY = util.randRange(-2,2);
    }
};

Grunt.prototype.updateParticles = function (du) {
    for (var i = 0; i < this.particles.length; i++) {
        var particle = this.particles[i];
        particle.update(du,this.isDying);
    }
};

Grunt.prototype.renderParticles = function (ctx) {
    for (var i = 0; i < this.particles.length; i++) {
        var particle = this.particles[i];
        particle.render(ctx, this.cx, this.cy);
    }
};