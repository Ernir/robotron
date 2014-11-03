// =========
// ROBOTRON
// =========
/*

 A sort-of-playable version of the classic arcade game.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


// =======================
// CREATE INITIAL ENTITIES
// =======================

function initializeEntities() {
    // TODO
}
var Player = new Player();

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    processDiagnostics();

    entityManager.update(du);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_renderSpatialDebug = false;
var g_canBeKilled = true;

var KEY_SPATIAL = keyCode('X');
var KEY_KILLABLE = keyCode('K');

function processDiagnostics() {

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_KILLABLE)) g_canBeKilled = !g_canBeKilled;
	
	if (g_isMouseDown) entityManager.fire(g_mouseX, g_mouseY);
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).1
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);
	
	renderCrosshair(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        protagonist: "https://notendur.hi.is/~eth31/cgp/staticdata/sprites/Player.png",
        grunt : "https://notendur.hi.is/~eth31/cgp/staticdata/sprites/Grunt.png",
        hulk: "https://notendur.hi.is/~eth31/cgp/staticdata/sprites/Hulk.png",
        family : "https://notendur.hi.is/~eth31/cgp/staticdata/Shapes/extralife.png",
        skull : "https://notendur.hi.is/~eth31/cgp/staticdata/Shapes/Skull.png",
        score : "https://notendur.hi.is/~eth31/cgp/staticdata/Numbers%20and%20letters/HumanScore.png",
        extralife : "https://notendur.hi.is/~eth31/cgp/staticdata/Shapes/extralife.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.protagonist = new Sprite(g_images.protagonist,0,26);
    g_sprites.grunt = new Sprite(g_images.grunt, 0, 30);
    g_sprites.hulk = new Sprite(g_images.hulk, 0, 40);
    g_sprites.family = new Sprite(g_images.family);
    g_sprites.skull = new Sprite(g_images.skull);
    g_sprites.score = [];
    for (var i = 0; i < 5; i++) {
        g_sprites.score[i+1] = new Sprite(g_images.score, 3+(i*34), 37+(i*34));
    }
    g_sprites.extralife = new Sprite(g_images.extralife);

	initializeEntities();
    entityManager.init();

    main.init();
}

// Kick it off
requestPreloads();
