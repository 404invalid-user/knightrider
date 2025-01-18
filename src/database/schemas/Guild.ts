import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

export interface GuildAttributes {
  id: string;
  name: string;
  icon: string | null;
  owner: string;
  prefix: string;
  modAddOnEnableCaps: boolean;
  modAddOnEnableFilter: boolean;
  modAddOnEnableEmojiSpam: boolean;
  logChannel: boolean | null;
  webhookURI: string
}

export interface GuildCreationAttributes extends Optional<GuildAttributes, 'id' | 'icon' | 'prefix' | 'modAddOnEnableCaps' | 'modAddOnEnableFilter' | 'modAddOnEnableEmojiSpam' | 'logChannel' | 'webhookURI'> { }

export interface GuildInstance
  extends Model<GuildAttributes, GuildCreationAttributes>,
  GuildAttributes { }

export default function Guild(sequelize: Sequelize) {
  const Guild = sequelize.define<GuildInstance>('Guild', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '.',
    },
    modAddOnEnableCaps: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    modAddOnEnableFilter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    modAddOnEnableEmojiSpam: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    logChannel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    webhookURI: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  // Sync the model with the database
  Guild.sync({ alter: true });

  return Guild;
}
