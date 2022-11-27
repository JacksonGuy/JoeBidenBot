const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commandsPath = __dirname;
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Lists out all the available commands"),
        async execute(interaction) {
            var message = new EmbedBuilder()
                .setColor(0x00FF00)
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL()
                })
                .setTitle("Help")
                .setDescription("Available commands");

            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    message.addFields(
                        { name: command.data.name, value: command.data.description }
                    );
                }
            }

            interaction.reply({ embeds: [message] });
        }
}