const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const tools = require('../tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("watchlist")
        .setDescription("Shows your server's watch list")
        .addStringOption(option =>
            option
                .setName("list")
                .setDescription("List to show")
                .setRequired(false)),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;
            let filename = './data/' + server.id + '.json';

            let list = "default";
            if (interaction.options.getString('list')) {
                list = interaction.options.getString('list');
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
                    
                    let listContent = "";
                    if ('watch_list' in server_data) {
                        message.setTitle("Watch List");
                        for (item in server_data['watch_list'][list]) {
                            listContent = listContent + ` ${server_data['watch_list'][list][item]}\n`;
                        }
                        message.setDescription(listContent);
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