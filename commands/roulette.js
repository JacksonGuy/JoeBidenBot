const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const tools = require('../tools');

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
                if (!(isNaN(parseInt(pick)))){
                    if (!(pick >= 0 && pick <= 36)) {
                        message.setTitle("Error");
                        message.setDescription("Invalid choice: " + pick);
                        interaction.reply({ embeds: [message] });
                        return;
                    }
                }
                else {
                    message.setTitle("Error");
                    message.setDescription("Invalid choice: " + pick);
                    interaction.reply({ embeds: [message] });
                    return;
                }
            }

            await tools.update_bal(server.id, author.id).then(result => {
                if (!result) {
                    message.setTitle("Error");
                    message.setDescription("You need to do `/start` first");
                    interaction.reply({ embeds: [message] });
                    return;
                }

                fs.readFile('./data/' + server.id + '.json', (err, data) => {
                    if (err) throw err;
                    let player_data = JSON.parse(data);

                    if (!(author.id in player_data)) {
                        message.setTitle("Error");
                        message.setDescription("You need to do `/start` first");
                        interaction.reply({ embeds: [message] });
                        return;
                    }

                    if (bet === "max") {
                        bet = player_data[author.id]['bal'];
                    }
                    else {
                        if (!(isNaN(parseInt(bet)))){
                            bet = parseInt(bet);
                            if (bet > player_data[author.id]['bal']) {
                                message.setTitle("Error");
                                message.setDescription("You don't have enough money");
                                interaction.reply({ embeds: [message] });
                                return;
                            }
                        }
                        else {
                            message.setTitle("Error");
                            message.setDescription("Invalid bet amount: " + bet);
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
                        player_data[author.id]['bal'] += payout;
                        message.setTitle("You won!");
                        message.setDescription(`New balance: $${player_data[author.id]['bal']}`);
                        interaction.reply({ embeds: [message] });
                    }
                    else {
                        player_data[author.id]['bal'] -= bet;
                        message.setTitle("You lost!");
                        message.setDescription(`New balance: $${player_data[author.id]['bal']}`);
                        interaction.reply({ embeds: [message] });
                    }
    
                    player_data = JSON.stringify(player_data, null, 2);
                    fs.writeFileSync('./data/' + server.id + '.json', player_data);
                });
            });
        }
}