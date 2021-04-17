// import defineModel from './model/db'
// import { DataTypes } from 'sequelize'

// function test () {
//   const Users = defineModel('users', {
//     email: {
//       type: DataTypes.STRING(100),
//       unique: true
//     },
//     passowrd: DataTypes.STRING(100),
//     name: DataTypes.STRING(100),
//     gender: DataTypes.BOOLEAN
//   })
//   Users.sync({ force: process.env.DEV })
// }

// export default test

import { Sequelize } from 'sequelize'
import { dialog } from 'electron'
import config from './config'
import Utils from './utils'

const sequelize = new Sequelize(config)
class LocalStorage extends Utils {
  constructor () {
    super(sequelize)
    if (!LocalStorage.instance) {
      this.test()
      try {
        sequelize.authenticate()
      } catch (error) {
        dialog.showMessageBox({ message: '数据库连接失败' })
      }
      LocalStorage.instance = this
    }
    return this
  }
}

export default LocalStorage
