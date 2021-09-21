class Enemy {
    constructor(level) {
        this.level = level;
        this.health = 10 * level;
        this.damage = 1 * level;
    }

    get attack() {
        return this.damage;
    }
}

function randomEncounter() {
    
}