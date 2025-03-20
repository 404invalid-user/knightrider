import { GuildInstance } from "../../../database/schemas/Guild";
import { UserInstance } from "../../../database/schemas/User";

import { Client, ChatInputCommandInteraction, Role, GuildChannelResolvable, TextChannel, ChannelType } from "discord.js";

import parseEmoji from "../../functions/parseEmoji";
import { schemas } from "../../../database";

import YALAS from 'mcstatusbot-logger';

import SendReactionRoleEmbed from "../../functions/SendReactionRoleEmbed";



export async function chatInputCommand(client: Client, interaction: ChatInputCommandInteraction, guild: GuildInstance, user: UserInstance) {
  if (!interaction.guild) return interaction.reply("must be done in discord server");

  //get and validate channel
  const channel = interaction.options.getChannel('channel');
  if (channel == undefined) {
    return interaction.reply({
      embeds: [{
        title: "Channel Not Found",
        description: "The selected channel could not be found please try again."
      }]
    });
  }

  if (channel.type !== ChannelType.GuildText) {
    return interaction.reply({
      embeds: [{
        title: "That Will Not Work",
        description: "The selected channel is not a text channel please select a text channel."
      }]
    });
  }




  await interaction.deferReply();
  try {
    const BanReaction = await schemas['BanReaction'].findOne({
      where: {
        guild: guild.id,
        channel: channel.id,
      },
      raw: true
    });

    if (BanReaction == null) {
      return interaction.editReply({
        embeds: [{
          title: "Ban Role Doesn't Exists",
          description: "This ban reaction could not be found in the selected channel."
        }]
      });
    }
    await schemas['BanReaction'].destroy({ where: { id: BanReaction.id } });
    return interaction.editReply("ban reaction deleted.");
  } catch (err: any) {
    YALAS.error(err)
    YALAS.error(err.stack || err);
    return interaction.editReply("error when getting and deleting reaction role in database.");
  }

}