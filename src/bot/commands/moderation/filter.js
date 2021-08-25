module.exports = {
    name: 'filter',
    description: "sets filter",
    async execute(message, args, Discord, currentServer, messageUser, client) {
        if (currentServer.staff.includes(message.author.id) || message.member.roles.cache.find(r => server.staffRoles.includes(r.name))) {
            if (args[1] == 'off') {
                currentServer.filter.level = 'off';
                currentServer.save();
                message.channel.send("filter has been set to " + currentServer.filter.level);
            } else if (args[1] == 'normal') {
                currentServer.filter.level = 'normal';
                currentServer.save();
                message.channel.send("filter has been set to " + currentServer.filter.level);
            } else if (args[1] == 'safe') {
                currentServer.filter.level = 'safe';
                currentServer.save();
                message.channel.send("filter has been set to " + currentServer.filter.level);
            } else {
                message.channel.send("that is not a valid filter setting you can chose from: 'normal' 'safe' and 'off'.");
            };

        } else {
            return message.reply("you cant do that only staff can").catch(e => console.log(e));
        };
    }
}