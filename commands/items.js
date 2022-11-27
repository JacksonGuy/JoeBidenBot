const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("items")
        .setDescription("Lists the user's items"),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;
            fs.readFile('./data/player_item_data.json', (err, data) => {
                if (err) throw err;
                let item_data = JSON.parse(data);

                var message = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setAuthor({
                        name: author.tag,
                        iconURL: author.avatarURL()
                    });

                if (!(author.id in item_data[server.id])) {
                    message.setTitle("Error");
                    message.setDescription("You need to do `/start` first");
                    interaction.reply({ embeds: [message] });
                    return;
                }
                else {
                    message.setTitle("Items");
                    message.setDescription("Your items");
                    for (let item in item_data[server.id][author.id]) {
                        message.addFields(
                            { name: `${item}`, value: `${item_data[server.id][author.id][item]}`}
                        );
                    }
                    interaction.reply({ embeds: [message] });
                }
            });
        }
}