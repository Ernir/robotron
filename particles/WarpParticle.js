// ======
// WARP PARTICLE
// ======
/*
 Warp particles are shown as some entities spawn and/or die.
 Warp particles are not entities. They don't interact with anything.
 */


function WarpParticle(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

WarpParticle.prototype.size = 2;

WarpParticle.prototype.update = function (du,isExploding) {
    var newOffX = this.offX + this.velX;

    if (util.sign(newOffX) === util.sign(this.offX) || isExploding){
        this.offX = newOffX;
        this.velX *= 1.1;
    } else {
        this.offX = 0;
        this.velX = 0;
    }

    var newOffY = this.offY + this.velY;
    if (util.sign(newOffY) === util.sign(this.offY) || isExploding){
        this.offY = newOffY;
        this.velY *= 1.1;
    } else {
        this.offY = 0;
        this.velY = 0;
    }
};

WarpParticle.prototype.render = function (ctx, x, y) {
    var oldFillStyle = ctx.fillStyle;

    ctx.fillStyle = this.color;
    ctx.fillRect(x + this.offX, y + this.offY, this.size, this.size);

    ctx.fillStyle = oldFillStyle;
};