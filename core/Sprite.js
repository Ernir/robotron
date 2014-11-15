// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// Construct a "sprite" from the given `image`,
//
function Sprite(image,leftLim,rightLim,topLim,bottomLim,scale) {

    if(leftLim === undefined) {
        this.leftLim = 0;
    } else {
        this.leftLim = leftLim;
    }
    if(rightLim === undefined) {
        this.rightLim = image.width;
    } else {
        this.rightLim = rightLim;
    }
    if(topLim === undefined) {
        this.topLim = 0;
    } else {
        this.topLim = topLim;
    }
    if(bottomLim === undefined) {
        this.bottomLim = image.height;
    } else {
        this.bottomLim = bottomLim;
    }
    if (scale === undefined) {
        this.scale = 1;
    } else {
        this.scale = scale;
    }

    this.image = image;

    this.width = this.rightLim - this.leftLim;
    this.height = this.bottomLim - this.topLim;
}

Sprite.prototype.drawAt = function (ctx, x, y) {
    ctx.drawImage(
        this.image, // Image
        this.leftLim, // x coordinate to start clipping
        this.topLim, // y coordinate to start clipping
        this.width, // the width of the clipped image
        this.height, // the height of the clipped image
        x,
        y,
        this.width, // final scaled width (scale = 1 here)
        this.height // final scaled height (scale = 1 here)
    );
};

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation) {
    if (rotation === undefined) rotation = 0;
    
    var w = this.width,
        h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);
    
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    this.drawAt(ctx,-w/2, -h/2);
    
    ctx.restore();
};  

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation) {
    
    // Get "screen width"
    var sw = g_canvas.width;
    
    // Draw primary instance
    this.drawWrappedVerticalCentredAt(ctx, cx, cy, rotation);
    
    // Left and Right wraps
    this.drawWrappedVerticalCentredAt(ctx, cx - sw, cy, rotation);
    this.drawWrappedVerticalCentredAt(ctx, cx + sw, cy, rotation);
};

Sprite.prototype.drawWrappedVerticalCentredAt = function (ctx, cx, cy, rotation) {

    // Get "screen height"
    var sh = g_canvas.height;
    
    // Draw primary instance
    this.drawCentredAt(ctx, cx, cy, rotation);
    
    // Top and Bottom wraps
    this.drawCentredAt(ctx, cx, cy - sh, rotation);
    this.drawCentredAt(ctx, cx, cy + sh, rotation);
};
