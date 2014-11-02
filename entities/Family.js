// ======
// FAMILY
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Family(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = g_sprites.family;
    // Make a noise when I am created
    //this.exampleSound.play();
}

Family.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Family.prototype.exampleSound = new Audio("sounds/exampleSound.ogg");

// Initial, inheritable, default values
Family.prototype.rotation = 0;
Family.prototype.cx = 100;
Family.prototype.cy = 100;
Family.prototype.velX = 0;
Family.prototype.velY = 0;
Family.prototype.panic = 1;
Family.prototype.lifeSpan = 1*SECS_TO_NOMINALS;
Family.prototype.isDying = false;
Family.prototype.isSaved = false;

Family.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    if (this.isDying || this.isSaved) {
        this.lifeSpan += -du;        
        if (this.lifeSpan<=0) {
            this.kill();
        }
    }else{
        if (Math.random()<0.01 && this.panic<3) {this.panic += 0.1;}
        this.randomWalk();

        this.cx += this.velX * du;
        this.cy += this.velY * du;
        this.capPositions();

        spatialManager.register(this);
    }
};

Family.prototype.randomWalk = function () {
    if (Math.random()<0.02*this.panic) {
        //2% chance to change direction
        
        var n = Math.floor(Math.random()*4);
        switch(n){
            case 0:
                this.velX = -0.3*this.panic;
                break;
            case 1:
                this.velY = -0.3*this.panic;
                break;
            case 2:
                this.velX = 0.3*this.panic;
                break;
            case 3:
                this.velY = 0.3*this.panic;
        }
    }
}

Family.prototype.takeHulkHit = function () {
    this.isDying = true;
};

Family.prototype.takeProtagonistHit = function () {
	this.isSaved = true;
    // I'm Saved!!!
    //TODO: update score
};

Family.prototype.takeBulletHit = function () {
    this.isDying = true;
};

Family.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Family.prototype.render = function (ctx) {
    if (this.isDying) {
        g_sprites.skull.drawCentredAt(ctx,
                                      this.cx,
                                      this.cy,
                                      this.rotation);
    }else if(this.isSaved){
        g_sprites.score.drawCentredAt(ctx,
                                      this.cx,
                                      this.cy,
                                      this.rotation);
    }else{
        g_sprites.family.drawCentredAt(ctx, 
                                       this.cx, 
                                       this.cy, 
                                       this.rotation);
    }
};
