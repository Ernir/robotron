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
			this.sprite = g_sprites.Wing;
            break;
        case 2:
            this.isScoreMultiplier = true;
            break;
        case 3:
            this.isMachinegun = true;
            break;
        case 4:
            this.isShotgun = true;
            break;
        case 5:
            this.isShield = true
			this.sprite = g_sprites.Shield;
            break;
    }
}

Powerup.prototype = new Entity();
Powerup.prototype.isExtralife = false;
Powerup.prototype.isSpeedBoost = false;
Powerup.prototype.isScoreMultiplier = false;
Powerup.prototype.isMachinegun = false;
Powerup.prototype.isShotgun = false;
Powerup.prototype.isShield = false;

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
    if (this.isScoreMultiplier) Player.addMultiplier();
    if (this.isMachinegun) {
        Player.hasShotgun = false;
        Player.setFireRate(5);
        Player.addAmmo(100);
    };
    if (this.isShotgun) {
        Player.hasShotgun = true;
        Player.setFireRate(70);
        Player.addAmmo(100);
    };
    if (this.isShield) Player.addShieldTime();
};

Powerup.prototype.getRadius = function () {
	if (this.sprite) return this.sprite.width / 2;
    return 4;
};

Powerup.prototype.render = function (ctx) {
    ctx.save();
    //TODO: Add cool sprites
    if (this.isExtralife) ctx.fillStyle = "white";
    if (this.isSpeedBoost) ctx.fillStyle = "red";
    if (this.isScoreMultiplier) ctx.fillStyle = "magenta";
    if (this.isMachinegun) ctx.fillStyle = "lime";
    if (this.isShotgun) ctx.fillStyle = "orange";
    if (this.isShield) ctx.fillStyle = "cyan";
	
	if (this.sprite) this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
    else util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
    ctx.restore();
};
