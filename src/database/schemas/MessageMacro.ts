import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

export interface MessageMacroAttributes {
  id: number;
  guild: string;
  channel: string | null;
  shortCode: string;
  message: string;
  role: string;
  impersonate: boolean;
  deleteShortCode: boolean;
}

export interface MessageMacroCreationAttributes extends Optional<MessageMacroAttributes, 'id'> { }

export interface MessageMacroInstance
  extends Model<MessageMacroAttributes, MessageMacroCreationAttributes>,
  MessageMacroAttributes { }

export default function MessageMacro(sequelize: Sequelize) {
  const MessageMacro = sequelize.define<MessageMacroInstance>('MessageMacro', {
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
      allowNull: true,
    },
    shortCode: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    impersonate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deleteShortCode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  });

  // Sync the model with the database
  MessageMacro.sync({ alter: true });

  return MessageMacro;
}
