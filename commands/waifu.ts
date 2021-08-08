import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'waifu',
  description: 'i think you maybe need some cute arts?',
  async execute(msg: Message) {
    const response = await axios.request({
      method: 'GET',
      url: 'http://localhost:3000/waifu',
    });

    const image = `attachment://${response.data.image}`;
    const title = 'Here, have a pic of cute anime girl!';
    const subtitle = `${msg.author.username} asks for some good art!`;
    const footer = `Art source: ${response.data.source}\nKitsuneTheBot v0.0.1`;
    const embedCreation = await waifuGenerator(title, image, subtitle, footer);
    return msg.channel.send({ embeds: [embedCreation], files: [`${response.data.path}`] });
  },
};

function waifuGenerator(
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
