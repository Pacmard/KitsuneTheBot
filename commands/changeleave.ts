import { Message, TextChannel } from 'discord.js';
import { MikroORM } from '@mikro-orm/core';
import { ormConfig } from '../database/mikro-orm.config';
import { LeaveLogEntity } from '../database/entities';

const Discord = require('discord.js');

const orm = MikroORM.init(ormConfig);

module.exports = {
  name: 'changeleave',
  description: 'if you want to change leave logs lovation',
  async execute(msg: Message) {
    const perms = (msg.channel as TextChannel).permissionsFor(msg.member);
    const serverId = msg.guild.id;
    if (perms.has('ADMINISTRATOR')) {
      const em = (await orm).em.fork().getRepository(LeaveLogEntity);
      const isEnabled = await em.findOne({
        serverid: serverId,
      });
      if (isEnabled) {
        if (isEnabled.logschannel !== msg.channel.id) {
          const removingCmdsVars = msg.content.replace('k!changeleave', '');
          const params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
          const paramsSplit = params.split(' ');

          if (paramsSplit[0].toLowerCase() === 'confirm') {
            isEnabled.logschannel = msg.channel.id;
            await em.persistAndFlush(isEnabled);
            const image = 'https://media1.tenor.com/images/13d12906ab6c24e688a1144f85199e98/tenor.gif?itemid=10627589';
            const title = 'Got it, changing my location!';
            const subtitle = `${msg.author.username} changes server leave logging channel!`;
            const embedCreation = await embedGenerator(title, image, subtitle);
            return msg.channel.send({ embeds: [embedCreation] });
          }
          return msg.reply('Are you sure you want to change leave logging channel?\nLogs will be sent into this channel!\nIf you are sure: use the `k!changeleave confirm` command!');
        }
        return msg.reply('I\'m already sending logs to this channel! If you want me to change it, use this command in another channel!');
      }
      return msg.reply('Logging is not enabled in this server! If you want to enable it, use `k!enableleave` command!');
    }
    return msg.reply('You don\'t have admin permissions to change leave logs channel!');
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
