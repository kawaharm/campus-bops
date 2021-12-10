'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategorySong extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  };
  CategorySong.init({
    songid: DataTypes.INTEGER,
    categoryid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CategorySong',
  });
  return CategorySong;
};