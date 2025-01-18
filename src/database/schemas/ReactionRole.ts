import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

export interface ReactionRoleAttributes {
  id: number;
  guild: string;
  channel: string;
  role: string;
  reaction: string;
  reactionRemove: boolean;
}

export interface ReactionRoleCreationAttributes extends Optional<ReactionRoleAttributes, 'id' | 'reactionRemove'> { }

export interface ReactionRoleInstance
  extends Model<ReactionRoleAttributes, ReactionRoleCreationAttributes>,
  ReactionRoleAttributes { }

export default function ReactionRole(sequelize: Sequelize) {
  const ReactionRole = sequelize.define<ReactionRoleInstance>('ReactionRole', {
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reaction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reactionRemove: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  // Sync the model with the database
  ReactionRole.sync({ alter: true });

  return ReactionRole;
}
