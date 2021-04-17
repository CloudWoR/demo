<template>
  <div>
    <v-stage
      ref="stage"
      :config="body"
      @dragstart="handleDragstart"
      @dragend="handleDragend"
      >
      <v-layer ref="layer">
        <v-star
          v-for="item in list"
          :key="item.id"
          :config="{
            x: item.x,
            y: item.y,
            rotation: item.rotation,
            id: item.id,
            numPoints: 5,
            innerRadius: 30,
            outerRadius: 50, fill: '#89b717',
            opacity: 0.8,
            draggable: true,
            scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: dragItemId === item.id ? 15 : 5,
            shadowOffsetY: dragItemId === item.id ? 15 : 5,
            shadowOpacity: 0.6
          }"
        ></v-star>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import Konva from 'konva'
export default {
  data () {
    return {
      list: [],
      dragItemId: null,
      body: {
        width: this.resize().width,
        height: this.resize().height
      }
    }
  },
  methods: {
    handleDragstart (e) {
      // save drag element:
      this.dragItemId = e.target.id()
      // move current element to the top:
      const item = this.list.find(i => i.id === this.dragItemId)
      const index = this.list.indexOf(item)
      this.list.splice(index, 1)
      this.list.push(item)
    },
    handleDragend (e) {
      this.dragItemId = null
    },
    resize () {
      return {
        width: document.body.clientWidth * 0.3,
        height: document.body.clientHeight * 0.7
      }
    }
  },
  mounted () {
    const stage = this.$refs.stage.getStage()
    const bgLary = this.$refs.layer.getStage()
    Konva.Image.fromURL(`${this.$PUBLIC_PATH}/images/sys-images/mammography/body.jpg`, (image) => {
      console.log('image', stage)
      image.setAttrs({
        width: 500,
        height: 700
      })
      bgLary.add(image)
      bgLary.draw()
    })
    console.log('layer:', bgLary)
    window.onresize = () => {
      return (() => {
        self.body.width = this.resize().width
        self.windowHeight = this.resize().height
        console.log(document.body.clientHeight)
      })()
    }
    for (let n = 0; n < 30; n++) {
      this.list.push({
        id: Math.round(Math.random() * 10000).toString(),
        x: Math.random() * this.resize().width,
        y: Math.random() * this.resize().height,
        rotation: Math.random() * 180,
        scale: Math.random()
      })
    }
  }
}
</script>
