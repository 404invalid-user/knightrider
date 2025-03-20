import { Client, MessageReaction, PartialMessageReaction, User, PartialUser, Guild, Role, GuildMember } from "discord.js";
import { schemas } from "../../database";

import * as YALAS from 'mcstatusbot-logger';
export default async function ReactionRoleAddHandler(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {

  const emoji: string | null = reaction.emoji.id ?? reaction.emoji.name;
  const guild: Guild | null = reaction.message.guild;
  const channelId: string = reaction.message.channelId;


  if (guild === null || emoji === null) {
    YALAS.error("failed to find guild");
    return false;
  }
  if (emoji!=='❌') return false;


  //TODO: implement redis cache or better table lookup
  const banReaction = await schemas['BanReaction'].findOne({
    where: {
      guild: guild.id,
      channel: channelId
    },
    raw: true
  });
  if (banReaction===null) return false;


  try {
    const member: GuildMember | null = guild.members.cache.get(user.id) || (await guild.members.fetch(user.id).catch(() => null));
    if (!member) return YALAS.error("Ban Reaction Handler: Member not found in the guild '" + guild.id + "'");

    await member.ban({reason: "ban reaction"});
    return true;
  } catch (error){
    YALAS.error("Ban Reaction Handler: Error banning user '" + user.id + "' for guild '" + guild.id + "'");
    YALAS.error(error);
    return true;
  }
}