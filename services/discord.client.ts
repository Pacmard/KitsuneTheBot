import Discord from "discord.js";
import { CommandInterface } from "../interfaces";
import * as fs from 'fs'
export class DiscordManager {
    client: Discord.Client;
    commands?: Discord.Collection<string, CommandInterface>;
    constructor() {
        this.client = new Discord.Client();
        this.commands = new Discord.Collection();
    }

    public async subCommands() {
        const commandFiles = fs.readdirSync('./commands').filter((file: any) => file.endsWith('.ts'));
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);

            this.commands.set(command.name, command);
        }
    }
}