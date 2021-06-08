<template>
  <div class="q-py-md q-px-md text-grey-9 ">
    影像科综合信息管理系统
  </div>
</template>

<script>
import _Vue from 'vue'
export default {
  name: 'BottomLink',
  data () {
    return {
      buttonList: _Vue.prototype.$buttonList
    }
  }
}
</script>
<style lang="css" scoped>
  .drawer-footer-link {
    color: inherit;
    text-decoration: none;
    font-weight: 500;
    font-size: .75rem
  }
  .drawer-footer-link:hover{
    color: #000
  }
</style>
