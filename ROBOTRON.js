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

    Player.tickColorCounter(du);

    if (levelManager.isInMenu()) {
	
		return;
		
	} else if (levelManager.isChangingLevel()) {
	
        levelManager.reduceTimer(du);
		
    } else {
	
        if (!levelManager.isGameOver()) {
            entityManager.update(du);
        }
    }
	
	if (Player.getLives() === 0) {
		levelManager.gameOver();
	};

    if (entityManager.enemiesIsEmpty()) levelManager.nextLevel();
}

// GAME-SPECIFIC DIAGNOSTICS

var g_Debug = false;
var g_canBeKilled = true;
var g_friendlyFire = true;
var g_sounds = true;
var g_music = true;

var KEY_DEBUG = keyCode('X');
var KEY_KILLABLE = keyCode('K');
var KEY_FRIENDLYFIRE = keyCode('F');
var KEY_RESTART = keyCode('R');
var KEY_NEXT_LEVEL = keyCode('+');
var KEY_NEXT_LEVELN = 107; // Numpad +
var KEY_PREV_LEVEL = keyCode('-');
var KEY_PREV_LEVELN = 109; // Numpad -
var KEY_SOUND = keyCode('N');
var KEY_MUSIC = keyCode('M');
var KEY_VOLUMEUP = keyCode('Y');
var KEY_VOLUMEDOWN = keyCode('H');
var KEY_PWRUP_RESET = keyCode('0');
var KEY_PWRUP_RESETN = 96; // Numpad 0
var KEY_EXTRA_LIFE = keyCode('1');
var KEY_EXTRA_LIFEN = 97; // Numpad 1
var KEY_SPEED = keyCode('2');
var KEY_SPEEDN = 98; // Numpad 2
var KEY_SCORE_MP = keyCode('3');
var KEY_SCORE_MPN = 99; // Numpad 3
var KEY_MACHINEGUN = keyCode('4');
var KEY_MACHINEGUNN = 100; // Numpad 4
var KEY_SHOTGUN = keyCode('5');
var KEY_SHOTGUNN = 101; // Numpad 5
var KEY_SHIELD = keyCode('6');
var KEY_SHIELDN = 102; // Numpad 6
var KEY_PREV_SONG = keyCode('8');
var KEY_PREV_SONGN = 104; // Numpad 8
var KEY_NEXT_SONG = keyCode('9');
var KEY_NEXT_SONGN = 105; // Numpad 9

function processDiagnostics() {

    if (eatKey(KEY_KILLABLE) && g_Debug) {
        g_canBeKilled = !g_canBeKilled;
        g_hasCheated = true;
    }
	
	if (eatKey(KEY_FRIENDLYFIRE) && g_Debug) {
        g_friendlyFire = !g_friendlyFire;
        g_hasCheated = true;
    }

    if (eatKey(KEY_RESTART)) {
        Player.resetAll();
        levelManager.startLevel();
    }

    if ((eatKey(KEY_NEXT_LEVEL) || eatKey(KEY_NEXT_LEVELN)) && g_Debug) {
        levelManager.nextLevel();
        g_hasCheated = true;
    }

    if ((eatKey(KEY_PREV_LEVEL) || eatKey(KEY_PREV_LEVELN)) && g_Debug) {
        levelManager.prevLevel();
        g_hasCheated = true;
    }
	
    if ((eatKey(KEY_EXTRA_LIFE) || eatKey(KEY_EXTRA_LIFEN)) && g_Debug) {
        Player.addLives();
        g_hasCheated = true;
    }

    if ((eatKey(KEY_SPEED) || eatKey(KEY_SPEEDN))&& g_Debug) {
        Player.addSpeed();
        g_hasCheated = true;
    }

    if ((eatKey(KEY_SCORE_MP) || eatKey(KEY_SCORE_MP)) && g_Debug) {
        Player.addMultiplier();
        g_hasCheated = true;
    }

    if ((eatKey(KEY_MACHINEGUN) || eatKey(KEY_MACHINEGUNN)) && g_Debug) {
        Player.hasShotgun = false;
        Player.hasMachineGun = true;
        Player.setFireRate(5);
        Player.addAmmo(100);
        g_hasCheated = true;
    }

    if ((eatKey(KEY_SHOTGUN) || eatKey(KEY_SHOTGUNN)) && g_Debug) {
        Player.hasShotgun = true;
        Player.hasMachineGun = false;
        Player.setFireRate(70);
        Player.addAmmo(100);
        g_hasCheated = true;
    }

    if ((eatKey(KEY_SHIELD) || eatKey(KEY_SHIELDN)) && g_Debug) {
        Player.addShieldTime();
        g_hasCheated = true;
    }

    if ((eatKey(KEY_PWRUP_RESET) || eatKey(KEY_PWRUP_RESETN)) && g_Debug) {
        Player.resetAll();
        g_hasCheated = true;
    }
}

