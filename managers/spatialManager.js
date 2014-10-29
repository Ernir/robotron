/*

 spatialManager.js

 A module which handles spatial lookup, as required for...
 e.g. general collision detection.

 */

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */

var spatialManager = {

// "PRIVATE" DATA

    _nextSpatialID: 1, // make all valid IDs non-falsey (i.e. don't start at 0)

    _entities: [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

    getNewSpatialID: function () {
        // Use it, then increment.
        // Leads to unfortunate bloat in the size of the largest index of the _entities
        // array, but it did not seem to cause problems with a few thousand spawns.
        return this._nextSpatialID++;
    },

    register: function (entity) {
        var spatialID = entity.getSpatialID();
        this._entities[spatialID] = entity;
    },

    unregister: function (entity) {
        var spatialID = entity.getSpatialID();

        // Unregistering means "deletion" from the _entities array.
        // This fills the array with "undefined"s, but the for-in loops (see below)
        // seem to not care.
        // Splicing completely messes up the indexes.
        delete this._entities[spatialID];
    }

};
