// ======
// Electrode
// ======

// Electrodes are static enemies. Touch them and die.
// Electrodes also kill Grunts.

function Electrode(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Electrode[0];
}

Electrode.prototype = Object.create(Enemy.prototype);

Electrode.prototype.update = function (du) {

    spatialManager.unregister(this);
    // Handle death
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    // Handle collisions
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeElectrodeHit;
        if (canTakeHit)
            canTakeHit.call(hitEntity);
    }

    spatialManager.register(this);
};

Electrode.prototype.takeBulletHit = function () {
    this.kill();
	Player.addScore(Player.scoreValues.Electrode * Player.getMultiplier());
};