// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Bullet.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.fireSound = new Audio(
    "sounds/exampleSound.ogg");
/*Bullet.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");*/
    
// Initial, inheritable, default values
Bullet.prototype.rotation = 0;
// Bullet.prototype.cx = 200;
// Bullet.prototype.cy = 200;
Bullet.prototype.bulletVel = 10;
Bullet.prototype.velX = 1;//this.bulletVel * this.dirnX;
Bullet.prototype.velY = 1;//this.bulletVel * this.dirnY;
// Convert times from milliseconds to "nominal" time units.
Bullet.prototype.lifeSpan = 3 * SECS_TO_NOMINALS;



Bullet.prototype.update = function (du) {
    this.velX = this.bulletVel * this.dirnX;
    this.velY = this.bulletVel * this.dirnY;

    spatialManager.unregister(this);
    if(this._isDeadNow) return entityManager.KILL_ME_NOW;
    
    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.rotation += 1 * du;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

    // Handle collisions
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) canTakeHit.call(hitEntity); 
        return entityManager.KILL_ME_NOW;
    }
    
    spatialManager.register(this);
};

Bullet.prototype.getRadius = function () {
    return 4;
};

Bullet.prototype.render = function (ctx) {
    ctx.save();
    var fadeThresh = Bullet.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }
    ctx.fillStyle = "yellow";
    util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
    ctx.restore();
};
