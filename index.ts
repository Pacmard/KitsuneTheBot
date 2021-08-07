/* eslint-disable import/no-dynamic-require */
import { MikroORM } from '@mikro-orm/core';
import {
  Guild, GuildMember, Message, Role, TextChannel,
} from 'discord.js';
import { Collection } from '@discordjs/collection';
import {
  JoinLogEntity, MuteEntity, UserInfoEntity, MsgLogsEntity, LeaveLogEntity, WelcomeMsgEntity,
} from './database/entities';
import { ormConfig } from './database/mikro-orm.config';
import {
  prefix, token, topggToken, redisUrl,
} from './config.json';

const orm = MikroORM.init(ormConfig);
const fs = require('fs');
const Discord = require('discord.js');
const { Intents } = require('discord.js');

const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ['GUILD_MEMBER'], fetchAllMembers: true });
const moment = require('moment');
const redis = require('redis');
const Topgg = require('@top-gg/sdk');

const api = new Topgg.Api(topggToken);

const redisClient = redis.createClient(redisUrl);

redisClient.on('error', (error: any) => {
  console.error(error);
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter((file: any) => file.endsWith('.ts'));
commandFiles.forEach((file: any) => {
  // eslint-disable-next-line global-require
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
});

client.on('ready', async () => {
  client.user.setActivity('Use k!help to see all commands!');

  console.log(`Logged in as ${client.user.tag}!`);
  const em = (await orm).em.fork().getRepository(MuteEntity);
  const dateNow = Date.now() / 1000 | 0;
  const mutedUsers = await em.find({
    unmute_time: {
      $gte: dateNow,
    },
    is_unmuted: 0,
  });

  if (mutedUsers) {
    mutedUsers.forEach(async (userTimed) => {
      const rawTimeout = userTimed.unmute_time * 1000;
      const timeTimeout = rawTimeout - (dateNow * 1000);
      const guildCheck = client.guilds.cache.get(userTimed.server_id);
      if (!guildCheck) return;
      const mutedUser = await guildCheck.members.fetch(userTimed.userid);
      const role = guildCheck.roles.cache.find((r: Role) => r.name === 'Muted_Kitsune');
      const rolesOld = JSON.parse(userTimed.roles);
      setTimeout(async () => {
        const isMutedNow = await em.findOne({
          userid: userTimed.userid,
          server_id: userTimed.server_id,
          is_unmuted: 0,
        });
        if (isMutedNow) {
          isMutedNow.is_unmuted = 1;
          await em.persistAndFlush(isMutedNow);
          if (rolesOld.length >= 1) {
            await mutedUser.roles.add(rolesOld).catch(console.error);
            mutedUser.roles.remove(role.id).catch(console.error);
          } else {
            mutedUser.roles.remove(role.id).catch(console.error);
          }
        }
      }, timeTimeout);
    });
  }

  /*
    redisClient.set("serversAmount", client.guilds.cache.size, redis.print);
    api.postStats({
        serverCount: client.guilds.cache.size
    })
    console.log('Posted latest stat on top.gg')
    */
});

client.on('messageCreate', (msg: Message) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply('there was an error trying to execute that command!');
  }
});

client.on('guildCreate', async (guild: Guild) => {
  let role: Role;
  await guild.roles.create({
    name: 'Muted_Kitsune',
    color: 'DEFAULT',
    reason: 'Role for k!tempmute command',
  }).then(async (res) => {
    role = await guild.roles.cache.get(res.id);
    role.setPermissions(BigInt(0));
  });

  guild.channels.cache.forEach((channelA) => {
    if (channelA.type === 'GUILD_TEXT') {
      channelA.permissionOverwrites.create(role, { SEND_MESSAGES: false });
    } else if (channelA.type === 'GUILD_VOICE') {
      channelA.permissionOverwrites.create(role, { CONNECT: false });
    }
  });

  const membersArr = await guild.members.fetch();
  const em = (await orm).em.fork().getRepository(UserInfoEntity);

  await Promise.all(membersArr.map(async (member) => {
    const isAlreadyHere = await em.findOne({
      userid: member.user.id,
      serverid: member.guild.id,
    });

    if (!isAlreadyHere) {
      const joinedUnix = member.joinedTimestamp / 1000 | 0;
      console.log(member.roles);
      const userRoles = JSON.stringify(member.roles);
      const newUserQuery = new UserInfoEntity();
      newUserQuery.userid = member.user.id;
      newUserQuery.serverid = member.guild.id;
      newUserQuery.joinTimestamp = joinedUnix;
      newUserQuery.roles = userRoles;
      em.persist(newUserQuery);
    } else {
      updateRoles(member);
    }
  }));
  await em.flush();
});

