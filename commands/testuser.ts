import { Message } from 'discord.js';

module.exports = {
  name: 'testuser',
  description: 'for all ytour pat needs',
  async execute(msg: Message) {
    const user = msg.guild.members.resolve(msg.author.id);
    return console.log(user.roles.cache.map((role) => role.id));
  },
};
