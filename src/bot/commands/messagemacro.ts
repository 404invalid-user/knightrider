import { Client, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";


import YALAS from 'mcstatusbot-logger';

import * as AddMessageMacro from './messagemacro/add';
import * as ListMessageMacros from './messagemacro/list';
import { GuildInstance } from "../../database/schemas/Guild";
import { UserInstance } from "../../database/schemas/User";

const data = {
  allowSuspendedUserAccess: false,
  command: new SlashCommandBuilder()
    .setName('messagemacro')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDescription("setup message macros for the server")
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription("Add a message macro")
        .addStringOption(option =>
          option.setName('macro')
            .setDescription('The macro you send (without prefix)')
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(5)
        )
        .addStringOption(option =>
          option.setName('message')
            .setDescription('The content of the message the bot will send')
            .setRequired(true)
            .setMinLength(3)
            .setMaxLength(2000)
        )
        .addMentionableOption(option =>
          option.setName('trigger-role')
            .setDescription('The role that grants people permission to use this')
            .setRequired(true)
        )
        .addBooleanOption(o =>
          o.setName('deletecmd')
            .setDescription("should your macro message be deleted after you send it?")
            .setRequired(true)
        )
        .addBooleanOption(o =>
          o.setName('impersonate')
            .setDescription("setting to true will use your name and photo")
            .setRequired(true)
        )
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel in which you want to it to be sent in (leave blank to send in same channel as command)')
            .setRequired(false)
        )

    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription("Lists all your message macros and allows you to edit/remove them")

    )
}

export { data };


export async function chatInputCommand(client: Client, interaction: ChatInputCommandInteraction, guild: GuildInstance, user: UserInstance) {
  switch (interaction.options.getSubcommand()) {
    case 'add':
      AddMessageMacro.chatInputCommand(client, interaction, guild, user)
      break;
    case 'list':
      ListMessageMacros.chatInputCommand(client, interaction, guild, user)
      break;
  }
}