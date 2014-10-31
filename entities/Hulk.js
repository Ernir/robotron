// ======
// Hulk
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object

function Hulk(descr) {
    // TODO: Make the Hulk and Grunt both inherit from a basic "Enemy"
    Grunt.call(this, descr);

    this.sprite = g_sprites.hulk;
    this.target = entityManager.findProtagonist();
}

Hulk.prototype = Object.create(Grunt.prototype);

Hulk.prototype.timeSinceHit = Infinity;

Hulk.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    this.seekTarget();

    // Move, unless the Hulk has been shot in the last 1 second.
    this.timeSinceHit += du;
    if (this.timeSinceHit > SECS_TO_NOMINALS*1) {
        this.cx += this.velX * du;
        this.cy += this.velY * du;
        this.capPositions();
    }

    spatialManager.register(this);
};

Hulk.prototype.takeBulletHit = function () {
    // Hulks can't be killed. Shooting stuns them.
    this.timeSinceHit = 0;
    // TODO: Add score
};
