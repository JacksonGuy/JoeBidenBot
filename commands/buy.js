const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require("fs");
const tools = require("../tools");

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
                .setDescription("The item to buy (case sensitive!)")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of the item to buy (type max to buy maximum amount)")),
        async execute(interaction) {
            let item = interaction.options.getString("item");
            let server = interaction.guild;
            let author = interaction.user;

            var message = new EmbedBuilder()
                .setColor(0x00FF00)
                .setAuthor({
                    name: author.tag,
                    iconURL: author.avatarURL()
                });

            if (!(item in item_data)) {
                message.setTitle("Error");
                message.setDescription("Item does not exist: " + item);
                await interaction.reply({ embeds: [message] });
                return;
            }

            await tools.update_bal(server.id, author.id).then(result => {
                if (!result) {
                    message.setTitle("Error");
                    message.setDescription("You need to do `/start` first");
                    interaction.reply({ embeds: [message] });
                    return;
                }
                fs.readFile('./data/' + server.id + '.json', (err, data) => {
                    if (err) throw err;
                    player_data = JSON.parse(data);

                    if (author.id in player_data) {
                        let base_price = item_data[item]["price"];
                        let item_scale = item_data[item]["scale"];
                        let bal = player_data[author.id]["bal"];
                        let player_item_amount = player_data[author.id]["items"][item];

                        let amount = 1; // Default buy amount
                        let amountOption = interaction.options.getString("amount");
                        // User specified an amount to buy
                        if (amountOption) {
                            if (amountOption !== "max") {
                                if (!(isNaN(parseInt(amountOption)))) {
                                    amount = parseInt(amountOption);
                                }
                                else {
                                    message.setTitle("Error");
                                    message.setDescription("Invalid amount");
                                    interaction.reply({ embeds: [message] });
                                    return;
                                }
                            }
                        }

                        // Buy maximum amount of the item
                        if (amountOption === "max") {
                            amount = 0;
                            let buy_cost = base_price + (base_price * player_item_amount * item_scale);
                            while (buy_cost <= bal) {
                                player_data[author.id]["items"][item] += 1;
                                player_data[author.id]["bal"] -= buy_cost;

                                // Update variables
                                player_item_amount++;
                                buy_cost = base_price + (base_price * player_item_amount * item_scale);
                                bal = player_data[author.id]["bal"];
                                amount++;
                            }
                        }
                        // Buy a specific amount
                        else {
                            let buy_cost = base_price + (base_price * player_item_amount * item_scale);
                            if (buy_cost <= bal) {
                                player_data[author.id]["items"][item] += 1;
                                player_data[author.id]["bal"] -= buy_cost;
                            }
                            else {
                                message.setTitle("Error");
                                message.setDescription("You can't afford that");
                                interaction.reply({ embeds: [message] });
                                return;
                            }
                        }

                        message.setTitle("Purchase successful");
                        message.setDescription(`You bought ${amount} of ${item}`);
                        interaction.reply({ embeds: [message] });

                        player_data = JSON.stringify(player_data, null, 2);
                        fs.writeFileSync('./data/' + server.id + '.json', player_data);
                    }
                    else {
                        message.setTitle("Error");
                        message.setDescription("You need to do `/start` first");
                        
                        interaction.reply({ embeds: [message] });
                        return;
                    }
                });
            });
        }
}