client.on('messageDelete', async (msg: Message) => {
  const em = (await orm).em.fork().getRepository(MsgLogsEntity);
  const areLogsEnabled = await em.findOne({
    serverid: msg.guild.id,
  });

  if ((areLogsEnabled) && (msg.author.id !== '823948446758338572') && (msg.author.bot === false)) {
    const channel = client.channels.cache.get(areLogsEnabled.logschannel);
    let descriprion;
    const subtitle = `${msg.author.username}#${msg.author.discriminator} deleted message in #${(msg.channel as TextChannel).name}`;
    const avatar = msg.author.avatarURL();
    const dateNow = new Date();
    const time = `${(dateNow.getHours()).toString().padStart(2, '0')}:${(dateNow.getMinutes()).toString().padStart(2, '0')}:${(dateNow.getSeconds()).toString().padStart(2, '0')}`;
    const footer = `User ID:${msg.author.id} • Today at: ${time}`;
    const attachments = Array.from(msg.attachments);
    if (attachments.length >= 1) {
      const tempArr: Array<string> = [];
      attachments.forEach((attachment) => {
        tempArr.push(attachment[1].proxyURL);
      });
      descriprion = `${msg.content}\n${tempArr.join('\n')}`;
    } else {
      descriprion = `${msg.content}`;
    }

    const embedCreation = await deletionGenerator(descriprion, subtitle, footer, avatar);
    channel.send({ embeds: [embedCreation] });
  }
});

client.on('messageUpdate', async (oldMessage: Message, newMessage: Message) => {
  const em = (await orm).em.fork().getRepository(MsgLogsEntity);
  const areLogsEnabled = await em.findOne({
    serverid: newMessage.guild.id,
  });

  if ((areLogsEnabled) && (newMessage.author.id !== '823948446758338572') && (newMessage.author.bot === false) && (newMessage.content !== oldMessage.content)) {
    const channel = client.channels.cache.get(areLogsEnabled.logschannel);
    const descriprion = `Before: ${oldMessage.content}\nAfter: ${newMessage.content}`;
    const subtitle = `${newMessage.author.username}#${newMessage.author.discriminator} edited message in #${(newMessage.channel as TextChannel).name}`;
    const avatar = newMessage.author.avatarURL();
    const dateNow = new Date();
    const time = `${(dateNow.getHours()).toString().padStart(2, '0')}:${(dateNow.getMinutes()).toString().padStart(2, '0')}:${(dateNow.getSeconds()).toString().padStart(2, '0')}`;
    const footer = `User ID:${newMessage.author.id} • Today at: ${time}`;
    const embedCreation = await deletionGenerator(descriprion, subtitle, footer, avatar);
    channel.send({ embeds: [embedCreation] });
  }
});

client.on('guildMemberRemove', async (member: GuildMember) => {
  const em = (await orm).em.fork().getRepository(LeaveLogEntity);
  const areLogsEnabled = await em.findOne({
    serverid: member.guild.id,
  });

  if (areLogsEnabled) {
    const userEm = (await orm).em.fork().getRepository(UserInfoEntity);
    const userInfo = await userEm.findOne({
      userid: member.user.id,
      serverid: member.guild.id,
    });

    const channel = client.channels.cache.get(areLogsEnabled.logschannel);
    const datejoined = userInfo.joinTimestamp;
    const dateNow = new Date();
    const wasOnServer = moment.unix(datejoined).fromNow();
    const userRolesLeft = JSON.parse(userInfo.roles);
    const desc = `${member.user} Joined: ${wasOnServer}\nRoles: ${userRolesLeft.map((item: any) => `<@&${item}>`).join(', ')}`;
    const subtitle = `${member.user.username}#${member.user.discriminator} left the server.`;
    const avatar = member.user.avatarURL();
    const time = `${(dateNow.getHours()).toString().padStart(2, '0')}:${(dateNow.getMinutes()).toString().padStart(2, '0')}:${(dateNow.getSeconds()).toString().padStart(2, '0')}`;
    const footer = `User ID:${member.user.id} • Today at: ${time}`;
    const embedCreation = await leaveEmbedGenerator(subtitle, footer, avatar, desc);
    channel.send({ embeds: [embedCreation] });
  }
});

