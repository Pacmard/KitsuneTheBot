import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'smug',
  description: 'hehehe',
  async execute(msg: Message) {
    const response = await axios.request({
      method: 'GET',
      url: 'http://localhost:3000/smug',
    });

    const image = response.data.link;
    const title = `Oh god, ${msg.author.username}!`;
    const subtitle = `${msg.author.username} did a smug! Something is about to happen!`;
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
