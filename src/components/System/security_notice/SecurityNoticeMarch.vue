<template>
  <b-card no-body>
        <div slot="header">
          审核历史
          <div class="card-actions">
            <b-btn class="btn btn-minimize" v-b-toggle.collapse3><i class="icon-arrow-up"></i></b-btn>
          </div>
        </div>
        <b-collapse id="collapse3" :visible='true'>
        <b-card-body>
          <tree-table :data="showData" :columns="columns" :expandAll="true"/>
        </b-card-body>
        </b-collapse>
  </b-card>
</template>
<script>
import { getSafetyNoticehHistoryListData } from '../../../services/safety_notice'

import treeTable from '@/components/TreeTable'

import PubSub from 'pubsub-js'

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
    if ((this.taskId || this.taskId === 0) && (this.safetyId || this.safetyId === 0)) {
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
  },
  watch: {
    showData (data, newdata) {
      if (newdata && newdata.length > 0) {
        let safetyDept = newdata && newdata.filter(item => {
          if (item && item.children && item.children.length > 0) {
            return true
          } else {
            return false
          }
        })
        if (safetyDept && safetyDept[0] && safetyDept[0].children) {
          let safetyDeptId = safetyDept[0].children[0].safetyDeptId
          PubSub.publish('currentSafetyDeptId', safetyDeptId)
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
