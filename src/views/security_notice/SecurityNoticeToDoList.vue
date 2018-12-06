
<template>
  <div>
    <el-table
    :data="tableData"
    size="small"
    > 
        <el-table-column
        label="#"
        type="index"
        width="40px">
        </el-table-column>
        
        <el-table-column
        label="标题"
        >
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.noticeTitle }}</span>
            </template>
        </el-table-column>
       
        <el-table-column
        label="通知来源"
        >
            <template slot-scope="scope">
               <span style="margin-left: 10px">{{ safetyNoticeSrcFilter(scope.row.noticeSrcType) }}</span>
            </template>
        </el-table-column>
         <el-table-column
        label="通知等级"
        >
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.noticeLevel | transformNoticeLevelFilter}}</span>
            </template>
        </el-table-column>
        <el-table-column
        label="立项部门"
        >
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.submitDeptName }}</span>
            </template>
        </el-table-column>
        <el-table-column
        label="立项日期"
        >
            <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.submitDate }}</span>
            </template>
        </el-table-column>
        <el-table-column
        label="流程状态"
        >
            <template slot-scope="scope">
                {{scope.row.taskInfo.taskName }}
            </template>
        </el-table-column>
        <el-table-column
        label="派发日期"
        >
            <template slot-scope="scopes">
                  {{scopes.row.taskInfo.createTime}}
            </template>
        </el-table-column>

        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="startHandle(scope.$index, scope.row)" v-if='(scope.row.taskInfo&&scope.row.taskInfo.assignee!==null&& scope.row.flag < 2)'>办理</el-button>
                <el-button type="success" size='mini'  v-if='scope.row.taskInfo&&scope.row.taskInfo.assignee===null'
                 @click="signForHandle(scope.$index, scope.row)">签收</el-button>
                <el-button type="success" size='mini' v-if='scope.row.taskInfo&& scope.row.taskInfo.assignee!==null'
                 @click="cancelSignForHandle(scope.$index, scope.row)">取消签收</el-button>
            </template>
        </el-table-column>
    </el-table>

     <b-row>
      <b-col md="12" class="my-1 mt-1" v-if="totalPages > 1">
        <!--<b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />-->
        <el-pagination
          background
          :pager-count="5"
          :current-page.sync="curPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          align="right">
        </el-pagination>
      </b-col>
    </b-row>

  </div>
</template>
<script>
import {
  getSafetyNoticeToDoListData,
  getAllDataAction,
  signForTask,
  activitiCancelClaim
} from '../../services/safety_notice'
import {

  sourceDataFilter

} from '../../tools'
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      curPage: 1,
      pageSize: 15,
      totalPages: 1
    }
  },
  methods: {
    // 办理
    startHandle (index, row) {
      // console.log(row)
      let safetyId = row.safetyId
      let flag = row.flag

      let taskId = row.taskInfo && row.taskInfo.taskId
      let taskInfo = row.taskInfo
      let procStatus = row.procStatus
      if (safetyId && row.taskInfo) {
        let query = {
          safetyId: safetyId,
          flag,
          taskId,
          auditType: procStatus

        }
        let params = {
          id: flag,
          taskInfo: taskInfo
        }

        this.$router.push({
          name: `${taskInfo.taskName}`,
          query,
          params

        })
      }
    },
    filterTag (value, row) {
      // console.log(value, row)
      if (row.data && row.data) {
        return row.data.procStatus === value
      } else {
        return ''
      }
    },
    filerTypeHandle (data) {
      if (data || data === 0) {
        switch (+data) {
          case -1:
            return ''
          case 0:
            return 'success'
          case 1:
            return 'info'
          case 2:
            return 'warning'
          case 3:
            return 'danger'
          default:
            return ''
        }
      } else {
        return ''
      }
    },
    safetyNoticeSrcFilter (value) {
      let sourceData = this.ALL_SELECT_DATA.ANNOUNCE_RESOURCE
      let result = sourceDataFilter(sourceData, value)
      return result
    },
    signForHandle (index, row) {
      let taskId = row.taskInfo && row.taskInfo.taskId
      let userId = this.userId

      this.$confirm('确定要签收吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        signForTask(taskId, userId).then(result => {
          if (result.data && result.data.error === 0) {
            this.$message({
              type: 'success',
              message: '签收成功'
            })
            this.startHandle(index, row)
          } else {
            this.$message({
              type: 'error',
              message: '签收失败'+result.data.message
            })
          }
        }).catch(error => {
          this.$message.error('网络或者服务器错误' + error)
        })
      })
    },

    // 取消签收
    cancelSignForHandle (index, row) {
      let taskId = row.taskInfo && row.taskInfo.taskId

      this.$confirm('确定要取消签收吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        activitiCancelClaim(taskId).then(result => {
          if (result.data && result.data.error === 0) {
            this.$message({
              type: 'success',
              message: '取消签收成功'

            })
            this.refresh()
          } else {
            this.$message({
              type: 'error',
              message: '取消签收失败'+result.data.message
            })
          }
        })
      })
    },
    refresh () {
      getSafetyNoticeToDoListData().then(result => {
        let data = result.data
        console.log(data)
        if (data.error === 0 && data.data) {
          let page = data.data
          this.total = page.totalElements
          this.totalPages = page.totalPages
          let count = 1
          
          this.tableData = data.data  
        }
      })
    }

  },
  created () {
    // this.refresh()
  },
  computed: {
    userId () {
      return this.$store.state.user.userId
    },
    ALL_SELECT_DATA(){
      return this.$store.state.ALL_SELECT_DATA
    }
  }
}
</script>