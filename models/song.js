'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Song.belongsTo(models.Category, { foreignKey: 'categoryid' })
    }
  };
  Song.init({
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    album: DataTypes.STRING,
    albumCover: DataTypes.STRING,
    categoryid: DataTypes.STRING,
    songPlayerId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Song',
  });
  return Song;
};