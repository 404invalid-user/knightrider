const { readdirSync } = require("fs");
const chalk = require('chalk');
let chalkColour;
module.exports = (client) => {
    readdirSync(__dirname + "/../commands/").forEach((dir) => {
        const commands = readdirSync(__dirname + `/../commands/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of commands) {
            let cmd = require(__dirname + `/../commands/${dir}/${file}`);
            if (cmd.name && cmd.description) {
                switch (dir) {
                    case 'fun':
                        chalkColour = 'green'
                        break;
                    case 'moderaton':
                        chalkColour = 'blue'
                        break;
                    case 'info':
                        chalkColour = 'cyan'
                        break;
                    default:
                        chalkColour = 'green'
                }
                try {
                    client.commands.set(cmd.name, cmd);
                    console.log(chalk.yellow('[command handler]: ') + chalk[chalkColour]('(' + dir + '): ') + "name: " + cmd.name + " path: " + `./commands/${dir}/${file}`);
                } catch (error) {
                    console.log(chalk.yellow('[command handler]: ') + chalk.red('(command error): ') + "adding command. path: " + `./commands/${dir}/${file}`);
                    console.log("eeer: " + error)
                    continue;
                }
            } else {
                console.log(chalk.yellow('[command handler]: ') + chalk.red('(command error): ') + "command dosnt contain a name or description. path: " + `./commands/${dir}/${file}`);
                continue;
            }
        }
    });
};