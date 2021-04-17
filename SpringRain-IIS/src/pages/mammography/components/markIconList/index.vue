<template>
  <div>
    <q-img
      class="markIconItem q-ml-xs"
      v-for="(item, index) in imagePath"
      :key="index"
      :src="item.src"
      :style="{width: '50px', minWidth: '50px', maxWidth: '50px'}"
      @dblclick="activeIcon(item)"
    />
  </div>
</template>

<script>
import fs from 'fs'
import path from 'path'
export default {
  data () {
    return {
      imagePath: []
    }
  },
  created () {
    const fileContents = fs.readdirSync(path.join(__statics, '/images/sys-images/mammography'))
    console.log('fileContents: ', fileContents)
    // const imageDir = '../../../../public/images/sys-images/mammography'
    fileContents.forEach(filename => {
      const test = /^[\u4E00-\u9FA5A-Za-z0-9_]+\.{1}[\u4E00-\u9FA5A-Za-z0-9_]+/g
      console.log('fileName: ', filename)
      test.test(filename) && this.imagePath.push({
        src: `images/sys-images/mammography/${filename}`,
        name: filename
      })
    })
    console.log('path', this.imagePath)
  },
  methods: {
    activeIcon (item) {
      this.$emit('markIcon', item)
    }
  }
}
</script>

<style lang="scss">
.markIconItem {
  cursor: pointer;
}
.markIconItem:hover {
  box-shadow:0 0 3px #000;
}
.markIconItem:active {
  box-shadow: 0 0 1px #000;
}
</style>>
