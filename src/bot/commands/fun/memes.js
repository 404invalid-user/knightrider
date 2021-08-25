const https = require('https');
const conf = require('../../../conf/conf.json')
module.exports = {
    name: 'memes',
    description: " shrekbot meme command http://shrekbot.tk/github",
    execute(message, args, Discord, currentServer, messageUser, client) {
        try {
            const url = `https://www.reddit.com/${currentServer.configs.memes || 'r/memes'}/.json?limit=200`

            https.get(url, (result) => {
                var body = ''
                result.on('data', (chunk) => {
                    body += chunk
                })

                result.on('end', () => {
                    var response = JSON.parse(body)
                    var index = response.data.children[Math.floor(Math.random() * 129) + 1].data

                    if (index.post_hint !== 'image') {
                        message.channel.send('there has been a shrekup retrying...')
                    }

                    if (!index.preview) return message.channel.send('a big shrekup has hapened do that command agian');

                    var image = index.preview.images[0].source.url.replace('&amp;', '&')
                    var title = index.title
                    var link = 'https://reddit.com' + index.permalink
                    var subRedditName = index.subreddit_name_prefixed

                    if (index.post_hint !== 'image') {
                        console.log("error no image")
                    }

                    console.log(image);

                    const imageembed = new Discord.MessageEmbed()
                        .setTitle('a meme provided by reddit')
                        .setImage(image)
                        .setColor(`${conf.colour.ok}`)
                        .setDescription(`[${title}](${link})`)
                        //.setURL(`https://reddit.com/${subRedditName}`)
                        .setFooter('powered by ' + `${subRedditName}`)
                    message.channel.send(imageembed).catch(error => console.log('error: ' + error))

                }).on('error', function(error) {
                    console.log('Got an error: ' + error);
                })
            })
        } catch (error) {
            console.log('error: ' + error);
        }

    }
}