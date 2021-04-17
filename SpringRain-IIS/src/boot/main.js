/**
 * main boot file
 */
// import _router from '../router/permission'
import '../components/ECharts/EChartsConfig'
import '../components/Markdown/Markdown'
import '../quasar.manage.config'
import '../axios/fetchData'
import { handleBaiduStatistics } from 'src/utils/clone-utils'
import { colors } from 'quasar'
import VueKonva from 'vue-konva'
import PubSub from 'pubsub-js'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
function autoCloseAlert ({
  seconds = 3,
  title = 'Alert',
  message = `Autoclosing in ${seconds} seconds.`
}) {
  const dialog = this.$q.dialog({
    title,
    message: `${message}\n${seconds}秒后关闭`
  }).onOk(() => {
    // console.log('OK')
  }).onCancel(() => {
    // console.log('Cancel')
  }).onDismiss(() => {
    console.log('关闭alert')
    clearTimeout(timer)
  })
  const timer = setInterval(() => {
    seconds--
    if (seconds > 0) {
      dialog.update({
        message: `${message}\n${seconds} 秒后将自动关闭${seconds > 5 ? 's' : ''}.`
      })
    } else {
      clearInterval(timer)
      dialog.hide()
    }
  }, 1000)
}
export default async ({ app, router, Vue, publicPath }) => {
  Vue.prototype.$pubsub = PubSub
  Vue.prototype.$autoCloseAlert = autoCloseAlert
  Vue.use(VueKonva)
  // 解构只保留需要的东西
  const { setBrand } = colors
  setBrand('mycolor', '#f33')
  handleBaiduStatistics()
}
