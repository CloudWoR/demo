<template>
  <div>
    <q-btn class="glossy" push color="cyan" icon="fas fa-camera-retro" @click="createView" >
    <q-tooltip
      anchor="top middle"
      self="bottom middle"
      content-class=" text-white shadow-4"
      transition-show="scale"
      transition-hide="scale"
      content-style="font-size: 16px"
      :offset="[10, 10]"
      >
        生成视图文件
      </q-tooltip>
    </q-btn>
    <q-spinner-clock
      v-if="showClock"
      class="fixed-center"
      color="teal"
      size="20em"
    />
  </div>
</template>

<script>
import FileEdit from 'src/utils/fileEdit'
import Stage2buffer from 'src/utils/stage2buffer'
import { mapGetters } from 'vuex'
export default {
  props: {
    dataURL: {
      type: String,
      default: 'stage'
    }
  },
  data () {
    return {
      stage2buffer: new Stage2buffer(),
      showClock: false
    }
  },
  methods: {
    ...mapGetters(['getViewBmp']),
    async createView () {
      this.showClock = true
      this.$emit('updateView')
      const fileName = this.getViewBmp()
      const data = await this.stage2buffer.setBmpBuffer()
      const fileEdit = new FileEdit()
      await fileEdit.writeFile({ fileName, filePath: 'temp', data })
      setTimeout(() => {
        this.showClock = false
        this.$autoCloseAlert({
          seconds: 10,
          title: '创建视图文件',
          message: `成功创建${fileName}视图文件`
        })
      }, 1000)
    }
  }
}
</script>
