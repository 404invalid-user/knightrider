const User = require('../models/user');
module.exports = async(message) => {
    let currentUser = await User.findOne({ userid: message.author.id, guildID: message.guild.id });
    if (currentUser == null) {
        await User.create({
            userid: message.author.id,
            guildID: message.guild.id,
            userName: message.author.tag,
            avatar: message.author.avatarURL()
        });
        currentUser = await User.findOne({ id: message.guild.id, guildID: message.guild.id });
    };
    return currentUser;
}
