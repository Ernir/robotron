// ======
// Tank
// ======

// Tanks are spawned by Quarks. Tanks fire rebounding tank shells.
// Tanks roll around randomly.

function Tank(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Tank[0];
    this.target = entityManager.findProtagonist();

    // Initializing speed
    this.baseSpeed = 1;
    this.velX = this.baseSpeed*util.randTrinary();
    this.velY = this.baseSpeed*util.randTrinary();
    // TODO play spawning sound?
}

Tank.prototype = Object.create(Enemy.prototype);
Tank.prototype.shellFireChance = 0.01; //1% chance of firing a shell/update
Tank.prototype.ammo = 20;
Tank.prototype.renderPos = {cx: this.cx, cy: this.cy};
Tank.prototype.dropChance = 1; // 100% chance of a random drop

Tank.prototype.update = function (du) {

    spatialManager.unregister(this);

    if (!this.startPos) this.startPos = this.getPos();

    // Handle death
    if (this._isDeadNow) {
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
    this.kill();
    Player.addScore(Player.scoreValues.Tank * Player.getMultiplier());
};

Tank.prototype.render = function (ctx) {
    var distSq = util.distSq(this.cx, this.cy, this.renderPos.cx, this.renderPos.cy);
    var px = 36;
    switch (true) {
        case distSq < px*px:
            g_sprites.Tank[0].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq < px*px*4:
            g_sprites.Tank[1].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq < px*px*16:
            g_sprites.Tank[2].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        case distSq < px*px*64:
            g_sprites.Tank[3].drawCentredAt(ctx, this.cx, this.cy, 0);
            break;
        default:
            this.renderPos = {cx: this.cx, cy: this.cy};
            g_sprites.Tank[0].drawCentredAt(ctx, this.cx, this.cy, 0);
    }
};