function checkDebugSound() {

    if (eatKey(KEY_DEBUG)) g_Debug = !g_Debug;

    if (eatKey(KEY_SOUND)) g_sounds = !g_sounds;
    
    if (eatKey(KEY_MUSIC)) g_music = !g_music;
	
    if (eatKey(KEY_NEXT_SONG) || eatKey(KEY_NEXT_SONGN)) g_bgm.nextSong();

    if (eatKey(KEY_PREV_SONG) || eatKey(KEY_PREV_SONGN)) g_bgm.prevSong();

	if (g_music) g_bgm.play();
    else g_bgm.pause();
	
	// Background music volume control
	var prevVolume = g_bgm.getVolume;
	if (eatKey(KEY_VOLUMEUP)) g_bgm.incVolume();
	if (eatKey(KEY_VOLUMEDOWN)) g_bgm.decVolume();
	if (prevVolume !== g_bgm.getVolume) console.log("volume set to: " + g_bgm.getVolume);
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

    if (levelManager.isInMenu()) {
	
		levelManager.renderMenu(ctx);
		
    } else if (levelManager.isChangingLevel()) {
	
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
    g_sprites.Enforcer = [];
    g_sprites.EnforcerSpark = [];
    g_sprites.PowerUps = [];
    g_sprites.Prog = [];


    for (var i = 0; i < 12; i++) {
        g_sprites.Dad.push(new Sprite(g_images.Dad, i*30, (i+1)*30));
        g_sprites.Mom.push(new Sprite(g_images.Mom, i*26, (i+1)*26));
        g_sprites.Child.push(new Sprite(g_images.Child, i*22, (i+1)*22));
        g_sprites.Protagonist.push(new Sprite(g_images.Protagonist, i*26, (i+1)*26));
        g_sprites.Brain.push(new Sprite(g_images.Brain, i*38, (i+1)*38));
        g_sprites.Prog.push(new Sprite(g_images.Prog, i*30, (i+1)*30));

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
    for (var i = 0; i < 6; i++) {
        g_sprites.Enforcer.push(new Sprite(g_images.Enforcer, i*29, (i+1)*29));
        for (var j = 0; j < 8; j++) {
            g_sprites.PowerUps.push(new Sprite(g_images.PowerUps, j*2473/6, (j+1)*2473/6, i*412.25, (i+1)*412.25, 0.1));
        }
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

    g_sprites.EnforcerSpark.push(new Sprite(g_images.EnforcerSpark, 6, 20));
    g_sprites.EnforcerSpark.push(new Sprite(g_images.EnforcerSpark, 34, 44));
    g_sprites.EnforcerSpark.push(new Sprite(g_images.EnforcerSpark, 58, 72));
    g_sprites.EnforcerSpark.push(new Sprite(g_images.EnforcerSpark, 86, 96));

    util.makeColorArray();
    initializeEntities();
    main.init();
}

// Kick it off
requestPreloads();
