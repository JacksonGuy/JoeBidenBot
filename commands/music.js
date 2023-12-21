const { SlashCommandBuilder} = require('discord.js');
const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource,
    AudioPlayerStatus, 
} = require("@discordjs/voice");
const fs = require('fs');
const { join } = require('node:path');
const ytdl = require('ytdl-core');

/*
async function download_song(url, path) {
    let promise = new Promise(resolve => {
        const video = ytdl(url, { filter: 'audioandvideo', dlChunkSize: 0});
        video.pipe(fs.createWriteStream(path));
        console.log("Finished Downloading Song");
        resolve(true);
    });
    return promise;
}
*/

module.exports = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Play youtube videos")
        .addStringOption(option => 
            option
                .setName("url")
                .setDescription("Youtube video link")
                .setRequired(true)),
        async execute(interaction) {
            let url = interaction.options.getString("url");
            
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
            interaction.reply(`Playing: ${url}`);
            
            const stream = ytdl(url, { filter: 'audioonly', dlChunkSize: 0 });

            audioPlayer.play(createAudioResource(stream));

            audioPlayer.on('error', error => {
                console.log(error);
            });

            audioPlayer.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            });
        }
}