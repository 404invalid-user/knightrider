const { version, repository: { url } } = require('../../../../package.json');
const { domain, prefix, mainServer: { invite } } = require('../../../conf/conf.json');
module.exports = {
    name: '/api',
    dynamic: false,
    async exe(client, req, res) {
        try {
            res.status(200).json({ defaultPrefix: prefix, doamin: domain, version: version, mainGuild: invite, github: url.replace('.git', '') });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "500 - some error", message: "report it if it happens again" });
        }
    }
}