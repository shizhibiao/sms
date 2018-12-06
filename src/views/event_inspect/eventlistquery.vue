<template>
  <div class="animated fadeIn">
      <!-- 代办的表格 -->
           <el-table stripe
          :data="datalist"
          size='small'
          >
          <el-table-column
            fixed
            label='#'
            width='60px'>
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            >
          </el-table-column>
           <el-table-column
            prop="reporterName"
            label="报告人"
           >
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="报告日期"
            >
          </el-table-column>
           
          <el-table-column
            prop="occurAddress"
            label="发生地点"
            >
          </el-table-column>
          <el-table-column
            prop="status"
            label="处理状态"
           >
          </el-table-column>
          <el-table-column
            prop="taskInfo.createTime"
            label="派发日期"
            >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
         >
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
      align="right"></b-pagination>
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
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    created () {
      let id = this.$store.state.user.userId
      axios.get('/api/incdent/workflow/todo', id)
        .then(res => {
          if (res.data.error === 0) {
            let data = res.data.data.map(item => {
              if (item.source === '0') {
                item.source = '新建'
              } else if (item.source === '1') {
                item.source = '报告'
              }
              if (item.status === -1) {
                item.status = '新建'
              } else if (item.status === 0) {
                item.status = '立项核准'
              } else if (item.status === 1) {
                item.status = '调查方案'
              } else if (item.status === 2) {
                item.status = '调查情况'
              } else if (item.status === 3) {
                item.status = '验证核准'
              } else if (item.status === 4) {
                item.status = '处理改进'
              } else if (item.status === 5) {
                item.status = '结束'
              }
              return item
            })
            this.datalist = data
          }
        })
    },
    methods: {
      refresh () {
        axios.get('/api/incdent/workflow/todo', this.$store.state.user.userId)
        .then(res => {
          if (res.data.error === 0) {
            let data = res.data.data.map(item => {
              if (item.source === '0') {
                item.source = '新建'
              } else if (item.source === '1') {
                item.source = '报告'
              }
              if (item.status === -1) {
                item.status = '新建'
              } else if (item.status === 0) {
                item.status = '立项核准'
              } else if (item.status === 1) {
                item.status = '调查方案'
              } else if (item.status === 2) {
                item.status = '调查情况'
              } else if (item.status === 3) {
                item.status = '验证核准'
              } else if (item.status === 4) {
                item.status = '处理改进'
              } else if (item.status === 5) {
                item.status = '结束'
              }
              return item
            })
            this.datalist = data
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
                this.$router.push({path: '/event/examine/' + paramas.eventNumber + '/' + paramas.taskInfo.taskId})
                let id = this.$store.state.user.userId
                axios.get('/api/incdent/workflow/todo', id)
                  .then(res => {
                    if (res.data.error === 0) {
                      let data = res.data.data.map(item => {
                        if (item.source === '0') {
                          item.source = '新建'
                        } else if (item.source === '1') {
                          item.source = '报告'
                        }
                        if (item.status === -1) {
                          item.status = '新建'
                        } else if (item.status === 0) {
                          item.status = '立项核准'
                        } else if (item.status === 1) {
                          item.status = '调查方案'
                        } else if (item.status === 2) {
                          item.status = '调查情况'
                        } else if (item.status === 3) {
                          item.status = '验证核准'
                        } else if (item.status === 4) {
                          item.status = '处理改进'
                        } else if (item.status === 5) {
                          item.status = '结束'
                        }
                        return item
                      })
                      this.datalist = data
                    }
                  })
              }
            })
        }).catch(() => {
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
                let id = this.$store.state.user.userId
                axios.get('/api/incdent/workflow/todo', id)
                  .then(res => {
                    if (res.data.error === 0) {
                      let data = res.data.data.map(item => {
                        if (item.source === '0') {
                          item.source = '新建'
                        } else if (item.source === '1') {
                          item.source = '报告'
                        }
                        if (item.status === -1) {
                          item.status = '新建'
                        } else if (item.status === 0) {
                          item.status = '立项核准'
                        } else if (item.status === 1) {
                          item.status = '调查方案'
                        } else if (item.status === 2) {
                          item.status = '调查情况'
                        } else if (item.status === 3) {
                          item.status = '验证核准'
                        } else if (item.status === 4) {
                          item.status = '处理改进'
                        } else if (item.status === 5) {
                          item.status = '结束'
                        }
                        return item
                      })
                      this.datalist = data
                    }
                  })
              }
            })
        }).catch(() => {
        })
      },
      handle (index, paramas) {
        if (paramas.status === '新建' && paramas.taskInfo.assignee !== null) {
          this.$router.push({path: '/event/modify/' + paramas.eventNumber + '/' + paramas.taskInfo.taskId})
        } else {
          this.$router.push({path: '/event/examine/' + paramas.eventNumber + '/' + paramas.taskInfo.taskId})
        }
      }
    },
    data () {
      return {
        //  总共的数据条数
        total: 0,
        //  每页显示多少数据
        pageSize: 15,
        //  当前页
        curPage: 1,
        totalPages: 1,
        REPORT_TYPE: {
          icts: []
        },
        datalist: []
      }
    }
  }
</script>