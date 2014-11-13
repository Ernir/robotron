// ======
// Enforcer
// ======

// Enforcers fly towards the main character.
// Enforcers shoot sparks.

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Enforcer(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Enforcer;
    this.target = entityManager.findProtagonist();
}

Enforcer.prototype = Object.create(Enemy.prototype);
Enforcer.prototype.ammo = 20;
Enforcer.prototype.sparkFireChance = 0.01; //1% chance of firing a spark/update

Enforcer.prototype.update = function (du) {

    spatialManager.unregister(this);
	
	if (!this.startPos) this.startPos = this.getPos();
	
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    this.seekTarget();

    this.cx += this.velX * du;
    this.cy += this.velY * du;
    this.capPositions();

    if (Math.random() < this.sparkFireChance && this.ammo > 0) {
        var angle = util.angleTo(
            this.cx,
            this.cy,
            this.target.cx,
            this.target.cy
        );
        this.ammo--;
        entityManager.fireSpark(this.cx, this.cy, angle);
    }

    spatialManager.register(this);
};

Enforcer.prototype.seekTarget = function () {
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

Enforcer.prototype.takeBulletHit = function () {
    this.kill();
	Player.addScore(Player.scoreValues.Enforcer * Player.getMultiplier());
};

Enforcer.prototype.render = function (ctx) {
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
};