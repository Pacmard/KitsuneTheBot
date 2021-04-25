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

var options = {
    enable: async function (msg) {
        let perms = msg.channel.permissionsFor(msg.member);
        let serverId = msg.guild.id;
        let welcomeChannel = msg.channel.id
        connection.query("SELECT * FROM `welcome_msg` WHERE `serverid` = ? ", [serverId], async function (err, isEnabled, f) {
            if (isEnabled.length == 0) {
                removingCmdsVars = msg.content.replace(`k!welcome`, ``)
                params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                paramsSplit = params.split(' ')

                console.log(paramsSplit)

                if (paramsSplit[1] != undefined && paramsSplit[1].toLowerCase() == 'confirm') {

                    connection.query("INSERT INTO `welcome_msg` (`serverid`, `welcomechannel`, `text`, `image`) VALUES (?, ?, ?, ?);", [serverId, welcomeChannel, 'Welcome to the server! We hope you will like it and stay with us!', 'https://media1.tenor.com/images/a1e2967207391a46b54097b2abde78e4/tenor.gif?itemid=16415258'], async function (error, result, fields) {
                        const image = `https://media1.tenor.com/images/5e399a4b721b3714ef77177ce2d8d3da/tenor.gif?itemid=16102764`
                        let title = `Okie, sir! Welcoming message enabled!`
                        let subtitle = `${msg.author.username} enables welcoming message!`
                        let embedCreation = await embedGenerator(title, image, subtitle)
                        return msg.channel.send(embedCreation);
                    })
                } else {
                    msg.reply('Are you sure you want to enable welcoming message?\nWelcoming message will be sent to the channel where command was used!\nIf you are sure: use the `k!welcome enable confirm` command in the correct channel!')
                }
            } else {
                msg.reply('Welcoming message already enabled in this server! If you want to change channel for it, use `k!welcome changechannel` command, or `k!welcome disable` to disable it!')
            }
        })
    },
    setimage: async function (msg) {
        let serverId = msg.guild.id;
        connection.query("SELECT * FROM `welcome_msg` WHERE `serverid` = ? ", [serverId], async function (err, isEnabled, f) {
            if (isEnabled.length == 1) {
                removingCmdsVars = msg.content.replace(`k!welcome`, ``)
                params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                paramsSplit = params.split(' ')
                if (paramsSplit[1] != undefined && isURL(paramsSplit[1])) {
                    connection.query("UPDATE `welcome_msg` SET `image` = ? WHERE `welcome_msg`.`id` = ?;", [paramsSplit[1], isEnabled[0].id], async function (error, result, fields) {
                        const image = `https://media1.tenor.com/images/13d12906ab6c24e688a1144f85199e98/tenor.gif?itemid=10627589`
                        let title = `Got it, changing image!`
                        let subtitle = `${msg.author.username} changes welcoming message image!`
                        let embedCreation = await embedGenerator(title, image, subtitle)
                        return msg.channel.send(embedCreation);
                    })
                } else {
                    msg.reply('Please, specify image for welcoming message!\nExample: `k!welcome setimage https://vk.cc/c1iw9p`\n(Should be URL, gifs also allowed)')
                }
            } else {
                msg.reply('Welcoming message is not enabled in this server! If you want to enable it, use `k!welcome enable` command!')
            }
        })

    },
    settext: async function (msg) {
        let serverId = msg.guild.id;
        connection.query("SELECT * FROM `welcome_msg` WHERE `serverid` = ? ", [serverId], async function (err, isEnabled, f) {
            if (isEnabled.length == 1) {
                removingCmdsVars = msg.content.replace(`k!welcome`, ``)
                params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                paramsSplit = params.split(' ')
                if (paramsSplit[1] != undefined) {
                    paramsSplit.shift()
                    let welcomeText = paramsSplit.join(' ')
                    connection.query("UPDATE `welcome_msg` SET `text` = ? WHERE `welcome_msg`.`id` = ?;", [welcomeText, isEnabled[0].id], async function (error, result, fields) {
                        const image = `https://media1.tenor.com/images/13d12906ab6c24e688a1144f85199e98/tenor.gif?itemid=10627589`
                        let title = `Got it, changing text!`
                        let subtitle = `${msg.author.username} changes welcoming message text!`
                        let embedCreation = await embedGenerator(title, image, subtitle)
                        return msg.channel.send(embedCreation);
                    })
                } else {
                    msg.reply('Please, specify text for welcoming message!')
                }
            } else {
                msg.reply('Welcoming message is not enabled in this server! If you want to enable it, use `k!welcome enable` command!')
            }
        })
    },
    changechannel: async function (msg) {
        let serverId = msg.guild.id;
        connection.query("SELECT * FROM `welcome_msg` WHERE `serverid` = ?", [serverId], async function (err, isEnabled, f) {
            if (isEnabled.length == 1) {
                if (isEnabled[0].welcomechannel != msg.channel.id) {
                    removingCmdsVars = msg.content.replace(`k!welcome`, ``)
                    params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                    paramsSplit = params.split(' ')

                    if (paramsSplit[1] != undefined && paramsSplit[1].toLowerCase() == 'confirm') {
                        connection.query("UPDATE `welcome_msg` SET `welcomechannel` = ? WHERE `welcome_msg`.`id` = ?;", [msg.channel.id, isEnabled[0].id], async function (error, result, fields) {
                            const image = `https://media1.tenor.com/images/13d12906ab6c24e688a1144f85199e98/tenor.gif?itemid=10627589`
                            let title = `Got it, changing my location!`
                            let subtitle = `${msg.author.username} changes welcoming message channel!`
                            let embedCreation = await embedGenerator(title, image, subtitle)
                            return msg.channel.send(embedCreation);
                        })
                    } else {
                        msg.reply('Are you sure you want to change welcoming message channel?\nWelcoming message will be sent into this channel!\nIf you are sure: use the `k!welcome changechannel confirm` command!')
                    }
                } else {
                    msg.reply(`I'm already sending welcoming message to this channel! If you want me to change it, use this command in another channel!`)
                }
            } else {
                msg.reply('Welcoming message is not enabled in this server! If you want to enable it, use `k!welcome enable` command!')
            }
        })
    },
    disable: async function (msg) {
        let serverId = msg.guild.id;
        connection.query("SELECT * FROM `welcome_msg` WHERE `serverid` = ?", [serverId], async function (err, isEnabled, f) {
            if (isEnabled.length == 1) {
                removingCmdsVars = msg.content.replace(`k!welcome`, ``)
                params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                paramsSplit = params.split(' ')

                if (paramsSplit[1] != undefined && paramsSplit[1].toLowerCase() == 'confirm') {
                    connection.query("DELETE FROM `welcome_msg` WHERE `welcome_msg`.`id` = ?", [isEnabled[0].id], async function (error, result, fields) {
                        const image = `https://media1.tenor.com/images/a892784674818166e8a83c74e5a54a49/tenor.gif?itemid=16249499`
                        let title = `It makes me sad, but welcoming message is disabled now.`
                        let subtitle = `${msg.author.username} disables welcoming message!`
                        let embedCreation = await embedGenerator(title, image, subtitle)
                        return msg.channel.send(embedCreation);
                    })
                } else {
                    msg.reply('Are you sure you want to disable welcoming message?\nWelcoming message will not be sent anymore!\nIf you are sure: use the `k!welcome disable confirm` command!')
                }
            } else {
                msg.reply('Welcoming message is not enabled in this server! If you want to enable it, use `k!welcome enable` command!')
            }
        })
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

function isURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

module.exports.options = options;