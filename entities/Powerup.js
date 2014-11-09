//=======
//POWERUP
//=======

// Powerups are rarely dropped by Brains and Tanks when they die

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Powerup(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    
    switch(this.type){
        case 0:
            this.isExtralife = true;
            break;
        case 1:
            this.isSpeedBoost = true;
            break;
    }
}

Powerup.prototype = new Entity();
Powerup.prototype.isExtralife = false;
Powerup.prototype.isSpeedBoost = false;
Powerup.prototype.isScoreMultiplier = false;
Powerup.prototype.isMachinegun = false;
Powerup.prototype.isShotgun = false;

Powerup.prototype.update = function (du) {
    spatialManager.unregister(this);
    
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    spatialManager.register(this);
};

Powerup.prototype.takeProtagonistHit = function () {
    //TODO: add more interesting effects
    this.kill();
    if (this.isExtralife) Player.addLives();
    if (this.isSpeedBoost) Player.addSpeed();
};

Powerup.prototype.getRadius = function () {
    return 4;
};

Powerup.prototype.render = function (ctx) {
    ctx.save();
    //TODO: Add cool sprites
    if (this.isExtralife) ctx.fillStyle = "cyan";
    if (this.isSpeedBoost) ctx.fillStyle = "red";
    util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
    ctx.restore();
};
