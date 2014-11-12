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
}

Grunt.prototype = Object.create(Enemy.prototype);
Grunt.prototype.renderPos = {cx: this.cx, cy: this.cy};
Grunt.prototype.baseSpeed = 1;
Grunt.prototype.speed = 1;
Grunt.prototype.maxSpeed = 2.5;
Grunt.prototype.maxRageReachedTime = 30*SECS_TO_NOMINALS;

Grunt.prototype.update = function (du) {

    spatialManager.unregister(this);
	
	if (!this.startPos) this.startPos = this.getPos();
	
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    this.rage(du);
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
		this.velX *= this.speed*Math.cos(Math.PI / 4);
		this.velY *= this.speed*Math.sin(Math.PI / 4);
	}
};

// Increases the grunt's speed over time.
Grunt.prototype.rage = function (du) {
    var timeFraction = du/this.maxRageReachedTime;
    this.speed += (this.maxSpeed - this.baseSpeed)*timeFraction;
    this.speed = Math.min(this.speed, this.maxSpeed);
};

Grunt.prototype.takeBulletHit = function () {
    this.kill();
	Player.addScore(Player.scoreValues.Grunt * Player.getMultiplier());
};
Grunt.prototype.takeElectrodeHit = function () {
    this.takeBulletHit();
};

Grunt.prototype.render = function (ctx) {
    var distSq = util.distSq(this.cx, this.cy, this.renderPos.cx, this.renderPos.cy);
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
            this.renderPos = {cx: this.cx, cy: this.cy};
            g_sprites.Grunt[0].drawCentredAt(ctx, this.cx, this.cy, 0);
    }
};