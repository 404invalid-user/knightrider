const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const Discord = require('discord.js')
const conf = require('../../../conf/conf.json')

const queue = new Map();

module.exports = {
    name: 'play',
    description: "the moosk command",
    aliases: ["p", "q", "skip", "stop", "remove", "queue"],
    async execute(message, args, Discord, currentServer, messageUser, client) {

        /*TODO
         *make these embeds better and objects
         */
        const noContentErrorEmbed = new Discord.MessageEmbed()
            .setAuthor('Music', `${conf.bot.logo}`)
            .setTitle('Error')
            .setURL(conf.domain)
            .setColor(conf.colour.okError)
            .setDescription("well what do you want to listen to?\ni know i am an amazing bot but i cant read minds ~~yet~~")
            .addField("possible fixes:", `You have two spaces between ${currentServer.prefix}play and the url/song name remove one of them`)
            .setTimestamp()
            .setFooter(`Requested by ${message.member.displayName}`, `${message.author.displayAvatarURL()}`);

        const notVoiceErrorEmbed = new Discord.MessageEmbed()
            .setAuthor('Music', `${conf.bot.logo}`)
            .setTitle('Error')
            .setURL(conf.domain)
            .setColor(conf.colour.okError)
            .setTitle("you need to be in a voice channel to execute this command im not exactly going to send you the cd")
            .setTimestamp()
            .setFooter(`Requested by ${message.member.displayName}`, `${message.author.displayAvatarURL()}`);

        const noSongsErrorEmbed = new Discord.MessageEmbed()
            .setAuthor('Music', `${conf.bot.logo}`)
            .setTitle('Error')
            .setURL(conf.domain)
            .setColor(conf.colour.okError)
            .setTitle("oof there are no songs left in queue")
            .setTimestamp()
            .setFooter(`Requested by ${message.member.displayName}`, `${message.author.displayAvatarURL()}`);

        const errorEmbed = new Discord.MessageEmbed()
            .setAuthor('Music', `${conf.bot.logo}`)
            .setTitle('Error')
            .setURL(conf.domain)
            .setColor(conf.colour.okError)
            .setTitle("There was some error ~~like there always is~~")
            .setTimestamp()
            .setFooter(`Requested by ${message.member.displayName}`, `${message.author.displayAvatarURL()}`);

        const videoErrorEmbed = new Discord.MessageEmbed()
            .setAuthor('Music', `${conf.bot.logo}`)
            .setTitle('Error')
            .setURL(conf.domain)
            .setColor(conf.colour.okError)
            .setTitle("I cant seem to find that video")
            .setDescription("try adding more key words or just use the song's url")
            .setTimestamp()
            .setFooter(`Requested by ${message.member.displayName}`, `${message.author.displayAvatarURL()}`);


        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(notVoiceErrorEmbed);
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('connect')) return message.channel.send('i cant connect to this voice channel ask someone that can help me');
        if (!permissions.has('speak')) return message.channel.send('i cant talk in this voice channel aks someone that can help me');
        const serverQueue = queue.get(message.guild.id);


        if (args[0] === 'play' || args[0] === 'p') {
            if (!args[1]) return message.channel.send(noContentErrorEmbed).catch(e => console.log(e))
            let song = {};
            const videoFinder = async(query) => {
                const videoResult = await ytSearch(query).catch(e => console.log(e));
                try {
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                } catch (err) {
                    console.log(err)
                }
            }

            let songQuery = args.slice(1).join(' ').replace('http://', '').replace('https://', '').replace('www.', '').replace('youtube.com/', '').replace('/watch?v=', '').replace('&feature=share', '').replace('youtu.be', '')

            const video = await videoFinder(songQuery);

            if (video) {
                song = { title: video.title, url: video.url }
            } else {
                message.channel.send(videoErrorEmbed).catch(e => console.log(e))
            }
            if (!serverQueue) {
                const queueConstructor = {
                    voiceChannel: voiceChannel,
                    textChannel: message.channel,
                    connection: null,
                    songs: []
                }
                queue.set(message.guild.id, queueConstructor);
                queueConstructor.songs.push(song);
                try {
                    const connection = await voiceChannel.join();
                    queueConstructor.connection = connection;
                    videoPlayer(message.guild, queueConstructor.songs[0], message);
                } catch (error) {
                    queue.delete(message.guild.id);
                    message.channel.send(errorEmbed).catch(e => console.log(e))
                    console.log('error: ' + error)
                }
            } else {
                serverQueue.songs.push(song);
                let addSongEmbed = new Discord.MessageEmbed()
                    .setAuthor('Music', `${conf.bot.logo}`)
                    .setColor(conf.colour.ok)
                    .setTitle(`**${song.title}** added to the queue`)
                    .setURL(`${song.url}`)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.member.displayName}`, `${message.author.displayAvatarURL()}`);
                return message.channel.send(addSongEmbed).catch(e => console.log(e))
            }
        } else if (args[0] === 'queue' || args[0] === 'q') serverQueueGet(message, serverQueue, args);
        else if (args[0] === 'skip') skipSong(message, serverQueue);
        else if (args[0] === 'stop') stopSong(message, serverQueue);
        else if (args[0] === 'remove') removeSong(message, serverQueue, args);
    }
}
const videoPlayer = async(guild, song, message) => {
    const songQueue = queue.get(guild.id);
    if (!song) {
        songQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly' });
    try {
        songQueue.connection.play(stream, { seek: 0, volume: 0.5 })
            .on('finish', () => {
                songQueue.songs.shift();
                videoPlayer(guild, songQueue.songs[0], message);
            })
    } catch (err) {
        message.channel.send("i cant connect to the voice channel within the time frame i have high ping or some other error")
    }
    if (song.url) {
        let embedUrl = song.url
        if (!embedUrl.includes('http')) {
            embedUrl = conf.domain
        }
        let addSongEmbed = new Discord.MessageEmbed()
            .setAuthor('Music', `${conf.bot.logo}`)
            .setColor(conf.colour.ok)
            .setTitle(`Now playing **${song.title}**`)
            .setURL(`${embedUrl}`)
            .setTimestamp()
            .setFooter(`Requested by ${message.member.displayName}`, `${message.author.displayAvatarURL()}`);
        await songQueue.textChannel.send(addSongEmbed)
    }
}

const serverQueueGet = async(message, serverQueue, args) => {
    if (!message.member.voice.channel) return message.channel.send(notVoiceErrorEmbed);
    let serverQueueEmbed = new Discord.MessageEmbed()
        .setAuthor('Music Queue', `${conf.bot.logo}`)
        .setColor(conf.colour.ok)
        .setTitle(`the server queue`)
        .setURL(`${conf.domain}`)
        .setTimestamp()
        .setFooter(`Requested by ${message.member.displayName}`, `${message.author.displayAvatarURL()}`)
    await serverQueue.songs.forEach(theSong => {
        serverQueueEmbed.addField(`${serverQueue.songs.indexOf(theSong)}`, `__title:__ ${theSong.title}\n__url:__ ${theSong.url}`)
    })
    await message.channel.send(serverQueueEmbed)

}
const skipSong = (message, serverQueue) => {
    if (!message.member.voice.channel) return message.channel.send(notVoiceErrorEmbed);
    if (!serverQueue) {
        return message.channel.send(noSongsErrorEmbed);
    }
    serverQueue.connection.dispatcher.end();
}

const stopSong = (message, serverQueue) => {
    if (!message.member.voice.channel) return message.channel.send(notVoiceErrorEmbed);
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

const removeSong = (message, serverQueue) => {
    serverQueue.songs.forEach(theSong => {
        if (args[1] == serverQueue.songs.indexOf(theSong)) {
            try {
                serverQueue.songs.indexOf(theSong) > -1 ? serverQueue.songs.splice(serverQueue.songs.indexOf(theSong), 1) : false
            } catch (err) {
                message.channel.send("there was an error removing that song")
            }
        } else {
            message.channel.send("That song isn't in the queue you can use the url insted.\nYou can find the url by clicking on the blue text in the embed i sent when you requested to play that song.")
        }
    })
}