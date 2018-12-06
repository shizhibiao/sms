<template>
  <div slot="header">
    <el-table :stripe="true"
              size="small"
              :highlight-current-row="true"
              :data="tableData"
              style="width: 100%">
      <el-table-column label="#"
                       type="index"
                       width="50">
      </el-table-column>
      <el-table-column label="责任部门"
                       prop="deptName">
      </el-table-column>
      <el-table-column label="项目名称"
                       prop="evaluetionName">
      </el-table-column>
      <el-table-column label="考核时间"
                       prop="evaluetionTime">
      </el-table-column>
      <el-table-column label="考核分数"
                       prop="evaluetionScore">
      </el-table-column>
      <!-- <el-table-column label="分数级别"
                       prop="evaluetionLevel">
      </el-table-column> -->
      <el-table-column label="评审人"
                       prop="evaluetionUserName">
        <template slot-scope="scope">
          <span>{{scope.row.evaluetionUserName | str1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核周期开始时间"
                       prop="evaluetioinStartTime">
      </el-table-column>
      <el-table-column label="考核周期结束时间"
                       prop="evaluetionEndTime">
      </el-table-column>
      <el-table-column label="派发日期"
                       prop="taskInfo.createTime">
      </el-table-column>
      <el-table-column label="操作"
                       width="200">
        <template slot-scope="scope">
          <el-button size='mini'
                     type="primary"
                     v-if='!scope.row.taskInfo.assignee'
                     @click="signAction(scope.$index, scope.row)">
            签收</el-button>
          <el-button type="primary"
                     v-if="scope.row.taskInfo.assignee"
                     size='mini'
                     @click="handlePerform(scope.$index, scope.row)">办理</el-button>
          <el-button size='mini'
                     type="success"
                     v-if='scope.row.taskInfo.assignee'
                     @click="celSign(scope.$index, scope.row)">
            取消签收</el-button>
        </template>
      </el-table-column>
    </el-table>
    <b-row>
      <b-col sm="12"
             v-if="totalPages>1">
        <b-pagination size="md"
                      :total-rows="total"
                      v-model="curPage"
                      :per-page="pageSize"
                      :limit="5"
                      align="right"></b-pagination>
      </b-col>
    </b-row>
  </div>

</template>
<script>
import Vuex from 'vuex'
import axios from 'axios'
import { formatDate } from '../../utils/index.js'
import { unClaim, claim } from '../../services/safety_supervision'
export default {
  data () {
    return {
      // 表格数据
      tableData: [],
      totalPages: 1,
      total: 0,
      curPage: 1,
      pageSize: 15,
      page: {
        orderby: '',
        pageNum: 0,
        pageSize: 15,
        queryItems: []
      }
    }
  },
  filters: {
    str1 (val) {
      let val1 = val.replace(/\"/g, "")
      return val1.replace(/\[|]/g, '')
    }
  },
  methods: {
    // 签收按钮
    signAction (index, row) {
      // console.log(row)
      this.$confirm('确定认领该任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          claim(row.taskInfo.taskId, this.user.userId).then(res => {
            if (res.data.error === 0) {
              this.$message({
                type: 'success',
                message: '签收成功'
              })
              let url = ''
              if (row.evaluetionStatus == 0) {
                url = '/performance/testform'
              } else if (row.evaluetionStatus == 1) {
                url = '/performance/testact'
              } else if (row.evaluetionStatus == 2) {
                url = '/performance/testact1'
              } else if (row.evaluetionStatus == 3) {
                url = '/performance/testact2'
              }
              this.$router.push({
                path: url,
                query: {
                  id: row.evaluetionId,
                  taskInfo: row.taskInfo
                }
              })
            } else {
              this.$message.error('签收失败' + res.data.message)
            }
          })
            .catch(() => {
              this.$message.error('网络错误或服务器错误')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发送'
          })
        })
    },
    // 取消签收
    celSign (index, row) {
      this.$confirm('确定取消签收吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          unClaim(row.taskInfo.taskId).then(res => {
            // console.log(res)
            if (res.data.error === 0) {
              this.queryList()
              this.$message({
                type: 'success',
                message: '取消成功'
              })
            } else {
              this.$message.error('取消失败')
            }
          })
            .catch(() => {
              this.$message.error('网络错误或服务器错误')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发送'
          })
        })
    },
    // 办理
    handlePerform (index, row) {
      let url = ''
      if (row.flag) {
        if (row.evaluetionStatus == 0) {
          url = '/performance/testform'
        } else if (row.evaluetionStatus == 1) {
          url = '/performance/testact'
        } else if (row.evaluetionStatus == 2) {
          url = '/performance/testact1'
        } else if (row.evaluetionStatus == 3) {
          url = '/performance/testact2'
        } else if (row.evaluetionStatus == -1) {
          url = '/performance/testclose'
        }
        this.$router.push({
          path: url,
          query: {
            id: row.evaluetionId,
            taskInfo: row.taskInfo
          }
        })
      } else {
        this.$confirm('确定发送该流程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            axios.get('/api/performance_evaluetion/process/startUpProcess/' + row.evaluetionId).then(res => {
              // console.log(res)
              if (res.data.data) {
                this.queryList()
                this.$message({
                  type: 'success',
                  message: '发送成功'
                })
              } else {
                this.$message.error('发送失败' + res.data.message)
              }
            })
              .catch(() => {
                this.$message.error('网络错误或服务器错误')
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消发送'
            })
          })
      }
    },
    filerTypeHandle (data) {
      switch (data) {
        case -2:
          return '关闭流程'
        case -1:
          return '新建'
        case 0:
          return '表单填写'
        case 1:
          return '单元审核'
        case 2:
          return '部门审核'
        case 3:
          return '公司批准'
        case 4:
          return '结束'
        default:
          return ''
      }
    },
    refresh () {
      this.queryList()
    },
    // 查询列表信息
    queryList () {
      // 查询列表页
      axios.get('/api/performance_evaluetion/process/todo')
        .then((res) => {
          // console.log(res)
          if (res.data.data) {
            this.tableData = res.data.data
          } else {
            this.tableData = []
          }
        })
        .catch((error) => { console.log(error) })
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  watch: {
  },
  mounted () {
    this.queryList()
  }
}
</script>