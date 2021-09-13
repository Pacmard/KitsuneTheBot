export interface CommandInterface {
    name: string,
    description: string,
    aliases?: Array<string>,
    usage: string,
    execute(): void,
    guildOnly?: boolean,
    permissions: string,
    args?: boolean,
}
