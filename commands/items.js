const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

var items;
fs.readFile('./data/item_data.json', (err, data) => {
    if (err) throw err;
    items = JSON.parse(data);
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("items")
        .setDescription("Lists the items available to buy"),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;
            fs.readFile('./data/player_item_data.json', (err, data) => {
                if (err) throw err;
                player_items = JSON.parse(data);
                for (let item in items) {
                    price = items[item]["price"] + (items[item]["price"] * player_items[server.id][author.id][item] * items[item]["scale"]);
                    interaction.channel.send(`${item}: $${price}`);
                }
            });
            await interaction.reply("Store: ");
        }
    }