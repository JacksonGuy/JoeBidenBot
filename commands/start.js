const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Creates a new player"),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;
            fs.readFile('./data/balance_data.json', (err1, data1) => {
                if (err1) throw err1;

                // Create new balance entry
                let bal_data = JSON.parse(data1);
                if (!(author.id in bal_data[server.id])) {
                    bal_data[server.id][author.id] = 0;
                }
                bal_data = JSON.stringify(bal_data, null, 2);
                fs.writeFileSync('./data/balance_data.json', bal_data);

                // Create new items entry
                fs.readFile('./data/player_item_data.json', (err, data) => {
                    if (err) throw err;
                    player_items = JSON.parse(data);
                    player_items[server.id][author.id] = {
                        "item 1": 0,
                        "item 2": 0,
                        "item 3": 0
                    }
                    player_items = JSON.stringify(player_items, null, 2);
                    fs.writeFileSync('./data/player_item_data.json', player_items);
                });

                // Create new time entry
                fs.readFile('./data/player_time_data.json', (err, data) => {
                    if (err) throw err;
                    time_data = JSON.parse(data);
                    time_data[server.id][author.id] = Date.now();
                    time_data = JSON.stringify(time_data, null, 2);
                    fs.writeFileSync('./data/player_time_data.json', time_data);
                });

                interaction.reply("Player Created");
            })
        }
}