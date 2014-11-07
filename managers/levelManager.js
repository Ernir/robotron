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

    // PUBLIC METHODS

    startLevel: function () {
        // Create a fresh level
        //TODO: Call level transition screen
        entityManager.clearAll();
        spatialManager.resetAll();
        //if Player.level > this._levelSpecs make random level
        if (Player.level > this._levelSpecs.length) {
            var randomlevel = [];
            console.log("hi");
            console.log("randomlevel1:",randomlevel);
            //TODO: uppfæra lykkjufjöldan til að vera í samræmi við fjölda óvina + family
            for (var i = 0; i < 5; i++) {
                randomlevel.push(Math.floor(Math.random()*10));
            };
            console.log("randomlevel2:",randomlevel);
            entityManager.init(randomlevel);
        }else{
            entityManager.init(this._levelSpecs[Player.level]);
        }
        //TODO: Add sound
    },

    continueLevel: function () {
        // Reset all remaining entities in the level
        // Used when the player dies, but has extra lives remaining
        //TODO: Call level transition screen

		entityManager.resetPos();

        //TODO: Add sound
    },

    nextLevel: function () {
        //TODO: Call level transition screen
        Player.addLevel();
        this.startLevel();
        console.log("Yo");
        console.log("_levelSpecs.length:",this._levelSpecs.length);
        //TODO: Add sound
    },

    prevLevel: function () {
        //TODO: Call level transition screen
        Player.subtractLevel();
        this.startLevel();
        //TODO: Add sound
    }    
};