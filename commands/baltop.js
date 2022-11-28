const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const tools = require('../tools');

var item_data;
fs.readFile("./data/item_data.json", (err, data) => {
    if (err) throw err;
    item_data = JSON.parse(data);
});

async function make_leaderboard(interaction, message, arr) {
    let promise = new Promise( (resolve) => {
        let n = arr.length;
        for (let i = n-1; i >= 0; i--) {
            let bal = player_data[arr[i]]['bal'];
            interaction.guild.members.fetch(arr[i])
                .then((person) => {
                    message.addFields(
                        { name: `${person.displayName}`, value: `$${bal}`}
                    );
                });
        }
        resolve(true);
    });
    await promise;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("baltop")
        .setDescription("Shows the user's current balance"),
        async execute(interaction) {
            let server = interaction.guild;
            
            var message = new EmbedBuilder()
                .setColor(0x00FF00)
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL()
                });

            await tools.update_bal(server.id).then((result) => {
                if (!result) {
                    message.setTitle('Error');
                    message.setDescription('No data exists for this server');
                    interaction.reply({ embeds: [message] });
                    return;
                }

                fs.readFile('./data/' + server.id + '.json', (err, data) => {
                    if (err) throw err;
                    player_data = JSON.parse(data);
    
                    // Put all users from server into array
                    let arr = [];
                    for (let user in player_data) {
                        arr.push(user);
                    }

                    // Bubble Sort array
                    let n = arr.length;
                    for (let i = 0; i < n; i++) {
                        for (let j = 0; j < n-i-1; j++) {
                            if (player_data[arr[j]] > player_data[arr[j+1]]) {
                                let temp = arr[j];
                                arr[j] = arr[j+1];
                                arr[j+1] = temp;
                            }
                        }
                    }

                    message.setTitle('Leaderboard');

                    make_leaderboard(interaction, message, arr).then(() => {
                        interaction.reply({ embeds: [message] });
                    });
                });
            });
        }
}