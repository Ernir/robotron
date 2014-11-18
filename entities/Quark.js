// ======
// Quark
// ======

// Quarks spawn Tanks.
// Quarks fly around quickly and randomly.

function Quark(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Quark[5];

    // Initializing speed
    this.baseSpeed = 1;
    this.velX = this.baseSpeed * util.randTrinary();
    this.velY = this.baseSpeed * util.randTrinary();
    this.tanksSpawned = 0;
    // TODO play spawning sound?

    this.makeWarpParticles();
}

Quark.prototype = Object.create(Enemy.prototype);
Quark.prototype.tankSpawnChance = 0.005; //0,5% chance of spawning a tank/update
// TODO: Find a good spawn interval.
Quark.prototype.renderPos = {cx: this.cx, cy: this.cy};
Quark.prototype.maxTanks = 6;
Quark.prototype.constructionTime = SECS_TO_NOMINALS;

Quark.prototype.update = function (du) {
    this.animation += du;
    if (this.animation > SECS_TO_NOMINALS) this.animation = 0;

    spatialManager.unregister(this);

    this.constructionTime += -du;

    if (!this.startPos) this.startPos = this.getPos();

    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    if (this.isSpawning) {
        this.warpIn(du);
    } else {

        // maxTanks is effectively zero-indexed
        if (Math.random() < this.tankSpawnChance &&
            this.tanksSpawned < this.maxTanks &&
            this.constructionTime < 0) {
            this.tanksSpawned++;
            entityManager.createTank(this.cx, this.cy);
            this.constructionTime = 2 * SECS_TO_NOMINALS;
        }

        this.randomWalk();

        this.capPositions();
        this.edgeBounce();

        this.cx += this.velX * du;
        this.cy += this.velY * du;

    }

    spatialManager.register(this);

};

Quark.prototype.randomWalk = function () {
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

Quark.prototype.takeBulletHit = function () {
    this.kill();
    this.makeExplosion();
    Player.addScore(Player.scoreValues.Quark * Player.getMultiplier());
};

Quark.prototype.render = function (ctx) {
    if (this.isSpawning) {
        return;
    }
    var temp = Math.floor(9 * this.animation / SECS_TO_NOMINALS);
    if (temp > 8) temp = 8;
    g_sprites.Quark[temp].drawCentredAt(ctx, this.cx, this.cy, 0);
};

Quark.prototype.colors = [
    {color: "blue", ratio: 0.5},
    {color: "#00FF09", ratio: 0.5}
];