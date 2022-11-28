const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
            const message = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle("Erase")
                .setDescription(`Deleted ${amount} messages channel`)
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.avatarURL()
                });
            await interaction.reply({ embeds: [message] });
        }
}