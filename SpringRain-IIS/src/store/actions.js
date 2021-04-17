const actions = {
  async LOGON ({ commit }, userinfo) {
    console.log('store_userinfo: ', userinfo)
    return new Promise((resolve) => {
      setTimeout(() => {
        userinfo.role = userinfo.username
        userinfo.token = 972784674
        if (userinfo.username === 'admin' || userinfo.username === 'test' || userinfo.username === 'supervice') {
          commit('LOGON', userinfo)
          resolve(true)
        } else {
          resolve(false)
        }
      }, 100)
    })
  }
}

export default actions
