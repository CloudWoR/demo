import path from 'path'
import fs from 'fs'
import regedit from 'regedit'
export default class PathUtils {
  static startPath = path.join(__dirname, '..')
  static userPath = process.env.USERPROFILE
  static userDocPath
  static appdataPath = process.env.APPDATA
  static resolvePath = (dirPath) => {
    return path.join(PathUtils.startPath, dirPath || '.')
  }

  static resolveUserPath = (dirPath) => {
    return path.join(PathUtils.userPath, dirPath || '.')
  }

  static resolveUserDocPath = (dirPath) => {
    return new Promise((resolve, reject) => {
      getUserDoc().then((docPath) => {
        PathUtils.userDocPath = docPath
        resolve(PathUtils.userDocPath)
      })
    })
  };
}

const getUserDoc = () => {
  return new Promise((resolve, reject) => {
    regedit.setExternalVBSLocation(PathUtils.resolvePath('vbs'))

    const key = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders'
    regedit.list(key, function (err, result) {
      if (err) {
        console.error('Window Reg:', err)
      } else {
        try {
          resolve(result[key].values.Personal.value)
        } catch (e) {
          const docPath = path.join(PathUtils.userPath, 'Documents')
          if (!fs.existsSync(docPath)) {
            fs.mkdirSync(docPath)
          }
          resolve(docPath)
        }
      }
    })
  })
}
