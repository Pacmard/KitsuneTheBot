import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'slap',
  description: 'if someone needs to be slapped',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();

    if (!mention) {
      return msg.reply('why would you slap air? What did it do to you?');
    }

    if (mention.id === msg.author.id) {
      return msg.reply("don't slap yourself, it's fine.");
    }

    const response = await axios.request({
      method: 'GET',
      url: 'https://rra.ram.moe/i/r?type=slap',
    });

    const image = `https://rra.ram.moe${response.data.path}`;
    const title = `How dare you, ${mention.username}`;
    const subtitle = `${msg.author.username} slapped ${mention.username}`;
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
