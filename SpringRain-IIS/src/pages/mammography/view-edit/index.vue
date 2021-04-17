<template>
  <div class="main-content">
    <edit v-if="registed" />
    <worklist @register="register" v-else />
  </div>
</template>

<script>
import worklist from './components/worklist'
import edit from './edit'
import { mapMutations } from 'vuex'
export default {
  components: {
    worklist,
    edit
  },
  data () {
    return {
      registed: false,
      patient: {}
    }
  },
  methods: {
    ...mapMutations(['ACTIVE_PATIENT']),
    register (data) {
      this.ACTIVE_PATIENT(data)
      this.registed = true
    }
  }
}
</script>
