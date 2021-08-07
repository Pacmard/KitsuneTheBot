import { Message } from 'discord.js';

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
  name: 'lick',
  description: 'lick them! do it!',
  async execute(msg: Message) {
    const mention = msg.mentions.users.first();

    if (!mention) {
      return msg.reply("you can't lick air, at least I think so.");
    }

    if (mention.id === msg.author.id) {
      return msg.reply('How is it feel to lick yourself?');
    }

    const response = await axios.request({
      method: 'GET',
      url: 'http://localhost:3000/lick',
    });

    const image = response.data.link;
    const title = `Get prepared for a lick, ${mention.username}`;
    const subtitle = `${msg.author.username} licks ${mention.username}`;
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
