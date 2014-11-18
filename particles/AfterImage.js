//==========
//AfterImage
//==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

function AfterImage(descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
}

AfterImage.prototype.duration = SECS_TO_NOMINALS / 4;

AfterImage.prototype.update = function (du) {
    this.duration += -du;
    if (this.duration < 0) return entityManager.KILL_ME_NOW;
};

AfterImage.prototype.render = function (ctx) {
    ctx.save();
    ctx.globalAlpha = this.duration / (2 * AfterImage.prototype.duration);
    this.image.drawCentredAt(ctx, this.cx, this.cy, 0);
    ctx.restore();
};