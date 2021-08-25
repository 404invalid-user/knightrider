const Server = require('../../models/server');
const conf = require('../../conf/conf.json')
module.exports = async(message, server, user, client) => {
    if (server.addons.caps == true) {
        if (!message.member.roles.cache.find(r => server.staffRoles.includes(r.name))) {
            const textRegex = new RegExp(/[^a-zA-Z0-9]/, 'g');
            const capsRegex = new RegExp(/[A-Z]/, 'g');

            const capsText = message.content.replace(textRegex, '');
            const capsPerc = 1 - (capsText.replace(capsRegex, '').length / capsText.length);

            if (capsText.length > 6 && capsPerc > 0.7) {
                message.channel.send("too many caps")
            }
        }
    }
}