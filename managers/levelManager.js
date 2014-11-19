//=============
//LEVEL MANAGER
//=============
/*
 levelManager.js

 A module which handles level selection and transition.
 */

"use strict";

// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/

var levelManager = {

    // "PRIVATE" DATA
    _levelSpecs: [
        // Each number in the level array represents how many entities of the
        // corresponding type should be created. There is always one protagonist,
        // so we skip him in the level description
        // Key:
        // Family, Electrodes, Grunts, Hulks, Spheroids, Brains, Quarks (not the Star Trek DS9 version)

        [], // level "0", skipped automatically
        [2, 0, 6],
        [3, 4, 8, 2],
        [5, 6, 10, 4]
    ],
	
	_levelChangingSound: new Audio(g_audioUrls.newlevel),

    _isChangingLevel: false,
	_isRefreshingLevel: false,
    _changingTimer: 2 * SECS_TO_NOMINALS,

    _onMenu: true,
    _isGameOver: false,
    _isWon: false,

    // Less private data
    numberOfEntities: 0, // Default, overridden in startLevel().

    // PUBLIC METHODS

    startLevel: function () {
        document.getElementById("formDiv").className = "hidden";
        // Create a fresh level
        entityManager.clearAll();
        spatialManager.resetAll();
        this._isChangingLevel = true;
        this._onMenu = false;
        this._isGameOver = false;

        var randomLevelRequired = Player.level >= this._levelSpecs.length;
        var L = Player.level;
        if (L % 5 !== 0 && g_sounds) this._levelChangingSound.play();

        // A hack to remove the lag from the first power up
        if (L === 1) entityManager.createPowerup(0,0);

        if (randomLevelRequired) {
            var randomlevel = util.generateLevel(L);
            entityManager.init(randomlevel);

            this.numberOfEntities = randomlevel.reduce(function (a, b) {
                return a + b;
            }, 0);
        }
        else {
            entityManager.init(this._levelSpecs[Player.level]);
            this.numberOfEntities = this._levelSpecs[Player.level].reduce(function (a, b) {
                return a + b;
            }, 0);
        }
    },

    continueLevel: function () {
        // Reset all remaining entities in the level
        // Used when the player dies, but has extra lives remaining
        this._isChangingLevel = true;
		this._isRefreshingLevel = true;
    },

    nextLevel: function () {
        Player.addLevel();
        this.startLevel();
    },

    prevLevel: function () {
        Player.subtractLevel();
        this.startLevel();
    },

    renderLevelChanger: function (ctx) {

        var halfWidth = g_canvas.width / 2;
        var halfHeight = (g_canvas.height - consts.wallTop) / 2;
        var yMiddle = consts.wallTop + halfHeight;
        var layerOffsetX = 5;
        var layerOffsetY = halfHeight / (halfWidth / layerOffsetX);
        var layers = halfWidth / layerOffsetX;

        ctx.save();

		if (this._isRefreshingLevel) {
			
			var alpha;
			if (this._changingTimer > SECS_TO_NOMINALS) {
				alpha = (2 * SECS_TO_NOMINALS - this._changingTimer) / SECS_TO_NOMINALS;
			} else {
				alpha = this._changingTimer / SECS_TO_NOMINALS;
				if (alpha < 0) alpha = 0;
				entityManager.clearPartial();
				entityManager.resetPos();
			}
			ctx.globalAlpha = alpha;
			ctx.fillStyle = "red";
			ctx.fillRect(
					consts.wallLeft, 
					consts.wallTop + consts.wallThickness,
					consts.wallRight - consts.wallThickness,
					consts.wallBottom - consts.wallThickness
			);
			
		} else {
		
			if (this._changingTimer > SECS_TO_NOMINALS) {

				var range = (2 * SECS_TO_NOMINALS - this._changingTimer) / SECS_TO_NOMINALS;
				var currentLayer = Math.floor(range * layers);

				for (var i = 1; i < currentLayer; i++) {
					if (i % consts.colors.length < i * consts.colors.length) {
						ctx.fillStyle = consts.colors[i % consts.colors.length];
					}
					ctx.fillRect(
							halfWidth - i * layerOffsetX,
							yMiddle - i * layerOffsetY,
							i * layerOffsetX * 2,
							i * layerOffsetY * 2
					);
				}
			} else {

				var range = this._changingTimer / SECS_TO_NOMINALS;
				var currentLayer = Math.ceil(range * layers);

				for (var i = 1; i < currentLayer; i++) {
					if (i % consts.colors.length < i * consts.colors.length) {
						ctx.fillStyle = consts.colors[i % consts.colors.length];
					}
					ctx.fillRect(
							i * layerOffsetX,
							consts.wallTop + i * layerOffsetY,
							g_canvas.width - i * layerOffsetX * 2,
							g_canvas.height - consts.wallTop - i * layerOffsetY * 2
					);
				}

				range = (SECS_TO_NOMINALS - this._changingTimer) / SECS_TO_NOMINALS;
				currentLayer = Math.ceil(range * layers);

				ctx.fillStyle = "black";
				ctx.fillRect(
						halfWidth - currentLayer * layerOffsetX,
						yMiddle - currentLayer * layerOffsetY,
						currentLayer * layerOffsetX * 2,
						currentLayer * layerOffsetY * 2
				);
			}
		}

        ctx.restore();

        // Reset changing timer when level changing is complete
        if (this._changingTimer < 0) {
            this._isChangingLevel = false;
			this._isRefreshingLevel = false;
            this._changingTimer = 2 * SECS_TO_NOMINALS;
        }
    },

    reduceTimer: function (du) {
        this._changingTimer -= du;
    },

    isChangingLevel: function () {
        return this._isChangingLevel;
    },
	
	isRefreshingLevel: function () {
        return this._isRefreshingLevel;
    },

// -----------------
// Main Menu Methods

    isInMenu: function () {
        return this._onMenu;
    },

    renderMenu: function (ctx) {
        this.drawMenu("ROBOTRON");
    },

    drawMenu: function (str, re) {
        if (str == undefined) str = "";
        if (re !== "re") re = "";
        var str2 = "Press R to " + re + "start the game!";
        var hw = g_canvas.width / 2 , hh = g_canvas.height / 2;
        ctx.save();
        ctx.font = "bold 60px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.3)"; //not sure if you want this
        ctx.fillRect(0, hh / 2, hw * 2, hh);
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText(str, hw, hh);
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(str2, hw, hh * 3 / 2 - 10); //10 is the font's halfheight
        
        // Music volume display
        var vol = Math.round(g_bgm.getVolume()*100);
        if (!g_music) vol = 0;
        var volStr = "MUSIC VOLUME: "+vol+"%";
        ctx.fillStyle = "gray";
        ctx.fillText(volStr,hw,2*hh-10);
        ctx.restore();
    },

// -----------------
// Game Over Methods

    gameOver: function () {
        this._isGameOver = true;
        this._isChangingLevel = true;
        Player.addLives();
        //document.getElementById("formDiv").className = "";
    },

    isGameOver: function () {
        return this._isGameOver;
    },

    renderGameOver: function (ctx) {
        //TODO: Add Highscore
        this.drawMenu("GAME OVER", "re");
    }
};