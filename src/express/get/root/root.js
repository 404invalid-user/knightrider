/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
const conf = require('../../../conf/conf.json')
module.exports = {
    name: '/',
    dynamic: false,
    exe(client, req, res) {
        res.render('index.ejs', { bot: { name: conf.bot.name }, servers: client.guilds.cache.size, users: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0) });
    }
}