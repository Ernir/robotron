// ======
// PROTAGONIST
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Protagonist(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = g_sprites.protagonist;
    // Make a noise when I am created
    // this.exampleSound.play();
}

Protagonist.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Protagonist.prototype.exampleSound = new Audio("sounds/exampleSound.ogg");

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
// Protagonist.prototype.cx = g_canvas.width/2;;
// Protagonist.prototype.cy = g_canvas.height/2;;
Protagonist.prototype.velX = 0;
Protagonist.prototype.velY = 0;

Protagonist.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
	
	// Perform movement
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
			if (canKillMe) this.takeGruntHit();
		}
    }

    spatialManager.register(this);
};

Protagonist.prototype.computeMovement = function () {
	var velX = 0;
	var velY = 0;
    
    if (keys[this.KEY_UP]) {
        velY -= 5;
    }
    if (keys[this.KEY_DOWN]) {
        velY += 5;
    }
	if (keys[this.KEY_LEFT]) {
        velX -= 5;
    }
    if (keys[this.KEY_RIGHT]) {
        velX += 5;
    }
	// Clamp vel to 5 pixel moving radius
	if (velX !== 0 && velY !== 0) {
		velX *= Math.cos(Math.PI / 4);
		velY *= Math.sin(Math.PI / 4);
	}
    
    return {x: velX, y: velY};
}

Protagonist.prototype.maybeFire = function () {
    var x=0;
    var y=0;

    if (keys[this.KEY_SHOOTUP]) {
        y+=-1;
    }
    if (keys[this.KEY_SHOOTDOWN]) {
        y+=1;
    }
    if (keys[this.KEY_SHOOTLEFT]) {
        x+=-1
    }
    if (keys[this.KEY_SHOOTRIGHT]) {
        x+=1;
    }
    if(x!=0||y!=0)
        entityManager.fire(this.cx+x, this.cy+y);
}

Protagonist.prototype.takeGruntHit = function () {
    Player.updateLives(-1);
    if (Player.getLives()>0) {
        this.setPos(g_canvas.width/2, g_canvas.height/2);
    }else{
        this.kill();
    }
};

Protagonist.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Protagonist.prototype.render = function (ctx) {

    g_sprites.protagonist.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
