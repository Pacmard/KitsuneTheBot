const axios = require('axios');
const Discord = require('discord.js');
var commands = {
    ban: async function (msg) {
        const mention = msg.mentions.users.first();
        if (!mention) {
            return msg.reply("Please, specify the user!");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("You can't ban yourself!");
        }

        if (msg.member.guild.me.hasPermission(['BAN_MEMBERS']) || msg.member.guild.me.hasPermission(['ADMINISTRATOR'])) {

            removingCmdsVars = msg.content.replace(`k!ban`, ``).replace(/<@!?\d+>/, ``)
            params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
            paramsSplit = params.split(' ')
            let banReason;
            let bannedUser = msg.guild.members.resolve(mention.id)

            if (params.length == 0) {
                banReason = 'Not provided'
            } else {
                banReason = params[0]
            }

            bannedUser.ban({reason: banReason})

            const image = `https://media1.tenor.com/images/2dfc019556073683716852b293959706/tenor.gif?itemid=17040749`
            let title = `Get banned, ${mention.username}#${mention.discriminator}!`
            let subtitle = `${msg.author.username} bans ${mention.username}`
            let embedCreation = await embedGenerator(title, image, subtitle)
            return msg.channel.send(embedCreation);
        } else {
            msg.reply(`You don't have permissions to ban people!`)
        }
    },
    kick: async function (msg) {
        const mention = msg.mentions.users.first();
        if (!mention) {
            return msg.reply("Please, specify the user!");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("You can't ban yourself!");
        }

        if (msg.member.guild.me.hasPermission(['KICK_MEMBERS']) || msg.member.guild.me.hasPermission(['ADMINISTRATOR'])) {
            let kickedUser = msg.guild.members.resolve(mention.id)
            kickedUser.kick()

            const image = `https://media1.tenor.com/images/1071791f88205a82dfc4448f08a6b25c/tenor.gif?itemid=17562086`
            let title = `Get kicked, ${mention.username}#${mention.discriminator}!`
            let subtitle = `${msg.author.username} kicks ${mention.username}`
            let embedCreation = await embedGenerator(title, image, subtitle)
            return msg.channel.send(embedCreation);
        } else {
            msg.reply(`You don't have permissions to ban people!`)
        }
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