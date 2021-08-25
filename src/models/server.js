const { Schema, model } = require('mongoose');
const { prefix } = require('../conf/conf.json')

const serverSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true,
        default: prefix
    },
    filter: {
        level: {
            type: String,
            required: true,
            default: 'normal'
        },
        normal: {
            type: Array,
            required: true,
            default: [
                "nigger",
                "n igger",
                "ni gger",
                "nig ger",
                "nigg er",
                "nigge r",
                "n i g g e r",
                "niger",
                "n iger",
                "ni ger",
                "nig er",
                "nige r",
                "n i g e r"
            ]
        },
        safe: {
            type: Array,
            required: true,
            default: [
                "cunt",
                "c u n t",
                "cu n t",
                "cun t",
                "cu n t",
                "c.u.n.t",
                "c.unt",
                "c.u.nt",
                "cun.t",
                "cu.n.t",
                "cock",
                "c o c k",
                "c ock",
                "c o ck",
                "co ck",
                "c.o.c.k",
                "c.o.ck",
                "coc.k",
                "co.c.k",
                "dick",
                "d i c k",
                "fric",
                "shit",
                "s hit",
                "sh it",
                "shi t",
                "s h i t",
                "s.h.i.t",
                "sh.i.t",
                "shi.t",
                "s.hit",
                "sh.it",
                "shi.t",
                "sh*t",
                "sh!t",
                "fuck",
                "f u c k ",
                "f u ck",
                "f uck",
                "fu ck",
                "fuc k",
                "bitch",
                "b*tch",
                "bi*ch",
                "bit*h",
                "b.i.t.c.h",
                "b.itch",
                "b.i.tch",
                "b.i.t.ch",
                "bi.t.c.h",
                "bit.c.h",
                "bitc.h",
                "b!tch",
                "b itch",
                "bi tch",
                "bit ch",
                "bitc h",
                "b i t c h",
                "nigger",
                "n igger",
                "ni gger",
                "nig ger",
                "nigg er",
                "nigge r",
                "n i g g e r",
                "niger",
                "n iger",
                "ni ger",
                "nig er",
                "nige r",
                "n i g e r"

            ]
        },

    },
    reactionRoles: {
        type: Array,
        required: true,
        default: []
    },
    staffRoles: {
        type: Array,
        required: true,
        default: []

    },
    staff: {
        type: Array,
        required: true,
        default: []
    },
    channels: {
        modLogs: {
            type: String,
            required: true,
            default: ' '
        },
        announcments: {
            type: String,
            required: true,
            default: ' '
        },
        townhall: {
            type: String,
            required: true,
            default: ' '
        },
        townhallLogs: {
            type: String,
            required: true,
            default: ' '
        }
    },
    configs: {
        fivem: {
            url: {
                type: String,
                required: true,
                default: "http://knightrider.invalidlag.com/fivempiproxy"
            },
            ip: {
                type: String,
                required: true,
                default: "search bruvland 2.0 in the server list"
            },
        },
        meme: {
            type: String,
            required: true,
            default: "r/memes"
        }
    },
    addons: {
        caps: {
            type: Boolean,
            required: true,
            default: true
        },
        filter: {
            type: Boolean,
            required: true,
            default: true
        },
        spam: {
            type: Boolean,
            required: true,
            default: true
        },
        emojiSpam: {
            type: Boolean,
            required: true,
            default: true
        },

    },
    commandCount: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = model('Server', serverSchema);