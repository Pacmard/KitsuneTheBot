import {
  Message, TextChannel,
} from 'discord.js';
import { MikroORM } from '@mikro-orm/core';
import { ormConfig } from '../database/mikro-orm.config';
import { MuteEntity } from '../database/entities';

const Discord = require('discord.js');

const orm = MikroORM.init(ormConfig);

module.exports = {
  name: 'unmute',
  description: 'if you think someone had enough',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();
    if (!mention) {
      return msg.reply('Please, specify the user!');
    }

    if (mention.id === msg.author.id) {
      return msg.reply("You can't mute yourself!");
    }
    const perms = (msg.channel as TextChannel).permissionsFor(msg.member);
    const mutedUser = msg.guild.members.resolve(mention.id);
    const moder = msg.guild.members.resolve(msg.author.id);
    const mutedHighestRole = mutedUser.roles.highest;
    const moderHighestRole = moder.roles.highest;
    if (perms.has('MANAGE_MESSAGES') || perms.has('KICK_MEMBERS') || perms.has('BAN_MEMBERS') || perms.has('MANAGE_ROLES')) {
      if (mutedHighestRole.position <= moderHighestRole.position) {
        const serverId = msg.guild.id;
        const dateNow = Date.now() / 1000 | 0;
        const em = (await orm).em.fork().getRepository(MuteEntity);
        const isMuted = await em.findOne({
          userid: mention.id,
          server_id: serverId,
          unmute_time: {
            $gte: dateNow,
          },
          is_unmuted: 0,
        });
        if (isMuted) {
          isMuted.is_unmuted = 1;
          await em.persistAndFlush(isMuted);

          const role_remove = msg.guild.roles.cache.find((r) => r.name === 'Muted_Kitsune');
          const roles_old = isMuted.roles;

          if (roles_old.length >= 1) {
            await mutedUser.roles.add(roles_old).catch(console.error);
            mutedUser.roles.remove(role_remove.id).catch(console.error);
          } else {
            await mutedUser.roles.remove(role_remove.id).catch(console.error);
          }

          const image = 'https://media.tenor.com/images/7f9d13686d8d6b73d669c618ccb0afac/tenor.gif';
          const title = `Yay, ${mention.username}#${mention.discriminator} got unmuted!`;
          const subtitle = `${msg.author.username} unmutes ${mention.username}`;
          const embedCreation = await embedGenerator(title, image, subtitle);
          return msg.channel.send({ embeds: [embedCreation] });
        }
        return msg.reply('This user is not muted!');
      }
      return msg.reply('You don\'t have permissions to unmute this user!');
    }
    return msg.reply('You don\'t have permissions to unmute people!');
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
