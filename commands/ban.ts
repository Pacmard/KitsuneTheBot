import { Message, TextChannel } from 'discord.js';

const Discord = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'punish them!',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();
    if (!mention) {
      return msg.reply('Please, specify the user!');
    }

    if (mention.id === msg.author.id) {
      return msg.reply("You can't ban yourself!");
    }

    const perms = (msg.channel as TextChannel).permissionsFor(msg.member);
    const bannedPerms = (msg.channel as TextChannel).permissionsFor(mention);
    const bannedUser = msg.guild.members.resolve(mention.id);
    const moder = msg.guild.members.resolve(msg.author.id);
    const bannedHighestRole = bannedUser.roles.highest;
    const moderHighestRole = moder.roles.highest;
    if (perms.has('BAN_MEMBERS')) {
      if (!(bannedPerms.has('BAN_MEMBERS') || bannedPerms.has('ADMINISTRATOR') || bannedPerms.has('KICK_MEMBERS') || bannedPerms.has('MANAGE_ROLES')) && (bannedHighestRole.position <= moderHighestRole.position)) {
        const removingCmdsVars = msg.content.replace('k!ban', '').replace(/<@!?\d+>/, '');
        const params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
        let banReason;

        if (params.length === 0) {
          banReason = 'Not provided';
        } else {
          // eslint-disable-next-line prefer-destructuring
          banReason = params[0];
        }

        await bannedUser.ban({ reason: banReason });

        const image = 'https://cdn.discordapp.com/attachments/816937791173689356/836500563075661854/rickban.gif';
        const title = `Get banned, ${mention.username}#${mention.discriminator}!`;
        const subtitle = `${msg.author.username} bans ${mention.username}`;
        const embedCreation = await embedGenerator(title, image, subtitle);
        return msg.channel.send({ embeds: [embedCreation] });
      }
      return msg.reply('You don\'t have permissions to ban this user!');
    }
    return msg.reply('You don\'t have permissions to ban people!');
  },
};

function embedGenerator(title: string, image: string, subtitle: string) {
  const embed = new Discord.MessageEmbed()
    .setColor('#ff9d5a')
    .setTitle(title)
    .setImage(image)
    .setFooter('KitsuneTheBot v1.0.0')
    .setAuthor(subtitle);
  return embed;
}
