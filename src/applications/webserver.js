/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
const chalk = require('chalk')
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const express = require('express')
const fs = require('fs')
const conf = require('../conf/conf.json')

module.exports = (client, webServer) => {

    webServer.use(bodyParser.json());
    webServer.use(bodyParser.urlencoded({ extended: true }));
    webServer.use(express.static(__dirname + '/../express/www/static'));
    webServer.set('view engine', 'ejs');
    webServer.set('views', __dirname + '/../express/www/views');
    webServer.use((req, res, next) => {
        const { headers: { cookie } } = req;
        if (cookie) {
            const values = cookie.split(';').reduce((res, item) => {
                const data = item.trim().split('=');
                return {...res, [data[0]]: data[1] };
            }, {});
            res.locals.cookie = values;
        } else res.locals.cookie = {};
        next();
    });
    //rate limit the api so we dont have spam
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 400
    });

    webServer.use("/api/", apiLimiter);

    ['get', 'post'].forEach(handler => {
        require(`../express/handlers/${handler}`)(client, webServer)
    })

    try {
        webServer.listen(conf.port, () => {
            console.log(chalk.cyan('[webServer]: ') + 'running at ' + conf.domain + ' (port:' + conf.port + ')')
        });
    } catch (error) {
        console.log(chalk.cyan('[webServer]: ') + chalk.cyan('(error): ') + 'could not start the web server error: ' + error)
    }
}