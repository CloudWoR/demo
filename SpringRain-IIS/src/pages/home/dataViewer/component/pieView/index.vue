<template>
  <div>
    <q-card class="cimo-shadow" style="height: 430px; width: 100%; padding: 3px">
      <!-- <v-chart class="" :options="chartPie" autoresize/> -->
      <v-chart class="" :options="chartPieData" autoresize/>
    </q-card>
  </div>
</template>

<script>
import PieDirver from './pieDirver'
import test from '../../../../../assets/js/echarts-1'
export default {
  props: {
    viewData: {
      type: Array,
      defalut: () => []
    }
  },
  computed: {
    chartPieData () {
      const pieData = new PieDirver()
      const data = {}
      this.viewData.forEach(item => {
        if (!data[item.modality]) data[item.modality] = { name: item.modality, value: 0 }
        data[item.modality].value += (item.allPatient * 1)
      })
      pieData.setData(data)
      console.log('pieData', pieData.option)
      return pieData.option
    }
  },
  data () {
    return {
      test
    }
  }
}
</script>
