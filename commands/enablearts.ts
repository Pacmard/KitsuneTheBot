import { Message, TextChannel } from 'discord.js';
import { MikroORM } from '@mikro-orm/core';
import { ormConfig } from '../database/mikro-orm.config';
import { HourlyArtsEntity } from '../database/entities';

const Discord = require('discord.js');

const orm = MikroORM.init(ormConfig);

module.exports = {
  name: 'enablearts',
  description: 'If you need some hourly arts',
  async execute(msg: Message) {
    const perms = (msg.channel as TextChannel).permissionsFor(msg.member);
    const serverId = msg.guild.id;
    if (perms.has('ADMINISTRATOR')) {
      const em = (await orm).em.fork().getRepository(HourlyArtsEntity);
      const isEnabled = await em.findOne({
        serverid: serverId,
      });
      if (!isEnabled) {
        const removingCmdsVars = msg.content.replace('k!enablearts', '');
        const params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
        const paramsSplit = params.split(' ');

        if (paramsSplit[0].toLowerCase() === 'confirm') {
          const webhook = await (msg.channel as TextChannel).createWebhook('KitsuneTheBot', { avatar: 'https://i.imgur.com/6zDqb3G.jpg' });
          const newArtsEnt = new HourlyArtsEntity();
          newArtsEnt.serverid = serverId;
          newArtsEnt.webhook_url = `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`;
          newArtsEnt.channelid = msg.channel.id;
          await em.persistAndFlush(newArtsEnt);
          const image = 'https://media1.tenor.com/images/5e399a4b721b3714ef77177ce2d8d3da/tenor.gif?itemid=16102764';
          const title = 'Okie, sir! Hourly arts enabled!';
          const subtitle = `${msg.author.username} enables houly arts!`;
          const embedCreation = await embedGenerator(title, image, subtitle);
          return msg.channel.send({ embeds: [embedCreation] });
        }
        return msg.reply('Are you sure you want to enable hourly arts?\nArts will be sent to the channel where command was used!\nIf you are sure: use the `k!enablearts confirm` command in the correct channel!');
      }
      return msg.reply('Arts already enabled in this server! If you want to change channel for arts, use `k!changearts` command, or `k!disablearts` to disable them!');
    }
    return msg.reply('You don\'t have admin permissions to activate hourly arts!');
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
