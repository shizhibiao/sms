<template>
  <b-card no-body>
        <div slot="header">
          措施评估<span style="color:#f56c6c">(请输入)</span>
        </div>
        <b-card-body>
           <el-table  
              :data="tableData"
              style="width: 100%">
              
               
                  <el-table-column
                    prop="noticeDepend"
                    label="依据"
                    :formatter="dependFiter"
                  >
                  </el-table-column>
                
                    <el-table-column
                      prop="noticeContent"
                      label="内容"
                    >
                    </el-table-column>
                
                  <el-table-column
                    prop="noticeSuggest"
                    label="建议"
                  >
                  </el-table-column>
                
                  <el-table-column
                    prop="correctContent"
                    label="措施"
                  >
                  </el-table-column>
                
                  <el-table-column
                    prop="planFinishDate"
                    label="计划结束日期"
                  >
                  </el-table-column>
                
                  <el-table-column
                    fixed="right"
                    label="是否通过"
                    min-width='200px'
                  >
                      <template slot-scope="scope">
                        
                              <el-radio v-model="scope.row.passed" :label="true" @change="passed(scope.$index, scope.row)">通过</el-radio>
                              <el-radio v-model="scope.row.passed" :label="false" @change="noPassed(scope.$index, scope.row)">不通过</el-radio>
                      </template>
                  </el-table-column>
              
              
             
             
            </el-table>
        </b-card-body>
  </b-card>
</template>
<script>
import { SafetyNoticeContent, getAllDataAction, saveSafetyNoticeContent } from '../../../services/safety_notice'
import { sourceDataFilter } from '../../../tools'
import PubSub from 'pubsub-js'
export default {
  data () {
    return {
      tableData: [
      ],
      dateFilter: [],
      statusFilter: [],
      ALL_SELECT_DATA: [],
      safetyDeptId: ''

    }
  },
  props: ['taskId', 'flag'],
  methods: {
    formatter (row, column) {
      return row.address
    },
    filterTag (value, row) {
      return row.tag === value
    },
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    handleLookClick (index, row) {
      console.log(index, row)
    },
    resultFormatter (alue, row, column) {
      return alue.auditResult ? '是' : '否'
    },
    // 点击添加
    addAdviseContent (index, row) {
      console.log(index)
      this.$emit('addAdviseContent', {index, row})
    },
    // 转换数据
    dependFiter (alue, row, column) {
      let sourceData = this.ALL_SELECT_DATA.DEPEND_ON
      let filter = sourceDataFilter(sourceData, alue.noticeDepend)
      return filter
    },
    AdviseContentFinish (params) {
      let { index, content } = JSON.parse(JSON.stringify(params))
      this.tableData[index].correctContent = content.correctContent
      this.tableData[index].planFinishDate = content.planFinishDate && content.planFinishDate.split('T')[0]

      this.submitSaveDataHandle(this.tableData[index])
    },
    mySubscriber (message, safetyDeptId) {
      this.safetyDeptId = safetyDeptId
    },
    passed (index, row) {
      this.submitSaveDataHandle(this.tableData[index])
    },
    noPassed (index, row) {
      this.submitSaveDataHandle(this.tableData[index])
    },
    submitSaveDataHandle (params) {
      saveSafetyNoticeContent(params).then(result => {
        if (result.data && result.data.error === 0 && result.data.data) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '保存失败',
            type: 'warning'
          })
        }
      })
    }
    // 添加完成

  },
  created () {

  },
  mounted () {
    this.unSubscribe = PubSub.subscribe('currentSafetyDeptId', this.mySubscriber)
    getAllDataAction().then(result => {
      this.ALL_SELECT_DATA = result
    })
  },
  watch: {
    safetyDeptId (data, newdata) {
      data && SafetyNoticeContent(data).then(result => {
        // console.log(result)
        if (result.data && result.data.error === 0) {
          this.tableData = result.data.data
        }
      })
    }
  },
  destroyed () {
    PubSub.unsubscribe(this.unSubscribe)
  }
}
</script>
