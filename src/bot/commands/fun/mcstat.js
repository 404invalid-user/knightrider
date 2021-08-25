const Discord = require('discord.js');
const util = require('minecraft-server-util');


module.exports = {
        name: 'mcstatus',
        description: "mcstat",
        execute(message, args, Discord, currentServer, messageUser, client) {


            util.status('cwh11.mc.sparks.codes' || currentServer.conf.mc)
                .then((response) => {
                        let minecraftEmbed = new Discord.MessageEmbed()
                            .setColor(conf.colour.ok)
                            .setAuthor(conf.bot.name, conf.bot.logo)
                            .setTitle('Minecraft server status')
                            .setURL('http://cwh11.mc.sparks.codes')
                            .setThumbnail(`${message.guild.iconURL() || `${conf.domain}/logo.png`}`)
                    .setDescription('its online!')
                    .addField('Server IP:', `${response.host}`)
                    .addField('Version:', `${response.version}`)
                    .addField('MOTD:', `${response.description.descriptionText}`)
                    .addFields({ name: 'Online Players', value: `${response.onlinePlayers}`, inline: true }, { name: 'Max Players', value: `${response.maxPlayers}`, inline: true }, )
                    .setTimestamp()
                    .setFooter(`Requested by ${message.member.displayName}`, `${message.author.displayAvatarURL()}`);

                message.channel.send(minecraftEmbed).catch(error => console.log('error: ' + error));

            })
            .catch((error) => {
                console.log('error: ' + error);
                message.channel.send('**there has been a error**\n this is probably because the server is down');
            });
    }
}