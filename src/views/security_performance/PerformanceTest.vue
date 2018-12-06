<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
        <el-row>
          <el-col :span="20">
            <el-form :inline="true"
                     :model="info"
                     label-position="left"
                     class="form-title"
                     ref="query">
              <el-form-item label="考核周期"
                            prop="month">
                <el-date-picker v-model="month"
                                type="month"
                                align="right"
                                unlink-panels
                                value-format="yyyy-MM"
                                placeholder="选择月">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="考核时间"
                            prop="daterange">
                <el-date-picker v-model="daterange"
                                type="daterange"
                                align="right"
                                unlink-panels
                                id='dataSelect'
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions2"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="责任部门"
                            prop="dept">
                <el-select v-model="info.dept"
                           value-key='deptId'
                           :clearable='true'>
                  <el-option :label="item.deptName"
                             :value="item"
                             v-for="(item,index) in deptNameList"
                             :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="分数范围"
                            prop="evaluetionLevel">
                <el-select v-model="info.evaluetionLevel"
                           :clearable='true'>
                  <el-option :label="item.dactName"
                             :value="item.dactName"
                             v-for="(item,index) in fractionList"
                             :key="index">
                  </el-option>
                </el-select>
              </el-form-item> -->
            </el-form>
          </el-col>
          <el-col :span="4"
                  class="text-right">
            <el-button type="primary"
                       @click="refresh()"
                       size='small'>
              查询</el-button>
            <el-button type="success"
                       @click="addNew()"
                       size='small'>
              新增</el-button>
          </el-col>
        </el-row>
      </b-card-header>
      <b-card-body>
        <template>
          <el-table :stripe="true"
                    :highlight-current-row="true"
                    :data="tableData"
                    size="small"
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
            <el-table-column label="操作"
                             width="280">
              <template slot-scope="scope">
                <el-button size='mini'
                           v-if='scope.row.flag === 2'
                           @click="lookAction(scope.$index, scope.row)">
                  查看</el-button>
                <el-button size='mini'
                           type="primary"
                           v-if='scope.row.flag == 0'
                           @click="EditAction(scope.$index, scope.row)">
                  编辑</el-button>
                <el-button type="danger"
                           size='mini'
                           v-if='scope.row.flag == 0'
                           @click="handleDelete(scope.$index, scope.row)">
                  删除</el-button>
                <el-button size='mini'
                           type="success"
                           v-if='scope.row.flag === 1 && !scope.row.taskInfo.assignee'
                           @click="signAction(scope.$index, scope.row)">
                  签收</el-button>
                <el-button type="success"
                           size='mini'
                           v-if='scope.row.flag == 0 || (scope.row.flag == 1 && scope.row.taskInfo.assignee)'
                           @click="handlePerform(scope.$index, scope.row)">
                  {{scope.row.flag ? '办理' : '发送'}}</el-button>
                <el-button size='mini'
                           type="info"
                           v-if='scope.row.flag === 1 && scope.row.taskInfo.assignee'
                           @click="celSign(scope.$index, scope.row)">
                  取消签收</el-button>
                <el-button type="danger"
                           size='mini'
                           v-if='scope.row.evaluetionStatus == -1 && scope.row.evaluetionInstId && user.userId == scope.row.projectUser'
                           @click="handleClose(scope.$index, scope.row)">
                  关闭</el-button>
                <el-button type="primary"
                           size='mini'
                           @click="exportExcel(scope.$index, scope.row)">导出</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <b-row>
          <b-col md="12"
                 class="my-1 mt-1"
                 v-if="totalPages>1">
            <el-pagination background
                           layout="total, prev, pager, next, jumper"
                           :total="total"
                           :current-page.sync="curPage"
                           :page-size="pageSize"
                           :pager-count="5"
                           align="right"></el-pagination>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
