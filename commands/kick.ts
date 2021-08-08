import { Message, TextChannel } from 'discord.js';

const Discord = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'if someone needs to leave',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();
    if (!mention) {
      return msg.reply('Please, specify the user!');
    }

    if (mention.id === msg.author.id) {
      return msg.reply("You can't ban yourself!");
    }
    const perms = (msg.channel as TextChannel).permissionsFor(msg.member);
    const kickedPerms = (msg.channel as TextChannel).permissionsFor(mention);
    const kickedUser = msg.guild.members.resolve(mention.id);
    const moder = msg.guild.members.resolve(msg.author.id);
    const kickedHighestRole = kickedUser.roles.highest;
    const moderHighestRole = moder.roles.highest;
    if (perms.has('KICK_MEMBERS')) {
      if (!(kickedPerms.has('BAN_MEMBERS') || kickedPerms.has('ADMINISTRATOR') || kickedPerms.has('KICK_MEMBERS') || kickedPerms.has('MANAGE_ROLES')) && (kickedHighestRole.position <= moderHighestRole.position)) {
        kickedUser.kick();

        const image = 'https://media1.tenor.com/images/1071791f88205a82dfc4448f08a6b25c/tenor.gif?itemid=17562086';
        const title = `Get kicked, ${mention.username}#${mention.discriminator}!`;
        const subtitle = `${msg.author.username} kicks ${mention.username}`;
        const embedCreation = await embedGenerator(title, image, subtitle);
        return msg.channel.send({ embeds: [embedCreation] });
      }
      return msg.reply('You don\'t have permissions to kick this user!');
    }
    return msg.reply('You don\'t have permissions to kick people!');
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
