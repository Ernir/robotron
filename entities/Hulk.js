// ======
// Hulk
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object

function Hulk(descr) {
    Enemy.call(this, descr);

    this.sprite = g_sprites.hulk;
    this.target = entityManager.findProtagonist();
    this.xInaccuracy = util.randRange(-50,50);
    this.yInaccuracy = util.randRange(-50,50);
}

Hulk.prototype = Object.create(Enemy.prototype);
Hulk.prototype.timeSinceHit = Infinity;
Hulk.prototype.panic = 1;

Hulk.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    this.seekTarget();

    // Move, unless the Hulk has been shot in the last 1 second.
    this.timeSinceHit += du;
    if (this.timeSinceHit > SECS_TO_NOMINALS * 1) {
        this.cx += this.velX * du;
        this.cy += this.velY * du;
        this.capPositions();
    }

    spatialManager.register(this);
};

Hulk.prototype.seekTarget = function () {
    // Hulks don't quite aim on target.
    var xOffset = this.target.cx - this.cx + this.xInaccuracy;
    var yOffset = this.target.cy - this.cy + this.yInaccuracy;

    this.velX = 0;
    if (xOffset > 0) {
        this.velX = 1;
    } else if (xOffset < 0) {
        this.velX = -1;
    }

    this.velY = 0;
    if (yOffset > 0) {
        this.velY = 1;
    } else if (yOffset < 0) {
        this.velY = -1;
    }

    // Clamp vel to 1 pixel moving radius
    if (xOffset !== 0 && yOffset !== 0) {
        this.velX *= Math.cos(Math.PI / 4);
        this.velY *= Math.sin(Math.PI / 4);
    }
};

Hulk.prototype.takeBulletHit = function () {
    // Hulks can't be killed. Shooting stuns them.
    this.timeSinceHit = 0;
};
