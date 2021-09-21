const fs = require('fs');

exports.createPlayer = function (user) {
    let obj = {
        "level" : 1,
        "experience" : 0,
        "nextLevelXP" : 10,
        "health" : 10,
        "gold" : 100,
        "inventory" : 
            {
                "health potion" : 2
            },
        "gear" : 
            {
                "weapon" : "wood sword"
            },
        "position" : 
            {
                "location" : "town",
                "x" : 0,
                "y" : 0
            }
    };
    let json = JSON.stringify(obj);
    fs.writeFile(`./players/${user}.json`, json, (err) => {
        if (err) throw err;
    });
}