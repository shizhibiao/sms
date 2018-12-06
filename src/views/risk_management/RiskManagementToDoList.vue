
<template>
  <div>
    <el-table
    :data="tableData"
    size="small"
    >
        <el-table-column
        label="#"
        width="40px">
            <template slot-scope="scope">
                {{scope.$index+1}}
            </template>
        </el-table-column>

        <el-table-column
        label="标题"
        >
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.riskTitle }}</span>
            </template>
        </el-table-column>

        <el-table-column
        label="项目来源"
        >
            <template slot-scope="scope">
               <span style="margin-left: 10px">{{ projectSrcFilter(scope.row.projectSrc) }}</span>
            </template>
        </el-table-column>
        <el-table-column
        label="立项等级"
        >
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ projectLevelFilter(scope.row.projectLevel) }}</span>
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
        label="状态"

        >
            <template slot-scope="scope">
                <span>{{scope.row.taskInfo.taskName}}</span>
            </template>
        </el-table-column>
        <el-table-column
        label="派发日期"
        >
            <template slot-scope="scopes">
                  {{scopes.row.taskInfo.createTime}}
            </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--label="办理日期"-->
        <!--&gt;-->
            <!--<template slot-scope="scopes">-->
                  <!--{{scopes.row.taskInfo.endTime}}-->
            <!--</template>-->
        <!--</el-table-column>-->
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
  signForTask,
  activitiCancelClaim
} from '../../services/safety_notice'
import {

  sourceDataFilter

} from '../../tools'
import {
  riskManageToDoList
} from '../../services/risk'
export default {
  data () {
    return {
      tableData: [],
      total: 0,
       curPage: 1,
       pageSize: 2,
       totalPages: 1,
    }
  },
  methods: {
    // 办理
    startHandle (index, row) {
      let flag = row.flag

      let riskId = row.riskId

      let taskInfo = row.taskInfo
      let path = ''
      if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('立项审批')) {
        path = '/risk/start0'
      } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('立项修改')) {
        path = '/risk/risk_transfer_stop'
      } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('风险分析')) {
        path = '/risk/start1'
      } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('风险控制措施')) {
        path = '/risk/start2'
      } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('部门审核')) {
        path = '/risk/start3'
      } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('级核准')) {
        path = '/risk/start4'
      } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('验证措施')) {
        path = '/risk/start5'
      } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('验证核准')) {
        path = '/risk/start6'
      } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('效果评估')) {
        path = '/risk/start7'
      } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('项目评价')) {
        path = '/risk/start8'
      }

      this.$router.push({
        path: path,
        query: {
          taskInfo,
          riskId,
          flag
        }
      })
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
              type: 'info',
              message: '签收失败'
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
              type: 'info',
              message: '取消签收失败'
            })
          }
        })
      })
    },
    refresh () {
      riskManageToDoList().then(result => {
        let data = result.data
        if (data.error === 0 && data.data) {
          this.tableData = data.data
          let page = data.data
          this.total = page.totalElements
          this.totalPages = page.totalPages
        }
      })
    },
    // 等级过滤器
    projectLevelFilter (alue, row, column) {
      let sourceData = this.ALL_SELECT_DATA.ANNOUNCEMENT_LEVEL

      let result = sourceDataFilter(sourceData, alue)
      return result
    },
    // 来源过滤器
    projectSrcFilter (alue, row, column) {
      let sourceData = this.ALL_SELECT_DATA.PROJECT_SOURCE

      let result = sourceDataFilter(sourceData, alue)
      return result
    }

  },
  created () {
    // this.refresh()
  },
  computed: {
    userId () {
      return this.$store.state.user.userId
    },
    ALL_SELECT_DATA () {
      return this.$store.state.ALL_SELECT_DATA
    }
  }
}
</script>
