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
        delete this._entities[spatialID];
    },

    findEntityInRange: function (posX, posY, radius) {

        // for-in loop used due to sparseness of the _entities array.
        for (var i in this._entities) {
            var entity = this._entities[i];
            // Circle-based distance checking
            var distSq = util.distSq(posX, posY, entity.cx, entity.cy);
            var limSq = util.square(radius + entity.getRadius());
            if (distSq < limSq) {
                return entity;
            }
        }
        return null;

    },

    resetAll: function () {
        this._nextSpatialID = 1;
        this._entities.length=0;
    },

    render: function (ctx) {
        var oldStyle = ctx.strokeStyle;
        ctx.strokeStyle = "red";

        for (var ID in this._entities) {
            var e = this._entities[ID];
            util.strokeCircle(ctx, e.cx, e.cy, e.getRadius());
        }
        ctx.strokeStyle = oldStyle;
    }

};
