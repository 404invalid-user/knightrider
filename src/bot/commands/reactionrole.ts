import { Client, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

//@ts-expect-error
import YALAS from 'mcstatusbot-logger';

import * as AddReactionRole from './reactionrole/add';
import * as RemoveReactionRole from './reactionrole/remove';
import { GuildInstance } from "../../database/schemas/Guild";
import { UserInstance } from "../../database/schemas/User";

const data = {
  serverOnly: false,
  guildId: null,
  allowSuspendedUserAccess: true,
  command: new SlashCommandBuilder()
    .setName('reactionrole')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDescription("setup reaction roles for your server")
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription("Add a reaction role to your channel")
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel in which you want to add a reaction')
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('emoji')
            .setDescription('The reaction emoji')
            .setRequired(true)
        )
        .addMentionableOption(option =>
          option.setName('role')
            .setDescription('The @ mention of the role you want to add')
            .setRequired(true)
        )
        .addBooleanOption(o =>
          o.setName('reaction-remove')
            .setDescription("allow users to remove the role by unreacting")
            .setRequired(true)
        )

    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription("remove a reaction role")
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel in which you want to remove a reaction')
            .setRequired(true)
        )
        .addStringOption(o =>
          o
            .setName('emoji')
            .setDescription("the reaction emoji")
            .setRequired(true)
        )

    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit-embed')
        .setDescription("Edit the message embed sent with the list of reaction roles")
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel in which you want to edit the embed for')
            .setRequired(true)
        )
    )
}

export { data };


export async function chatInputCommand(client: Client, interaction: ChatInputCommandInteraction, guild: GuildInstance, user: UserInstance) {
  switch (interaction.options.getSubcommand()) {
    case 'add':
      AddReactionRole.chatInputCommand(client, interaction, guild, user)
      break;
    case 'remove':
      RemoveReactionRole.chatInputCommand(client, interaction, guild, user)
      break;
  }
}