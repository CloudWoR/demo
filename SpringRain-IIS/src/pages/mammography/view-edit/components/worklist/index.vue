<template>
    <div class="container q-pa-md q-col-md fit">
      <div class="q-pa-md shadow-12 fit column">
        <div class="col row">
          <div class="col q-ma-md">
            <q-btn color="primary" label="检查状态">
              <q-menu
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                <q-list style="min-width: 100px">
                  <q-item clickable>
                    <q-item-section>已登记</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable>
                    <q-item-section>已检查</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable>
                    <q-item-section>已提交</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            |
            <q-btn @click="register">图像编辑器</q-btn>
          </div>
          <!-- <div class="col">
            <q-btn label="选择日期">
              <q-menu
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                <q-date
                  v-model="date"
                  title="日期"
                  subtitle="年份"
                />
              </q-menu>
            </q-btn>
          </div> -->
          <div class="col">
            <!-- <q-btn @click="register">图像编辑器</q-btn> -->
            <!-- <q-btn @click="sequelize">sequelize</q-btn> -->
          </div>
        </div>
        <q-separator />
        <div class="col-10 row q-pa-md q-gutter-md">
          <q-card
            class="patient-card non-selectable cursor-pointer bg-secondary text-white shadow-6"
            :style="patientCard"
            v-for="(item, index) in currentPage"
            :key="index"
            @dblclick="register(item)"
          >
            <q-card-section>
              <div class="column">
                <div class="col row">
                  <div class="col text-center">
                    <q-icon name="account_circle" class="text-h6" />
                  </div>
                  <div class="col-11 text-center text-h6">
                    {{ item.PatientCName }}
                  </div>
                </div>
                <div class="col row">
                  <div class="col text-center">
                    <q-icon name="fas fa-hospital-user" />
                  </div>
                  <div class="col-11 text-center q-ml-x-md">
                    {{ item.RISPID }}
                  </div>
                </div>
                <div class="col row">
                  <div class="col text-center">
                    <q-icon name="elevator" />
                  </div>
                  <div class="col-11 text-center">
                    {{ item.AccessionNumber }}
                  </div>
                </div>
                <div class="col row">
                  <div class="col text-center">
                    <q-icon name="fas fa-venus-mars" />
                  </div>
                  <div class="col-11 text-center">
                    {{ item.Sex }}
                  </div>
                </div>
                <div class="col row">
                  <div class="col text-center">
                    <q-icon name="fas fa-hanukiah" />
                  </div>
                  <div class="col-11 text-center">
                    {{ item.Age }}
                  </div>
                </div>
                <div class="col row">
                  <div class="col text-center">
                    <q-icon name="fas fa-history" />
                  </div>
                  <div class="col-11 text-center">
                    {{ item.DJTime }}
                  </div>
                </div>
                <div class="col row">
                  <div class="col text-center" >
                    <q-icon name="fas fa-scroll" />
                  </div>
                  <div class="col-11 text-center">
                    {{ item.Description }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
          <q-resize-observer @resize="onResize" />
        </div>
        <q-separator />
        <div class="q-pa-md flex flex-center col">
          <q-pagination
            v-model="current"
            color="cyan"
            :max="maxPage"
            :max-pages="6"
            :boundary-numbers="true"
          >
          </q-pagination>
        </div>
      </div>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron'
// import moment from 'moment'
export default {
  components: {
  },
  data () {
    return {
      current: 1,
      date: '',
      patientCard: {
        minWidth: '220px',
        minHeight: '190px',
        maxHeight: '190px'
      },
      patientList: [],
      sql: '',
      maxCard: 20
    }
  },
  computed: {
    maxPage () {
      console.log('length', this.patientList.length)
      const maxPage = Math.ceil(this.patientList.length / this.maxCard)
      return maxPage
    },
    currentPage () {
      const start = (this.current - 1) * this.maxCard
      const end = (this.current * this.maxCard)
      return this.patientList.slice(start, end)
    }
  },
  async mounted () {
    // const start = moment().format('YYYY-MM-DD') + ' 00:00:00'
    // const end = moment().format('YYYY-MM-DD') + ' 23:59:59'
    // const sql = `SELECT * from tReportInfoKiosk where DJTime BETWEEN '${start}' and '${end}' and ModalityType = 'MG'`
    // console.log('sql: ', sql)
    // this.patientList = await ipcRenderer.invoke('querySqlServer', sql)
    // console.log('sql: ', this.patientList)
  },
  methods: {
    async sequelize () {
      await ipcRenderer.invoke('diagnosis-C', {
        username: 'test',
        password: 'password',
        test: 'test'
      })
      // const request = await ipcRenderer.invoke('diagnosis-U', {
      //   where: {
      //     id: '9beca52f-3ce9-4c76-a6a0-d665eb1c4c12'
      //   },
      //   attributes: {
      //     username: 'update'
      //   }
      // })
      const request = await ipcRenderer.invoke('diagnosis-R', {
        where: {
          username: 'test1'
        }
      })
      console.log('request: ', request)
    },
    onResize (size) {
      console.log('size: ', size)
      const { width, height } = size
      this.patientCard.width = (width / 5) + 'px'
      this.patientCard.height = (height / 4) + 'px'
      const maxRow = Math.floor(height / 210)
      const maxColumn = Math.floor(width / 236) > 4 ? 4 : Math.floor(width / 236)
      this.maxCard = maxRow * maxColumn
      console.log(this.maxCard, maxRow, maxColumn)
    },
    register (patient) {
      this.$emit('register', patient)
    },
    toLowerLine (str) {
      if (str.substr(0, 3) === 'mat') {
        return str.replace(/([A-Z]|\d+)/g, (a, l) => `_${l.toLowerCase()}`).substring(4)
      }
      if (str.substr(0, 2) === 'fa') {
        return str.replace(/([A-Z]|\d+)/g, (a, l) => `-${l.toLowerCase()}`).replace(/-/, ' fa-')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.patient-card:hover {
  box-shadow: 5px 5px 5px #7a7474;
}
.patient-card:active {
  box-shadow: none;
}
</style>
