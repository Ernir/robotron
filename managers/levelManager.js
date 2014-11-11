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
    // Family, Grunts, Hulks, Brains, Electrodes //TODO: add more entities

        [], // level "0", skipped automatically
        [3,6],
        [4,10],
        [5,6,1],
        [5,8,3],
        [4,0,0,2],
        [6,6,2,1],
        [6,10,3,3],
        [5,0,2,5]
    ],
	
	_isChangingLevel: false,
	_changingTimer: 2 * SECS_TO_NOMINALS,
	
	_isGameOver: false,
	_isWon: false,

    // PUBLIC METHODS

    startLevel: function () {
        // Create a fresh level
        entityManager.clearAll();
        spatialManager.resetAll();
        this._isChangingLevel = true;
		this._isGameOver = false;

        //if Player.level > the number of pre-made levels
        //then make a random level
        if (Player.level >= this._levelSpecs.length) {
            var randomlevel = [];
            //TODO: update the loop according to the number of enemy + family types
            for (var i = 0; i < 5; i++) {
                randomlevel.push(Math.floor(Math.random()*10));
            };
            entityManager.init(randomlevel);
        }else{
            entityManager.init(this._levelSpecs[Player.level]);
        }
    },

    continueLevel: function () {
        // Reset all remaining entities in the level
        // Used when the player dies, but has extra lives remaining
        entityManager.clearPartial();
		entityManager.resetPos();
        this._isChangingLevel = true; //TODO: Different animation?
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
		// TODO: Add sound
		var halfWidth = g_canvas.width / 2;
		var halfHeight = (g_canvas.height - consts.wallTop) / 2;
		var yMiddle = consts.wallTop + halfHeight;
		var layerOffsetX = 5;
		var layerOffsetY = halfHeight / (halfWidth / layerOffsetX);
		var layers = halfWidth / layerOffsetX;
		
		var prevfillStyle = ctx.fillStyle;

		// TODO: Add a good color sceme
		
		if (this._changingTimer > SECS_TO_NOMINALS) {
		
			var range = (2 * SECS_TO_NOMINALS - this._changingTimer) / SECS_TO_NOMINALS;
			var currentLayer = Math.floor(range * layers);
			
			for (var i = 1; i < currentLayer; i++) {
				if (i % 9 < 9) ctx.fillStyle = "red";
				if (i % 9 < 6) ctx.fillStyle = "#FF55A3";
				if (i % 9 < 3) ctx.fillStyle = "blue";
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
				if (i % 6 < 6) ctx.fillStyle = "red";
				if (i % 6 < 4) ctx.fillStyle = "#FF55A3";
				if (i % 6 < 2) ctx.fillStyle = "blue";
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
		
		ctx.fillStyle = prevfillStyle;
		
		// Reset changing timer when level changing is complete
		if (this._changingTimer < 0) {
			this._isChangingLevel = false;
			this._changingTimer = 2 * SECS_TO_NOMINALS;
		}
	},
	
	reduceTimer: function (du) {
		this._changingTimer -= du;
	},

	isChangingLevel: function () {
		return this._isChangingLevel;
	},
	
// -----------------
// Game Over Methods
	
	gameOver: function () {
		this._isGameOver = true;
		this._isChangingLevel = true;
		Player.addLives();
	},
	
	isGameOver: function () {
		return this._isGameOver;
	},
	
	renderGameOver: function (ctx) {
		// TODO: Game over screen and maybe animation
		//score
		var prevfillStyle = ctx.fillStyle;
		var str = "", hw=g_canvas.width/2 ,hh=g_canvas.height/2;
		ctx.font = "bold 60px sans-serif"
		ctx.fillStyle ="rgba(255,255,255,0.3)"; //not sure if you want this
		ctx.fillRect(0, hh/2, hw*2, hh);
		ctx.fillStyle ="red";
		var prevTextAlign = ctx.textAlign;
		ctx.textAlign = "center";
		str = "GAME OVER";
		ctx.fillText(str, hw, hh);
		str = "Press R to restart";
		ctx.font = "bold 20px sans-serif"
		ctx.fillText(str,hw,hh*3/2-10); //10 is the font's halfheight
		ctx.fillStyle = prevfillStyle;
		ctx.textAlign = prevTextAlign;
	}
};