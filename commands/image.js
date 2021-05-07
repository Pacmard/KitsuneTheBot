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

        const imageArr = [
            `https://media1.tenor.com/images/5f73f2a7b302a3800b3613095f8a5c40/tenor.gif?itemid=10005495`,
            `https://media1.tenor.com/images/5c5828e51733c8ffe1c368f1395a03d0/tenor.gif?itemid=14231351`,
            `https://media1.tenor.com/images/dbc120cf518319ffe2aedf635ad2df93/tenor.gif?itemid=16600144`,
            `https://media1.tenor.com/images/1925e468ff1ac9efc2100a3d092c54ff/tenor.gif?itemid=4718221`,
            `https://media1.tenor.com/images/3cbd13d5bd4c0a541d85d1d427c49abd/tenor.gif?itemid=16465188`,
            `https://media1.tenor.com/images/7132e6f39a0e4ada4e33d71056bcde67/tenor.gif?itemid=12858455`,
            `https://media1.tenor.com/images/17dab70fbd9d82b0140407b304517d5f/tenor.gif?itemid=16342211`,
            `https://media1.tenor.com/images/470177a6970bb705188d17ab939b4ba0/tenor.gif?itemid=16926055`,
            `https://media1.tenor.com/images/d00e0a35719ff4f47425583f0158fecc/tenor.gif?itemid=17503762`
        ]

        let picNumber = Math.floor(Math.random() * 9)
        const image = imageArr[picNumber]
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

        const imageArr = [
            `https://media1.tenor.com/images/128c1cfb7f4e6ea4a4dce9b487648143/tenor.gif?itemid=12051598`,
            `https://media1.tenor.com/images/1169d1ab96669e13062c1b23ce5b9b01/tenor.gif?itemid=9035033`,
            `https://media1.tenor.com/images/f308e2fe3f1b3a41754727f8629e5b56/tenor.gif?itemid=12390216`,
            `https://media1.tenor.com/images/418a2765b0bf54eb57bab3fde5d83a05/tenor.gif?itemid=12151511`,
            `https://media1.tenor.com/images/785facc91db815ae613926cddb899ed4/tenor.gif?itemid=17761094`,
            `https://media1.tenor.com/images/432a41a6beb3c05953c769686e8c4ce9/tenor.gif?itemid=4704665`,
            `https://media1.tenor.com/images/6b42070f19e228d7a4ed76d4b35672cd/tenor.gif?itemid=9051585`,
            `https://media1.tenor.com/images/a74770936aa6f1a766f9879b8bf1ec6b/tenor.gif?itemid=4676912`,
            `https://media1.tenor.com/images/ebc0cf14de0e77473a3fc00e60a2a9d3/tenor.gif?itemid=11535890`,
            `https://media1.tenor.com/images/7b9575ccf2a5b33f97d0eaa053e1892c/tenor.gif?itemid=12180198`,
            `https://media1.tenor.com/images/34a08d324868d33358e0a465040f210e/tenor.gif?itemid=11961581`,
            `https://media1.tenor.com/images/fa7c4b34d47d795b2b764324e6ad53fa/tenor.gif?itemid=17444486`
        ]

        let picNumber = Math.floor(Math.random() * 12)
        const image = imageArr[picNumber]
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

        const imageArr = [
            `https://media1.tenor.com/images/641c82c25278968b8c7019765642117d/tenor.gif?itemid=20999243`,
            `https://media1.tenor.com/images/7a024f4f3391f86be7f2d09bfbebbf35/tenor.gif?itemid=20999240`,
            `https://media1.tenor.com/images/010a7933835d915ca383d741c778ac88/tenor.gif?itemid=20999237`,
            `https://media1.tenor.com/images/1dc6c1467fdd2c2f17c58e36f62b61d9/tenor.gif?itemid=20999234`,
            `https://media1.tenor.com/images/003a88ad8c5d43b34f8490c28bf10dae/tenor.gif?itemid=20999232`,
            `https://media1.tenor.com/images/e2bb75681021339a2ffc96ad47da2c9c/tenor.gif?itemid=20999227`,
            `https://media1.tenor.com/images/c7205d518b68b7ef49fd1e8d2d4fe505/tenor.gif?itemid=20999230`,
            `https://media.tenor.com/images/a93c9e811afc06a2c7d79cbc3d68f09b/tenor.gif`
        ]

        let picNumber = Math.floor(Math.random() * 8)
        const image = imageArr[picNumber]
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
        let embedCreation = await senkoGenerator(title, image, subtitle, attachment)
        return msg.channel.send(embedCreation);
    }
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

function senkoGenerator(title, image, subtitle, attachment) {
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