import { GuildInstance } from "../../../database/schemas/Guild";
import { UserInstance } from "../../../database/schemas/User";

import { Client, ChatInputCommandInteraction, Role, GuildChannelResolvable, TextChannel } from "discord.js";

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

  if (channel.type !== 0) {
    return interaction.reply({
      embeds: [{
        title: "That Will Not Work",
        description: "The selected channel is not a text channel please select a text channel."
      }]
    });
  }

  const botPermissionsIn = interaction.guild.members.me?.permissionsIn((channel as GuildChannelResolvable)).toArray();
  if (botPermissionsIn && !botPermissionsIn.includes('SendMessages')) {
    return interaction.reply({
      embeds: [{
        title: "Missing permission",
        description: "you need to give me the send message permission in the selected channel."
      }]
    });
  }

  //get and validate emoji
  const emoji = interaction.options.getString('emoji');

  let cleanEmoji = parseEmoji(emoji);
  if (cleanEmoji == null) {
    return interaction.reply({
      embeds: [{
        title: "Invalid Emoji",
        description: "The selected emoji is invalid please doublecheck it."
      }]
    });
  }


  await interaction.deferReply();
  try {
    const reactionRoles = await schemas['ReactionRole'].findAll({
      where: {
        guild: guild.id,
        channel: channel.id,
        reaction: cleanEmoji,
      },
      raw: true
    });

    if (reactionRoles.length <= 0) {
      return interaction.editReply({
        embeds: [{
          title: "Reaction Role(s) Doesn't Exists",
          description: "This reaction could not be found in the selected channel."
        }]
      });
    }

    for (const rr of reactionRoles) {
      try {
        await schemas['ReactionRole'].destroy({ where: { id: rr.id } });
      } catch (err: any) {
        YALAS.error(err.stack || err);
        continue;
      }
    }
  } catch (err: any) {
    YALAS.error(err)
    YALAS.error(err.stack || err);
    return interaction.editReply("error when getting and deleting reaction role in database.");
  }


  try {
    const textChannel = interaction.guild?.channels.cache.get(channel.id);
    if (textChannel === undefined || textChannel.type !== 0) return;
    const embed = await SendReactionRoleEmbed(textChannel, guild.id, channel.id);

    return interaction.editReply({
      embeds: [{
        title: "Success",
        description: "The reaction role(s) have been removed and a new embed sent.\n-# Note you will need to delete the old embed"
      }]
    });
  } catch (err: any) {
    YALAS.error(err.stack || err);
    return interaction.editReply("error when making reaction role embed.");
  }

}