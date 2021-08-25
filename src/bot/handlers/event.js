const chalk = require('chalk');
const { readdirSync } = require("fs");
const Discord = require('discord.js');
module.exports = (client) => {
    const eventFiles = readdirSync(__dirname + '/../events/').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(__dirname + `/../events/${file}`);
        client.on(event.name, async(...args) => event.exe(client, Discord, ...args));
    };
}