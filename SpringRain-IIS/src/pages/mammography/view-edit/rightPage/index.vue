<template>
  <div class="q-pa-md">
    <div class="row items-start q-gutter-md">
      <q-responsive :ratio="ratio" class="col">
        <q-resize-observer @resize="onResize" />
        <div class="rounded-borders text-white flex flex-center cimo-shadow">
            <v-stage
              class="cimo-shadow"
              ref="stage"
              :config="stageConfig"
              @mousedown="handleStageMouseDown"
              @touchstart="handleStageMouseDown"
              @click="createViewer"
            >
              <v-layer ref="bgLayer">
                <v-image :config="bgImgConfig"></v-image>
              </v-layer>
              <v-layer ref="iconLayer">
                <v-image
                  v-for="item in checkedImageList"
                  :key="item.name"
                  :config="item"
                  @transformend="handleTransformEnd"
                ></v-image>
                <v-text
                  v-for="item in checkedTextList"
                  :key="item.name"
                  :config="item"
                  @transformend="handleTransformEnd"
                  @dbltap="editText"
                  @dblclick="editText"
                ></v-text>
                <v-transformer ref="transformer" />
              </v-layer>
            </v-stage>
        </div>
      </q-responsive>

      <q-responsive :ratio="1" class="col">
        <div class="rounded-borders bg-secondary text-white">
          <viewer :explainText="explain" />
        </div>
      </q-responsive>
    </div>
  </div>
</template>

