'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Category.belongsToMany(models.Song, { through: 'CategorySong' });
      models.Category.belongsTo(models.School, { foreignKey: 'schoolid' });
      models.Category.belongsTo(models.User, { foreignKey: 'userid' });
    }
  };
  Category.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Category must not be empty'
        }
      }
    },
    schoolid: {
      type: DataTypes.INTEGER,
    },
    userid: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};