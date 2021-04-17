import crypto from 'crypto'
import { DataTypes, Model } from 'sequelize'

class diagnosis extends Model {}
export default {
  attributes: {
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set (value) {
        const hash = crypto.createHash('sha256')
        this.setDataValue('password', hash.digest(value))
      }
    },
    test: DataTypes.STRING
  },
  options: {
    diagnosis
  }
}
