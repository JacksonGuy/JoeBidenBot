const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bal")
        .setDescription("Show the user's current balance"),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;
            fs.readFile('./data/balance_data.json', (err, data) => {
                if (err) throw err;
                let bal_data = JSON.parse(data);
                let bal = bal_data[server.id][author.id];
                interaction.reply(`Your balance is: ${bal}`);
            });
        }
}