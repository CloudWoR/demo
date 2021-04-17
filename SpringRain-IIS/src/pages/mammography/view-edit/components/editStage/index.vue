<template>
  <v-stage class="cimo-shadow" ref="stage" :config="stageConfig">
    <v-layer ref="bgLayer">
      <v-image :config="bgImgConfig"></v-image>
    </v-layer>
  </v-stage>
</template>

<script>
let imgWidth = 0
let imgHeight = 0
export default {
  data () {
    return {
      stageConfig: {
        width: 0,
        height: 0
      },
      bgImgConfig: {
        image: null,
        width: 0,
        height: 0
      }
    }
  },
  methods: {
    comSize () {
      return new Promise(resolve => {
        const width = document.body.clientWidth * 0.3
        const height = document.body.clientHeight * 0.6
        this.stageConfig.width = width
        this.stageConfig.height = height
        resolve({ width, height })
      })
    },
    comBgImgSize (stageWidth, stageHeight) {
      return new Promise(resolve => {
        if (this.bgImgConfig.image) {
          this.bgImgConfig.width = stageWidth
          this.bgImgConfig.height = imgHeight * stageWidth / imgWidth
          console.log('bgImgConfig', this.bgImgConfig)
          resolve()
        }
      })
    }
  },
  created () {
    window.onresize = async () => {
      const { width, height } = await this.comSize()
      await this.comBgImgSize(width, height)
    }
    const image = new Image()
    image.src = 'images/sys-images/mammography/body.jpg'
    image.onload = async () => {
      this.bgImgConfig.image = image
      imgWidth = image.width
      imgHeight = image.height
      const { width, height } = await this.comSize()
      await this.comBgImgSize(width, height)
    }
  }
}
</script>
