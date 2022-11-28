const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require("fs");
const tools = require('../tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Creates a new player"),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;
            let fileName = './data/' + server.id + '.json'; 
            
            user = {
                [author.id]: {
                    "bal": 10,
                    "time": Date.now(),
                    "items": {
                        "Weed Plant": 0,
                        "Weed Garden": 0,
                        "Weed Farm": 0
                    }
                }
            }

            var message = new EmbedBuilder()
                .setColor(0x00FF00)
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL()
                });

            await tools.check_server_exists(server.id).then(result => {
                if (!result) {
                    fs.writeFileSync(fileName, JSON.stringify({}));
                }

                fs.readFile(fileName, (err, data) => {
                    if (err) throw err;
                    player_data = JSON.parse(data)

                    if (author.id in player_data) {
                        message.setTitle("Error");
                        message.setDescription("You already have an account");
                        interaction.reply({ embeds: [message] });
                        return;
                    }

                    let file = Array.from(player_data);
                    file.push(user);
                    file = JSON.stringify(file[0], null, 2);
                    fs.writeFileSync(fileName, file);

                    message.setTitle("Player created");
                    message.setDescription("Have fun ruining your life!");
                    interaction.reply({ embeds: [message] });
                });
            });
        }
}