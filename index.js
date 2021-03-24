const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios')
var mysql = require('mysql');
var image = require('./commands/image.js')
var moderation = require('./commands/moderation.js')
const { prefix, token, mysql_user, mysql_passwd, mysql_db } = require('./config.json');

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

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {


    if (msg.content.startsWith('k!help')) {
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
                        "**k!tickle @mention** - Tickle someone, and they can tickle you too\n",
                },
                {
                    name: "Other Commands",
                    value: "**k!help** - Show help\n",
                }
            )
            .setFooter(`KitsuneTheBot v0.0.1`)
            .setColor("#ff9d5a");
        msg.channel.send(embed);
    }

    if (msg.content.startsWith('k!cuddle')) {
        image.commands['cuddle'](msg)
    }

    if (msg.content.startsWith('k!pat')) {
        image.commands['pat'](msg)
    }

    if (msg.content.startsWith('k!kiss')) {
        image.commands['kiss'](msg)
    }

    if (msg.content.startsWith('k!slap')) {
        image.commands['slap'](msg)
    }

    if (msg.content.startsWith('k!hug')) {
        image.commands['hug'](msg)
    }

    if (msg.content.startsWith('k!tickle')) {
        image.commands['tickle'](msg)
    }

    if (msg.content.startsWith('k!ban')) {
        moderation.commands['ban'](msg)
    }

    if (msg.content.startsWith('k!kick')) {
        moderation.commands['kick'](msg)
    }

    if (msg.content.startsWith('k!tempmute')) {
        moderation.commands['tempmute'](msg)
    }
});
client.login(token);