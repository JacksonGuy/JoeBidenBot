const tools = require("./tools");
const fs = require('fs');

exports.Encounter = function () {
    let obj = {
        "id" : tools.randomNum(1000000000000000000),
        "enemyName" : {},
        "players" : []
    }
    tools.writeEncounterData(obj.id, obj);
    return obj;
}

exports.createEnemy = function (name, level, encounter) {
    let obj = {
        "name" : name,
        "id" : tools.randomNum(1000000000000000000),
        "encounterId" : encounter.id,
        "level" : level,
        "maxHealth" : 10 * level,
        "health" : 10 * level,
        "damage" : 1 * level
    }
    fs.readFile(`./encounters/${encounter.id}.json`, (err, data) => {
        if (err) throw err;
        let e = JSON.parse(data);
        e.enemyName[obj.name] = obj.id;
        tools.writeEncounterData(e.id, e);
        tools.writeEnemyData(obj.id, obj);
    });
    return obj;
}

exports.enemyResponse = function (encounter) {
    for (let i in encounter.enemyName) {
        console.log(i);
    }
}