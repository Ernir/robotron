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
	this.fireSound.currentTime = 0;
    if (g_sounds) this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Bullet.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.fireSound = new Audio(g_audioUrls.shot);
    
// Initial, inheritable, default values
Bullet.prototype.rotation = 0;
Bullet.prototype.bulletVel = 10;
Bullet.prototype.velX = 1;
Bullet.prototype.velY = 1;
// Convert times from milliseconds to "nominal" time units.
Bullet.prototype.lifeSpan = 3 * SECS_TO_NOMINALS;



Bullet.prototype.update = function (du) {

    spatialManager.unregister(this);
	
	// Handle death
    if(this._isDeadNow) return entityManager.KILL_ME_NOW;
    
    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

	// Update positions
	this.velX = this.bulletVel * this.dirnX;
    this.velY = this.bulletVel * this.dirnY;
	
    this.prevX = this.cx;
    this.prevY = this.cy;

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.rotation += 1 * du;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

    // Handle collisions
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        // The bulletVel check is a hack to stop the shotgun bullets 
        // from killing each other on spawn
        if (!hitEntity.bulletVel) {
            var canTakeHit = hitEntity.takeBulletHit;
			var canFriendlyHit = hitEntity.takeFriendlyHit;
            var descr = {velX : this.velX, velY : this.velY, du : du};
            if (canTakeHit || (g_friendlyFire && canFriendlyHit))  {
                if (canTakeHit) canTakeHit.call(hitEntity, descr);
				else canFriendlyHit.call(hitEntity);
                return entityManager.KILL_ME_NOW;
            }
        }
    }
    
    spatialManager.register(this);
};

Bullet.prototype.getRadius = function () {
    return 4;
};

Bullet.prototype.render = function (ctx) {
    switch(true){
        case Player.hasShotgun:
            ctx.save();
            var fadeThresh = Bullet.prototype.lifeSpan / 3;

            if (this.lifeSpan < fadeThresh) {
                ctx.globalAlpha = this.lifeSpan / fadeThresh;
            }
            ctx.fillStyle = "orange";
            util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
            ctx.restore();
            break;
        case Player.hasMachineGun:
            ctx.save();
            ctx.strokeStyle = "cyan";
            ctx.fillStyle = "cyan";

            var dirn = util.angleTo(this.cx, this.cy, this.prevX, this.prevY);
            var x = this.cx + 10 * Math.cos(dirn);
            var y = this.cy + 10 * Math.sin(dirn);
            
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.moveTo(this.cx, this.cy);
            ctx.lineTo(x, y);
            ctx.lineWidth = 8;
            ctx.stroke();
            util.fillCircle(ctx, this.cx, this.cy, 4);
            
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.moveTo(this.cx, this.cy);
            ctx.lineTo(x, y);
            ctx.lineWidth = 4;
            ctx.stroke();
            util.fillCircle(ctx, this.cx, this.cy, 2);
            
            ctx.strokeStyle = "white";
            ctx.fillStyle = "white";
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.moveTo(this.cx, this.cy);
            ctx.lineTo(x, y);
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.restore();
            break;
        default:
            ctx.save();
            var fadeThresh = Bullet.prototype.lifeSpan / 3;

            if (this.lifeSpan < fadeThresh) {
                ctx.globalAlpha = this.lifeSpan / fadeThresh;
            }
            ctx.fillStyle = "lime";
            util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
            ctx.restore();
    }
};
