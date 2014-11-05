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
var KEY_RESTART = keyCode('R');

function processDiagnostics() {

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_KILLABLE)) g_canBeKilled = !g_canBeKilled;

    if (g_isMouseDown) entityManager.fire(g_mouseX, g_mouseY);

    if (eatKey(KEY_RESTART)) entityManager.restartGame();
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
    Player.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {
    var requiredImages = g_imgUrls;
    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {
    // Static images
    g_sprites.Skull = new Sprite(g_images.Skull);
    g_sprites.Extralife = new Sprite(g_images.Extralife);
    
    // Spritesheets
    g_sprites.Dad = [];
    for (var i = 0; i < 12; i++) {
        g_sprites.Dad[i] = new Sprite(g_images.Dad, i*30, (i+1)*30);
    }
    g_sprites.Protagonist = [];
    for (var i = 0; i < 12; i++) {
        g_sprites.Protagonist[i] = new Sprite(g_images.Protagonist, i*26, (i+1)*26);    
    }
    g_sprites.Hulk = [];
    for (var i = 0; i < 9; i++) {
        g_sprites.Hulk[i] = new Sprite(g_images.Hulk, i*38, (i+1)*38);    
    }
    g_sprites.Grunt = [];
    for (var i = 0; i < 3; i++) {
        g_sprites.Grunt[i] = new Sprite(g_images.Grunt, i*30, (i+1)*30);
    }
    g_sprites.HumanScore = [];
    for (var i = 0; i < 5; i++) {
        g_sprites.HumanScore[i + 1] = new Sprite(g_images.HumanScore, 3 + (i * 34), 37 + (i * 34));
    }
    g_sprites.Brain =[];
    for (var i = 0; i < 12; i++) {
        g_sprites.Brain[i] = new Sprite(g_images.Brain, i*38, (i+1)*38);
    }

    initializeEntities();
    entityManager.init();

    main.init();
}

// Kick it off
requestPreloads();
