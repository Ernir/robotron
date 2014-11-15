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

var g_Debug = false;
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

    if (eatKey(KEY_SPATIAL)) g_Debug = !g_Debug;

    if (eatKey(KEY_KILLABLE) && g_Debug) g_canBeKilled = !g_canBeKilled;

    if (eatKey(KEY_RESTART)) {
        Player.resetAll();
        levelManager.startLevel();
    };

    if (eatKey(KEY_NEXT_LEVEL) && g_Debug) levelManager.nextLevel();

    if (eatKey(KEY_PREV_LEVEL) && g_Debug) levelManager.prevLevel();
	
	if (eatKey(KEY_SOUND)) g_sounds = !g_sounds;
	
	if (eatKey(KEY_MUSIC)) g_music = !g_music;
	
    if (g_music) g_bgm.play();
	else g_bgm.pause();

    if (eatKey(KEY_EXTRA_LIFE) && g_Debug) Player.addLives();

    if (eatKey(KEY_SPEED) && g_Debug) Player.addSpeed();

    if (eatKey(KEY_SCORE_MP) && g_Debug) Player.addMultiplier();

    if (eatKey(KEY_MACHINEGUN) && g_Debug) {
        Player.hasShotgun = false;
        Player.setFireRate(5);
        Player.addAmmo(100);
    }

    if (eatKey(KEY_SHOTGUN) && g_Debug) {
        Player.hasShotgun = true;
        Player.setFireRate(70);
        Player.addAmmo(100);
    }

    if (eatKey(KEY_SHIELD) && g_Debug) Player.addShieldTime();

    if (eatKey(KEY_PWRUP_RESET) && g_Debug) Player.resetAll();
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
        if (g_Debug) spatialManager.render(ctx);
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
	g_sprites.Wing = new Sprite(g_images.Wing);
	g_sprites.Shield = new Sprite(g_images.Shield);
	g_sprites.Heart = new Sprite(g_images.Heart);
	g_sprites.Ammo = new Sprite(g_images.Ammo);
	g_sprites.Shotgun = new Sprite(g_images.Shotgun);

    //g_sprites.Quark = new Sprite(g_images.Quark, 42*4, 42*5); // TODO animate
    //g_sprites.Tank = new Sprite(g_images.Tank, 0, 36); // TODO animate
    //g_sprites.Spheroid = new Sprite(g_images.Spheroid, 42*6, 42*7); // TODO animate
    g_sprites.Enforcer = new Sprite(g_images.Enforcer, 0, 29); // TODO blink!
    g_sprites.Spark = new Sprite(g_images.Spark, 0, 30); // TODO animate
    
    // Spritesheets
    g_sprites.Dad = [];
    g_sprites.Mom = [];
    g_sprites.Child = [];
    g_sprites.Protagonist = [];
    g_sprites.Brain = [];
    g_sprites.Hulk = [];
    g_sprites.Grunt = [];
    g_sprites.Electrode = [];
    g_sprites.HumanScore = [];
    g_sprites.Spheroid = [];
    g_sprites.Quark = [];
    g_sprites.Tank = [];

    for (var i = 0; i < 12; i++) {
        g_sprites.Dad.push(new Sprite(g_images.Dad, i*30, (i+1)*30));
        g_sprites.Mom.push(new Sprite(g_images.Mom, i*26, (i+1)*26));
        g_sprites.Child.push(new Sprite(g_images.Child, i*22, (i+1)*22));
        g_sprites.Protagonist.push(new Sprite(g_images.Protagonist, i*26, (i+1)*26));
        g_sprites.Brain.push(new Sprite(g_images.Brain, i*38, (i+1)*38));
    }

    g_sprites.Family = g_sprites.Dad.concat(g_sprites.Mom, g_sprites.Child);
    
    // One of the Brain sprites it misaligned on the spritesheet
    g_sprites.Brain[6] = new Sprite(g_images.Brain, 226, 263, 2);

    for (var i = 0; i < 9; i++) {
        g_sprites.Hulk.push(new Sprite(g_images.Hulk, i*38, (i+1)*38));    
    }
    for (var i = 0; i < 3; i++) {
        g_sprites.Grunt.push(new Sprite(g_images.Grunt, i*30, (i+1)*30));
    }
    for (var i = 0; i < 5; i++) {
        g_sprites.HumanScore[i + 1] = new Sprite(g_images.HumanScore, 3 + (i * 34), 37 + (i * 34));
    }

    g_sprites.Electrode.push(new Sprite(g_images.Triangle, 2, 20));
    g_sprites.Electrode.push(new Sprite(g_images.Triangle, 36, 48));
    g_sprites.Electrode.push(new Sprite(g_images.Triangle, 70, 76));
    g_sprites.Electrode.push(new Sprite(g_images.Square, 6, 22));
    g_sprites.Electrode.push(new Sprite(g_images.Square, 39, 53));
    g_sprites.Electrode.push(new Sprite(g_images.Square, 73, 79));
    g_sprites.Electrode.push(new Sprite(g_images.Rectangle, 5, 15));
    g_sprites.Electrode.push(new Sprite(g_images.Rectangle, 29, 35));
    g_sprites.Electrode.push(new Sprite(g_images.Rectangle, 53, 55));
    g_sprites.Electrode.push(new Sprite(g_images.Dizzy, 7, 26));
    g_sprites.Electrode.push(new Sprite(g_images.Dizzy, 37, 51));
    g_sprites.Electrode.push(new Sprite(g_images.Dizzy, 71, 81));
    g_sprites.Electrode.push(new Sprite(g_images.Diamond, 4, 21));
    g_sprites.Electrode.push(new Sprite(g_images.Diamond, 30, 44));
    g_sprites.Electrode.push(new Sprite(g_images.Diamond, 59, 65));
    g_sprites.Electrode.push(new Sprite(g_images.Checkers, 3, 17));
    g_sprites.Electrode.push(new Sprite(g_images.Checkers, 33, 47));
    g_sprites.Electrode.push(new Sprite(g_images.Checkers, 67, 73));
    g_sprites.Electrode.push(new Sprite(g_images.BlackDiamond, 13, 23, 12, 22));
    g_sprites.Electrode.push(new Sprite(g_images.BlackDiamond, 36, 50, 10, 24));
    g_sprites.Electrode.push(new Sprite(g_images.BlackDiamond, 68, 78, 12, 22));

    g_sprites.Spheroid.push(new Sprite(g_images.Spheroid, 16, 18, 20, 22));
    g_sprites.Spheroid.push(new Sprite(g_images.Spheroid, 56, 62));
    g_sprites.Spheroid.push(new Sprite(g_images.Spheroid, 96, 106));
    g_sprites.Spheroid.push(new Sprite(g_images.Spheroid, 136, 150));
    g_sprites.Spheroid.push(new Sprite(g_images.Spheroid, 176, 194));
    g_sprites.Spheroid.push(new Sprite(g_images.Spheroid, 216, 238));
    g_sprites.Spheroid.push(new Sprite(g_images.Spheroid, 256, 282));
    g_sprites.Spheroid.push(new Sprite(g_images.Spheroid, 296, 326));

    g_sprites.Quark.push(new Sprite(g_images.Quark, 16, 22));
    g_sprites.Quark.push(new Sprite(g_images.Quark, 58, 64));
    g_sprites.Quark.push(new Sprite(g_images.Quark, 98, 108));
    g_sprites.Quark.push(new Sprite(g_images.Quark, 138, 152));
    g_sprites.Quark.push(new Sprite(g_images.Quark, 178, 196));
    g_sprites.Quark.push(new Sprite(g_images.Quark, 218, 240));
    g_sprites.Quark.push(new Sprite(g_images.Quark, 258, 284));
    g_sprites.Quark.push(new Sprite(g_images.Quark, 298, 328));
    g_sprites.Quark.push(new Sprite(g_images.Quark, 340, 370));

    g_sprites.Tank.push(new Sprite(g_images.Tank, 1 , 27));
    g_sprites.Tank.push(new Sprite(g_images.Tank, 39 , 65));
    g_sprites.Tank.push(new Sprite(g_images.Tank, 77 , 103));
    g_sprites.Tank.push(new Sprite(g_images.Tank, 115, 141));


    initializeEntities();
    levelManager.startLevel();

    main.init();
}

// Kick it off
requestPreloads();
