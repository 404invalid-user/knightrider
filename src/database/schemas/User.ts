import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

export interface UserAttributes {
  id: string;
  username: string;
  avatar: string | null;
  admin: boolean;
  suspended: boolean;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'avatar' | 'suspended'> { }

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes { }

export default function defineUser(sequelize: Sequelize) {
  const User = sequelize.define<UserInstance>('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    suspended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  // Sync the model with the database (optional in production)
  User.sync({ alter: true });

  return User;
}
