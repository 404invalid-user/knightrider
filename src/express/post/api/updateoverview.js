/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
const Userdashboard = require('../../../models/userdashboard');
const Server = require('../../../models/server');
const { prefix, domain } = require('../../../conf/conf.json');
module.exports = {
    name: '/api/updateoverview',
    async exe(client, conf, req, res) {
        try {
            if (!req.body.user || !req.body.server || !req.body.server.id || !req.body.staffRoles || !req.body.staffids) return res.status(403).json({ error: "000 - missing information", message: "please include all neccery information for this api endpoint for help on how to use this api more info in the docs " + conf.domain + '/docs' })
            let currentUser = await Userdashboard.findOne({ userId: req.body.user.id })
            if (currentUser == null) return res.status(404).json({ error: "404 - cant find you in the db", message: "that user id cant be found" });
            let currentServer = await Server.findOne({ id: req.body.server.id });
            if (currentServer == null) return res.status(404).json({ error: "404 - cant find that server in the db", message: "that server id cant be found" });
            let guild = await currentUser.guilds[currentServer.id];
            if (guild.userPermission == 'owner' || guild.userPermission == 'MANAGE_GUILD' || currentServer.staff.includes(currentUser.userId)) {

                let hasAccess = false;
                await currentUser.accessCodes.forEach(async(userCode) => {
                    if (req.body.user.accesscode == userCode.code) {
                        hasAccess = true;
                        //apply all data from the req to the db (probabbly a better way to do this)
                        currentServer.prefix = req.body.prefix || prefix;
                        currentServer.staff = req.body.staffids || [];
                        currentServer.staffRoles = req.body.staffRoles || [];
                        currentServer.channels.modLogs = req.body.channels.modlogs || ' ';
                        currentServer.channels.announcments = req.body.channels.announcments || ' ';
                        currentServer.channels.townhall = req.body.channels.townhall || ' ';
                        currentServer.channels.townhallLogs = req.body.channels.townhallLogs || ' ';
                        currentServer.save();
                        return res.status(200);
                    };
                });
            } else {
                return res.status(401).json({ error: "401 - unauthorised", info: "your user does not own the server or have a staff role or pi is listed as a staff member" });
            };


            if (hasAccess == false) return res.status(401).JSON({ error: "401 - unauthorised", info: "please include your accesscode and user id to use this api more info in the docs " + conf.domain + '/docs' });
        } catch (error) {
            console.log(error);
            res.status(500).JSON({ error: "some error happened", info: "report this if it happenes again. " + domain + '/er' });
        }

    }
}