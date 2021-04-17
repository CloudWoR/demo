import DB from './db'
import model from '../model'
import { dialog, ipcMain } from 'electron'

class Utils extends DB {
  constructor (sequelize) {
    super(sequelize)
    this.tableModel = new Map()
    if (!Utils.instance) {
      Utils.instance = this
      this._syncModel()
    }
    return Utils.instance
  }

  async test () {
    console.log('this.sequelize', this.sequelize.models)
    // this.sequelize.models.diagnosis.create({
    //   username: 'username',
    //   password: 'password',
    //   test: '通过'
    // })
  }

  async _syncModel () {
    if (!Object.keys(model).length) console.log('不存在')
    Object.keys(model).forEach(key => {
      const module = model[key]
      const defineModel = this.defineModel(key, module)
      this.tableModel.set(key, defineModel)
      const map = this.tableModel.get(key)
      map.sync({ force: false })
      this.crud(key, map)
    })
  }

  table (model) {
    if (!this.tableModel.has(model)) dialog.showMessageBoxSync({ message: `${model}-不存在` })
    const table = this.tableModel.get(model)
    return table
  }

  _notFindModel (key) {
    if (!this.sequelize.models[key]) {
      dialog.showMessageBoxSync({
        title: '未找到数据库model',
        message: `调用的${key}表不存在或未经初始化`
      })
      return false
    }
    return true
  }

  _typeError (data) {
    const notObject = function () {
      if (toString.call(data) !== '[object Object]') {
        dialog.showMessageBoxSync({
          title: '值类型错误',
          message: 'data传入的值类型错误，应该为Object'
        })
        return true
      }
      return false
    }
    const notString = function () {

    }
    const standardUpdateStructure = function () {
      if (!data.where || toString.call(data.where) !== '[object Object]') {
        dialog.showMessageBoxSync({ title: '值结构错误', message: 'data结构中未定义where属性或where值类型不为Object' })
        return false
      }
      if (!data.attributes || toString.call(data.attributes) !== '[object Object]') {
        dialog.showMessageBoxSync({ title: '值类型错误', message: 'data结构中未定义attributes属性或attributes值类型不为Object' })
        return false
      }
      return true
    }
    return {
      notObject,
      notString,
      standardUpdateStructure
    }
  }

  crud (key, model) {
    this.create(key, model)
    this.retrieve(key, model)
    this.update(key, model)
    this.delete(key, model)
  }

  create (key, model) {
    ipcMain.handle(`${key}-C`, async (evnet, data) => {
      if (!this._notFindModel(key)) return
      if (this._typeError(data).notObject()) return
      try {
        await model.create(data)
        return `成功为表：${key}创建数据`
      } catch (error) {
        dialog.showMessageBoxSync({
          title: '表插入错误',
          message: `向${key}表插入数据时错误: \n错误信息: \n${error}`
        })
      }
    })
  }

  retrieve (key, model) {
    ipcMain.handle(`${key}-R`, async (evnet, data) => {
      if (!this._notFindModel(key)) return
      // if (!this._typeError(data).standardUpdateStructure()) return
      let methods = ''
      if (typeof data === 'string') {
        methods = 'findBypk'
      } else if (toString.call(data) === '[object Object]') {
        methods = 'findAll'
      } else {
        dialog.showMessageBoxSync({
          title: '查询参数错误',
          message: `表查询参数必须为String或Object类型，但接收到了${toString.call(data)}类型。`
        })
      }
      try {
        const result = await model[methods](data)
        return result
      } catch (error) {
        dialog.showMessageBoxSync({
          title: '表查询错误',
          message: `向${key}表查询数据时报错：\n错误信息：\n${error}`
        })
      }
    })
  }

  update (key, model) {
    ipcMain.handle(`${key}-U`, async (evnet, data) => {
      if (!this._notFindModel(key)) return
      if (!this._typeError(data).standardUpdateStructure()) return
      try {
        const { attributes, where } = data
        const result = await model.update(attributes, { where })
        console.log('result: ', result)
      } catch (error) {
        dialog.showMessageBoxSync({
          title: '表更新错误',
          message: `向${key}表更新数据时错误: \n错误信息: \n${error}`
        })
      }
    })
  }

  delete (key, model) {
    ipcMain.handle(`${key}-D`, (evnet, data) => {
      console.log('model: ', model)
    })
  }
}

export default Utils
