import { Client, ChatInputCommandInteraction, GuildChannelResolvable, PermissionsBitField, ChannelType, EmbedBuilder } from "discord.js";

import { schemas } from "../../../database";

import YALAS from 'mcstatusbot-logger';

import { GuildInstance } from "../../../database/schemas/Guild";
import { UserInstance } from "../../../database/schemas/User";


export async function chatInputCommand(client: Client, interaction: ChatInputCommandInteraction, guild: GuildInstance, user: UserInstance) {
  if (!interaction.guild) return interaction.reply("must be done in discord server");

  const botMember = interaction.guild.members.me;
  if (!botMember) {
    YALAS.error("reactionrole add: bot in guild null");
    return;
  }


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

  const botPermSM = botMember.permissionsIn((channel as GuildChannelResolvable)).toArray();
  if (botPermSM && !botPermSM.includes('SendMessages')) {
    return interaction.reply({
      embeds: [{
        title: "Missing permission",
        description: "you need to give me the send message permission in the selected channel."
      }]
    });
  }


  //check bot has manage roles perm
  const botPermMR = botMember.permissions.has(PermissionsBitField.Flags.BanMembers);
  if (!botPermMR) {
    return interaction.reply({
      embeds: [{
        title: "Missing permission",
        description: "you need to give me the Ban Members permission in this server."
      }]
    });
  }


  await interaction.deferReply();
  //check emoji does net exist for reaction in channel
  try {
    const BanReaction = await schemas['BanReaction'].findOne({
      where: {
        guild: guild.id,
        channel: channel.id
      }
    });

    if (BanReaction !== null) {
      return interaction.editReply({
        embeds: [{
          title: "Ban Reaction Exists",
          description: "This is already setup in selected channel."
        }]
      });
    }
  } catch (err: any) {
    YALAS.error(err)
    YALAS.error(err.stack || err);
    return interaction.editReply("error when checking for existing ban reaction in database.");
  }

  try {
    await schemas['BanReaction'].create({
      guild: guild.id,
      channel: channel.id
    });
  } catch (err: any) {
    YALAS.error(err.stack || err);
    return interaction.editReply("error when saving ban reaction to database.");
  }


  try {
    const textChannel = interaction.guild?.channels.cache.get(channel.id);
    if (textChannel === undefined || textChannel.type !== 0) return;

    const embed = new EmbedBuilder()
      .setDescription("React with a ❌")
      .setFooter({ text: 'to get banned this is no joke' });


    const BanReactionMsg = await textChannel.send({ embeds: [embed] });
    await BanReactionMsg.react('❌');
    return interaction.editReply("ban reaction added to channel <#" + textChannel.id + ">.");
  } catch (err: any) {
    YALAS.error(err.stack || err);
    return interaction.editReply("error when making ban reaction embed.");
  }

}