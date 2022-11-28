const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require("fs");
const tools = require("../tools");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("items")
        .setDescription("Lists the user's items"),
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
                    let player_data = JSON.parse(data);
    
                    if (!(author.id in player_data)) {
                        message.setTitle("Error");
                        message.setDescription("You need to do `/start` first");
                        interaction.reply({ embeds: [message] });
                        return;
                    }
                    else {
                        message.setTitle("Items");
                        message.setDescription("Your items");
                        for (let item in player_data[author.id]['items']) {
                            message.addFields(
                                { name: `${item}`, value: `${player_data[author.id]['items'][item]}`}
                            );
                        }
                        interaction.reply({ embeds: [message] });
                    }
                });
            });
        }
}