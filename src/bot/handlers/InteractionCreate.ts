import { Client, Interaction, ChatInputCommandInteraction, User } from "discord.js";
import { schemas } from '../../database/index';
//@ts-expect-error
import YALAS from 'mcstatusbot-logger';
import LookupUser from "../functions/LookupUser";
import LookupGuild from "../functions/LookupGuild";



async function chatInputCommand(client: Client, interaction: ChatInputCommandInteraction) {
  if (!client.commands.has(interaction.commandName)) return YALAS.warn("no command found for interaction: " + interaction.commandName);

  if (interaction.guild===null) return interaction.reply("only works in discord servers sorry.");

  //get user from db
  const user = await LookupUser(interaction.user)
  if (user == null) return interaction.reply({
    embeds: [{ title: "could not get your user info", description: "we could not get or create your user info to the bots database." }]
  });


  //get discord guild from db
  const guild = await LookupGuild(interaction.guild);
  if (guild == null) return interaction.reply({
    embeds: [{ title: "could not get discord server", description: "we could not get or create your discord server to the bots database." }]
  })


  const command = client.commands.get(interaction.commandName);

  if (command.data.allowSuspendedUserAccess == false && user.suspended == true) {
    return interaction.reply({
      embeds: [{
        title: "You Are Suspended",
        description: "Your account has been suspended/blocked from using this bot."
      }]
    });
  }

  try {
    await command.chatInputCommand(client, interaction, guild, user);
  } catch (err: any) {
    YALAS.error("could not run command");
    YALAS.error(err.stack || err)
  }
}





export default async function InteractionCreate(client: Client, interaction: Interaction) {
  if (interaction.member && interaction.member.user.bot) return;

  //slash command
  if (interaction.isChatInputCommand()) return chatInputCommand(client, interaction);
  //modal/form
  //if (interaction.isModalSubmit()) return modalSubmit(client, interaction, guild, user);

}