import {
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

import { schemas } from "../../../database";
//@ts-expect-error
import YALAS from "mcstatusbot-logger";

import { GuildInstance } from "../../../database/schemas/Guild";
import { UserInstance } from "../../../database/schemas/User";
import { MessageMacroAttributes } from "../../../database/schemas/MessageMacro";

export async function chatInputCommand(client: Client, interaction: ChatInputCommandInteraction, guild: GuildInstance, user: UserInstance) {
  if (!interaction.guild) return interaction.reply("Must be done in a Discord server.");

  const botMember = interaction.guild.members.me;
  if (!botMember) {
    YALAS.error("MessageMacro Add: Bot in guild is null");
    return;
  }

  await interaction.deferReply();

  let msgMacros = [];
  try {
    const msgMacroDocs = await schemas["MessageMacro"].findAll({
      where: {
        guild: guild.id,
      },
    });
    console.log("nuts")
    msgMacros = msgMacroDocs.map((item: any) => item.dataValues);
  } catch (err: any) {
    YALAS.error(err);
    YALAS.error(err.stack || err);
    return interaction.editReply("Error when checking for message macros in the database.");
  }

  if (msgMacros.length === 0) {
    return interaction.editReply("No message macros found.");
  }
  console.log("balks")


  const updateEmbed = (index: number) => {
    const currentMacro: MessageMacroAttributes = msgMacros[index];
    const embed = new EmbedBuilder()
    .setAuthor({name: "Message Macro"})
      .setTitle(currentMacro.shortCode)
      .setDescription(currentMacro.message + `\n\n-# --\n-# Prefix: ${guild.prefix}\n-# role: <@&${currentMacro.role}>\n-# Channel: ${currentMacro.channel == null ? '' : '<#' + currentMacro.channel + '>'}`)

    const buttons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("prev")
          .setLabel("<")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(index === 0),
        new ButtonBuilder()
          .setCustomId("index")
          .setLabel(`${index + 1}/${msgMacros.length}`)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel(">")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(index === msgMacros.length - 1)
      );

    const actionButtons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("delete")
          .setLabel("Delete")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("edit")
          .setLabel("Edit")
          .setStyle(ButtonStyle.Success)
      );

    return { embed, buttons, actionButtons };
  };


  // Pagination variables
  let currentIndex = 0;
  const { embed, buttons, actionButtons } = updateEmbed(currentIndex);

  const message = await interaction.editReply({
    embeds: [embed],
    components: [buttons, actionButtons]
  });

  const collector = message.createMessageComponentCollector({
    time: 60000, // 1 minute timeout
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id) {
      return i.reply({ content: "This interaction isn't for you.", ephemeral: true });
    }

    switch (i.customId) {
      case "prev":
        currentIndex = Math.max(0, currentIndex - 1);
        break;
      case "next":
        currentIndex = Math.min(msgMacros.length - 1, currentIndex + 1);
        break;
      case "delete":
        await schemas["MessageMacro"].destroy({
          where: { id: msgMacros[currentIndex].id },
        });
        msgMacros.splice(currentIndex, 1);
        currentIndex = Math.max(0, currentIndex - 1);
        break;
      case "edit":
        // Handle edit logic here
        await i.reply({
          content: "Edit functionality is not implemented yet.",
          ephemeral: true,
        });
        return;
    }

    if (msgMacros.length === 0) {
      collector.stop();
      return interaction.editReply({
        content: "All message macros have been deleted.",
        embeds: [],
        components: [],
      });
    }

    const { embed, buttons, actionButtons } = updateEmbed(currentIndex);
    await i.update({ embeds: [embed], components: [buttons, actionButtons] });
  });

  collector.on("end", () => {
    const buttons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("prev")
          .setLabel("<")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("index")
          .setLabel(`${currentIndex + 1}/${msgMacros.length}`)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel(">")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true)
      );
    const actionButtons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("delete")
          .setLabel("Delete")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("edit")
          .setLabel("Edit")
          .setStyle(ButtonStyle.Success)
          .setDisabled(true)
      );
    interaction.editReply({
      components: [buttons, actionButtons],
    });

  });
}
