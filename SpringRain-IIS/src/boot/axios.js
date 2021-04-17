import Vue from 'vue'
import InitialAxios from 'src/axios/axiosConfig'

const serverIIS = new InitialAxios('http://localhost:3000')

Vue.prototype.$axios = serverIIS
