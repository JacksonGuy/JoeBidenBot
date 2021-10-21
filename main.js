const { Client, Intents } = require('discord.js');
const { token } = require("./config.json");
const fs = require('fs');
const tools = require('./tools');

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
});

client.login(token);
