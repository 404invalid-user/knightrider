import { schemas } from "../../database";

import * as YALAS from 'mcstatusbot-logger';
import { GuildAttributes } from "../../database/schemas/Guild";
import { Guild } from "discord.js";

export default async function LookupGuild(guild: Guild | null): Promise<GuildAttributes | null> {
  if (guild == null) return null;
  try {
    let guildDoc = await schemas['Guild'].findOne({ where: { id: guild.id } });
    if (guildDoc !== null && guildDoc !== undefined) return guildDoc.dataValues;
    //TODO: implement a check to update guild name owner etc
    //TODO: make a webhook for defualt guild channel so can then be used and changed when needed for macro cmds

    guildDoc = await schemas['Guild'].create({
      id: guild.id,
      name: guild.name,
      icon: guild.iconURL(),
      owner: guild.ownerId
    });

    return guildDoc.dataValues;
  } catch (err: any) {

    YALAS.error(err);
    YALAS.error(err.stack || err);
    return null;
  }
}