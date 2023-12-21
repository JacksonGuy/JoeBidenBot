const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const { clientId, token, guildId} = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			// For development
			//Routes.applicationGuildCommands(clientId, guildId),
			
			// For deploying final versions 
			Routes.applicationCommands(clientId),
            
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
