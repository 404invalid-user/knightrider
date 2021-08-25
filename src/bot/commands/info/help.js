const conf = require('../../../conf/conf.json')
module.exports = {
        name: 'help',
        description: "help command",
        execute(message, args, Discord, currentServer, messageUser, client) {


            if (args[1] == 'embed') {
                let helpSomethingEmbed = new Discord.MessageEmbed()
                    .setAuthor(conf.bot.name, conf.bot.logo)
                    .setColor('#10FF00')
                    .setTitle('Help embed')
                    .setDescription('**For mods and admins only**\nLet’s mods and admin make a custom embed.')
                    .addField('Command structure', `${currentServer.prefix}embed [title] [description] [colour]`)
                    .addField('Command example', `${currentServer.prefix}embed [bruv is awesome] [just joking you are] [#FF0000]`)
                    .addField('Extra info', `To get the # colour code(s) [click here](https://htmlcolorcodes.com/)`)
                    .setThumbnail(`${message.guild.iconURL() || `${conf.domain}/logo.png`}`)
                .setTimestamp()
                .setFooter(`Requested by ${message.member.displayName}`, `${message.author.displayAvatarURL()}`);
            message.channel.send(helpSomethingEmbed).catch(error => console.log('error: ' + error));
        } else if (args[1] == 'embed-img') {
            let helpSomethingEmbed = new Discord.MessageEmbed()
                .setAuthor(conf.bot.name, conf.bot.logo)
                .setColor('#10FF00')
                .setTitle('Help embed-img')
                .setDescription('**For mods and admins only**\nLet’s mods and admin make a custom embed.')
                .addField('Command structure', `${currentServer.prefix}}embed [title] [description] [colour] [img-url]`)
                .addField('Command example', `${currentServer.prefix}embed [bruv is awesome] [just joking you are] [#FF0000] [http://imgsite.com/knightrider.png]`)
                .addField('Extra info', `To get the # colour code(s) [click here](https://htmlcolorcodes.com/)`)
                .setThumbnail(`${message.guild.iconURL() || `${conf.domain}/logo.png`}`)
                .setTimestamp()
                .setFooter(`Requested by ${message.member.displayName}`, `${message.author.displayAvatarURL()}`);
            message.channel.send(helpSomethingEmbed).catch(error => console.log('error: ' + error));
        } else {
            let helpEmbed = new Discord.MessageEmbed()
                .setColor(conf.colour.ok)
                .setTitle('Help!')
                .setURL(`${conf.domain}`)
                .setAuthor(conf.bot.name, conf.bot.logo)
                .addField("util commands:", `${currentServer.prefix}ping - shows ping\n${currentServer.prefix}about - gives general information about the bot`)
                .addField("general commands:", `${currentServer.prefix}mcstatus - shows minecraft server status\n${currentServer.prefix}memes - shows a random meme from redid mus be done in memes channel\n${currentServer.prefix}fivem - shows fiveM server status\n${currentServer.prefix}fivem players - shows online players on fiveM\n${currentServer.prefix}fivem ip - gives you the fiveM server ip\n${currentServer.prefix}play (song name) or (youtube-url) - plays selected music in a voice channel\n${currentServer.prefix}skip - skips the current song to the next one on the queue\n${currentServer.prefix}stop - bot stops playing music\n`)
                .addField("moderator commands:", `${currentServer.prefix}say #channel message - bot sends message in channel of choice\n${currentServer.prefix}filter <safe/normal/off> - sets the word filter level\n${currentServer.prefix}userinfo <@user> - gives how many strikes a user has and other basic info on the user like nots and join dates.\n${currentServer.prefix}noteset <@user> - sets a note for a user\n${currentServer.prefix}note <@user> - see a moderator note for a user\n${currentServer.prefix}embed [title] [description] [colour] - sends a embed\n${currentServer.prefix}embed-img [title] [description] [colour] [img-url]\n${currentServer.prefix}OTR11 - for <@!276156203770314755> announcment`)
                .setThumbnail(`${message.guild.iconURL() || `${conf.domain}/logo.png`}`)
                .setTimestamp()
                .setFooter(`Requested by ${message.member.displayName}`, `${message.author.displayAvatarURL()}`);
            message.channel.send(helpEmbed).catch(error => console.log('error: ' + error))
        }
    }
}