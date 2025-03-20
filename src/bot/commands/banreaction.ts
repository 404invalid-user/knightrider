import { Client, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";


import YALAS from 'mcstatusbot-logger';

import * as AddBanReaction from './banreaction/add';
import * as RemoveBanReaction from './banreaction/remove';
import { GuildInstance } from "../../database/schemas/Guild";
import { UserInstance } from "../../database/schemas/User";

const data = {
  allowSuspendedUserAccess: false,
  command: new SlashCommandBuilder()
    .setName('banreaction')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDescription("setup reaction to ban members from your server")
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription("Add a ban reaction to your channel")
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel in which you want to add a reaction')
            .setRequired(true)
        )

    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription("remove a ban reaction")
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel in which you want to remove a reaction')
            .setRequired(true)
        )

    )
}

export { data };


export async function chatInputCommand(client: Client, interaction: ChatInputCommandInteraction, guild: GuildInstance, user: UserInstance) {
  switch (interaction.options.getSubcommand()) {
    case 'add':
      AddBanReaction.chatInputCommand(client, interaction, guild, user)
      break;
    case 'remove':
      RemoveBanReaction.chatInputCommand(client, interaction, guild, user)
      break;
  }
}