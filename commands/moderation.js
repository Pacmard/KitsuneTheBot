const axios = require('axios');
const Discord = require('discord.js');
var mysql = require('mysql');
const { prefix, token, mysql_user, mysql_passwd, mysql_db } = require('../config.json');

var connection = mysql.createConnection({
    host: 'localhost',
    user: mysql_user,
    password: mysql_passwd,
    database: mysql_db
})
connection.connect(function (err) {
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

            bannedUser.ban({ reason: banReason })

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
    tempmute: async function (msg) {
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
            let dateNow = Date.now() / 1000 | 0;
            connection.query("SELECT * FROM `mute` WHERE `userid` = ? AND `server_id` = ? AND `unmute_time` >= ? AND `is_unmuted` = ?", [mention.id, serverId, dateNow, 0], async function (err, isMuted, f) {
                if (isMuted.length == 0) {

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
                    if (Number.isInteger(muteTime) && muteTime <= 48) {

                        let unmute_time = 3600 * muteTime
                        let unmute_timestamp = dateNow + unmute_time
                        let roles_before = mutedUser.roles.member._roles;
                        let roles_JSON = JSON.stringify(roles_before);
                        connection.query("INSERT INTO `mute` (`userid`, `roles`, `server_id`, `unmute_time`, `reason`, `is_unmuted`) VALUES (?, ?, ?, ?, ?, ?);", [mention.id, roles_JSON, serverId, unmute_timestamp, muteReason, 0], async function (error, result, fields) {

                            let role = msg.guild.roles.cache.find(r => r.name === "Muted_Kitsune");
                            await mutedUser.roles.remove(roles_before).catch(console.error);
                            mutedUser.roles.add(role).catch(console.error);

                            const image = `https://i.imgur.com/0IxjsfM.gif`
                            let title = `Get muted, ${mention.username}#${mention.discriminator}!`
                            let subtitle = `${msg.author.username} mutes ${mention.username}`
                            let embedCreation = await embedGenerator(title, image, subtitle)
                            msg.channel.send(embedCreation);

                            let user_id = mention.id;
                            timeout(msg, mutedUser, role, unmute_time, roles_before, user_id, serverId)

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
    unmute: async function (msg) {
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
            let dateNow = Date.now() / 1000 | 0;
            connection.query("SELECT * FROM `mute` WHERE `userid` = ? AND `server_id` = ? AND `unmute_time` >= ? AND `is_unmuted` = ?", [mention.id, serverId, dateNow, 0], async function (err, isMuted, f) {
                if (isMuted.length == 1) {
                    let mutedUser = msg.guild.members.resolve(mention.id);
                    await connection.query("UPDATE `mute` SET `unmute_time` = ?, `is_unmuted` = ? WHERE `mute`.`id` = ?;", [dateNow.toString(), 1, isMuted[0].id], async function (err, res_upd, f) {
                    })

                    let role_remove = msg.guild.roles.cache.find(r => r.name === "Muted_Kitsune");
                    let roles_old = JSON.parse(isMuted[0].roles)

                    if (roles_old.length >= 1) {
                        await mutedUser.roles.add(roles_old).catch(console.error);
                        mutedUser.roles.remove(role_remove.id).catch(console.error);

                    } else {
                        await mutedUser.roles.remove(role_remove.id).catch(console.error);
                    }


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
    },
    checkuser: async function (msg) {
        const mention = msg.mentions.users.first();
        if (!mention) {
            return msg.reply("Please, specify the user!");
        }

        let perms = msg.channel.permissionsFor(msg.member);
        if (perms.has('MANAGE_MESSAGES') || perms.has('KICK_MEMBERS') || perms.has('BAN_MEMBERS') || perms.has('MANAGE_ROLES')) {
            let dateNow = new Date();
            let time = `${(dateNow.getHours()).toString().padStart(2, '0')}:${(dateNow.getMinutes()).toString().padStart(2, '0')}:${(dateNow.getSeconds()).toString().padStart(2, '0')}`
            let subtitle = `${mention.username}#${mention.discriminator} info.`
            let avatar = mention.avatarURL()
            let footer = `User ID: ${msg.author.id} • Today at: ${time}`
            connection.query("SELECT * FROM `user_info` WHERE `userid` = ? AND `serverid` = ?", [mention.id, msg.guild.id], async function (err, userInfo, f) {


            let embedCreation = await userInfoGenerator(subtitle, msg, mention, userInfo, avatar, footer)
            msg.channel.send(embedCreation);

            })
        }
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

function userInfoGenerator(subtitle, msg, mention, userInfo, avatar, footer) {

    let userRoles = JSON.parse(userInfo[0].roles)
    let dateJoined = new Date(userInfo[0].joinTimestamp * 1000)
    let timeJoined = `Date (DD/MM/YY): ${(dateJoined.getDate()).toString().padStart(2, '0')}/${(dateJoined.getMonth()).toString().padStart(2, '0')}/${(dateJoined.getFullYear()).toString()} Time: ${(dateJoined.getHours()).toString().padStart(2, '0')}:${(dateJoined.getMinutes()).toString().padStart(2, '0')}:${(dateJoined.getSeconds()).toString().padStart(2, '0')} UTC`
    const embed = new Discord.MessageEmbed()
        .setColor("#ff9d5a")
        .setTitle('Avatar')
	    .setURL(avatar)
        .addFields(
            { name: 'Roles', value: `${userRoles.map(item => `<@&${item}>`).join(', ')}`, inline: true },
            { name: 'Created at', value: `${mention.createdAt}`, inline: true },
            { name: 'Joined at', value: `${timeJoined}`, inline: true },
        )
        .setFooter(footer)
        .setAuthor(subtitle, avatar);
    return embed;

}

function timeout(msg, mutedUser, role, unmute_time, roles_before, user_id, serverId) {
    let time_timeout = unmute_time * 1000
    setTimeout(() => {
        connection.query("SELECT * FROM `mute` WHERE `userid` = ? AND `server_id` = ? AND `is_unmuted` = ?", [user_id, serverId, unmute_time, 0], async function (err, isMuted, f) {
            if (isMuted.length == 1) {
                await connection.query("UPDATE `mute` SET `is_unmuted` = ? WHERE `mute`.`id` = ?;", [1, isMuted[0].id], async function (err, res_upd, f) {
                    await mutedUser.roles.add(roles_before).catch(console.error);
                    mutedUser.roles.remove(role).catch(console.error);
                })
            }
        })
    }, time_timeout);
}

module.exports.commands = commands;