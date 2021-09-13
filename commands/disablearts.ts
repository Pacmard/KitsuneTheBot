import { Message, TextChannel, WebhookClient } from 'discord.js';
import { MikroORM } from '@mikro-orm/core';
import { ormConfig } from '../database/mikro-orm.config';
import { HourlyArtsEntity } from '../database/entities';

const Discord = require('discord.js');

const orm = MikroORM.init(ormConfig);

module.exports = {
  name: 'disablearts',
  description: 'if you dont want hourly arts anymore',
  async execute(msg: Message) {
    const perms = (msg.channel as TextChannel).permissionsFor(msg.member);
    const serverId = msg.guild.id;
    if (perms.has('ADMINISTRATOR')) {
      const em = (await orm).em.fork().getRepository(HourlyArtsEntity);
      const isEnabled = await em.findOne({
        serverid: serverId,
        channelid: msg.channel.id,
      });
      if (isEnabled) {
        const removingCmdsVars = msg.content.replace('k!disablearts', '');
        const params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
        const paramsSplit = params.split(' ');

        if (paramsSplit[0].toLowerCase() === 'confirm') {
          const webhookClient = new WebhookClient({ url: isEnabled.webhook_url });
          await webhookClient.delete();
          await em.remove(isEnabled).flush();
          const image = 'https://media1.tenor.com/images/a892784674818166e8a83c74e5a54a49/tenor.gif?itemid=16249499';
          const title = 'It makes me sad, but hourly arts are disabled now.';
          const subtitle = `${msg.author.username} disables hourly arts!`;
          const embedCreation = await embedGenerator(title, image, subtitle);
          return msg.channel.send({ embeds: [embedCreation] });
        }
        return msg.reply('Are you sure you want to disable hourly arts?\nHourly arts will not be sent anymore!\nIf you are sure: use the `k!disablearts confirm` command!');
      }
      return msg.reply('Hourly arts are not enabled in this server! If you want to enable them, use `k!enablearts` command!');
    }
    return msg.reply('You don\'t have admin permissions to disable hourly arts!');
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
