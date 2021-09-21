const { Client, Intents } = require('discord.js');
const { token } = require("./config.json");
const fs = require('fs');
const playerTools = require('./playerTools');
const enemy = require('./enemy');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity('im back losers', { type: 'PLAYING' });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    switch(interaction.commandName) {
        case 'test':
            await interaction.reply("oh boy hopefully everything works");
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
            playerTools.createPlayer(interaction.user.id);
            await interaction.reply('New Characher Created');
            break;

        case 'move':
            fs.readFile(`./players/${interaction.user.id}.json`, (err, data) => {
                if (err) throw err;
                player = JSON.parse(data);
            
                switch (interaction.options.getString('direction')) {
                    case 'north':
                        player.position.location = "wilderness"
                        player.position.y += 1;
                        break;
                    case 'south':
                        player.position.location = "wilderness"
                        player.position.y -= 1;
                        break;
                    case 'east':
                        player.position.location = "wilderness"
                        player.position.x += 1;
                        break;
                    case 'west':
                        player.position.location = "wilderness"
                        player.position.x -= 1;
                        break;
                }
                console.log(player);
                player = JSON.stringify(player);
                fs.writeFile(`./players/${interaction.user.id}.json`, player, (err) => {
                    if (err) throw err;
                });
                interaction.reply(`Move Successful`);
            });
            break; 
    }
});

client.login(token);