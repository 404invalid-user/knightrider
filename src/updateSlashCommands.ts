import * as fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';


import YALAS from 'mcstatusbot-logger';

//makes slash command


export default async function updateSlashCommands() {

  if (!process.env.CLIENT_ID) throw new Error("a CLIENT_ID must be included in the env ");
  if (!process.env.BOT_TOKEN) throw new Error("a BOT_TOKEN must be included in the env ");

  //add slash commands

  let commands: any[] = [];
  const commandFiles = fs.readdirSync(__dirname + '/bot/commands').filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

  for (const file of commandFiles) {
    const command = require(`${__dirname}/bot/commands/${file}`);
    try {
      commands.push(command.data.command.toJSON());
    } catch (err) {
      YALAS.error("command " + file + " cant be added because it has no data");
    }
  }

  const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
  try {
    YALAS.info("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    YALAS.success("Successfully reloaded application (/) commands.");
    //process.exit();
  } catch (error: any) {
    YALAS.error(error.stack || error);
  }
}
