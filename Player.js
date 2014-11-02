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

Player.prototype.lives = 5;
Player.prototype.score = 0;
Player.prototype.level = 1;

Player.prototype.updateScore = function (score) {
    this.score += score;
};

Player.prototype.updateLives = function (integer) {
    this.lives += integer;
};

Player.prototype.updateLevel = function (integer) {
    this.level += integer;
};

Player.prototype.getScore = function() {
    return this.score;
};

Player.prototype.getLives = function() {
    return this.lives;
};

Player.prototype.getLevel = function() {
    return this.level;
};

Player.prototype.render = function(ctx) {
    // Display the score
    ctx.save();
    ctx.lineWidth = 2;
    ctx.font = "10px Arial";
    ctx.strokeStyle = "red";
    ctx.strokeText(this.score, 10, 10);
    ctx.restore();

    // Display remaining lives
    for (var i = 1; i < this.lives; i++) {
        g_sprites.family.drawCentredAt(ctx, 
                                       g_canvas.width - i*20, 
                                       15, 
                                       0);
    };
};