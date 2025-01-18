import { Client, MessageReaction, PartialMessageReaction, User, PartialUser } from "discord.js";
import ReactionRoleRemoveHandler from "../functions/ReactionRoleRemoveHandler";
//@ts-expect-error
import * as YALAS from 'mcstatusbot-logger';
export default async function MessageReactionRemove(client: Client, reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
  if (!reaction.message.guild) return;
  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    console.log("reaction partial")
    try {
      await reaction.fetch();
    } catch (error) {
      YALAS.error('Something went wrong when fetching the message:', error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }

  if (user.partial) {
    console.log("user partial")
    try {
      await user.fetch();
    } catch (error) {
      YALAS.error('Something went wrong when fetching the user:', error);
      return;
    }
  }
  if (user.id === client.user?.id) return;
  await ReactionRoleRemoveHandler(reaction, user);
  return;
}
