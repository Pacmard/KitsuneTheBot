import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'senko',
  description: 'this fox is way too cute',
  async execute(msg: Message) {
    const response = await axios.request({
      method: 'GET',
      url: 'http://localhost:3000/senko',
    });

    const attachment = new Discord.MessageAttachment(`${response.data.path}`, `${response.data.image}`);
    const image = `attachment://${response.data.image}`;
    const title = 'Here, have some cute fox!';
    const subtitle = `${msg.author.username} asks for Senko image!`;
    const footer = `Art source: ${response.data.source}\nKitsuneTheBot v0.0.1`;
    const embedCreation = await senkoGenerator(title, image, subtitle, attachment, footer);
    return msg.channel.send({ embeds: [embedCreation] });
  },
};

function senkoGenerator(
  title: string,
  image: any,
  subtitle: string,
  attachment: any,
  footer: string,
) {
  const embed = new Discord.MessageEmbed()
    .setColor('#ff9d5a')
    .setTitle(title)
    .setImage(image)
    .setFooter(footer)
    .attachFiles(attachment)
    .setAuthor(subtitle);
  return embed;
}
