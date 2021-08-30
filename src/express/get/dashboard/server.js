/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
const Server = require('../../../models/server')
const Userdashboard = require('../../../models/userdashboard')
const conf = require('../../../conf/conf.json')
module.exports = {
    name: '/server/:serverid/filter',
    dynamic: true,
    async exe(client, req, res) {
        try {
            if (!res.locals.cookie.id || !res.locals.cookie.accesscode) {
                return res.redirect(conf.domain + "/login")
            }
            let currentUser = await Userdashboard.findOne({ userId: res.locals.cookie.id })
            if (currentUser == null) return res.redirect('/login');
            let currentServer = await Server.findOne({ id: req.params.serverid })
            if (currentServer == null) return res.render('404.ejs');
            let gAccess = false;
            let hasAccess = false;

            await currentUser.guilds.forEach(async (guild) => {
                if (guild.id == currentServer.id) {
                    gAccess = true;
                    if (guild.userPermission == 'owner' || guild.userPermission == 'MANAGE_GUILD' || currentServer.staff.includes(currentUser.userId)) {
                        await currentUser.accessCodes.forEach(async(userCode) => {
                            if (res.locals.cookie.accesscode == userCode.code) {
                                hasAccess = true;
                                const memberCount = await client.guilds.cache.get(currentServer.id).memberCount;
                                return res.cookie('id', currentUser.userId, { expires: new Date(253402300000000), httpOnly: true }).cookie('accesscode', res.locals.cookie.accesscode, { expires: new Date(253402300000000), httpOnly: true }).render('dashboard/server.ejs', { domain: conf.domain, user: { id: currentUser.userId, accesscode: res.locals.cookie.accesscode }, currentUser: currentUser, currentServer: currentServer, memberCount: memberCount });
                            };
                        });
                        if (hasAccess == false) return res.redirect('/login?ninvalidcode');
                    }
                };
            });
            if (gAccess == false) {
                return res.status(401).render('error.ejs', { errorMessage: null, error: "you do not have access to the admin dashboard if you are a member of staff tell the bot owner" })
            }


        } catch (error) {
            console.log(error)
            res.status(500).render('error.ejs', { errorMessage: error, error: "there has been an issue with your request please try again, if this continuous report it at http://knightrider.rf.gd/er/admin.php" })

        }
    }
}
