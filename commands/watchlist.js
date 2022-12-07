const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const tools = require('../tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("watchlist")
        .setDescription("Shows your server's watch list"),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;
            let filename = './data/' + server.id + '.json';

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
                    
                    let list = "";
                    if ('watch_list' in server_data) {
                        message.setTitle("Watch List");
                        for (item in server_data['watch_list']) {
                            list = list + ` ${server_data['watch_list'][item]}\n`;
                        }
                        message.setDescription(list);
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