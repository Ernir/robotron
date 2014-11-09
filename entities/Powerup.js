//=======
//POWERUP
//=======

// Powerups are rarely dropped by Brains and Tanks when they die

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Powerup(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    
}

Powerup.prototype = new Entity();

Powerup.prototype.update = function (du) {
    spatialManager.unregister(this);
    
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    spatialManager.register(this);
};

Powerup.prototype.takeProtagonistHit = function () {
    //TODO: interesting effect
};

Powerup.prototype.render = function (ctx) {
    ctx.save();
    ctx.fillStyle = "cyan";
    util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
    ctx.restore();
};
