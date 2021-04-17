import Jimp from 'jimp'
class Stage2buffer {
  constructor () {
    if (!Stage2buffer.instance) {
      this.buffer = null
      this.bmpBuffer = null
      Stage2buffer.instance = this
    }
    return Stage2buffer.instance
  }

  createBuffer (dataURL) {
    const data = dataURL.replace(/^data:image\/jpeg;base64,/g, '')
    const dataBuffer = Buffer.from(data, 'base64')
    this.buffer = dataBuffer
  }

  async buffer2image (type) {
    if (!type) throw new Error('type为必填项目')
    if (!this.buffer) throw new Error('Stage2buffer.buffer未获取值')
    if (type === 'bmp') {
      const jimp = await Jimp.read(this.buffer)
      this.bmpBuffer = await jimp.getBufferAsync(Jimp.MIME_BMP)
    }
  }

  async setBmpBuffer () {
    await this.buffer2image('bmp')
    return this.bmpBuffer
  }
}

export default Stage2buffer
