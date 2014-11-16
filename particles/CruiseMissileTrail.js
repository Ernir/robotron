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

CMTrail.prototype.update = function (du) {
    
    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;
};

CMTrail.prototype.getRadius = function () {
    return 3;
};

CMTrail.prototype.render = function (ctx) {
    ctx.save();
    var fadeThresh = this.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }
    ctx.fillStyle = "yellow";
    util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
    ctx.restore();
};