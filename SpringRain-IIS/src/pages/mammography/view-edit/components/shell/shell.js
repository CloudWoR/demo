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
    return new Promise((resolve, reject) => {
      shell.exec(comment, { encoding: 'base64', slient: true }, (code, stdout, stderr) => {
        const result = iconv.decode(iconv.encode(stdout, 'base64'), 'gb2312')
        const error = iconv.decode(iconv.decode(stderr, 'base64'), 'gb2312')
        if (stderr) reject(error)
        if (stderr) throw error
        resolve({ code, result })
      })
    })
  }

  path (dir) {
    return process.env.DEV ? path.join(__statics, dir) : PathUtils.resolvePath('public' + dir)
  }

  async test () {
    const result = await this.exec('dump2dcm')
    return result
  }

  async dump2dcm (dumpPath, outPath) {
    const comment = `dump2dcm ${dumpPath} ${outPath}`
    const result = await this.exec(comment)
    return result
  }

  async img2dcm (args = {
    inFilePath: '',
    outFilePath: '',
    templatePath: ''
  }) {
    const comment = `img2dcm -i BMP ${args.inFilePath} ${args.outFilePath} --series-from ${args.templatePath}`
    const result = await this.exec(comment)
    return result
  }

  async dcmdjped (inDcm, outDcm) {
    const comment = `dcmdjpeg ${inDcm} ${outDcm}`
    const result = await this.exec(comment)
    return result
  }

  async storescu (dcmFile) {
    const comment = `storescu -aec ${this.AEC} ${this.serverHost} ${this.serverPort} -v ${dcmFile}`
    console.log('comment: ', comment)
    const result = await this.exec(comment)
    return result
  }
}

export default Shell
