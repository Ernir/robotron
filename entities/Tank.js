// ======
// Tank
// ======

// Tanks are spawned by Quarks. Tanks fire rebounding tank shells.
// Tanks roll around randomly.

"use strict";

function Tank(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Tank[0];
    this.target = entityManager.findProtagonist();

    // Initializing speed
    this.baseSpeed = 0.9;
    this.velX = this.baseSpeed*util.randTrinary();
    this.velY = this.baseSpeed*util.randTrinary();
    // TODO play spawning sound?
}

Tank.prototype = Object.create(Enemy.prototype);
Tank.prototype.shellFireChance = 0.01; //1% chance of firing a shell/update
Tank.prototype.ammo = 20;
Tank.prototype.renderPos = {cx: this.cx, cy: this.cy};
Tank.prototype.dropChance = 1; // 100% chance of a random drop
Tank.prototype.renderPos = this.cx;
Tank.prototype.stepsize = 3;

Tank.prototype.update = function (du) {

    spatialManager.unregister(this);

    if (!this.startPos) this.startPos = this.getPos();

    // Handle death
    if (this._isDeadNow) {
        Player.addScore(Player.scoreValues.Tank * Player.getMultiplier());
        return entityManager.KILL_ME_NOW;
    }

    this.randomWalk();

    this.capPositions();
    this.edgeBounce();

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    if (Math.random() < this.shellFireChance && this.ammo > 0) {
        // TODO: Do this amazing trick shot box-in AI thing.
        // http://www.robotron2084guidebook.com/gameplay/tanks/
        var angle = util.angleTo(
            this.cx,
            this.cy,
            this.target.cx,
            this.target.cy
        );
        this.ammo--;
        entityManager.fireShell(this.cx, this.cy, angle);
    }

    spatialManager.register(this);

};

Tank.prototype.randomWalk = function () {
    if (Math.random() < 0.005) {
        //0.5% chance to change direction

        var n = Math.floor(Math.random() * 4);
        switch (n) {
            case 0:
                this.velX = -this.baseSpeed;
                break;
            case 1:
                this.velY = -this.baseSpeed;
                break;
            case 2:
                this.velX = this.baseSpeed;
                break;
            case 3:
                this.velY = this.baseSpeed;
        }
    }
};



Tank.prototype.takeBulletHit = function () {
    this.makeExplosion();
    this.kill();
};

Tank.prototype.render = function (ctx) {
    
    var dist = this.cx - this.renderPos;
    var left = false;
    if (dist < 0) left = true;
    var step = 0;

    switch(true) {
        case util.abs(dist) < this.stepsize:
            step = 0;
            if (left) step = 3;
            break;
        case util.abs(dist) < this.stepsize * 2:
            step = 1;
            if (left) step = 2;
            break;
        case util.abs(dist) < this.stepsize * 3:
            step = 2;
            if (left) step = 1;
            break;
        case util.abs(dist) < this.stepsize * 4:
            step = 3;
            if (left) step = 0;
            break;
        default:
            step = 0;
            this.renderPos = this.cx;
    }
    g_sprites.Tank[step].drawCentredAt(ctx, this.cx, this.cy, 0);
};

Tank.prototype.colors = [
    {color: "red", ratio: 0.50},
    {color: "#00FF00", ratio: 0.25}, // Green
    {color: "blue", ratio: 0.25}
];
Tank.prototype.totalParticles = 200;