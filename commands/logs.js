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
    enablelogs: async function (msg) {
        let perms = msg.channel.permissionsFor(msg.member);
        let serverId = msg.guild.id;
        let logsChannel = msg.channel.id
        if (perms.has('ADMINISTRATOR')) {
            connection.query("SELECT * FROM `messages_logs` WHERE `serverid` = ? AND `enabled` = ?", [serverId, 1], async function (err, isEnabled, f) {
                if (isEnabled.length == 0) {
                    removingCmdsVars = msg.content.replace(`k!enablelogs`, ``)
                    params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
                    paramsSplit = params.split(' ')

                    if (paramsSplit[0].toLowerCase() == 'confirm') {

                        connection.query("INSERT INTO `messages_logs` (`serverid`, `logschannel`, `enabled`) VALUES (?, ?, ?);", [serverId, logsChannel, 1], async function (error, result, fields) {

                            // const image = `https://media1.tenor.com/images/2dfc019556073683716852b293959706/tenor.gif?itemid=17040749`
                            // let title = `Get banned, ${mention.username}#${mention.discriminator}!`
                            // let subtitle = `${msg.author.username} bans ${mention.username}`
                            // let embedCreation = await embedGenerator(title, image, subtitle)
                            // return msg.channel.send(embedCreation);
                            msg.reply('Logs enabled')
                        })
                    } else {
                        msg.reply('Are you sure you want to enable logging of deleted messages?\nDeletion notifications will be sent to the channel where command was used!\nIf you are sure: use the `k!enablelogs confirm` command on the correct channel!')
                    }
                } else {
                    msg.reply('Logging already enabled in this server! If you want to change channel for logs, use k!changelogs command!')
                }
            })
        } else {
            msg.reply(`You don't have admin permissions to activate deletion logs!`)
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