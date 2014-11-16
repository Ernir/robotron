// ======
// PROTAGONIST
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Protagonist(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = g_sprites.Protagonist[6];
    this.startPos = {posX: g_canvas.width / 2, posY: g_canvas.height / 2};
    
}

Protagonist.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Protagonist.prototype.walkSound = new Audio(g_audioUrls.walk);
Protagonist.prototype.loseSound = new Audio(g_audioUrls.loselife);

Protagonist.prototype.KEY_UP     = 'W'.charCodeAt(0);
Protagonist.prototype.KEY_DOWN   = 'S'.charCodeAt(0);
Protagonist.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Protagonist.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Protagonist.prototype.KEY_SHOOTUP     = 38;
Protagonist.prototype.KEY_SHOOTDOWN   = 40;
Protagonist.prototype.KEY_SHOOTLEFT   = 37;
Protagonist.prototype.KEY_SHOOTRIGHT  = 39;


// Initial, inheritable, default values
Protagonist.prototype.rotation = 0;
Protagonist.prototype.stepsize = 10;
Protagonist.prototype.velX = 0;
Protagonist.prototype.velY = 0;
Protagonist.prototype.renderPos = {cx: this.cx, cy: this.cy};

Protagonist.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

	// Perform movement
    if (Player.getSpeed() > 3) Player.tickSpeedTimer(du);
    if (Player.getShieldTime() > 0) Player.tickShieldTime(du);
    var vel = this.computeMovement();
	this.velX = vel.x;
	this.velY = vel.y;

    this.cx += this.velX * du;
    this.cy += this.velY * du;
    this.capPositions();

    this.maybeFire();

    // Handle collisions
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
		var canSave = hitEntity.takeProtagonistHit;
		if (canSave) canSave.call(hitEntity);
		else {
			var canKillMe = hitEntity.killProtagonist;
			if (canKillMe && g_canBeKilled) this.takeEnemyHit();
		}
    }

    spatialManager.register(this);
};

Protagonist.prototype.computeMovement = function () {
	var velX = 0;
	var velY = 0;
	var hasMoved = false;
    
    if (keys[this.KEY_UP]) {
        velY -= Player.getSpeed();
		hasMoved = true;
    }
    if (keys[this.KEY_DOWN]) {
        velY += Player.getSpeed();
		hasMoved = true;
    }
	if (keys[this.KEY_LEFT]) {
        velX -= Player.getSpeed();
		hasMoved = true;
    }
    if (keys[this.KEY_RIGHT]) {
        velX += Player.getSpeed();
		hasMoved = true;
    }
	// Clamp vel to 5 pixel moving radius
	if (velX !== 0 && velY !== 0) {
		velX *= Math.cos(Math.PI / 4);
		velY *= Math.sin(Math.PI / 4);
	}
	
	// Walk makes a sound if moved
	if (g_sounds && hasMoved) this.walkSound.play()
    
    return {x: velX, y: velY};
};

Protagonist.prototype.maybeFire = function () {
    var x = 0;
    var y = 0;

    if (keys[this.KEY_SHOOTUP]) {
        y -= 1;
    }
    if (keys[this.KEY_SHOOTDOWN]) {
        y += 1;
    }
    if (keys[this.KEY_SHOOTLEFT]) {
        x -= 1
    }
    if (keys[this.KEY_SHOOTRIGHT]) {
        x += 1;
    }
    if(x != 0 || y != 0)
        entityManager.fire(this.cx+x, this.cy+y);
	else if (g_isMouseDown) 
		entityManager.fire(g_mouseX, g_mouseY);
};

Protagonist.prototype.takeEnemyHit = function () {
    if(g_canBeKilled) {
        Player.subtractLives();
        if (g_sounds) this.loseSound.play();
        if (Player.getLives() > 0) {
            Player.resetMultiplier();
    		levelManager.continueLevel();
        } else {
            this.kill();
        }
    }
};

Protagonist.prototype.takeElectrodeHit = function () {
    if(g_canBeKilled) {
        this.takeEnemyHit();
    }
};

Protagonist.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Protagonist.prototype.render = function (ctx) {
    var distSq = util.distSq(this.cx, this.cy, this.renderPos.cx, this.renderPos.cy);
    var angle = util.angleTo(this.renderPos.cx, this.renderPos.cy, this.cx, this.cy);
    var PI = Math.PI;
    var facing = 3; // right
    if(angle > PI*1/4) facing = 6; //down
    if(angle > PI*3/4) facing = 0; //left
    if(angle > PI*5/4) facing = 9; //up
    if(angle > PI*7/4) facing = 3; //right

    switch(true) {
        case distSq<util.square(this.stepsize):
            g_sprites.Protagonist[facing+0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<util.square(this.stepsize*2):
            g_sprites.Protagonist[facing+1].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<util.square(this.stepsize*3):
            g_sprites.Protagonist[facing+0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<util.square(this.stepsize*4):
            g_sprites.Protagonist[facing+2].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        default:
            g_sprites.Protagonist[facing+0].drawCentredAt(ctx, this.cx, this.cy, 0);
            this.renderPos = {cx: this.cx, cy: this.cy};
    }

    // Draw the shield
    if (!g_canBeKilled) {
        ctx.save();
        ctx.globalAlpha = 0.3
        ctx.fillStyle = "cyan";
        util.fillCircle(ctx, this.cx, this.cy, this.getRadius()+2);
        ctx.restore();
    }
};
