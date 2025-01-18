import { Client, ActivityType } from 'discord.js';

import YALAS from 'mcstatusbot-logger';

export default function Ready(client: Client) {
  console.log("Ready!");
  YALAS.success("The bot is up and running!");
  YALAS.info(`logged in as ${client.user?.username}#${client.user?.tag}`);

  //TODO: have list of messages in const folder and cycle them allow super admins (ids list in env file) to add from web ui
  // Update activity every hour so that it doesn't expire

  if (client.user) client.user.setActivity("you", { type: ActivityType.Watching });
  setInterval(() => {
    if (client.user) client.user.setActivity("you", { type: ActivityType.Watching });
  }, 3600000);


}