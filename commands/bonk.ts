import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'bonk',
  description: 'if this going way too far',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();

    if (!mention) {
      return msg.reply("You can't bonk air, dummy.");
    }

    if (mention.id === msg.author.id) {
      return msg.reply('Why would you bonk yourself?');
    }

    const response = await axios.request({
      method: 'GET',
      url: 'http://localhost:3000/bonk',
    });

    const image = `attachment://${response.data.image}`;
    const title = `Hey! ${mention.username}! You'll get bonked!`;
    const subtitle = `${msg.author.username} bonks ${mention.username}!`;
    const embedCreation = await bonkGenerator(title, image, subtitle);
    return msg.channel.send({ embeds: [embedCreation], files: [`.${response.data.path}`] });
  },
};

function bonkGenerator(title: string, image: string, subtitle: string) {
  const embed = new Discord.MessageEmbed()
    .setColor('#ff9d5a')
    .setTitle(title)
    .setImage(image)
    .setFooter('KitsuneTheBot v1.0.0')
    .setAuthor(subtitle);
  return embed;
}
