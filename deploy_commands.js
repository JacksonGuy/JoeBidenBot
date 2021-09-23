const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    new SlashCommandBuilder().setName("test").setDescription("Test command"),

    new SlashCommandBuilder()
        .setName("erase")
        .setDescription("Removes specified amount of messages")
        .addIntegerOption(option => 
            option
                .setName("amount")
                .setDescription("Amount of messages to remove")
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName("spam")
        .setDescription("Spams messages in a channel")
        .addStringOption(option => 
            option
                .setName("message")
                .setDescription("Message to spam")
                .setRequired(true))
        .addIntegerOption(option => 
            option
                .setName("amount")
                .setDescription("Number of messages to send")
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName("stalin")
        .setDescription("Removes messages by a specified user")
        .addStringOption(option =>
            option
                .setName("user")
                .setDescription("User")
                .setRequired(true)),
                
    new SlashCommandBuilder()
        .setName("new")
        .setDescription("Creates a new character"),

    new SlashCommandBuilder()
        .setName("move")
        .setDescription("Moves player in a direction")
        .addStringOption(option =>
            option
                .setName("direction")
                .setDescription("Direction to move in")
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName("inspect")
        .setDescription("Inspects a player character")
        .addStringOption(option => 
            option
                .setName("player")
                .setDescription("Player to inspect")
                .setRequired(true)),
    
    new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("Shows player inventory"),

    new SlashCommandBuilder()
        .setName("location")
        .setDescription("View current location"),

    new SlashCommandBuilder()
        .setName("cast")
        .setDescription("Casts a spell")
        .addStringOption(option => 
            option
                .setName("spell")
                .setDescription("Spell to cast")
                .setRequired(true))
        .addStringOption(option => 
            option
                .setName("target")
                .setDescription("Enemy to cast spell on")
                .setRequired(true)),

].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
            // Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();