const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const tools = require('../tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("watchlists")
        .setDescription("Shows all watchlists for the server"),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;
            let filename = './data/' + server.id + '.json';

            let message = new EmbedBuilder()
                .setColor(0x00FF00)
                .setAuthor({
                    name: author.tag,
                    iconURL: author.avatarURL()
                });
            
            await tools.check_server_exists(server.id).then(result => {
                if (!result) {
                    message.setTitle("Error");
                    message.setDescription("There aren't any watchlists for this server");
                    interaction.reply({ embeds: [message] });
                    return;
                }

                fs.readFile(filename, (err,data) => {
                    if (err) throw err;
                    server_data = JSON.parse(data);

                    if ('watch_list' in server_data) {
                        let lists = "";
                        message.setTitle("Watch lists");
                        for (item in server_data['watch_list']) {
                            lists = lists + ` ${item}\n`;
                        }
                        message.setDescription(lists);
                        interaction.reply({ embeds: [message] });
                        return;
                    }
                    else {
                        message.setTitle("Error");
                        message.setDescription("There aren't any watchlists for this server");
                        interaction.reply({ embeds: [message] });
                        return;
                    }
                });
            })
        }
}