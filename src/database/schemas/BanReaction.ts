import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

export interface BanReactionAttributes {
  id: number;
  guild: string;
  channel: string;
  reaction: string;
}

export interface BanReactionCreationAttributes extends Optional<BanReactionAttributes, 'id'> { }

export interface BanReactionInstance
  extends Model<BanReactionAttributes, BanReactionCreationAttributes>,
  BanReactionAttributes { }


export default function BanRole(sequelize: Sequelize) {
  const BanReaction = sequelize.define<BanReactionInstance>('BanReaction', {
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
  BanReaction.sync({ alter: true });

  return BanReaction;
}
