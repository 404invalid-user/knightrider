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
                .setDescription("π - <@&595087305212035084>\nπ - <@&595086913430355973>\nβοΈ - <@&595087098604683277>\nπΊοΈ - <@&604424840807710721>\nπ - <@&691635977889906849>\nπ - <@&752217267600621578>\nποΈ - <@&752217137728192543>\nπ§ - <@&595767995998011392>\nβοΈ - <@&860942666195927050>")
                .setFooter('something wrong? go to http://knightRider.rf.gd/er.html');
            let msg = await message.channel.send(exampleEmbed);
            msg.react("π")
            msg.react("π")
            msg.react("β")
            msg.react("πΊ")
            msg.react("π")
            msg.react("π")
            msg.react("π")
            msg.react("π§")
            msg.react("β")
        }
    }
}