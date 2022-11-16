const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

var bal_data;
var item_data;
var player_items;

fs.readFile('./data/balance_data.json', (err, data) => {
    if (err) throw err;
    bal_data = JSON.parse(data);
});
fs.readFile('./data/item_data.json', (err, data) => {
    if (err) throw err;
    item_data = JSON.parse(data);
});
fs.readFile("./data/player_item_data.json", (err, data) => {
    if (err) throw err;
    player_items = JSON.parse(data);
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy the specified item")
        .addStringOption(option => 
            option
                .setName("item")
                .setDescription("The item to buy")
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of the item to buy"))
        .addStringOption(option =>
            option
                .setName("max")
                .setDescription("Buy maximum amount of the item")),
        async execute(interaction) {
            let item = interaction.options.getString("item");
            let item_cost = item_data[item];

            let server = interaction.guild;
            let author = interaction.user;
            let bal = bal_data[server.id][author.id];

            if (!interaction.options.getString("max")) {
                let amount = 1;
                if (interaction.options.getInteger("amount")) {
                    amount = interaction.options.getInteger("amount");
                }
                if (amount * item_cost <= bal) {
                    player_items[server.id][author.id][item] += amount;
                    bal_data[server.id][author.id] -= (amount * item_cost);
                    await interaction.reply(`${amount} ${item} purchased`);
                }
                else {
                    await interaction.reply("You can't afford that");
                }
            }
            else {
                let amount = Math.floor(bal / item_cost);
                player_items[server.id][author.id][item] += amount;
                bal_data[server.id][author.id] -= (amount * item_cost);
                await interaction.reply(`${amount} ${item} purchased`);
            }

            bal_data = JSON.stringify(bal_data, null, 2);
            fs.writeFileSync('./data/balance_data.json', bal_data)
            player_items = JSON.stringify(player_items, null, 2);
            fs.writeFileSync('./data/player_item_data.json', player_items);
        }
}