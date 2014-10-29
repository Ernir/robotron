// =========
// ASTEROIDS
// =========
/*

 A sort-of-playable version of the classic arcade game.


 HOMEWORK INSTRUCTIONS:

 You have some "TODO"s to fill in again, particularly in:

 spatialManager.js

 But also, to a lesser extent, in:

 Rock.js
 EntityExample.js
 Ship.js


 ...Basically, you need to implement the core of the spatialManager,
 and modify the Rock/EntityExample/Ship to register (and unregister)
 with it correctly, so that they can participate in collisions.

 */

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


// ====================
// CREATE INITIAL SHIPS
// ====================

function initializeEntities() {
    // TODO add entities
}

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

var g_someGlobalToggle = true; // TODO: Add real booleans here

var KEY_1 = keyCode('1');  //TODO: Add real keycodes here

function processDiagnostics() {

    if (eatKey(KEY_1)) {
        // TODO do stuff on the toggle
    }
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

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        image1Name: "https://full.url/image.png" // TODO Add real URLs.
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.sprite1Name = new Sprite(g_images.image1Name); //TODO add real sprites

    entityManager.init();
    initializeEntities();

    main.init();
}

// Kick it off
requestPreloads();