client.on('guildMemberAdd', async (member: GuildMember) => {
  const usersEm = (await orm).em.fork().getRepository(UserInfoEntity);
  const isUserExists = await usersEm.findOne({
    userid: member.user.id,
    serverid: member.guild.id,
  });

  if (!isUserExists) {
    const joinedUnix = member.joinedTimestamp / 1000 | 0;
    const userRoles = JSON.stringify(member.roles);
    const newUserQuery = new UserInfoEntity();
    newUserQuery.userid = member.user.id;
    newUserQuery.serverid = member.guild.id;
    newUserQuery.joinTimestamp = joinedUnix;
    newUserQuery.roles = userRoles;
    await usersEm.persistAndFlush(newUserQuery);
  } else {
    const dateNow = Date.now() / 1000 | 0;
    isUserExists.joinTimestamp = dateNow;
    await usersEm.persistAndFlush(isUserExists);
    const giveRolesBack = JSON.parse(isUserExists.roles);
    member.roles.add(giveRolesBack).catch(console.error);
  }

  const logsEm = (await orm).em.fork().getRepository(JoinLogEntity);
  const areLogsEnabled = await logsEm.findOne({
    serverid: member.guild.id,
  });

  if (areLogsEnabled) {
    const channel = client.channels.cache.get(areLogsEnabled.logschannel);
    const dateNow = new Date();
    const time = `${(dateNow.getHours()).toString().padStart(2, '0')}:${(dateNow.getMinutes()).toString().padStart(2, '0')}:${(dateNow.getSeconds()).toString().padStart(2, '0')}`;
    const subtitle = `${member.user.username}#${member.user.discriminator} joined the server.`;
    const avatar = member.user.avatarURL();
    const footer = `User ID:${member.user.id} • Today at: ${time}`;
    const desc = `Created at ${member.user.createdAt}`;
    const embedCreation = await joinEmbedGenerator(subtitle, footer, avatar, desc);
    channel.send({ embeds: [embedCreation] });
  }

  const welcomeEm = (await orm).em.fork().getRepository(WelcomeMsgEntity);
  const isWelcomingEnabled = await welcomeEm.findOne({
    serverid: member.guild.id,
  });

  if (isWelcomingEnabled) {
    const channel = client.channels.cache.get(isWelcomingEnabled.welcomechannel);
    const title = `Welcome to the ${member.guild.name} server!`;
    const desc = `${isWelcomingEnabled.text}`;
    const image = `${isWelcomingEnabled.image}`;
    const embedCreation = await welcomeEmbedGenerator(title, image, desc);
    channel.send({
      content: `${member.user} has joined the server!`,
      embeds: [embedCreation],
    });
  }
});

client.on('guildMemberUpdate', (oldMember: GuildMember, newMember: GuildMember) => {
  oldMember.roles.cache.forEach((role: Role) => {
    if (!newMember.roles.cache.has(role.id)) {
      updateRoles(newMember);
    }
  }); // check if role removed

  newMember.roles.cache.forEach((role: Role) => {
    if (!oldMember.roles.cache.has(role.id)) {
      updateRoles(newMember);
    }
  }); // check if role removed
});

client.login(token);

function deletionGenerator(descriprion: string, subtitle: string, footer: string, avatar: string) {
  const embed = new Discord.MessageEmbed()
    .setColor('#ff9d5a')
    .setDescription(`${descriprion}`)
    .setFooter(footer)
    .setAuthor(subtitle, avatar);
  return embed;
}

function leaveEmbedGenerator(subtitle: string, footer: string, avatar: string, desc: string) {
  const embed = new Discord.MessageEmbed()
    .setColor('#ff9d5a')
    .setDescription(desc)
    .setFooter(footer)
    .setAuthor(subtitle, avatar);
  return embed;
}

function joinEmbedGenerator(subtitle: string, footer: string, avatar: string, desc: string) {
  const embed = new Discord.MessageEmbed()
    .setColor('#ff9d5a')
    .setDescription(desc)
    .setFooter(footer)
    .setAuthor(subtitle, avatar);
  return embed;
}

function welcomeEmbedGenerator(title: string, image: string, desc: string) {
  const embed = new Discord.MessageEmbed()
    .setColor('#ff9d5a')
    .setTitle(`${title}`)
    .setImage(image)
    .setDescription(desc);
  return embed;
}

async function updateRoles(newMember: GuildMember) {
  const usersEm = (await orm).em.fork().getRepository(UserInfoEntity);
  const isUserExists = await usersEm.findOne({
    userid: newMember.user.id,
    serverid: newMember.guild.id,
  });

  if (isUserExists) {
    const newRoles = JSON.stringify(newMember.roles);
    isUserExists.roles = newRoles;
    usersEm.persistAndFlush(isUserExists);
  }
}
/*
setInterval(() => {
    api.postStats({
        serverCount: client.guilds.cache.size
    })

    redisClient.set("serversAmount", client.guilds.cache.size);
}, 10000)

setInterval(() => {
    api.postStats({
        serverCount: client.guilds.cache.size
    })
}, 30000)
*/
