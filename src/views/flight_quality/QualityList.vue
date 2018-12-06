<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
         <el-row :gutter="12">
            <el-col :span="18">
                <el-form :inline="true" :model="queryParams"  ref="queryParams" status-icon >
                   <el-form-item label="报告日期" prop="reportDate">
                    <el-date-picker
                    :clearable='false'
                      v-model="reportDate"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      auto-complete="off"
                      :picker-options="pickerOptions2"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                   </el-form-item>
                  <el-form-item
                    label="标题" prop="title">
                    <el-input  v-model="queryParams.title" clearable placeholder="请输入内容"></el-input>
                  </el-form-item>
                   <el-form-item label="机号" v-if="showMore" prop="airNumber">
                      <el-input clearable v-model="queryParams.airNumber" auto-complete="off" placeholder="请输入内容"></el-input>
                  </el-form-item>
                  <el-form-item label="机型" v-if="showMore" prop="acType">
                      <el-input clearable v-model="queryParams.acType" auto-complete="off" placeholder="请输入内容"></el-input>
                  </el-form-item>
                  <el-form-item label="辅操纵" v-if="showMore" prop="pf">
                  <el-select v-model="queryParams.pf" clearable>
                    <el-option v-for="item in pf"
                      :key="item.value"
                      :label="item.name"
                      auto-complete="off"
                      :value="item.name"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="主操纵" v-if="showMore" prop="pm">
                  <el-select v-model="queryParams.pm" clearable>
                    <el-option v-for="item in pm"
                      :key="item.value"
                      :label="item.name"
                      auto-complete="off"
                      :value="item.name"></el-option>
                  </el-select>
              </el-form-item>
                </el-form>
            </el-col>
              <el-col :span="6" class="text-right">
              <el-button type="warning" size='small'  @click="showMoreHandle()" v-if="true">{{showMoreLabel}}</el-button>
              <el-button type="primary" size='small'  @click="resetForm('queryParams')">重置</el-button>
              <el-button  type="primary" size='small' @click="querylist">查 询</el-button>
              <el-button  type="success" size='small' @click="addbtn">新 增</el-button>
               </el-col>  
         </el-row>
      </b-card-header>
       <el-form :model="queryParams" label-width="120px" style="height:75vh; overflow-y: auto">
             <b-card-body>
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
                        label="处理状态"
                        prop="status">
                    </el-table-column>
                    
                     <el-table-column  label="操作">
                         <template slot-scope="scope">
                        <el-button size="mini" v-if="scope.row.flag === 2"   @click="handleEdit(scope.$index, scope.row, formlist)">查 看</el-button>
                        <el-button size="mini"  v-if="scope.row.flag === 0" type="primary" @click="handleDelete(scope.$index, scope.row, scope.row)">编 辑</el-button>
                        <el-button type="success" size='mini' v-if="scope.row.flag === 0" @click="startup(scope.$index, scope.row, scope.row)"  v-loading.fullscreen.lock="fullscreenLoading">发 送</el-button>
                        <el-button v-if="scope.row.flag === 1 && scope.row.taskInfo.assignee === null" type="primary"  @click="signin(scope.$index, scope.row, formlist)" style="margin-left:0" size="mini">签 收</el-button>
                          <el-button v-if="scope.row.flag === 1 && scope.row.taskInfo.assignee !== null" type="primary"  @click="handle(scope.$index, scope.row, formlist)" style="margin-left:0" size="mini">办 理</el-button>
                        <el-button v-if="scope.row.flag === 1 && scope.row.taskInfo.assignee !== null" type="success"  @click="cancelthesign(scope.$index, scope.row, formlist)" style="margin-left:0" size="mini">取消签收</el-button>
                        <el-button v-if="scope.row.flag === 0" @click="deleteRow(scope.$index, scope.row, formlist)" type="danger"  size="mini">删 除</el-button>
                         </template>
                    </el-table-column>
                 </el-table>
                
                <b-row>
                <b-col md="12" class="my-1 mt-1" v-if="totalPages > 1">
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
             </b-card-body>
        </el-form>
    </b-card>
  </div>
