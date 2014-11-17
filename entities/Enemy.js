// ======
// Enemy
// ======

// Object containing the logic common to all enemies.

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Enemy(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = g_sprites.Grunt[0];
    this.target = entityManager.findProtagonist();
}

Enemy.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Enemy.prototype.explode = new Audio(g_audioUrls.explode);

// Initial, inheritable, default values
Enemy.prototype.killProtagonist = true;
Enemy.prototype.rotation = 0;
Enemy.prototype.velX = 0;
Enemy.prototype.velY = 0;
Enemy.prototype.dropChance = 0.05; // All enemies have at least a 5% chance 
                                   // to drop a powerup

Enemy.prototype.kill = function () {
    if (!this._isDeadNow) {
        var result = Math.random();
        if (this.dropChance > result) {
            entityManager.createPowerup(this.cx,this.cy);
        }
    }

    this._isDeadNow = true;
	this.explode.currentTime = 0;
	if (g_sounds) this.explode.play();
};

Enemy.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Enemy.prototype.render = function (ctx) {

    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};



// Shared defaults, used by enemies that warp in
Enemy.prototype.isSpawning = true;
Enemy.prototype.spawnTimeElapsed = 0;

Enemy.prototype.makeWarpParticles = function () {
    // TODO: Refactor this monster

    if (this.colors === undefined || this.totalParticles === undefined) {
        return; // We don't do anything if the entity doesn't support particles
    }

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
            var particle = new WarpParticle({
                offX: xOffset,
                offY: yOffset,
                velX: xVelocity,
                velY: yVelocity,
                x : this.cx,
                y: this.cy,
                color: colorDefinition.color,
                isExploding: false
            });
            entityManager.createParticle(particle);
        }
    }
};

Enemy.prototype.warpIn = function (du) {
    this.spawnTimeElapsed += du;
    if (this.spawnTimeElapsed > this.spawnTime) {
        this.isSpawning = false;
    }
};

Enemy.prototype.makeExplosion = function () {

    for (var i = 0; i < this.colors.length; i++) {
        var colorDefinition = this.colors[i];
        var numberOfParticles = colorDefinition.ratio * this.totalParticles;
        for (var j = 0; j < numberOfParticles; j++) {
            var particle = {
                offX: 0,
                offY: 0,
                velX: util.randRange(-2, 2),
                velY: util.randRange(-2, 2),
                x: this.cx,
                y: this.cy,
                color: colorDefinition.color,
                isExploding: true
            };
            entityManager.createWarpParticle(particle);
        }
    }
};