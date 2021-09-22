const tools = require("./tools");

exports.Encounter = function () {
    this.id = tools.randomNum(1000000000000000000);
    this.enemies = [];
}

exports.createEnemy = function(level, encounter) {
    let obj = {
        "id" : tools.randomNum(1000000000000000000),
        "encounterId" : encounter.id,
        "level" : level,
        "maxHealth" : 10 * level,
        "health" : 10 * level,
        "damage" : 1 * level
    }

    encounter.enemies.push(obj.id);
    tools.writeEnemyData(obj.id, obj);
}