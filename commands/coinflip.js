const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Flip a coin to win or loose money")
        .addStringOption(option => 
            option
                .setName("side")
                .setDescription("Which side of the coin to bet on")
                .setRequired(true))
        .addStringOption(option => 
            option
                .setName("bet")
                .setDescription("The amount of money to bet (type max to bet all your money)")
                .setRequired(true)),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;

            let bet = interaction.options.getString("bet");
            let side = interaction.options.getString("side").toLowerCase();

            if (side != "heads" && side != "tails") {
                interaction.reply("Invalid side");
                return;
            }

            fs.readFile('./data/balance_data.json', (err, data) => {
                if (err) throw err;
                let bal_data = JSON.parse(data);
                if (bet === "max") {
                    bet = bal_data[server.id][author.id];
                }
                else {
                    bet = parseInt(bet);
                    if (bet > bal_data[server.id][author.id]) {
                        interaction.reply("You don't have enough money");
                        return;
                    }
                }
                
                let roll = Math.floor(Math.random() * 2); 
                if (roll === 0) { // Heads
                    if (side === "heads") {
                        bal_data[server.id][author.id] += bet;
                        interaction.reply(`You win! New balance: $${bal_data[server.id][author.id]}`);
                    }
                    else {
                        bal_data[server.id][author.id] -= bet;
                        interaction.reply(`You lose! New balance: $${bal_data[server.id][author.id]}`);
                    }
                }
                else { // Tails
                    if (side === "tails") {
                        bal_data[server.id][author.id] += bet;
                        interaction.reply(`You win! New balance: $${bal_data[server.id][author.id]}`);
                    }
                    else {
                        bal_data[server.id][author.id] -= bet;
                        interaction.reply(`You lose! New balance: $${bal_data[server.id][author.id]}`);
                    }
                }

                bal_data = JSON.stringify(bal_data, null, 2);
                fs.writeFileSync('./data/balance_data.json', bal_data);
            });
        }
}