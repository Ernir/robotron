// ====
// Hulk
// ====

// Hulks are indestructible robotrons that chase members of the last human
// family.

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object

function Hulk(descr) {
    Enemy.call(this, descr);

    this.sprite = g_sprites.Hulk[3];
    this.makeWarpParticles();
}

Hulk.prototype = Object.create(Enemy.prototype);
Hulk.prototype.timeSinceHit = Infinity;
Hulk.prototype.killFamily = true;
Hulk.prototype.renderPos = {cx: this.cx, cy: this.cy};
Hulk.prototype.stepsize = 12;
Hulk.prototype.bootTime = 2 * SECS_TO_NOMINALS;
Hulk.prototype.brainpower = 0.05;
Hulk.prototype.facing = 0;

Hulk.prototype.update = function (du) {
    this.bootTime += -du;

    spatialManager.unregister(this);

    if (!this.startPos) this.startPos = this.getPos();

    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    if (this.isSpawning) {
        this.warpIn(du);
    } else {
        this.seekTarget();

        // Move, unless the Hulk has been shot in the last 0.2 seconds.
        this.timeSinceHit += du;
        if (this.timeSinceHit > SECS_TO_NOMINALS * 0.2) {
            this.move(this.velX, this.velY, du);
        }
    }

    spatialManager.register(this);
};

Hulk.prototype.move = function (velX, velY, du) {
    this.cx += velX * du;
    this.cy += velY * du;
    this.capPositions();
};

Hulk.prototype.seekTarget = function () {

    this.findTarget();
    if (this.target === null || this.target === undefined) {
        return; // Escaping empty-field conditions that can occur in testing
    }

    var xOffset = this.target.cx - this.cx;
    var yOffset = this.target.cy - this.cy;
    var difficulty = Math.random();

    if (this.bootTime < 0 ||
        (util.abs(xOffset) < 10 && difficulty < this.brainpower) ||
        (util.abs(yOffset) < 10 && difficulty < this.brainpower)
        ) {

        this.velX = 0;
        this.velY = 0;
        if (util.abs(xOffset) > util.abs(yOffset)) {
            if (xOffset > 0) {
                this.velX = 1;
            } else {
                this.velX = -1;
            }
        } else {
            if (yOffset > 0) {
                this.velY = 1;
            } else {
                this.velY = -1;
            }
        }
        this.bootTime = 2 * SECS_TO_NOMINALS;
    }
};

Hulk.prototype.findTarget = function () {
    // Hulks prefer family members.
    // http://www.youtube.com/watch?v=940WwmYSYLE&t=1m33s
    this.target = entityManager.findClosestFamilyMember(this.cx, this.cy);
    if (this.target === null || this.target === undefined) {
        this.target = entityManager.findProtagonist();
    }
};

Hulk.prototype.takeBulletHit = function (descr) {
    // Hulks can't be killed. Shooting stuns them and knocks them back.

    // Descr contains the speed and du of the bullet.

    spatialManager.unregister(this);
    this.move(descr.velX / 2, descr.velY / 2, descr.du);
    spatialManager.register(this);

    this.timeSinceHit = 0;
};

Hulk.prototype.render = function (ctx) {
    if (this.isSpawning) {
        return;
    }
    var distSq = util.distSq(this.cx, this.cy, this.renderPos.cx, this.renderPos.cy);
    var angle = util.angleTo(this.renderPos.cx, this.renderPos.cy, this.cx, this.cy);
    var PI = Math.PI;
    
    if (distSq > 0.1) {
        this.facing = 3; // up or down
        if (angle > PI * 3 / 4 && angle < PI * 5 / 4) this.facing = 0; //left
        if (angle > PI * 7 / 4 || angle < PI * 1 / 4) this.facing = 6; //right
    }

    var temp;
    switch (true) {
        case distSq < util.square(this.stepsize):
            temp = 0;
            break;
        case distSq < util.square(this.stepsize * 2):
            temp = 1;
            break;
        case distSq < util.square(this.stepsize * 3):
            temp = 0;
            break;
        case distSq < util.square(this.stepsize * 4):
            temp = 2;
            break;
        default:
            this.renderPos = {cx: this.cx, cy: this.cy};
            temp = 0;
    }
    g_sprites.Hulk[this.facing + temp].drawCentredAt(ctx, this.cx, this.cy, 0);
};

Hulk.prototype.colors = [
    {color: "#0EF909", ratio: 0.80},
    {color: "red", ratio: 0.20}
];