module.exports = {
    name: 'ping',
    description: "about bot",
    execute(message, args, Discord, currentServer, messageUser, client) {
        message.channel.send("Pinging...").then(m => {
            var ping = m.createdTimestamp - message.createdTimestamp;
            var apiPing = Math.round(client.ws.ping)
            m.edit(`ping: ${ping}\napi ping: ${apiPing}`).catch(error => console.log('error: ' + error))
        });
    }
}