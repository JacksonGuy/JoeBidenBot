const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("spam")
        .setDescription("Spams a message the specified number of times")
        .addStringOption(option => 
                option
                    .setName("message")
                    .setDescription("Message to be spammed")
                    .setRequired(true))
        .addIntegerOption(option => 
            option
                .setName("amount")
                .setDescription("The amount of times to send the message")
                .setRequired(true)),
        async execute(interaction) {
            const message = interaction.options.getString("message");
            const amount = interaction.options.getInteger("amount");
            await interaction.reply(`Spam incomming`);
            for (let i = 0; i < amount; i++) {
                await interaction.channel.send(message);
            }
        }
}