
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Pokemon = sequelize.define("Pokemon", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  attack: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  defense: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  speed: {
    type: DataTypes.INTEGER,
  },
  height: {
    type: DataTypes.INTEGER,
  },
  weight: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Pokemon;
