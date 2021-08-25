/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
module.exports = {
    name: '/api/userinfo/update',
    async exe(client, conf, req, res) {
        try {
            if (req.body.tmpPassWord == usersDB[req.body.userInfo.id].tmpPassWord) {

                if (!usersDB[req.body.memberId]) {
                    res.status(404).json({ error: "user id isnt in the database", info: "user id could be wrong or that user hasnt sent a message in the discord server since the bot has been setup" })
                } else {
                    res.status(200).json({ userStrikes: usersDB[req.body.memberId].strike, userNote: usersDB[req.body.memberId].note, userAdmin: usersDB[req.body.memberId].admin })
                }
            } else {
                res.status(401).json({ error: "401 - unauthorised", info: "please include your tmp password and user id to use this api more info in the docs http://knightrider.rf.gd/docs/" })
            }
        } catch (error) {
            console.log(error)
            res.status(500).JSON({ error: "some error happened", info: "report this if it happenes again." })
            require('./././conf/functions.js').reportError(client, conf, "/api/reaction-error", error, { name: null, id: req.body.userid })
        }
    }
}