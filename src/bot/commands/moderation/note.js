module.exports = {
    name: 'note',
    description: "shows a users note",
    async execute(message, args, Discord, currentServer, messageUser, client) {
        message.reply("* depricated *: do " + currentServer.prefix + "userinfo @someone")
    }
}