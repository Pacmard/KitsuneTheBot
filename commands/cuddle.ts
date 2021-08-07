import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'cuddle',
  description: 'for all ytour cuddle needs',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();
    if (!mention) {
      return msg.reply('tell me, how does it feel to cuddle air?');
    }

    if (mention.id === msg.author.id) {
      return msg.reply('just asking for a friend, how can you cuddle yourself? ^_^');
    }

    const response = await axios.request({
      method: 'GET',
      url: 'https://rra.ram.moe/i/r?type=cuddle',
    });

    const image = `https://rra.ram.moe${response.data.path}`;
    const title = `Don't be sad, I'm here to cuddle you, ${mention.username}`;
    const subtitle = `${msg.author.username} cuddles with ${mention.username}`;
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
