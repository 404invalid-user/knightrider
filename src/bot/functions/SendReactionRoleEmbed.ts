import { EmbedBuilder, ColorResolvable, TextChannel } from 'discord.js';
import { schemas } from '../../database';
import { ReactionRoleInstance } from '../../database/schemas/ReactionRole';



function isOnlyNumbers(str: string): boolean {
  return /^\d+$/.test(str);
}
interface GroupedReactionRole {
  reaction: string;
  roles: string[]
}
function groupReactionRoles(reactionRoles: ReactionRoleInstance[]): GroupedReactionRole[] {
  return reactionRoles.reduce((acc, item) => {
    const { reaction, role } = item;

    // Find if the reaction already exists in the accumulator
    let existing = acc.find(group => group.reaction === reaction);

    if (existing) {
      existing.roles.push(role);
    } else {
      // Otherwise, create a new group for this reaction
      acc.push({
        reaction,
        roles: [role],
      });
    }
    return acc;
  }, [] as GroupedReactionRole[]);
}



export default async function SendReactionRoleEmbed(roleChannel: TextChannel, guildId: string, channelId: string) {

  let config = { where: { guild: guildId, channel: channelId }, raw: true };
  let reactionRoleEmbedConfig = await schemas['ReactionRoleEmbed'].findOne(config);
  if (reactionRoleEmbedConfig == null) {
    reactionRoleEmbedConfig = await schemas['ReactionRoleEmbed'].create({ guild: guildId, channel: channelId }, { raw: true });
  }

  if (reactionRoleEmbedConfig === null) return { title: "error" };
  let reactionRoles = await schemas['ReactionRole'].findAll(config);
  let groupedReactionRoles = groupReactionRoles(reactionRoles);
  //[[icon]] [[role]]

  let description: string = "";

  for (const rr of groupedReactionRoles) {
    let roleRow = reactionRoleEmbedConfig.listItemTemplate.replace('[[icon]]', isOnlyNumbers(rr.reaction) ? `<:emoji:${rr.reaction}>` : rr.reaction).replace('[[roles]]', rr.roles.map(r => `<@&${r}>`).join(reactionRoleEmbedConfig.roleSeparator));
    description += roleRow + '\n';
  }

  // inside a command, event listener, etc.
  const embed = new EmbedBuilder()
    .setColor((reactionRoleEmbedConfig.color as ColorResolvable))
    .setTitle(reactionRoleEmbedConfig.title)
    .setURL(reactionRoleEmbedConfig.icon)
    //.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
    .setDescription(description.substring(0, 4096))
  //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });


  const reactionRoleEmbedMsg = await roleChannel.send({ embeds: [embed] });
  for (const reactionRole of reactionRoles) {
    await reactionRoleEmbedMsg.react(reactionRole.reaction);
  }
  return reactionRoleEmbedMsg;
}