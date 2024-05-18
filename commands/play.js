const { SlashCommandBuilder} = require('discord.js');
const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource,
    AudioPlayerStatus, 
} = require("@discordjs/voice");
const fs = require('fs');
const play = require("play-dl");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play youtube videos")
        .addStringOption(option => 
            option
                .setName("url")
                .setDescription("Youtube video link")
                .setRequired(true)),
        async execute(interaction) {
            let url = interaction.options.getString("url");
            
            const stream = await play.stream(url, {
                discordPlayerCompatibility: true,
            });

            let userVoiceChannel = interaction.member.voice.channel;
            const connection = joinVoiceChannel({
                channelId: userVoiceChannel.id,
                guildId: userVoiceChannel.guild.id,
                adapterCreator: userVoiceChannel.guild.voiceAdapterCreator
            });
            
            // Bot is not connected to the channel
            if (!connection) {
                interaction.reply("Error: Can't join the channel");
                return;
            }

            const audioPlayer = createAudioPlayer();
            connection.subscribe(audioPlayer);

            audioPlayer.play(createAudioResource(stream.stream, {inputType: stream.type}));
            
            interaction.reply(`Playing: ${url}`);

            audioPlayer.on('error', error => {
                console.log(error);
            });

            audioPlayer.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            });
        }
}