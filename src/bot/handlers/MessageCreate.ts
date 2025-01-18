import { Client, Guild, Message } from "discord.js";
import MessageMacro from "../messageHandler/plugins/MesageMacro";
import { schemas } from "../../database";
import LookupUser from "../functions/LookupUser";

import * as YALAS from 'mcstatusbot-logger';
import { UserAttributes } from "../../database/schemas/User";
import { GuildAttributes } from "../../database/schemas/Guild";
import LookupGuild from "../functions/LookupGuild";
import { MessageCreateOptions } from "../../../types/MessageCreate";


import PrefixCache from "../functions/PrefixCache";


function splitAndRemovePrefix(prefix: string, content: string): string[] {
  if (content.startsWith(prefix)) {
    content = content.slice(prefix.length).trim();
  }
  return content.split(/\s+/);
}


const guildPrefixs = new PrefixCache();


async function getGuildPrefix(guild: Guild) {

  let p = guildPrefixs.get(guild.id);
  if (p !== null) return p;

  let guildDoc: GuildAttributes | null = await schemas['Guild'].findOne({
    where: { id: guild.id },
    attributes: ['prefix'],
    raw: true,
  });

  if (guildDoc === null) {
    guildDoc = await LookupGuild(guild);
    if (guildDoc === null) {
      YALAS.error("MessageCreate: guild '" + guild.id + "' will not add to db");
      return null;
    }
  }
  guildPrefixs.set(guild.id, guildDoc.prefix);
  p = guildDoc.prefix;
  return p;
}


async function GuildMsg(client: Client, msg: Message) {
  if (msg.guild === null) return;

  const prefix: string | null = await getGuildPrefix(msg.guild);

  //r
  if (prefix===null) return;
  if (!msg.content.toLowerCase().startsWith(prefix)) return;

  const msgCmds: string[] = splitAndRemovePrefix(prefix, msg.content);
  try {
    await MessageMacro(client, msg, msgCmds);
  } catch (err: any) {
    YALAS.error("MessageCreate: failed to run message macro plugin");
    YALAS.error(err.stack || err);
  }
  return;
}

export default async function MessageCreate(client: Client, msg: Message) {
  await GuildMsg(client, msg);
  return;
}