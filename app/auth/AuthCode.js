const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');


const AuthCode = sequelize.define('AuthCode', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false, // Отключение автоматического добавления полей createdAt и updatedAt
});

module.exports = AuthCode;