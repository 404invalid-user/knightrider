/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
const { User } = require('discord.js');

const User = require('../models/user');
const Server = require('../models/server');
const getServer = require('../funcs/getserver');
module.exports = {
    reportError: function(client, conf, task, error, user) {
        const errorEmbed = {
            color: `${conf.colour.okError}`,
            title: 'Error',
            url: `${conf.domain}`,
            author: {
                name: conf.bot.name
            },
            thumbnail: {
                url: `${conf.server.logo}`,
            },
            description: `there has been an error executing somthing this will be somthing from a automated script or a member using the bot\nthe infromation below can be sensative **do not share** this with anyone unless you know what to hide:`,
            fields: [{
                    name: '__**task:**__',
                    value: `\`${task}\``,
                },
                {
                    name: '__**Error**__',
                    value: `\`${error}\``,
                },
                {
                    name: '__**user who triggered it**__',
                    value: `__name:__ \`${currentUser.userName}\`\n__id:__ \`${user.id}\``,
                }
            ],
            timestamp: new Date(),
            footer: {
                text: 'Owner Error Log'
            },
        };
        client.users.cache.get(conf.owner).send({ embed: errorEmbed });

    },
    addCmd: async function(message) {
        let currentServer = await Server.findOne({ id: message.guild.id });
        currentServer.commandCount++;
        currentServer.save();
    },
    addstrike: async function(message) {
        let currentUser = await User.findOne({ id: message.author.id })
        if (currentUser == null) {
            await User.create({
                id: message.author.id,
                avatar: message.author.avatarURL()
            })
            currentUser = await User.findOne({ id: message.author.id })
        }
        currentUser.strike++;
        currentUser.save()
    },

    otrCommand: async function(message, args, Discord, client) {
        if (message.author.id == conf.cwh11) {
            let server = getServer(message);
            if (server == null) return message.channel.send("this server isnt in the db");
            const annoncmentsChannel = client.channels.cache.get(server.channels.annoncments);
            switch (args[0]) {
                case 'ito':
                    await message.delete().catch(e => message.channel.send("i cant auto delete the messag you sent have i got permission to send messages in <#" + message.channel.id + ">?"));
                    annoncmentsChannel.send("@here Hey guys! Charlie is in the office. Join him in voice if you want.").catch(e => message.channel.send("i cant do that have i got permission to send messages in <#" + channels.annoncments + ">?"));
                    break;
                case 'otrf':
                    await message.delete().catch(e => message.channel.send("i cant auto delete the messag you sent have i got permission to send messages in <#" + message.channel.id + ">?"));
                    annoncmentsChannel.send("@here Hey guys! Charlie is on the road in the Ford. Join him in voice if you want.").catch(e => message.channel.send("i cant do that have i got permission to send messages in <#" + channels.annoncments + ">?"));
                    break;
                case 'otrs':
                    await message.delete().catch(e => message.channel.send("i cant auto delete the messag you sent have i got permission to send messages in <#" + message.channel.id + ">?"));
                    annoncmentsChannel.send("@here Hey guys! Charlie is on the road in the Subaru. Join him in voice if you want.").catch(e => message.channel.send("i cant do that have i got permission to send messages in <#" + channels.annoncments + ">?"));
                    break;
                case 'otr11':
                    await message.delete().catch(e => message.channel.send("i cant auto delete the messag you sent have i got permission to send messages in <#" + message.channel.id + ">?"));
                    annoncmentsChannel.send("@here Hey guys! Charlie is on the road in his car. Join him in voice if you want.").catch(e => message.channel.send("i cant do that have i got permission to send messages in <#" + channels.annoncments + ">?"));
                    break;
                case 'otr':
                    await message.delete().catch(e => message.channel.send("i cant auto delete the messag you sent have i got permission to send messages in <#" + message.channel.id + ">?"));
                    annoncmentsChannel.send("@here Hey guys! Charlie is on the road. Join him in voice if you want.").catch(e => message.channel.send("i cant do that have i got permission to send messages in <#" + channels.annoncments + ">?"));
                    break;
                case 'olb':
                    await message.delete().catch(e => message.channel.send("i cant auto delete the messag you sent have i got permission to send messages in <#" + message.channel.id + ">?"));
                    annoncmentsChannel.send("@here Hey guys! Charlie is on the road. Join him in voice if you want.").catch(e => message.channel.send("i cant do that have i got permission to send messages in <#" + channels.annoncments + ">?"));
                    break;
                case 'yts':
                    await message.delete().catch(e => message.channel.send("i cant auto delete the messag you sent have i got permission to send messages in <#" + message.channel.id + ">?"));
                    annoncmentsChannel.send("@here Hey guys! Charlie is streaming on YouTube: https://www.youtube.com/channel/UC7uWWizg0tmQ2R1kBkuDJHg").catch(e => message.channel.send("i cant do that have i got permission to send messages in <#" + channels.annoncments + ">?"));
                    break;
                case 'ts':
                    await message.delete().catch(e => message.channel.send("i cant auto delete the messag you sent have i got permission to send messages in <#" + message.channel.id + ">?"));
                    annoncmentsChannel.send("@here Hey guys! Charlie is streaming on Twitch: https://www.twitch.tv/therealcwh11").catch(e => message.channel.send("i cant do that have i got permission to send messages in <#" + channels.annoncments + ">?"));
                    break;
                default:
                    return;
            };
        }
    }

};