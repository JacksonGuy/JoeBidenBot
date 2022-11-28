const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require("fs");
const tools = require("../tools");

var item_data;
fs.readFile("./data/item_data.json", (err, data) => {
    if (err) throw err;
    item_data = JSON.parse(data);
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bal")
        .setDescription("Shows the user's current balance"),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;

            var message = new EmbedBuilder()
                .setColor(0x00FF00)
                .setAuthor({
                    name: author.tag,
                    iconURL: author.avatarURL()
                });

            await tools.update_bal(server.id, author.id).then((result) => {
                if (!result) {
                    message.setTitle("Error");
                    message.setDescription("You need to do `/start` first");
                    interaction.reply({ embeds: [message] });
                    return;
                }
                fs.readFile('./data/' + server.id + '.json', (err, data) => {
                    if (err) throw err;
                    player_data = JSON.parse(data);

                    // Check if player exists
                    if (author.id in player_data) {
                        bal = player_data[author.id]["bal"];

                        message.setTitle("Balance");
                        message.setDescription(`$${bal}`);
                        
                        interaction.reply({ embeds: [message ]});
                    }
                    else {
                        message.setTitle("Error");
                        message.setDescription("You need to do `/start` first");
                        
                        interaction.reply({ embeds: [message] });
                    }
                });
            });
        }
}