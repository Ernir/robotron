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
        for (var i = 0; i < 10; i++) {
            this._localScores[i] = JSON.parse(localStorage.getItem("highscore" + i)) || {name: "", score: 0};
            this._serverScores[i] = {name: "", score: 0};
        }
    },

    _save: function () {
        for (var i = 0; i < 10; i++) {
            localStorage.setItem("highscore" + i, JSON.stringify(this._localScores[i]));
        }
        console.log("Score saved");
    },

// PUBLIC METHODS

    addLocalScore: function (data) {
        // data is an object containing a name and a score
        if (g_hasCheated) return;
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
        this._serverScores.push(data);
    },

    reset: function () {
        for (var i in this._localScores) this._localScores[i] = {name: "", score: 0};
        this._save();
    },

    resetServerScore: function () {
        this._serverScores = [];
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
            for (var i = 0; i < $("#highscoreList").find('li').length; i++) {
                ctx.textAlign = "right";
                var nameStr = this._localScores[i].name;
                ctx.fillText(nameStr, hw * 2 / 3 - 10, hh * 2 / 3 + (i+1)*20+30);
                ctx.textAlign = "left";
                var scoreStr = this._localScores[i].score;
                ctx.fillText(scoreStr, hw * 2 / 3, hh * 2 / 3 + (i+1)*20+30);
                
                ctx.textAlign = "right";
                nameStr = this._serverScores[i].name;
                ctx.fillText(nameStr, hw * 4 / 3, hh * 2 / 3 + (i+1)*20+30);
                ctx.textAlign = "left";
                scoreStr = this._serverScores[i].score;
                ctx.fillText(scoreStr, hw * 4 / 3 + 10, hh * 2 / 3 + (i+1)*20+30);
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