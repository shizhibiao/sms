<template>
  <div class="animated fadeIn"
       id="SupervisionList">
    <b-card no-body>
      <b-card-header>
        <el-row>
          <el-col :span="20">
            <el-form :inline="true"
                     :model="notice"
                     label-position="left"
                     class="form-title"
                     ref="query">
              <el-form-item label="立项日期"
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
              <el-form-item label="监察审计类型"
                            prop="noticeLevel">
                <el-select v-model="notice.noticeLevel"
                           class='select'
                           :clearable='true'>
                  <el-option v-for="item in monitoringList"
                             :key="item.dictId"
                             :label="item.dictName"
                             :value="item.dictId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="监察审计等级"
                            prop="monitoringGrade">
                <el-select v-model="notice.monitoringGrade"
                           class='select'
                           :clearable='true'>
                  <el-option label="公司"
                             value="1"></el-option>
                  <el-option label='部门'
                             value="2"></el-option>
                </el-select>
              </el-form-item>
              <span v-if="isShow">
                <el-form-item label="立项部门"
                              prop="departmentName">
                  <el-cascader :options="departmentList"
                               v-model="departmentName"
                               :show-all-levels="false"
                               :clearable='true'
                               :change-on-select="true"
                               ref="cascader"></el-cascader>
                </el-form-item>

                <el-form-item label="被监察部门"
                              prop="submitDeptName2"
                              v-show="notice.monitoringGrade !=  2">
                  <el-select value-key="deptId"
                             multiple
                             collapse-tags
                             class='select'
                             v-model="submitDeptName2"
                             :clearable='true'
                             ref="cascader">
                    <el-option v-for='item in submitDeptNameList2'
                               :label="item.deptName"
                               :value="item"
                               :key='item.deptId'></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="被监察单元"
                              prop="submitDeptId"
                              v-if="notice.monitoringGrade == '2'">
                  <el-select v-model="notice.submitDeptId"
                             multiple
                             collapse-tags
                             value-key='deptId'
                             class='select'
                             :clearable='true'>
                    <el-option :label="item.deptName"
                               v-for='(item,index) in unitList'
                               :value="item"
                               :key='index'></el-option>
                  </el-select>
                </el-form-item>
              </span>
            </el-form>
          </el-col>
          <el-col :span="4"
                  class="text-right">
            <el-button type="warning"
                       size='small'
                       @click="showMoreHandle()"
                       v-if="true">
              {{showMoreLabel}}</el-button>
            <el-button type="primary"
                       size='small'
                       @click="resetAction()"
                       v-if="true">
              重置</el-button>
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
      <b-card-body id="table">
        <template>
          <el-table :stripe="true"
                    :highlight-current-row="true"
                    :data="datas"
                    size="small"
                    @expand-change='handleUnfold'
                    style="width: 100%">
            <!-- 内部表 -->
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-card id="elcard"
                         v-if="props.row.rmDepartmentDOList && props.row.rmDepartmentDOList.length > 0">
                  <el-table size="mini"
                            :data="props.row.rmDepartmentDOList"
                            style="width: 100%">
                    <el-table-column label="被监察部门">
                      <template slot-scope="scope">
                        <div slot="reference"
                             class="gist-wrapper">
                          {{ scope.row.deptName}}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="监察审计等级">
                      <template slot-scope="scope">
                        <div slot="reference"
                             class="gist-wrapper">
                          {{ scope.row.projectLevel == 1 ? "公司" : '部门' }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="立项人">
                      <template slot-scope="scope">
                        <div slot="reference"
                             class="gist-wrapper">
                          {{ scope.row.userName}}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="流程流程状态">
                      <template slot-scope="scope">
                        <div slot="reference"
                             class="gist-wrapper">
                          {{scope.row.procStatus}}
                        </div>

                      </template>
                    </el-table-column>

                  </el-table>
                </el-card>
              </template>
            </el-table-column>
            <el-table-column label="#"
                             type="index"
                             width="50">
            </el-table-column>
            <el-table-column label="项目名称"
                             prop="entryName">
            </el-table-column>
            <el-table-column label="监察审计类型"
                             prop="monitoringType">
            </el-table-column>
            <el-table-column label="监察审计等级"
                             prop="monitoringGrade">
            </el-table-column>
            <el-table-column label="立项部门"
                             prop="establishmenDepartment">
            </el-table-column>
            <el-table-column label="立项日期"
                             prop="dateTime">
            </el-table-column>
            <el-table-column 
                             label="被监察单位"
                             prop="supervisedDepartment">
            </el-table-column>
            <el-table-column label="状态"
                             prop="procStatus2">
            </el-table-column>
            <el-table-column label="操作"
                             width="200">
              <template slot-scope="scope">
                <el-button size='mini'
                           v-if='scope.row.flag === 2'
                           @click="lookAction(scope.$index, scope.row)">
                  查看</el-button>
                <el-button type="primary"
                           size='mini'
                           v-if='scope.row.flag == 0'
                           @click="handleEdit(scope.$index, scope.row)">
                  编辑</el-button>
                <el-button type="danger"
                           size='mini'
                           v-if='scope.row.flag == 0 && !scope.row.procInstId'
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
                           v-if='scope.row.procStatus == -1 && scope.row.procInstId && user.userId == scope.row.userId'
                           @click="handleClose(scope.$index, scope.row)">
                  关闭</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <b-row>
          <!-- <b-col sm="12"
                 v-if="totalPages>1">
            <b-pagination size="md"
                          :total-rows="total"
                          v-model="curPage"
                          :per-page="pageSize"
                          :limit="5"
                          align="right"></b-pagination>
          </b-col> -->
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
// 192.168.17.139
import Vuex from 'vuex'
import axios from 'axios'
import { API } from '../../api'
import { formatDate } from '../../utils/index.js'
import {  getMonitoringType, getDepartmentListId, conditionGetDepartmentList,
  conditionGetDepartmentList2, StartupProcess,
  claim, unClaim, SendTask, findByMonitorIdForTwo} from '../../services/safety_supervision'
export default {
  name: 'SupervisionList',
  data () {
    return {
      // 单元列表
      unitList: [],
      // 立项公司列表
      departmentList: [],
      // 选中公司数组（[主公司，子公司...]]
      departmentName: [],
      // 监察类型列表
      monitoringList: [],
      // 监察部门列表
      submitDeptNameList2: [],
      // 选中部门数组
      submitDeptName2: [],
      count: -1,
      notice: {
        // 选中监察等级
        monitoringGrade: null,
        // 选中单元对象
        submitDeptId: [],
        // 选中监察类型
        noticeLevel: '',
        // 开始日期
        submitDateStart: '',
        // 结束日期
        submitDateEnd: ''
      },
      // 日期表
      daterange: [formatDate(new Date(new Date().getTime() - 3600 * 1000 * 24 * 6), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
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
      // 表格数据
      datas: [],
      isShow: false,
      showMoreLabel: '更多',
      total: 0,
      curPage: 1,
      pageSize: 15,
      totalPages: 1,
      roles: [],
      form: {
        orderby: '',
        pageNum: 0,
        pageSize: 15,
        queryItems: []
      }
    }
  },
  computed: {
    deptId () {
      return this.$store.state.user.deptId
    },
    userId () {
      return this.$store.state.user.userId
    },
    ...Vuex.mapState({
      user: 'user'
    })
  },
  watch: {
    curPage (newvalue, old) {
      this.form.pageNum = newvalue - 1
      this.datas = []
      this.queryList()
    }
  },
  methods: {
    filerTypeHandle2 (data) {
      switch (data) {
        case 0:
          return '子流程新建'
        case 1:
          return '子流程组长安排'
        case 2:
          return '子流程工作执行'
        case 3:
          return '子流程组长审核'
        case 4:
          return '子流程各部门确认'
        case 5:
          return '子流程结束'
        default:
          return ''
      }
    },
    handleUnfold (row, expandedRows) {
      //  if (!row.rmDepartmentDOList) {
      //    row.rmDepartmentDOList = []
      //  }
      // 查询子表数据
      findByMonitorIdForTwo(row.id).then(res => {
        row.rmDepartmentDOList = res.data.data
        // console.log(row)
      })
    },
    // 关闭按钮
    handleClose (index, row) {
      let data = {
        auditDO: {
          monitorId: row.id,
          auditType: 3,
          submitUser: this.user.userId,
          auditResult: 0
        },
        taskInfo: row.taskInfo
      }
      SendTask(this.user.userId, data).then(res => {
        // console.log(res)
        if (res.data.data) {
          this.datas = []
          this.queryList()
          this.$message({
            type: 'success',
            message: '关闭成功'
          })
        } else {
          this.$message.error('关闭失败' + res.data.message)
        }
      })
        .catch(() => {
          this.$message.error('网络错误或服务器错误')
        })
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
          // console.log(row.taskInfo.taskId, this.user.userId)
          // alert(row.taskInfo.taskId)
          // alert(this.user.userId)
          claim(row.taskInfo.taskId, this.user.userId).then(res => {
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
              this.datas = []
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
    // 重置按钮
    resetAction () {
      this.$refs['query'].resetFields()
      // this.daterange = []
      // this.daterange = [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')]
      this.departmentName = []
      this.submitDeptName2 = []
      this.refresh()
    },
    // 更多按钮
    showMoreHandle () {
      this.isShow = !this.isShow
      this.showMoreLabel = this.isShow ? '隐藏' : '更多'
    },
    filerTypeHandle (data) {
      switch (data) {
        case -2:
          return '关闭流程'
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
    addNew () {
      // this.count++
      let url = '/monitor/edit/' + -1
      this.$router.push({ path: url })
    },
    // 查询按钮
    refresh () {
      // console.log(this.daterange)
      let len = this.departmentName.length > 0 ? this.departmentName.length - 1 : null
      // console.log(this.notice.submitDeptId)
      let arr = ''
      if (this.submitDeptName2.length) {
        this.submitDeptName2.map((item, index) => {
          if (index !== this.submitDeptName2.length - 1) {
            arr += item.deptId + ','
          } else {
            arr += item.deptId
          }
        })
      } else {
        this.notice.submitDeptId.map((item, index) => {
          if (index !== this.notice.submitDeptId.length - 1) {
            arr += item.deptId + ','
          } else {
            arr += item.deptId
          }
        })
      }
      // console.log(arr)
      let data = [
        {
          fieldName: 'monitorType',
          value: this.notice.noticeLevel
        },
        {
          fieldName: 'deptId',
          value: this.departmentName[len]
        },
        {
          fieldName: 'projectLevel',
          value: this.notice.monitoringGrade
        },
        {
          fieldName: 'monitorDeptId',
          value: arr
        },
        {
          fieldName: 'projectStartDate',
          value: this.daterange ? this.daterange[0] : ''
        },
        {
          fieldName: 'projectEndDate',
          value: this.daterange ? this.daterange[1] : ''
        }
      ]
      this.form.queryItems = data
      this.form.pageNum = 0
      this.datas = []
      this.queryList()
    },
    // 编辑按钮
    handleEdit (index, row) {
      // console.log(row.deptId, row.projectName)
      let url = '/monitor/edit/' + 0
      this.$router.push({
        path: url,
        query: {
          id: row.id
        }
      })
    },
    // 办理按钮
    handlePerform (index, row) {
      let url = '/monitor/act/' + 1
      let url2 = '/monitor/reject/' + 0
      if (row.flag) {
        if (row.procStatus == -1) {
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
      } else {
        this.$confirm('确定发送该流程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            StartupProcess(row.id).then(res => {
              // console.log(res)
              if (res.data.data) {
                this.datas = []
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
    // 查看按钮
    lookAction (index, row) {
      let url = '/monitor/look/' + 2
      this.$router.push({
        path: url,
        query: {
          id: row.id,
          status: row.procStatus
        }
      })
    },
    // 删除按钮
    handleDelete (index, row) {
      // console.log(row)
      let id = row.id
      // console.log(id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios.get('/api/securitymonitor/deleteSafetyMonitor/' + id)
            .then(response => {
              // console.log(response)
              if (response.data.data) {
                this.datas = []
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
    queryList () {
      // 查询列表页
      // console.log(this.form)
      axios.post(`${API.DEMAND_SECURITY_SUPERVISION_LIST}`, (this.userId, this.form))
        .then((response) => {
          // console.log(response)
          let data = response.data.data.content
          // console.log(data)
          data.map((item, index) => {
            let monitoringType = this.monitoringList.find(type => {
              return type.dictId == item.monitorType//eslint-disable-line
            })
            let departmentList = item.monitorDept.split(',').map(name => {
              return name + '\n'
            })

            // console.log(item.monitorDept.split(','))
            item.entryName = item.projectName
            item.monitoringType = monitoringType ? monitoringType.dictName : ''  // monitoringType.dictName || ''
            item.monitoringGrade = item.projectLevel === '1' ? '公司' : '部门'
            item.establishmenDepartment = item.deptName
            item.dateTime = formatDate(new Date(item.projectStartDate), 'yyyy-MM-dd')
            item.supervisedDepartment = departmentList
            item.procStatus2 = this.filerTypeHandle(item.procStatus)
            item.rmDepartmentDOList = []
            this.datas.push(item)
            // if (item.procStatus === -1) {
            //   let temp = null
            //   temp = this.datas[index]
            //   this.datas[index] = this.datas[0]
            //   this.datas[0] = temp
            // }
          })
          this.total = response.data.data.totalElements
          this.totalPages = response.data.data.totalPages
          // console.log(this.datas)
        })
        .catch((error) => { console.log(error) })
    }
  },
  mounted () {
    // this.datas = JSON.parse(localStorage.getItem('add')) || []
    // 监察类型列表
    getMonitoringType().then(result => {
      // console.log(result)
      this.monitoringList = result
    })
    // 获取所有分好类公司
    getDepartmentListId().then(result => {
      // console.log(result)
      this.departmentList = result
    })
    conditionGetDepartmentList(1).then(result => {
      // console.log(result)
      this.submitDeptNameList2 = result
    })
    // 获取单元
    conditionGetDepartmentList2(2).then(result => {
      this.unitList = result
    })
    // 查询列表页
    // this.queryList()
    this.refresh()
    // console.log(this.user.deptId)
  }
}
</script>

<style>
#SupervisionList .el-date-editor .el-range-separator {
  padding: 0;
}
#SupervisionList .el-button + .el-button {
  margin-left: 0;
}
#table .el-table .cell {
  white-space: pre-line;
}
.el-table #elcard .cell {
  white-space: nowrap;
}
</style>
