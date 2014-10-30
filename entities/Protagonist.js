// ======
// PROTAGONIST
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Protagonist(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = g_sprites.protagonist;
    // Make a noise when I am created
    this.exampleSound.play();
}

Protagonist.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Protagonist.prototype.exampleSound = new Audio("sounds/exampleSound.ogg");

// Initial, inheritable, default values
Protagonist.prototype.rotation = 0;
Protagonist.prototype.cx = 200;
Protagonist.prototype.cy = 200;
Protagonist.prototype.velX = 5;
Protagonist.prototype.velY = 5;

Protagonist.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    this.cx += this.velX * du;
    this.cy += this.velY * du;
    this.capPosition();

    spatialManager.register(this);
};

Protagonist.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Protagonist.prototype.render = function (ctx) {

    g_sprites.protagonist.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
