function getMap (state, str) {
  return state[str]
}
export function getMammographyBaseDir (state) {
  return state.baseDir
}

export function getBodyPng (state) {
  return getMap(state, 'bodyPng')
}

export function getViewBmp (state) {
  return getMap(state, 'viewBmp')
}

export function getViewDcm (state) {
  return getMap(state, 'viewDcm')
}

export function getMessageDump (state) {
  return getMap(state, 'messageDump')
}

export function getMessageDcm (state) {
  return getMap(state, 'messageDcm')
}

export function getPushDcm (state) {
  return getMap(state, 'pushDcm')
}

export function getActiveTechnician (state) {
  return state.activeTechnician
}
