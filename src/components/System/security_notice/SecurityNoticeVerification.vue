<template>
  <b-card no-body>
        <div slot="header">
          措施验证<span style="color:#f56c6c">(请输入)</span>
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
                width="180">
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
                prop="planFinishDate"
                label="是否完成"
              >
                <template slot-scope="scope">
                    {{scope.row.completed?'是':'否'}}
                   
                </template>
              </el-table-column>
              <el-table-column
                prop="description"
                label="说明"
              >
              </el-table-column>
              
              <el-table-column
                fixed="right"
                label="操作"
                width="100"
              >
                   <template slot-scope="scope">
                          <el-button @click="addAdviseContent(scope.$index, scope.row)" type="success" size="mini">添加说明</el-button>
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
    // 点击添加
    addAdviseContent (index, row) {
      console.log(row)
      this.$emit('addAdviseContent', {index, row})
    },
    // 转换数据
    dependFiter (alue, row, column) {
      let sourceData = this.ALL_SELECT_DATA.DEPEND_ON
      let filter = sourceDataFilter(sourceData, alue.noticeDepend)
      return filter
    },
    // 添加说明
    AdviseContentFinish (params) {
      let { index, content } = JSON.parse(JSON.stringify(params))
      this.tableData[index].description = content.description
      this.tableData[index].completed = content.completed
      saveSafetyNoticeContent(this.tableData[index]).then(result => {
        if (result.data && result.data.error === 0 && result.data.data) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '添加失败',
            type: 'warning'
          })
        }
      })
    },
    mySubscriber (message, safetyDeptId) {
      this.safetyDeptId = safetyDeptId
    }

  },
  created () {

  },
  mounted () {
    getAllDataAction().then(result => {
      this.ALL_SELECT_DATA = result
    })
    this.unSubscribe = PubSub.subscribe('currentSafetyDeptId', this.mySubscriber)
  },
  watch: {
    safetyDeptId (data, newdata) {
      data && SafetyNoticeContent(data).then(result => {
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
