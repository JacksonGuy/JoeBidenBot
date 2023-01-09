const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const tools = require('../tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addwatch")
        .setDescription("Add a movie/show to watch list")
        .addStringOption(option =>
            option
                .setName("media")
                .setDescription("The movie/show to add")
                .setRequired(true))
        .addStringOption(option => 
            option
                .setName("list")
                .setDescription("List to add the media to")
                .setRequired(false)),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;
            let filename = './data/' + server.id + '.json';
            let media = interaction.options.getString("media");

            let list = "default";
            if (interaction.options.getString("list")) {
                list = interaction.options.getString("list");
            }

            var message = new EmbedBuilder()
                .setColor(0x00FF00)
                .setAuthor({
                    name: author.tag,
                    iconURL: author.avatarURL()
                });
            
            await tools.check_server_exists(server.id).then(result => {
                if (!result) {
                    fs.writeFileSync(fileName, JSON.stringify({}));
                }

                fs.readFile(filename, (err, data) => {
                    if (err) throw err;
                    server_data = JSON.parse(data);

                    if ('watch_list' in server_data) {
                        server_data['watch_list'][list].push(media);
                    }
                    else {
                        server_data['watch_list'][list] = [];
                        server_data['watch_list'][list].push(media);
                    }

                    message.setTitle("Successfully added");
                    message.setDescription("Added " + media + " to watch list");
                    interaction.reply({ embeds: [message] });

                    server_data = JSON.stringify(server_data, null, 2);
                    fs.writeFileSync(filename, server_data);
                });
            });
        }
}