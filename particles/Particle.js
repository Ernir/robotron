// ======
// Cruise Missile Trails
// ======


"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Particle(descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }

    this.animation = 0;
}

Particle.prototype.lifeSpan = SECS_TO_NOMINALS / 2;
Particle.prototype.radius = 3;
Particle.prototype.speed = 0.5;
Particle.prototype.velX = 0;
Particle.prototype.velY = 0;
Particle.prototype.colors = ["yellow","orange","red"];

Particle.prototype.update = function (du) {
    
    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

    if (this.dirn) {
        this.velX = Math.cos(this.dirn)*this.speed;
        this.velY = Math.sin(this.dirn)*this.speed;
    }

    this.cx += this.velX * du;
    this.cy += this.velY * du;
};

Particle.prototype.render = function (ctx) {
    ctx.save();
    var fadeThresh = 3 * Particle.prototype.lifeSpan / 4;
    var radius = this.radius;
    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
        radius = this.radius * this.lifeSpan / fadeThresh;
    }
    ctx.fillStyle = this.colors[this.color];
    util.fillCircle(ctx, this.cx, this.cy, radius);
    ctx.restore();
};