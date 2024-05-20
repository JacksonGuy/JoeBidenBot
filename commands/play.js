const { SlashCommandBuilder} = require('discord.js');
const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource,
    AudioPlayerStatus, 
} = require("@discordjs/voice");
const play = require("play-dl");

// Music Global Variables
var queue = [];
var isPlaying = false;
var connection;
const audioPlayer = createAudioPlayer();

// Detect when song ends
// Play another song or disconnect
audioPlayer.on(AudioPlayerStatus.Idle, () => {
    let next = get_queue();
    if (next == -1) {
        isPlaying = false;
        connection.destroy();
        return;
    }
    play_song(next);
});

// Error Checking
audioPlayer.on('error', error => {
    console.log(error);
});

function get_queue() {
    if (queue.length > 0) {
        return queue.shift();
    } else {
        return -1;
    }
}

async function play_song(song) {
    const stream = await play.stream(song, {
        discordPlayerCompatibility: true,
    });

    audioPlayer.play(createAudioResource(stream.stream, {inputType: stream.type}));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play youtube videos.")
        .addStringOption(option => 
            option
                .setName("url")
                .setDescription("Youtube video link, or type \"skip\" to skip the currently playing song.")
                .setRequired(true)),
        async execute(interaction) {
            let url = interaction.options.getString("url");

            if (url == "skip") {
                audioPlayer.stop();
                interaction.reply("Skipped Song");
                return;
            }

            // Connect to voice channel
            let userVoiceChannel = interaction.member.voice.channel;
            connection = joinVoiceChannel({
                channelId: userVoiceChannel.id,
                guildId: userVoiceChannel.guild.id,
                adapterCreator: userVoiceChannel.guild.voiceAdapterCreator
            });
            
            // Bot can't connect to the channel
            if (!connection) {
                interaction.reply("Error: Can't join the channel");
                return;
            }

            connection.subscribe(audioPlayer);
            
            // Play or add to queue
            if (isPlaying) {
                interaction.reply(`Added to queue: ${url}`);
                queue.push(url);
            } else {
                isPlaying = true;
                interaction.reply(`Now Playing: ${url}`);
                play_song(url);
            }
        }
}