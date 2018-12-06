<template>
  <div class="header">
    <b-card no-body  v-if="this.path === '/home/done'">
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
              width='50'
              >
          </el-table-column>
          <el-table-column
            label="标题"
            prop="title">
          </el-table-column>
          <el-table-column
            label="报告类型"
            prop="category"
            :formatter="reportTypeFiter">
          </el-table-column>
          <el-table-column
            label="所在部门"
            prop="deptName">
          </el-table-column>
          <el-table-column
            label="报告日期"
            prop="reportDate">
          </el-table-column>
          <el-table-column
            v-if="sign == 'todo'"
            label="处理状态"
            prop="status"
            :formatter="treatmentStateFilter">
          </el-table-column>
          <el-table-column
            v-if="sign == 'done'"
            label="审核节点"
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
          width='50'
          >
      </el-table-column>
      <el-table-column
        label="标题"
        prop="title">
      </el-table-column>
      <el-table-column
        label="报告类型"
        prop="category"
        :formatter="reportTypeFiter">
      </el-table-column>
      <el-table-column
        label="所在部门"
        prop="deptName">
      </el-table-column>
      <el-table-column
        label="报告日期"
        prop="reportDate">
      </el-table-column>
      <el-table-column
        v-if="sign == 'todo'"
        label="处理状态"
        prop="status"
        :formatter="treatmentStateFilter">
      </el-table-column>
      <el-table-column
        v-if="sign == 'done'"
        label="审核节点"
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
//           信息报告待办列表         已办列表
import { getPreserveMessageList, getHaveFinishedData, activitiCancelClaim } from '../../services/information_report'
// 过滤器
import { sourceDataFilter } from '../../tools'
import { ransfromProcessState, getBeforeWeek } from '../../filter/reportFilter.js'
// 过滤日期
import { formatDate } from '../../utils/index.js'
import { signForTask } from '../../services/safety_notice'

export default {
  data () {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 15,
      totalPages: 1,
      // 控制显示按钮
      sign: '',
      path: '',
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
  computed: {
    // 所有数据字典中的数据
    ALL_SELECT_DATA () {
      return this.$store.state.ALL_SELECT_DATA
    }
  },
  methods: {
    // 供外部调用更新待办数据
    refresh () {
      this.inquireDataList()
    },
    // 待办信息
    inquireDataList () {
      getPreserveMessageList().then(result => {
        // console.log(result, '待办')
        if (result.data.error === 0 && result.data.data !== null) {
          this.tableData = result.data.data
          // 给表格添加行数
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].index = i + 1
          }
        }
      })
    },
    //  报告类型过滤
    reportTypeFiter (alue, row, column) {
      let sourceData = this.ALL_SELECT_DATA.REPORT_TYPE ? this.ALL_SELECT_DATA.REPORT_TYPE : {}
      let result = sourceDataFilter(sourceData, alue.category)
      return result
    },
    // 处理状态过滤
    treatmentStateFilter (alue, row, column) {
      // console.log(alue, row, column)
      return ransfromProcessState(alue.status)
    },
    // 点击办理
    handleTransaction (index, row) {
      // console.log(row.status, 987)
      if (row.status === -1) {
        let url = '/report/compile/' + row.reportNumber
        this.$router.push({
          path: url,
          query: {
            flag: row.flag,
            safetyId: row.reportNumber,
            taskInfo: row.taskInfo,
            name: 'handle'
          }
        })
      } else {
        this.$router.push({
          path: '/report/examine/' + row.reportNumber,
          query: {
            flag: row.flag,
            taskInfo: row.taskInfo,
            path: '/home/todo',
            reportNumber: row.reportNumber,
            safetyId: row.reportNumber,
            status: row.status
          }
        })
      }
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
      getHaveFinishedData(data).then(result => {
        // console.log(result, '已办')
        if (result.data.error === 0 && result.data.data !== null) {
          this.tableData = result.data.data.content
          this.total = result.data.data.totalElements
          this.totalPages = result.data.data.totalPages
          // 给表格添加行数
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].index = i + 1
          }
        } else {
          this.tableData = []
          this.total = 0
          this.totalPages = 1
        }
      })
    },
    // 点击查看
    examineAction (index, row) {
      // console.log(row.status, 987)
      let reportNumber = row.reportNumber
      this.$router.push({
        path: '/report/examine/' + reportNumber,
        query: {
          flag: row.flag,
          safetyId: row.reportNumber,
          reportNumber: row.reportNumber,
          status: row.status
        }
      })
    },
    // 点击查询更多
    actionTakenQuery () {
      this.getHaveFinishedDataAction()
    },
    // 签收
    signInAction (index, row) {
      this.$confirm('确定签收？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let taskId = row.taskInfo.taskId
        let userId = this.$store.state.user.userId
        signForTask(taskId, userId).then(result => {
          if (result.data.error === 0) {
            if (row.status === -1) {
              this.$router.push({
                path: '/report/compile/' + row.reportNumber,
                query: {
                  flag: row.flag,
                  reportNumber: row.reportNumber,
                  taskInfo: row.taskInfo,
                  path: '/report/list',
                  safetyId: row.reportNumber,
                  status: row.status,
                  name: 'handle'
                }
              })
            } else {
              this.$router.push({
                path: '/report/examine/' + row.reportNumber,
                query: {
                  flag: row.flag,
                  reportNumber: row.reportNumber,
                  taskInfo: row.taskInfo,
                  path: '/report/list',
                  safetyId: row.reportNumber,
                  status: row.status
                }
              })
            }
          }
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
              message: '取消签收' + result.data.message
            })
          }
        })
      })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '签收失败：' + error
          })
        })
    }
  },
  watch: {
    pageNum: function (newValue, oldValue) {
      this.getHaveFinishedDataAction()
    }
  },
  created () {
    // 根据路劲加载不同的数据
    this.path = this.$router.history.current.path
    if (this.path === '/home/todo') {
      // 加载查询列表信息
      this.inquireDataList()
      this.sign = 'todo'
    } else if (this.path === '/home/done') {
      // 加载已办列表信息
      this.getHaveFinishedDataAction()
      this.sign = 'done'
    }
  }
}
</script>

