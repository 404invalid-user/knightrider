/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
const chalk = require('chalk')
const { readdirSync } = require('fs')
const Discord = require('discord.js')
module.exports = (client, webServer) => {

    client.commands = new Discord.Collection();
    client.addons = [];
    const handlers = readdirSync(__dirname + '/../bot/handlers/').filter((file) => file.endsWith(".js"));
    for (let handler of handlers) {
        require(`../bot/handlers/${handler}`)(client);
    }

    try {
        client.login(require('../conf/tokens').bot.token);
    } catch (error) {
        console.log(chalk.blue('[bot]: ') + chalk.red('(error): ') + "cant login error: " + error);

    }
}