import { formatDate } from '../../utils/index.js'
import { conditionGetDepartmentList, claim, unClaim } from '../../services/safety_supervision'
export default {
  name: 'TestPlan',
  data () {
    return {
      deptNameList: [],
      fractionList: [{
        dactName: 'T1'
      }, {
        dactName: 'T2'
      }, {
        dactName: 'T3'
      }],
      month: formatDate(new Date(), 'yyyy-MM'),
      info: {
        // 分数范围
        evaluetionLevel: '',
        // 责任部门
        dept: '',
      },
      // 日期表
      daterange: [formatDate(
        new Date(),
        "yyyy-MM"
      ) + '-01',
      formatDate(new Date(), "yyyy-MM-dd")],
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
      tableData: [],
      total: 0,
      curPage: 1,
      pageSize: 15,
      totalPages: 1,
      form: {
        pageNum: 0,
        pageSize: 15,
        queryItems: []
      }
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  filters: {
    str1 (val) {
      let val1 = val.replace(/\"/g, "")
      return val1.replace(/\[|]/g, '')
    }
  },
  watch: {
    curPage (newvalue, old) {
      this.form.pageNum = newvalue - 1
      this.queryList()
    }
  },
  methods: {
    // 关闭按钮
    handleClose (index, row) {
      let data = {
        status: 4,
        evaluetionDO: {
          evaluetionId: row.evaluetionId
        },
        recordDO: {
          dealResult: 0,
          submitUser: this.user.userId
        },
        taskInfo: row.taskInfo
      }
      // console.log(data)
      axios.post('/api/performance_evaluetion/process/sendTask', (this.user.userId, data)).then(res => {
        // console.log(res)
        if (res.data.data) {
          this.queryList()
          this.$message({
            type: 'success',
            message: '关闭成功'
          })
        } else {
          this.$message.error(res.data.message)
        }
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
              this.$message.error('取消失败' + res.data.message)
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
    lookAction (index, row) {
      let lookUrl = '/performance/testlook'
      this.$router.push({
        path: lookUrl,
        query: {
          id: row.evaluetionId
        }
      })
    },
    // 导出
    exportExcel (index, row) {
      this.downLoad(
        "get",
        "/api/performance_evaluetion/fromsExport/" + row.evaluetionId,
        false,
        row.evaluetionName + '表'
      )
    },
    downLoad (method, url, params, fileName) {
      if (!params) {
        params = {};
      }
      axios({
        method,
        url,
        responseType: "blob",
        data: params
      }).then(res => {
        let headers = res.headers;
        // console.log(res);
        let blob = new Blob([res.data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = fileName + ".xls"; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href);
      });
    },
    handleDelete (index, row) {
      let id = row.evaluetionId
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios.get('/api/performance_evaluetion/deletePerformanceEvaluetion/' + id)
            .then(response => {
              // console.log(response)
              if (response.data.data) {
                this.queryList()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              } else if (response.data.error !== 0) {
                this.$message.error(response.data.message)
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
    },
    resetAction () {
      this.$refs['query'].resetFields()
    },
    addNew () {
      let url = '/performance/testadd'
      // let url = '/performance/testform'
      this.$router.push({ path: url })
    },
    // 查询按钮
    refresh () {
      let evaluetionEndTime = ''
      let evaluetioinStartTime = ''
      if (this.month) {
        let month1 = this.month.split('-')
        let day = new Date(parseInt(month1[0]), parseInt(month1[1]), 0).getDate()
        evaluetionEndTime = this.month + '-' + day
        evaluetioinStartTime = this.month + '-' + '01'
      }
      let data = [
        {
          fieldName: 'evaluetioinStartTime',
          value: evaluetioinStartTime
        },
        {
          fieldName: 'evaluetionEndTime',
          value: evaluetionEndTime
        },
        {
          fieldName: 'evaluetionTimeStart',
          value: this.daterange ? this.daterange[0] : ''
        },
        {
          fieldName: 'evaluetionTimeEnd',
          value: this.daterange ? this.daterange[1] : ''
        },
        {
          fieldName: 'deptId',
          value: this.info.dept ? this.info.dept.deptId : ''
        },
        // {
        //   fieldName: 'evaluetionLevel',
        //   value: this.info.evaluetionLevel
        // }
      ]
      this.form.queryItems = data
      this.queryList()
    },
    EditAction (index, row) {
      let url = '/performance/testedit'
      this.$router.push({
        path: url,
        query: {
          id: row.evaluetionId
        }
      })
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
    queryList () {
      // 查询列表页
      // console.log(this.form)
      axios.post('/api/performance_evaluetion/findForList', (this.user.userId, this.form))
        .then((res) => {
          // console.log(res)
          if (res.data.data) {
            this.tableData = res.data.data.content
            this.total = res.data.data.totalElements
            this.totalPages = res.data.data.totalPages
          } else {
            this.tableData = []
          }
        })
        .catch((error) => { console.log(error) })
    }
  },
  mounted () {
    conditionGetDepartmentList(1).then(result => {
      // console.log(result)
      this.deptNameList = result
    })
    this.queryList()
  },
}
</script>

