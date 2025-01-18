import { Client, MessageReaction, PartialMessageReaction, User, PartialUser, Guild, Role, GuildMember, TextChannel } from "discord.js";
import { schemas } from "../../database";

import * as YALAS from 'mcstatusbot-logger';
export default async function ReactionRoleAddHandler(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
  if (reaction.message.guild === undefined) return;
  const emoji: string | null = reaction.emoji.id ?? reaction.emoji.name;
  const guild: Guild | null = reaction.message.guild;
  const channel = reaction.message.channel;

  if (guild === null || emoji === null) return YALAS.error("failed to find guild");


  async function getRole(roleId: string) {
    if (!guild) return null;
    let role: Role | null | undefined = guild.roles.cache.get(roleId);
    if (role) return role
    try {
      role = await guild.roles.fetch(roleId);
    } catch (error) {
      YALAS.error('Error fetching role:');
      YALAS.error(error);
      return null;
    }
    if (role) return role
    return null;
  }

  // Get the member from the user
  const member: GuildMember | null = guild.members.cache.get(user.id) || (await guild.members.fetch(user.id).catch(() => null));
  if (!member) return YALAS.error("Member not found in the guild '" + guild.id + "'");


  const reactionRoles = await schemas['ReactionRole'].findAll({
    where: {
      guild: guild.id,
      channel: channel.id,
      reaction: emoji,
    },
    raw: true
  });

  for (const rRole of reactionRoles) {
    let role = await getRole(rRole.role);
    if (role == null) return YALAS.error("failed to find role '" + rRole.role + "' in guild '" + guild.id + "' ")

    //TODO: mod channel logs ad role error etc
    // Add the role to the member
    try {
      await member.roles.add(role);
      if (process.env.DEBUG === 'true') YALAS.info(`Added role "${role.name}" to user "${user.tag}".`);
    } catch (error) {

      //TODO: implement ignore reaction reomve when using this
      //reaction.users.remove(user.id);
      
      const errUsrMsg = await (channel as TextChannel).send(`Sorry <@!${user.id}>, that did not work please try again later or ask a moderator.`);

      setTimeout(() => {
        errUsrMsg.delete().catch((e: any) => null);
      }, 3500);
      YALAS.error("Error adding role '" + role.id + "' to user '" + user.id + "' for guild '" + guild.id + "'");
      YALAS.error(error);
    }
  }
}