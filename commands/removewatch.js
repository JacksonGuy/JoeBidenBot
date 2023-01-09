const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const tools = require('../tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removewatch")
        .setDescription("Remove a movie/show from watch list")
        .addStringOption(option =>
            option
                .setName("media")
                .setDescription("The movie/show to remove")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("list")
                .setDescription("List to remove from")
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
                    message.setTitle("Error");
                    message.setDescription("No watch list for this server");
                    interaction.reply({ embeds: [message] });
                    return;
                }

                fs.readFile(filename, (err, data) => {
                    if (err) throw err;
                    server_data = JSON.parse(data);
                    
                    if ('watch_list' in server_data) {
                        let index = server_data['watch_list'][list].indexOf(media);
                        if (index > -1) { 
                            server_data['watch_list'][list].splice(index, 1);
                        }
                        else {
                            message.setTitle("Error");
                            message.setDescription(`${media} not in watch list`);
                            interaction.reply({ embeds: [message] });
                            return;
                        }
                    }
                    else {
                        message.setTitle("Error");
                        message.setDescription("No watch list for this server");
                        interaction.reply({ embeds: [message] });
                        return;
                    }

                    message.setTitle("Successfully removed");
                    message.setDescription("Removed " + media + " from watch list");
                    interaction.reply({ embeds: [message] });

                    server_data = JSON.stringify(server_data, null, 2);
                    fs.writeFileSync(filename, server_data);
                });
            });
        }
}