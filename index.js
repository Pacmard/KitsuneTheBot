const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['GUILD_MEMBER'] });
const axios = require('axios')
const moment = require('moment')
var mysql = require('mysql');
var image = require('./commands/image.js')
var moderation = require('./commands/moderation.js')
var logs = require('./commands/logs.js')
var welcome = require('./commands/welcome.js')
const { prefix, token, mysql_user, mysql_passwd, mysql_db } = require('./config.json');


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


client.on('ready', async () => {
    client.user.setActivity('Use k!help to see all commands!');

    console.log(`Logged in as ${client.user.tag}!`);

    const date = new Date();
    let dateNow = Date.now() / 1000 | 0;
    connection.query("SELECT * FROM `mute` WHERE `unmute_time` >= ? AND `is_unmuted` = ?", [dateNow, 0], async function (err, isAnyoneMuted, f) {
        if (isAnyoneMuted.length != 0) {
            for (i = 0; i < isAnyoneMuted.length; i++) {
                let raw_timeout = isAnyoneMuted[i].unmute_time * 1000
                let time_timeout = raw_timeout - (dateNow * 1000)
                let guildCheck = client.guilds.cache.get(isAnyoneMuted[i].server_id);
                let mutedUser = await guildCheck.members.fetch(isAnyoneMuted[i].userid);
                let role = guildCheck.roles.cache.find(r => r.name === "Muted_Kitsune");
                let roles_old = JSON.parse(isAnyoneMuted[i].roles)
                setTimeout(async () => {
                    connection.query("SELECT * FROM `mute` WHERE `userid` = ? AND `server_id` = ? AND `is_unmuted` = ?", [isAnyoneMuted[i].userid, isAnyoneMuted[i].server_id, isAnyoneMuted[i].unmute_time, 0], async function (err, isMutedNow, f) {
                        if (isMutedNow.length == 1) {
                            await connection.query("UPDATE `mute` SET `is_unmuted` = ? WHERE `mute`.`id` = ?;", [1, isAnyoneMuted[i].id], async function (err, res_upd, f) {
                                if (roles_old.length >= 1) {
                                    await mutedUser.roles.add(roles_old).catch(console.error);
                                    mutedUser.roles.remove(role.id).catch(console.error);
                                } else {
                                    mutedUser.roles.remove(role.id).catch(console.error);
                                }
                            })
                        }
                    })
                }, time_timeout);
            }
        }
    })
});

