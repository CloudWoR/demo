<template>

  <div class="flex justify-center items-center q-electron-drag" style="height: 100%">
    <div class="row base-card-shadow electron-hide" style="width: 60vw;min-width: 300px">
      <div class="col-6 flex justify-center items-center " v-show="$q.screen.gt.sm">
        <q-skeleton type="text" height="70%" width="50%" v-if="!isLottieF"/>
        <lottie-web-cimo align="right" style="height: 70%" :path="defaultOptions.path" @isLottieFinish="handleFinish"/>
      </div>
      <q-separator vertical inset v-if="$q.screen.gt.sm"/>
      <div class="col flex justify-center items-center">
        <q-card square style="min-width: 290px;height: 100%; width: 60%;" class="no-shadow">
          <q-card-section align="center">
            <h3 class="text-uppercase">cimo</h3>
            <!-- 用户名 -->
            <q-input class="logon-input"
                     clearable
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="username"
                     label="账号"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle"/>
              </template>
            </q-input>
            <!-- 密码 -->
            <q-input class="logon-input"
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="password"
                     label="密码"
                     :type="isPwd ? 'password' : 'text'" hint=""
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key"/>
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <!-- 登录按钮 -->
            <q-btn
              :loading="loading"
              class="logon-btn bg-logon-card-input"
              text-color="white"
              unelevated
              label=""
              style="font-size: large;"
              @click="logon"
            >登 录 系 统
            </q-btn>
            <div class="row justify-between" style="margin-bottom: 20px;">
              <q-btn flat label="忘记密码"/>
              <q-btn outline label="我要注册"/>
            </div>
            <!-- <p class="text-grey" align="left">账号2 ：test &nbsp;&nbsp;&nbsp;&nbsp;密码均为空</p> -->
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- electron 登录 -->
    <div class="row electron-only q-electron-drag wrap justify-around" style="width: 100vw;min-width: 300px;background: rgba(255,255,255,0);">

      <!-- <div class="col flex justify-center items-center" v-show="$q.screen.gt.sm"> -->
      <div class="col flex justify-center items-center">
        <q-skeleton type="text" height="100%" width="50%" v-if="!isLottieF"/>
        <lottie-web-cimo align="right" style="height: 70%" :path="defaultOptions.path" @isLottieFinish="handleFinish"/>
      </div>
      <q-separator vertical inset/>

      <div class="col flex justify-center items-center">

        <q-card square style="min-width: 290px;height: 100%; width: 60%;" class="no-shadow">
          <q-card-section align="center">
            <h5 class="text-uppercase" style="color: teal">影像科综合信息管理系统——IIS</h5>
            <!-- <q-img
                :src="this.$PUBLIC_PATH + 'data/juesang.jpg'"
                :ratio="16/9"
              /> -->
            <!-- 用户名 -->
            <q-input class="logon-input q-electron-drag--exception"
                     clearable
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="username"
                     label="账号"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle"/>
              </template>
            </q-input>
            <!-- 密码 -->
            <q-input class="logon-input q-electron-drag--exception"
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="password"
                     label="密码"
                     :type="isPwd ? 'password' : 'text'" hint=""
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key"/>
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <!-- 登录按钮 -->
            <q-btn
              :loading="loading"
              class="logon-btn bg-logon-card-input"
              text-color="white"
              unelevated
              label=""
              style="font-size: large;"
              @click="logon"
            >登 录 系 统
            </q-btn>
            <div class="row justify-between" style="margin-bottom: 20px;">
              <q-btn  @click="remote('logon', 'message: 忘记密码')" flat label="忘记密码"/>
              <q-btn @click="remote('logout', 'message: 我要注册')" outline label="我要注册"/>
              <q-btn class="quit-app" @click="remote('quitApp')" label="退  出" text-color="white"></q-btn>
            </div>
            <p class="text-grey" align="left">账号 ：supervice &nbsp;&nbsp;&nbsp;&nbsp;</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- electron end -->
  </div>

</template>

<script>
import LottieWebCimo from '../../components/LottieWebCimo/LottieWebCimo'
import { mapMutations, mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'
export default {
  name: 'logon',
  components: { LottieWebCimo },
  data () {
    return {
      isPwd: true,
      username: 'supervice',
      password: '',
      defaultOptions: {
        path: 'https://assets9.lottiefiles.com/packages/lf20_vo0a1yca.json',
        loop: true
      },
      loading: false,
      percentage: 0,
      isLottieF: false
    }
  },
  methods: {
    ...mapMutations(['LOGON']),
    ...mapGetters(['getState']),
    async logon () {
      this.loading = !this.loading
      const result = await this.$store.dispatch('LOGON', { username: this.username, password: this.password })
      console.log('result', result)
      if (result) {
        // this.LOGON({}) // 必须传入一个对象
        const lt = setTimeout(() => {
          this.$router.push('/').then(e => {
            this.$q.notify({
              icon: 'insert_emoticon',
              message: 'hi，cimo 欢迎回来',
              color: 'green',
              position: 'top',
              timeout: 1500
            })
            clearTimeout(lt)
            this.loading = !this.loading
          })
        }, 100)
      } else {
        this.loading = !this.loading
        this.$q.notify({
          icon: 'announcement',
          message: '账号错误',
          color: 'red',
          position: 'top',
          timeout: 1500
        })
      }
    },
    async remote (c, message) {
      const state = this.getState()
      console.log(state)
      await ipcRenderer.invoke(c, message)
    },
    handleFinish (e) {
      this.isLottieF = e
    }
  }
}
</script>

<style scoped>
  .logon-btn {
    font-size: large;
    margin-top: 0px;
    margin-bottom: 20px;
    width: 100%;
  }

  .bg-logon-card-input {
    background: linear-gradient(to right, #36d1dc 1%, #5b86e5 99%);
    transition: all 0.3s ease-in-out;
    background-size: 200% auto;
  }

  .bg-logon-card-input:hover {
    background-position: right center;
    box-shadow: 0 12px 20px -11px #5b86e5;
  }

  .quit-app {
    background: linear-gradient(to right, #ED213A 1%, #93291E 99%);
    transition: all 0.3s ease-in-out;
    background-size: 200% auto;
  }

  .quit-app:hover {
    background-position: right center;
    box-shadow: 0 12px 20px -11px #5b86e5;
  }
</style>
