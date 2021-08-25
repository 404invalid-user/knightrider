/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
const fetch = require('node-fetch');
const config = require('../../../conf/conf.json')
const User = require('../../../models/userdashboard');
const dbc = require('discord-bitfield-calculator')
const token = require('../../../conf/tokens');
const Server = require('../../../models/server');
const randomString = require("randomstring").generate({
    length: 33,
    charset: 'alphabetic'
});

module.exports = {
    name: '/dashboard',
    dynamic: false,
    async exe(client, req, res) {
        //  try {
        if (req.query.code) {
            let oath;
            let userInfo;
            let userGuilds = [];
            let guilds = [];
            let theAccessCode = randomString;

            //access discord oauth2 and get nececry data
            await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                body: new URLSearchParams({
                    client_id: token.oauth.clientId,
                    client_secret: token.oauth.clientSecret,
                    grant_type: 'authorization_code',
                    redirect_uri: token.oauth.redirectUri,
                    code: req.query.code,
                    scope: token.oauth.scope,
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).then(discordRes => discordRes.json()).then(info => oath = info);

            //fetch user info from OAuth2 token
            await fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${oath.token_type} ${oath.access_token}`,
                },
            }).then(async userRes => {
                userInfo = await userRes.json();
            });

            //fetch guilds from OAuth2 token
            await fetch('https://discord.com/api/users/@me/guilds', {
                    headers: {
                        authorization: `${oath.token_type} ${oath.access_token}`,
                    },
                })
                .then(async guildRes => {
                    userGuilds = await guildRes.json()
                });

            //if the access code was used/expired (from browser refresh) redirect without code and try use cookeis
            if (userInfo.message == '401: Unauthorized') return res.redirect('/dashboard');
            if (userGuilds.message == '401: Unauthorized') return res.redirect('/dashboard');

            let botGuilds = await client.guilds.cache.map(guild => guild.id)
                //loop though oauth2 guilds and push guild info for matching guilds to 'guilds' array
            await userGuilds.forEach(async(userGuild) => {
                let currentServer = await Server.findOne({ id: userGuild.id })
                    //handle servers only the user is in
                if (currentServer == null) {
                    if (userGuild.owner == true) {
                        guilds.push({ id: userGuild.id, name: userGuild.name, icon: `https://cdn.discordapp.com/icons/${userGuild.id}/${userGuild.icon}.webp`, mutual: false, userPermission: 'owner' });
                    } else {
                        if (dbc.permissions(userGuild.permissions_new).includes('MANAGE_GUILD')) {
                            guilds.push({ id: userGuild.id, name: userGuild.name, icon: `https://cdn.discordapp.com/icons/${userGuild.id}/${userGuild.icon}.webp`, mutual: false, userPermission: 'MANAGE_GUILD' });
                        };
                    };
                    //handle servers the bot and user are in
                } else {
                    if (userGuild.owner == true) {
                        guilds.push({ id: userGuild.id, name: userGuild.name, icon: `https://cdn.discordapp.com/icons/${userGuild.id}/${userGuild.icon}.webp`, mutual: true, userPermission: 'owner' });
                    } else {
                        if (client.guilds.cache.get(currentServer.id).members.find(currentUser.userId).roles.cache.find(r => currentServer.staffRoles.includes(r.name))) {
                            guilds.push({ id: userGuild.id, name: userGuild.name, icon: `https://cdn.discordapp.com/icons/${userGuild.id}/${userGuild.icon}.webp`, mutual: true, userPermission: 'staffrole' });
                        } else {
                            currentServer.staff.forEach(userid => {
                                if (userInfo.id == userid) {
                                    guilds.push({ id: userGuild.id, name: userGuild.name, icon: `https://cdn.discordapp.com/icons/${userGuild.id}/${userGuild.icon}.webp`, mutual: true, userPermission: 'staffid' });
                                } else if (dbc.permissions(userGuild.permissions_new).includes('MANAGE_GUILD')) {
                                    guilds.push({ id: userGuild.id, name: userGuild.name, icon: `https://cdn.discordapp.com/icons/${userGuild.id}/${userGuild.icon}.webp`, mutual: true, userPermission: 'MANAGE_GUILD' });
                                };
                            });
                        };
                    };
                };
            });
            delete botGuilds;

            let currentUser = await User.findOne({ userId: userInfo.id });
            if (currentUser == null) {
                await User.create({
                    userId: userInfo.id,
                    userName: userInfo.username,
                    discriminator: userInfo.discriminator || '0000',
                    avatar: `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`,
                    accessCodes: [{ browser: req.headers['user-agent'], code: randomString }],
                    guilds: guilds
                });
                currentUser = await User.findOne({ userId: userInfo.id });
            } else {
                let gotCorrectAccessCode = false;
                if (res.locals.cookie.accesscode) {
                    await currentUser.accessCodes.forEach(async(accessCode) => {
                        if (res.locals.cookie.accesscode == accessCode.code) {
                            gotCorrectAccessCode = await true;
                            theAccessCode = res.locals.cookie.accesscode;
                        }
                    });
                };
                if (gotCorrectAccessCode == false) {
                    currentUser.accessCodes.push({ browser: req.headers['user-agent'], code: randomString });
                    theAccessCode = randomString;
                };
                currentUser.userName = userInfo.username;
                currentUser.avatar = `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`;
                currentUser.guilds = guilds;
                currentUser.save();
            };

            res.cookie('id', currentUser.userId, { expires: new Date(253402300000000), httpOnly: true }).cookie('accesscode', theAccessCode, { expires: new Date(253402300000000), httpOnly: true }).status(200).render('dashboard/index.ejs', { currentUser: currentUser, guilds: currentUser.guilds });

        } else if (req.query.error) {
            console.log("req query error: " + req.query.error)
            await res.status(500).render('500.ejs');

        } else if (res.locals.cookie.id && res.locals.cookie.accesscode) {
            const currentUser = await User.findOne({ userId: res.locals.cookie.id });
            if (currentUser == null) return res.redirect('/login?nouser');

            let hasAccess = false;
            await currentUser.accessCodes.forEach(async(userCode) => {
                if (res.locals.cookie.accesscode == userCode.code) {

                    hasAccess = true;
                    return res.cookie('id', currentUser.userId, { expires: new Date(253402300000000), httpOnly: true }).cookie('accesscode', res.locals.cookie.accesscode, { expires: new Date(253402300000000), httpOnly: true }).render('dashboard/index.ejs', { user: { name: currentUser.userName, tag: currentUser.discriminator, avatar: currentUser.avatar }, currentUser: currentUser, guilds: currentUser.guilds });
                };
            });
            if (hasAccess == false) return res.redirect('/login?ninvalidcode');
        } else if (!res.locals.cookie.id || !res.locals.cookie.accesscode) return res.redirect('/login?nocookies');

        /*
                } catch (error) {
                    console.log(chalk.red('[express get]: ') + "there was an error with dashboard.js\nerror: " + error);
                    return res.status(500).render('500.ejs');
                };
                */
    }
}