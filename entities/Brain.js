// ======
// Brain
// ======

// Brains launch seeking cruise missiles
// Brains turn family members into Progs

"use strict";

function Brain(descr) {
    Enemy.call(this, descr);

    this.sprite = g_sprites.Brain[6];
    if (g_sounds) this.spawnSound.play();

    this.makeWarpParticles();
}

Brain.prototype = Object.create(Enemy.prototype);

// HACKED-IN AUDIO (no preloading)
Brain.prototype.spawnSound = new Audio(g_audioUrls.brains);

Brain.prototype.killFamily = true;
Brain.prototype.renderPos = {cx: this.cx, cy: this.cy};
Brain.prototype.stepsize = 3;
Brain.prototype.makesProgs = true;
Brain.prototype.missileFireChance = 0.005; // 0.5% chance of firing a CM per update
// TODO: Find a good firing interval for the missiles.
Brain.prototype.dropChance = 0.9; // 90% chance of a random drop
Brain.prototype.bootTime = SECS_TO_NOMINALS;

Brain.prototype.update = function (du) {
    if (this.bootTime >= 0) this.bootTime += -du;

    spatialManager.unregister(this);

    if (!this.startPos) this.startPos = this.getPos();

    // Handle death
    if (this._isDeadNow) {
        Player.addScore(Player.scoreValues.Brain * Player.getMultiplier());
        return entityManager.KILL_ME_NOW;
    }

    if (this.isSpawning) {
        this.warpIn(du);
    } else {
        this.seekTarget();

        if (Math.random() < this.missileFireChance) {
            entityManager.fireCruiseMissile(this.cx, this.cy);
        }

        this.cx += this.velX * du;
        this.cy += this.velY * du;
        this.capPositions();
    }
    spatialManager.register(this);
};


Brain.prototype.seekTarget = function () {

    this.findTarget();
    if (this.target === null || this.target === undefined) {
        return; // Escaping empty-field conditions that can occur in testing
    }

    var xOffset = this.target.cx - this.cx;
    var yOffset = this.target.cy - this.cy;

    if (this.bootTime < 0) {
        this.velX = 0;
        if (xOffset > 0) {
            this.velX = 0.5;
        } else if (xOffset < 0) {
            this.velX = -1;
        }

        this.velY = 0;
        if (yOffset > 0) {
            this.velY = 1;
        } else if (yOffset < 0) {
            this.velY = -0.5;
        }
    }

    // Clamp vel to 1 pixel moving radius
    if (xOffset !== 0 && yOffset !== 0) {
        this.velX *= Math.cos(Math.PI / 4);
        this.velY *= Math.sin(Math.PI / 4);
    }
};

Brain.prototype.findTarget = function () {
    // Brains prefer family members.
    this.target = entityManager.findClosestFamilyMember(this.cx, this.cy);
    if (this.target === null || this.target === undefined) {
        this.target = entityManager.findProtagonist();
    }
};

Brain.prototype.takeBulletHit = function () {
    this.kill();
    this.makeExplosion();
};

Brain.prototype.render = function (ctx) {
    if (this.isSpawning) {
        return;
    }

    var distSq = util.distSq(
        this.cx,
        this.cy,
        this.renderPos.cx,
        this.renderPos.cy);
    var PI = Math.PI;
    if (distSq === 0) {
        var angle = 0;
    } else {
        var angle = util.wrapRange(
            util.angleTo(
                this.renderPos.cx,
                this.renderPos.cy,
                this.cx,
                this.cy),
            0,
                2 * PI);
    }
    var facing = 3; // right
    if (angle > PI * 1 / 4) facing = 6; //down
    if (angle > PI * 3 / 4) facing = 0; //left
    if (angle > PI * 5 / 4) facing = 9; //up
    if (angle > PI * 7 / 4) facing = 3; //right

    switch (true) {
        case distSq < util.square(this.stepsize):
            g_sprites.Brain[facing + 0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq < util.square(this.stepsize * 2):
            g_sprites.Brain[facing + 1].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq < util.square(this.stepsize * 3):
            g_sprites.Brain[facing + 0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq < util.square(this.stepsize * 4):
            g_sprites.Brain[facing + 2].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        default:
            g_sprites.Brain[facing + 0].drawCentredAt(ctx, this.cx, this.cy, 0);
            this.renderPos = {cx: this.cx, cy: this.cy};
    }
};


Brain.prototype.colors = [
    {color: "blue", ratio: 0.70},
    {color: "#B90CF1", ratio: 0.10},
    {color: "#08FF03", ratio: 0.20}
];
Brain.prototype.spawnTime = 0.9 * SECS_TO_NOMINALS;
Brain.prototype.totalParticles = 200;