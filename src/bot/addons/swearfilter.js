const conf = require('../../conf/conf.json')
module.exports = (message, server, user, client) => {
    //filter banned words at different levels
    try {
        if (server.addons.filter == true) {
            if (!message.member.roles.cache.find(r => server.staffRoles.includes(r.name))) {
                if (server.filter.level == 'safe') {
                    server.filter.safe.forEach(async(word) => {
                        let msgContent = message.content.toLowerCase();
                        if (msgContent.includes(word)) {
                            await message.delete().catch(error => {});
                            addstrike(user);
                            if (parseInt(server.channels.modLogs) !== 'NaW') {
                                client.guilds.cache.get(server.id).channels.cache.get(server.channels.modLogs).send({ embed: { color: conf.colour.ok, title: 'filter has been triggered', url: conf.domain + '/server/' + user.guildID + '/user/' + user.id, author: { name: conf.bot.name, icon_url: conf.bot.logo, url: conf.bot.url, }, thumbnail: { url: message.author.displayAvatarURL() }, fields: [{ name: '__**Member**__', value: message.author.tag + '<@!' + message.author.id + '> (' + message.author.id + ')', inline: true, }, { name: '__**Channel**__', value: '<#' + message.channel.id + '>', inline: true }, { name: '__**Filter level**__', value: '`safe`' }, { name: '__**Mesage Content**__', value: '`"' + message.content + '"`', }, { name: '__**Filtered Word**__', value: '`"' + word + '"`' }], timestamp: new Date(), footer: { text: 'moderation log', } } });
                            };
                            message.reply(`please dont swear.\nwas this a miss trigger? fill in ${conf.domain}/server/${server.id}/er`).then(m => m.delete({ timeout: 30000 }));
                            return;
                        };
                    });
                    //filter normal mode
                } else if (server.filter.level == 'normal') {
                    server.filter.normal.forEach(async(word) => {
                        let msgContent = message.content.toLowerCase();
                        if (msgContent.includes(word)) {
                            await message.delete().catch(error => {});
                            functions.addstrike(message);
                            if (parseInt(server.channels.modLogs) !== 'NaW') {
                                client.guilds.cache.get(conf.server.id).channels.cache.get(conf.server.channels.modLogs).send({ embed: { color: conf.colour.ok, title: 'filter has been triggered', url: conf.domain + '/server/' + user.guildID + '/user/' + user.id, author: { name: conf.bot.name, icon_url: conf.bot.logo, url: conf.bot.url, }, thumbnail: { url: message.author.displayAvatarURL() }, fields: [{ name: '__**Member**__', value: message.author.tag + '<@!' + message.author.id + '> (' + message.author.id + ')', inline: true, }, { name: '__**Channel**__', value: '<#' + message.channel.id + '>', inline: true }, { name: '__**Filter level**__', value: '`normal`' }, { name: '__**Mesage Content**__', value: '`"' + message.content + '"`', }, { name: '__**Filtered Word**__', value: '`"' + word + '"`' }], timestamp: new Date(), footer: { text: 'moderation log', } } });
                            };
                            message.reply(`please dont swear.\nwas this a miss trigger? fill in ${conf.domain}/server/${server.id}/er`).then(m => m.delete({ timeout: 30000 }));

                            return;
                        };
                    });
                };
            };
        };

    } catch (error) {
        console.log(error)
    }
}