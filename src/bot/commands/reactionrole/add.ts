import { Client, ChatInputCommandInteraction, Role, GuildChannelResolvable, PermissionsBitField, ChannelType } from "discord.js";

import parseEmoji from "../../functions/parseEmoji";
import { schemas } from "../../../database";

import YALAS from 'mcstatusbot-logger';

import SendReactionRoleEmbed from "../../functions/SendReactionRoleEmbed";
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
  const botPermMR = botMember.permissions.has(PermissionsBitField.Flags.ManageRoles);
  if (!botPermMR) {
    return interaction.reply({
      embeds: [{
        title: "Missing permission",
        description: "you need to give me the Manage Roles permission in this server."
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

  if (cleanEmoji == '❌') {
    return interaction.reply({
      embeds: [{
        title: "Invalid Emoji",
        description: "The selected emoji is used for the ban reaction to avoid confusion you can not use it."
      }]
    });
  }


  //get and validate role
  const role = interaction.options.getMentionable('role');
  if (!(role instanceof Role)) {
    return interaction.reply({
      embeds: [{
        title: "Invalid Role",
        description: "The selected role is not a valid role"
      }]
    });
  }

  //check bot can assign role
  const botHighestRole = botMember.roles.highest;
  if (role.position >= botHighestRole.position) {
    return interaction.reply({
      embeds: [{
        title: "Missing permission",
        description: `The role <@&${role.id}> is higher than my role so I can't assign it to users.`
      }]
    });
  }



  await interaction.deferReply();
  //check emoji does net exist for reaction in channel
  try {
    const reactionRole = await schemas['ReactionRole'].findOne({
      where: {
        guild: guild.id,
        channel: channel.id,
        role: role.id,
        reaction: cleanEmoji,
      }
    });

    if (reactionRole !== null) {
      return interaction.editReply({
        embeds: [{
          title: "Reaction Role Exists",
          description: "This emoji is already setup to give selected role in selected channel."
        }]
      });
    }
  } catch (err: any) {
    YALAS.error(err)
    YALAS.error(err.stack || err);
    return interaction.editReply("error when checking for existing reaction role in database.");
  }

  const allowReactionRemove: boolean = interaction.options.getBoolean('reaction-remove') || false;

  try {
    await schemas['ReactionRole'].create({
      guild: guild.id,
      channel: channel.id,
      role: role.id,
      reaction: cleanEmoji,
      reactionRemove: allowReactionRemove
    });
  } catch (err: any) {
    YALAS.error(err.stack || err);
    return interaction.editReply("error when saving reaction role to database.");
  }


  try {
    const textChannel = interaction.guild?.channels.cache.get(channel.id);
    if (textChannel === undefined || textChannel.type !== 0) return;
    const embed = await SendReactionRoleEmbed(textChannel, guild.id, channel.id);
  

    return interaction.editReply({
      embeds: [{
        title: "Success",
        description: "The reaction role has been created and a new embed sent.\n-# Note you will need to delete the old embed"
      }]
    });
  } catch (err: any) {
    YALAS.error(err.stack || err);
    return interaction.editReply("error when making reaction role embed.");
  }

}