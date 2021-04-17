import moment from 'moment'
import deepClone from 'src/utils/deepClone'
const dictionary = {
  iso: ['(0008,0005)', 'CS', '[ISO_IR 100]'], // 标准  [ISO_IR 100]
  sopClassUID: ['(0008,0016)', 'UI', '=DigitalXRayImageStorageForPresentation'],
  studyDate: ['(0008,0020)', 'DA', '[]'], // studyDate
  seriesDate: ['(0008,0021)', 'DA', '[]'], //
  acquisitionDate: ['(0008,0022)', 'DA', '[]'],
  contentDate: ['(0008,0023)', 'DA', '[]'],
  studyTime: ['(0008,0030)', 'TM', '[]'],
  seriesTime: ['(0008,0031)', 'TM', '[]'],
  acquisitionTime: ['(0008,0032)', 'TM', '[]'],
  contentTime: ['(0008,0033)', 'TM', '[]'],
  accessionNumber: ['(0008,0050)', 'SH', '[]'], // 患者检查流水号
  modality: ['(0008,0060)', 'CS', '[]'], // 设备类型
  modalityType: ['(0008,0061)', 'CS', '[]'], // 设备类型
  patientName: ['(0010,0010)', 'PN', '[]'], // 患者姓名
  patientId: ['(0010,0020)', 'LO', '[]'], // 患者影像ID
  birthDate: ['(0010,0030)', 'DA', '[]'], // 患者出生日期
  gender: ['(0010,0040)', 'CS', '[]'], // 患者性别
  technician: ['(0010,2000)', 'LO', '[]'], // 参与检查医务人员
  allergies: ['(0010,2110)', 'LO', '[]'], // 过敏源
  studyInstanceUid: ['(0020,000d)', 'UI', '[]'], // 检查实例UID
  seriesInstanceUid: ['(0020,000e)', 'UI', '[]'], // 序列UID
  requestiongPhysician: ['(0032,1032)', 'PN', '[]'], // 检查申请医师
  requestedProcedureDescription: ['(0032,1060)', 'LO', '[]'], // 检查请求说明
  scheduledProcedureStepSequence: ['(0040,0100)', 'SQ', '[]'], // 预定程序步骤顺序
  reserved0: ['(fffe,e000)', '-', ''], // 保留位
  requestedContrastAgent: ['(0032,1070)', 'LO', '[]'], // 使用的造影剂
  scheduledStationAeTitle: ['(0040,0001)', 'AE', '[]'], // '扫描工作站AE'
  scheduledProcedureStepStartDate: ['(0040,0002)', 'DA', '[]'], // '检查日期'
  scheduledProcedureStepStartTime: ['(0040,0003)', 'TM', '[]'], // '检查时间'
  scheduledPerformingPhysicianName: ['(0040,0006)', 'PN', '[]'], // '扫描医生'
  scheudledProcedureStepDescription: ['(0040,0007)', 'LO', '[]'], // 预定程序步骤说明
  procedureCode: ['(0040,0009)', 'SH', '[]'], // 计划步骤ID
  scheduledStartionName: ['(0040,0010)', 'SH', '[]'], // 计划启动名称
  scheduledProcedureStepLocation: ['(0040,0011)', 'SH', '[]'], // 计划流程部署
  preMedication: ['(0040,0012)', 'LO', '[]'], // 术前用药
  commentsOnTheScheduledProcedureStep: ['(0040,0400)', 'LT', '[]'], // 对预定程序步骤的注释
  requestdProcedureId: ['(0040,1001)', 'SH', '[]'], // 申请单ID
  requestedProcedurePriority: ['(0040,1003)', 'SH', '[]'], // 患者优先级
  reserved1: ['(fffe,e00d)', '-', ''],
  reserved2: ['(fffe,e0dd)', '-', '']
}

class Dictionary {
  constructor () {
    this.dictionary = deepClone(dictionary)
  }

  setValue (key, value) {
    if (!this.dictionary[key] || !value) return
    const valueType = this.dictionary[key][2]
    let target = value
    if (this.dictionary[key][1] === 'DA') {
      console.log('datavalue: ', value)
      target = moment(value).format('YYYYMMDD')
    } else if (this.dictionary[key][1] === 'TM') {
      target = moment(value).format('HHmmss.SSS')
    }
    if (key === 'gender') {
      value === '男' && (target = 'M')
      value === '女' && (target = 'FM')
    }
    if (valueType === '[]') this.dictionary[key][2] = `[${target}]`
    else this.dictionary[key][2] = `=${target}`
  }
}

export default Dictionary
