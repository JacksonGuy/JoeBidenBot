const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("myitems")
        .setDescription("Lists the user's items"),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;
            fs.readFile('./data/player_item_data.json', (err, data) => {
                if (err) throw err;
                let item_data = JSON.parse(data);
                if (!(author.id in item_data)) {
                    interaction.reply("You need to do `/start` first");
                    return;
                }
                else {
                    for (let item in item_data[server.id][author.id]) {
                        interaction.channel.send(`${item}: ${item_data[server.id][author.id][item]}`);
                    }
                    interaction.reply("Your items: ");
                }
            });
        }
}