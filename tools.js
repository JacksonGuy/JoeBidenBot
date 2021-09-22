const fs = require('fs');

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