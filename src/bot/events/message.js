const conf = require('../../conf/conf.json')

const getGuild = require('../../funcs/getserver');
const getUser = require('../../funcs/getuser');

function addCmd(message) {

}

module.exports = {
    name: 'message',
    async exe(client, Discord, message) {
        if (message.author.bot || !message.guild) return;

        let currentServer = await getGuild(message);
        let messageUser = await getUser(message);
        if (currentServer == null) return;

        ['caps', 'swearfilter'].forEach(addon => {
            require(`../addons/${addon}`)(message, server, messageUser, client);
        })

        //eval command
        if (message.content.toLowerCase().startsWith("--eval")) {
            const evalargs = message.content.split(" ").slice(1);

            function clean(text) {
                if (typeof(text) === "string") {
                    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                } else {
                    return text;
                }
            }
            if (message.author.id !== conf.owner) return message.channel.send("no you cant do that, only <@!522534458071449620> can.");
            if (message.author.id == conf.owner) {
                try {
                    const code = evalargs.join(" ");
                    let evaled = eval(code);
                    if (typeof evaled !== "string") {
                        evaled = require("util").inspect(evaled);
                    }
                    message.channel.send(clean(evaled), { code: "xl" });
                } catch (err) {
                    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
                }
            }
        }

        let args = message.content.toLowerCase().substring(currentServer.prefix.length).split(" ");
        if (!message.content.startsWith(currentServer.prefix)) return;

        //otr commands
        if (message.author.id == conf.cwh11) {
            require('../../funcs/otr').otrCommand(message, args, Discord, currentServer, messageUser, client);
        };

        //dynamic get command name or prefix
        if (client.commands.has(args[0])) {
            try {
                client.commands.get(args[0]).execute(message, args, Discord, currentServer, messageUser, client);
                addCmd(message);
            } catch (error) {
                message.reply('there was an error with that command!');
            };
        } else if (client.commands.find(command => command.aliases && command.aliases.includes(args[0]))) {
            try {
                client.commands.find(command => command.aliases && command.aliases.includes(args[0])).execute(message, args, Discord, currentServer, messageUser, client);
                addCmd(message);
            } catch (error) {
                message.reply('there was an error with that command!');
            };
        };
    }
}