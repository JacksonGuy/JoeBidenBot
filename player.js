const tools = require('./tools');

exports.createPlayer = function (user) {
    let obj = {
        "level" : 1,
        "experience" : 0,
        "nextLevelXP" : 10,

        "maxHealth" : 10,
        "health" : 10,

        "maxMana" : 10,
        "mana" : 10,

        "gold" : 100,

        "stats" : {
            "Strength" : 1,         // Standard attack and ability damage
            "Stamina" : 1,          // Health --> maxHealth = (10 * level) + stamina
            "Agility" : 1,          // Attack speed (like pokemon --> higher agi attacks first)
            "Intelligence" : 1,     // Spell damage + mana --> mana = (10 * level) + intelligence
        },
        "inventory" : {
            "Health Potion" : 2
        },

        "gear" : {
            "weapon" : "wood sword"
        },

        "position" : {
            "location" : "town",
            "x" : 0,
            "y" : 0
        },

        "instanceID" : 0
    };
    tools.writePlayerData(user, obj);
}