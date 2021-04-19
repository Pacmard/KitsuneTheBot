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
    enablelogs: async function (msg) {
        let perms = msg.channel.permissionsFor(msg.member);
        let serverId = msg.guild.id;
        let logsChannel = msg.channel.id
        if (perms.has('ADMINISTRATOR')) {
            connection.query("SELECT * FROM `messages_logs` WHERE `serverid` = ? ", [serverId], async function (err, isEnabled, f) {
                if (isEnabled.length == 0) {
                    removingCmdsVars = msg.content.replace(`k!enablelogs`, ``)
                    params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                    paramsSplit = params.split(' ')

                    if (paramsSplit[0].toLowerCase() == 'confirm') {

                        connection.query("INSERT INTO `messages_logs` (`serverid`, `logschannel`) VALUES (?, ?);", [serverId, logsChannel], async function (error, result, fields) {

                            const image = `https://media1.tenor.com/images/5e399a4b721b3714ef77177ce2d8d3da/tenor.gif?itemid=16102764`
                            let title = `Okie, sir! Logging enabled!`
                            let subtitle = `${msg.author.username} enables message logs!`
                            let embedCreation = await embedGenerator(title, image, subtitle)
                            return msg.channel.send(embedCreation);
                        })
                    } else {
                        msg.reply('Are you sure you want to enable logging of deleted messages?\nLogs will be sent to the channel where command was used!\nIf you are sure: use the `k!enablelogs confirm` command in the correct channel!')
                    }
                } else {
                    msg.reply('Logging already enabled in this server! If you want to change channel for logs, use `k!changelogs` command, or `k!disablelogs` to disable them!')
                }
            })
        } else {
            msg.reply(`You don't have admin permissions to activate message logs!`)
        }
    }, disablelogs: async function (msg) {
        let perms = msg.channel.permissionsFor(msg.member);
        let serverId = msg.guild.id;
        if (perms.has('ADMINISTRATOR')) {
            connection.query("SELECT * FROM `messages_logs` WHERE `serverid` = ?", [serverId], async function (err, isEnabled, f) {
                if (isEnabled.length == 1) {
                    removingCmdsVars = msg.content.replace(`k!disablelogs`, ``)
                    params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                    paramsSplit = params.split(' ')

                    if (paramsSplit[0].toLowerCase() == 'confirm') {
                        connection.query("DELETE FROM `messages_logs` WHERE `messages_logs`.`id` = ?", [isEnabled[0].id], async function (error, result, fields) {
                            const image = `https://media1.tenor.com/images/a892784674818166e8a83c74e5a54a49/tenor.gif?itemid=16249499`
                            let title = `It makes me sad, but logging is disabled now.`
                            let subtitle = `${msg.author.username} disables message logs!`
                            let embedCreation = await embedGenerator(title, image, subtitle)
                            return msg.channel.send(embedCreation);
                        })
                    } else {
                        msg.reply('Are you sure you want to disable logging?\nLogs will not be sent anymore!\nIf you are sure: use the `k!disablelogs confirm` command!')
                    }
                } else {
                    msg.reply('Logging is not enabled in this server! If you want to enable it, use `k!enablelogs` command!')
                }
            })
        }
    }, changelogs: async function (msg) {
        let perms = msg.channel.permissionsFor(msg.member);
        let serverId = msg.guild.id;
        if (perms.has('ADMINISTRATOR')) {
            connection.query("SELECT * FROM `messages_logs` WHERE `serverid` = ?", [serverId], async function (err, isEnabled, f) {
                if (isEnabled.length == 1) {
                    if (isEnabled[0].logschannel != msg.channel.id) {
                        removingCmdsVars = msg.content.replace(`k!changelogs`, ``)
                        params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                        paramsSplit = params.split(' ')

                        if (paramsSplit[0].toLowerCase() == 'confirm') {
                            connection.query("UPDATE `messages_logs` SET `logschannel` = ? WHERE `messages_logs`.`id` = ?;", [msg.channel.id, isEnabled[0].id], async function (error, result, fields) {
                                const image = `https://media1.tenor.com/images/13d12906ab6c24e688a1144f85199e98/tenor.gif?itemid=10627589`
                                let title = `Got it, changing my location!`
                                let subtitle = `${msg.author.username} changes message logging channel!`
                                let embedCreation = await embedGenerator(title, image, subtitle)
                                return msg.channel.send(embedCreation);
                            })
                        } else {
                            msg.reply('Are you sure you want to change logging channel?\nLogs will be sent into this channel!\nIf you are sure: use the `k!changelogs confirm` command!')
                        }
                    } else {
                        msg.reply(`I'm already sending logs to this channel! If you want me to change it, use this command in another channel!`)
                    }
                } else {
                    msg.reply('Logging is not enabled in this server! If you want to enable it, use `k!enablelogs` command!')
                }
            })
        }
    },
    enableleave: async function (msg) {
        let perms = msg.channel.permissionsFor(msg.member);
        let serverId = msg.guild.id;
        let logsChannel = msg.channel.id
        if (perms.has('ADMINISTRATOR')) {
            connection.query("SELECT * FROM `leave_logs` WHERE `serverid` = ? ", [serverId], async function (err, isEnabled, f) {
                if (isEnabled.length == 0) {
                    removingCmdsVars = msg.content.replace(`k!enableleave`, ``)
                    params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                    paramsSplit = params.split(' ')

                    if (paramsSplit[0].toLowerCase() == 'confirm') {

                        connection.query("INSERT INTO `leave_logs` (`serverid`, `logschannel`) VALUES (?, ?);", [serverId, logsChannel], async function (error, result, fields) {

                            const image = `https://media1.tenor.com/images/5e399a4b721b3714ef77177ce2d8d3da/tenor.gif?itemid=16102764`
                            let title = `Okie, sir! Logging enabled!`
                            let subtitle = `${msg.author.username} enables server leave logs!`
                            let embedCreation = await embedGenerator(title, image, subtitle)
                            return msg.channel.send(embedCreation);
                        })
                    } else {
                        msg.reply('Are you sure you want to enable logging of users that leaving server?\nLogs will be sent to the channel where command was used!\nIf you are sure: use the `k!enableleave confirm` command in the correct channel!')
                    }
                } else {
                    msg.reply('Server leave logging already enabled in this server! If you want to change channel for logs, use `k!changeleave` command, or `k!disableleave` to disable them!')
                }
            })
        } else {
            msg.reply(`You don't have admin permissions to activate server leave logs!`)
        }
    },
    disableleave: async function (msg) {
        let perms = msg.channel.permissionsFor(msg.member);
        let serverId = msg.guild.id;
        if (perms.has('ADMINISTRATOR')) {
            connection.query("SELECT * FROM `leave_logs` WHERE `serverid` = ?", [serverId], async function (err, isEnabled, f) {
                if (isEnabled.length == 1) {
                    removingCmdsVars = msg.content.replace(`k!disableleave`, ``)
                    params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                    paramsSplit = params.split(' ')

                    if (paramsSplit[0].toLowerCase() == 'confirm') {
                        connection.query("DELETE FROM `leave_logs` WHERE `leave_logs`.`id` = ?", [isEnabled[0].id], async function (error, result, fields) {
                            const image = `https://media1.tenor.com/images/a892784674818166e8a83c74e5a54a49/tenor.gif?itemid=16249499`
                            let title = `It makes me sad, but server leave logging is disabled now.`
                            let subtitle = `${msg.author.username} disables server leave logs!`
                            let embedCreation = await embedGenerator(title, image, subtitle)
                            return msg.channel.send(embedCreation);
                        })
                    } else {
                        msg.reply('Are you sure you want to disable server leave logging?\nLogs will not be sent anymore!\nIf you are sure: use the `k!disableleave confirm` command!')
                    }
                } else {
                    msg.reply('Server leave logging is not enabled in this server! If you want to enable it, use `k!enableleave` command!')
                }
            })
        }
    },
    changeleave: async function (msg) {
        let perms = msg.channel.permissionsFor(msg.member);
        let serverId = msg.guild.id;
        if (perms.has('ADMINISTRATOR')) {
            connection.query("SELECT * FROM `leave_logs` WHERE `serverid` = ?", [serverId], async function (err, isEnabled, f) {
                if (isEnabled.length == 1) {
                    if (isEnabled[0].logschannel != msg.channel.id) {
                        removingCmdsVars = msg.content.replace(`k!changeleave`, ``)
                        params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                        paramsSplit = params.split(' ')

                        if (paramsSplit[0].toLowerCase() == 'confirm') {
                            connection.query("UPDATE `leave_logs` SET `logschannel` = ? WHERE `leave_logs`.`id` = ?;", [msg.channel.id, isEnabled[0].id], async function (error, result, fields) {
                                const image = `https://media1.tenor.com/images/13d12906ab6c24e688a1144f85199e98/tenor.gif?itemid=10627589`
                                let title = `Got it, changing my location!`
                                let subtitle = `${msg.author.username} changes server leave logging channel!`
                                let embedCreation = await embedGenerator(title, image, subtitle)
                                return msg.channel.send(embedCreation);
                            })
                        } else {
                            msg.reply('Are you sure you want to change leave logging channel?\nLogs will be sent into this channel!\nIf you are sure: use the `k!changeleave confirm` command!')
                        }
                    } else {
                        msg.reply(`I'm already sending logs to this channel! If you want me to change it, use this command in another channel!`)
                    }
                } else {
                    msg.reply('Logging is not enabled in this server! If you want to enable it, use `k!enableleave` command!')
                }
            })
        }
    },
    enablejoin: async function (msg) {
        let perms = msg.channel.permissionsFor(msg.member);
        let serverId = msg.guild.id;
        let logsChannel = msg.channel.id
        if (perms.has('ADMINISTRATOR')) {
            connection.query("SELECT * FROM `join_logs` WHERE `serverid` = ? ", [serverId], async function (err, isEnabled, f) {
                if (isEnabled.length == 0) {
                    removingCmdsVars = msg.content.replace(`k!enablejoin`, ``)
                    params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                    paramsSplit = params.split(' ')

                    if (paramsSplit[0].toLowerCase() == 'confirm') {

                        connection.query("INSERT INTO `join_logs` (`serverid`, `logschannel`) VALUES (?, ?);", [serverId, logsChannel], async function (error, result, fields) {

                            const image = `https://media1.tenor.com/images/5e399a4b721b3714ef77177ce2d8d3da/tenor.gif?itemid=16102764`
                            let title = `Okie, sir! Logging enabled!`
                            let subtitle = `${msg.author.username} enables server join logs!`
                            let embedCreation = await embedGenerator(title, image, subtitle)
                            return msg.channel.send(embedCreation);
                        })
                    } else {
                        msg.reply('Are you sure you want to enable logging of users that joining server?\nLogs will be sent to the channel where command was used!\nIf you are sure: use the `k!enablejoin confirm` command in the correct channel!')
                    }
                } else {
                    msg.reply('Server join logging already enabled in this server! If you want to change channel for logs, use `k!changejoin` command, or `k!disablejoin` to disable them!')
                }
            })
        } else {
            msg.reply(`You don't have admin permissions to activate server join logs!`)
        }
    },
    disablejoin: async function (msg) {
        let perms = msg.channel.permissionsFor(msg.member);
        let serverId = msg.guild.id;
        if (perms.has('ADMINISTRATOR')) {
            connection.query("SELECT * FROM `join_logs` WHERE `serverid` = ?", [serverId], async function (err, isEnabled, f) {
                if (isEnabled.length == 1) {
                    removingCmdsVars = msg.content.replace(`k!disablejoin`, ``)
                    params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                    paramsSplit = params.split(' ')

                    if (paramsSplit[0].toLowerCase() == 'confirm') {
                        connection.query("DELETE FROM `join_logs` WHERE `join_logs`.`id` = ?", [isEnabled[0].id], async function (error, result, fields) {
                            const image = `https://media1.tenor.com/images/a892784674818166e8a83c74e5a54a49/tenor.gif?itemid=16249499`
                            let title = `It makes me sad, but server join logging is disabled now.`
                            let subtitle = `${msg.author.username} disables server join logs!`
                            let embedCreation = await embedGenerator(title, image, subtitle)
                            return msg.channel.send(embedCreation);
                        })
                    } else {
                        msg.reply('Are you sure you want to disable server join logging?\nLogs will not be sent anymore!\nIf you are sure: use the `k!disablejoin confirm` command!')
                    }
                } else {
                    msg.reply('Server join logging is not enabled in this server! If you want to enable it, use `k!enablejoin` command!')
                }
            })
        }
    },
    changejoin: async function (msg) {
        let perms = msg.channel.permissionsFor(msg.member);
        let serverId = msg.guild.id;
        if (perms.has('ADMINISTRATOR')) {
            connection.query("SELECT * FROM `join_logs` WHERE `serverid` = ?", [serverId], async function (err, isEnabled, f) {
                if (isEnabled.length == 1) {
                    if (isEnabled[0].logschannel != msg.channel.id) {
                        removingCmdsVars = msg.content.replace(`k!changejoin`, ``)
                        params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                        paramsSplit = params.split(' ')

                        if (paramsSplit[0].toLowerCase() == 'confirm') {
                            connection.query("UPDATE `join_logs` SET `logschannel` = ? WHERE `join_logs`.`id` = ?;", [msg.channel.id, isEnabled[0].id], async function (error, result, fields) {
                                const image = `https://media1.tenor.com/images/13d12906ab6c24e688a1144f85199e98/tenor.gif?itemid=10627589`
                                let title = `Got it, changing my location!`
                                let subtitle = `${msg.author.username} changes server join logging channel!`
                                let embedCreation = await embedGenerator(title, image, subtitle)
                                return msg.channel.send(embedCreation);
                            })
                        } else {
                            msg.reply('Are you sure you want to change join logging channel?\nLogs will be sent into this channel!\nIf you are sure: use the `k!changejoin confirm` command!')
                        }
                    } else {
                        msg.reply(`I'm already sending logs to this channel! If you want me to change it, use this command in another channel!`)
                    }
                } else {
                    msg.reply('Logging is not enabled in this server! If you want to enable it, use `k!enablejoin` command!')
                }
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

module.exports.commands = commands;