// =====
// Progs
// =====

// Progs are spawned when a Brain kills a family member.
// Progs walk around randomly, killing the protagonist if encountered.

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

function Prog(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Prog[0];
    // TODO play spawning sound?
}

Prog.prototype = Object.create(Enemy.prototype);
Prog.prototype.speed = 1.5;
Prog.prototype.renderPos = {cx: 0, cy: 0};
Prog.prototype.stepsize = 15;
Prog.prototype.facing = 0;

Prog.prototype.update = function (du) {

    spatialManager.unregister(this);

    if (!this.startPos) this.startPos = this.getPos();
    if (!this.renderPos) this.renderPos = this.getPos();

    // Handle death
    if (this._isDeadNow) {
        Player.addScore(Player.scoreValues.Prog * Player.getMultiplier());
        return entityManager.KILL_ME_NOW;
    }

    this.randomWalk();

    this.capPositions();
    //TODO: Make them less likely to change direction after bouncing?
    this.edgeBounce();

    this.cx += this.velX * du;
    this.cy += this.velY * du;


    spatialManager.register(this);

};

Prog.prototype.randomWalk = function () {
    if (Math.random() < 0.02) {
        //2% chance to change direction

        var n = Math.floor(Math.random() * 4);
        switch (n) {
            case 0:
                this.velX = -this.speed;
                break;
            case 1:
                this.velY = -this.speed;
                break;
            case 2:
                this.velX = this.speed;
                break;
            case 3:
                this.velY = this.speed;
        }
    }
};

Prog.prototype.takeBulletHit = function () {
    this.kill();
    this.makeExplosion();
};

// Overriding from Enemy.
// Prog sprites are very tall, default implementation does not
// give an accurate bounding circle.
Prog.prototype.getRadius = function () {
    return (this.sprite.height / 2) * 0.9;
};

Prog.prototype.render = function (ctx) {

    var distSq = util.distSq(this.cx, this.cy, this.renderPos.cx, this.renderPos.cy);
    var angle = util.angleTo(this.renderPos.cx, this.renderPos.cy, this.cx, this.cy);
    var PI = Math.PI;
    
    if (distSq > 0.1) {
        this.facing = 3; // right
        if(angle > PI*1/4) this.facing = 6; //down
        if(angle > PI*3/4) this.facing = 0; //left
        if(angle > PI*5/4) this.facing = 9; //up
        if(angle > PI*7/4) this.facing = 3; //right
    }

    var temp = 0;
    switch(true) {
        case distSq<util.square(this.stepsize):
            temp = 0;
            break;
        case distSq<util.square(this.stepsize*2):
            temp = 1;
            break;
        case distSq<util.square(this.stepsize*3):
            temp = 0;
            break;
        case distSq<util.square(this.stepsize*4):
            temp = 2
            break;
        default:
            temp = 0;
            this.renderPos = {cx: this.cx, cy: this.cy};        
    }

    // This belongs in an (as yet unwritten) effects manager, 
    // instead of the entityManager
    var descr = {cx: this.cx,
                 cy: this.cy,
                 image: g_sprites.Prog[this.facing + temp]
                 };
    entityManager.createAfterImage(descr);

    g_sprites.Prog[this.facing + temp].drawCentredAt(ctx, this.cx, this.cy, 0);
};

Prog.prototype.colors = [
    {color: "white", ratio: 0.9},
    {color: "red", ratio: 0.1}
];
