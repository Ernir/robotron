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
        [5,6,1]
    ],

    // PUBLIC METHODS

    startLevel: function () {
        // Create a fresh level
        //TODO: Call level transition screen
        entityManager.clearAll();
        spatialManager.resetAll();
        entityManager.init(this._levelSpecs[Player.level]);
        //TODO: Add sound
    },

    continueLevel: function () {
        // Reset all remaining entities in the level
        // Used when the player dies, but has extra lives remaining
        //TODO: Call level transition screen

        //entityManager.resetPos();

        //TODO: Add sound
    },

    nextLevel: function () {
        //TODO: Call level transition screen
        Player.addLevel();
        this.startLevel();
        //TODO: Add sound
    },

    prevLevel: function () {
        //TODO: Call level transition screen
        Player.subtractLevel();
        this.startLevel();
        //TODO: Add sound
    }    
};