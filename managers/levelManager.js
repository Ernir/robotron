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
    _levelSpecs: {
        1 : {
            Protagonist : 1,
            Family : 3,
            Grunt : 6
        },
        2 : {
            Protagonist : 1,
            Family : 4,
            Grunt : 10
        }
        3 : {
            Protagonist : 1,
            Family : 5,
            Grunt : 6,
            Hulk : 1
        },
        4 : {
            Protagonist : 1,
            Family : 6,
            Grunt : 8,
            Hulk : 2
        },
        5 : {
            Protagonist : 1,
            Family : 5,
            Brain : 3
        },
        6 : {
            Protagonist : 1,
            Family : 6,
            Grunt : 6,
            Hulk : 1,
            Brain : 1
        },
        7 : {
            Protagonist : 1,
            Family : 6,
            Grunt : 10,
            Hulk : 2,
            Brain : 1
        },
        8 : {
            Protagonist : 1,
            Family : 8,
            Grunt : 12,
            Hulk : 4,
            Brain : 3
        },
        9 : {
            Protagonist : 1,
            Family : 8,
            Grunt : 16,
            Hulk : 4,
            Brain : 4
        },
        10 : {
            Protagonist : 1,
            Family : 8,
            Grunt : 20,
            Hulk : 5,
            Brain : 5
        }
    },

    // PUBLIC METHODS

    startLevel: function (LevelDesctiption) {
        //entityManager.clearCategories();
        //for each in LevelDesctiption create in entityManager
    },

    nextLevel: function () {
        Player.addlevel();
        this.startLevel();
    },

    prevLevel: function () {
        Player.subtractlevel();
        this.startLevel();
    }    
};