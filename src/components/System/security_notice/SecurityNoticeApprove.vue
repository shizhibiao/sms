<template>
  <b-card no-body>
        <div slot="header">
          验证核准
        </div>
        <b-card-body>
          <tree-table :data="showData" :columns="columns" :expandAll="true"/>
        </b-card-body>
  </b-card>
</template>
<script>
import { getSafetyNoticehHistoryListData } from '../../../services/safety_notice'

import treeTable from '@/components/TreeTable'

export default {
  components: { treeTable },
  data () {
    return {
      tableData: [],
      showData: [],
      columns: [
        {
          text: '流程节点',
          value: 'auditTypeDesc',
          width: 250
        },
        {
          text: '审核日期',
          value: 'submitDate'
        },
        {
          text: '办理人',
          value: 'auditUserName'
        },
        {
          text: '办理意见',
          value: 'auditComment'
        },
        {
          text: '办理结果',
          value: 'auditResultDesc'
        }
      ]
    }
  },
  props: ['taskId', 'safetyId', 'flag'],
  methods: {
  },
  created () {

  },
  mounted () {
    // console.log(this.safetyId, this.taskId)
    if ((this.taskId || this.taskId === 0) && (this.safetyId || this.safetyId === 0)) {
      // console.log('触发了')
      this.showData = []
      getSafetyNoticehHistoryListData(this.safetyId, this.taskId).then(result => {
        // console.log('结果', result)
        let data = result.data
        if (data && data.data && data.error === 0) {
          this.tableData = data.data

          for (let obj of this.tableData) {
            let showObj = JSON.parse(JSON.stringify(obj))
            showObj.id = obj.auditId
            showObj.parent_id = null
            showObj.children = []
            if (obj.children && obj.children.length > 0) {
              showObj.auditComment = ''
              for (let chd of obj.children) {
                let childObj = chd
                childObj.id = chd.parentAuditId * 100 + chd.auditId
                childObj.parent_id = chd.parentAuditId
                childObj.children = []
                showObj.children.push(childObj)
              }
            }
            this.showData.push(showObj)
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
