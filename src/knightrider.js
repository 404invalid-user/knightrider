const express = require('express');
const mongoose = require('mongoose');
const { Client } = require('discord.js');
const { red, yellow } = require('chalk');

const webServer = express();
const client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION", "USER"] });

mongoose.connect(require('./conf/tokens.js').db.URI, { useNewUrlParser: true, useUnifiedTopology: true }).then((result) => {
    console.log(yellow('[database info]: ') + "connected to database");
}).catch((error) => {
    console.log(red('[database info]: ') + "there was an error connecting to the database\nerror: " + error);
});
['bot', 'webserver'].forEach(file => {
    require('./applications/' + file)(client, webServer);
});
require('./funcs/startuplog')()