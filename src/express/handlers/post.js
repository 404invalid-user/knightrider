/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
const chalk = require('chalk');
const { readdirSync } = require("fs");
const conf = require('../../conf/conf.json');
module.exports = (client, webServer) => {
    readdirSync(__dirname + '/../post/').forEach((dir) => {
        const postReqFiles = readdirSync(__dirname + `/../post/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of postReqFiles) {
            let postReqFile = require(__dirname + `/../post/${dir}/${file}`);
            if (postReqFile.name) {
                try {
                    webServer.post(postReqFile.name, async(...args) => postReqFile.exe(client, conf, ...args));
                } catch (error) {
                    console.log(chalk.cyan('[webserver post handler]: ') + chalk.red('(error): ') + "executing. path: " + `./get/${dir}/${file}`);
                    continue;
                }
            } else {
                console.log(chalk.cyan('[webserver post handler]: ') + chalk.red('(error): ') + "post file dosnt contain a name or description. path: " + `./get/${dir}/${file}`);
                continue;
            };
        };
    });


    console.log(chalk.cyan('[webserver]: ') + "loaded post request handler");

}