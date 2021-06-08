<template>
  <div class="viewer column fit" ref="viewer">
    <q-toolbar class="col col-auto">
      <q-toolbar-title class="text-center cimo-shadow">
        <q-avatar>
          <q-icon name="remove_red_eye"></q-icon>
        </q-avatar>
        视图预览
      </q-toolbar-title>
    </q-toolbar>
    <div class="col text-center">
      <div class="row fit">
        <div class="cimo-shadow" :style="viewerStyle">
          <v-stage id="stage" ref="stage" :config="viewerStage">
            <v-layer>
              <v-rect :config="background"></v-rect>
            </v-layer>
            <v-layer ref="layer">
              <v-group ref="title" :config="title">
                <v-text ref="titleText" :config="titleText"></v-text>
                <v-line ref="titleLine" :config="titleLine"></v-line>
                <v-line ref="titleLineDotted" :config="titleLineDotted"></v-line>
                <v-group ref="hospital" :config="hospital">
                  <v-image ref="hospitalImage" :config="hospitalImage"></v-image>
                </v-group>
              </v-group>
              <v-group ref="message" :config="message">
                <v-line ref="messageLine" :config="messageLine"></v-line>
                <v-group
                  v-for="item in messageList"
                  :key="item.name"
                  :ref="item.name"
                  :config="item"
                >
                  <v-text :ref="item.name + 'Label'" :config="item.label"></v-text>
                  <v-text :ref="item.name + 'Value'" :config="item.value"></v-text>
                </v-group>
              </v-group>
              <v-group ref="view" :config="view">
                <v-image ref="viewImage" :config="viewImage"></v-image>
                <v-line ref="viewLine" :config="viewLine"></v-line>
              </v-group>
              <v-group ref="explains" :config="explains">
                <v-group ref="diagnosis" :config="diagnosis">
                  <v-text
                    :ref="diagnosis.label.name"
                    :config="diagnosis.label"></v-text>
                  <v-text
                    :ref="diagnosis.value.name"
                    :config="diagnosis.value"
                  ></v-text>
                </v-group>
                <v-group ref="medicalHistory" :config="medicalHistory">
                  <v-text
                    :ref="medicalHistory.label.name"
                    :config="medicalHistory.label"
                  ></v-text>
                  <v-text
                    :ref="medicalHistory.value.name"
                    :config="medicalHistory.value"
                  ></v-text>
                </v-group>
                <v-group ref="explain" :config="explain">
                  <v-text
                    :ref="explain.label.name"
                    :config="explain.label"
                  ></v-text>
                  <v-text
                    :ref="explain.value.name"
                    :config="explain.value"
                  ></v-text>
                </v-group>
                <v-group ref="autograph" :config="autograph">
                  <v-text
                    :ref="autograph.label.name"
                    :config="autograph.label"
                  ></v-text>
                  <v-text
                    :ref="autograph.value.name"
                    :config="autograph.value"
                  ></v-text>
                </v-group>
              </v-group>
            </v-layer>
          </v-stage>
        </div>
        <div class="col">
          <q-card class="menu-card">
            <q-card-section>
              <div class="text-h6">视图操作项</div>
              <div class="text-subtitle1">请按顺序操作：</div>
              <div class="text-subtitle2">生成视图 => 上传视图</div>
            </q-card-section>

            <q-separator />

            <div class="column q-pa-md q-gutter-md">
              <div class="col row justify-center">
                <q-btn class="glossy" push color="white" text-color="cyan" icon="fas fa-sync" @click="review" >
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    content-class="bg-teal shadow-4"
                    transition-show="rotate"
                    transition-hide="rotate"
                    content-style="font-size: 16px"
                    :offset="[10, 10]"
                    >
                      刷新视图
                    </q-tooltip>
                </q-btn>
              </div>
              <div class="row col vertical-middle">
                <create-view class="col" @updateView="review" :dataURL="dataURL" >
                </create-view>
                <q-icon class="col glossy q-pt-xs" color="wirte" size="2em" name="fas fa-hand-point-right"></q-icon>
                <shell class="col" />
              </div>
            </div>
          </q-card>
        </div>
      </div>
      <q-resize-observer @resize="onResize" />
    </div>
  </div>
</template>

