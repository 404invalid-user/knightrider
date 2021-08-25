const { readdirSync } = require("fs");
const chalk = require('chalk');
module.exports = (client) => {
    const addons = readdirSync(__dirname + '/../addons/').filter((file) => file.endsWith(".js"));
    for (let addonFile of addons) {
        try {
            console.log(chalk.green('[addon handler]: ') + " found '" + addonFile + "'");
        } catch (error) {
            console.log(chalk.green('[addon handler]: ') + chalk.red('(error): ') + "unhandled error: " + error);
            continue;
        }
    }
};