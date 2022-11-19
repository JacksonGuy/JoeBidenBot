const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

var item_data;
fs.readFile('./data/item_data.json', (err, data) => {
    if (err) throw err;
    item_data = JSON.parse(data);
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
        .addStringOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of the item to buy (type max to buy maximum amount)")),
        async execute(interaction) {
            let item = interaction.options.getString("item");
            let server = interaction.guild;
            let author = interaction.user;

            if (!(item in item_data)) {
                await interaction.reply("Item doesn't exist");
                return;
            }

            fs.readFile('./data/balance_data.json', (err1, data1) => {
                if (err1) throw err1;
                let bal_data = JSON.parse(data1);
                fs.readFile('./data/player_item_data.json', (err2, data2) => {
                    if (err2) throw err2;
                    let player_items = JSON.parse(data2);
                    let item_cost = item_data[item]["price"];
                    let bal = bal_data[server.id][author.id];

                    let amount = 1;
                    if (interaction.options.getString("amount")) {
                        if (interaction.options.getString != "max") {
                            amount = parseInt(interaction.options.getString("amount"));
                        }
                    }
                    if (interaction.options.getString("amount") === "max") { // Buy max
                        amount = Math.floor(bal / item_cost);
                        player_items[server.id][author.id][item] += amount;
                        bal_data[server.id][author.id] -= (amount * item_cost);
                        interaction.reply(`${amount} ${item} purchased`);
                    }
                    else { // Buy amount
                        if (amount * item_cost <= bal) {
                            player_items[server.id][author.id][item] += amount;
                            bal_data[server.id][author.id] -= (amount * item_cost);
                            interaction.reply(`${amount} ${item} purchased`);
                        }
                        else {
                            interaction.reply("You can't afford that");
                        }
                    }
                    bal_data = JSON.stringify(bal_data, null, 2);
                    fs.writeFileSync('./data/balance_data.json', bal_data)
                    player_items = JSON.stringify(player_items, null, 2);
                    fs.writeFileSync('./data/player_item_data.json', player_items);
                });
            });
        }
}