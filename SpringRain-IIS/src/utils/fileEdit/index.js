import PathUtils from '../pathUtils'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
/**
 * 尽量在store中使用，为每个page创建一个store，同时初始化fileEdit及baseDir
 */
// const
class FileEdit {
  constructor (baseDir) {
    this.clockFileMap = new Map()
    this.filePathMap = new Map()
    this.simpleBaseDir = new Map()
    if (!FileEdit.instance) {
      this.baseDir = FileEdit.filePath(baseDir)
      this.simpleBaseDir.set(this.baseDir, baseDir) // 对每一个实例的baseDir属性创建一份simpleBaseDir(baseDir原始值)备份
      FileEdit.instance = this
    } else if (baseDir) {
      FileEdit.instance.baseDir = FileEdit.filePath(baseDir)
      this.simpleBaseDir.set(this.baseDir, baseDir) // 对每一个实例的baseDir属性创建一份simpleBaseDir(baseDir原始值)备份
    }
    return FileEdit.instance
  }

  static filePath (dir) {
    const baseDir = process.env.DEV ? path.join(__statics, dir) : PathUtils.resolvePath('public' + dir)
    return baseDir
  }

  static fileUID (fileName) {
    const uuid = uuidv4().replace(/-/g, '_')
    return uuid + '_' + fileName
  }

  static verificationPath (dir) {
    const verify = fs.existsSync(dir)
    return verify
  }

  // 注意浏览器不允许加载本地资源
  getFilePath (fileName) {
    const production = PathUtils.resolvePath('public' + `${this.simpleBaseDir.get(this.baseDir)}/${fileName}?${Math.random()}`)
    const map = process.env.PROD ? production
      : `${this.simpleBaseDir.get(this.baseDir)}/${fileName}?${Math.random()}`
    return map || ''
  }

  /**
   * 通过传入文件名及其完整路径来设定文件的只读权限，同时将文件设置为锁定状态
   * @param {Stirng} fileName 需要锁定的文件名
   * @param {*} filePath 需要锁定的文件路径
   */
  clockFile (fileName, filePath) {
    fs.chmodSync(filePath, 0o555)
    this.clockFileMap.set(fileName, filePath)
  }

  /**
   * 开放文件的读写权限，同时取消文件的锁定状态
   * @param {String} fileName 需要解锁的文件名
   * @returns null
   */
  deClockFile (fileName) {
    if (!this.clockFileMap.has(fileName)) return
    const filePath = this.clockFileMap.get(fileName)
    fs.chmodSync(filePath, 0o777)
    this.clockFileMap.delete(fileName)
  }

  /**
   * 创建文件
   * @param {Object} param
   */
  writeFile ({ fileName, filePath = '', data, clock = false }) {
    const fullPath2Map = this.clockFileMap.get(fileName)
    if (fullPath2Map) throw new Error(`${fileName}已锁定，无法修改！`) // 检查待写入的文件是否是锁定状态
    let fullPath = path.join(this.baseDir, filePath)
    // 用户可以基于baseDir任意创建文件夹
    if (!FileEdit.verificationPath(fullPath)) {
      try {
        fs.mkdirSync(fullPath)
      } catch (error) {
        throw new Error(`创建文件夹: ${fullPath}\n失败：${error}`)
      }
    }
    return new Promise(resolve => {
      try {
        fullPath = path.join(fullPath, fileName)
        fs.writeFileSync(fullPath, data)
        clock && this.clockFileMap(fileName, fullPath)
        this.filePathMap.set(fileName, fullPath) // 更新路径
        const simpleBaseDir = this.simpleBaseDir.get(this.baseDir)
        !FileEdit.verificationPath(FileEdit.filePath(`${simpleBaseDir}/${fileName}`)) && this.simpleBaseDir.set(this.baseDir, simpleBaseDir + `/${filePath}`)
        resolve()
      } catch (error) {
        throw new Error(`创建文件${fullPath}失败：${error}`)
      }
    })
  }

  /**
   * 通过传入文件名或完整路径来删除文件夹
   * @param {Stirng} dir 需要删除的文件夹
   */
  rmdir (dir) {
    let simpleBaseDir = this.simpleBaseDir.get(this.baseDir)
    if (dir) {
      simpleBaseDir = simpleBaseDir + `/${dir}`
    }
    simpleBaseDir = FileEdit.filePath(simpleBaseDir)
    if (!FileEdit.verificationPath(simpleBaseDir)) return
    try {
      // fs.rmdirSync(simpleBaseDir)
      this.removeDir(simpleBaseDir)
    } catch (error) {
      throw new Error(`删除文件夹：\n${simpleBaseDir}\n失败！`)
    }
  }

  removeDir (p) {
    const statObj = fs.statSync(p) // fs.statSync同步读取文件状态，判断是文件目录还是文件。
    if (statObj.isDirectory()) { // 如果是目录
      let dirs = fs.readdirSync(p) // fs.readdirSync()同步的读取目标下的文件 返回一个不包括 '.' 和 '..' 的文件名的数组['b','a']
      dirs = dirs.map(dir => path.join(p, dir)) // 拼上完整的路径
      for (let i = 0; i < dirs.length; i++) {
        // 深度 先将儿子移除掉 再删除掉自己
        this.removeDir(dirs[i])
      }
      fs.rmdirSync(p) // 删除目录
    } else {
      fs.unlinkSync(p) // 删除文件
    }
  }
}

export default FileEdit
