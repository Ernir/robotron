// ======
// Progs
// ======

// Progs are spawned when a Brain kills a family member.
// Progs walk around randomly, killing the protagonist if encountered.

function Prog(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Prog[0];
    // TODO play spawning sound?
}

Prog.prototype = Object.create(Enemy.prototype);
Prog.prototype.speed = 1;
Prog.prototype.renderPos = {cx: this.cx, cy: this.cy};
Family.prototype.stepsize = 10;

Prog.prototype.update = function (du) {

    spatialManager.unregister(this);

    if (!this.startPos) this.startPos = this.getPos();
    if (!this.renderPos) this.renderPos = this.getPos();

    // Handle death
    if (this._isDeadNow) {
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
    Player.addScore(Player.scoreValues.Prog * Player.getMultiplier());
};

// Overriding from Enemy.
// Prog sprites are very tall, default implementation does not
// give an accurate bounding circle.
Prog.prototype.getRadius = function () {
    return (this.sprite.height / 2) * 0.9;
};

Prog.prototype.render = function (ctx) {
    //g_sprites.Prog.drawCentredAt(ctx, this.cx, this.cy, 0);

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
            g_sprites.Prog[facing + 0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<util.square(this.stepsize*2):
            g_sprites.Prog[facing + 1].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<util.square(this.stepsize*3):
            g_sprites.Prog[facing + 0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq<util.square(this.stepsize*4):
            g_sprites.Prog[facing + 2].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        default:
            g_sprites.Prog[facing + 0].drawCentredAt(ctx, this.cx, this.cy, 0);
            this.renderPos = {cx: this.cx, cy: this.cy};
    }
};