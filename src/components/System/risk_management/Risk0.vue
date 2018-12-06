<template>
     <b-card  no-body>
            <div slot="header">
                审核历史
                <div class="card-actions">
                    <b-btn class="btn btn-minimize" v-b-toggle.collapse2><i class="icon-arrow-up"></i></b-btn>
                </div>
            </div>
            <b-collapse id="collapse2" :visible='true'>
                <b-card-body>
                    <tree-table :data="showData" :columns="columns" :expandAll="true"/>
                </b-card-body>
            </b-collapse>
        </b-card>
</template>
<script>
import { getRiskStartData0 } from '../../../services/risk'
import treeTable from '@/components/TreeTable'

export default{
  data () {
    return {
      // tableData: [],
      showData: [],
      columns: [
        {
          text: '日期',
          value: 'submitDate',
          width: 250
        },
        {
          text: '操作人',
          value: 'auditUserName'
        },
        {
          text: '操作内容',
          value: 'auditTypeDesc'
        },
        {
          text: '审核意见',
          value: 'auditComment'
        },
        {
          text: '审核结果',
          value: 'auditResultDesc'
        }
      ]
    }
  },
  components: {
    treeTable
  },
  created () {
    // 审核历史
    // console.log(this.taskId, this.riskId)
    if ((this.taskId || this.taskId === 0) && (this.riskId || this.riskId === 0)) {
      this.showData = []
      getRiskStartData0(this.riskId, this.taskId).then(result => {
        console.log('结果', result)
        let data = result.data
        if (data && data.data && data.error === 0) {
          let tableData = data.data

          for (let obj of tableData) {
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
  props: {

    riskId: {
      type: Number
    },
    taskId: {
      type: Number
    }
  },
  watch: {
    showData (data, newdata) {
      if (newdata && newdata.length > 0) {
        let riskDept = newdata && newdata.filter(item => {
          if (item && item.children && item.children.length > 0) {
            return true
          } else {
            return false
          }
        })
        console.log(riskDept)
        if (riskDept && riskDept[0] && riskDept[0].children) {
          let risk = {
            riskDeptId: riskDept[0].children[0].riskDeptId,
            parentAuditId: riskDept[0].children[0].parentAuditId
          }
          this.$emit('getRiskChildObj', risk)
        }
      }
    }
  }
}
</script>