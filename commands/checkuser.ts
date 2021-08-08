import {
  Message, TextChannel, User,
} from 'discord.js';
import { MikroORM } from '@mikro-orm/core';
import { ormConfig } from '../database/mikro-orm.config';
import { UserInfoEntity } from '../database/entities';

const Discord = require('discord.js');

const orm = MikroORM.init(ormConfig);

module.exports = {
  name: 'checkuser',
  description: 'for all ytour pat needs',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();
    if (!mention) {
      return msg.reply('Please, specify the user!');
    }

    const perms = (msg.channel as TextChannel).permissionsFor(msg.member);
    if (perms.has('MANAGE_MESSAGES') || perms.has('KICK_MEMBERS') || perms.has('BAN_MEMBERS') || perms.has('MANAGE_ROLES')) {
      const dateNow = new Date();
      const time = `${(dateNow.getHours()).toString().padStart(2, '0')}:${(dateNow.getMinutes()).toString().padStart(2, '0')}:${(dateNow.getSeconds()).toString().padStart(2, '0')}`;
      const subtitle = `${mention.username}#${mention.discriminator} info.`;
      const avatar = mention.avatarURL();
      const footer = `User ID: ${msg.author.id} • Today at: ${time}`;
      const em = (await orm).em.fork().getRepository(UserInfoEntity);
      const userInfo = await em.findOne({
        userid: mention.id,
        serverid: msg.guild.id,
      });
      const embedCreation = await userInfoGenerator(subtitle, mention, userInfo, avatar, footer);
      return msg.channel.send({ embeds: [embedCreation] });
    }
    return msg.reply('You don\'t have permissions to get info about users!');
  },
};

function userInfoGenerator(
  subtitle: string,
  mention: User,
  userInfo: UserInfoEntity,
  avatar: string,
  footer: string,
) {
  const userRoles = userInfo.roles;
  let rolesLine;

  if (userRoles.length >= 1) {
    rolesLine = userRoles.map((item: string) => `<@&${item}>`).join(', ');
  } else {
    rolesLine = 'No roles.';
  }

  const dateJoined = new Date(userInfo.joinTimestamp * 1000);
  const timeJoined = `${dateJoined.toUTCString()}+0000 (Coordinated Universal Time)`;
  const embed = new Discord.MessageEmbed()
    .setColor('#ff9d5a')
    .setTitle('Avatar')
    .setURL(avatar)
    .addFields(
      { name: 'Roles', value: `${rolesLine}`, inline: true },
      { name: 'Created at', value: `${mention.createdAt}`, inline: true },
      { name: 'Joined at', value: `${timeJoined}`, inline: true },
    )
    .setFooter(footer)
    .setAuthor(subtitle, avatar);
  return embed;
}
