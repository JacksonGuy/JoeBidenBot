const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const tools = require('../tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fucktyler")
        .setDescription("Tyler William Warren has a severe World of Warcraft Addiction")
        .addStringOption(option => 
            option
                .setName("option")
                .setDescription("What to do (either start or get)")
                .setRequired(true)),
        async execute(interaction) {
            let server = interaction.guild;
            let filename = './data/' + server.id + '.json'
            let tyler = await server.members.fetch({ user: '416364666676314133', withPresences: true });
            
            if (tools.check_server_exists(server.id).then(result => {
                if (!result) {
                    fs.writeFileSync(filename, JSON.stringify({}));
                }
            }));

            if (interaction.options.getString("option") === "start") {
                interaction.reply("Started tracking");
                setInterval(function() {
                    if (tyler.presence.activities[0]) {
                        if (tyler.presence.activities[0].name === "World of Warcraft") {
                            fs.readFile(filename, (err, data) => {
                                if (err) throw err;
                                server_data = JSON.parse(data);
                                server_data['tyler']++;

                                server_data = JSON.stringify(server_data, null, 2);
                                fs.writeFileSync(filename, server_data);
                            });
                        }
                    }
                }, 60000);
            }
            else if (interaction.options.getString("option") === "get") {
                fs.readFile(filename, (err, data) => {
                    if (err) throw err;
                    server_data = JSON.parse(data);
                    interaction.reply(`Tyler has played WoW for ${parseFloat(server_data['tyler']/60).toFixed(2)} hours`);
                });
            }
        }
}