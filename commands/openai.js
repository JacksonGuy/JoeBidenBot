const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const { openaiKey}  = require('../config.json');
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const configuration = new Configuration({
    apiKey: openaiKey,
});
const openai = new OpenAIApi(configuration);

async function process_prompt(prompt) {
    let promise = new Promise(resolve => {
        const completion = openai.createCompletion({
            model: "text-davinci-002",
            prompt: prompt,
            temperature: 0.6,
            max_tokens: 1024
        });
        resolve(completion);
    })
    return promise;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("openai")
        .setDescription("Input a prompt and get a response generated using OpenAI's Davinci-002 model")
        .addStringOption(option => 
            option
                .setName("prompt")
                .setDescription("What to tell the AI")
                .setRequired(true)),
        async execute(interaction) {
            let author = interaction.user;
            let prompt = interaction.options.getString("prompt");

            var message = new EmbedBuilder()
                .setColor(0x00FF00)
                .setAuthor({
                    name: author.tag,
                    iconURL: author.avatarURL()
                });

            await interaction.reply("Message received. Processing response (this might take awhile)");

            await process_prompt(prompt).then(response => {
                message.setTitle("OpenAI: " + prompt);
                message.setDescription(response.data.choices[0].text);
                interaction.channel.send({ embeds: [message] });
            });   
        }
}