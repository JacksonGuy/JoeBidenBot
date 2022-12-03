const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const fs = require('fs');
const tools = require('../tools');

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

            var message = new EmbedBuilder()
                .setColor(0x00FF00)
                .setAuthor({
                    name: author.tag,
                    iconURL: author.avatarURL()
                });

            if (side != "heads" && side != "tails") {
                message.setTitle("Error");
                message.setDescription("Invalid side");
                interaction.reply({ embeds: [message] });
                return;
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
                    player_data = JSON.parse(data);

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
                        if (!(isNaN(parseInt(bet)))) {
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

                    message.setTitle("Coin flip");
                    let roll = Math.floor(Math.random() * 2);
                    if (roll === 0) { // Heads
                        if (side === "heads") {
                            player_data[author.id]['bal'] += bet;
                            player_data[author.id]['stats']['coinflip']['won'] += 1;
                            message.setDescription("You won!");
                            message.addFields(
                                { name: "New balance:", value: `$${player_data[author.id]['bal']}`}
                            );
                        }
                        else {
                            player_data[author.id]['bal'] -= bet;
                            message.setDescription("You lost!");
                            message.addFields(
                                { name: "New balance:", value: `$${player_data[author.id]['bal']}`}
                            );
                        }
                    }
                    else { // Tails
                        if (side === "tails") {
                            player_data[author.id]['bal'] += bet;
                            player_data[author.id]['stats']['coinflip']['won'] += 1;
                            message.setDescription("You won!");
                            message.addFields(
                                { name: "New balance:", value: `$${player_data[author.id]['bal']}`}
                            );
                        }
                        else {
                            player_data[author.id]['bal'] -= bet;
                            message.setDescription("You lost!");
                            message.addFields(
                                { name: "New balance:", value: `$${player_data[author.id]['bal']}`}
                            );
                        }
                    }

                    player_data[author.id]['stats']['coinflip']['total'] += 1;

                    player_data = JSON.stringify(player_data, null, 2);
                    fs.writeFileSync('./data/' + server.id + '.json', player_data);
                    interaction.reply({ embeds: [message] });
                });
            });
        }
}