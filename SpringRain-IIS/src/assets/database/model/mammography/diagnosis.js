import { DataTypes } from 'sequelize'
export default {
  attributes: {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    test: DataTypes.STRING
  },
  options: {}
}
