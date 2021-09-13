import { Message } from 'discord.js';

const Discord = require('discord.js');

module.exports = {
  name: 'help',
  description: 'at your service!',
  async execute(msg: Message) {
    const embed = new Discord.MessageEmbed()
      .setTitle('Help')
      .setDescription("Hey there, I'm KitsuneTheBot and I'm here to pamper you!")
      .addFields(
        {
          name: 'Image Commands',
          value:
                '**k!pat @mention** - Pat someone, everyone likes pats ^_^\n'
                + '**k!cuddle @mention** - Cuddle, how cute. uwu\n'
                + '**k!hug @mention** - Friendly hug from a friend. owo\n'
                + '**k!kiss @mention** - Just a cute kiss\n'
                + '**k!slap @mention** - Slap slap, how dare you!\n'
                + '**k!tickle @mention** - Tickle someone, and they can tickle you too\n'
                + '**k!lick @mention** - Lick them all!\n'
                + '**k!fluff @mention** - What a fluffy tail!\n'
                + '**k!bite @mention** - When lick is not enough!\n'
                + '**k!bonk @mention** - Bonk them all!\n'
                + '**k!senko** - When you need your dose of Senko!\n',
        },
        {
          name: 'Mod commands',
          value:
                '**k!ban @mention `reason`** - Ban someone, rules are important!\n'
                + '**k!kick @mention `reason`** - Kick someone, if you think he needs to get out!\n'
                + "**k!mute @mention `time` `reason`** - Don't let spammers do spam!\n*time in hours, should be less than 48.\n"
                + '**k!unmute @mention** - If you need to let someone talk again!\n'
                + '**k!checkuser @mention** - If you need to find out important information about the user!\n',
        },
        {
          name: 'Logs commands',
          value:
                '**k!enablelogs** - Enable message actions logging!\n'
                + '**k!disablelogs** - Disable message actions logging!\n'
                + '**k!changelogs** - Change channel for message actions logs!\n\n'
                + '**k!enableleave** - Enable server leave logging!\n'
                + '**k!disableleave** - Disable server leave logging!\n'
                + '**k!changeleave** - Change channel for server leave logs!\n\n'
                + '**k!enablejoin** - Enable server join logging!\n'
                + '**k!disablejoin** - Disable server join logging!\n'
                + '**k!changejoin** - Change channel for server join logs!\n',
        },
        {
          name: 'Other Commands',
          value:
                '**k!welcome help** - Guide for setting up welcome message\n'
                + '**k!buttonroles help** -  Guide for setting up button roles\n'
                + '**k!hourlyarts** - Learn more about our hourly arts\n'
                + '**k!help** - Show help\n'
                + '**k!add** - If you want to add this bot to your server\n',
        },
      )
      .setFooter('KitsuneTheBot v0.0.1')
      .setColor('#ff9d5a');
    msg.channel.send({ embeds: [embed] });
  },
};
