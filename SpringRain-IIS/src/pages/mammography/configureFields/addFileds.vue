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
            hint="选择或者添加一个疾病名称"
            label="疾病名称"
            @filter="diseasesFilter"
            @new-value="newDiseasesOptions"
          />
          <q-separator class="q-mt-md" color="white" />
          <q-field
            standout="bg-teal text-white"
            hint="点击上面按钮选择一个字段类型"
          >
            <template v-slot:control>
              <q-btn-toggle
                name="genre"
                v-model="form.fieldsType"
                push
                glossy
                toggle-color="cyan"
                :options="[
                  {label: '临床诊断', value: '临床诊断'},
                  {label: '病   史', value: '病史'},
                  {label: '补充说明', value: '补充说明'}
                ]"
              />
            </template>
          </q-field>
          <q-separator class="q-mt-md" color="white" />
          <q-input
            standout="bg-teal text-white"
            autogrow
            v-model="form.fields"
            label="字段"
            hint="输入待添加的字段"
          />
          <q-separator class="q-mt-md" color="white" />
        </div>
        <div class="col" style="max-width: 300px; min-width: 300px">
          <q-field
            standout="bg-teal text-white"
            hint="设置字段热度"
          >
            <template v-slot:control>
              <q-slider
                v-model="form.heat"
                label
                label-always
                color="cyan"
                markers
                snap
                :min="0"
                :max="10"
              />
            </template>
          </q-field>
          <q-separator class="q-mt-md" color="white" />
          <q-input
            standout="bg-teal text-white"
            v-model="form.keyword"
            label="关键字"
            hint="配置一个快捷关键字"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />
          <q-separator class="q-mt-md" color="white" />
          <q-input
            standout="bg-teal text-white"
            v-model="form.shortcutCode"
            label="字段快捷码"
            hint="输入一个英文快捷码"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
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
