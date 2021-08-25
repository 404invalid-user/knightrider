module.exports = {
    name: 'say',
    description: "say command for mods and admins",
    execute(message, args, Discord, currentServer, messageUser, client) {
        if (currentServer.staff.includes(message.author.id) || message.member.roles.cache.find(r => server.staffRoles.includes(r.name))) {

            message.delete();
            let sayArgs = message.content.substring(prefix.length).split(" ");
            if (message.content.toLowerCase().includes('@everyone')) return message.reply(`Holup you can't @ every one`);
            if (message.content.toLowerCase().includes('@here')) return message.reply(`Holup you can't @ here`);
            message.channel.send(`${sayArgs.slice(2).join(" ")}`);
        } else {
            return message.reply("you cant do that only staff can").catch(e => console.log(e));
        };
    }
}