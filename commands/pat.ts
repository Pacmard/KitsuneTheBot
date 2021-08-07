import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'pat',
  description: 'for all ytour pat needs',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();

    if (!mention) {
      return msg.reply("you can't pat air, silly.");
    }

    if (mention.id === msg.author.id) {
      return msg.reply('how do you pat yourself? ^_^');
    }

    const response = await axios.request({
      method: 'GET',
      url: 'https://rra.ram.moe/i/r?type=pat',
    });

    const image = `https://rra.ram.moe${response.data.path}`;
    const title = `There there, ${mention.username}`;
    const subtitle = `${msg.author.username} pats ${mention.username}`;
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