<script>
import shell from '../components/shell'
import { mapGetters } from 'vuex'
import moment from 'moment'
import createView from './createView'
import Stage2Buffer from 'src/utils/stage2buffer'
import FileEdit from 'src/utils/fileEdit'
import PubSub from 'pubsub-js'
export default {
  components: {
    shell,
    createView
  },
  props: {
    explainText: {
      type: Object,
      default: () => {}
    }
  },
  data: () => {
    return {
      dataURL: '',
      fileEdit: new FileEdit(),
      activePatient: {},
      stage: null,
      stageWidth: 0,
      stageHeight: 0,
      groupRatio: [
        { title: 1 },
        { message: 1.3 },
        { view: 4.7 },
        { explains: 3 }
      ],
      titleText: {
        x: 0,
        y: 10,
        text: '体检标记单',
        fontSize: 25,
        fill: '#104742',
        shadowColor: 'black',
        shadowBlur: 3,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        shadowOpacity: 0.2
      },
      messageTitle: {
        text: 'message',
        x: 0
      },
      title: {},
      hospital: {},
      hospitalImage: {
        zoom: 1,
        x: 0,
        y: 0,
        image: null
      },
      message: {},
      messageLine: {
        points: [],
        stroke: 'teal',
        strokeWidth: 2
      },
      messageList: [
        { x: 0, y: 0, width: 0, height: 0, name: 'messageName', database: 'PatientCName', label: { text: '姓     名：', fill: 'teal', fontStyle: 'bold' }, value: { x: 0, y: 0, text: '患者信息' } },
        { x: 0, y: 0, width: 0, height: 0, name: 'messageAge', database: 'Age', label: { x: 0, y: 0, text: '年     龄：', fill: 'teal', fontStyle: 'bold' }, value: { x: 0, y: 0, text: '患者信息' } },
        { x: 0, y: 0, width: 0, height: 0, name: 'messageGender', database: 'Sex', label: { x: 0, y: 0, text: '性     别：', fill: 'teal', fontStyle: 'bold' }, value: { x: 0, y: 0, text: '患者信息' } },
        { x: 0, y: 0, width: 0, height: 0, name: 'messagePatientNumber', database: 'RISPID', label: { x: 0, y: 0, text: '影 像 号：', fill: 'teal', fontStyle: 'bold' }, value: { x: 0, y: 0, text: '患者信息' } },
        { x: 0, y: 0, width: 0, height: 0, name: 'messageAccessionNumber', database: 'AccessionNumber', label: { x: 0, y: 0, text: '检 查 号：', fill: 'teal', fontStyle: 'bold' }, value: { x: 0, y: 0, text: 'CT202001010001' } },
        { x: 0, y: 0, width: 0, height: 0, name: 'messageStudyDate', database: 'StudyDate', label: { x: 0, y: 0, text: '检查日期：', fill: 'teal', fontStyle: 'bold' }, value: { x: 0, y: 0, text: moment().format('YYYY-MM-DD') } }
      ],
      view: {},
      viewImage: {
        zoom: 1,
        x: 0,
        y: 0,
        image: null
      },
      viewLine: {
        points: [],
        stroke: 'teal',
        strokeWidth: 2
      },
      titleLine: {
        points: [],
        stroke: 'teal',
        strokeWidth: 2
      },
      titleLineDotted: {
        points: [],
        stroke: 'teal',
        strokeWidth: 1,
        dash: [10, 5, 0.5, 5]
      },
      explains: {},
      viewerSize: {
        width: 0,
        height: 0
      },
      diagnosis: {
        x: 0,
        y: 0,
        label: { name: 'diagnosisLabel', text: '临床诊断：', fill: 'teal', fontStyle: 'bold' },
        value: { name: 'diagnosisValue', text: '' }
      },
      medicalHistory: {
        label: { name: 'medicalHistoryLabel', text: '病       史：', fill: 'teal', fontStyle: 'bold' },
        value: { name: 'medicalHistoryValue', text: '' }
      },
      explain: {
        label: { name: 'explainLabel', text: '补充说明：', fill: 'teal', fontStyle: 'bold' },
        value: { name: 'explainValue', text: '' }
      },
      autograph: {
        label: { name: 'autographLabel', text: '检查医生签名：', fill: 'teal', fontStyle: 'bold' },
        value: { name: 'autographValue', text: '' }
      }
    }
  },
  computed: {
    viewerStage () {
      const { width, height } = this.viewerSize
      return {
        width,
        height
      }
    },
    viewerStyle () {
      const { width, height } = this.viewerSize
      return {
        width: width + 'px',
        height: height + 'px'
      }
    },
    background () {
      const { width, height } = this.viewerSize
      return {
        x: 0,
        y: 0,
        width,
        height,
        fill: 'white'
      }
    }
  },
  created () {
    const image = new window.Image()
    image.src = 'images/sys-images/mammography/static/hospital.jpg'
    image.onload = () => {
      this.hospitalImage.image = image
      this.initailImage(image, 'hospitalImage')
    }
    const viewImage = new window.Image()
    console.log('viewImage', viewImage)
    viewImage.src = 'images/sys-images/mammography/static/original.jpg'
    viewImage.onload = () => {
      this.viewImage.image = viewImage
      this.initailImage(viewImage, 'viewImage')
    }
    this.$pubsub.subscribe('updateViewer', () => {
      this.review()
    })
  },
  mounted () {
    PubSub.subscribe('activeTechnician', (msg, data) => {
      this.autograph.value.text = data
      this.review()
    })
    this.activePatient = this.getActivePatient()
    this.activeTechnician = this.getActiveTechnician()
    this.messageList.forEach(item => {
      item.value.text = this.activePatient[item.database]
      if (item.database === 'StudyDate') {
        item.value.text = moment().format('YYYY-MM-DD')
      }
    })
    setTimeout(() => {
      this.$forceUpdate()
    }, 100)
  },
  updated () {
    this.$nextTick(() => {
      this.initailTextFount('titleText')
      const stage = this.$refs.stage.getNode()
      this.comRatio(stage)
      this.stageWidth = stage.width()
      this.center('titleText')
      this.setHospital()
      this.bottomLine('titleLine', 5)
      this.bottomLine('titleLineDotted')
      this.bottomLine('messageLine')
      const viewImage = this.$refs.viewImage.getStage()
      this.zoomImage(viewImage, 'viewImage')
      this.center(viewImage)
      this.bottomLine('viewLine')
      this.initailMessage()
      this.initailExplain()
    })
  },
  watch: {
    messageList: {
      handler: function (value) {
        this.$forceUpdate()
      },
      deep: true
    },
    explainText: {
      handler: function (value) {
        const { diagnosis, medicalHistory, explain } = value
        this.diagnosis.value.text = diagnosis
        this.medicalHistory.value.text = medicalHistory
        this.explain.value.text = explain
      }
    },
    deep: true
  },
  methods: {
    ...mapGetters(['getActivePatient', 'getBodyPng', 'getActiveTechnician']),
    initailImage (image, data) {
      this[data].zoom = image.width / image.height
    },
    zoomImage (image, data) {
      const parent = image.parent
      image.height(parent.height() - 5)
      image.width(image.height() * this[data].zoom)
    },
    initailExplain () {
      const explains = this.$refs.explains.getNode()
      // const diagnosis = this.$refs.diagnosis.getNode()
      const diagnosisLabel = this.$refs.diagnosisLabel.getNode()
      const ratio = [
        { ref: 'diagnosis', ratio: 1 },
        { ref: 'medicalHistory', ratio: 1 },
        { ref: 'explain', ratio: 5 },
        { ref: 'autograph', ratio: 1 }
      ]
      let comRatio = 0
      let offsetY = 0
      ratio.map(item => { comRatio += item.ratio })
      ratio.forEach((item, index) => {
        const groupRatio = item.ratio / comRatio
        const target = this.$refs[item.ref].getNode()
        target.width(explains.width())
        target.height(explains.height() * groupRatio)
        target.y(offsetY)
        const label = this.$refs[`${item.ref}Label`].getNode()
        const value = this.$refs[`${item.ref}Value`].getNode()
        const fontRatio = 0.03
        label.fontSize(fontRatio * target.width())
        value.fontSize(fontRatio * target.width())
        offsetY += target.height()
        if (item.ratio < 5 && index !== ratio.length - 1) {
          this.offset(label, 'y')
          this.offset(value, 'y')
        } else if (index !== ratio.length - 1) {
          label.y(diagnosisLabel.height() / 2)
          value.y(diagnosisLabel.height() / 2)
        }
        if (index !== ratio.length - 1) {
          label.x(5)
          value.x(label.width() + 5)
        } else {
          value.x(target.width() - value.width() - 20)
          label.x(value.x() - label.width())
        }
      })
    },
    initailMessage () {
      const target = this.$refs.message.getNode()
      const col = 3 // 固定列数为3
      const row = Math.ceil(this.messageList.length / col)
      this.messageList.forEach((item, index) => {
        const width = target.width() / col
        const height = target.height() / row
        const currentRow = Math.ceil((index + 1) / col)
        const currentCol = (index + 1) % col === 0 ? 3 : (index + 1) % col
        item.x = (currentCol - 1) * width
        item.y = (currentRow - 1) * height
        item.width = width
        item.height = height
        const label = this.$refs[`${item.name}Label`][0].getNode()
        const value = this.$refs[`${item.name}Value`][0].getNode()
        label.x(label.parent.width() / 80)
        value.x(label.x() + label.width())
        this.offset(label, 'y')
        this.offset(value, 'y')
        const ratio = 0.026
        label.fontSize(ratio * target.width())
        value.fontSize(ratio * target.width())
      })
    },
    review () {
      const viewImage = new window.Image()
      viewImage.src = this.fileEdit.getFilePath(this.getBodyPng())
      viewImage.onload = () => { this.viewImage.image = viewImage }
      this.$forceUpdate()
      if (!this.$refs.stage) return
      const stage = this.$refs.stage.getStage()
      const dataURL = stage.toDataURL({ pixelRatio: 3, mimeType: 'image/jpeg' })
      const stage2buffer = new Stage2Buffer()
      stage2buffer.createBuffer(dataURL)
    },
    initailTextFount (res) {
      const stage = this.$refs.stage.getNode()
      const target = this.$refs[res].getNode()
      const targetWidth = stage.width() * 0.3
      target.fontSize(targetWidth / 5)
    },
    setHospital () {
      const image = this.$refs.hospitalImage.getNode()
      if (!image.image()) return
      const parent = this.$refs.hospital.getNode()
      const title = this.$refs.title.getNode()
      const titleText = this.$refs.titleText.getNode()
      parent.width((title.width() - titleText.width()) / 2)
      parent.height(title.height())
      image.width(parent.width() - 5)
      image.height(parent.width() / this.hospitalImage.zoom)
      this.center(image)
    },
    comRatio (stage) {
      const height = stage.height()
      const width = stage.width()
      let countRatio = 0
      this.groupRatio.map(item => {
        const key = Object.keys(item)[0]
        countRatio += item[key]
      })
      let offsetY = 0
      this.groupRatio.forEach(group => {
        const key = Object.keys(group)[0]
        const ratio = group[key] / countRatio
        const groupHeight = height * ratio
        this[key].x = 0
        this[key].y = offsetY
        this[key].width = width
        this[key].height = groupHeight
        offsetY += groupHeight
      })
    },
    /**
     * level
     * vertical
     * all
     */
    offset (ref, direction = 'x') {
      if (toString.call(ref) === '[object String]') {
        const target = this.$refs[ref].getNode()
        if (direction === 'x') {
          this[ref].x = target.parent.width() / 2
          target.offsetX(target.width() / 2)
        } else if (direction === 'y') {
          this[ref].y = target.parent.height() / 2
          target.offsetY(target.height() / 2)
        }
      } else if (toString.call(ref) === '[object Object]') {
        if (direction === 'x') {
          ref.x(ref.parent.width() / 2)
          ref.offsetX(ref.width() / 2)
        } else if (direction === 'y') {
          ref.y((ref.parent.height() - ref.height()) / 2)
        }
      }
    },
    center (ref, align = 'all') {
      switch (align) {
        case 'level':
          this.offset(ref, 'x')
          break
        case 'vertical':
          this.offset(ref, 'y')
          break
        case 'all':
          this.offset(ref, 'x')
          this.offset(ref, 'y')
          break
        default: break
      }
    },
    bottomLine (ref, offsetY = 0) {
      const target = this.$refs[ref].getNode()
      const width = target.parent.width()
      const height = target.parent.height()
      target.points([0, height - offsetY, width, height - offsetY])
    },
    imageAlgin (ref) {
    },
    onResize (size) {
      const { height } = size
      this.viewerSize.height = height
      this.viewerSize.width = (1 / 1.414) * height
    }
  }
}
</script>

<style>
  .stage{
    background-color: #fff;
  }
  .menu-card{
    background: radial-gradient(circle, rgb(0, 163, 163) 0%, teal 100%)
  }
</style>
