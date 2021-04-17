import path from 'path'
import PathUtils from '../../../src/utils/pathUtils'

const dbPath = process.env.DEV ? path.join(__statics, 'database/database.db')
  : PathUtils.resolvePath('public' + '/database/database.db')

export default {
  dialect: 'sqlite',
  storage: dbPath,
  dialectOptions: {
    // 你的 sqlite3 参数
    timezone: '+08:00'
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
}
