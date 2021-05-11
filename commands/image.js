const axios = require('axios');
const Discord = require('discord.js');
var commands = {
    cuddle: async function (msg) {
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
    pat: async function (msg) {
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
    kiss: async function (msg) {
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
    slap: async function (msg) {
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
    hug: async function (msg) {
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
    tickle: async function (msg) {
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
    },
    lick: async function (msg) {
        const mention = msg.mentions.users.first();

        if (!mention) {
            return msg.reply("you can't lick air, at least I think so.");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("How is it feel to lick yourself?");
        }

        const response = await axios.request({
            method: "GET",
            url: "http://localhost:3000/lick",
        });

        const image = response.data.link;
        let title = `Get prepared for a lick, ${mention.username}`
        let subtitle = `${msg.author.username} licks ${mention.username}`
        let embedCreation = await embedGenerator(title, image, subtitle)
        return msg.channel.send(embedCreation);
    },
    bite: async function (msg) {
        const mention = msg.mentions.users.first();

        if (!mention) {
            return msg.reply("How does air taste? Tell me!");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("Why would you bite yourself?");
        }

        const response = await axios.request({
            method: "GET",
            url: "http://localhost:3000/bite",
        });

        const image = response.data.link;
        let title = `Just a little bite, ${mention.username}, it shouldn't hurt!`
        let subtitle = `${msg.author.username} bites ${mention.username}`
        let embedCreation = await embedGenerator(title, image, subtitle)
        return msg.channel.send(embedCreation);
    },
    fluff: async function (msg) {
        const mention = msg.mentions.users.first();

        if (!mention) {
            return msg.reply("Is air really that fluffy?");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("How does it feel to fluff youself?");
        }

        const response = await axios.request({
            method: "GET",
            url: "http://localhost:3000/fluff",
        });

        const image = response.data.link;
        let title = `Sorry, you will be fluffed ${mention.username}!`
        let subtitle = `${msg.author.username} fluffs ${mention.username} tail!`
        let embedCreation = await embedGenerator(title, image, subtitle)
        return msg.channel.send(embedCreation);
    },
    senko: async function (msg) {

        const response = await axios.request({
            method: "GET",
            url: "http://localhost:3000/senko",
        });

        const attachment = new Discord.MessageAttachment(`${response.data.path}`, `${response.data.image}`);
        const image = `attachment://${response.data.image}`
        let title = `Here, have some cute loli fox!`
        let subtitle = `${msg.author.username} asks for Senko image!`
        let footer = `Art source: ${response.data.source}\nKitsuneTheBot v0.0.1`
        let embedCreation = await senkoGenerator(title, image, subtitle, attachment, footer)
        return msg.channel.send(embedCreation);
    },
    bonk: async function (msg) {
        const mention = msg.mentions.users.first();

        if (!mention) {
            return msg.reply("You can't bonk air, dummy.");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("Why would you bonk yourself?");
        }

        const response = await axios.request({
            method: "GET",
            url: "http://localhost:3000/bonk",
        });

        const attachment = new Discord.MessageAttachment(`${response.data.path}`, `${response.data.image}`);
        const image = `attachment://${response.data.image}`
        let title = `Hey! ${mention.username}! You'll get bonked!`
        let subtitle = `${msg.author.username} bonks ${mention.username}!`
        let embedCreation = await bonkGenerator(title, image, subtitle, attachment)
        return msg.channel.send(embedCreation);
    },
    waifu: async function (msg) {

        const response = await axios.request({
            method: "GET",
            url: "http://localhost:3000/waifu",
        });

        const attachment = new Discord.MessageAttachment(`${response.data.path}`, `${response.data.image}`);
        const image = `attachment://${response.data.image}`
        let title = `Here, have a pic of cute anime girl!`
        let subtitle = `${msg.author.username} asks for some good art!`
        let footer = `Art source: ${response.data.source}\nKitsuneTheBot v0.0.1`
        let embedCreation = await senkoGenerator(title, image, subtitle, attachment, footer)
        return msg.channel.send(embedCreation);
    },
}

function embedGenerator(title, image, subtitle) {
    const embed = new Discord.MessageEmbed()
        .setColor("#ff9d5a")
        .setTitle(title)
        .setImage(image)
        .setFooter(`KitsuneTheBot v0.0.1`)
        .setAuthor(subtitle);
    return embed;
}

function senkoGenerator(title, image, subtitle, attachment, footer) {
    const embed = new Discord.MessageEmbed()
        .setColor("#ff9d5a")
        .setTitle(title)
        .setImage(image)
        .setFooter(footer)
        .attachFiles(attachment)
        .setAuthor(subtitle)
    return embed;
}

function bonkGenerator(title, image, subtitle, attachment) {
    const embed = new Discord.MessageEmbed()
        .setColor("#ff9d5a")
        .setTitle(title)
        .setImage(image)
        .setFooter(`KitsuneTheBot v0.0.1`)
        .attachFiles(attachment)
        .setAuthor(subtitle)
    return embed;
}

module.exports.commands = commands;