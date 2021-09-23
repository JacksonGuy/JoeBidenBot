const tools = require("./tools");

var playerSpells = [];

function fireball(player, target) {
    let levelRequirement = 1;
    let manaCost = 1;
    let damage = player.level * player.stats.Intelligence;
    if (player.level >= levelRequirement && player.mana >= manaCost) {
        let result = tools.randomNumRange(player.level, damage);
        player.mana -= manaCost;
        target.health -= result;

        tools.writePlayerData(player.id, player);
        tools.writeEnemyData(target.id, target);

        return result;
    }
}

playerSpells["fireball"] = fireball;

exports.castSpell = function (spell, player, target) {
    return playerSpells[spell](player, target);
}