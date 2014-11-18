// ======
// Electrode
// ======

// Electrodes are static enemies. Touch them and die.
// Electrodes also kill Grunts.

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

function Electrode(descr) {

    // Common inherited setup logic from Entity
    Enemy.call(this, descr);

    this.sprite = g_sprites.Electrode[0];
    this.capPositions();
}

Electrode.prototype = Object.create(Enemy.prototype);

Electrode.prototype.update = function (du) {
    this.animation += du;
    if (this.animation > SECS_TO_NOMINALS) this.animation = 0;

    spatialManager.unregister(this);

    if (!this.startPos) this.startPos = this.getPos();

    // Handle death
    if (this._isDeadNow) {
        Player.addScore(Player.scoreValues.Electrode * Player.getMultiplier());
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
};

Electrode.prototype.render = function (ctx) {
    var temp;
    switch(true) {
        case this.animation < SECS_TO_NOMINALS/5:
            temp = 0;
            break;
        case this.animation < 2*SECS_TO_NOMINALS/3:
            temp = 1;
            break;
        default:
            temp = 2;
    }
    g_sprites.Electrode[(this.shapes*3)+temp].drawCentredAt(ctx, this.cx, this.cy, 0);
};