//=======
//POWERUP
//=======

// Powerups are rarely dropped by Brains and Tanks when they die

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Powerup(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
	
	// HACKED-IN AUDIO (no preloading)
	this.pickupSound = new Audio(g_audioUrls.pickitem);

    switch(this.brand){
        case 0:
            this.isExtralife = true;
            break;
        case 1:
            this.isShotgun = true;
            break;
        case 2:
            this.isMachinegun = true;
            break;
        case 3:
            this.isSpeedBoost = true;
            break;
        case 4:
            this.isShield = true;
            break;
        case 5:
            this.isScoreMultiplier = true;
            break;
    }
}


Powerup.prototype = new Entity();
Powerup.prototype.strNames = ["Extra Life", "Shotgun", "Machinegun", "SpeedBoost", "Shield", "Score Multiplier"];
Powerup.prototype.isExtralife = false;
Powerup.prototype.isSpeedBoost = false;
Powerup.prototype.isScoreMultiplier = false;
Powerup.prototype.isMachinegun = false;
Powerup.prototype.isShotgun = false;
Powerup.prototype.isShield = false;
Powerup.prototype.loop = SECS_TO_NOMINALS;

Powerup.prototype.update = function (du) {
    this.animation += du;
    if (this.animation > this.loop) this.animation = 0;

    spatialManager.unregister(this);

    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    spatialManager.register(this);
};

Powerup.prototype.takeProtagonistHit = function () {
	if (g_sounds) this.pickupSound.play();
    Player.setPowerupText(this.strNames[this.brand] + "!");
    Player.setPowerupTime();
    this.kill();
    if (this.isExtralife) Player.addLives();
    if (this.isSpeedBoost) Player.addSpeed();
    if (this.isScoreMultiplier) Player.addMultiplier();
    if (this.isMachinegun) {
        Player.hasShotgun = false;
        Player.hasMachineGun = true;
        Player.setFireRate(5);
        Player.addAmmo(100);
    };
    if (this.isShotgun) {
        Player.hasShotgun = true;
        Player.hasMachineGun = false;
        Player.setFireRate(70);
        Player.addAmmo(100);
        var gunSound = new Audio(g_audioUrls.shotgunReload);
        if (g_sounds) gunSound.play();
    };
    if (this.isShield) Player.addShieldTime();
};

Powerup.prototype.getRadius = function () {
    return 8;
};

Powerup.prototype.render = function (ctx) {
    var temp = Math.floor(8* this.animation / this.loop);
    if (temp > 7) temp = 0;
    g_sprites.PowerUps[8*this.brand+temp].drawCentredAt(ctx, this.cx, this.cy, 0);
};
