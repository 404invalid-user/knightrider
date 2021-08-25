const conf = require('../../../conf/conf.json')
module.exports = {
    name: 'townhall',
    description: "say command for mods and admins",
    async execute(message, args, Discord, currentServer, messageUser, client) {
        if (currentServer.staff.includes(message.author.id) || message.member.roles.cache.find(r => server.staffRoles.includes(r.name))) {

            if (args[1] == 'end') {
                if (args[2] == 'confirm') {
                    require('../../events/voicestateupdate').members[message.guild.id] = [];
                    message.channel.send("townHall meeting members have been removed.")
                } else {
                    message.channel.send("are you sure you want to end the townhall meeting? this will remove all members even ones that may still be currently in the voice channel.\nto confirm please do `" + currentServer.prefix + "townhall end confirm`.")
                }
            } else {
                let members = require('../../events/voicestateupdate').members[message.guild.id];
                let mpos = 0;
                let mEmbed = new Discord.MessageEmbed()
                    .setColor(conf.colour.ok)
                    .setTitle('Members that have Joined Townhall Vc')
                    .setURL(conf.domain + '/server/' + message.guild.id + '/townhall')
                    .setAuthor(conf.bot.name, conf.bot.logo, conf.bot.url)
                    .setDescription('when the townhall meeting ends remember to do `' + currentServer.prefix + 'townhall end` otherwise users from the previous meeting will show up.')
                    .setThumbnail(message.guild.iconURL() || conf.domain + '/logo.png')
                    .setTimestamp()
                    .setFooter('TownHall Meeting');

                await members.forEach(async(member) => {
                    let isStaff;
                    if (client.guilds.cache.get(currentServer.id).members.cache.get(member).roles.cache.find(r => currentServer.staffRoles.includes(r.name))) {
                        isStaff = 'yes';
                    } else {
                        isStaff = 'no';
                    };
                    mpos++;
                    await mEmbed.addField(`__${client.users.cache.get(member).tag}:__`, `__**id:**__ ${member}\n__**@:**__ <@!${member}>\n__**isStaff:**__ ${isStaff}\n__**Join Position:**__ ${mpos}`);
                })
                message.channel.send({ embed: mEmbed });
            };
        } else {
            return message.reply("you cant do that only staff can").catch(e => console.log(e));
        };

    }
}