const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const tools = require('../tools');

var item_data;
fs.readFile("./data/item_data.json", (err, data) => {
    if (err) throw err;
    item_data = JSON.parse(data);
});

// Keeping this old code here just in case the new method stops working
/*
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
                        let arr = [];
                        bal_data = JSON.parse(data3);
                        for (let user in bal_data[server.id]) {
                            arr.push(user);
                            let last_time = time_data[server.id][user];
                            let time = Math.floor( (Date.now() - last_time) / 1000); // in seconds
                            let income = 1;
                            for (let item in player_items[server.id][user]) {
                                income += (item_data[item]["income"] * player_items[server.id][user][item]) * time;
                            }
                            bal_data[server.id][user] += income;
                            time_data[server.id][user] = Date.now();
                        }
                        // Sorting time
                        let n = arr.length;
                        for (let i = 0; i < n; i++) {
                            for (let j = 0; j < n-i-1; j++) {
                                if (bal_data[server.id][arr[j]] > bal_data[server.id][arr[j+1]]) {
                                    let temp = arr[j];
                                    arr[j] = arr[j+1];
                                    arr[j+1] = temp;
                                }
                            }
                        }
                        for (let i = n-1; i >= 0; i--) {
                            let bal = bal_data[server.id][arr[i]];
                            interaction.guild.members.fetch(arr[i])
                                .then((person) => {
                                    interaction.channel.send(`${person.displayName}: $${bal}`);
                                });
                        }
                        interaction.reply("Top balances for this server: ");

                        bal_data = JSON.stringify(bal_data, null, 2);
                        fs.writeFileSync('./data/balance_data.json', bal_data);
                        time_data = JSON.stringify(time_data, null, 2);
                        fs.writeFileSync('./data/player_time_data.json', time_data);
                    });
                });
            });
        }
}
*/

async function make_leaderboard(interaction, message, arr) {
    let promise = new Promise( (resolve) => {
        let n = arr.length;
        let server = interaction.guild;
        for (let i = n-1; i >= 0; i--) {
            let bal = bal_data[server.id][arr[i]];
            interaction.guild.members.fetch(arr[i])
                .then((person) => {
                    message.addFields(
                        { name: `${person.displayName}`, value: `$${bal}`}
                    );
                });
        }
        resolve(1);
    });
    await promise;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("baltop")
        .setDescription("Shows the user's current balance"),
        async execute(interaction) {
            let server = interaction.guild;
            tools.update_bal(server.id).then(() => {
                fs.readFile('./data/balance_data.json', (err, data) => {
                    if (err) throw err;
                    bal_data = JSON.parse(data);
    
                    // Put all users from server into array
                    let arr = [];
                    for (let user in bal_data[server.id]) {
                        arr.push(user);
                    }

                    // Bubble Sort array
                    let n = arr.length;
                    for (let i = 0; i < n; i++) {
                        for (let j = 0; j < n-i-1; j++) {
                            if (bal_data[server.id][arr[j]] > bal_data[server.id][arr[j+1]]) {
                                let temp = arr[j];
                                arr[j] = arr[j+1];
                                arr[j+1] = temp;
                            }
                        }
                    }

                    var message = new EmbedBuilder()
                        .setColor(0x00FF00)
                        .setTitle("Leaderboard")
                        .setAuthor({
                            name: interaction.user.tag,
                            iconURL: interaction.user.avatarURL()
                        });

                    make_leaderboard(interaction, message, arr).then(() => {
                        interaction.reply({ embeds: [message] });
                    });
                });
            });
        }
}