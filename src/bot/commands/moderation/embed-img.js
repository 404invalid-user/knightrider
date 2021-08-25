module.exports = {
    name: 'embed-img',
    description: "embed with image command for mods and admins",
    execute(message, args, Discord, currentServer, messageUser, client) {
        if (currentServer.staff.includes(message.author.id) || message.member.roles.cache.find(r => server.staffRoles.includes(r.name))) {
            if (!args[1]) return message.reply(`you at leas need to supply a title if you stuck do ${currentServer.prefix}help embed`);
            if (!message.content.includes('[')) return message.reply(`something is wrong with that if youre stuck do ${currentServer.prefix}help embed`);

            let mcontent = message.content;
            let titleStart = mcontent.indexOf('[');
            let titleEnd = mcontent.indexOf(']');
            let title = mcontent.substr(titleStart + 1, titleEnd - titleStart - 1);

            let descStart = mcontent.indexOf('[', titleStart + 1);
            let descEnd = mcontent.indexOf(']', titleEnd + 1);
            let description = mcontent.substr(descStart + 1, descEnd - descStart - 1);

            let colorstart = mcontent.indexOf('[', descStart + 1);
            let colorend = mcontent.indexOf(']', descEnd + 1);
            let color = mcontent.substr(colorstart + 1, colorend - colorstart - 1);

            let imgstart = mcontent.indexOf('[', colorstart + 1);
            let imgend = mcontent.indexOf(']', colorend + 1);
            let img = mcontent.substr(imgstart + 1, imgend - imgstart - 1);

            let custome_embed = new Discord.MessageEmbed().setAuthor(`${message.member.displayName}`, `${message.author.displayAvatarURL()}`).setTitle(title).setDescription(description).setColor(color).setImage(`${img}`);
            message.channel.send(custome_embed);
        } else {
            return message.reply("you cant do that only staff can").catch(e => console.log(e));
        };
    }
}