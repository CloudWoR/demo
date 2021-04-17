<template>
  <div>
    <q-card
      flat bordered
      class="markedEdit text-cyan cimo-shadow"
     >
      <q-card-section horizontal>
        <div class="col column">
        <q-img
          class="col"
          :src="markedGraph.base64"
          contain
          ></q-img>
          <q-btn
            class="glossy"
            push color="cyan"
            icon="far fa-folder-open"
            label="打开本地图片"
            @click="openFile" />
        </div>
        <q-card-actions>
        <q-separator vertical dark />
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
          >
            <q-input
              filled
              v-model="markedGraph.name"
              label="图形名称"
              lazy-rules
              :rules="[ val => val && val.length > 0 || '请输入图形名称']"
            />

            <q-input
              filled
              v-model="markedGraph.pathology"
              label="病理名称"
              lazy-rules
              :rules="[ val => val && val.length > 0 || '请输入病理名称']"
            />
            <q-input
              filled
              v-model="markedGraph.additional"
              label="附加字段"
              lazy-rules
              :rules="[]"
            />
            <div>
              <q-btn class="glossy" label="Submit" push type="submit" color="primary"/>
              <q-btn label="Reset" type="reset" push color="primary" flat class="q-ml-md glossy" />
            </div>
          </q-form>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { v4 as uuidv4 } from 'uuid'
export default {
  props: {
    activeImages: String
  },
  // name: DataTypes.STRING, // 图形名称
  // url: DataTypes.STRING, // 路径
  // base64: DataTypes.TEXT, // 图像的base64数据
  // pathology: DataTypes.STRING, // 病理名称,
  // additional: DataTypes.STRING, // 附加在图像上的字段
  // type: DataTypes.ENUM(['标识', '背景'])
  data () {
    return {
      markedGraph: {
        name: '',
        url: '',
        base64: '',
        pathology: '',
        additional: '无',
        type: '标识'
      },
      stageConfig: {
        width: 200,
        height: 200
      }
    }
  },
  computed: {
    imgBase64 () {
      return 'data:image/png;base64,' + this.activeImages
    }
  },
  methods: {
    async openFile () {
      const file2Base64 = await ipcRenderer.invoke('openDialog', {
        title: '添加标记图形',
        buttonLabel: '选取图片',
        filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
        properties: ['openFile']
      })
      this.markedGraph.base64 = 'data:image/png;base64,' + file2Base64[0]
      this.markedGraph.url = `images/sys-images/mammography/mark-icon/${uuidv4()}.png`
    },
    imgSrc () {
      const src = 'data:image/png;base64,' + this.activeImages[0]
      return src
    },
    async onSubmit (evt) {
      const result = await ipcRenderer.invoke('markedGraph-C', this.markedGraph)
      this.$q.notify({
        color: 'cyan',
        textColor: 'white',
        icon: 'success',
        message: result
      })
      evt.target.submit()
    },
    onReset () {
      const markedGraph = {
        naem: '',
        url: '',
        base64: '',
        pathology: '',
        additional: '',
        type: '标识'
      }
      this.markedGraph = markedGraph
    }
  }
}
</script>

<style lang="scss">
.markedEdit {
  width: 500px;
}
</style>
