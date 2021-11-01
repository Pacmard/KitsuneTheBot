import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'fumo',
  description: 'fumo?',
  async execute(msg: Message) {
    const response = await axios.request({
      method: 'GET',
      url: 'http://localhost:3000/fumo',
    });

    const image = `attachment://${response.data.image}`;
    const title = 'fumo.';
    const subtitle = `${msg.author.username} asked for fumo!`;
    const footer = `Source: ${response.data.source}\nKitsuneTheBot v1.0.0`;
    const embedCreation = await fumoGenerator(title, image, subtitle, footer);
    return msg.channel.send({ embeds: [embedCreation], files: [`.${response.data.path}`] });
  },
};

function fumoGenerator(
  title: string,
  image: any,
  subtitle: string,
  footer: string,
) {
  const embed = new Discord.MessageEmbed()
    .setColor('#ff9d5a')
    .setTitle(title)
    .setImage(image)
    .setFooter(footer)
    .setAuthor(subtitle);
  return embed;
}
