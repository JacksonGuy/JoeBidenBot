const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

var item_data;
fs.readFile("./data/item_data.json", (err, data) => {
    if (err) throw err;
    item_data = JSON.parse(data);
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("baltop")
        .setDescription("Shows the top balances of users in the server"),
        async execute(interaction) {
            var bal_data;
            fs.readFile('./data/balance_data.json', (err, data) => {
                if (err) throw err;
                bal_data = JSON.parse(data);
                for (var server in bal_data) {
                    if (server != interaction.guild.id) return;
                    for (var user in bal_data[server]) {
                        interaction.guild.members.fetch(user)
                            .then((person) => interaction.channel.send(`${person.displayName}: ${bal_data[server][user]}`));
                    }
                }
                interaction.reply("Top balances for this server: ");
            });
        }
}