// ======
// Quark
// ======

// Quarks spawn Tanks.
// Quarks fly around quickly and randomly.

function Quark(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Quark;
    // TODO play spawning sound?
}

Quark.prototype = Object.create(Enemy.prototype);
Quark.prototype.speed = 2;
Quark.prototype.tankSpawnChance = 0.005; //0,5% chance of spawning a tank/update
// TODO: Find a good spawn interval.
Quark.prototype.renderPos = {cx: this.cx, cy: this.cy};

Quark.prototype.update = function (du) {

    spatialManager.unregister(this);

    if (!this.startPos) this.startPos = this.getPos();

    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    if(Math.random() < this.tankSpawnChance) {
        entityManager.createTank(this.cx,this.cy);
    }

    this.randomWalk();

    this.capPositions();
    this.edgeBounce();

    this.cx += this.velX * du;
    this.cy += this.velY * du;


    spatialManager.register(this);

};

Quark.prototype.randomWalk = function () {
    if (Math.random() < 0.005) {
        //0.5% chance to change direction

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

Quark.prototype.takeBulletHit = function () {
    this.kill();
    Player.addScore(Player.scoreValues.Quark * Player.getMultiplier());
};

Quark.prototype.render = function (ctx) {
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
};