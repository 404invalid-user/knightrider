# knightrider

mfking discord bot with all that shit

### file structure 
this is the guide on what is where

```
| - src - | - applications - \ - bot.js
|         |                  / - webserver.js
|         |
|         | - bot - | - addons
|         |         | - commands
|         |         | - events
|         |         | - handlers
|         |
|         | - conf - \ conf.json
|         |          / tokens.js
|         |
|         | - express
|         |
|         | - funcs
|         |
|         | - models
```

# knightrider
the all-purpose open source discord bot for CWH11's Hangout Crew.


### set up
- go to discord.com/developers and make a bot token
 - bot token goes in src/conf/tokens.js under { bot: {token: "here"} }

- make a mongo db with the schemas "servers" "users"
 - put the mongo db connect uri in src/conf/tokens.js under { db: {URI: "here"} }

- edit neccery information and details in src/conf/conf.json

- npm install

- npm start

yeah it will be more detailed with the next update.
