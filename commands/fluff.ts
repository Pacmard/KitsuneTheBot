import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'fluff',
  description: 'these tails are OP!',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();

    if (!mention) {
      return msg.reply('Is air really that fluffy?');
    }

    if (mention.id === msg.author.id) {
      return msg.reply('How does it feel to fluff youself?');
    }

    const response = await axios.request({
      method: 'GET',
      url: 'http://localhost:3000/fluff',
    });

    const image = response.data.link;
    const title = `Sorry, you will be fluffed ${mention.username}!`;
    const subtitle = `${msg.author.username} fluffs ${mention.username} tail!`;
    const embedCreation = await embedGenerator(title, image, subtitle);
    return msg.channel.send({ embeds: [embedCreation] });
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
