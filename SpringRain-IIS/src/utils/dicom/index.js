import Dictionary from './dataDictionary'
import Dcmtk from './dcmtk'
import databaseTemplate from './config/databaseTemplate'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
import PathUtil from 'src/utils/pathUtils'
class Dicom extends Dcmtk {
  /**
   *
   * @param {Object} serverConfig 服务器配置项
   * @param {Object} clientConfig 客户端配置项
   */
  constructor (serverConfig, clientConfig = { AET: '', cHost: '', cPort: '' }) {
    super(serverConfig)
    this.dictionary = null
    this.AET = clientConfig.AET
    this.cHost = clientConfig.cHost
    this.cPort = clientConfig.cPort
    this.dumpString = ''
    this.UID_Prefix = '1.2.826.0.1.3680043.10.685'
    this.connectedError = 'I: checking input files ...\nI: Requesting Association\nF: Association Rejected:\nF: Result: Rejected Permanent, Source: Service User\nF: Reason: Calling AE Title Not Recognized'
  }

  createSOPUID (args = {
    patientID: '',
    seriesID: '',
    imageID: '',
    unix: ''
  }) {
    let SOP_UID = this.UID_Prefix
    Object.keys(args).forEach(key => {
      const value = args[key]
      SOP_UID += `.${value}`
    })
    return SOP_UID
  }

  // 数据库JSON数据格式化
  /**
   * 解析数据库并根据template生成dump数据
   * @param {Object} data 数据库对象
   * @param {Object} template 数据库对象映射
   */
  database2dataDictionary (data, template) {
    const dataDictionary = new Dictionary()
    if (!template) template = databaseTemplate
    Object.keys(data).forEach(key => {
      let value = ''
      const targetKey = template[key]
      if (toString.call(targetKey) === '[object String]') {
        value = data[key]
        dataDictionary.setValue(targetKey, value)
      }
      if (toString.call(targetKey) === '[object Array]') {
        targetKey.forEach(item => {
          dataDictionary.setValue(item.key, value)
        })
      }
    })
    this.dictionary = dataDictionary.dictionary
    this.setSopUi()
    this.setDate('studyDate')
    this.setDate('studyTime')
    return this.dictionary2dump()
  }

  createDump (filePath) {
    if (!this.dumpString) return
    console.log('filePath', filePath)
    filePath = process.env.DEV ? path.join(__statics, filePath) : PathUtil.resolvePath('public' + filePath)
    try {
      fs.writeFileSync(filePath, this.dumpString)
    } catch (error) {
      throw new Error(error)
    }
  }

  setDate (key, datetime = moment()) {
    const type = this.dictionary[key][1]
    const date = moment(datetime).format('YYYYMMDD')
    const time = moment(datetime).format('HHmmss.SSS')
    this.dictionary[key][2] = type === 'DA' ? `[${date}]` : `[${time}]`
  }

  setSopUi () {
    if (!this.dictionary) return
    this.dictionary.studyInstanceUid[2] = `[${this.UID_Prefix + '.' + (Math.random() * 1000)}]`
    this.dictionary.seriesInstanceUid[2] = `[${this.UID_Prefix + '.' + (Math.random() * 1000)}]`
  }

  /**
   * 将数据字典转换成dump字符串
   * @returns null
   */
  dictionary2dump () {
    if (!this.dictionary) return
    let dumpString = ''
    Object.keys(this.dictionary).forEach(item => {
      const array = this.dictionary[item]
      const row = `${array[0]} ${array[1]} ${array[2]}\n`
      dumpString += row
    })
    this.dumpString = dumpString
    return this.dumpString
  }
}

export default Dicom
