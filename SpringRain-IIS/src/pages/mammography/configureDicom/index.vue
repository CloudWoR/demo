<template>
  <base-content>
    <div class="bg-wirte fit cimo-shadow">
      <q-table
        title="已配置Dicom节点"
        :data="dicomTable"
        :columns="tableColumns"
        row-key="id"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>
            <q-td key="type" :props="props">
              {{ props.row.type }}
            </q-td>
            <q-td key="Aet" :props="props">
              {{ props.row.Aet }}
            </q-td>
            <q-td key="IPAddress" :props="props">
              {{ props.row.IPAddress }}
            </q-td>
            <q-td key="port" :props="props">
              {{ props.row.port }}
            </q-td>
            <q-td key="default" :props="props">
              {{ props.row.default }}
            </q-td>
            <q-td key="edit" :props="props">
              <q-btn push>编辑</q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <AddDicom class="col" />
    </div>
  </base-content>
</template>

<script>
import BaseContent from 'src/components/BaseContent'
import AddDicom from './addDicom'
import { ipcRenderer } from 'electron'
export default {
  components: {
    BaseContent,
    AddDicom
  },
  data () {
    return {
      tableColumns: [
        { name: 'id', label: '节点名称', field: 'id', required: false, align: 'center' },
        { name: 'type', label: '节点类型', field: 'type', required: true, align: 'center', sortable: true },
        { name: 'Aet', label: 'AE-title', field: 'Aet', required: true, align: 'center', sortable: true },
        { name: 'IPAddress', label: 'IP地址', field: 'IPAddress', required: true, align: 'center', sortable: true },
        { name: 'port', label: '端口号', field: 'port', required: true, align: 'center', sortable: true },
        { name: 'default', label: '组默认', field: 'default', required: true, align: 'center', sortable: true },
        { name: 'edit', label: '编辑', field: 'type', required: true, align: 'center' }
      ],
      dicomTable: [
        {
          id: '123',
          type: 'worklist',
          Aet: 'AE-Title',
          IPAddress: '192.168.11.218',
          port: '6020',
          default: true
        },
        {
          id: '123',
          type: 'worklist',
          Aet: 'AE-Title',
          IPAddress: '192.168.11.218',
          port: '6020',
          default: true
        },
        {
          id: '123',
          type: 'worklist',
          Aet: 'AE-Title',
          IPAddress: '192.168.11.218',
          port: '6020',
          default: true
        }
      ]
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
