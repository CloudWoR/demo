<template>
  <div class="q-pa-md">

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md column"
    >
      <div class="col row q-gutter-md">
        <div class="col" style="max-width: 300px; min-width: 300px">
          <q-select
            clearable
            standout="bg-teal text-white"
            color="purple-12"
            v-model="form.diseases"
            use-input
            :options="diseasesOptions"
            hint="选择节点类型"
            label="节点类型"
            @filter="diseasesFilter"
            @new-value="newDiseasesOptions"
          />
          <q-separator class="q-mt-md" color="white" />
          <q-input
            standout="bg-teal text-white"
            v-model="form.keyword"
            label="节点名称"
            hint="输入需要添加的节点的名称"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />
          <q-separator class="q-mt-md" color="white" />
          <q-input
            standout="bg-teal text-white"
            v-model="form.fields"
            label="AE-Title"
            hint="输入目标节点的AE-Title"
          />
          <q-separator class="q-mt-md" color="white" />
        </div>
        <div class="col" style="max-width: 300px; min-width: 300px">
          <q-input
            standout="bg-teal text-white"
            v-model="form.fields"
            label="IP地址"
            hint="输入目标节点的IP地址"
          />
          <q-separator class="q-mt-md" color="white" />
          <q-input
            standout="bg-teal text-white"
            v-model="form.keyword"
            label="端口号"
            hint="输入目标节点的端口号"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />
          <q-separator class="q-mt-md" color="white" />
          <q-toggle
            v-model="accept"
            label="是否设为组内默认"
            hint="将此节点作为该类型dicom节点的默认配置"
          />
          <q-separator class="q-mt-md" color="white" />

        </div>
        <div class="col">
          <q-card
            class="bg-grey-9 text-white"
          >
            <q-card-section>
              <div class="text-h6">常用字段配置</div>
              <q-separator color="white" />
              <div class="text-subtitle1">配置用于乳腺钼靶视图编辑时的快捷录入</div>
            </q-card-section>

          </q-card>
        </div>
      </div>
      <div class="col row justify-center" style="max-width: 600px">
        <q-btn label="提交" push type="submit" color="cyan"/>
        <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  /**
 * fields：字段文字
 * diseases：疾病名称
 * fieldsType：字段类型：（临床诊断，病史，补充说明）
 * heat：热度
 * keyword：关键字
 * shortcutCode：快捷码
 */
  data () {
    return {
      fieldsType: ['临床诊断', '病史', '补充说明'],
      diseasesOptions: [],
      form: {
        fields: '',
        diseases: '',
        fieldsType: '',
        heat: 0,
        keyword: '',
        shortcutCode: ''
      }
    }
  },
  methods: {
    async diseasesFilter (val, update, abort) {
      if (this.diseasesOptions.length) {
        update()
        return
      }
      const result = await ipcRenderer.invoke('commonFields-R', {
        attributes: ['diseases']
      })
      const options = []
      if (result.length) {
        result.forEach(row => {
          options.push(row.dataValues.diseases)
        })
      }
      update(() => {
        console.log('options: ', options)
        this.diseasesOptions = options
      })
    },
    newDiseasesOptions (value, done) {
      !this.diseasesOptions.includes(value) && this.diseasesOptions.push(value)
      done(value)
    },
    async onSubmit () {
      const result = await ipcRenderer.invoke('commonFields-C', this.form)
      console.log('reuslt', result)
    },
    onReset () {
      const form = {
        fields: '',
        diseases: '',
        fieldsType: '',
        heat: 0,
        keyword: '',
        shortcutCode: ''
      }
      this.form = form
    }
  }
}
</script>
