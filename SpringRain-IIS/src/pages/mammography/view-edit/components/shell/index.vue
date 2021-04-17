<template>
  <div>
    <q-spinner-clock
      v-if="showClock"
      class="fixed-center"
      color="teal"
      size="20em"
    />
    <q-btn class="glossy" push color="primary" icon="fas fa-upload" @click="dcmtk" >
    <q-tooltip
      anchor="top middle"
      self="bottom middle"
      content-class="bg-pink-5 text-white shadow-4"
      transition-show="flip-right"
      transition-hide="flip-right"
      content-style="font-size: 16px"
      :offset="[10, 10]"
      >
        上传视图文件
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
import Dcmtk from 'src/utils/dicom'
import FileEdit from 'src/utils/fileEdit'
import { mapGetters } from 'vuex'
import path from 'path'
const fileEdit = new FileEdit()
export default {
  data () {
    return {
      showClock: false,
      tempDir: 'temp',
      file: {
        viewBmp: {
          name: '',
          path: ''
        },
        viewDcm: {
          name: '',
          path: ''
        },
        messageDump: {
          name: '',
          path: ''
        },
        messageDcm: {
          name: '',
          path: ''
        },
        pushDcm: {
          name: '',
          path: ''
        }
      }
    }
  },
  mounted () {
    console.log('file: ', this.file)
    this.file.viewBmp.name = this.getViewBmp()
    this.file.viewBmp.path = path.join(fileEdit.baseDir, this.tempDir, this.getViewBmp())
    this.file.viewDcm.name = this.getViewDcm()
    this.file.viewDcm.path = path.join(fileEdit.baseDir, this.tempDir, this.getViewDcm())
    this.file.messageDump.name = this.getMessageDump()
    this.file.messageDcm.name = this.getMessageDcm()
    this.file.messageDcm.path = path.join(fileEdit.baseDir, this.tempDir, this.getMessageDcm())
    this.file.pushDcm.name = this.getPushDcm()
    this.file.pushDcm.path = path.join(fileEdit.baseDir, this.tempDir, this.getPushDcm())
  },
  methods: {
    ...mapGetters([
      'getActivePatient',
      'getViewBmp',
      'getViewDcm',
      'getMessageDump',
      'getMessageDcm',
      'getPushDcm'
    ]),
    async dcmtk () {
      this.showClock = true
      const activePatient = this.getActivePatient()
      const dcmtk = new Dcmtk()
      try {
        const dumpString = dcmtk.database2dataDictionary(activePatient)
        await fileEdit.writeFile({ fileName: this.file.messageDump.name, filePath: this.tempDir, data: dumpString })
        this.file.messageDump.path = fileEdit.filePathMap.get(this.file.messageDump.name)
        await dcmtk.dump2dcm(this.file.messageDump.path, this.file.messageDcm.path)
        await dcmtk.img2dcm({
          inFilePath: this.file.viewBmp.path,
          outFilePath: this.file.viewDcm.path,
          templatePath: this.file.messageDcm.path
        })
        await dcmtk.storescu(this.file.viewDcm.path)
        this.showClock = false
        this.$autoCloseAlert({
          seconds: 10,
          title: '视图上传成功',
          message: '成功上传视图dcm文件至pacs'
        })
      } catch (error) {
        this.showClock = false
        console.log('error2Connect: ', error === dcmtk.connectedError)
        this.$autoCloseAlert({
          seconds: 60,
          title: 'dcmtk错误',
          message: error
        })
      }
    }
  }
}
</script>
