import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'tickle',
  description: 'tickle them all!',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();

    if (!mention) {
      return msg.reply("you can't tickle air, at least I think so.");
    }

    if (mention.id === msg.author.id) {
      return msg.reply("it's not the same as if someone else were to tickle ya.");
    }

    const response = await axios.request({
      method: 'GET',
      url: 'https://rra.ram.moe/i/r?type=tickle',
    });

    const image = `https://rra.ram.moe${response.data.path}`;
    const title = `I'm gonna tickle you, ${mention.username}`;
    const subtitle = `${msg.author.username} tickles ${mention.username}`;
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
