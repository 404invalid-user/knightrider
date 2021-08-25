/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
const chalk = require('chalk');
const { readdirSync } = require("fs");
module.exports = (client, webServer) => {

    readdirSync(__dirname + '/../get/').forEach((dir) => {
        const getReqFiles = readdirSync(__dirname + `/../get/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of getReqFiles) {
            let getReqFile = require(__dirname + `/../get/${dir}/${file}`);
            if (getReqFile.name) {
                try {
                    if (getReqFile.dynamic == false) {
                        webServer.get(getReqFile.name, async(...args) => getReqFile.exe(client, ...args));
                    };
                } catch (error) {
                    console.log(chalk.cyan('[webserver get handler]: ') + chalk.red('(error): ') + "executing. path: " + `./get/${dir}/${file}`);
                    continue;
                };
            } else {
                console.log(chalk.cyan('[webserver get handler]: ') + chalk.red('(error): ') + "get file dosnt contain a name or description. path: " + `./get/${dir}/${file}`);
                continue;
            };
        };
    });

    webServer.get('/server/:serverid', async(...args) => require('../get/dashboard/server').exe(client, ...args));
    webServer.get('/server/:serverid/filter', async(...args) => require('../get/dashboard/filter').exe(client, ...args));
    webServer.get('/server/:serverid/reactionroles', async(...args) => require('../get/dashboard/reactionroles').exe(client, ...args));


    webServer.get('*', (req, res) => {
        res.status(404).render('404.ejs');
    });
    console.log(chalk.cyan('[webserver]: ') + "loaded get request handler");

}