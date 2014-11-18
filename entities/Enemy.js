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
            entityManager.createPowerup(this.cx, this.cy);
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
Enemy.prototype.spawnTime = SECS_TO_NOMINALS / 2;
Enemy.prototype.spawnTimeElapsed = 0;

Enemy.prototype.makeWarpParticles = function () {

    for (var i = 0; i < this.colors.length; i++) {
        var colorDefinition = this.colors[i];
        var numberOfParticles = colorDefinition.ratio * this.getNumberOfParticles();
        for (var j = 0; j < numberOfParticles; j++) {
            var direction = util.randRange(0, Math.PI * 2);
            var speed = util.randRange(0, 2);
            var distance = speed * Particle.prototype.lifeSpan;

            var particle = {
                dirn: direction,
                speed: -speed,
                cx: this.cx + distance * Math.cos(direction),
                cy: this.cy + distance * Math.sin(direction),
                color: colorDefinition.color,
                radius: 1
            };
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
        var numberOfParticles = colorDefinition.ratio * this.getNumberOfParticles();
        for (var j = 0; j < numberOfParticles; j++) {
            var particle = {
                dirn: util.randRange(0, Math.PI * 2),
                speed: util.randRange(0, 4),
                cx: this.cx,
                cy: this.cy,
                color: colorDefinition.color,
                radius: 1
            };
            entityManager.createParticle(particle);
        }
    }
};

Enemy.prototype.getNumberOfParticles = function () {
    var maxNumParticlesOnScreen = 4000;
    var maxNumParticles = 200;
    var minNumParticles = 20;

    var numEntities = levelManager.numberOfEntities;
    var numParticles = maxNumParticlesOnScreen / numEntities;

    // Capping
    var numParticles = Math.max(numParticles, minNumParticles);
    var numParticles = Math.min(numParticles, maxNumParticles);

    return numParticles;
};