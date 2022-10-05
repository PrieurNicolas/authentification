import { Sequelize, Model, DataTypes } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');
export const User = sequelize.define('User', {
  pseudo: DataTypes.STRING,
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
    },
  email: DataTypes.STRING,
  dateInscription: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
    },
  password: DataTypes.STRING,
  bio: DataTypes.STRING
});