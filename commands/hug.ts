import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'hug',
  description: 'just a hug, right?',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();

    if (!mention) {
      return msg.reply('everyone wants to hug someone, but air? :thinking:');
    }

    if (mention.id === msg.author.id) {
      return msg.reply("don't hug yourself, ask someone for a hug instead! owo");
    }

    const response = await axios.request({
      method: 'GET',
      url: 'https://rra.ram.moe/i/r?type=hug',
    });

    const image = `https://rra.ram.moe${response.data.path}`;
    const title = `I'm here to huggle you, ${mention.username}`;
    const subtitle = `${msg.author.username} hugs ${mention.username}`;
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
