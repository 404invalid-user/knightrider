const Server = require("../../models/server");
const conf = require('../../conf/conf.json')

var members = [];
module.exports = {
    members: members,
    name: 'voiceStateUpdate',
    async exe(client, Discord, oldMember, newMember) {
        try {
            let newUserChannel = newMember.channelID;
            let oldUserChannel = oldMember.channelID;
            const currentServer = await Server.findOne({ id: newMember.guild.id });
            if (currentServer == null) return;
            if (currentServer.channels.townhall == ' ' || currentServer.channels.townhallLogs == ' ') return;
            if (newUserChannel == currentServer.channels.townhall) {
                let isStaff;
                if (client.guilds.cache.get(currentServer.id).members.cache.get(newMember.id).roles.cache.find(r => currentServer.staffRoles.includes(r.name))) {
                    isStaff = 'yes';
                } else {
                    isStaff = 'no';
                };
                if (!members[newMember.guild.id]) {
                    members[newMember.guild.id] = [];
                };
                if (!members[newMember.guild.id].includes(newMember.id)) {
                    members[newMember.guild.id].push(newMember.id)
                };
                const e6 = {
                    color: conf.colour.ok,
                    title: 'User joinded Town hall vc',
                    author: {
                        name: client.users.cache.get(newMember.id).tag,
                        icon_url: client.users.cache.get(newMember.id).avatarURL()
                    },
                    description: "a new member has joined the town hall VC.\nto get all members that have joined during this session do `" + currentServer.prefix + "townhall`.",
                    fields: [{
                            name: '**__name:**__',
                            value: client.users.cache.get(newMember.id).tag,
                        },
                        {
                            name: '__**id:**__',
                            value: newMember.id,
                        },
                        {
                            name: '__**@ mention**__',
                            value: '<@!' + newMember.id + '>'
                        },
                        {
                            name: '__**is staff**__',
                            value: isStaff
                        },
                        {
                            name: '__**join position:**__',
                            value: members.length
                        },
                    ],

                    timestamp: new Date(),
                    footer: {
                        text: 'TownHall Meeting Log'
                    },
                };

                client.guilds.cache.get(currentServer.id).channels.cache.get(currentServer.channels.townhallLogs).send({ embed: e6 });

            };
        } catch (error) {
            console.log(error)
        }
    }
}