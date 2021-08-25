const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    discriminator: {
        type: String,
        required: true,
        default: '0000'
    },
    avatar: {
        type: String,
        required: true,
        default: 'https://knightrider.invalidlag.com/logo.png'
    },
    accessCodes: {
        type: Array,
        required: true,
        default: []
    },
    about: {
        type: String,
        required: true,
        default: 'no about for this user'
    },
    blocked: {
        type: Boolean,
        required: true,
        default: false
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    guilds: {
        type: Array,
        required: true,
        default: []
    }
});

module.exports = model('Userdashboard', userSchema);