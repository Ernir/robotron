//===========
//SCORE IMAGE
//===========
/*

An object which displays a score for a short time

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function ScoreImg(descr) {

//ScoreImg.prototype.setup = function (descr) {
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
}

ScoreImg.prototype.timer = 1 * SECS_TO_NOMINALS;

ScoreImg.prototype.update = function (du) {
    if (this.timer < 0) {
        return entityManager.KILL_ME_NOW;
    }else{
        this.timer += -du;
    }
};

ScoreImg.prototype.render = function (ctx) {
    g_sprites.HumanScore[this.m].drawCentredAt(ctx,
                                               this.cx,
                                               this.cy,
                                               0);
};