/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
const Server = require('../../../models/server');
const { domain } = require('../../../conf/conf.json');
const Userdashboard = require('../../../models/userdashboard');
module.exports = {
    name: '/api/updatefilter',
    async exe(client, conf, req, res) {
        try {
            if (!req.body.user || !req.body.server || !req.body.server.id || !req.body.normalFilter || !req.body.safeFilter) return res.status(401).JSON({ error: "000 - missing information", info: "please include all neccery information for this api endpoint for help on how to use this api more info in the docs " + conf.domain + '/docs' });
            let currentUser = await Userdashboard.findOne({ userId: req.body.user.id });
            if (currentUser == null) return res.status(404).json({ error: "404 - cant find you in the db" });
            let currentServer = await Server.findOne({ id: req.body.server.id });
            if (currentServer == null) return res.status(404).json({ error: "404 - cant find that server in the db" });
            let guild = await currentUser.guilds[currentServer.id];
            if (guild.userPermission == 'owner' || guild.userPermission == 'MANAGE_GUILD' || currentServer.staff.includes(currentUser.userId)) {

                let hasAccess = false;
                await currentUser.accessCodes.forEach(async(userCode) => {
                    if (req.body.user.accesscode == userCode.code) {
                        hasAccess = true;
                        currentServer.filter.normal = await req.body.normalFilter;
                        currentServer.filter.safe = await req.body.safeFilter;
                        currentServer.save();
                        return res.status(200).json({ error: "no", message: "filters have been updates" });
                    };
                });
            } else {
                return res.status(401).json({ error: "401 - unauthorised", info: "your user does not own the server or have a staff role or pi is listed as a staff member" });
            };


            if (hasAccess == false) return res.status(401).json({ error: "401 - unauthorised", info: "please include your accesscode and user id to use this api more info in the docs " + conf.domain + '/docs' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "some error happened", info: "report this if it happenes again." + domain + '/er' });
        }
    }
}