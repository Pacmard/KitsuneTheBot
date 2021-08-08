import { Message, TextChannel } from 'discord.js';
import { MikroORM } from '@mikro-orm/core';
import { ormConfig } from '../database/mikro-orm.config';
import { WelcomeMsgEntity } from '../database/entities';

const Discord = require('discord.js');

const orm = MikroORM.init(ormConfig);

module.exports = {
  name: 'welcome',
  description: 'if you want to welcome people',
  // eslint-disable-next-line consistent-return
  async execute(msg: Message) {
    const perms = (msg.channel as TextChannel).permissionsFor(msg.member);
    if (perms.has('ADMINISTRATOR')) {
      const options = ['enable', 'changechannel', 'disable', 'setimage', 'settext', 'help'];
      const message = msg.content;
      const test = message.replace('k!welcome ', '').split(' ');
      const setting = test.shift();
      if (options.includes(setting)) {
        return funcs[setting](msg);
      }
      // eslint-disable-next-line max-len
      // msg.reply('Укажите команду для которой надо настроить права, список команд и их триггеры можете получить используя команду !triggers') TODO
    } else return msg.reply('You don\'t have admin permissions to manage welcome message!');
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

function isURL(str: string) {
  const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
        + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
        + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
        + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
        + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
        + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

const funcs: any = {
  async enable(msg: Message) {
    const serverId = msg.guild.id;
    const welcomeChannel = msg.channel.id;
    const em = (await orm).em.fork().getRepository(WelcomeMsgEntity);
    const isEnabled = await em.findOne({
      serverid: serverId,
    });
    if (!isEnabled) {
      const removingCmdsVars = msg.content.replace('k!welcome', '');
      const params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
      const paramsSplit = params.split(' ');
      if (paramsSplit[1] !== undefined && paramsSplit[1].toLowerCase() === 'confirm') {
        const newWelcomeQuery = new WelcomeMsgEntity();
        newWelcomeQuery.serverid = serverId;
        newWelcomeQuery.welcomechannel = welcomeChannel;
        newWelcomeQuery.text = 'Welcome to the server! We hope you will like it and stay with us!';
        newWelcomeQuery.image = 'https://media1.tenor.com/images/a1e2967207391a46b54097b2abde78e4/tenor.gif?itemid=16415258';
        await em.persistAndFlush(newWelcomeQuery);
        const image = 'https://media1.tenor.com/images/5e399a4b721b3714ef77177ce2d8d3da/tenor.gif?itemid=16102764';
        const title = 'Okie, sir! Welcome message enabled!';
        const subtitle = `${msg.author.username} enables welcome message!`;
        const embedCreation = await embedGenerator(title, image, subtitle);
        return msg.channel.send({ embeds: [embedCreation] });
      }
      return msg.reply('Are you sure you want to enable welcome message?\nWelcome message will be sent to the channel where command was used!\nIf you are sure: use the `k!welcome enable confirm` command in the correct channel!');
    }
    return msg.reply('Welcome message already enabled in this server! If you want to change channel for it, use `k!welcome changechannel` command, or `k!welcome disable` to disable it!');
  },
  async setimage(msg: Message) {
    const serverId = msg.guild.id;
    const em = (await orm).em.fork().getRepository(WelcomeMsgEntity);
    const isEnabled = await em.findOne({
      serverid: serverId,
    });
    if (isEnabled) {
      const removingCmdsVars = msg.content.replace('k!welcome', '');
      const params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
      const paramsSplit = params.split(' ');
      if (paramsSplit[1] !== undefined && isURL(paramsSplit[1])) {
        // eslint-disable-next-line prefer-destructuring
        isEnabled.image = paramsSplit[1];
        await em.persistAndFlush(isEnabled);
        const image = 'https://media1.tenor.com/images/13d12906ab6c24e688a1144f85199e98/tenor.gif?itemid=10627589';
        const title = 'Got it, changing image!';
        const subtitle = `${msg.author.username} changes welcoming message image!`;
        const embedCreation = await embedGenerator(title, image, subtitle);
        return msg.channel.send({ embeds: [embedCreation] });
      }
      return msg.reply('Please, specify image for welcome message!\nExample: `k!welcome setimage https://vk.cc/c1iw9p`\n(Should be URL, gifs also allowed)');
    }
    return msg.reply('Welcome message is not enabled in this server! If you want to enable it, use `k!welcome enable` command!');
  },
  async settext(msg: Message) {
    const serverId = msg.guild.id;
    const em = (await orm).em.fork().getRepository(WelcomeMsgEntity);
    const isEnabled = await em.findOne({
      serverid: serverId,
    });
    if (isEnabled) {
      const removingCmdsVars = msg.content.replace('k!welcome', '');
      const params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
      const paramsSplit = params.split(' ');
      if (paramsSplit[1] !== undefined) {
        paramsSplit.shift();
        const welcomeText = paramsSplit.join(' ');
        isEnabled.text = welcomeText;
        await em.persistAndFlush(isEnabled);
        const image = 'https://media1.tenor.com/images/13d12906ab6c24e688a1144f85199e98/tenor.gif?itemid=10627589';
        const title = 'Got it, changing text!';
        const subtitle = `${msg.author.username} changes welcome message text!`;
        const embedCreation = await embedGenerator(title, image, subtitle);
        return msg.channel.send({ embeds: [embedCreation] });
      }
      return msg.reply('Please, specify text for welcome message!');
    }
    return msg.reply('Welcome message is not enabled in this server! If you want to enable it, use `k!welcome enable` command!');
  },
  async changechannel(msg: Message) {
    const serverId = msg.guild.id;
    const em = (await orm).em.fork().getRepository(WelcomeMsgEntity);
    const isEnabled = await em.findOne({
      serverid: serverId,
    });
    if (isEnabled) {
      if (isEnabled.welcomechannel !== msg.channel.id) {
        const removingCmdsVars = msg.content.replace('k!welcome', '');
        const params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
        const paramsSplit = params.split(' ');

        if (paramsSplit[1] !== undefined && paramsSplit[1].toLowerCase() === 'confirm') {
          isEnabled.welcomechannel = msg.channel.id;
          await em.persistAndFlush(isEnabled);
          const image = 'https://media1.tenor.com/images/13d12906ab6c24e688a1144f85199e98/tenor.gif?itemid=10627589';
          const title = 'Got it, changing my location!';
          const subtitle = `${msg.author.username} changes welcome message channel!`;
          const embedCreation = await embedGenerator(title, image, subtitle);
          return msg.channel.send({ embeds: [embedCreation] });
        }
        return msg.reply('Are you sure you want to change welcome message channel?\nWelcome message will be sent into this channel!\nIf you are sure: use the `k!welcome changechannel confirm` command!');
      }
      return msg.reply('I\'m already sending welcome message to this channel! If you want me to change it, use this command in another channel!');
    }
    return msg.reply('Welcome message is not enabled in this server! If you want to enable it, use `k!welcome enable` command!');
  },
  async disable(msg: Message) {
    const serverId = msg.guild.id;
    const em = (await orm).em.fork().getRepository(WelcomeMsgEntity);
    const isEnabled = await em.findOne({
      serverid: serverId,
    });
    if (isEnabled) {
      const removingCmdsVars = msg.content.replace('k!welcome', '');
      const params = removingCmdsVars.trimStart().replace(/ +(?= )/g, '');
      const paramsSplit = params.split(' ');

      if (paramsSplit[1] !== undefined && paramsSplit[1].toLowerCase() === 'confirm') {
        await em.remove(isEnabled).flush();
        const image = 'https://media1.tenor.com/images/a892784674818166e8a83c74e5a54a49/tenor.gif?itemid=16249499';
        const title = 'It makes me sad, but welcome message is disabled now.';
        const subtitle = `${msg.author.username} disables welcome message!`;
        const embedCreation = await embedGenerator(title, image, subtitle);
        return msg.channel.send({ embeds: [embedCreation] });
      }
      return msg.reply('Are you sure you want to disable welcome message?\nWelcome message will not be sent anymore!\nIf you are sure: use the `k!welcome disable confirm` command!');
    }
    return msg.reply('Welcome message is not enabled in this server! If you want to enable it, use `k!welcome enable` command!');
  },
  async help(msg: Message) {
    const embed = new Discord.MessageEmbed()
      .setTitle('How to use k!welcome')
      .setDescription("Hey there, I'm KitsuneTheBot and I'm here to tell you about k!welcome function!")
      .addFields(
        {
          name: 'How to setup it?',
          value:
                          'Using this command is actually not that hard.\nIf you want to enable welcome message, use:\n\n'
                          + '**k!welcome enable** - This command will make bot send welcome message in channel where it was used\n',
        },
        {
          name: 'How do I change text and image?',
          value:
                          '**k!welcome setimage `url`** - Set your own image or gif!\n'
                          + '**k!welcome settext `text`** - Set your own text into welcome message!\n',
        },
        {
          name: 'How do I change channel for those greetings?',
          value:
                          '**k!welcome changechannel** - Change channel for welcome message!\n',
        },
        {
          name: 'How do I disable it?',
          value:
                          '**k!welcome disable** - Disable welcome message!\n',
        },
      )
      .setFooter('KitsuneTheBot v0.0.1')
      .setColor('#ff9d5a');
    return msg.channel.send({ embeds: [embed] });
  },
};
