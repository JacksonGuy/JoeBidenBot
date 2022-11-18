const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

var item_data;
fs.readFile("./data/item_data.json", (err, data) => {
    if (err) throw err;
    item_data = JSON.parse(data);
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("baltop")
        .setDescription("Shows the top balances of users in the server"),
        async execute(interaction) {
            let bal_data;
            let server = interaction.guild;
            fs.readFile('./data/player_time_data.json', (err1, data1) => {
                if (err1) throw err1;
                let time_data = JSON.parse(data1);
                fs.readFile('./data/player_item_data.json', (err2, data2) => {
                    if (err2) throw err2;
                    let player_items = JSON.parse(data2);
                    fs.readFile('./data/balance_data.json', (err3, data3) => {
                        if (err3) throw err3;
                        bal_data = JSON.parse(data3);
                        for (let user in bal_data[server.id]) {
                            let last_time = time_data[server.id][user];
                            let time = Math.floor( (Date.now() - last_time) / 1000); // in seconds
                            let income = 1;
                            for (let item in player_items[server.id][user]) {
                                income += (item_data[item]["income"] * player_items[server.id][user][item]) * time;
                            }
                            // Update player time
                            time_data[server.id][user] = Date.now();
                        }
                    })
                })
            })
            fs.readFile('./data/balance_data.json', (err, data) => {
                if (err) throw err;
                bal_data = JSON.parse(data);
                for (let user in bal_data[server.id]) {
                    interaction.guild.members.fetch(user)
                        .then((person) => interaction.channel.send(`${person.displayName}: ${bal_data[server][user]}`));
                }
                interaction.reply("Top balances for this server: ");
            });
        }
}