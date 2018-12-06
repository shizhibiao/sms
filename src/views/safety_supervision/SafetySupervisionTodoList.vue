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
      <el-table-column label="项目名称"
                       prop="entryName">
      </el-table-column>
      <el-table-column label="监察审计类型"
                       prop="monitorType">
      </el-table-column>
      <el-table-column label="监察审计等级"
                       prop="monitorGrade">
      </el-table-column>
      <el-table-column label="立项部门"
                       prop="establishmenDepartment">
      </el-table-column>
      <el-table-column label="立项日期"
                       prop="dateTime">
      </el-table-column>
      <el-table-column label="状态"
                       prop="procStatus2">
      </el-table-column>
      <el-table-column label="派发日期"
                       prop="createTime">
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
import { formatDate } from '../../utils/index.js'
import { Agency, getMonitoringType, unClaim, claim } from '../../services/safety_supervision'
export default {
  data () {
    return {
      // 表格数据
      tableData: [],
      // 监察类型
      monitorList: [],
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
  methods: {
    // 签收按钮
    signAction (index, row) {
      this.$confirm('确定认领该任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          claim(row.taskInfo.taskId, this.user.userId).then(res => {
            // console.log(res)
            if (res.data.error === 0) {
              this.$message({
                type: 'success',
                message: '签收成功'
              })
              let url = '/monitor/act/' + 1
              this.$router.push({
                path: url,
                query: {
                  id: row.id
                }
              })
            } else {
              this.$message.error('签收失败')
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
              this.tableData = []
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
    handlePerform (index, row) {
      // console.log(row)
      let url = '/monitor/act/' + 1
      let url2 = '/monitor/reject/' + 0
      if (row.procStatus === -1 && row.procInstId) {
        this.$router.push({
          path: url2,
          query: {
            id: row.id
          }
        })
      } else {
        this.$router.push({
          path: url,
          query: {
            id: row.id
          }
        })
      }
    },
    filerTypeHandle (data) {
      switch (data) {
        case -1:
          return '新建'
        case 0:
          return '立项审核'
        case 1:
          return '监察审计计划'
        case 2:
          return '子流程'
        case 3:
          return '监察审计结果'
        case 4:
          return '结束'
        default:
          return ''
      }
    },
    refresh () {
      this.tableData = []
      this.queryList()
    },
    // 查询列表信息
    queryList () {
      Agency()
        .then(res => {
          
          let data = res.data.data
          //  console.log(data)
          if (data) {
            data.map(item => {
              let monitoringType = this.monitorList.find(type => {
                return type.dictId == item.monitorType//eslint-disable-line
              })
              item.entryName = item.projectName
              item.monitorType = monitoringType ? monitoringType.dictName : ''
              item.monitorGrade = item.projectLevel === '1' ? '公司' : '部门'
              item.establishmenDepartment = item.deptName
              item.dateTime = formatDate(new Date(item.projectStartDate), 'yyyy-MM-dd')
              item.procStatus2 = item.taskInfo.taskName
              item.createTime = item.taskInfo.createTime
              // console.log(item.taskInfo.taskName)
              this.tableData.push(item)
            })
          }
        })
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  watch: {
    curPage (newvalue, old) {
      this.page.pageNum = newvalue - 1
      this.tableData = []
      // this.queryList()
    }
  },
  mounted () {
    // console.log(this.user.deptId)
    getMonitoringType().then(result => {
      // console.log(result)
      this.monitorList = result
      return Agency()
    })
      .then(res => {
        // console.log(res)
        let data = res.data.data
        if (data) {
          data.map(item => {
            let monitoringType = this.monitorList.find(type => {
              return type.dictId == item.monitorType//eslint-disable-line
            })
            item.entryName = item.projectName
            item.monitorType = monitoringType ? monitoringType.dictName : ''
            item.monitorGrade = item.projectLevel === '1' ? '公司' : '部门'
            item.establishmenDepartment = item.deptName
            item.dateTime = formatDate(new Date(item.projectStartDate), 'yyyy-MM-dd')
            item.procStatus2 = item.taskInfo.taskName
            item.createTime = item.taskInfo.createTime
            this.tableData.push(item)
          })
        }
      })
  }
}
</script>