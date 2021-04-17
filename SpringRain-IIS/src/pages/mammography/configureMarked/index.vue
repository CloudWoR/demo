<template>
  <base-content>
    <div class="bg-wirte fit cimo-shadow">
      已有图形
      <mark-icon-list @markIcon="activeMarkIcon" />
      <!-- <q-btn @click="openFile">添加本地图形</q-btn> -->
      <SelectorList :activeImages="activeImages" />
    </div>
  </base-content>
</template>

<script>
import BaseContent from 'src/components/BaseContent'
import markIconList from '../components/markIconList'
import { ipcRenderer } from 'electron'
import SelectorList from './selectorList'
// import PathUtils from 'src/utils/pathUtils'
// import path from 'path'
export default {
  components: {
    BaseContent,
    markIconList,
    SelectorList
  },
  data () {
    return {
      activeImages: ''
    }
  },
  methods: {
    activeMarkIcon (item) {
      console.log('item: ', item)
    },
    async openFile () {
      const file2Base64 = await ipcRenderer.invoke('openDialog', {
        title: '添加标记图形',
        buttonLabel: '选取图片',
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'txt'] }],
        properties: ['openFile']
      })
      this.activeImages = file2Base64[0]
    }
  }
}
</script>

<style>
</style>
