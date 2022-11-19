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
            fs.readFile('./data/player_time_data.json', (err1, data1) => {
                if (err1) throw err1;
                let time_data = JSON.parse(data1);
                fs.readFile('./data/player_item_data.json', (err2, data2) => {
                    if (err2) throw err2;
                    let player_items = JSON.parse(data2);
                    let last_time = time_data[server.id][author.id];
                    let time = Math.floor( (Date.now() - last_time) / 1000); // in seconds
                    var income = 0;
                    // Update player income
                    for (let item in player_items[server.id][author.id]) {
                        // $$ per item * amount of that item * amount of time
                        income += (item_data[item]["income"] * player_items[server.id][author.id][item]) * time;
                    }
                    // Update player time
                    time_data[server.id][author.id] = Date.now();
                    time_data = JSON.stringify(time_data, null, 2);
                    fs.writeFileSync('./data/player_time_data.json', time_data);

                    fs.readFile('./data/balance_data.json', (err3, data3) => {
                        if (err3) throw err3;
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