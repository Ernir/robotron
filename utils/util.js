// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


var util = {

// MATH
// ======
    sign: function (x) {
        if (x < 0) {
            return -1;
        } else if (x > 0) {
            return 1;
        }
        return 0;
    },

    abs: function (x) {
        if (x < 0) {
            return -x;
        }
        return x;
    },

    // Returns true if the two numbers are "similar" according to an arbitrary definition.
    similar: function(x,y) {
        var similarScale = 0.9*this.abs(x) <= this.abs(y) && 0.9*this.abs(y) <= this.abs(x);
        var sameSign = this.sign(x) === this.sign(y);
        if (similarScale && sameSign) {
            return true;
        }
        return false;
    },

// RANGES
// ======

    clampRange: function (value, lowBound, highBound) {
        if (value < lowBound) {
            value = lowBound;
        } else if (value > highBound) {
            value = highBound;
        }
        return value;
    },

    wrapRange: function (value, lowBound, highBound) {
        while (value < lowBound) {
            value += (highBound - lowBound);
        }
        while (value > highBound) {
            value -= (highBound - lowBound);
        }
        return value;
    },

    isBetween: function (value, lowBound, highBound) {
        if (value < lowBound) {
            return false;
        }
        if (value > highBound) {
            return false;
        }
        return true;
    },


// RANDOMNESS
// ==========

    randRange: function (min, max) {
        return (min + Math.random() * (max - min));
    },


// MISC
// ====

    square: function (x) {
        return x * x;
    },
	
	angleTo: function (x1, y1, x2, y2) {
		var angle = Math.atan2(y2 - y1, x2 - x1);
        if (angle < 0)
            angle += 2 * Math.PI;
        return angle;
	},


// DISTANCES
// =========

    distSq: function (x1, y1, x2, y2) {
        return this.square(x2 - x1) + this.square(y2 - y1);
    },

    wrappedDistSq: function (x1, y1, x2, y2, xWrap, yWrap) {
        var dx = Math.abs(x2 - x1),
            dy = Math.abs(y2 - y1);
        if (dx > xWrap / 2) {
            dx = xWrap - dx;
        }
        ;
        if (dy > yWrap / 2) {
            dy = yWrap - dy;
        }
        return this.square(dx) + this.square(dy);
    },
    capPositions: function(entity) {
		var r = entity.getRadius();
        entity.cx = Math.max(entity.cx, this.wallLeft + r);
        entity.cx = Math.min(entity.cx, this.wallRight - r);
        entity.cy = Math.max(entity.cy, this.wallTop + r);
        entity.cy = Math.min(entity.cy, this.wallBottom - r);
    },
	// TODO: Put these to some better place?
	wallTop: 35,
	wallBottom: g_canvas.height - 5,
	wallLeft: 5,
	wallRight: g_canvas.width - 5,


// CANVAS OPS
// ==========

    clearCanvas: function (ctx) {
		// TODO: Clear up magic numbers
        var prevfillStyle = ctx.fillStyle;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillStyle = "#FF55A3";
        ctx.fillRect(0, 30, ctx.canvas.width, ctx.canvas.height-30);
		ctx.fillStyle = "black";
        ctx.fillRect(this.wallLeft, this.wallTop, ctx.canvas.width - 10, ctx.canvas.height - 40);
        ctx.fillStyle = prevfillStyle;
    },

    strokeCircle: function (ctx, x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
    },

    fillCircle: function (ctx, x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    },

    fillBox: function (ctx, x, y, w, h, style) {
        var oldStyle = ctx.fillStyle;
        ctx.fillStyle = style;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = oldStyle;
    }

};
