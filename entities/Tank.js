// ======
// Tank
// ======

// Tanks are spawned by Quarks. Tanks fire rebounding tank shells.
// Tanks roll around randomly.

function Tank(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Tank;
    this.target = entityManager.findProtagonist();

    // Initializing speed
    this.baseSpeed = 1;
    this.velX = this.baseSpeed*util.randTrinary();
    this.velY = this.baseSpeed*util.randTrinary();
    // TODO play spawning sound?
}

Tank.prototype = Object.create(Enemy.prototype);
Tank.prototype.shellFireChance = 0.01; //1% chance of firing a shell/update
// TODO: Find a good firing interval.
Tank.prototype.renderPos = {cx: this.cx, cy: this.cy};

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

    if (Math.random() < this.shellFireChance) {
        // TODO: Add a bit of inaccuracy to the angle.
        var angle = util.angleTo(
            this.cx,
            this.cy,
            this.target.cx,
            this.target.cy
        );
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
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
};