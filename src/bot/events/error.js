const conf = require('../../conf/conf.json')
module.exports = {
    name: 'error',
    async exe(client, Discord, error) {
        //one day i will saves these to a file or something
        console.log(error)
    }
}