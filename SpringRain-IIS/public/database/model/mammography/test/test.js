import { DataTypes } from 'sequelize'
export default {
  attributes: {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  },
  options: {
    freezeTableName: true
  }
}
