<template>
  <base-content>
    <div class="bg-wirte fit cimo-shadow column">
      <FiledsTable class="col q-ma-xs" />
      <div class="row">
        <q-btn class="q-ml-md" push>添加</q-btn>
        <q-btn class="q-ml-md" push>修改</q-btn>
        <q-btn class="q-ml-md" push>删除</q-btn>
        <q-input
          dark
          dense
          standout
          v-model="searchFields"
          label-color="orange"
          input-class="text-right"
          class="shadow-3 q-ml-md">
          <template v-slot:before>
            <q-btn-dropdown push color="primary" label="文本">
              <q-list>
                <q-item clickable v-close-popup @click="onItemClick">
                  <q-item-section>
                    <q-item-label>Photos</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="onItemClick">
                  <q-item-section>
                    <q-item-label>Videos</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="onItemClick">
                  <q-item-section>
                    <q-item-label>Articles</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </template>
          <template v-slot:append>
            <q-icon v-if="searchFields === ''" class="text-primary" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''" />
          </template>
        </q-input>
      </div>
      <AddFileds class="col q-ma-xs" />
    </div>
  </base-content>
</template>

<script>
import BaseContent from 'src/components/BaseContent'
import FiledsTable from './fieldsTable'
import AddFileds from './addFileds'
import { ipcRenderer } from 'electron'
export default {
  components: {
    BaseContent,
    FiledsTable,
    AddFileds
  },
  data () {
    return {
      activeImages: '',
      searchFields: '',
      fieldsTable: []
    }
  },
  async mounted () {
    const result = await ipcRenderer.invoke('diagnosis-R', { where: { } })
    if (result.length) {
      result.forEach(row => {
        this.fieldsTable.push(row.dataValues)
      })
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
