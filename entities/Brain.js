// ======
// Brain
// ======

// Brains launch seeking cruise missiles
// Brains turn family members into Progs

function Brain(descr) {
    Enemy.call(this, descr);

    this.sprite = g_sprites.brain; // TODO create this sprite
}

Brain.prototype = Object.create(Enemy.prototype);

// TODO add all usual properties

Brain.prototype.seekTarget = function () {

    this.findTarget();
    if (this.target === null || this.target === undefined) {
        return; // Escaping empty-field conditions that can occur in testing
    }

    var xOffset = this.target.cx - this.cx;
    var yOffset = this.target.cy - this.cy;

    this.velX = 0;
    if (xOffset > 0) {
        this.velX = 1;
    } else if (xOffset < 0) {
        this.velX = -1;
    }

    this.velY = 0;
    if (yOffset > 0) {
        this.velY = 1;
    } else if (yOffset < 0) {
        this.velY = -1;
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