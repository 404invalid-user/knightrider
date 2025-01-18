import { Client, ChatInputCommandInteraction, Role, GuildChannelResolvable, PermissionsBitField, ChannelType } from "discord.js";

import { schemas } from "../../../database";

import YALAS from 'mcstatusbot-logger';

import { GuildInstance } from "../../../database/schemas/Guild";
import { UserInstance } from "../../../database/schemas/User";


export async function chatInputCommand(client: Client, interaction: ChatInputCommandInteraction, guild: GuildInstance, user: UserInstance) {
  if (!interaction.guild) return interaction.reply("must be done in discord server");

  const botMember = interaction.guild.members.me;
  if (!botMember) {
    YALAS.error("messagemacro add: bot in guild null");
    return;
  }


  //get macro 
  let macroContent = interaction.options.getString('macro');
  if (!macroContent) return;
  macroContent = macroContent.replace(/\s+/g, '');

  //get and validate message content
  const messageContent = interaction.options.getString('message');
  if (messageContent === null) return;
  if (messageContent.length < 3 || messageContent.length > 2000) {
    return interaction.reply({
      embeds: [{
        title: "Invalid Message",
        description: "The set message must be between 3 and 2000 in length."
      }]
    });
  }


  //get and validate role
  const role = interaction.options.getMentionable('trigger-role');
  if (!(role instanceof Role)) {
    return interaction.reply({
      embeds: [{
        title: "Invalid Role",
        description: "The selected role is not a valid role"
      }]
    });
  }

  const deleteMsg = interaction.options.getBoolean('deletecmd') ?? false;

  const impersonate = interaction.options.getBoolean('impersonate') ?? false;



  //get and validate channel
  let channel = interaction.options.getChannel('channel');
  console.log("balkkd cjrA")
  console.log(channel
  )
  if (channel === undefined) channel = null;
  if (channel !== null) {
    if (channel.type !== ChannelType.GuildText && channel.type !== ChannelType.GuildAnnouncement) {
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
  }



  await interaction.deferReply();
  //check msgMacro does net exist for reaction in channel
  try {
    const msgMacro = await schemas['MessageMacro'].findOne({
      where: {
        guild: guild.id,
        shortCode: macroContent,
      }
    });

    if (msgMacro !== null) {
      return interaction.editReply({
        embeds: [{
          title: "Message Macro Exists",
          description: "The message macro `" + msgMacro.dataValues.shortCode + "` already exists please edit or remove it"
        }]
      });
    }
  } catch (err: any) {
    YALAS.error(err)
    YALAS.error(err.stack || err);
    return interaction.editReply("error when checking for existing message macro in database.");
  }

  try {
    await schemas['MessageMacro'].create({
      guild: guild.id,
      channel: channel ? channel.id : null,
      shortCode: macroContent,
      message: messageContent,
      role: role.id,
      impersonate: impersonate,
      deleteShortCode: deleteMsg
    });
  } catch (err: any) {
    YALAS.error(err.stack || err);
    return interaction.editReply("error when saving reaction role to database.");
  }


  let prefixNote = '';
  if (macroContent.toLocaleLowerCase().startsWith(guild.prefix)) {
    prefixNote = "\nNote: it looks like your macro contains the prefix so to activate it you will need to type `" + guild.prefix + macroContent + "`";
  }
  try {
    return interaction.editReply({
      embeds: [{
        title: "Success",
        description: "The message Macro has been created."+macroContent
      }]
    });
  } catch (err: any) {
    YALAS.error(err.stack || err);
  }

}