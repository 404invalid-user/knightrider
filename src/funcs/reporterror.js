const conf = require('../conf/conf.json')
module.exports = (client, error, user, process) => {
    const errorEmbed = {
        color: `${conf.colour.okError}`,
        title: 'Error',
        url: `${conf.domain}/er`,
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
}