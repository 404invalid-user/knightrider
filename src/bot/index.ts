import { readdirSync } from 'fs';
import { Client, Collection, GatewayIntentBits, Interaction, Events, Partials } from 'discord.js';
import Ready from './handlers/Ready';
import InteractionCreate from './handlers/InteractionCreate';
import MessageCreate from './handlers/MessageCreate';
import MessageReactionAdd from './handlers/MessageReactionAdd';
import MessageReactionRemove from './handlers/MessageReactionRemove';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});


//load in slash commands
client.commands = new Collection();
const commands: string[] = readdirSync(__dirname + '/commands').filter((file: string) => file.endsWith('.js') || file.endsWith('.ts'));

for (const c of commands) {
  const command = require(__dirname + '/commands/' + c);
  if (!command.data.command) continue;
  if (!command.data.command.name) continue;
  client.commands.set(command.data.command.name, command);
}


client.once(Events.ClientReady, () => Ready(client));
client.on(Events.InteractionCreate, (interaction: Interaction) => InteractionCreate(client, interaction));
client.on(Events.MessageCreate, (msg) => MessageCreate(client, msg))

client.on(Events.MessageReactionAdd, (reaction, user) => MessageReactionAdd(client, reaction, user))
client.on(Events.MessageReactionRemove, (reaction, user) => MessageReactionRemove(client, reaction, user))

export async function login(): Promise<boolean> {
  await client.login(process.env.BOT_TOKEN);
  return true;
}