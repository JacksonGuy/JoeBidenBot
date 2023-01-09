const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const tools = require('../tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("randomwatch")
        .setDescription("Get a random item from your server's watch list")
        .addStringOption(option =>
            option
                .setName("list")
                .setDescription("List to get random item from")
                .setRequired(false)),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;
            let filename = './data/' + server.id + '.json';

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
                    message.setTitle("Error");
                    message.setDescription("There isn't a watch list for this server");
                    interaction.reply({ embeds: [message] });
                    return;
                }

                fs.readFile(filename, (err, data) => {
                    if (err) throw err;
                    server_data = JSON.parse(data);
                    
                    if ('watch_list' in server_data) {
                        let num = Math.floor(Math.random() * server_data['watch_list'][list].length);
                        message.setTitle("You should watch");
                        message.setDescription(server_data['watch_list'][list][num]);
                        interaction.reply({ embeds: [message] });
                        return;
                    }
                    else {
                        message.setTitle("Error");
                        message.setDescription("There isn't a watch list for this server");
                        interaction.reply({ embeds: [message] });
                        return;
                    }
                });
            });
        }
}