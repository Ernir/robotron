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
            console.log('localStorage.getItem("highscore" + i).score',JSON.parse(localStorage.getItem("highscore" + i)).score)
            if (JSON.parse(localStorage.getItem("highscore" + i)).score > 0) {
                this._scores[i] = JSON.parse(localStorage.getItem("highscore" + i));
                console.log("grabbed data from local storage");
            } else {
                this._scores[i] = {name: "", score: 0};
            }
        }
        console.log("I have been set up!");
    },

    _save: function () {
        console.log("I'm about to save");
        for (var i = 0; i < 10; i++) {
            localStorage.setItem("highscore" + i, JSON.stringify(this._scores[i]));
        }
        console.log("I have saved");
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
        for (var i in this._scores) this._scores[i] = {name: "", score: 0};
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