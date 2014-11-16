// ======
// Cruise Missile Trails
// ======


"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function CMTrail(descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }

    this.animation = 0;
}

CMTrail.prototype.lifeSpan = SECS_TO_NOMINALS / 2;
CMTrail.prototype.radius = 3;

CMTrail.prototype.update = function (du) {
    
    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;
};

CMTrail.prototype.render = function (ctx) {
    ctx.save();
    var fadeThresh = 3 * CMTrail.prototype.lifeSpan / 4;
    var radius = this.radius;
    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
        radius = this.radius * this.lifeSpan / fadeThresh;
    }
    ctx.fillStyle = "yellow";
    util.fillCircle(ctx, this.cx, this.cy, radius);
    ctx.restore();
};