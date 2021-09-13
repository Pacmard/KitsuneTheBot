import {
  Message, TextChannel, MessageButton, MessageActionRow, Role,
} from 'discord.js';
import { MikroORM } from '@mikro-orm/core';
import { uuid } from 'uuidv4';
import { chunk } from 'lodash';
import { ormConfig } from '../database/mikro-orm.config';
import { ButtonRolesEntity } from '../database/entities';
import { ButtonRoleInterface } from '../interfaces';

const Discord = require('discord.js');

const orm = MikroORM.init(ormConfig);

module.exports = {
  name: 'buttonroles',
  description: 'if you want some button roles',
  // eslint-disable-next-line consistent-return
  async execute(msg: Message) {
    const perms = (msg.channel as TextChannel).permissionsFor(msg.member);
    if (perms.has('ADMINISTRATOR')) {
      const options = ['create', 'help'];
      const message = msg.content;
      const test = message.replace('k!buttonroles ', '').split(' ');
      const setting = test.shift();
      if (options.includes(setting)) {
        return funcs[setting](msg);
      }
      // eslint-disable-next-line max-len
      // msg.reply('Укажите команду для которой надо настроить права, список команд и их триггеры можете получить используя команду !triggers') TODO
    } else return msg.reply('You don\'t have admin permissions to manage button roles!');
  },
};

function buttonsGenerator(roles: ButtonRoleInterface[]) {
  const components = roles.map((role) => new MessageButton()
    .setCustomId(role.uuid)
    .setLabel(role.name)
    .setStyle('PRIMARY'));

  if (roles.length <= 5) {
    const row = new MessageActionRow()
      .addComponents(
        components,
      );
    return [row];
  }

  const chunkComponents = chunk(components, 5);

  const actions = chunkComponents.map((component) => {
    const row = new MessageActionRow()
      .addComponents(
        component,
      );
    return row;
  });
  return actions;
}

const funcs: any = {
  async create(msg: Message) {
    const serverId = msg.guild.id;
    const em = (await orm).em.fork().getRepository(ButtonRolesEntity);
    const roles = [...msg.mentions.roles.values()];

    if (roles.length > 25) {
      return msg.reply('A maximum of 25 roles can be added to a single message.');
    }

    if (roles.length !== undefined && roles.length !== 0) {
      const rolesArr = roles.map((role: Role) => {
        const roleUuid = uuid();
        const newButtonRolesQuery = new ButtonRolesEntity();
        newButtonRolesQuery.role = role.id;
        newButtonRolesQuery.role_uuid = roleUuid;
        newButtonRolesQuery.serverid = serverId;
        em.persist(newButtonRolesQuery);
        return { id: role.id, uuid: roleUuid, name: role.name };
      });
      const embedCreation = await buttonsGenerator(rolesArr);
      const messageContent = rolesArr.map((role) => `Click ${role.name} to get <@&${role.id}> role!`);
      await msg.channel.send({ content: messageContent.join('\n'), components: embedCreation });
      return em.flush();
    }
    return msg.reply('Ping at least one role to make it accessible by button!');
  },
  async help(msg: Message) {
    const embed = new Discord.MessageEmbed()
      .setTitle('How to use k!buttonroles')
      .setDescription("Hey there, I'm KitsuneTheBot and I'm here to tell you about k!buttonroles function!")
      .addFields(
        {
          name: 'How to setup it?',
          value:
                          'Using this command is actually not that hard.\nIf you want to make some roles accessible by buttons, use:\n\n'
                          + '**k!buttonroles create @role** - This command will make message with some buttons with pinged roles\n',
        },
        {
          name: 'How to add more roles to a message?',
          value:
                          'You can do this on a creation\nIf you want to more than one button, just ping more roles:\n\n'
                          + '**k!buttonroles create @role1 @role2 @role3 @role4** - It will create message with 4 role buttons!\n',
        },
        {
          name: 'How much roles can I add to a message?',
          value:
                          '**k!buttonroles create** supports up to 25 roles in a single message!\n',
        },
        {
          name: 'How do I disable it?',
          value:
                          'Just delete the message with buttons!\n',
        },
      )
      .setFooter('KitsuneTheBot v1.0.0')
      .setColor('#ff9d5a');
    return msg.channel.send({ embeds: [embed] });
  },
};
