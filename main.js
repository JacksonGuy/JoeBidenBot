const { Client, Intents } = require('discord.js');
const { token } = require("./config.json");
const gamePlayers  = require("./gamePlayers.json")
const fs = require('fs');
const playerTools = require('./playerTools');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('im back losers', { type: 'PLAYING' });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    switch(interaction.commandName) {
        case 'test':
            await interaction.reply("oh boy hopefully everything works");
            console.log(interaction.user.id in gamePlayers.players); // TODO WHY WONT THIS WORK
            break;

        case 'erase':
            interaction.channel.messages.fetch({limit: 100 }).then(messages => {
                messages.forEach(message => message.delete());
            });
            await interaction.reply(`Deleting ${interaction.options.getInteger('amount')} messages`);
            break;
        
        case 'spam':
            await interaction.reply(`${interaction.options.getString('message')}`);
            for (let i = 0; i < interaction.options.getInteger('amount')-1; i++) {
                await interaction.channel.send(`${interaction.options.getString('message')}`);
            }
            break;

        case 'stalin':
            target = interaction.options.getString('user');
            target = target.slice(3, target.length-1);

            interaction.channel.messages.fetch({limit: 100 }).then(messages => {
                messages.forEach(message => {
                    if (message.author.id === target) {
                        message.delete();
                    }
                });
            });
            await interaction.reply(`Deleting messages from ${interaction.options.getString('user')}`);
            break;

        case 'new':
            user = interaction.user.id;

            if (gamePlayers.players.hasOwnProperty(user)) {
                // Delete current clientID.json and create new one
                fs.unlink(`${user}.json`, (err) => {
                    if (err) throw err;
                });
                playerTools.createPlayer(user);
                await interaction.reply(`New Character Created for ${user}`);
            }
            else {
                // Create new entry in gamePlayers.json
                fs.readFile('gamePlayers.json','utf-8', (err, data) => {
                    if (err) console.log(err);
                    else {
                        obj = JSON.parse(data);
                        obj.players.push(user);
                        json = JSON.stringify(obj);
                        fs.writeFile('gamePlayers.json', json, (err) => {
                            if (err) throw err;
                        });
                    }
                });

                // create new JSON file for client --> (clientID.json)
                playerTools.createPlayer(user);

                await interaction.reply('New Character Created');
            }
            break;
    }
});

client.login(token);