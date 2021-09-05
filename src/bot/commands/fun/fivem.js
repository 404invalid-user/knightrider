const http = require('http');
const conf = require('../../../conf/conf.json')
module.exports = {
    name: 'fivem-disables',
    description: "`.fivem` gets information for the fivem server. do `.fivem players` to see who is online",
    async execute(message, args, Discord, currentServer, messageUser, client) {
        const url = "http://lxn4gvp-aries1.linuxnodes.net:3000"

        if (!args[1]) {
            let serverEmbed = new Discord.MessageEmbed()
                .setAuthor("fiveM info")
                .setColor(conf.colour.ok)
                .setDescription("some info about the server")
            try {
                await http.get(`${currentServer.configs.fivem.url}/dynamic.json`, (result) => {
                    let body = ''
                    result.on('data', (chunk) => {
                        body += chunk
                    })
                    result.on('end', () => {
                        let dynamicResponse = JSON.parse(body)
                        serverEmbed.addField(`__**players:**__`, `${dynamicResponse.clients}/${dynamicResponse.sv_maxclients}`, true)


                    }).on('error', function (error) {
                        console.log('error: ' + error)
                    })
                })

                await http.get(`${currentServer.configs.fivem.url}/info.json`, (result) => {
                    let body = ''
                    result.on('data', (chunk) => {
                        body += chunk
                    })
                    result.on('end', () => {
                        let infoResponse = JSON.parse(body)

                        serverEmbed.addField(`__**server:**__`, `${infoResponse.server}`, true)

                        let oneEyncEnabled;
                        let enhancedHostSupport;
                        let scriptHookAllowed;
                        if (infoResponse.vars.onesync_enabled == 'true') {
                            oneEyncEnabled = ":white_check_mark:"
                        } else {
                            oneEyncEnabled = ":x:"
                        }

                        if (infoResponse.vars.sv_enhancedHostSupport == 'true') {
                            enhancedHostSupport = ":white_check_mark:"
                        } else {
                            enhancedHostSupport = ":x:"
                        }

                        if (infoResponse.vars.sv_scriptHookAllowed == 'true') {
                            scriptHookAllowed = ":white_check_mark:"
                        } else {
                            scriptHookAllowed = ":x:"
                        }

                        serverEmbed.addField(`__**server Info:**__`, ` __onesync:__ ${infoResponse.vars.onesync} \n __onesync Enabled:__ ${oneEyncEnabled} \n  __Enhanced Host Support:__ ${enhancedHostSupport} \n __Script Hook Allowed:__ ${scriptHookAllowed}`)
                        serverEmbed.addField(`__**resources:**__`, `${infoResponse.resources}`)

                        message.channel.send(serverEmbed)
                    })
                })
            } catch (error) {
                message.reply("__**there has been an error**__\nserver is down maybe.")
                console.log('error: ' + error)
            }

        } else if (args[1] == 'ip') {
            let fivemIpEmbed = new Discord.MessageEmbed()
                .setAuthor("fiveM ip")
                .setColor(conf.colour.ok)
                .setDescription("the fiveM server ip is: `" + currentServer.conf.fivem.ip + "`")
            message.channel.send(fivemIpEmbed)
        } else if (args[1] == 'players') {
            let playersEmbed = new Discord.MessageEmbed()
                .setAuthor("fiveM players")
                .setColor(conf.colour.ok)

            try {
                http.get(`${currentServer.configs.fivem.url}/players.json`, (result) => {
                    let body = ''
                    result.on('data', (chunk) => {
                        body += chunk
                    })

                    result.on('end', async () => {
                        var response = JSON.parse(body)
                        if (response.length == 0 || response.length < 0) {
                            playersEmbed.addField("__info__", `no one is on the server`)
                        }

                        let i;
                        for (i = 0; i < response.length; i++) {
                            let discordID = '';
                            await response[i].identifiers.forEach(id => {
                                if (id.includes('discord:')) {
                                    discordID = id.replace('discord:', '');
                                }
                            });
                            playersEmbed.addField(`player ${i}:`, `__**name:**__ ${response[i].name} \n __**discord:**__ <@!${discordID}> \n __**fiveM id:**__ ${response[i].id} \n __**ping:**__ ${response[i].ping} \n`)
                        }
                        if (i == response.length) {
                            try {
                                message.channel.send(playersEmbed)
                            } catch (error) {
                                message.channel.send("i couldnt sent that maybe there are too many players online and i cant add them all to the embed.")
                                console.log('error: ' + error)
                            }
                        }

                    }).on('error', function (error) {
                        console.log('error: ' + error)
                    })
                })
            } catch (error) {
                message.reply("__**there has been an error**__\nserver is down maybe.")
                console.log('error: ' + error)
            }
        }
    }
}
