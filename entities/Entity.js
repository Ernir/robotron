// ======
// ENTITY
// ======
/*

 Provides a set of common functions which can be "inherited" by all other
 game Entities.

 JavaScript's prototype-based inheritance system is unusual, and requires
 some care in use. In particular, this "base" should only provide shared
 functions... shared data properties are potentially quite confusing.

 */

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


function Entity() {

    /*
     // Diagnostics to check inheritance stuff
     this._entityProperty = true;
     console.dir(this);
     */

};

//Entity.prototype.startPos = {cx : 0, cy : 0};

Entity.prototype.setup = function (descr) {

    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }

    // Get my (unique) spatial ID
    this._spatialID = spatialManager.getNewSpatialID();

    // I am not dead yet!
    this._isDeadNow = false;
    this.animation = 0;
};

Entity.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
};

Entity.prototype.getPos = function () {
    return {posX: this.cx, posY: this.cy};
};

Entity.prototype.getRadius = function () {
    return 0;
};

Entity.prototype.getSpatialID = function () {
    return this._spatialID;
};

Entity.prototype.kill = function () {
    this._isDeadNow = true;
};

Entity.prototype.findHitEntity = function () {
    var pos = this.getPos();
    return spatialManager.findEntityInRange(
        pos.posX, pos.posY, this.getRadius()
    );
};

Entity.prototype.capPositions = function () {
    var r = this.getRadius();
    this.cx = Math.max(this.cx, consts.wallLeft + r);
    this.cx = Math.min(this.cx, consts.wallRight - r);
    this.cy = Math.max(this.cy, consts.wallTop + consts.wallThickness + r);
    this.cy = Math.min(this.cy, consts.wallBottom - r);
};

Entity.prototype.edgeBounce = function () {
    var bounceHappened = false;

    var velX = this.velX;
    var velY = this.velY;
    var cx = this.cx;
    var cy = this.cy;
    var r = this.getRadius();

    if (cx + velX > consts.wallRight - r || cx + velX < consts.wallLeft + r) {
        bounceHappened = true;
        this.velX = -this.velX;
    }
    if (cy + velY > consts.wallBottom - r || cy + velY < consts.wallTop + consts.wallThickness + r) {
        bounceHappened = true;
        this.velY = -this.velY;
    }
    return bounceHappened;
};