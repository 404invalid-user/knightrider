const conf = require('../../conf/conf.json')
module.exports = {
    name: 'guildMemberAdd',
    async exe(client, Discord, member) {
        try {
            member.guild.fetchInvites().then(guildInvites => {
                const inviteGuild = invites;
                const invite = guildInvites.find(i => inviteGuild.get(i.code).uses < i.uses);
                const inviter = client.users.cache.get(invite.inviter.id);

                const inviteLogEmbed = {
                    color: `${conf.colour.ok}`,
                    title: 'invite',
                    url: `${conf.domain}`,
                    author: {
                        name: conf.bot.name
                    },
                    thumbnail: {
                        url: `${conf.server.logo}`,
                    },
                    description: `${member.user.discriminator} (${member.user.id}) joined using invite code ${invite.code} from ${inviter.tag} (${inviter.id}). Invite was used ${invite.uses} times since its creation.`,
                    fields: [{
                            name: 'Member joined:',
                            value: `${member.user.discriminator} (${member.user.id})`,
                        },
                        {
                            name: 'Inviter:',
                            value: `${inviter.tag} (${inviter.id})`,
                        },
                        {
                            name: 'Invite Code:',
                            value: `[https://discord.gg/${invite.code}](https://discord.gg/${invite.code})`,
                        },
                        {
                            name: 'Invite Uses:',
                            value: `${invite.uses}`,
                        },
                        {
                            name: 'Time of Invite:',
                            value: `${new Date()}`,
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: 'moderation logs'
                    },
                };
                member.guild.channels.cache.get(conf.server.channels.modLogs).send({ embed: inviteLogEmbed });
                invites = guildInvites;
            });
        } catch (error) {
            require('../conf/functions.js').reportError(client, conf, "guildMemberAdd", error, { name: null, id: null })
        }
    }
}