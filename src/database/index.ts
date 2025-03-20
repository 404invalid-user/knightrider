import { Sequelize, DataTypes } from 'sequelize';
//@ts-ignore
import YALAS from 'mcstatusbot-logger';

import BanReaction from './schemas/BanReaction';
import Guild from './schemas/Guild';
import KickReaction from './schemas/KickReaction';
import MessageMacro from './schemas/MessageMacro';
import ReactionRole from './schemas/ReactionRole';
import ReactionRoleEmbed from './schemas/ReactionRoleEmbed';
import User from './schemas/User';


if (!process.env.DB_URI) {
  YALAS.crash("A database uri must be provided.");
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DB_URI, {
  logging: (msg) => {
    if (process.env.DEBUG === 'true') console.log(msg)
  }
});

const schemas = {
  BanReaction: BanReaction(sequelize),
  Guild: Guild(sequelize),
  KickRole: KickReaction(sequelize),
  MessageMacro: MessageMacro(sequelize),
  ReactionRole: ReactionRole(sequelize),
  ReactionRoleEmbed: ReactionRoleEmbed(sequelize),
  User: User(sequelize)
};


export async function connect() {
  YALAS.info("attempting to connect to db");
  try {
    await sequelize.authenticate();
    YALAS.success("Connection has been established successfully.");
  } catch (error: any) {
    YALAS.crash(error.stack || error);
    YALAS.crash("Unable to connect to the database");
    process.exit(1);
  }

  return true;
}


export { schemas };