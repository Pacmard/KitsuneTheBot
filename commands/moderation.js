const axios = require('axios');
const Discord = require('discord.js');
var mysql = require('mysql');
const { prefix, token, mysql_user, mysql_passwd, mysql_db } = require('../config.json');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : mysql_user,
    password : mysql_passwd,
    database : mysql_db
})
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

var commands = {
    ban: async function (msg) {
        const mention = msg.mentions.users.first();
        if (!mention) {
            return msg.reply("Please, specify the user!");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("You can't ban yourself!");
        }

        let perms = msg.channel.permissionsFor(msg.member);

        if (perms.has('BAN_MEMBERS')) {

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
        let perms = msg.channel.permissionsFor(msg.member);

        if (perms.has('KICK_MEMBERS')) {
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
    },
    tempmute: async function (msg){
        const mention = msg.mentions.users.first();
        if (!mention) {
            return msg.reply("Please, specify the user!");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("You can't mute yourself!");
        }

        let perms = msg.channel.permissionsFor(msg.member);
        if (perms.has('MANAGE_MESSAGES') || perms.has('KICK_MEMBERS') || perms.has('BAN_MEMBERS') || perms.has('MANAGE_ROLES')) {

            let mutedUser = msg.guild.members.resolve(mention.id);
            let serverId = msg.guild.id;
            const date = new Date();
            let dateNow = Date.now()/1000 | 0;
            connection.query("SELECT * FROM `mute` WHERE `userid` = ? AND `server_id` = ? AND `unmute_time` >= ?", [mention.id, serverId, dateNow], async function (err, isMuted, f) {
                if (isMuted.length == 0){

                    removingCmdsVars = msg.content.replace(`k!tempmute`, ``).replace(`<@!${mention.id}>`, ``).replace(`<@${mention.id}>`, ``);
                    params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                    paramsSplit = params.split(' ');

                    let muteReason;

                    if (paramsSplit.length == 1) {
                        muteReason = 'Not provided'
                    } else {
                        muteReason = paramsSplit[1]
                    }

                    let muteTime = parseInt(paramsSplit[0])
                    if (Number.isInteger(muteTime) && muteTime <= 48){

                        let unmute_time = 3600 * muteTime
                        let unmute_timestamp = dateNow + unmute_time

                        connection.query("INSERT INTO `mute` (`userid`, `server_id`, `unmute_time`, `reason`) VALUES (?, ?, ?, ?);", [mention.id, serverId, unmute_timestamp, muteReason], async function (error, result, fields) {

                            let role = msg.guild.roles.cache.find(r => r.name === "Muted_Kitsune");
                            mutedUser.roles.add(role).catch(console.error);

                            const image = `https://i.imgur.com/0IxjsfM.gif`
                            let title = `Get muted, ${mention.username}#${mention.discriminator}!`
                            let subtitle = `${msg.author.username} mutes ${mention.username}`
                            let embedCreation = await embedGenerator(title, image, subtitle)
                            msg.channel.send(embedCreation);
                            timeout(msg, mutedUser, role, unmute_time)

                        })

                    } else if (Number.isInteger(muteTime) == false) {
                        msg.reply('Please indicate the time for mute (in hours!) Exapmle: k!tempmute @KitsuneTheBot 1 Reason')
                    } else msg.channel.send('Mute time cannot be more than 48 hours!')
                }
            })
        } else {
            msg.reply(`You don't have permissions to mute people!`)
        }
    },
    unmute: async function (msg){
        const mention = msg.mentions.users.first();
        if (!mention) {
            return msg.reply("Please, specify the user!");
        }

        if (mention.id === msg.author.id) {
            return msg.reply("You can't mute yourself!");
        }
        let perms = msg.channel.permissionsFor(msg.member);
        if (perms.has('MANAGE_MESSAGES') || perms.has('KICK_MEMBERS') || perms.has('BAN_MEMBERS') || perms.has('MANAGE_ROLES')) {
            let serverId = msg.guild.id;
            const date = new Date();
            let dateNow = Date.now()/1000 | 0;
            connection.query("SELECT * FROM `mute` WHERE `userid` = ? AND `server_id` = ? AND `unmute_time` >= ?", [mention.id, serverId, dateNow], async function (err, isMuted, f) {
                if (isMuted.length == 1){
                    let mutedUser = msg.guild.members.resolve(mention.id);

                   await connection.query("UPDATE `mute` SET `unmute_time` = ? WHERE `mute`.`id` = ?;", [dateNow.toString(), isMuted[0].id], async function (err, isMuted, f) {

                        let role = msg.guild.roles.cache.find(r => r.name === "Muted_Kitsune");
                        mutedUser.roles.remove(role).catch(console.error);
                        // UPDATE `mute` SET `unmute_time` = '1616591021' WHERE `mute`.`id` = 23;
                    })

                    const image = `https://media.tenor.com/images/7f9d13686d8d6b73d669c618ccb0afac/tenor.gif`
                    let title = `Yay, ${mention.username}#${mention.discriminator} got unmuted!`
                    let subtitle = `${msg.author.username} unmutes ${mention.username}`
                    let embedCreation = await embedGenerator(title, image, subtitle)
                    msg.channel.send(embedCreation);
                } else {
                    msg.reply('This user is not muted!')
                }
            })
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

function timeout(msg, mutedUser, role, unmute_time) {
    let time_timeout = unmute_time * 1000
    setTimeout(() => {
        mutedUser.roles.remove(role).catch(console.error);
    }, time_timeout);
}

module.exports.commands = commands;