import { Message, TextChannel } from 'discord.js';
import { MikroORM } from '@mikro-orm/core';
import { ormConfig } from '../database/mikro-orm.config';
import { JoinLogEntity } from '../database/entities';

const Discord = require('discord.js');

const orm = MikroORM.init(ormConfig);

module.exports = {
  name: 'enablejoin',
  description: 'if you want to know if someone slid into your server',
  async execute(msg: Message) {
    const perms = (msg.channel as TextChannel).permissionsFor(msg.member);
    const serverId = msg.guild.id;
    const logsChannel = msg.channel.id;
    if (perms.has('ADMINISTRATOR')) {
      const em = (await orm).em.fork().getRepository(JoinLogEntity);
      const isEnabled = await em.findOne({
        serverid: serverId,
      });
      if (!isEnabled) {
        const removingCmdsVars = msg.content.replace('k!enablejoin', '');
        const params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
        const paramsSplit = params.split(' ');

        if (paramsSplit[0].toLowerCase() === 'confirm') {
          const newJoinQuery = new JoinLogEntity();
          newJoinQuery.serverid = serverId;
          newJoinQuery.logschannel = logsChannel;
          await em.persistAndFlush(newJoinQuery);
          const image = 'https://media1.tenor.com/images/5e399a4b721b3714ef77177ce2d8d3da/tenor.gif?itemid=16102764';
          const title = 'Okie, sir! Logging enabled!';
          const subtitle = `${msg.author.username} enables server join logs!`;
          const embedCreation = await embedGenerator(title, image, subtitle);
          return msg.channel.send({ embeds: [embedCreation] });
        }
        return msg.reply('Are you sure you want to enable logging of users that joining server?\nLogs will be sent to the channel where command was used!\nIf you are sure: use the `k!enablejoin confirm` command in the correct channel!');
      }
      return msg.reply('Server join logging already enabled in this server! If you want to change channel for logs, use `k!changejoin` command, or `k!disablejoin` to disable them!');
    }
    return msg.reply('You don\'t have admin permissions to activate server join logs!');
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
