<template>
  <div>
    <q-table
      title="常用字段"
      :data="fieldsTable"
      :columns="columns"
      row-key="id"
    >
    </q-table>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  data () {
    return {
      fieldsTable: [],
      columns: []
    }
  },
  async created () {
    const result = await ipcRenderer.invoke('commonFields-R', { where: { } })
    if (result.length) {
      result.forEach(row => {
        this.fieldsTable.push(row.dataValues)
      })
    }
    if (!this.fieldsTable.length) return
    this.columns = await this.createTable(this.fieldsTable[0])
  },
  methods: {
    createTable (data) {
      return new Promise(resolve => {
        const columns = []
        Object.keys(data).forEach(key => {
          const column = { name: key, align: 'center', label: key, field: key, sortable: true }
          key !== 'id' && columns.push(column)
        })
        resolve(columns)
      })
    }
  }
}
</script>
