const conf = require('../../../conf/conf.json');
module.exports = {
    name: 'rulesrolesljoughuihoutfd8es5tryj/i.uliutygrjyhgjlkukbjhcfjklhgfhjouhbgrvycghujyiljknhbgvfhtgfhiuoihkjbnhbvgfgyuo',
    description: "say command for mods and admins",
    async execute(message, args, Discord, currentServer, messageUser, client) {
        if (currentServer.staff.includes(message.author.id) || message.member.roles.cache.find(r => server.staffRoles.includes(r.name))) {

            const exampleEmbed = new Discord.MessageEmbed()
                .setColor(conf.colour.ok)
                .setAuthor("Game Reaction Roles")
                .setTitle("react to get your roles")
                .setThumbnail('https://cdn.discordapp.com/icons/584484766997282836/94b16e813edb9a2f1df4a5bd16f98ad1.png')
                .setURL("http://knightRider.rf.gd/reaction-role-error.php")
                .setDescription("🚚 - <@&595087305212035084>\n🚜 - <@&595086913430355973>\n⛏️ - <@&595087098604683277>\n🗺️ - <@&604424840807710721>\n🚓 - <@&691635977889906849>\n🚗 - <@&752217267600621578>\n🏎️ - <@&752217137728192543>\n🔧 - <@&595767995998011392>\n⚙️ - <@&860942666195927050>")
                .setFooter('something wrong? go to http://knightRider.rf.gd/er.html');
            let msg = await message.channel.send(exampleEmbed);
            msg.react("🚚")
            msg.react("🚜")
            msg.react("⛏")
            msg.react("🗺")
            msg.react("🚓")
            msg.react("🚗")
            msg.react("🏎")
            msg.react("🔧")
            msg.react("⚙")
        }
    }
}