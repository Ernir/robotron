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

    if (levelManager.isChangingLevel()) {
        levelManager.reduceTimer(du);
    } else {
        entityManager.update(du);
    }
	
	if (Player.getLives() === 0) {
		levelManager.gameOver();
	};//TODO: Transition to main menu or game over screen

    if (entityManager.enemiesIsEmpty()) levelManager.nextLevel();
}

// GAME-SPECIFIC DIAGNOSTICS

var g_renderSpatialDebug = false;
var g_canBeKilled = true;

var KEY_SPATIAL = keyCode('X');
var KEY_KILLABLE = keyCode('K');
var KEY_RESTART = keyCode('R');
var KEY_NEXT_LEVEL = 107;
var KEY_PREV_LEVEL = 109;

function processDiagnostics() {

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_KILLABLE)) g_canBeKilled = !g_canBeKilled;

    if (eatKey(KEY_RESTART)) {
        Player.resetAll();
        levelManager.startLevel();
    };

    if (eatKey(KEY_NEXT_LEVEL)) levelManager.nextLevel();

    if (eatKey(KEY_PREV_LEVEL)) levelManager.prevLevel();
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

    if (levelManager.isChangingLevel()) {
	
        levelManager.renderLevelChanger(ctx);
		
	} else if (levelManager.isGameOver()) {
	
		levelManager.renderGameOver(ctx);
		
    } else {
	
        entityManager.render(ctx);
        renderCrosshair(ctx);
        if (g_renderSpatialDebug) spatialManager.render(ctx);
    }
	
    Player.render(ctx);
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
    g_sprites.Prog = new Sprite(g_images.Prog);

    g_sprites.Quark = new Sprite(g_images.Quark, 42*4, 42*5); // TODO animate
    
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
    g_sprites.Brain = [];
    for (var i = 0; i < 12; i++) {
        g_sprites.Brain[i] = new Sprite(g_images.Brain, i*38, (i+1)*38);
    }
    g_sprites.Electrode = [];
    for (var i = 0; i < 3; i++) {
        g_sprites.Electrode[i] = new Sprite(g_images.Triangle, i*27, (i+1)*27);
    }

    initializeEntities();
    levelManager.startLevel();

    main.init();
}

// Kick it off
requestPreloads();
