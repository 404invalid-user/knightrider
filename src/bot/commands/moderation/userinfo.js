const conf = require('../../../conf/conf.json');
const User = require('../../../models/user');
module.exports = {
    name: 'userinfo',
    description: "get information about someone on the server",
    async execute(message, args, Discord, currentServer, messageUser, client) {
        try {
            if (currentServer.staff.includes(message.author.id) || message.member.roles.cache.find(r => server.staffRoles.includes(r.name))) {
                let theUser;
                if (message.mentions.users.first()) {
                    theUser = message.mentions.users.first();
                } else {
                    theUser = message.author;
                };
                let currentUser = await User.findOne({ userid: theUser, guildid: message.guild.id });
                if (currentUser == null) return message.channel.send("that user inst in the database");

                const userInfoEmbed = new Discord.MessageEmbed()
                    .setAuthor(`${conf.bot.name}`, `${conf.bot.logo}`)
                    .setTitle('user info')
                    .setURL(conf.domain)
                    .setColor(conf.colour.ok)
                    .setThumbnail(theUser.avatarURL())
                    .addField("__**user:**__", "<@!" + currentUser.id + "> (" + currentUser.id + ")")
                    .addField("__**strikes:**__", "`" + currentUser.strike.toString() + "`")
                    .addField("__**note:**__", "`" + currentUser.note + "`")
                    .setTimestamp()
                    .setFooter(`Requested by ${message.member.displayName} | react with a ❌ to delete`, `${message.author.displayAvatarURL()}`);
                message.channel.send(userInfoEmbed).then(async sentMsg => {
                    await sentMsg.react('❌');
                    sentMsg.awaitReactions(async(reaction, user) => {
                        if (reaction.emoji.name === '❌') await sentMsg.delete();
                    });
                    /*
                    await sentMsg.react('❌');
                    const filter = (reaction, user) => ['❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                    const [reaction] = await sentMsg.awaitReactions(filter, { maxMatches: 1 });
                    if (reaction.emoji.name === '❌') await sentMsg.delete();
                    */
                });
            } else {
                return message.reply("you cant do that only staff can").catch(e => console.log(e));
            };
        } catch (err) {
            message.channel.send("an error happened. are they in the \"database\"?")
        }
    }
}