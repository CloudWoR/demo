<template>

  <base-content>
    <div class="container q-pa-lg q-col-gutter-md">
      <div class="row justify-between q-col-gutter-md">
        <div class="col-xs-12 col-md-3 q-gutter-md">
          预留
        </div>
        <div class="col-xs-12 col-md-9">
          <q-card class="cimo-shadow col-11" style="height: 100%;min-height:390px;padding: 3px;">
            <data-view :viewData="workditail" />
          </q-card>
        </div>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-md-3">
          <pie-view :viewData="workditail" />
        </div>
        <div class="col-xs-12 col-md-9">
          <table-of-modality :tableData="workditail" @update="update" />
        </div>
      </div>
    </div>
  </base-content>

</template>

<script>
// import countTo from 'vue-count-to'
import BaseContent from 'src/components/BaseContent/BaseContent'
import { thumbStyle } from 'src/components/BaseContent/thumbStyle'
// import chartPie from 'src/assets/js/echarts-1'
import charts2Option from 'src/assets/js/echarts-2'
import { income, expense, total } from 'src/assets/js/echarts-3'
import chartZ from 'src/assets/js/echarts-4'
import tableOfModality from './component/table'
import DataView from './component/detailView'
import PieView from './component/pieView'
import { mapMutations } from 'vuex'
import moment from 'moment'

export default {
  name: 'home',
  components: {
    BaseContent,
    tableOfModality,
    DataView,
    PieView
    // countTo
  },
  data () {
    return {
      expanded: false,
      chartZ,
      charts2Option,
      income,
      expense,
      total,
      thumbStyle,
      filter: '',
      workditail: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    ...mapMutations(['NET_ERROR']),
    handleTableClick (e) {
      this.$router.push({
        path: 'tableDetail',
        query: {
          id: e.name
        }
      })
    },
    update (filter) {
      this.getData(filter)
    },
    async getData (filter) {
      if (!filter) filter = {}
      if (!filter.date) { filter.date = moment().format('YYYY-MM-DD') }
      const { config, status, statusText, data } = await this.$axios.post('work-detail', filter)
      if (!status >= 200 && !status <= 300) {
        this.NET_ERROR({
          url: config.url,
          status,
          statusText
        })
      }
      this.workditail = data
    }
  }
}
</script>
<style lang="css" scoped>
  .my-card {
    width: 100%;
    min-height: 390px;
    height: 100%;
    /*max-width: 350px;*/
  }

  .income {
    width: 100%;
    background: linear-gradient(to right, #1ecae9 0%, #4AD0D1 99%);
    border-radius: 5px;
    font-size: 14px;
    padding: 11px 15px;
    font-weight: bold;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    color: #ffffff;
    box-shadow: 0 12px 12px -11px #0db4afb8;
    background-size: 200% auto;
  }

  .income:hover {
    background-position: right center;
    box-shadow: 0 12px 20px -11px #0db4afb8;
  }

  .expense {
    width: 100%;
    background: linear-gradient(to left, #FCAC94 0%, #f3a183 98%);
    border-radius: 5px;
    font-size: 14px;
    padding: 11px 15px;
    font-weight: bold;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    color: #ffffff;
    box-shadow: 0 12px 12px -11px #FCA76C;
    background-size: 200% auto;
  }

  .expense:hover {
    background-position: right center;
    box-shadow: 0 12px 20px -11px #FCA76C;
  }

  .total {
    width: 100%;
    background: linear-gradient(90deg, #F073C8 0%, #FF6A95 99%);
    border-radius: 5px;
    font-size: 14px;
    padding: 11px 15px;
    font-weight: bold;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    color: #ffffff;
    box-shadow: 0 12px 12px -11px rgba(240, 115, 200, 0.73);
    background-size: 200% auto;
  }

  .total:hover {
    background-position: right center;
    box-shadow: 0 12px 20px -11px rgba(240, 115, 200, 0.73);
  }

  .btn-table {
    background: linear-gradient(to right, #36d1dc, #5b86e5);
    transition: all 0.3s ease-in-out;
  }

  .btn-table:hover {
    background-position: right center;
    box-shadow: 0 12px 20px -11px #5b86e5;
  }
</style>
