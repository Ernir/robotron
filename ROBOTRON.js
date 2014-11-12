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
var g_bgm = new Audio(g_audioUrls.music);

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
        if (!levelManager.isGameOver()) {
            entityManager.update(du);
        }
    }
	
	if (Player.getLives() === 0) {
		levelManager.gameOver();
	};//TODO: Transition to main menu or game over screen

    if (entityManager.enemiesIsEmpty()) levelManager.nextLevel();
}

// GAME-SPECIFIC DIAGNOSTICS

var g_renderSpatialDebug = false;
var g_canBeKilled = true;
var g_sounds = true;
var g_music = true;

var KEY_SPATIAL = keyCode('X');
var KEY_KILLABLE = keyCode('K');
var KEY_RESTART = keyCode('R');
var KEY_NEXT_LEVEL = 107; // Numpad +
var KEY_PREV_LEVEL = 109; // Numpad -
var KEY_SOUND = keyCode('N');
var KEY_MUSIC = keyCode('M');
var KEY_PWRUP_RESET = 96; // Numpad 0
var KEY_EXTRA_LIFE = 97; // Numpad 1
var KEY_SPEED = 98; // Numpad 2
var KEY_SCORE_MP = 99; // Numpad 3
var KEY_MACHINEGUN = 100; // Numpad 4
var KEY_SHOTGUN = 101; // Numpad 5
var KEY_SHIELD = 102; // Numpad 6

function processDiagnostics() {

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_KILLABLE)) g_canBeKilled = !g_canBeKilled;

    if (eatKey(KEY_RESTART)) {
        Player.resetAll();
        levelManager.startLevel();
    };

    if (eatKey(KEY_NEXT_LEVEL)) levelManager.nextLevel();

    if (eatKey(KEY_PREV_LEVEL)) levelManager.prevLevel();
	
	if (eatKey(KEY_SOUND)) g_sounds = !g_sounds;
	
	if (eatKey(KEY_MUSIC)) g_music = !g_music;
	
    if (g_music) g_bgm.play();
	else g_bgm.pause();

    if (eatKey(KEY_EXTRA_LIFE)) Player.addLives();

    if (eatKey(KEY_SPEED)) Player.addSpeed();

    if (eatKey(KEY_SCORE_MP)) Player.addMultiplier();

    if (eatKey(KEY_MACHINEGUN)) {
        Player.hasShotgun = false;
        Player.setFireRate(5);
        Player.addAmmo(100);
    }

    if (eatKey(KEY_SHOTGUN)) {
        Player.hasShotgun = true;
        Player.setFireRate(100);
        Player.addAmmo(100);
    }

    if (eatKey(KEY_SHIELD)) Player.addShieldTime();

    if (eatKey(KEY_PWRUP_RESET)) Player.resetAll();
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
    g_sprites.Tank = new Sprite(g_images.Tank, 0, 36); // TODO animate
    g_sprites.Spheroid = new Sprite(g_images.Spheroid, 42*6, 42*7); // TODO animate
    g_sprites.Enforcer = new Sprite(g_images.Enforcer, 0, 29); // TODO blink!
    g_sprites.Spark = new Sprite(g_images.Spark, 0, 30); // TODO animate
    
    // Spritesheets
    g_sprites.Dad = [];
    g_sprites.Protagonist = [];
    g_sprites.Brain = [];
    g_sprites.Hulk = [];
    g_sprites.Grunt = [];
    g_sprites.Electrode = [];
    g_sprites.HumanScore = [];

    for (var i = 0; i < 12; i++) {
        g_sprites.Dad[i] = new Sprite(g_images.Dad, i*30, (i+1)*30);
        g_sprites.Protagonist[i] = new Sprite(g_images.Protagonist, i*26, (i+1)*26);
        g_sprites.Brain[i] = new Sprite(g_images.Brain, i*38, (i+1)*38);
    }
    for (var i = 0; i < 9; i++) {
        g_sprites.Hulk[i] = new Sprite(g_images.Hulk, i*38, (i+1)*38);    
    }
    for (var i = 0; i < 3; i++) {
        g_sprites.Grunt[i] = new Sprite(g_images.Grunt, i*30, (i+1)*30);
        g_sprites.Electrode[i] = new Sprite(g_images.Triangle, i*27, (i+1)*27);
    }
    for (var i = 0; i < 5; i++) {
        g_sprites.HumanScore[i + 1] = new Sprite(g_images.HumanScore, 3 + (i * 34), 37 + (i * 34));
    }

    initializeEntities();
    levelManager.startLevel();

    main.init();
}

// Kick it off
requestPreloads();
