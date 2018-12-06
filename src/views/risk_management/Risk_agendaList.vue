<template>
  <div class="header">
    <b-card no-body  v-if="path === '/home/done'">
      <b-card-header>
        <el-row :gutter="12">
          <el-col :span="20">
            <el-form>
              <el-form-item label="办理日期">
                <el-date-picker
                  :clearable="false"
                  v-model="dateRange"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions2"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button size='small' type="primary" class="mt-1" @click="actionTakenQuery">查询</el-button>
          </el-col>
        </el-row>
      </b-card-header>
      <b-card-body>
        <el-table
          size="small"
          :data="tableData"
          :stripe="true"
          :highlight-current-row ="true"
          style="width: 100%">
        <el-table-column
            label="#"
            prop="index"
            width="50">
        </el-table-column>
        <el-table-column
            label="危险编号"
            prop="riskNo">
        </el-table-column>
        <el-table-column
            label="危险源描述"
            prop="riskDesc">
        </el-table-column>
        <el-table-column
            label="可能导致风险或后果"
            prop="riskResult">
        </el-table-column>
        <el-table-column
            label="风险等级"
            prop="riskGrade">
        </el-table-column>
        <el-table-column
            label="处理状态"
            prop="taskInfo.taskName">
        </el-table-column>
        <el-table-column
          label="派发日期"
          prop="taskInfo.startTime">
        </el-table-column>
        <el-table-column
          label="办理日期"
          prop="taskInfo.endTime">
        </el-table-column>
        <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="default" size='mini'
                  @click="examineAction(scope.$index, scope.row)">查看</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 16px;">
          <b-row>
            <b-col md="12" class="my-1 mt-1" v-if="totalPages > 1">
              <!--<b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />-->
              <el-pagination
                background
                :pager-count="5"
                :current-page.sync="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="total"
                align="right">
              </el-pagination>
            </b-col>
          </b-row>
        </div>
      </b-card-body>
    </b-card>
    <el-table
      v-if="path == '/home/todo'"
      size="small"
      :data="tableData"
      :stripe="true"
      :highlight-current-row ="true"
      style="width: 100%">
      <el-table-column
            label="#"
            prop="index"
            width="50">
        </el-table-column>
        <el-table-column
            label="危险编号"
            prop="riskNo">
        </el-table-column>
        <el-table-column
            label="危险源描述"
            prop="riskDesc">
        </el-table-column>
        <el-table-column
            label="可能导致风险或后果"
            prop="riskResult">
        </el-table-column>
        <el-table-column
            label="风险等级"
            prop="riskGrade">
        </el-table-column>
        <el-table-column
            label="处理状态"
            prop="taskInfo.taskName">
        </el-table-column>
        <el-table-column
          label="派发日期"
          prop="taskInfo.createTime">
        </el-table-column>
        <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size='mini' v-if="scope.row.taskInfo != null && scope.row.taskInfo.assignee != null"
            @click="handleTransaction(scope.$index, scope.row)">办理</el-button>
          <el-button type="primary" size='mini' v-if="scope.row.taskInfo != null && scope.row.taskInfo.assignee == null"
            @click="signInAction(scope.$index, scope.row)">签收</el-button>
          <el-button type="success" size='mini' v-if="scope.row.taskInfo != null && scope.row.taskInfo.assignee != null"
            @click="cancelAction(scope.$index, scope.row)">取消签收</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { hazardAgendaList, hazardActionTakenaList, activitiCancelClaim } from '../../services/information_report'
import { signForTask } from '../../services/safety_notice'
import { getBeforeWeek } from '../../filter/reportFilter.js'
// 过滤日期
import { formatDate } from '../../utils/index.js'

