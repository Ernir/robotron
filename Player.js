//======
//PLAYER
//======
/*

An object which contains all the important parameters of the player such as
the score, remaining lives and the current level number.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Player() {

};

Player.prototype.setup = function (descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
};

Player.prototype.level = 1;
Player.prototype.lives = 5;
Player.prototype.multiplier = 1;
Player.prototype.score = 0;
Player.prototype.saveCount = 0;
Player.prototype.speed = 2;
Player.prototype.speedTimer = 10 * SECS_TO_NOMINALS;
Player.prototype.fireRate = 20;
Player.prototype.ammo = 0;
Player.prototype.scoreValues = {
    Electrode: 0,
    Spark: 25,
    Shell: 50,
    CruiseMissile: 75,
    Prog: 100,
    Grunt: 100,
    Enforcer: 200,
    Tank : 300,
    Brain: 500,
    Spheroid: 1000,
    Quark: 1000,
    Family: 1000
};

Player.prototype.addSaveCount = function () {
   this.saveCount += 1;
   if (this.saveCount > 6) {
       this.addLives();
        this.resetSaveCount();
    }
};

Player.prototype.resetSaveCount = function () {
    this.saveCount = 0;
};


Player.prototype.addLevel = function () {
    this.level += 1;
    //TODO: increase the levelcap according to levelmanager._levelSpecs.length
};

Player.prototype.subtractLevel = function () {
    this.level += -1;
};

Player.prototype.resetLevel = function () {
    this.level = 1;
};

Player.prototype.getLevel = function () {
    return this.level;
};

Player.prototype.addLives = function () {
    this.lives += 1;
};

Player.prototype.subtractLives = function () {
    if(this.lives > 0) this.lives += -1;
};

Player.prototype.resetLives = function () {
    this.lives = 5;
};

Player.prototype.getLives = function () {
    return this.lives;
};

Player.prototype.addMultiplier = function () {
    if (this.multiplier < 5) {
        this.multiplier += 1;
    }
};

Player.prototype.resetMultiplier = function () {
    this.multiplier = 1;
};

Player.prototype.getMultiplier = function () {
    return this.multiplier;
};

Player.prototype.addScore = function (score) {
    this.score += score;
};

Player.prototype.resetScore = function () {
    this.score = 0;
};

Player.prototype.getScore = function () {
    return this.score;
};

Player.prototype.addSaveCount = function () {
    this.saveCount += 1;
    if (this.saveCount > 6) {
        this.addLives();
        this.resetSaveCount();
    }
};

Player.prototype.resetSaveCount = function () {
    this.saveCount = 0;
};

Player.prototype.addSpeed = function () {
    this.resetSpeedTimer();
    if (this.speed < 5) this.speed = 5;
};

Player.prototype.getSpeed = function () {
    return this.speed;
};

Player.prototype.tickSpeedTimer = function (du) {
    this.speedTimer += -du;
    if (this.speedTimer < 0) {
        this.resetSpeed();
        this.resetSpeedTimer();
    }
};

Player.prototype.resetSpeed = function () {
    this.speed = 2;
}

Player.prototype.resetSpeedTimer = function () {
    this.speedTimer = 10 * SECS_TO_NOMINALS;
};

Player.prototype.getFireRate = function () {
    return this.fireRate;
};

Player.prototype.setFireRate = function (fireRate) {
    this.fireRate = fireRate;
};

Player.prototype.resetFireRate = function () {
    this.fireRate = 20;
};

Player.prototype.getAmmo = function () {
    return this.ammo;
};

Player.prototype.setAmmo = function (ammo) {
    this.ammo = ammo;
};

Player.prototype.subtractAmmo = function () {
    if (this.ammo > 0) this.ammo += -1;
    if (this.ammo < 1) this.resetFireRate();
};

Player.prototype.addAmmo = function (ammo) {
    this.ammo += ammo;
};

Player.prototype.resetAmmo = function () {
    this.ammo = 20;
};

Player.prototype.resetAll = function() {
    this.resetLives();
    this.resetLevel();
    this.resetScore();
    this.resetSpeed();
    this.resetSpeedTimer();
    this.resetMultiplier();
    this.resetFireRate();
    this.resetAmmo();
};

Player.prototype.render = function(ctx) {
    // Display the score
    ctx.save();
    ctx.lineWidth = 2;
    ctx.font = "20px Arial";
    ctx.strokeStyle = "red";
    ctx.strokeText(this.score, 10, 20);
    var disp = "X" + this.multiplier + "  Level: " + this.level;
    ctx.strokeText(disp, g_canvas.width/2 - 50, 20);
    

    // Display remaining lives
    for (var i = 1; i < this.lives; i++) {
        g_sprites.Extralife.drawCentredAt(ctx, 
                                          g_canvas.width - i*20, 
                                          15, 
                                          0);
    };

    // Display ammo
    // TODO: redesign the score bar
    var text = "Ammo: " + this.ammo;
    ctx.strokeText(text, g_canvas.width/2 - 160, 20);
    ctx.restore();
};