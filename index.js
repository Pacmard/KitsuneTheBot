const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios')
var mysql = require('mysql');
var image = require('./commands/image.js')
var moderation = require('./commands/moderation.js')
var logs = require('./commands/logs.js')
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


client.on('ready', async () => {
    client.user.setActivity('Use k!help to see all commands!');

    console.log(`Logged in as ${client.user.tag}!`);

    const date = new Date();
    let dateNow = Date.now()/1000 | 0;
    connection.query("SELECT * FROM `mute` WHERE `unmute_time` >= ?", [dateNow], async function (err, isAnyoneMuted, f) {
        if (isAnyoneMuted.length != 0){
            for (i = 0; i < isAnyoneMuted.length; i++){
                let raw_timeout = isAnyoneMuted[0].unmute_time * 1000
                let time_timeout = raw_timeout - (dateNow*1000)
                let guildCheck = client.guilds.cache.get(isAnyoneMuted[i].server_id);
                let mutedUser = await guildCheck.members.fetch(isAnyoneMuted[i].userid);
                let role = guildCheck.roles.cache.find(r => r.name === "Muted_Kitsune");
                let roles_old = JSON.parse(isAnyoneMuted[0].roles)
                setTimeout(async () => {
                    if (roles_old.length >= 1) {
                        mutedUser.roles.remove(role.id).catch(console.error);
                        mutedUser.roles.add(roles_old).catch(console.error);
                    } else {
                        mutedUser.roles.remove(role.id).catch(console.error);
                    }
                }, time_timeout);
            }
        }
    })
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
                        "**k!unmute @mention** - If you need to let someone talk again!\n" +
                        "**k!enablelogs** - Enable message actions logging!\n" +
                        "**k!disablelogs** - Disable message actions logging!\n" +
                        "**k!changelogs** - Change channel for message actions logs!\n",
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

    if (msg.content.startsWith('k!lick')) {
        image.commands['lick'](msg)
    }

    if (msg.content.startsWith('k!bite')) {
        image.commands['bite'](msg)
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

    if (msg.content.startsWith('k!unmute')) {
        moderation.commands['unmute'](msg)
    }

    if (msg.content.startsWith('k!enablelogs')) {
        logs.commands['enablelogs'](msg)
    }

    if (msg.content.startsWith('k!disablelogs')) {
        logs.commands['disablelogs'](msg)
    }

    if (msg.content.startsWith('k!changelogs')) {
        logs.commands['changelogs'](msg)
    }
});

client.on("guildCreate", async function(guild){
    let role
    await guild.roles.create({
        data: {
            name: 'Muted_Kitsune',
            color: 'DEFAULT'
        },
        reason: 'Role for k!tempmute command',
    }).then(async function (res){
        role = await guild.roles.cache.get(res.id);
        role.setPermissions(0);
    })

    let channelsArr = guild.channels.cache.array()
    for (i = 0; i < channelsArr.length; i++){
        if (channelsArr[i].type == 'text'){
            let channel = guild.channels.cache.get(channelsArr[i].id)
            channel.updateOverwrite(role, {SEND_MESSAGES: false});
        } else if (channelsArr[i].type == 'voice'){
            let channel = guild.channels.cache.get(channelsArr[i].id)
            channel.updateOverwrite(role, {CONNECT: false});
        }
    }
});

client.on("messageDelete", function(msg){
    connection.query("SELECT * FROM `messages_logs` WHERE `serverid` = ?", [msg.guild.id], async function (err, isEnabled, f) {
        if ((isEnabled.length == 1) && (msg.author.id != '823948446758338572') && (msg.author.bot == false)){
            let channel = client.channels.cache.get(isEnabled[0].logschannel)
            let title;
            let subtitle = `${msg.author.username}#${msg.author.discriminator} deleted message in #${msg.channel.name}`
            let avatar = msg.author.avatarURL()
            let dateNow = new Date()
            let time = `${(dateNow.getHours()).toString().padStart(2,'0')}:${(dateNow.getMinutes()).toString().padStart(2,'0')}:${(dateNow.getSeconds()).toString().padStart(2,'0')}`
            let footer = `User ID:${msg.author.id} • Today at: ${time}`

            if (msg.attachments.array().length >= 1){
                title = msg.attachments.array()[0].proxyURL
            } else {
                title = `${msg.content}`
            }

            let embedCreation = await embedGenerator(title, subtitle, footer, avatar)
            channel.send(embedCreation);
        }
    })

});


client.on("messageUpdate", function(oldMessage, newMessage){
    connection.query("SELECT * FROM `messages_logs` WHERE `serverid` = ?", [newMessage.guild.id], async function (err, isEnabled, f) {
        if ((isEnabled.length == 1) && (newMessage.author.id != '823948446758338572') && (newMessage.author.bot == false) && (newMessage.content != oldMessage.content)){
            let channel = client.channels.cache.get(isEnabled[0].logschannel)
            let title = `Before: ${oldMessage.content}\nAfter: ${newMessage.content}`;
            let subtitle = `${newMessage.author.username}#${newMessage.author.discriminator} edited message in #${newMessage.channel.name}`
            let avatar = newMessage.author.avatarURL()
            let dateNow = new Date()
            let time = `${(dateNow.getHours()).toString().padStart(2,'0')}:${(dateNow.getMinutes()).toString().padStart(2,'0')}:${(dateNow.getSeconds()).toString().padStart(2,'0')}`
            let footer = `User ID:${newMessage.author.id} • Today at: ${time}`
            let embedCreation = await embedGenerator(title, subtitle, footer, avatar)
            channel.send(embedCreation);
        }
    })
});

client.login(token);

function embedGenerator(title, subtitle, footer, avatar){
    const embed = new Discord.MessageEmbed()
        .setColor("#ff9d5a")
        .setTitle(`${title}`)
        .setFooter(footer)
        .setAuthor(subtitle, avatar);
    return embed;
}