</template>
<script>
import { formatDate } from '../../utils/index.js'
import { getBeforeWeek } from '../../filter/reportFilter.js'
import axios from 'axios'
export default {
  created () {
    this.querylist()
    axios.post('/api/qar/event/listQarPf?' + 'startDate=' + this.reportDate[0] + '&endDate=' + this.reportDate[1])
      .then(res => {
        let data = res.data.data.map(item => {
          return {
            name: item.pf
          }
        })
        this.pf = data
      })
    axios.post('/api/qar/event/listQarPm?' + 'startDate=' + this.reportDate[0] + '&endDate=' + this.reportDate[1])
      .then(res => {
        let data = res.data.data.map(item => {
          return {
            name: item.pm
          }
        })
        this.pm = data
      })
  },
  watch: {
    curPage: function (newval, oldval) {
      this.querylist()
    }
  },
  data () {
    return {
      showMoreLabel: '更多',
      showMore: false,
      total: 0,
      pageSize: 15,
      curPage: 1,
      totalPages: 1,
      reportDate: [getBeforeWeek(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')],
      queryParams: {
        title: '',
        acType: '',
        airNumbe: '',
        pf:'',
        pm: ''
      },
      pf: [],
      pm: [],
      pickerOptions2: {
        shortcutsL: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      formlist: [],
      fullscreenLoading: false,
      data: {
        pageNum: null,
        pageSize: null,
        queryItems: []
      }
    }
  },
  methods: {
    showMoreHandle () {
      this.showMore = !this.showMore
      if (this.showMore) {
        this.showMoreLabel = '隐藏'
      } else {
        this.showMoreLabel = '更多'
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.data = {
        pageNum: 0,
        pageSize: 15,
        queryItems: []
      }
      reportDate: [getBeforeWeek(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
      this.queryParams = {
        title: '',
        acType: '',
        airNumbe: '',
        pf:'',
        pm: ''
      }
      this.reportDate = [getBeforeWeek(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
      this.querylist()
    },
    addbtn () {
      this.$router.push({ path: 'start/0' })
    },
    querylist () {
      this.data.queryItems.push({
        fieldName: 'StartreportDate',
        value: this.reportDate[0]
      },
      {
        fieldName: 'endreportDate',
        value: this.reportDate[1]
      })
      this.loadData()
      this.data.pageNum = this.curPage - 1
      this.data.pageSize = this.pageSize
      axios.post('/api/qar/event/listQar', this.data)
        .then(res => {
          if (res.data.error === 0) {
            if (res.data.data !== null) {
              this.total = res.data.data.totalElements
              this.totalPages = res.data.data.totalPages
              let Data = res.data.data.content.map((item) => {
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
              this.formlist = Data
              this.data.queryItems = []
            } else {
              this.formlist = []
            }
            
          }
          
        })
    },
    loadData () {
       let result = Object.keys(this.queryParams).filter(item => {
         return this.queryParams[item] !== '' || undefined || null
       })

       result.forEach(item => {
         this.qItem = {
           fieldName: item,
           value: this.queryParams[item]
         }
         this.data.queryItems.push(this.qItem)
       })
     },
    //  查看的按钮
    handleEdit (index, paramas) {
      this.$router.push({
        path: '/qar/modilfy/' + paramas.reportNumber,
        query: {
          flag: paramas.flag
        }
      })
    },
    //  编辑的按钮
    handleDelete (index, paramas) {
      this.$router.push({path: 'change/' + paramas.reportNumber + '/' + 0})
    },
    //  发送的按钮
    startup (index, row, scope) {
      this.$confirm('是否启动流程', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.fullscreenLoading = true
        axios.get('/api/qar/start/' + row.reportNumber + '/' + this.$store.state.user.userName)
          .then(res => {
            this.fullscreenLoading = false
            if (res.data.error === 0) {
              this.$message({
                type: 'success',
                message: '发送成功'
              })
              this.querylist()
            } else if (res.data.error !== 0) {
              this.$message.error('发送失败，请重试：' + res.data.message)
            }
          })
          .catch(error => {
            console.log(error)
            this.fullscreenLoading = false
            this.$message.error('网咯超时请检查网咯')
          })
      })
    },
    //  签收
    signin (index, paramas) {
      this.$confirm('是否签收?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get('/api/activiti/claim?' + 'taskId=' + paramas.taskInfo.taskId + '&userId=' + this.$store.state.user.userId)
          .then(res => {
            if (res.data.error === 0) {
              this.$router.push({path: '/qar/examine/' + paramas.reportNumber + '/' + paramas.taskInfo.taskId})
              this.$message.success('签收成功')
              this.querylist()
            } else {
              this.$message.error('签收失败' + res.data.message)
            }
          })
      }).catch(() => {
      })
    },
    //  取消办理
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
              this.querylist()
            }
          })
      }).catch(() => {
      })
    },
    //  办理
    handle (index, paramas) {
      if (paramas.status === '新建' && paramas.taskInfo.assignee !== null) {
        this.$router.push({path: 'change/' + paramas.reportNumber + '/' + paramas.taskInfo.taskId})
      } else {
        this.$router.push({path: '/qar/examine/' + paramas.reportNumber + '/' + paramas.taskInfo.taskId})
      }
    },
    //  删除
    deleteRow (index, paramas, rows) {
      let id = paramas.reportNumber
      this.$confirm('此操作将永久删除该文件, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          axios.delete('/api/qar/event/deleteQar?' + 'reportNumber' + '=' + id)
            .then(res => {
              if (res.data.error === 0) {
                this.total--
                rows.splice(index, 1)
              } else if (res.data.error !== 0) {
                this.$message.error(res.data.message)
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
        })
    }
  }
}
</script>

