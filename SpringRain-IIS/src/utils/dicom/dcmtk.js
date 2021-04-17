import shell from 'shelljs'
import iconv from 'iconv-lite'
import path from 'path'
import PathUtils from 'src/pathUtils'

// shell.exec('dir', { encoding: 'base64', slient: true }, (code, stdout, stderr) => {
//   console.log(iconv.decode(iconv.encode(stdout, 'base64'), 'gb2312'))
// })

class Shell {
  constructor (args = {
    host: '192.168.11.220',
    port: '2104',
    AEC: 'pa53001FIR'
  }) {
    this.serverHost = args.host
    this.serverPort = args.port
    this.AEC = args.AEC
  }

  exec (comment) {
    return new Promise(resolve => {
      shell.exec(comment, { encoding: 'utf8', slient: true }, (code, stdout, stderr) => {
        const result = iconv.decode(iconv.encode(stdout, 'utf8'), 'utf8')
        const error = iconv.decode(iconv.decode(stderr, 'utf8'), 'utf8')
        // if (stderr) reject(error)
        if (stderr) throw error
        else resolve({ code, result })
      })
    })
  }

  static path (dir) {
    return process.env.DEV ? path.join(__statics, dir) : PathUtils.resolvePath('public' + dir)
  }

  dcmtkError (result) {
    if (result.code !== 0) throw new Error(`img2dcm错误：\n错误代码：${result.code}\n信息：${result.result}`)
  }

  async dump2dcm (dumpPath, outPath) {
    const comment = `dump2dcm ${dumpPath} ${outPath}`
    const result = await this.exec(comment)
    this.dcmtkError(result)
  }

  async img2dcm (args = {
    inFilePath: '',
    outFilePath: '',
    templatePath: ''
  }) {
    const comment = `img2dcm -i BMP ${args.inFilePath} ${args.outFilePath} --series-from ${args.templatePath}`
    const result = await this.exec(comment)
    this.dcmtkError(result)
  }

  async dcmdjped (inDcm, outDcm) {
    const comment = `dcmdjpeg ${inDcm} ${outDcm}`
    const result = await this.exec(comment)
    this.dcmtkError(result)
  }

  async storescu (dcmFile) {
    const comment = `storescu -aec ${this.AEC} ${this.serverHost} ${this.serverPort} -v ${dcmFile}`
    console.log('comment: ', comment)
    const result = await this.exec(comment)
    this.dcmtkError(result)
  }
}

export default Shell
