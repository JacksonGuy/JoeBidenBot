const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stalin")
        .setDescription("Deletes messages from the specified user")
        .addUserOption(option => 
                option
                    .setName("user")
                    .setDescription("The target user")
                    .setRequired(true))
        .addIntegerOption(option => 
            option
                .setName("limit")
                .setDescription("The maximum number of messages to delete")),
        async execute(interaction) {
            let target = interaction.options.getUser("user");
            let amount = 1000;
            if (interaction.options.getInteger("limit")) {
                amount = interaction.options.getInteger("limit");
            }
            await interaction.reply(`Deleting messages from ${target}`);
            interaction.channel.messages.fetch({limit: amount}).then(messages => {
                messages.forEach(message => {
                    if (message.author.id === target.id) {
                        message.delete();
                    }
                });
            });
        }
}