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

    // Returns -1, 0 or 1
    randTrinary: function() {
        return Math.floor(Math.random()*3)-1;
    },

    randSign: function() {
        return Math.random() < 0.5 ? 1 : -1;
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


// CANVAS OPS
// ==========

    clearCanvas: function (ctx) {
        var prevfillStyle = ctx.fillStyle;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = prevfillStyle;
        
        //Display the color array
        /*ctx.save();
        for (var i = 0; i < consts.colors.length; i++) {
            ctx.fillStyle = consts.colors[i];
            ctx.fillRect(i*(g_canvas.width / consts.colors.length), 550, 
						(i+1)*(g_canvas.width / consts.colors.length), 50
			);
        }
        ctx.restore();*/
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
    },

    RGB2Color: function (r,g,b) {
        return '#' + this.byte2Hex(r) + this.byte2Hex(g) + this.byte2Hex(b);
    },

    byte2Hex: function (n) {
        return String("0123456789ABCDEF".substr((n >> 4) & 0x0F,1)) + "0123456789ABCDEF".substr(n & 0x0F,1);
    },

    //Called when initializing the game
    makeColorArray: function () {
        for (var i = 0; i < 32; ++i) {
            var r = Math.sin(0.2*i + 0) * 127 + 128;
            var g = Math.sin(0.2*i + 2) * 127 + 128;
            var b = Math.sin(0.2*i + 4) * 127 + 128;
            consts.colors.push(this.RGB2Color(r,g,b));
        }
    },



// LEVEL GENERATOR
// ===============
    
    generateLevel: function (L) {

        var randomlevel = [];

        if (L % 5 !== 0 && g_sounds) this._levelChangingSound.play();

        switch (true) {
            case (L + 1) % 10 === 0:
                // Grunt wave
                if (g_Debug) console.log("grunts");
                randomlevel.push(10); // Family
                randomlevel.push(3 + Math.floor(L / 3)); // Electrodes
                randomlevel.push(Math.floor(Math.random() * 6) + 2 * L); // Grunts
                randomlevel.push(Math.floor(Math.random() * 5)); // Hulks
                break;
            case L % 5 === 0:
                // Brain wave (hur hur)
                if (g_Debug) console.log("brains");
                randomlevel.push(15); // Family
                randomlevel.push(3 + Math.floor(L / 3)); // Electrodes
                randomlevel.push(Math.floor(Math.random() * 5) + 4); // Grunts
                randomlevel.push(0); // Hulks
                randomlevel.push(0); // Spheroids
                randomlevel.push(Math.floor(Math.random() * 7) + Math.floor(L / 5)); // Brains
                break;
            case (L + 3) % 5 === 0:
                // Tank wave
                if (g_Debug) console.log("tanks");
                randomlevel.push(10); // Family
                randomlevel.push(0); // Electrodes
                randomlevel.push(0); // Grunts
                randomlevel.push(3 + Math.floor(L / 2)); // Hulks
                randomlevel.push(0); // Spheroids
                randomlevel.push(0); // Brains
                randomlevel.push(Math.floor(L / 2)); // Quarks
                break;
            case (L + 6) % 10 === 0:
                // Hulk wave or Enforcer/Tank wave
                randomlevel.push(10); // Family
                randomlevel.push(3 + Math.floor(L / 3)); // Electrodes
                if (Math.random() < 0.5) {
                    if (g_Debug) console.log("enforcers/tanks");
                    randomlevel.push(0); // Grunts
                    randomlevel.push(0); // Hulks
                    randomlevel.push(4 + Math.floor(L / 3)); // Spheroids
                    randomlevel.push(0); // Brains
                    randomlevel.push(2 + Math.floor(Math.random() * L / 4)); // Quarks
                } else {
                    if (g_Debug) console.log("hulks");
                    randomlevel.push(Math.floor(Math.random() * 5) + 4); // Grunts
                    randomlevel.push(6 + Math.floor(L / 2)); // Hulks
                    randomlevel.push(Math.floor(Math.random() * 3)); // Spheroids
                }
                break;
            case L > 27:
                // Normal wave + a few Quarks
                if (g_Debug) console.log("normal+");
                randomlevel.push(10); // Family
                randomlevel.push(3 + Math.floor(L / 3)); // Electrodes
                randomlevel.push(Math.floor(Math.random() * 6) + L); // Grunts
                randomlevel.push(Math.floor(Math.random() * 6) + Math.floor(L / 10)); // Hulks
                randomlevel.push(Math.floor(Math.random() * 3)); // Spheroids
                randomlevel.push(Math.floor(Math.random() * 3)); // Quarks
                break;
            default:
                // Normal wave
                if (g_Debug) console.log("normal");
                randomlevel.push(10); // Family
                randomlevel.push(3 + Math.floor(L / 3)); // Electrodes
                randomlevel.push(Math.floor(Math.random() * 6) + L); // Grunts
                randomlevel.push(Math.floor(Math.random() * 6) + Math.floor(L / 10)); // Hulks
                randomlevel.push(Math.floor(Math.random() * 3)); // Spheroids
        }

        if (g_Debug) {
            console.log("This level consists of:", randomlevel);
            console.log("Key: [Family, Electrodes, Grunts, Hulks, Spheroids, Brains, Quarks]");
            console.log("");
        }

        return randomlevel;
    }
};