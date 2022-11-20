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
            for (let item in items) {
                interaction.channel.send(`${item}: $${items[item]["price"]}`);
            }
            interaction.reply("Store: ");
        }
    }