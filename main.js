const { Client, Intents } = require('discord.js');
const { token } = require("./config.json");
const fs = require('fs');

let leagueServers = require("./leagueServers.json");

const botIntents = new Intents();
botIntents.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES, 
    Intents.FLAGS.GUILD_MEMBERS);

const client = new Client({ intents: botIntents });

const prefix = "$";

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity('im back losers', { type: 'PLAYING' });
});

async function checkLeague() {
    for (server in leagueServers) {
        client.guilds.fetch(server).then(guild => {
            guild.fetch().then(guildData => {
                guildData.members.fetch().then(members => {
                    members.forEach(member => {
                        const game = member.presence;
                        if (game !== null && game.activities.length > 0) {
                            const gamer = game.activities[0].name;
                            if (gamer.toLowerCase() === 'league of legends') {
                                client.channels.fetch(leagueServers[server]).then(channel => {
                                    channel.send(`${member.user} is an idiot league player IMAGINE`);
                                });
                            }
                        }
                    });
                });
            });
        });
    }
}
setInterval(checkLeague, 300000);

client.on('messageCreate', async interaction => {
    if (interaction.author.bot) return;
    if (!interaction.content.startsWith(prefix)) return;

    const commandBody = interaction.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'test':
            checkLeague();
            break;

        case 'erase':
            amount = args[0];
            interaction.channel.messages.fetch({limit: amount }).then(messages => {
                messages.forEach(message => message.delete());
            });
            await interaction.channel.send(`Deleting ${amount} messages`);
            break;
        
        case 'spam': // DOES NOT WORK PLS FIXERINO
            for (let i = 0; i < args[1]; i++) {
                await interaction.channel.send(`${args[0]}`);
            }
            break;

        case 'stalin':
            target = args[0];
            target = target.slice(3, target.length-1);

            interaction.channel.messages.fetch({limit: 100 }).then(messages => {
                messages.forEach(message => {
                    if (message.author.id === target) {
                        message.delete();
                    }
                });
            });
            await interaction.channel.send(`Deleting messages from ${args[0]}`);
            break;

        case 'leaguebad':
            if (args[0].toLowerCase() === 'on') {
                leagueServers[interaction.guild.id] = interaction.channelId;
                fs.writeFile('./leagueServers.json', JSON.stringify(leagueServers), (err) => {
                    if (err) return console.log(err);
                    console.log("Wrote to LeagueServers.json");
                });
            }
            else if (args[0].toLowerCase() === 'off') {
                leagueServers[interaction.guild.id] = '';
                fs.writeFile('./leagueServers.json', JSON.stringify(leagueServers), (err) => {
                    if (err) return console.log(err);
                    console.log("Wrote to LeagueServers.json");
                });
            }
            break;
    }
}); 

client.login(token);