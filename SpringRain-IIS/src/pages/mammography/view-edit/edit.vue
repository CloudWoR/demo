<template>
  <base-content>
    <q-splitter
      class="q-ma-md main-content bg-cyan shadow-24"
      v-model="splitterModel"
      :limits="[10, 30]"
      separator-class="bg-white"
      before-class="bg-cyan-7 non-selectable"
      after-class="non-selectable"
    >
      <template v-slot:before>
        <q-layout view="hHh lpr lff" container style="height: 100%">
          <q-header elevated class="bg-cyan-7">
            <q-toolbar>
              <q-toolbar-title class="text-center">
                <q-avatar>
                  <img :src="url">
                </q-avatar>
                选项卡
              </q-toolbar-title>
            </q-toolbar>
          </q-header>
          <q-page-container>
            <q-page>
              <q-expansion-item
                default-opened
                icon="perm_identity"
                label="系统图标"
              >
                <q-card id="defaultIcon" class="row q-gutter-x-md items-center">
                    <q-img
                      class="col col-md-4"
                      v-for="(item, index) in imagePath"
                      :key="index"
                      :src="item.src"
                      :style="{width: '50px', minWidth: '50px', maxWidth: '50px'}"
                      @dblclick="checkIcon(item)"
                    />
                </q-card>
              </q-expansion-item>
              <q-expansion-item
                default-opened
                icon="border_color"
                label="临床诊断"
              >
                <q-card>
                  <q-input clearable filled autogrow v-model="diagnosis" label="临床诊断" />
                </q-card>
              </q-expansion-item>
              <q-expansion-item
                default-opened
                icon="border_color"
                label="病史"
              >
                <q-card>
                  <q-input clearable filled autogrow v-model="medicalHistory" label="病史" />
                </q-card>
              </q-expansion-item>
              <q-expansion-item
                default-opened
                icon="border_color"
                label="补充说明"
              >
                <q-card>
                  <q-input clearable filled autogrow v-model="explain" label="补充说明" />
                </q-card>
              </q-expansion-item>
              <q-expansion-item
                default-opened
                icon="fas fa-user-md"
                label="检查医生"
              >
                <q-card class="q-ma-md">
                  <q-btn-dropdown push class="float-right glossy stack" color="cyan" label="点击选择检查医生" dropdown-icon="play_arrow">
                    <q-list>
                      <q-item
                        v-for="technician in technicianList"
                        :key="technician"
                        clickable
                        v-close-popup
                        @click="onItemClick(technician)"
                      >
                        <q-item-section>
                          <q-item-label class="text-center">{{ technician }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </q-card>
              </q-expansion-item>
            </q-page>
          </q-page-container>
        </q-layout>
      </template>

      <template v-slot:after>
      <q-layout view="hHh lpr lff" container style="height: 100%">
        <q-header elevated class="bg-cyan">
          <q-toolbar>
            <q-toolbar-title class="text-center">
              <q-avatar>
                <img :src="url">
              </q-avatar>
              乳腺钼靶触诊编辑器
            </q-toolbar-title>
          </q-toolbar>
        </q-header>
        <q-page-container>
          <q-page>
            <right-page
              :checkedList="checkedList"
              :explain="{
                diagnosis,
                medicalHistory,
                explain
              }"
            />
          </q-page>
        </q-page-container>
      </q-layout>
      </template>
    </q-splitter>
  </base-content>
</template>

<script>
import fs from 'fs'
import path from 'path'
import BaseContent from 'src/components/BaseContent/BaseContent'
import rightPage from './rightPage'
import { mapMutations } from 'vuex'
import PubSub from 'pubsub-js'
export default {
  components: {
    BaseContent,
    rightPage
  },
  props: {},
  data () {
    return {
      technicianList: ['陈文清', '胡丹', '马乔雯', '崔玉果', '李一鸣', '李春芳'],
      activeTechnician: '',
      url: 'images/sys-images/mammography/static/original.jpg',
      splitterModel: 16,
      imagePath: [],
      stage: null,
      stageConfig: {
        width: 100,
        height: 100
      },
      checkedList: [],
      diagnosis: '输入临床诊断',
      medicalHistory: '输入病史',
      explain: '1、补充说明\n2、补充说明'
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
    ...mapMutations(['setActiveTechnician']),
    onItemClick (activeTechnician) {
      this.activeTechnician = activeTechnician
      this.setActiveTechnician(activeTechnician)
      PubSub.publish('activeTechnician', this.activeTechnician)
    },
    checkIcon (img) {
      const length = this.checkedList.length
      if (img.name === 'text.jpeg') {
        this.checkedList.push({
          text: '在此输入文字描述...',
          name: `text${length}`,
          fontSize: 20,
          draggable: true,
          width: 200
        })
      } else {
        const image = new Image()
        image.src = img.src
        image.onload = () => {
          this.checkedList.push({
            width: 50,
            height: 50,
            image,
            name: `${img.name}${length}`,
            draggable: true
          })
          console.log(this.checkedList)
        }
      }
    }
  }
}
</script>

<style scoped>
.main-content {
  height: calc(100vh - 120px);
}
</style>
