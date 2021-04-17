<template>
  <div>
    <q-table
      class="my-sticky-header-table"
      :title="tableTitle"
      :data="tableData"
      :columns="columns"
      row-key="name"
      flat
      bordered
      hide-bottom
      virtual-scroll
      :pagination="{ rowsPerPage: 0 }"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <span class="text-h5">{{ tableTitle }}</span>
        <div class="q-ml-md q-gutter-md">
          <q-btn color="secondary" push label="刷新" @click="update" />
          <q-btn-dropdown push label="选择日期">
            <q-list>
              <q-date
                v-model="date"
                minimal
                :locale="myLocale"
                flat
              >
                <div>
                  <q-btn v-close-popup color="secondary" push label="确认" icon="far fa-thumbs-up" @click="update" />
                </div>
              </q-date>
            </q-list>
          </q-btn-dropdown>
          <q-btn-group push>
            <q-btn color="cyan" push label="门诊" icon="timeline" @click="selectType('patientType', '门诊')" />
            <q-btn color="secondary" push label="住院" icon="visibility" @click="selectType('patientType', '住院')" />
            <q-btn push label="体检" icon="update" @click="selectType('patientType', '体检')" />
          </q-btn-group>
          <q-btn-dropdown push label="设备类型">
            <q-list
              v-for="type in modalityTypeKey"
              :key="type"
              @click="update('modalityType', type)"
            >
              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label
                  >{{ type }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn color="warning" push label="重置" @click="reUpate" />
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    tableTitle () {
      const startDate = this.tableData.length && this.tableData[0].date ? this.tableData[0].date : moment().format('YYYY-MM-DD')
      return `设备工作量统计: ${startDate}`
    }
  },
  data () {
    return {
      myLocale: {
        days: '周一_周二_周三_周四_周五_周六_周日'.split('_'),
        daysShort: '日_一_二_三_四_五_六'.split('_'),
        months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        monthsShort: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        firstDayOfWeek: 1
      },
      date: '',
      patientType: '',
      modalityType: '',
      modalityTypeKey: ['DX', 'CT', 'MR', 'MG', 'RF', 'XA'],
      columns: [
        {
          name: 'modality',
          required: true,
          label: '设备名称',
          align: 'left',
          field: row => row.modality,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'modalityType',
          required: true,
          label: '设备类型',
          align: 'center',
          field: 'modalityType',
          sortable: true
        },
        {
          name: 'patientType',
          align: 'center',
          label: '患者类型',
          field: 'patientType',
          sortable: true
        },
        {
          name: 'allPatient',
          align: 'center',
          label: '接检人次',
          field: 'allPatient',
          sortable: true
        },
        {
          name: 'thenRegister',
          align: 'center',
          label: '已登记',
          field: 'thenRegister',
          sortable: true
        },
        {
          name: 'thenStudy',
          align: 'center',
          label: '已检查',
          field: 'thenStudy',
          sortable: true
        },
        {
          name: 'thenReport',
          align: 'center',
          label: '已提交报告',
          field: 'thenReport',
          sortable: true
        },
        {
          name: 'thenAudit',
          align: 'center',
          label: '已审核报告',
          field: 'thenAudit',
          sortable: true
        },
        {
          name: 'avgStudyTime',
          label: '平均检查时间',
          align: 'center',
          field: 'avgStudyTime',
          format: val => `${moment.duration(val, 'second').asMinutes().toFixed(2)} 分钟`,
          sortable: true
        },
        {
          name: 'avgReportTime',
          label: '平均报告时间',
          align: 'center',
          field: 'avgReportTime',
          format: val => `${moment.duration(val, 'second').asMinutes().toFixed(2)} 分钟`,
          sortable: true
        },
        {
          name: 'avgAuditTime',
          label: '平均审核时间',
          align: 'center',
          field: 'avgAuditTime',
          format: val => `${moment.duration(val, 'second').asMinutes().toFixed(2)} 分钟`,
          sortable: true
        },
        {
          name: 'avgCompletionTime',
          label: '平均完成时间',
          align: 'center',
          field: 'avgCompletionTime',
          format: val => `${moment.duration(val, 'second').asMinutes().toFixed(2)} 分钟`,
          sortable: true
        },
        {
          name: 'positiveRate',
          label: '阳性率',
          align: 'center',
          field: 'positiveRate',
          format: val => `${val}%`,
          sortable: true
        }
      ],
      data: []
    }
  },
  mounted () {

  },
  methods: {
    update (key, value) {
      this[key] = value
      this.date = this.date.replace(/\//g, '-')
      const filter = { date: this.date ? this.date : moment().format('YYYY-MM-DD') }
      this.patientType && (filter.patientType = this.patientType)
      this.modalityType && (filter.modalityType = this.modalityType)
      this.$emit('update', filter)
    },
    selectType (key, type) {
      this[key] = type
      this.update()
    },
    reUpate () {
      this.patientType = ''
      this.modalityType = ''
      this.update()
    }
  }
}
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  min-height: 280px
  height: 430px
  max-height: 430px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
