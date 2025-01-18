import { CategoryChannel, Client, DMChannel, GuildBasedChannel, Message, NewsChannel, TextChannel, ThreadChannel } from "discord.js";
import { UserAttributes } from "../../../database/schemas/User";
import { GuildAttributes, GuildInstance } from "../../../database/schemas/Guild";
import { MessageCreateOptions } from "../../../../types/MessageCreate";
import { schemas } from "../../../database";
import LookupGuild from "../../functions/LookupGuild";
//@ts-expect-error
import * as YALAS from 'mcstatusbot-logger';

export default async function MessageMacro(client: Client, msg: Message, msgCmds: string[]) {
  if (msg.guild === null) return;
  if (msg.member === null) return;
  
  const guild: GuildAttributes | null = await LookupGuild(msg.guild);
  if (guild == null) return YALAS.error("MessageCreate guild null")



  const msgMacroDoc = await schemas['MessageMacro'].findOne({
    where: {
      guild: guild.id,
      shortCode: msgCmds[0]
    }
  });
  if (msgMacroDoc === null) return;
  const msgMacro = msgMacroDoc.dataValues;

  if (!msg.member.roles.cache.has(msgMacro.role)) return;
  if (msgMacro.deleteShortCode === true) msg.deletable ?? msg.delete().catch((err: any) => null);

  let channel = msgMacro.channel === null ? msg.channel : await msg.guild.channels.fetch(msgMacro.channel);
  if (channel === null || channel === undefined) return;
  if (!(channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel || channel instanceof ThreadChannel)) return;

  await channel.send(msgMacro.message);
  return;
}