export default {
  data () {
    return {
      // 表格数据
      tableData: [],
      // 分页数据
      total: 0,
      pageNum: 1,
      pageSize: 15,
      totalPages: 1,
      // 点击进来页面的路径
      path: '',
      // 控制显示按钮
      sign: '',
      // 时间控件
      pickerOptions2: {
        shortcuts: [{
          text: '最近一天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // 查询时间
      dateRange: [getBeforeWeek(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')]
    }
  },
  methods: {
    // 供tab点击触发更新的方法
    refresh () {
      // 加载查询列表信息
      this.inquireDataList()
    },
    // 查询
    actionTakenQuery () {
      this.getHaveFinishedDataAction()
    },
    // 点击办理
    handleTransaction (index, row) {
      // console.log(row)
      let riskId = row.riskId
      if (row.status === -1) {
        this.$router.push({
          path: '/risk/compile-hazard',
          query: {
            riskId: row.riskId,
            taskInfo: row.taskInfo,
            describe: 'handleCompile',
            status: row.status,
            path: '/home/todo'
          }
        })
      } else {
        this.$router.push({
          path: '/risk/examine-hazard/' + riskId,
          query: {
            riskId: row.riskId,
            flag: row.flag,
            path: '/home/todo',
            taskInfo: row.taskInfo,
            status: row.status
          }
        })
      }
    },
    // 查看
    examineAction (index, row) {
      // console.log(row.status)
      let riskId = row.riskId
      this.$router.push({
        path: '/risk/examine-hazard/' + riskId,
        query: {
          riskId: row.riskId,
          flag: row.flag,
          status: row.status
        }
      })
    },
    // 签收
    signInAction (index, row) {
      let riskId = row.riskId
      this.$confirm('确定签收？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let taskId = row.taskInfo.taskId
        let userId = this.$store.state.user.userId
        signForTask(taskId, userId).then(result => {
          if (result.data.error === 0) {
            this.$router.push({
              path: '/risk/examine-hazard/' + riskId,
              query: {
                riskId: row.riskId,
                flag: row.flag,
                path: '/home/todo',
                taskInfo: row.taskInfo,
                status: row.status
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: '签收失败：' + result.data.message
            })
          }
        })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '签收失败：' + error
            })
          })
      })
    },
    // 取消签收
    cancelAction (index, row) {
      this.$confirm('确定取消签收？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let taskId = row.taskInfo.taskId
        activitiCancelClaim(taskId).then(result => {
          if (result.data.error === 0) {
            this.inquireDataList()
          } else {
            this.$message({
              type: 'error',
              message: '操作失败：' + result.data.message
            })
          }
        })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '操作失败：' + error
            })
          })
      })
    },
    // 待办列表
    inquireDataList () {
      hazardAgendaList().then(result => {
        // console.log(result, '待办')
        if (result.data.error === 0 && result.data.data !== null) {
          this.tableData = result.data.data
          // 给表格添加行数
          for (var j = 0; j < this.tableData.length; j++) {
            this.tableData[j].index = j + 1
          }
        } else {
          this.$message({
            type: 'error',
            message: '查询失败：' + result.data.message
          })
        }
      })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '查询失败：' + error
          })
        })
    },
    // 已办列表
    getHaveFinishedDataAction () {
      let data = {}
      data.pageNum = this.pageNum - 1
      data.pageSize = this.pageSize
      data.queryItems = [
        {
          fieldName: 'startDate',
          value: this.dateRange !== null ? `${this.dateRange[0]} 00:00:00` : getBeforeWeek(new Date(), 'yyyy-MM-dd')
        },
        {
          fieldName: 'endDate',
          value: this.dateRange !== null ? `${this.dateRange[1]} 23:59:59` : formatDate(new Date(), 'yyyy-MM-dd')
        }
      ]
      hazardActionTakenaList(data).then(result => {
        if (result.data.error === 0 && result.data.data !== null) {
          this.tableData = result.data.data.content
          this.total = result.data.data.totalElements
          this.totalPages = result.data.data.totalPages
          // 给表格添加行数
          for (var j = 0; j < this.tableData.length; j++) {
            this.tableData[j].index = j + 1
          }
        } else {
          this.tableData = []
          this.total = 0
          this.totalPages = 1
        }
      })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '查询失败：' + error
          })
        })
    }
  },
  created () {
    this.path = this.$router.history.current.path
    if (this.path === '/home/todo') {
      // 加载查询列表信息
      // this.inquireDataList()
      this.sign = 'todo'
    } else if (this.path === '/home/done') {
      // 加载已办列表信息
      this.getHaveFinishedDataAction()
      this.sign = 'done'
    }
  }
}
</script>

