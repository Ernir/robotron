// ======
// FAMILY
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Family(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = g_sprites.family;
    // Make a noise when I am created
    //this.exampleSound.play();
}

Family.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Family.prototype.exampleSound = new Audio("sounds/exampleSound.ogg");

// Initial, inheritable, default values
Family.prototype.rotation = 0;
Family.prototype.cx = 100;
Family.prototype.cy = 100;
Family.prototype.velX = 0;
Family.prototype.velY = 0;

Family.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    this.randomWalk();

    this.cx += this.velX * du;
    this.cy += this.velY * du;
    this.capPositions();

    spatialManager.register(this);
};

Family.prototype.randomWalk = function () {
    if (Math.random()<0.02) {
        //2% chance to change direction
        
        var n = Math.floor(Math.random()*4);
        switch(n){
            case 0:
                this.velX = -0.3;
                break;
            case 1:
                this.velY = -0.3;
                break;
            case 2:
                this.velX = 0.3;
                break;
            case 3:
                this.velY = 0.3;
        }
    }
}

Family.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Family.prototype.render = function (ctx) {

    g_sprites.family.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