<script>
import Konva from 'konva'
import viewer from './viewer'
// import fs from 'fs'
// import path from 'path'
import FileEdit from 'src/utils/fileEdit'
import { mapGetters } from 'vuex'
const container = {
  width: 100,
  height: 100
}
export default {
  components: {
    viewer
  },
  props: {
    patient: {},
    checkedList: {
      type: Array,
      default: () => []
    },
    explain: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      ratio: 1,
      stageConfig: container,
      bgImgConfig: container,
      iconList: [],
      selectedShapeName: '',
      iconLayer: null,
      fileEdit: new FileEdit()
    }
  },
  computed: {
    checkedImageList () {
      return this.checkedList.filter(item => item.image)
    },
    checkedTextList () {
      return this.checkedList.filter(item => item.text)
    }
  },
  created () {
    const image = new Image()
    image.src = 'images/sys-images/mammography/static/original.jpg'
    image.onload = () => {
      this.bgImgConfig.image = image
      this.ratio = image.width / image.height
    }
  },
  mounted () {
    this.createViewer()
    this.$forceUpdate()
    console.log('stage', this.stage)
    const bgImage = this.$refs.bgLayer.getStage()
    bgImage.moveToBottom()
    const iconLayer = this.$refs.iconLayer.getStage().children
    console.log('iconLayer: ', iconLayer)
    const tr = new Konva.Transformer()
    iconLayer.add(tr)
    iconLayer.draw()
  },
  destroyed () {
    console.log('关闭')
    this.fileEdit.rmdir() // 挂载页面后，temp文件夹就已经创建，并且注册进入FileEdit.simpleBaseDir中，不需要再次指定
  },
  methods: {
    ...mapGetters(['getBodyPng', 'getMammographyBaseDir']),
    async createViewer () {
      const stage = this.$refs.stage.getStage()
      const dataURL = stage.toDataURL({ pixelRatio: 1 })
      const data = dataURL.replace(/^data:image\/png;base64,/g, '')
      const dataBuffer = Buffer.from(data, 'base64')
      const fileEdit = new FileEdit()
      const fileName = this.getBodyPng()
      await fileEdit.writeFile({ fileName, filePath: 'temp', data: dataBuffer })
      this.$pubsub.publish('updateViewer') // 更新视图
    },
    check () {
      const iconLayer = this.$refs.iconLayer.getStage()
      console.log('iconLayer: ', iconLayer)
    },
    onResize (size) {
      const { width, height } = size
      container.width = width
      container.height = height
    },
    imgName (url) {
      const name = url.match(/[a-zA-Z0-9_]{1,}\.[a-zA-Z0-9_]{1,}/g)
      return name
    },
    editText (e) {
      const transformer = this.$refs.transformer.getNode()
      const textNode = e.target
      const layer = this.$refs.iconLayer.getNode()
      const stage = this.$refs.stage.getNode()
      const textPosition = textNode.absolutePosition()
      const stageBox = stage.container().getBoundingClientRect()
      const areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y
      }
      textNode.hide()
      transformer.nodes([])
      layer.draw()
      const textarea = document.createElement('textarea')
      document.body.appendChild(textarea)
      textarea.value = textNode.text()
      textarea.style.position = 'absolute'
      textarea.style.top = areaPosition.y + 'px'
      textarea.style.left = areaPosition.x + 'px'
      textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px'
      textarea.style.height =
        textNode.height() - textNode.padding() * 2 + 5 + 'px'
      textarea.style.fontSize = textNode.fontSize() + 'px'
      textarea.style.border = 'none'
      textarea.style.padding = '0px'
      textarea.style.margin = '0px'
      textarea.style.overflow = 'hidden'
      textarea.style.background = 'none'
      textarea.style.outline = 'none'
      textarea.style.resize = 'none'
      textarea.style.lineHeight = textNode.lineHeight()
      textarea.style.fontFamily = textNode.fontFamily()
      textarea.style.transformOrigin = 'left top'
      textarea.style.textAlign = textNode.align()
      textarea.style.color = textNode.fill()
      const rotation = textNode.rotation()
      let transform = ''
      if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)'
      }
      transform += 'translateY(-' + 'px)'
      textarea.style.transform = transform
      // reset height
      textarea.style.height = 'auto'
      // after browsers resized it we can set actual value
      textarea.style.height = textarea.scrollHeight + 3 + 'px'
      textarea.focus()
      function removeTextarea () {
        textarea.parentNode.removeChild(textarea)
        window.removeEventListener('click', handleOutsideClick)
        textNode.show()
        transformer.nodes([textNode])
        layer.draw()
      }

      function setTextareaWidth (newWidth) {
        if (!newWidth) {
          // set width for placeholder
          newWidth = textNode.placeholder.length * textNode.fontSize()
        }
        textarea.style.width = newWidth + 'px'
      }

      textarea.addEventListener('keydown', function (e) {
        // hide on enter
        // but don't hide on shift + enter
        if (e.keyCode === 13 && !e.shiftKey) {
          textNode.text(textarea.value)
          removeTextarea()
        }
        // on esc do not set value back to node
        if (e.keyCode === 27) {
          removeTextarea()
        }
      })

      textarea.addEventListener('keydown', function (e) {
        const scale = textNode.getAbsoluteScale().x
        setTextareaWidth(textNode.width() * scale)
        textarea.style.height = 'auto'
        textarea.style.height =
          textarea.scrollHeight + textNode.fontSize() + 'px'
      })

      function handleOutsideClick (e) {
        if (e.target !== textarea) {
          textNode.text(textarea.value)
          removeTextarea()
        }
      }
      setTimeout(() => {
        window.addEventListener('click', handleOutsideClick)
      })
      console.log('edit', transform)
    },
    handleTransformEnd () {
      // shape is transformed, let us save new attrs back to the node
      // find element in our state
      return e => {
        const rect = this.checkedList.find(
          (r) => r.name === this.selectedShapeName
        )
        // update the state
        rect.x = e.target.x()
        rect.y = e.target.y()
        rect.rotation = e.target.rotation()
        rect.scaleX = e.target.scaleX()
        rect.scaleY = e.target.scaleY()
        // change fill
        rect.fill = Konva.Util.getRandomColor()
      }
    },
    handleStageMouseDown (e) {
      // clicked on stage - clear selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = ''
        this.updateTransformer()
        return
      }

      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent().className === 'Transformer'
      if (clickedOnTransformer) {
        return
      }

      // find clicked rect by its name
      const name = e.target.name()
      const rect = this.checkedList.find((r) => r.name === name)
      if (rect) {
        this.selectedShapeName = name
      } else {
        this.selectedShapeName = ''
      }
      this.updateTransformer()
    },
    updateTransformer () {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getNode()
      const stage = transformerNode.getStage()
      const { selectedShapeName } = this

      const selectedNode = stage.findOne('.' + selectedShapeName)
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.nodes([selectedNode])
      } else {
        // remove transformer
        transformerNode.nodes([])
      }
      transformerNode.getLayer().batchDraw()
    }
  }
}
</script>
