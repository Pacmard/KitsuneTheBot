import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'rushia',
  description: 'want some cute necromancer?',
  async execute(msg: Message) {
    const response = await axios.request({
      method: 'GET',
      url: 'http://localhost:3000/rushia',
    });

    const image = `attachment://${response.data.image}`;
    const title = 'Here, have a pic of cute anime necromancer!';
    const subtitle = `${msg.author.username} asks for some good art!`;
    const footer = `Art source: ${response.data.source}\nKitsuneTheBot v1.0.0`;
    const embedCreation = await rushiaGenerator(title, image, subtitle, footer);
    return msg.channel.send({ embeds: [embedCreation], files: [`.${response.data.path}`] });
  },
};

function rushiaGenerator(
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
