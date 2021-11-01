import {
  GuildMember, Message, Role, TextChannel,
} from 'discord.js';
import { MikroORM } from '@mikro-orm/core';
import { ormConfig } from '../database/mikro-orm.config';
import { MuteEntity } from '../database/entities';

const Discord = require('discord.js');

const orm = MikroORM.init(ormConfig);

module.exports = {
  name: 'mute',
  description: 'if someone needs to get muted',
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
        if (!isMuted) {
          const removingCmdsVars = msg.content.replace('k!mute', '').replace(`<@!${mention.id}>`, '').replace(`<@${mention.id}>`, '');
          const params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
          const paramsSplit = params.split(' ');

          let muteReason: string;
          const muteTime = parseInt(paramsSplit[0], 10);

          if (paramsSplit.length === 1) {
            muteReason = 'Not provided';
          } else {
            paramsSplit.shift();
            muteReason = paramsSplit.join(' ');
          }

          if (Number.isInteger(muteTime) && muteTime <= 48) {
            const unmute_time = 3600 * muteTime;
            const unmute_timestamp = dateNow + unmute_time;
            // @ts-ignore
            // eslint-disable-next-line no-underscore-dangle
            const roles_before = mutedUser._roles;

            const newMuteQuery = new MuteEntity();
            newMuteQuery.userid = mention.id;
            newMuteQuery.roles = roles_before;
            newMuteQuery.server_id = serverId;
            newMuteQuery.unmute_time = unmute_timestamp;
            newMuteQuery.reason = muteReason;
            newMuteQuery.is_unmuted = 0;
            await em.persistAndFlush(newMuteQuery);
            const role = msg.guild.roles.cache.find((r) => r.name === 'Muted_Kitsune');
            await mutedUser.roles.remove(roles_before).catch(console.error);
            mutedUser.roles.add(role).catch(console.error);

            const image = 'https://i.imgur.com/0IxjsfM.gif';
            const title = `Get muted, ${mention.username}#${mention.discriminator}!`;
            const subtitle = `${msg.author.username} mutes ${mention.username}`;
            const embedCreation = await embedGenerator(title, image, subtitle);

            const user_id = mention.id;
            timeout(mutedUser, role, unmute_time, user_id, serverId);
            return msg.channel.send({ embeds: [embedCreation] });
          }
          if (Number.isInteger(muteTime) === false) {
            return msg.reply('Please indicate the time for mute (in hours!) Exapmle: k!mute @KitsuneTheBot 1 Reason');
          }
          return msg.channel.send({ content: 'Mute time cannot be more than 48 hours!' });
        }
      }
      return msg.reply('You don\'t have permissions to mute this user!');
    }
    return msg.reply('You don\'t have permissions to mute people!');
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

function timeout(
  mutedUser: GuildMember,
  role: Role,
  unmute_time: number,
  user_id: string,
  serverId: string,
) {
  const time_timeout = unmute_time * 1000;
  setTimeout(async () => {
    const em = (await orm).em.fork().getRepository(MuteEntity);
    const isMuted = await em.findOne({
      userid: user_id,
      server_id: serverId,
      is_unmuted: 0,
    });
    if (isMuted) {
      isMuted.is_unmuted = 1;
      await em.persistAndFlush(isMuted);
      await mutedUser.roles.add(isMuted.roles).catch(console.error);
      mutedUser.roles.remove(role).catch(console.error);
    }
  }, time_timeout);
}
