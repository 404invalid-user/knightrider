const Server = require('../../models/server');
module.exports = {
    name: 'messageReactionAdd',
    async exe(client, Discord, reaction, user) {

        let currentServer = await Server.findOne({ id: reaction.message.guild.id });
        if (currentServer == null) return;

        if (!reaction.message.guild || user.bot) return;
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        let member = await reaction.message.guild.members.fetch(user.id);
        try {
            currentServer.reactionRoles.forEach(role => {
                if (reaction.message.channel.id == role.channelID) {
                    if (reaction.emoji.name == role.emoji) {
                        let rr = client.guilds.cache.get(reaction.message.guild.id).roles.cache.get(role.roleID);
                        member.roles.add(rr).catch(e => console.log(e));
                    };
                };
            });
        } catch (error) {
            return console.log(error)
        };
    }
}