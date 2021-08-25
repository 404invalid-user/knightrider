const Server = require('../models/server');
module.exports = async(message) => {
    let currentServer = await Server.findOne({ id: message.guild.id });
    if (currentServer == null) {
        Server.create({
            id: message.guild.id,
            name: message.guild.name,
            icon: message.guild.iconURL() || 'https://knightrider.invalidlag.com/logo.png'

        });
        currentServer = await Server.findOne({ id: message.guild.id });
    };
    return currentServer;
}