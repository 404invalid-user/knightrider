import { Client, MessageReaction, PartialMessageReaction, User, PartialUser } from "discord.js";
import ReactionRoleAddHandler from "../functions/ReactionRoleAddHandler";

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
  if (user.id===client.user?.id) return;

  await ReactionRoleAddHandler(reaction, user);

  //TODO: ban role hndler
  //TODO: kick role handler

  return;
}
