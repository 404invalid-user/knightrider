const { green } = require('chalk');
const conf = require('../../conf/conf.json');
module.exports = {
    name: 'ready',
    async exe(client) {
        console.log(green('[bot]: ') + `${client.user.tag}` + " is online");
        console.log("Ready!");
    }
}