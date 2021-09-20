const fs = require('fs');

exports.createPlayer = function (user) {
    let obj = {
        "level" : 1,
        "health" : 10,
        "gold" : 100,
        "inventory" : [
            {
                "health potion" : 2
            }
        ],
        "gear" : [
            {
                "sword" : "wood sword"
            }
        ],
        "location" : "town"
    };
    let json = JSON.stringify(obj);
    fs.writeFile(`${user}.json`, json, 'utf-8', callback);
}