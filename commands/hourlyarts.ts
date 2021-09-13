import { Message } from 'discord.js';

const Discord = require('discord.js');

module.exports = {
  name: 'hourlyarts',
  description: 'if you want to learn more about hourly arts',
  async execute(msg: Message) {
    const embed = new Discord.MessageEmbed()
      .setTitle('Help')
      .setDescription("Hey there, I'm KitsuneTheBot and I'm here to pamper you!")
      .addFields(
        {
          name: 'What is "houly arts" function?',
          value:
                'It is pretty cool and unique feature that our bot has!\n'
                + 'After you enable it, SFW arts will be sent in a specified channel every hour!\n'
                + 'Keep in mind - they are **TOTALLY** SFW because we choose and queue them **MANUALLY**!\n'
                + 'Therefore, our team taking a break sometimes to make bigger queue for upcoming days or get best arts!\n',
        },
        {
          name: 'WOW! How do I enable it?',
          value:
                'Simple as well! Use ``k!enablearts`` command and arts will be enabled!\n'
                + 'Also, keep in mind that bot sends one art **EVERY HOUR** and could spam chat.\n'
                + 'It is **HIGHLY** recommended to have a separate channel for this function!\n',
        },
        {
          name: 'What if I want to disable it?',
          value:
                'This command similar to previous one - it is pretty simple!\n'
                + 'If you want to disable arts - use ``k!disablearts`` command!\n'
                + 'This command will delete webhook we created for arts and stop the bot from sending arts to your channel!\n\n',
        },
        {
          name: 'Other Notices',
          value:
                'Most of arts are sourced in the footer of the embed.\n'
                + 'Arts are chosen **manually**, so they are SFW, but it also means that we will take breaks sometimes\n'
                + 'For copyright claims email support@kitsune.su\n',
        },
      )
      .setFooter('KitsuneTheBot v0.0.1')
      .setColor('#ff9d5a');
    msg.channel.send({ embeds: [embed] });
  },
};
