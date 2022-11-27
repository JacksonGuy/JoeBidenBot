const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require("fs");

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
            fs.readFile('./data/player_item_data.json', (err, data) => {
                if (err) throw err;
                player_items = JSON.parse(data);

                var message = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle("Store")
                    .setDescription("Buy items to make money over time")
                    .setAuthor({
                        name: author.tag,
                        iconURL: author.avatarURL()
                    });

                for (let item in items) {
                    price = items[item]["price"] + (items[item]["price"] * player_items[server.id][author.id][item] * items[item]["scale"]);
                    message.addFields(
                        { name: `${item}`, value: `$${price}`}
                    );
                }

                interaction.reply({ embeds: [message] });
            });
        }
    }