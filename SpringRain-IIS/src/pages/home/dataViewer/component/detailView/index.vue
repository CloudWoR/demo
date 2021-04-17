<template>
  <div class="fit" style="height: 100%">
    <q-card
      class="cimo-shadow"
      style="height: 100%;padding: 3px;">
      <v-chart class="" :options="updateOption" autoresize/>
    </q-card>
  </div>
</template>

<script>
import DataDrive from './dataDrive'
export default {
  props: {
    viewData: {
      type: Array,
      defalut: () => []
    }
  },
  data () {
    return {
      avgCompletion: {},
      option: {}
    }
  },
  computed: {
    updateOption () {
      const dataDrive = new DataDrive()
      dataDrive.seriesFormat(this.viewData)
      return dataDrive
    }
  }
}
</script>
