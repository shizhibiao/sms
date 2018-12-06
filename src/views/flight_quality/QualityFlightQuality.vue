<template>
    <div class="animated fadeIn">
        <el-form :model="queryParams" label-width="120px" >
                 <el-table
                    :stripe="true"
                    :data="formlist"
                    size='small'
                    :highlight-current-row ="true"
                    style="width: 100%">
                    <el-table-column label='#'  width='60px'>
                      <template slot-scope="scope">
                          {{scope.$index + 1}}
                      </template>
                    </el-table-column>
                     <el-table-column
                        label="标题"
                        prop="title">
                    </el-table-column>
                     <el-table-column
                        label="报告人"
                        prop="reporterName">
                    </el-table-column>
                     <el-table-column
                        label="报告部门"
                        prop="reportDeptName">
                    </el-table-column>
                     <el-table-column
                        label="报告日期"
                        prop="reportDate">
                    </el-table-column>
                    
                     <el-table-column
                        label="主操纵"
                        prop="pm">
                    </el-table-column>
                     <el-table-column
                        label="辅操纵"
                        prop="pf">
                    </el-table-column>
                    <el-table-column
                      prop="taskInfo.createTime"
                      label="派发日期"
                      >
                    </el-table-column>
                     <el-table-column  label="操作">
                         <template slot-scope="scope">
                            <el-button v-if="scope.row.flag === 1 && scope.row.taskInfo.assignee === null" type="primary"  @click="signin(scope.$index, scope.row)" style="margin-left:0" size="mini">签 收</el-button>
                            <el-button v-if="scope.row.flag === 1 && scope.row.taskInfo.assignee !== null" type="primary"  @click="handle(scope.$index, scope.row)" style="margin-left:0" size="mini">办 理</el-button>
                            <el-button v-if="scope.row.flag === 1 && scope.row.taskInfo.assignee !== null" type="success"  @click="cancelthesign(scope.$index, scope.row)" style="margin-left:0" size="mini">取消签收</el-button>
                            </template>
                        </el-table-column>
                 </el-table>
                 <!-- <b-row>
                    <b-col sm="12" v-if="totalPages>1">
                    <b-pagination size="md"
                        :total-rows="total"
                        v-model="curPage"
                        :per-page="pageSize"
                        :limit="2"
                        align="right">
                    </b-pagination>
                    </b-col>
                </b-row> -->
                <b-row>
                <b-col md="12" class="my-1 mt-1" v-if="totalPages > 1">
                  <!--<b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />-->
                  <el-pagination
                    background
                    :pager-count="5"
                    v-model="curPage"
                    :current-page.sync="curPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="total"
                    align="right">
                  </el-pagination>
                </b-col>
              </b-row>
        </el-form>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  created () {
    axios.get('/api/qar/todo', this.$store.state.user.userId)
      .then(res => {
        if (res.data.error === 0) {
          this.formlist = res.data.data
        }
      })
  },
  data () {
    return {
      total: 0,
      pageSize: 15,
      curPage: 1,
      totalPages: 1,
      formlist: [],
      queryParams: {}
    }
  },
  methods: {
    refresh() {
      axios.get('/api/qar/todo', this.$store.state.user.userId)
      .then(res => {
        if (res.data.error === 0) {
          this.formlist = res.data.data
        }
      })
    },
    signin (index, paramas) {
      this.$confirm('是否签收?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get('/api/activiti/claim?' + 'taskId=' + paramas.taskInfo.taskId + '&userId=' + this.$store.state.user.userId)
          .then(res => {
            if (res.data.error === 0) {
              this.$message.success('签收成功')
              this.$router.push({path: '/qar/examine/' + paramas.reportNumber + '/' + paramas.taskInfo.taskId})
              axios.get('/api/qar/todo', this.$store.state.user.userId)
                .then(res => {
                  if (res.data.error === 0) {
                    this.formlist = res.data.data
                  }
                })
            } else {
              this.$message.error('签收失败' + res.data.message)
            }
          })
      })
    },
    cancelthesign (index, paramas) {
      this.$confirm('是否取消签收?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get('/api/activiti/unclaim?' + 'taskId=' + paramas.taskInfo.taskId)
          .then(res => {
            if (res.data.error === 0) {
              this.$message.success('取消签收成功')
              axios.get('/api/qar/todo', this.$store.state.user.userId)
                .then(res => {
                  if (res.data.error === 0) {
                    this.formlist = res.data.data
                  }
                })
            }
          })
      })
    },
    handle (index, paramas) {
      if (paramas.status === -1 && paramas.taskInfo.assignee !== null) {
        this.$router.push({path: '/qar/change/' + paramas.reportNumber + '/' + paramas.taskInfo.taskId})
      } else {
        this.$router.push({path: '/qar/examine/' + paramas.reportNumber + '/' + paramas.taskInfo.taskId})
      }
    }
  }
}
</script>
