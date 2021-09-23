const fs = require('fs');

exports.randomNumRange = function (min, max) {
    let low = Math.ceil(min);
    let high = Math.floor(max);
    return Math.floor(Math.random() * (high-low) + low);
}

exports.randomNum = function (max) {
    return Math.floor(Math.random() * max);
}

exports.writePlayerData = function (id, obj) {
    obj = JSON.stringify(obj);
    fs.writeFile(`./players/${id}.json`, obj, (err) => {
        if (err) throw err;
    });
}

exports.writeEnemyData = function (id, obj) {
    obj = JSON.stringify(obj);
    fs.writeFile(`./enemies/${id}.json`, obj, (err) => {
        if (err) throw err;
    });
}

exports.writeEncounterData = function (id, obj) {
    obj = JSON.stringify(obj);
    fs.writeFile(`./encounters/${id}.json`, obj, (err) => {
        if (err) throw err;
    });
}