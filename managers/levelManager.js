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
        [2,0,6],
        [3,4,8,2],
        [5,6,10,4]
    ],
	
	_isChangingLevel: false,
	_changingTimer: 2 * SECS_TO_NOMINALS,
	
	_onMenu: true,
	_isGameOver: false,
	_isWon: false,

    // PUBLIC METHODS

    startLevel: function () {
        // Create a fresh level
        entityManager.clearAll();
        spatialManager.resetAll();
        this._isChangingLevel = true;
		this._onMenu = false;
		this._isGameOver = false;

        // Level generator
        if (Player.level >= this._levelSpecs.length) {

            var L = Player.level;
            var randomlevel = [];

            switch(true){
                case (L+1) % 10 === 0:
                    // Grunt wave
                    if (g_Debug) console.log("grunts");
                    randomlevel.push(10); // Family
                    randomlevel.push(3+Math.floor(L/3)); // Electrodes
                    randomlevel.push(Math.floor(Math.random()*6)+2*L); // Grunts
                    randomlevel.push(Math.floor(Math.random()*5)); // Hulks
                    break;
                case L % 5 === 0:
                    // Brain wave (hur hur)
                    if (g_Debug) console.log("brains");
                    randomlevel.push(15); // Family
                    randomlevel.push(3+Math.floor(L/3)); // Electrodes
                    randomlevel.push(Math.floor(Math.random()*5)+4); // Grunts
                    randomlevel.push(0); // Hulks
                    randomlevel.push(0); // Spheroids
                    randomlevel.push(Math.floor(Math.random()*7)+Math.floor(L/5)); // Brains
                    break;
                case (L+3) % 5 === 0:
                    // Tank wave
                    if (g_Debug) console.log("tanks");
                    randomlevel.push(10); // Family
                    randomlevel.push(0); // Electrodes
                    randomlevel.push(0); // Grunts
                    randomlevel.push(3+Math.floor(L/2)); // Hulks
                    randomlevel.push(0); // Spheroids
                    randomlevel.push(0); // Brains
                    randomlevel.push(Math.floor(L/2)); // Quarks
                    break;
                case (L+6) % 10 === 0:
                    // Hulk wave or Enforcer/Tank wave
                    randomlevel.push(10); // Family
                    randomlevel.push(3+Math.floor(L/3)); // Electrodes
                    if (Math.random()<0.5) {
                        if (g_Debug) console.log("enforcers/tanks");
                        randomlevel.push(0); // Grunts
                        randomlevel.push(0); // Hulks
                        randomlevel.push(4+Math.floor(L/3)); // Spheroids
                        randomlevel.push(0); // Brains
                        randomlevel.push(2+Math.floor(Math.random()*L/4)); // Quarks
                    } else {
                        if (g_Debug) console.log("hulks");
                        randomlevel.push(Math.floor(Math.random()*5)+4); // Grunts
                        randomlevel.push(6+Math.floor(L/2)); // Hulks
                        randomlevel.push(Math.floor(Math.random()*3)); // Spheroids
                    }
                    break;
                case L > 27:
                    // Normal wave + a few Quarks
                    if (g_Debug) console.log("normal+");
                    randomlevel.push(10); // Family
                    randomlevel.push(3+Math.floor(L/3)); // Electrodes
                    randomlevel.push(Math.floor(Math.random()*6)+L); // Grunts
                    randomlevel.push(Math.floor(Math.random()*6)+Math.floor(L/10)); // Hulks
                    randomlevel.push(Math.floor(Math.random()*3)); // Spheroids
                    randomlevel.push(Math.floor(Math.random()*3)); // Quarks
                    break;
                default:
                    // Normal wave
                    if (g_Debug) console.log("normal");
                    randomlevel.push(10); // Family
                    randomlevel.push(3+Math.floor(L/3)); // Electrodes
                    randomlevel.push(Math.floor(Math.random()*6)+L); // Grunts
                    randomlevel.push(Math.floor(Math.random()*6)+Math.floor(L/10)); // Hulks
                    randomlevel.push(Math.floor(Math.random()*3)); // Spheroids
            }

            if (g_Debug) {
                console.log("This level consists of:",randomlevel);
                console.log("Key: [Family, Electrodes, Grunts, Hulks, Spheroids, Brains, Quarks]");
                console.log("");
            }
            entityManager.init(randomlevel);
			
        } else {
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
		
		ctx.save();

		// TODO: Add a good color sceme
		
		if (this._changingTimer > SECS_TO_NOMINALS) {
		
			var range = (2 * SECS_TO_NOMINALS - this._changingTimer) / SECS_TO_NOMINALS;
			var currentLayer = Math.floor(range * layers);
			
			for (var i = 1; i < currentLayer; i++) {
				if (i % consts.colors.length < i*consts.colors.length) { 
					ctx.fillStyle = consts.colors[i%consts.colors.length];
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
				if (i % consts.colors.length < i*consts.colors.length) { 
					ctx.fillStyle = consts.colors[i%consts.colors.length];
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
		
		ctx.restore();
		
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
// Main Menu Methods
	
	isInMenu: function () {
		return this._onMenu;
	},
	
	renderMenu: function (ctx) {
		this.drawMenu("ROBOTRON");
	},
	
	drawMenu: function (str, re) {
		if(str==undefined) str="";
		if(re!=="re") re="";
		var str2="Press R to "+re+"start the game!";
		var hw=g_canvas.width/2 ,hh=g_canvas.height/2;
		ctx.save();
			ctx.font = "bold 60px sans-serif";
			ctx.fillStyle ="rgba(255,255,255,0.3)"; //not sure if you want this
			ctx.fillRect(0, hh/2, hw*2, hh);
			ctx.fillStyle ="red";
			ctx.textAlign = "center";
			ctx.fillText(str, hw, hh);
			ctx.font = "bold 20px sans-serif";
			ctx.fillText(str2,hw,hh*3/2-10); //10 is the font's halfheight
		ctx.restore();
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
		//TODO: Add Highscore
		this.drawMenu("GAME OVER", "re");
	}
};