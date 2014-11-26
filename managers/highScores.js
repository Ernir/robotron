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
        console.log("Trying to set up highscores!");
        for (var i = 0; i < 10; i++) {
            /*console.log('localStorage.getItem("highscore" + i).score',JSON.parse(localStorage.getItem("highscore" + i)).score)
            if (JSON.parse(localStorage.getItem("highscore" + i)).score > 0) {
                this._scores[i] = JSON.parse(localStorage.getItem("highscore" + i));
                console.log("grabbed data from local storage");
            } else {
                this._scores[i] = {name: "", score: 0};
            }*/
            this._scores[i] = JSON.parse(localStorage.getItem("highscore" + i)) || {name: "", score: 0};
            console.log("this._scores["+i+"]",this._scores[i]);
        }
        console.log("I have set up the highscores!");
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

        // display scores
        ctx.fillStyle = "white";
        ctx.font = "bold 20px sans-serif";
        var hw = g_canvas.width / 2 , hh = g_canvas.height / 2;
        ctx.textAlign = "center";
        ctx.fillText("LOCAL", hw * 2 / 3, hh * 2 / 3);
        ctx.fillText("SERVER", hw * 4 / 3, hh * 2 / 3);
        ctx.font = "15px sans-serif";
        ctx.textAlign = "left";
        for (var i = 0; i < 10; i++) {
            var scoreStr = this._scores[i].name + "  " + this._scores[i].score;
            ctx.fillText(scoreStr, hw * 2 / 3 - 40, hh * 2 / 3 + (i+1)*20+30);
            //TODO: Add the server highscore on the right side
            ctx.fillText(scoreStr, hw * 4 / 3 - 40, hh * 2 / 3 + (i+1)*20+30);
        };

        // display title
        ctx.fillStyle = "red";
        ctx.font = "bold 60px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("HIGHSCORES", hw, hh / 3);

        // restart hint
        ctx.font = "bold 20px sans-serif";
        var str2 = "Press R to restart the game!";
        ctx.fillText(str2, hw, hh * 14 / 8);

        // Music volume display
        var vol = Math.round(g_bgm.getVolume()*100);
        if (!g_music) vol = 0;
        var volStr = "MUSIC VOLUME: "+vol+"%";
        ctx.fillStyle = "gray";
        ctx.fillText(volStr,hw,2*hh-10);

        ctx.restore();
    }
};

highScores.deferredSetup();