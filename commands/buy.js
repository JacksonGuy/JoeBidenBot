const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
                const message = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle("Error")
                    .setDescription("That item does not exist")
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.avatarURL()
                    });
                await interaction.reply({ embeds: [message] });
                return;
            }

            fs.readFile('./data/balance_data.json', (err1, data1) => {
                if (err1) throw err1;
                let bal_data = JSON.parse(data1);
                fs.readFile('./data/player_item_data.json', (err2, data2) => {
                    if (err2) throw err2;
                    let player_items = JSON.parse(data2);
                    let b_price = item_data[item]["price"];
                    let bal = bal_data[server.id][author.id];
                    let scale = item_data[item]["scale"];

                    let p_amount = player_items[server.id][author.id][item];
                    
                    let amount = 1; // Default value
                    if (interaction.options.getString("amount")) {
                        if (interaction.options.getString != "max") {
                            amount = parseInt(interaction.options.getString("amount"));
                        }
                    }
                    if (interaction.options.getString("amount") === "max") { // Buy max
                        amount = 0;
                        let item_cost = b_price + (b_price * p_amount * scale);
                        while (item_cost <= bal) {
                            player_items[server.id][author.id][item] += 1;
                            bal_data[server.id][author.id] -= (b_price + (b_price * p_amount * scale));

                            p_amount = player_items[server.id][author.id][item];
                            item_cost = b_price + (b_price * p_amount * scale);
                            bal = bal_data[server.id][author.id];

                            amount++;
                        }
                        const message = new EmbedBuilder()
                            .setColor(0x00FF00)
                            .setTitle("Purchased")
                            .setDescription(`${amount} of ${item} bought`)
                            .setAuthor({
                                name: interaction.user.tag,
                                iconURL: interaction.user.avatarURL()
                            });
                        interaction.reply({ embeds: [message] });
                    }
                    else { // Buy amount
                        let item_cost = b_price + amount * (b_price * p_amount * scale);
                        if (item_cost <= bal) {
                            player_items[server.id][author.id][item] += amount;
                            bal_data[server.id][author.id] -= (item_cost);

                            const message = new EmbedBuilder()
                                .setColor(0x00FF00)
                                .setTitle("Purchased")
                                .setDescription(`${amount} of ${item} bought`)
                                .setAuthor({
                                    name: interaction.user.tag,
                                    iconURL: interaction.user.avatarURL()
                                });
                            interaction.reply({ embeds: [message] });
                        }
                        else {
                            const message = new EmbedBuilder()
                                .setColor(0x00FF00)
                                .setTitle("Error")
                                .setDescription("You can't afford that")
                                .setAuthor({
                                    name: interaction.user.tag,
                                    iconURL: interaction.user.avatarURL()
                                });
                            interaction.reply({ embeds: [message] });
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