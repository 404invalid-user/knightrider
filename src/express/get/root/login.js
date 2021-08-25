const { webServer: { oauthURI } } = require('../../../conf/conf.json')
module.exports = {
    name: '/login',
    dynamic: false,
    exe(client, req, res) {
        res.redirect(oauthURI)
    }
}