/*

 entityManager.js

 A module which handles arbitrary entity-management for "Robotron"


 We create this module as a single global object, and initialise it
 with suitable 'data' and 'methods'.

 "Private" properties are denoted by an underscore prefix convention.

 */


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

    _protagonists: [],
	_families: [],
	_enemies: [],
	_bullets: [],

// "PRIVATE" METHODS

    _generateThings: function () {
        //TODO: Generate some
    },

    _forEachOf: function (aCategory, fn) {
        for (var i = 0; i < aCategory.length; ++i) {
            fn.call(aCategory[i]);
        }
    },

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
    KILL_ME_NOW: -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
    deferredSetup: function () {
        this._categories = [this._protagonists, this._bullets, this._families, this._enemies];
    },

    init: function () {
        this._generateThings();
    },

    createProtagonist: function (descr) {
        this._protagonists.push(new Protagonist(descr));
    },
	
	fireBullet: function (aimX, aimY) {
		for (var p in this._protagonists) {
			p.fireBullet (aimX, aimY);
		}
	},

    update: function (du) {

        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];
            var i = 0;

            while (i < aCategory.length) {

                var status = aCategory[i].update(du);

                if (status === this.KILL_ME_NOW) {
                    // remove the dead guy, and shuffle the others down to
                    // prevent a confusing gap from appearing in the array
                    aCategory.splice(i, 1);
                }
                else {
                    ++i;
                }
            }
        }
    },

    render: function (ctx) {

        var debugX = 10, debugY = 100;

        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];

            for (var i = 0; i < aCategory.length; ++i) {

                aCategory[i].render(ctx);

            }
            debugY += 10;
        }
    }

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

