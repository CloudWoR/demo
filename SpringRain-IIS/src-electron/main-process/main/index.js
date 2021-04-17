import { ipcMain, dialog } from 'electron'
import ActiveWindow from './activeWindow'
import store from '../store'
import SqlServer from './baseClass/sqlserver'
import SequelizeTest from '../localStorage'
import fs from 'fs'

const sequelzite = new SequelizeTest()

setTimeout(() => {
  sequelzite.test()
}, 1000)

const activeWindow = new ActiveWindow()
const sqlServer = new SqlServer()
activeWindow.registerIpcMainHandle([
  'logon',
  'logout',
  'quitApp',
  'lockUser',
  'logoff',
  'setRolesAndRoutes'
])

ipcMain.handle('querySqlServer', async (event, sql) => {
  const request = await sqlServer.query(sql)
  // console.log('reuqest: ', request)
  return request
})

// 读取本地文件，返回读取的文件的buffer到前端
ipcMain.handle('openDialog', (event, options) => {
  const fileList = dialog.showOpenDialogSync(activeWindow.mainWindow.window, options)
  console.log('result:', fileList)
  const file2Base64 = []
  if (fileList && fileList.length) {
    fileList.forEach(path => {
      const buffer = fs.readFileSync(path, { encoding: 'base64' })
      file2Base64.push(buffer)
    })
  }
  return file2Base64
})

ipcMain.handle('sequelize', async () => {
  const request = await sequelzite.table('diagnosis').findAll({ where: { test: 'map' } })
  dialog.showMessageBoxSync({ message: 'sequelzie: find' + request })
  return request
})

ipcMain.handle('REGISTER', (event, message) => {
  console.log('REGSITER', JSON.parse(message))
  !store.hasModule('registers') && store.registerModule('registers', JSON.parse(message))
  console.log(store.hasModule('registers'))
  // store.commit('SET_USER', 'set_USER')
  console.log('动态注册：', store.state.registers)
})

ipcMain.handle('browserWindow', (event, data) => {
  const window = activeWindow.mainWindow.window
  if (data === 'minimize') window.minimize()
  if (data === 'maximize') {
    window.isMaximized() ? window.unmaximize() : window.maximize()
  }
})

const remote = {
  state: () => { return { remote: '动态注册' } },
  mutations: {
    REMOTE: (state, payload) => {
      state.remote = payload
    }
  }
}
activeWindow.start()
store.registerModule('remote', remote)
store.commit('REMOTE', '123')
console.log('registerModule: ', store.state.remote.remote)
store.commit('LOGON', { username: 'test', role: 'role', token: 123 })
console.log('store-test: ', store.getters.getUserinfo)
