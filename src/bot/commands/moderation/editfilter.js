const fs = require('fs')
const conf = require('../../../conf/conf.json')
module.exports = {
    name: 'editfilter',
    description: "edit the filter array",
    execute(message, args, Discord, currentServer, messageUser, client) {
        if (currentServer.staff.includes(message.author.id) || message.member.roles.cache.find(r => server.staffRoles.includes(r.name))) {

            if (!args[1]) {
                message.channel.send("please specify an operation <add/remove/dash>");
                return;
            };
            if (!args[2]) {
                message.channel.send("please specify something to add to the filter");
                return;
            };
            if (message.content.toLowerCase().substring(currentServer.prefix.length).split(" ").slice(2).join(" ").includes('@everyone') || message.content.toLowerCase().substring(currentServer.prefix.length).split(" ").slice(2).join(" ").includes('@here')) {
                message.channel.send("please dont try and exploit me, if you would like to add that to the filter for a genuing reason please use the admin dashboard");
                return;
            };

            if (args[1] == 'add') {
                currentServer.filter[currentServer.filter.level].push(message.content.toLowerCase().substring(currentServer.prefix.length).split(" ").slice(2).join(" "));
                currentServer.save();
                message.channel.send(message.content.toLowerCase().substring(currentServer.prefix.length).split(" ").slice(2).join(" ") + " has been added to the `" + currentServer.filter.level + "` filter");

            } else if (args[1] == 'remove') {
                const index = currentServer.filter[currentServer.filter.level].indexOf(message.content.toLowerCase().substring(currentServer.prefix.length).split(" ").slice(2).join(" "));
                if (index > -1) {
                    currentServer.filter[currentServer.filter.level].splice(index, 1);
                    message.channel.send("`" + message.content.toLowerCase().substring(currentServer.prefix.length).split(" ").slice(2).join(" ") + "` has been removed from the `" + currentServer.filter.level + "` filter");
                } else {
                    message.channel.send("you cant remove that as it dosnt exist in the `" + currentServer.filter.level + "` filter");
                };

            } else if (args[1] == 'dash' || args[1] == 'dashboard') {
                message.channel.send(conf.domain + "/dashboard");
            };


        } else {
            return message.reply("you cant do that only staff can").catch(e => console.log(e));
        };
    }
}