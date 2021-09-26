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

exports.enemyResponse = function (encounter, interaction) {
    var totalDamage = 0;
    for (let i in encounter.enemyName) {
        fs.readFile(`./enemies/${encounter.enemyName[i]}.json`, (err, data) => {
            if (err) throw err;
            let enemy = JSON.parse(data);
            let pid = encounter.players[Math.floor(Math.random()*encounter.players.length)];
            fs.readFile(`./players/${pid}.json`, (err, data) => {
                if (err) throw err;
                let player = JSON.parse(data);
                player.health -= enemy.damage;
                totalDamage += enemy.damage;
                
                if (player.health <= 0) {                       // Check if player died to attack
                    encounter.players.pop(player.id);           // Remove player from encounter
                    if (encounter.players.length <= 0) {        // If no remaining players in encounter, delete encounter + enemies
                        for (let i in encounter.enemyName) {
                            fs.unlink(`./enemies/${encounter.enemyName[i]}.json`, (err) => {
                                if (err) throw err;
                            });
                        }
                        fs.unlink(`./encounters/${encounter.id}.json`, (err) => {
                            if (err) throw err;
                        });
                    }
                    else {
                        tools.writeEncounterData(encounter.id, encounter);
                    }
                    fs.unlink(`./players/${player.id}.json`, (err) => {     // Delete player file
                        if (err) throw err;
                    });
                }
                else {
                    tools.writePlayerData(player.id, player);
                }
            });
        });
    }
    return totalDamage;
}