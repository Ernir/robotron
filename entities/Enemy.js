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
    if (this._isDeadNow === false) {
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
