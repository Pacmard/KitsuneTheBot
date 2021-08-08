import { Message, TextChannel } from 'discord.js';
import { MikroORM } from '@mikro-orm/core';
import { ormConfig } from '../database/mikro-orm.config';
import { JoinLogEntity } from '../database/entities';

const Discord = require('discord.js');

const orm = MikroORM.init(ormConfig);

module.exports = {
  name: 'disablejoin',
  description: 'if you dont want to know who joined your server anymore',
  async execute(msg: Message) {
    const perms = (msg.channel as TextChannel).permissionsFor(msg.member);
    const serverId = msg.guild.id;
    if (perms.has('ADMINISTRATOR')) {
      const em = (await orm).em.fork().getRepository(JoinLogEntity);
      const isEnabled = await em.findOne({
        serverid: serverId,
      });
      if (isEnabled) {
        const removingCmdsVars = msg.content.replace('k!disablejoin', '');
        const params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
        const paramsSplit = params.split(' ');

        if (paramsSplit[0].toLowerCase() === 'confirm') {
          await em.remove(isEnabled).flush();
          const image = 'https://media1.tenor.com/images/a892784674818166e8a83c74e5a54a49/tenor.gif?itemid=16249499';
          const title = 'It makes me sad, but server join logging is disabled now.';
          const subtitle = `${msg.author.username} disables server join logs!`;
          const embedCreation = await embedGenerator(title, image, subtitle);
          return msg.channel.send({ embeds: [embedCreation] });
        }
        return msg.reply('Are you sure you want to disable server join logging?\nLogs will not be sent anymore!\nIf you are sure: use the `k!disablejoin confirm` command!');
      }
      return msg.reply('Server join logging is not enabled in this server! If you want to enable it, use `k!enablejoin` command!');
    }
    return msg.reply('You don\'t have admin permissions to disable join logs!');
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
