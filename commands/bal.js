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

            // Check if server file exists first
            /*
            fs.readdir('./data/', (err, data) => {
                if (err) throw err;
                let server_file = server.id + '.json';
                if (!(data.includes(server_file))) {
                    interaction.reply("You need to do `/start` first");
                    return;
                }
            });
            */

            tools.update_bal(server.id, author.id).then(() => {
                fs.readFile('./data/' + server.id + '.json', (err, data) => {
                    if (err) {
                        interaction.reply("You need to do `/start` first");
                        return;
                    }
                    player_data = JSON.parse(data);
    
                    var message = new EmbedBuilder()
                        .setColor(0x00FF00)
                        .setAuthor({
                            name: author.tag,
                            iconURL: author.avatarURL()
                        });

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