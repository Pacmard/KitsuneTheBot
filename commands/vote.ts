import { Message, MessageButton, MessageActionRow } from 'discord.js';

module.exports = {
  name: 'vote',
  description: 'if you want this bot to grow',
  async execute(msg: Message) {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setURL('https://top.gg/bot/846842703794929685')
          .setLabel('Vote for KitsuneTheBot')
          .setStyle('LINK'),
      );
    return msg.channel.send({ content: 'Do you like KitsuneTheBot? If so, help us grow it - upvote the bot at top.gg!', components: [row] });
  },
};
