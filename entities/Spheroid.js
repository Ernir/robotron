// ======
// Quark
// ======

// Spheroids spawn Enforcers.
// Spheroids (probably...) fly around quickly and randomly.

function Spheroid(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Spheroid;

    // Initializing speed
    this.baseSpeed = 3;
    this.velX = this.baseSpeed*util.randTrinary();
    this.velY = this.baseSpeed*util.randTrinary();
    this.tanksSpawned = 0;
    // TODO play spawning sound?
}

Spheroid.prototype = Object.create(Enemy.prototype);
Spheroid.prototype.tankSpawnChance = 0.005; //0,5% chance of spawning a tank/update
// TODO: Find a good spawn interval.
Spheroid.prototype.renderPos = {cx: this.cx, cy: this.cy};
Spheroid.prototype.maxTanks = 6;

Spheroid.prototype.update = function (du) {

    spatialManager.unregister(this);

    if (!this.startPos) this.startPos = this.getPos();

    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    // maxTanks is effectively zero-indexed
    if(Math.random() < this.tankSpawnChance && this.tanksSpawned < this.maxTanks) {
        this.tanksSpawned++;
        entityManager.createEnforcer(this.cx,this.cy);
    }

    this.randomWalk();

    this.capPositions();
    this.edgeBounce();

    this.cx += this.velX * du;
    this.cy += this.velY * du;


    spatialManager.register(this);

};

Spheroid.prototype.randomWalk = function () {
    if (Math.random() < 0.02) {
        //2% chance to change direction

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

Spheroid.prototype.takeBulletHit = function () {
    this.kill();
    Player.addScore(Player.scoreValues.Spheroid * Player.getMultiplier());
};

Spheroid.prototype.render = function (ctx) {
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
};