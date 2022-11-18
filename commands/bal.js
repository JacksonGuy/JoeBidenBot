const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

var item_data;
fs.readFile("./data/item_data.json", (err, data) => {
    if (err) throw err;
    item_data = JSON.parse(data);
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bal")
        .setDescription("Show the user's current balance"),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;
            fs.readFile('./data/player_item_data.json', (err, data1) => {
                if (err) throw err;
                let time_data = JSON.parse(data1);
                fs.readFile('./data/player_item_data.json', (err, data2) => {
                    if (err) throw err;
                    let player_items = JSON.parse(data2);
                    let last_time = time_data[server.id][author.id];
                    let time = Math.floor( (Date.now() - last_time) / 1000); // in seconds
                    let income = 1;
                    // Update player income
                    for (let item in player_items[server.id][author.id]) {
                        // $$ per item * amount of that item * amount of time
                        income += (item_data[item]["income"] * player_items[item]) * time
                    }

                    fs.readFile('./data/balance_data.json', (err, data3) => {
                        if (err) throw err;
                        let bal_data = JSON.parse(data3);
                        bal_data[server.id][author.id] += income;
                        let bal = bal_data[server.id][author.id];
                        interaction.reply(`Your balance is: ${bal}`);

                        bal_data = JSON.stringify(bal_data, null, 2);
                        fs.writeFileSync('./data/balance_data.json', bal_data);
                    });
                });
            });
        }
}