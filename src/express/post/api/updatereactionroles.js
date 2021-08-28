/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
const Server = require('../../../models/server');
const Userdashboard = require('../../../models/userdashboard');
module.exports = {
    name: '/api/updatereactionroles',
    async exe(client, conf, req, res) {
        try {
            if (!req.body.user || !req.body.server || !req.body.server.id || !req.body.reactionRoles) return res.status(404).json({ error: "000 - missing information", info: "please include all neccery information for this api endpoint for help on how to use this api more info in the docs " + conf.domain + '/docs' });
            let currentUser = await Userdashboard.findOne({ userId: req.body.user.id });
            if (currentUser == null) return res.status(404).json({ error: "404 - cant find you in the db" });
            let currentServer = await Server.findOne({ id: req.body.server.id });
            if (currentServer == null) return res.status(404).json({ error: "404 - cant find that server in the db" });
            let gAccess = false;
            await currentUser.guilds.forEach(guild => {
                if (guild.id == currentServer.id) {
                    gAccess = true;
                    if (guild.userPermission == 'owner' || guild.userPermission == 'MANAGE_GUILD' || currentServer.staff.includes(currentUser.userId)) {
                        let hasAccess = false;
                        await currentUser.accessCodes.forEach(async(userCode) => {
                            if (req.body.user.accesscode == userCode.code) {
                                hasAccess = true;
                                currentServer.reactionRoles = await req.body.reactionRoles;
                                currentServer.save();
                                let eachChannelRoles = {};
                                await currentServer.reactionRoles.forEach(role => {
                                    if (!eachChannelRoles[role.channelID]) {
                                        eachChannelRoles[role.channelID] = [{
                                            roleID: role.roleID,
                                            emoji: role.emoji
                                        }];
                                    } else {
                                        eachChannelRoles[role.channelID].push({
                                            roleID: role.roleID,
                                            emoji: role.emoji
                                        });
                                    };
                                });
                                for (let i in eachChannelRoles) {
                                    let rolesEmbed = {
                                        color: conf.colour.ok,
                                        title: 'ReactionRoles',
                                        url: conf.domain,
                                        author: {
                                            name: conf.bot.name,
                                            icon_url: conf.bot.logo,
                                            url: conf.bot.url,
                                        },
                                        description: 'react with the appropriate emoji to get your role',
                                        fields: [],
                                        timestamp: new Date(),
                                        footer: {
                                            text: currentServer.name,
                                        },
                                    };

                                    await eachChannelRoles[i].forEach(role => {
                                        rolesEmbed.fields.push({
                                            name: '\u200B',
                                            value: '<@&' + role.roleID + '> - ' + role.emoji,
                                        });
                                    });
                                    const channel = client.guilds.cache.get(currentServer.id).channels.cache.get(i)
                                    if (channel !== undefined) {
                                        const msg = await channel.send({ embed: rolesEmbed });
                                        eachChannelRoles[i].forEach(role => {
                                            msg.react(role.emoji);
                                        });
                                    };
                                };
                                return res.status(200).json({ error: "no", message: "reactionroles have been updates" });
                            };
                        });
                    }
                }
            });
            if (hasAccess == false) return res.status(401).json({ error: "401 - unauthorised", info: "please include your accesscode and user id to use this api more info in the docs " + conf.domain + '/docs' });
            if (gAccess == false) {
                return res.status(401).render('error.ejs', { errorMessage: null, error: "you do not have access to the admin dashboard if you are a member of staff tell the bot owner" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "some error happened", info: "report this if it happenes again." + conf.domain + '/er' });
        }
    }
}