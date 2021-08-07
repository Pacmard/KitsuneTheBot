import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'kiss',
  description: 'some cute kisses over here',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();

    if (!mention) {
      return msg.reply('kissing nothing huh? How is it? owo');
    }

    if (mention.id === msg.author.id) {
      return msg.reply('I believe it is not possible to kiss yourself, or is it? uwu');
    }

    const response = await axios.request({
      method: 'GET',
      url: 'https://rra.ram.moe/i/r?type=kiss',
    });

    const image = `https://rra.ram.moe${response.data.path}`;
    const title = `Just a kiss, don't be embarrassed, ${mention.username}`;
    const subtitle = `${msg.author.username} gave a kiss to ${mention.username}`;
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
