//==========
//HIGHSCORES
//==========
/*
highScores.js

A module which handles local high score storage and display
*/

"use strict";

/*jslint nomen: true, white: true, plusplus: true*/

var highScores = {
    
// "PRIVATE" DATA

    _scores: [],

// "PRIVATE" METHODS
    
    deferredSetup: function () {
        for (var i = 0; i < 10; i++) {
            if (this._scores[i]) {
                this._scores[i] = window.localStorage.getItem("highscore" + i);
            } else {
                this._scores[i] = {name: "", score: 0};
            }
        }
        console.log("I have been set up!");
    },

    _save: function () {
        for (var i = 0; i < 10; i++) {
            window.localStorage.setItem("highscore" + i, this._scores[i]);
        }
    },

// PUBLIC METHODS

    add: function (data) {
        // data is an object containing a name and a score
        //console.log("data.score",data.score);
        //console.log("this._scores",this._scores);
        //console.log("this._scores[0].score",this._scores[0].score);
        for (var i = 0; i < 10; i++) {
            // Check if the score is in the top 10
            if (data.score > this._scores[i].score) {
                // Add the score and shuffle the rest down
                for (var j = 9; j > i; j--) {
                    this._scores[j] = this._scores[j-1];
                }
                this._scores[i] = data;
                break;
            }
        }
        this._save();
    },

    reset: function () {
        for (var i in this._scores) this._scores[i] = {};
        this._save();
    },

    render: function (ctx) {
        ctx.save();
        ctx.fillStyle = "white";
        var hw = g_canvas.width / 2 , hh = g_canvas.height / 2;
        ctx.textAlign = "center";
        for (var i = 0; i < 10; i++) {
            var scoreStr = this._scores[i].name + "  " + this._scores[i].score;
            ctx.fillText(scoreStr, hw, hh + i*20+30);            
        };
        ctx.restore();
    }
};

highScores.deferredSetup();