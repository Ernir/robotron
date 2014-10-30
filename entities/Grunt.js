// ======
// Grunt
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Grunt(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = g_sprites.grunt;
}

Grunt.prototype = new Entity();

// Initial, inheritable, default values
Grunt.prototype.rotation = 0;
Grunt.prototype.cx = 100;
Grunt.prototype.cy = 100;
Grunt.prototype.velX = 0;
Grunt.prototype.velY = 0;

Grunt.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    this.cx += this.velX * du;
    this.cy += this.velY * du;
    util.capPositions(this);

    spatialManager.register(this);
};

Grunt.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Grunt.prototype.render = function (ctx) {

    g_sprites.grunt.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};