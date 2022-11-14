const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("erase")
        .setDescription("Deletes the specified number of messages")
        .addIntegerOption(option => 
            option
                .setName("amount")
                .setDescription("The amount of messages to delete")
                .setRequired(true)),
        async execute(interaction) {
            const amount = interaction.options.getInteger("amount");
            await interaction.channel.messages.fetch({limit: amount}).then(messages => {
                messages.forEach(message => message.delete());
            });
            await interaction.reply(`Deleted ${amount} messages`);
        }
}