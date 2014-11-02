// ======
// Grunt
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Grunt(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = g_sprites.grunt;
    this.target = entityManager.findProtagonist();
}

Grunt.prototype = new Entity();

// Initial, inheritable, default values
Grunt.prototype.killProtagonist = true;
Grunt.prototype.rotation = 0;
// Grunt.prototype.cx = 100;
// Grunt.prototype.cy = 100;
Grunt.prototype.velX = 0;
Grunt.prototype.velY = 0;
Grunt.prototype.bulletFrameCounter=1;

Grunt.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    this.seekTarget();
    this.shootTarget();

    this.cx += this.velX * du;
    this.cy += this.velY * du;
    this.capPositions();

    spatialManager.register(this);
};

Grunt.prototype.seekTarget = function () {
    var xOffset = this.target.cx - this.cx;
    var yOffset = this.target.cy - this.cy;

    if (xOffset > 0) {
        this.velX = 1;
    } else {
        this.velX = -1;
    }

    if (yOffset > 0) {
        this.velY = 1;
    } else {
        this.velY = -1;
    }
	
	// Clamp vel to 1 pixel moving radius
	if (xOffset !== 0 && yOffset !== 0) {
		this.velX *= Math.cos(Math.PI / 4);
		this.velY *= Math.sin(Math.PI / 4);
	}
};

Grunt.prototype.shootTarget = function () {
    if(entityManager._protagonists[0]==undefined){
        return;
    }

    //You can change this from 100 to a global const.
    if (this.bulletFrameCounter !== 100) {
        this.bulletFrameCounter++;
        return;
    }

    //You could implement entityManager.fire in a better way to avoid repetition.
    var pos = this.target.getPos();
    var dirn = util.angleTo(
        this.cx, 
        this.cy,
        pos.posX, 
        pos.posY
    );
    
    var launchdist = this.target.getRadius()*0.8;
    
    var dirnX = Math.cos(dirn);
    var dirnY = Math.sin(dirn);
    
    //Need to change how Bullet.js is implemented so it'll only hurt protagonist.
    entityManager.fireBullet(
        this.cx + launchdist * dirnX, 
        this.cy + launchdist * dirnY, 
        dirnX, 
        dirnY
    );
    this.bulletFrameCounter = 1;
}

Grunt.prototype.takeBulletHit = function () {
    this.kill();
	// Add score
};

Grunt.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Grunt.prototype.render = function (ctx) {

    g_sprites.grunt.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
