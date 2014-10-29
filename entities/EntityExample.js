// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


// A generic contructor which accepts an arbitrary descriptor object
function EntityExample(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created
    this.exampleSound.play();

}

EntityExample.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
EntityExample.prototype.exampleSound = new Audio(
    "sounds/exampleSound.ogg");

// Initial, inheritable, default values
EntityExample.prototype.rotation = 0;
EntityExample.prototype.cx = 200;
EntityExample.prototype.cy = 200;
EntityExample.prototype.velX = 1;
EntityExample.prototype.velY = 1;

EntityExample.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    // TODO: Add entity-specific logic

    spatialManager.register(this);

};

EntityExample.prototype.render = function (ctx) {

    g_sprites.sprite1Name.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
