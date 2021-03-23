const axios = require('axios');
const Discord = require('discord.js');
var commands = {
    cuddle: async function (msg){
        const mention = msg.mentions.users.first();
        if (!mention) {
            return msg.reply("tell me, how does it feel to cuddle air?");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("just asking for a friend, how can you cuddle yourself? ^_^");
        }

        const response = await axios.request({
            method: "GET",
            url: "https://rra.ram.moe/i/r?type=cuddle",
        });

        const image = `https://rra.ram.moe${response.data.path}`
        let title = `Don't be sad, I'm here to cuddle you, ${mention.username}`
        let subtitle = `${msg.author.username} cuddles with ${mention.username}`
        let embedCreation = await embedGenerator(title, image, subtitle)
        return msg.channel.send(embedCreation);
    },
    pat: async function (msg){
        const mention = msg.mentions.users.first();

        if (!mention) {
            return msg.reply("you can't pat air, silly.");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("how do you pat yourself? ^_^");
        }

        const response = await axios.request({
            method: "GET",
            url: "https://rra.ram.moe/i/r?type=pat",
        });

        const image = `https://rra.ram.moe${response.data.path}`
        let title = `There there, ${mention.username}`
        let subtitle = `${msg.author.username} pats ${mention.username}`
        let embedCreation = await embedGenerator(title, image, subtitle)
        return msg.channel.send(embedCreation);
    },
    kiss: async function (msg){
        const mention = msg.mentions.users.first();

        if (!mention) {
            return msg.reply("kissing nothing huh? How is it? owo");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("I believe it is not possible to kiss yourself, or is it? uwu");
        }

        const response = await axios.request({
            method: "GET",
            url: "https://rra.ram.moe/i/r?type=kiss",
        });

        const image = `https://rra.ram.moe${response.data.path}`
        let title = `Just a kiss, don't be embarrassed, ${mention.username}`
        let subtitle = `${msg.author.username} gave a kiss to ${mention.username}`
        let embedCreation = await embedGenerator(title, image, subtitle)
        return msg.channel.send(embedCreation);
    },
    slap: async function (msg){
        const mention = msg.mentions.users.first();

        if (!mention) {
            return msg.reply("why would you slap air? What did it do to you?");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("don't slap yourself, it's fine.");
        }

        const response = await axios.request({
            method: "GET",
            url: "https://rra.ram.moe/i/r?type=slap",
        });

        const image = `https://rra.ram.moe${response.data.path}`
        let title = `How dare you, ${mention.username}`
        let subtitle = `${msg.author.username} slapped ${mention.username}`
        let embedCreation = await embedGenerator(title, image, subtitle)
        return msg.channel.send(embedCreation);
    },
    hug: async function (msg){
        const mention = msg.mentions.users.first();

        if (!mention) {
            return msg.reply("everyone wants to hug someone, but air? :thinking:");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("don't hug yourself, ask someone for a hug instead! owo");
        }

        const response = await axios.request({
            method: "GET",
            url: "https://rra.ram.moe/i/r?type=hug",
        });

        const image = `https://rra.ram.moe${response.data.path}`
        let title = `I'm here to huggle you, ${mention.username}`
        let subtitle = `${msg.author.username} hugs ${mention.username}`
        let embedCreation = await embedGenerator(title, image, subtitle)
        return msg.channel.send(embedCreation);
    },
    tickle: async function (msg){
        const mention = msg.mentions.users.first();

        if (!mention) {
            return msg.reply("you can't tickle air, at least I think so.");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("it's not the same as if someone else were to tickle ya.");
        }

        const response = await axios.request({
            method: "GET",
            url: "https://rra.ram.moe/i/r?type=tickle",
        });

        const image = `https://rra.ram.moe${response.data.path}`
        let title = `I'm gonna tickle you, ${mention.username}`
        let subtitle = `${msg.author.username} tickles ${mention.username}`
        let embedCreation = await embedGenerator(title, image, subtitle)
        return msg.channel.send(embedCreation);
    }
}

function embedGenerator(title, image, subtitle){
    const embed = new Discord.MessageEmbed()
        .setColor("#ff9d5a")
        .setTitle(title)
        .setImage(image)
        .setFooter(`Kitsune v0.0.1`)
        .setAuthor(subtitle);
    return embed;
}
module.exports.commands = commands;