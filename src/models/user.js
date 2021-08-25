const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    guildID: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    strike: {
        type: Number,
        required: true,
        default: 0
    },
    note: {
        type: String,
        required: true,
        default: 'no note for this user'
    },
    blocked: {
        type: Boolean,
        required: true,
        default: false
    },
});

module.exports = model('User', userSchema);