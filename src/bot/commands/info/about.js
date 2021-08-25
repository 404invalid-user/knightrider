const { version } = require('../../../../package.json');
const conf = require('../../../conf/conf.json')

module.exports = {
        name: 'about',
        description: "about bot",
        async execute(message, args, Discord, currentServer, messageUser, client) {
            message.channel.send(conf.domain + '/img/loading.gif').then(m => {

                        let totalSeconds = (client.uptime / 1000);
                        let days = Math.floor(totalSeconds / 86400);
                        totalSeconds %= 86400;
                        let hours = Math.floor(totalSeconds / 3600);
                        totalSeconds %= 3600;
                        let minutes = Math.floor(totalSeconds / 60);
                        let seconds = Math.floor(totalSeconds % 60);

                        let aboutEmbed = new Discord.MessageEmbed()
                            .setAuthor(conf.bot.name, `${conf.bot.logo}`, `${conf.domain}`)
                            .setDescription('everything you need to know.')
                            .setColor(conf.colour.ok)
                            .setTitle('about')
                            .setThumbnail(`${message.guild.iconURL() || `${conf.domain}/logo.png`}`)
                            .addField('Website:', `${conf.domain}`)
                            .addField('Coolness level', `epic bot for ${message.guild.name} server`)
                            .addField('Developer(s)', '<@!522534458071449620>')
                            .addField('Version', `${version}`)
                            .addField('Libary', `discord.js v12`)
                            .addField("commands sent:", `${currentServer.commandCount} commands`)
                            .addField('Bot version:', `${version}`)
                            .addField('Up Time', `${days} d, ${hours} h, ${minutes} m, ${seconds} s`)
                            .addField("Memory usage:", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / 1GB`)
                            .addField('Ping', `ping: ${m.createdTimestamp - message.createdTimestamp} api ping: ${Math.round(client.ws.ping)}`)
                            .setFooter(`Requested by ${message.member.displayName}`, `${message.author.displayAvatarURL()}`);
            m.edit(aboutEmbed).catch(error => console.log('error: ' + error));
        }).catch(error => console.log('error: ' + error))
    }
}