'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class School extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.School.hasMany(models.User, { foreignKey: 'schoolid' });
      models.School.hasMany(models.Category, { foreignKey: 'schoolid' });
    }
  };
  School.init({
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    logo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'School',
  });
  return School;
};