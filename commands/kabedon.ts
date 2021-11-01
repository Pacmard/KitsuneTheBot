import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'kabedon',
  description: 'oya oya',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();

    if (!mention) {
      return msg.reply('pls dont kabegon air, its painful to fall');
    }

    if (mention.id === msg.author.id) {
      return msg.reply('How do you even kabedon yourself?');
    }

    const response = await axios.request({
      method: 'GET',
      url: 'http://localhost:3000/kabedon',
    });

    const image = response.data.link;
    const title = `Oya oya, ${mention.username}`;
    const subtitle = `${msg.author.username} kabedons ${mention.username}`;
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
