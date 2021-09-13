import { Message, MessageButton, MessageActionRow } from 'discord.js';

module.exports = {
  name: 'add',
  description: 'if you want this bot to join your server',
  async execute(msg: Message) {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setURL('https://bot.kitsune.su/add')
          .setLabel('Add KitsuneTheBot')
          .setStyle('LINK'),
      );
    return msg.channel.send({ content: 'Want KitsuneTheBot to join your server?\nClick button below!', components: [row] });
  },
};
