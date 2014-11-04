// ======
// Brain
// ======

// Brains launch seeking cruise missiles
// Brains turn family members into Progs

function Brain(descr) {
    Enemy.call(this, descr);

    this.sprite = g_sprites.Brain;
}

Brain.prototype = Object.create(Enemy.prototype);

Brain.prototype = Object.create(Enemy.prototype);
Brain.prototype.timeSinceHit = Infinity;
Brain.prototype.killFamily = true;
Brain.prototype.missileFireChance = 0.01; // 1% chance of firing a CM per update
// TODO: Find a good firing interval for the missiles.

Brain.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    this.seekTarget();

    if(Math.random() < this.missileFireChance) {
        entityManager.fireCruiseMissile(this.cx,this.cy);
    }

    // Move, unless the Hulk has been shot in the last 1 second.
    this.timeSinceHit += du;
    if (this.timeSinceHit > SECS_TO_NOMINALS * 1) {
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

    // Clamp vel to 1 pixel moving radius
    if (xOffset !== 0 && yOffset !== 0) {
        this.velX *= Math.cos(Math.PI / 4);
        this.velY *= Math.sin(Math.PI / 4);
    }
};

Brain.prototype.findTarget = function () {
    // Brains prefer family members.
    this.target = entityManager.findClosestFamilyMember(this.cx,this.cy);
    if (this.target === null || this.target === undefined) {
        this.target = entityManager.findProtagonist();
    }
};

Brain.prototype.takeBulletHit = function () {
    this.kill();
	Player.addScore(500 * Player.getMultiplier()); //TODO remove magic number
};