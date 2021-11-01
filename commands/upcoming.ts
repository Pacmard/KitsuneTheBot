import { Message } from 'discord.js';

const Discord = require('discord.js');

module.exports = {
  name: 'upcoming',
  description: 'at your service!',
  async execute(msg: Message) {
    const embed = new Discord.MessageEmbed()
      .setTitle('Upcoming features')
      .setDescription("Hey there, I'm KitsuneTheBot and I'm growing time to time!")
      .addFields(
        {
          name: 'Image Commands',
          value:
                '**k!pout** - If you got upset about something\n'
                + '**k!shrug** - If you dunno\n'
                + '**k!think** - For your forgor situations\n',
        },
        {
          name: 'Mod commands',
          value:
                '**k!banlist** - Shows list of banned users - not approved yet.\n'
                + '**k!mutelist** - list of current mutes on a server `made with KitsuneTheBot`.\n'
                + '**k!checkhistory @mention** - Shows history of punishments made for mentioned user.\n'
                + '**k!warn @mention `reason`** - Adds a warn to a user. 3 warns will lead to 24h mute.\n'
                + '**k!unwarn @mention** - If you need to delete a warn from a user.\n',
        },
        {
          name: 'Other Commands',
          value:
                '**Leveling system** - Very strong and beatiful XP system\n'
                + '**k!remindme** -  Setup a reminder to do something\n'
                + '**k!poll** - Democracy.. I see..\n'
                + '**k!quote** - Quotes system\n'
                + '**k!ship** - Making some new couples on a server ;)\n',
        },
      )
      .setFooter('KitsuneTheBot v1.0.0')
      .setColor('#ff9d5a');
    msg.channel.send({ embeds: [embed] });
  },
};
