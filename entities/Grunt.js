// ======
// Grunt
// ======

// Grunts are simple robotrons that walk straight towards the main character

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Grunt(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Grunt[0];
    this.target = entityManager.findProtagonist();
}

Grunt.prototype = Object.create(Enemy.prototype);
Grunt.prototype.startPos = {cx: this.cx, cy: this.cy};

Grunt.prototype.update = function (du) {
    this.prevX = this.cx;
    this.prevY = this.cy;

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    this.seekTarget();

    this.cx += this.velX * du;
    this.cy += this.velY * du;
    this.capPositions();

    spatialManager.register(this);
};

Grunt.prototype.seekTarget = function () {
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

Grunt.prototype.takeBulletHit = function () {
    this.kill();
	Player.addScore(100 * Player.getMultiplier());
};

Grunt.prototype.render = function (ctx) {
    var distSq = util.distSq(this.cx, this.cy, this.startPos.cx, this.startPos.cy);
    switch(true) {
        case distSq<3*3:
            g_sprites.Grunt[0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<6*6:
            g_sprites.Grunt[1].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<9*9:
            g_sprites.Grunt[0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<12*12:
            g_sprites.Grunt[2].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        default:
            this.startPos = {cx: this.cx, cy: this.cy};
            g_sprites.Grunt[0].drawCentredAt(ctx, this.cx, this.cy, 0);
    }
};