import { Sequelize, Model, DataTypes } from 'sequelize';
import { DBlogs } from './dbConfig';

export const sequelize = new Sequelize(`${DBlogs.dialect}://${DBlogs.user}:${DBlogs.password}@${DBlogs.host}:${DBlogs.port}/${DBlogs.database}`);
export const users = sequelize.define('users', {
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