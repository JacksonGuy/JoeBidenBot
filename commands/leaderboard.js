const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { PassThrough } = require('stream');
const tools = require('../tools');

var player_data;

async function make_leaderboard(interaction, message, arr) {
    let promise = new Promise(resolve => {
        let game = interaction.options.getString("game").toLowerCase();
        for (let i = 0; i < arr.length; i++) {
            let wins = arr[i][1]['stats'][game]['won'];
            let total = arr[i][1]['stats'][game]['total'];
            interaction.guild.members.fetch(arr[i][0]).then(person => {
                message.addFields(
                    { name: `${person.displayName}`, value: `${wins} (${Math.floor((wins/total)*100)}% winrate)` }
                );
            });
        }
        resolve(true);
    });
    return promise;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows the top player stats for a game")
        .addStringOption(option => 
            option
                .setName("game")
                .setDescription("The game to get data for")
                .setRequired(true)),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;
            let game = interaction.options.getString("game").toLowerCase();

            let games = [
                "coinflip",
                "roulette"
            ]

            var message = new EmbedBuilder()
                .setColor(0x00FF00)
                .setAuthor({
                    name: author.tag,
                    iconURL: author.avatarURL()
                });

            if (!(games.includes(game))) {
                message.setTitle("Error");
                message.setDescription("Game doesn't exist: " + game);
                interaction.reply({ embeds: [message] });
                return;
            }
            await tools.check_server_exists(server.id).then(result => {
                if (!result) {
                    message.setTitle("Error");
                    message.setDescription("No data exists for this server");
                    interaction.reply({ embeds: [message] });
                    return;
                }

                fs.readFile('./data/' + server.id + '.json', (err, data) => {
                    if (err) throw err;
                    player_data = JSON.parse(data);

                    let user_array = {
                        "coinflip": [],
                        "roulette": []
                    };

                    // Put new users into arr
                    for (let user in player_data) {
                        user_array[game].push([user,player_data[user]]);
                    }

                    // Insertion sort array
                    let n = user_array.length;
                    for (let i = 1; i < n; i++) {
                        let next = user_array[game][i];
                        let j = i;
                        while (j > 0 && user_array[game][j-1][1]["stats"][game]["won"] > next[1]["stats"][game]["won"]) {
                            user_array[game][j] = user_array[game][j-1];
                            j--;
                        }
                        user_array[game][j] = next;
                    }

                    message.setTitle("Leaderboard: " + game);

                    make_leaderboard(interaction, message, user_array[game]).then(() => {
                        interaction.reply({ embeds: [message] });
                    });
                });
            })
        }
}