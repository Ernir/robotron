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
Player.prototype.scoreValues = {
    Grunt: 100,
    Family: 1000,
    CM: 25,
    Brain: 500,
    Electrode: 50 // TODO: Find the webpage with the scores again, and update value
};

Player.prototype.addLevel = function () {
    if(this.level < 8) this.level += 1;
    //TODO: increase the levelcap according to levelmanager._levelSpecs.length
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

Player.prototype.resetAll = function () {
    this.resetLives();
    this.resetLevel();
    this.resetScore();
    this.resetMultiplier();
};

Player.prototype.render = function (ctx) {
    // Display the score
    ctx.save();
    ctx.lineWidth = 2;
    ctx.font = "20px Arial";
    ctx.strokeStyle = "red";
    ctx.strokeText(this.score, 10, 20);
    var disp = "X" + this.multiplier;
    ctx.strokeText(disp, g_canvas.width / 2 - 10, 20);
    ctx.restore();

    // Display remaining lives
    for (var i = 1; i < this.lives; i++) {
        g_sprites.Extralife.drawCentredAt(ctx, 
                                          g_canvas.width - i*20, 
                                          15, 
                                          0);
    };
};