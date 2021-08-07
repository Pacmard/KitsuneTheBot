import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'bite',
  description: 'how yummy are they?',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();

    if (!mention) {
      return msg.reply('How does air taste? Tell me!');
    }

    if (mention.id === msg.author.id) {
      return msg.reply('Why would you bite yourself?');
    }

    const response = await axios.request({
      method: 'GET',
      url: 'http://localhost:3000/bite',
    });

    const image = response.data.link;
    const title = `Just a little bite, ${mention.username}, it shouldn't hurt!`;
    const subtitle = `${msg.author.username} bites ${mention.username}`;
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
