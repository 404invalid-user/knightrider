/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
module.exports = {
    name: '/dash/message',
    async exe(client, req, res) {
        try {
            let usersDB = JSON.parse(fs.readFileSync('./././database/users.json', 'utf8'));
            if (!req.query.tmpPassWord) {
                res.redirect("http://idiotlanparty.com/oauth")
            }
            if (usersDB[req.query.userid].admin == true) {
                if (req.query.tmpPassWord == usersDB[req.query.userid].tmpPassWord) {
                    res.render('admin-message.ejs', { userInfo: { id: req.query.userid, username: req.query.username, avatar: req.query.userAvatar }, tmpPassWord: req.query.tmpPassWord })
                } else {
                    await res.status(401).render('error.ejs', { errorMessage: null, error: "you do not have access please login again to regenrate your temporary local oath key", userInfo: { id: req.query.userid, username: req.query.username, avatar: req.query.userAvatar } })
                }

            } else if (usersDB[userInfo.id].admin == false) {
                await res.status(401).render('error.ejs', { errorMessage: null, error: "you do not have access to the admin dashboard if you are a member of staff fill out http://knightrider.rf.gd/er/admin.php", userInfo: { id: req.query.userid, username: req.query.userame, avatar: req.query.userAvatar } })
            }
        } catch (error) {
            console.log(error)
            require('../../../conf/functions.js').reportError(client, conf, "/api/reaction-error", error, { name: null, id: req.body.userid })
            res.status(500).render('error.ejs', { errorMessage: error, error: "there has been an issue with your request please try again, if this continuous report it at http://knightrider.rf.gd/er/admin.php" })

        }
    }
}