import { Client, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import { schemas } from "../../database/index";

import YALAS from 'mcstatusbot-logger';
import { GuildInstance } from "../../database/schemas/Guild";
import { UserInstance } from "../../database/schemas/User";


const data = {
  allowSuspendedUserAccess: false,
  command: new SlashCommandBuilder()
    .setName('setprefix')
    .setDescription("sets the message prefix for your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(o =>
      o.setName('prefix')
        .setDescription("the prefix eg . or !")
        .setRequired(true)
    )
}

export { data };


export async function chatInputCommand(client: Client, interaction: ChatInputCommandInteraction, guild: GuildInstance, user: UserInstance) {
  const prefix = interaction.options.getString('prefix');
  if (prefix == undefined) return;
  const prefixLower = prefix.toLowerCase();
  
  if (prefix.length > 3) return interaction.reply("the is to long, limit is 3");
  if (guild.prefix === prefixLower) return interaction.reply("the prefix `" + guild.prefix + "` has been set");


  try {
    await schemas['Guild'].update({
      prefix: prefixLower
    }, {
      where: { id: guild.id }
    });
    return interaction.reply("the prefix `" + prefixLower + "` has been set");
  } catch (err: any) {
    YALAS.error(err.stack || err);
    return interaction.reply("failed to update prefix.");
  }
}