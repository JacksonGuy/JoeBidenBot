const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("baltop")
        .setDescription("Shows the top balances of users in the server"),
        async execute(interaction) {
            await interaction.reply("something");
        }
}