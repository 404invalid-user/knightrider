# knightrider
the all-purpose open source discord bot for CWH11's Hangout Crew.


### set up


go to discord.com/developers and make a bot token

take note of the client id, client secret, and then bot token

just google for a guide theres plenty out there.

<br>

## Bare metal


make a linux or windows server (tested and run on a Debain LXC)

install mariadb (plent of guides on this out there)

includes making a user db

<br>

pick your fave install location on your server

```sh
cd /opt 
```

<br>

clone the knighrider repo if your on windows/ have a gui you can just get the zip file from github and extract it
```sh
git pull https://github.com/404invalid-user/knightrider.git
cd knightrider
```

<br>

setup your env file with the details for your bot client id, client secret bot token and database uri

```
cp .env.example .env 
nano .env
```

<br>

now running the bot 
first do `npm install --save-dev` then `npm run build` finally `npm run start` if you want to run the bot in the background I recommend pm2

```sh
sudo npm i -g pm2
pm2 start dist/index.js --name knightrider
```

## Docker


locate the compose file in this repo add it to your server edit it adding your bot tokens

```sh
cd /opt/
mkdir knighrider
cd knightrider
curl -fsSL https://raw.githubusercontent.com/404invalid-user/knightrider/refs/heads/main/docker-compose.yml -o docker-compose.yml
nano docker-compose.yml
```

run it
```sh
docker compose pull
docker compose up -d
```




### Features

 [x] - reaction roles

 [x] - message macros

 [ ] - custom reaction role embeds

 [x] - reaction ban

 [ ] - user info/strike system

 [ ] - CAPS spam

 ~~[ ] - word filter~~ (use built in auto mod)

 [ ] - simple web dashboard

 ~~[ ] - mc server status command~~ (use McStatus https://mcstauts.net/bot)
