const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roulette")
        .setDescription("Play roulette, gamble money, ruin your life")
        .addStringOption(option => 
            option 
                .setName("pick")
                .setDescription("What type of bet to make (red/black, even/odd, high/low, or 0-36)")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("bet")
                .setDescription("The amount of money to bet (type max to bet all your money)")
                .setRequired(true)),
        async execute(interaction) {
            let server = interaction.guild;
            let author = interaction.user;

            let pick = interaction.options.getString("pick").toLowerCase();
            let bet = interaction.options.getString("bet");

            var message = new EmbedBuilder()
                .setColor(0x00FF00)
                .setAuthor({
                    name: author.tag,
                    iconURL: author.avatarURL()
                });

            let picks = ['red', 'black', 'even', 'odd', 'high', 'low'];
            if (!(picks.includes(pick))) { // User bet on number or invalid
                pick = parseInt(pick); // TODO : check if input is an integer
                if (!(pick >= 0 && pick <= 36)) {
                    message.setTitle("Error");
                    message.setDescription("Invalid choice");
                    await interaction.reply({ embeds: [message] });
                    return;
                }
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
                        message.setTitle("Error");
                        message.setDescription("You don't have enough money");
                        interaction.reply({ embeds: [message] });
                        return;
                    }
                }

                let color = Math.floor(Math.random() * 2);
                let number = Math.floor(Math.random() * 37);
                if (color === 0) {
                    color = "red";
                }
                else {
                    color = "black";
                }

                let payout;
                let won = false;
                if (number === pick) { // Straight up
                    won = true;
                    payout = bet * 36;
                }
                else if (pick === color) {
                    won = true;
                    payout = bet;
                }
                else if (number % 2 === 0 && pick === "even") {
                    won = true;
                    payout = bet;
                }
                else if (number % 2 !== 0 && pick === "odd") {
                    won = true;
                    payout = bet;
                }
                else if (number >= 1 && number <= 18 && pick === "low") {
                    won = true;
                    payout = bet;
                }
                else if (number >= 19 && number <= 36 && pick === "high") {
                    won = true;
                    payout = bet;
                }


                if (won) {
                    bal_data[server.id][author.id] += payout;
                    message.setTitle("You won!");
                    message.setDescription(`New balance: $${bal_data[server.id][author.id]}`);
                    interaction.reply({ embeds: [message] });
                }
                else {
                    bal_data[server.id][author.id] -= bet;
                    message.setTitle("You lost!");
                    message.setDescription(`New balance: $${bal_data[server.id][author.id]}`);
                    interaction.reply({ embeds: [message] });
                }

                bal_data = JSON.stringify(bal_data, null, 2);
                fs.writeFileSync('./data/balance_data.json', bal_data);
            });
        }
}