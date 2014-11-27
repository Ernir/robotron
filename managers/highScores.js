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

    _localScores: [],
    _serverScores: [],
    _name: "",
    _render: false,

// "PRIVATE" METHODS
    
    deferredSetup: function () {
        console.log("Trying to set up highscores!");
        for (var i = 0; i < 10; i++) {
            /*console.log('localStorage.getItem("highscore" + i).score',JSON.parse(localStorage.getItem("highscore" + i)).score)
            if (JSON.parse(localStorage.getItem("highscore" + i)).score > 0) {
                this._localScores[i] = JSON.parse(localStorage.getItem("highscore" + i));
                console.log("grabbed data from local storage");
            } else {
                this._localScores[i] = {name: "", score: 0};
            }*/
            this._localScores[i] = JSON.parse(localStorage.getItem("highscore" + i)) || {name: "", score: 0};
            this._serverScores[i] = {name: "", score: 0};
            console.log("this._localScores["+i+"]",this._localScores[i]);
        }
        console.log("I have set up the highscores!");
    },

    _save: function () {
        console.log("I'm about to save");
        for (var i = 0; i < 10; i++) {
            localStorage.setItem("highscore" + i, JSON.stringify(this._localScores[i]));
        }
        console.log("I have saved");
    },

// PUBLIC METHODS

    addLocalScore: function (data) {
        // data is an object containing a name and a score
        //console.log("data.score",data.score);
        //console.log("this._localScores",this._localScores);
        //console.log("this._localScores[0].score",this._localScores[0].score);
        for (var i = 0; i < 10; i++) {
            // Check if the score is in the top 10
            if (data.score > this._localScores[i].score) {
                // Add the score and shuffle the rest down
                for (var j = 9; j > i; j--) {
                    this._localScores[j] = this._localScores[j-1];
                }
                this._localScores[i] = data;
                break;
            }
        }
        this._save();
    },

    addServerScore: function (data) {
        for (var i = 0; i < 10; i++) {
            // Check if the score is in the top 10
            if (data.score > this._serverScores[i].score) {
                // Add the score and shuffle the rest down
                for (var j = 9; j > i; j--) {
                    this._serverScores[j] = this._serverScores[j-1];
                }
                this._serverScores[i] = data;
                break;
            }
        }
    },

    reset: function () {
        for (var i in this._localScores) this._localScores[i] = {name: "", score: 0};
        this._save();
    },

    setName: function (Name) {
        this._name = Name;
    },

    getName: function () {
        return this._name;
    },

    renderON: function () {
        this._render = true;
    },

    renderOFF: function () {
        this._render = false;
    },

    render: function (ctx) {
        if (this._render) {
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
                var scoreStr = this._localScores[i].name + "  " + this._localScores[i].score;
                ctx.fillText(scoreStr, hw * 2 / 3 - 40, hh * 2 / 3 + (i+1)*20+30);
                //TODO: Add the server highscore on the right side
                var scoreStr2 = this._serverScores[i].name + "  " + this._serverScores[i].score;
                ctx.fillText(scoreStr2, hw * 4 / 3 - 40, hh * 2 / 3 + (i+1)*20+30);
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
    }
};

highScores.deferredSetup();