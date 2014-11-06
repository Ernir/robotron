// ======
// Hulk
// ======

// Hulks are indestructible robotrons that chase members of the last human
// family.

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object

function Hulk(descr) {
    Enemy.call(this, descr);

    this.sprite = g_sprites.Hulk[3];
}

Hulk.prototype = Object.create(Enemy.prototype);
Hulk.prototype.timeSinceHit = Infinity;
Hulk.prototype.killFamily = true;
Hulk.prototype.renderPos = {cx: this.cx, cy: this.cy};

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

// TODO: Make them stupid.
Hulk.prototype.seekTarget = function () {

    this.findTarget();
    if (this.target === null || this.target === undefined) {
        return; // Escaping empty-field conditions that can occur in testing
    }

    var xOffset = this.target.cx - this.cx;
    var yOffset = this.target.cy - this.cy;

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

Hulk.prototype.findTarget = function () {
    // Hulks prefer family members.
    // http://www.youtube.com/watch?v=940WwmYSYLE&t=1m33s
    this.target = entityManager.findClosestFamilyMember(this.cx,this.cy);
    if (this.target === null || this.target === undefined) {
        this.target = entityManager.findProtagonist();
    }
};

Hulk.prototype.takeBulletHit = function () {
    // Hulks can't be killed. Shooting stuns them.
    this.timeSinceHit = 0;
};

Hulk.prototype.render = function (ctx) {
    var distSq = util.distSq(this.cx, this.cy, this.renderPos.cx, this.renderPos.cy);
    var angle = util.angleTo(this.renderPos.cx, this.renderPos.cy, this.cx, this.cy);
    var PI = Math.PI;
    var facing = 3; // up or down
    if(angle > PI*3/4 && angle < PI*5/4) facing = 0; //left
    if(angle > PI*7/4 || angle < PI*1/4) facing = 6; //right

    switch(true) {
        case distSq<12*12:
            g_sprites.Hulk[facing+0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<24*24:
            g_sprites.Hulk[facing+1].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<36*36:
            g_sprites.Hulk[facing+0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<48*48:
            g_sprites.Hulk[facing+2].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        default:
            this.renderPos = {cx: this.cx, cy: this.cy};
            g_sprites.Hulk[facing+0].drawCentredAt(ctx, this.cx, this.cy, 0);
    }
};