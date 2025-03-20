import { Client, MessageReaction, PartialMessageReaction, User, PartialUser } from "discord.js";
import ReactionRoleAddHandler from "../functions/ReactionRoleAddHandler";
import BanReactionHandler from "../functions/BanReactionHandler";

import * as YALAS from 'mcstatusbot-logger';
export default async function MessageReactionAdd(client: Client, reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      YALAS.error('Something went wrong when fetching the message:', error);
      return;
    }
  }
  if (!reaction.message.guild) return;


  if (user.partial) {
    try {
      await user.fetch();
    } catch (error) {
      YALAS.error('Something went wrong when fetching the user:', error);
      return;
    }
  }
  if (user.id === client.user?.id) return;

  const memberBanned = await BanReactionHandler(reaction, user);
  //non need to try and run reactions roles if member banned
  if (memberBanned === true) return;

  await ReactionRoleAddHandler(reaction, user);
  return;
}
