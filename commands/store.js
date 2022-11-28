const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require("fs");
const tools = require("../tools");

var items;
fs.readFile('./data/item_data.json', (err, data) => {
    if (err) throw err;
    items = JSON.parse(data);
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("store")
        .setDescription("Lists the items available to buy"),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;

            var message = new EmbedBuilder()
                .setColor(0x00FF00)
                .setAuthor({
                    name: author.tag,
                    iconURL: author.avatarURL()
                });

            await tools.check_server_exists(server.id).then(result => {
                if (!result) {
                    message.setTitle("Error");
                    message.setDescription("You need to do `/start` first");
                    interaction.reply({ embeds: [message] });
                    return;
                }
                fs.readFile('./data/' + server.id + '.json', (err, data) => {
                    if (err) throw err;
                    player_data = JSON.parse(data);
                    
                    if (!(author.id in player_data)) {
                        message.setTitle("Error");
                        message.setDescription("You need to do `/start` first");
                        interaction.reply({ embeds: [message] });
                        return;
                    }

                    for (let item in items) {
                        let price = items[item]['price'] + (items[item]['price'] * player_data[author.id]['items'][item] * items[item]['scale']);
                        message.addFields(
                            { name: `${item}`, value: `$${price}`}
                        );
                    }

                    interaction.reply({ embeds: [message]} );
                });
            });
        }
    }