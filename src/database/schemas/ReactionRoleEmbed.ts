import { flatten } from 'discord.js';
import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

export interface ReactionRoleEmbedAttributes {
  id: number;
  guild: string;
  channel: string;
  title: string;
  icon: string | null;
  color: string;
  roleSeparator: string;
  listItemTemplate: string;
}

export interface ReactionRoleEmbedCreationAttributes extends Optional<ReactionRoleEmbedAttributes, 'id' | 'title' | 'icon' | 'color' | 'roleSeparator' | 'listItemTemplate'> { }

export interface ReactionRoleEmbedInstance
  extends Model<ReactionRoleEmbedAttributes, ReactionRoleEmbedCreationAttributes>,
  ReactionRoleEmbedAttributes { }

export default function ReactionRoleEmbed(sequelize: Sequelize) {
  const ReactionRoleEmbed = sequelize.define<ReactionRoleEmbedInstance>('ReactionRoleEmbed', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    guild: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    channel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Reaction Roles",
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "#ff0000",
    },
    roleSeparator: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ', '
    },
    listItemTemplate: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "[[icon]] - [[roles]]",
    },
  });

  // Synchronize the model with the database
  ReactionRoleEmbed.sync({ alter: true });

  return ReactionRoleEmbed;
}