client.on('message', async msg => {
    if (msg.content.toLowerCase().startsWith('k!help')) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Help")
            .setDescription("Hey there, I'm KitsuneTheBot and I'm here to pamper you!")
            .addFields(
                {
                    name: "Image Commands",
                    value:
                        "**k!pat @mention** - Pat someone, everyone likes pats ^_^\n" +
                        "**k!cuddle @mention** - Cuddle, how cute. uwu\n" +
                        "**k!hug @mention** - Friendly hug from a friend. owo\n" +
                        "**k!kiss @mention** - Just a cute kiss\n" +
                        "**k!slap @mention** - Slap slap, how dare you!\n" +
                        "**k!tickle @mention** - Tickle someone, and they can tickle you too\n" +
                        "**k!lick @mention** - Lick them all!\n" +
                        "**k!bite @mention** - When lick is not enough!\n",
                },
                {
                    name: "Mod commands",
                    value:
                        "**k!ban @mention `reason`** - Ban someone, rules are important!\n" +
                        "**k!kick @mention `reason`** - Kick someone, if you think he needs to get out!\n" +
                        "**k!tempmute @mention `time` `reason`** - Don't let spammers do spam!\n*time in hours, should be less than 48.\n" +
                        "**k!unmute @mention** - If you need to let someone talk again!\n",
                },
                {
                    name: "Logs commands",
                    value:
                        "**k!enablelogs** - Enable message actions logging!\n" +
                        "**k!disablelogs** - Disable message actions logging!\n" +
                        "**k!changelogs** - Change channel for message actions logs!\n\n" +
                        "**k!enableleave** - Enable server leave logging!\n" +
                        "**k!disableleave** - Disable server leave logging!\n" +
                        "**k!changeleave** - Change channel for server leave logs!\n\n" +
                        "**k!enablejoin** - Enable server join logging!\n" +
                        "**k!disablejoin** - Disable server join logging!\n" +
                        "**k!changejoin** - Change channel for server join logs!\n",
                },
                {
                    name: "Other Commands",
                    value:
                        "**k!welcome help** - Guide for setting up welcome message\n" +
                        "**k!help** - Show help\n",
                }
            )
            .setFooter(`KitsuneTheBot v0.0.1`)
            .setColor("#ff9d5a");
        msg.channel.send(embed);
    }

    if (msg.content.toLowerCase().startsWith('k!cuddle')) {
        image.commands['cuddle'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!pat')) {
        image.commands['pat'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!kiss')) {
        image.commands['kiss'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!slap')) {
        image.commands['slap'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!hug')) {
        image.commands['hug'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!tickle')) {
        image.commands['tickle'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!lick')) {
        image.commands['lick'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!bite')) {
        image.commands['bite'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!fluff')) {
        image.commands['fluff'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!ban')) {
        moderation.commands['ban'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!kick')) {
        moderation.commands['kick'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!tempmute')) {
        moderation.commands['tempmute'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!unmute')) {
        moderation.commands['unmute'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!enablelogs')) {
        logs.commands['enablelogs'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!disablelogs')) {
        logs.commands['disablelogs'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!changelogs')) {
        logs.commands['changelogs'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!enableleave')) {
        logs.commands['enableleave'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!disableleave')) {
        logs.commands['disableleave'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!changeleave')) {
        logs.commands['changeleave'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!enablejoin')) {
        logs.commands['enablejoin'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!disablejoin')) {
        logs.commands['disablejoin'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!changejoin')) {
        logs.commands['changejoin'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!checkuser')) {
        moderation.commands['checkuser'](msg)
    }

    if (msg.content.toLowerCase().startsWith('k!welcome')) {
        let perms = msg.channel.permissionsFor(msg.member);
        if (perms.has('ADMINISTRATOR')) {
            let options = ['enable', 'changechannel', 'disable', 'setimage', 'settext', 'help']
            message = msg.content;
            test = message.replace('k!welcome ', '').split(' ');
            setting = test.shift()
            message = test.join(' ').replace(setting, '');
            if (options.includes(setting)) {
                welcome.options[setting](msg)
            } else {
                // msg.reply('Укажите команду для которой надо настроить права, список команд и их триггеры можете получить используя команду !triggers') TODO
            }
        }
    }
});

client.on("guildCreate", async function (guild) {
    let role
    await guild.roles.create({
        data: {
            name: 'Muted_Kitsune',
            color: 'DEFAULT'
        },
        reason: 'Role for k!tempmute command',
    }).then(async function (res) {
        role = await guild.roles.cache.get(res.id);
        role.setPermissions(0);
    })

    let channelsArr = guild.channels.cache.array()
    for (i = 0; i < channelsArr.length; i++) {
        if (channelsArr[i].type == 'text') {
            let channel = guild.channels.cache.get(channelsArr[i].id)
            channel.updateOverwrite(role, { SEND_MESSAGES: false });
        } else if (channelsArr[i].type == 'voice') {
            let channel = guild.channels.cache.get(channelsArr[i].id)
            channel.updateOverwrite(role, { CONNECT: false });
        }
    }


    let guildArr = await guild.members.fetch()


    guildArr.forEach(member => {
        connection.query("SELECT * FROM `user_info` WHERE `userid` = ? AND `serverid` = ?", [member.user.id, member.guild.id], async function (err, userInfo, f) {
            if (userInfo.length == 0) {
                let joinedUnix = member.joinedTimestamp / 1000 | 0;
                let userRoles = JSON.stringify(member._roles)
                connection.query("INSERT INTO `user_info` (`userid`, `serverid`, `joinTimestamp`, `roles`) VALUES (?, ?, ?, ?);", [member.user.id, member.guild.id, joinedUnix, userRoles], async function (error, result, fields) {

                })
            }
        })
    });


});

client.on("messageDelete", function (msg) {
    connection.query("SELECT * FROM `messages_logs` WHERE `serverid` = ?", [msg.guild.id], async function (err, isEnabled, f) {
        if ((isEnabled.length == 1) && (msg.author.id != '823948446758338572') && (msg.author.bot == false)) {
            let channel = client.channels.cache.get(isEnabled[0].logschannel)
            let descriprion;
            let subtitle = `${msg.author.username}#${msg.author.discriminator} deleted message in #${msg.channel.name}`
            let avatar = msg.author.avatarURL()
            let dateNow = new Date()
            let time = `${(dateNow.getHours()).toString().padStart(2, '0')}:${(dateNow.getMinutes()).toString().padStart(2, '0')}:${(dateNow.getSeconds()).toString().padStart(2, '0')}`
            let footer = `User ID:${msg.author.id} • Today at: ${time}`

            if (msg.attachments.array().length >= 1) {
                if (msg.attachments.array().length > 1) {
                    let tempArr = [];
                    for (i = 0; i < msg.attachments.array().length; i++) {
                        tempArr.push(msg.attachments.array()[i].proxyURL)
                    }
                    descriprion = `${msg.content}\n${tempArr.join('\n')}`
                } else {
                    descriprion = `${msg.content}\n${msg.attachments.array()[0].proxyURL}`
                }
            } else {
                descriprion = `${msg.content}`
            }

            let embedCreation = await deletionGenerator(descriprion, subtitle, footer, avatar)
            channel.send(embedCreation);
        }
    })

});


client.on("messageUpdate", function (oldMessage, newMessage) {
    connection.query("SELECT * FROM `messages_logs` WHERE `serverid` = ?", [newMessage.guild.id], async function (err, isEnabled, f) {
        if ((isEnabled.length == 1) && (newMessage.author.id != '823948446758338572') && (newMessage.author.bot == false) && (newMessage.content != oldMessage.content)) {
            let channel = client.channels.cache.get(isEnabled[0].logschannel)
            let descriprion = `Before: ${oldMessage.content}\nAfter: ${newMessage.content}`;
            let subtitle = `${newMessage.author.username}#${newMessage.author.discriminator} edited message in #${newMessage.channel.name}`
            let avatar = newMessage.author.avatarURL()
            let dateNow = new Date()
            let time = `${(dateNow.getHours()).toString().padStart(2, '0')}:${(dateNow.getMinutes()).toString().padStart(2, '0')}:${(dateNow.getSeconds()).toString().padStart(2, '0')}`
            let footer = `User ID:${newMessage.author.id} • Today at: ${time}`
            let embedCreation = await deletionGenerator(descriprion, subtitle, footer, avatar)
            channel.send(embedCreation);
        }
    })
});

client.on("guildMemberRemove", function (member) {
    connection.query("SELECT * FROM `leave_logs` WHERE `serverid` = ?", [member.guild.id], async function (err, isEnabled, f) {
        if ((isEnabled.length == 1)) {
            connection.query("SELECT * FROM `user_info` WHERE `userid` = ? AND `serverid` = ?", [member.user.id, member.guild.id], async function (err, userInfo, f) {
                let channel = client.channels.cache.get(isEnabled[0].logschannel)
                let datejoined = userInfo[0].joinTimestamp;
                let dateNow = new Date();
                let wasOnServer = moment.unix(datejoined).fromNow();
                let userRolesLeft = JSON.parse(userInfo[0].roles)
                let desc = `${member.user} Joined: ${wasOnServer}\nRoles: ${userRolesLeft.map(item => `<@&${item}>`).join(', ')}`
                let subtitle = `${member.user.username}#${member.user.discriminator} left the server.`
                let avatar = member.user.avatarURL()
                let time = `${(dateNow.getHours()).toString().padStart(2, '0')}:${(dateNow.getMinutes()).toString().padStart(2, '0')}:${(dateNow.getSeconds()).toString().padStart(2, '0')}`
                let footer = `User ID:${member.user.id} • Today at: ${time}`
                let embedCreation = await leaveEmbedGenerator(subtitle, footer, avatar, desc)
                channel.send(embedCreation);
            })
        }
    })

});

client.on("guildMemberAdd", function (member) {
    connection.query("SELECT * FROM `user_info` WHERE `userid` = ? AND `serverid` = ?", [member.user.id, member.guild.id], async function (err, userInfo, f) {
        if (userInfo.length == 0) {
            let joinedUnix = member.joinedTimestamp / 1000 | 0;
            let userRoles = JSON.stringify(member._roles)
            connection.query("INSERT INTO `user_info` (`userid`, `serverid`, `joinTimestamp`, `roles`) VALUES (?, ?, ?, ?);", [member.user.id, member.guild.id, joinedUnix, userRoles], async function (error, result, fields) { })
        } else {
            let dateNow = Date.now() / 1000 | 0;
            connection.query("UPDATE `user_info` SET `joinTimestamp` = ? WHERE `user_info`.`id` = ?;", [dateNow, userInfo[0].id], async function (err, res_upd, f) { })
            let giveRolesBack = JSON.parse(userInfo[0].roles)
            member.roles.add(giveRolesBack).catch(console.error);
        }
    })


    connection.query("SELECT * FROM `join_logs` WHERE `serverid` = ?", [member.guild.id], async function (err, areLogsEnabled, f) {
        if (areLogsEnabled.length == 1) {
            let channel = client.channels.cache.get(areLogsEnabled[0].logschannel)
            let dateNow = new Date();
            let time = `${(dateNow.getHours()).toString().padStart(2, '0')}:${(dateNow.getMinutes()).toString().padStart(2, '0')}:${(dateNow.getSeconds()).toString().padStart(2, '0')}`
            let subtitle = `${member.user.username}#${member.user.discriminator} joined the server.`
            let avatar = member.user.avatarURL()
            let footer = `User ID:${member.user.id} • Today at: ${time}`
            let desc = `Created at ${member.user.createdAt}`
            let embedCreation = await joinEmbedGenerator(subtitle, footer, avatar, desc)
            channel.send(embedCreation);
        }
    })


    connection.query("SELECT * FROM `welcome_msg` WHERE `serverid` = ?", [member.guild.id], async function (err, isWelcomingEnabled, f) {
        if (isWelcomingEnabled.length == 1) {
            let channel = client.channels.cache.get(isWelcomingEnabled[0].welcomechannel)
            let title = `Welcome to the ${member.guild.name} server!`
            let desc = `${isWelcomingEnabled[0].text}`
            let image = `${isWelcomingEnabled[0].image}`
            let embedCreation = await welcomeEmbedGenerator(title, image, desc)
            channel.send(`${member.user} has joined the server!`, {
                embed: embedCreation,
            });
        }
    })

});


client.on("guildMemberUpdate", function (oldMember, newMember) {
    oldMember.roles.cache.forEach(role => {
        if (!newMember.roles.cache.has(role.id)) {
            updateRoles(newMember)
        }
    }); // check if role removed


    newMember.roles.cache.forEach(role => {
        if (!oldMember.roles.cache.has(role.id)) {
            updateRoles(newMember)
        }
    }); // check if role removed

});

client.login(token);

function embedGenerator(title, subtitle, footer, avatar) {
    const embed = new Discord.MessageEmbed()
        .setColor("#ff9d5a")
        .setTitle(`${title}`)
        .setFooter(footer)
        .setAuthor(subtitle, avatar);
    return embed;
}

function deletionGenerator(descriprion, subtitle, footer, avatar) {
    const embed = new Discord.MessageEmbed()
        .setColor("#ff9d5a")
        .setDescription(`${descriprion}`)
        .setFooter(footer)
        .setAuthor(subtitle, avatar);
    return embed;
}

function leaveEmbedGenerator(subtitle, footer, avatar, desc) {
    const embed = new Discord.MessageEmbed()
        .setColor("#ff9d5a")
        .setDescription(desc)
        .setFooter(footer)
        .setAuthor(subtitle, avatar);
    return embed;
}

function joinEmbedGenerator(subtitle, footer, avatar, desc) {
    const embed = new Discord.MessageEmbed()
        .setColor("#ff9d5a")
        .setDescription(desc)
        .setFooter(footer)
        .setAuthor(subtitle, avatar);
    return embed;
}

function welcomeEmbedGenerator(title, image, desc) {
    const embed = new Discord.MessageEmbed()
        .setColor("#ff9d5a")
        .setTitle(`${title}`)
        .setImage(image)
        .setDescription(desc)
    return embed;
}

function updateRoles(newMember) {
    connection.query("SELECT * FROM `user_info` WHERE `userid` = ? AND `serverid` = ?", [newMember.user.id, newMember.guild.id], async function (err, userInfo, f) {
        if (userInfo.length == 1) {
            let newRoles = JSON.stringify(newMember._roles)
            connection.query("UPDATE `user_info` SET `roles` = ? WHERE `user_info`.`id` = ?;", [newRoles, userInfo[0].id], async function (error, res_upd, f) { })
        }
    })
}