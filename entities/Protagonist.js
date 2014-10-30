// ======
// PROTAGONIST
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Protagonist(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = g_sprites.protagonist;
    // Make a noise when I am created
    // this.exampleSound.play();
}

Protagonist.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Protagonist.prototype.exampleSound = new Audio("sounds/exampleSound.ogg");

Protagonist.prototype.KEY_UP 	  = 'W'.charCodeAt(0);
Protagonist.prototype.KEY_DOWN   = 'S'.charCodeAt(0);
Protagonist.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Protagonist.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

// Initial, inheritable, default values
Protagonist.prototype.rotation = 0;
Protagonist.prototype.cx = 200;
Protagonist.prototype.cy = 200;
Protagonist.prototype.velX = 0;
Protagonist.prototype.velY = 0;
Protagonist.prototype.bulletVel = 10;

Protagonist.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
	
	// Perform movement
    var vel = this.computeMovement();
	this.velX = vel.x;
	this.velY = vel.y;

    this.cx += this.velX * du;
    this.cy += this.velY * du;
    this.capPositions();

    spatialManager.register(this);
};

Protagonist.prototype.computeMovement = function () {
	var velX = 0;
	var velY = 0;
    
    if (keys[this.KEY_UP]) {
        velY -= 5;
    }
    if (keys[this.KEY_DOWN]) {
        velY += 5;
    }
	if (keys[this.KEY_LEFT]) {
        velX -= 5;
    }
    if (keys[this.KEY_RIGHT]) {
        velX += 5;
    }
	// Clamp vel to 5 pixel moving radius
	if (velX !== 0 && velY !== 0) {
		velX *= Math.cos(Math.PI / 4);
		velY *= Math.sin(Math.PI / 4);
	}
    
    return {x: velX, y: velY};
}

Protagonist.prototype.fire = function (aimX, aimY) {
	
	var direction = Math.atan2(aimY - this.cy, aimX - this.cx);
	var dX = +Math.sin(direction);
	var dY = -Math.cos(direction);
	var launchDist = this.getRadius() * 1.2;
	
	var bulletVel = this.bulletVel;
	var bulletVelX = dX * bulletVel;
	var bulletVelY = dY * bulletVel;

	entityManager.fireBullet(
	   this.cx + dX * launchDist, this.cy + dY * launchDist,
	   bulletVelX, bulletVelY,
	   0
	);   
}

Protagonist.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Protagonist.prototype.render = function (ctx) {

    g_sprites.protagonist.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
