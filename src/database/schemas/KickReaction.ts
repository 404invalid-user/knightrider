import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

export interface KickReactionAttributes {
  id: number;
  guild: string;
  channel: string;
  reaction: string;
}

export interface KickReactionCreationAttributes extends Optional<KickReactionAttributes, 'id'> { }

export interface KickReactionInstance
  extends Model<KickReactionAttributes, KickReactionCreationAttributes>,
  KickReactionAttributes { }

export default function KickRole(sequelize: Sequelize) {
  const KickReaction = sequelize.define<KickReactionInstance>('KickReaction', {
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
    reaction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Sync the model with the database
  KickReaction.sync({ alter: true });

  return KickReaction;
}
