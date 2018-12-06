<template>
    <div class="animated fadeIn">
        <b-card no-body>
            <b-card-header>
                <el-row :gutter="12">
                    <el-col :span="18">
                        <el-form inline :model="operation" ref="operation">
                          <el-form-item label="危险编号" prop="riskNo">
                                <el-input v-model="operation.riskNo"></el-input>
                            </el-form-item>
                            <el-form-item label="处理状态" prop="status">
                                <el-select v-model="operation.status" clearable>
                                    <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="辨识部门" prop="identifyDept">
                              <el-select v-model="operation.identifyDept" class='select' :clearable='true'>
                                <el-option :label="item.deptName" :value="item.deptId" v-for='(item,index) in deptNameList' :key='index'></el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item label="涉及过程" prop="involvesProcess" v-if="showMore === true">
                                <el-cascader :options="involvesProcessData" v-model="operation.involvesProcess" :props='{value:"value"}' :show-all-levels="false" :clearable='true'></el-cascader>
                            </el-form-item>
                            <el-form-item label="风险等级" prop="riskGrade" v-if="showMore === true">
                                <el-select v-model="operation.riskGrade" clearable>
                                    <el-option v-for="(item, index) in riskGradeData" :key="index" :label="item.riskClass" :value="item.riskClass"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="对应规则编号" v-if="showMore === true" prop="riskMeasure">
                                <el-input v-model="operation.riskMeasure"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="6" class="text-right">
                    <el-button size='small' type="warning" @click="showMoreHandle">{{showMoreLabel}}</el-button>
                    <el-button size='small' type="primary" @click="resetBtnData()">重置</el-button>
                    <el-button size='small' type="primary" @click="inquireDataList">查询</el-button>
                    <el-button size='small' type="success" @click="goReportStat">新增</el-button>
                    </el-col>
                </el-row>
            </b-card-header>
            <b-card-body>
                <el-table
                    size="small"
                    :data="tableData"
                    :stripe="true"
                    :highlight-current-row ="true"
                    style="width: 100%"
                    @expand-change='handleUnfold'>
                    <!-- 根原因 -->
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <b-card no-body>
                                <b-card-header>根原因</b-card-header>
                                <b-card-body>
                                    <el-table
                                        size="small"
                                        :data="RootCauseDatas">
                                        <el-table-column
                                            label="#"
                                            prop="index"
                                            width='50'
                                            >
                                        </el-table-column>
                                        <el-table-column
                                            label="根原因"
                                            prop="resonName">
                                        </el-table-column>
                                        <el-table-column
                                            label="根原因分析"
                                            prop="resonDesc">
                                        </el-table-column>
                                    </el-table>
                                </b-card-body>
                            </b-card>
                        </template>
                    </el-table-column>
                    <!-- 外部表 -->
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
                        label="风险控制措施或对应规程编号"
                        prop="riskMeasure">
                    </el-table-column>
                    <el-table-column
                        label="应急措施"
                        prop="controlMeasure">
                    </el-table-column>
                    <el-table-column
                        label="处理状态"
                        prop="status">
                    </el-table-column>
                    <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size='mini' v-if="scope.row.flag == '0' && scope.row.procInstId === null"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size='mini' v-if="scope.row.flag == '0' && scope.row.procInstId === null"
                        @click="handleRemove(scope.$index, scope.row)"
                        v-loading.fullscreen.lock="fullscreenLoading">删除</el-button>
                        <el-button size='mini' type="success" v-if="scope.row.flag == '0' && scope.row.procInstId === null"
                        @click="sendAction(scope.$index, scope.row)" 
                        v-loading.fullscreen.lock="fullscreenLoading">发送</el-button>
                        
                        <el-button type="primary" size='mini' v-if="scope.row.flag == '0' && scope.row.procInstId !== null"
                          @click="procInstIdHandleEdit(scope.$index, scope.row)">办理</el-button>
                        <el-button type="success" size='mini' v-if="scope.row.flag == '0' && scope.row.procInstId !== null"
                          @click="cancelAction(scope.$index, scope.row)"
                          v-loading.fullscreen.lock="fullscreenLoading">取消签收</el-button>

                        <el-button type="primary" size='mini' v-if="scope.row.taskInfo != null && scope.row.taskInfo.assignee == null && scope.row.flag == '1'"
                        @click="signInAction(scope.$index, scope.row)"
                        v-loading.fullscreen.lock="fullscreenLoading">签收</el-button>
                        <el-button type="primary" size='mini' v-if="scope.row.taskInfo != null && scope.row.taskInfo.assignee != null && scope.row.flag == '1'"
                        @click="handleExecute(scope.$index, scope.row)">办理</el-button>
                        <el-button type="success" size='mini' v-if="scope.row.taskInfo != null && scope.row.taskInfo.assignee != null && scope.row.flag == '1'"
                        @click="cancelAction(scope.$index, scope.row)"
                        v-loading.fullscreen.lock="fullscreenLoading">取消签收</el-button>
                        
                        <el-button type="default" size='mini' v-if="scope.row.flag == '2'"
                        @click="handleLook(scope.$index, scope.row)">查看</el-button>
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
    </div>
</template>
<script>
import { getInvolveCourse, inquireHazardList, removeRiskSource, startHazardStream, activitiCancelClaim, inquireSingleRootCause, getFCLECdata } from '../../services/information_report/index.js'
import { signForTask, GetDepartmentListFromList } from '../../services/safety_notice'

export default {
  data () {
    return {
      // 处理状态
      statusList: [
        {
          label: '新建',
          value: -1
        },
        {
          label: '评估',
          value: 0
        },
        {
          label: '审核',
          value: 1
        },
        {
          label: '结束',
          value: 2
        }
      ],
      // 风险等级数据
      riskGradeData: [],
      // 点击更多或隐藏操作查询条件
      showMore: false,
      showMoreLabel: '更多',
      operation: {
        // 风险等级
        riskGrade: null,
        // 涉及部门
        involvesProcess: [],
        // 危险编号
        riskNo: '',
        // 时态
        status: null,
        // 对应规则编号
        riskMeasure: '',
        // 辨识部门
        identifyDept: null
      },
      // loading
      fullscreenLoading: false,
      // 表格数据
      tableData: [],
      // 根原因下拉框数据
      RootCauseDatas: [],
      // 涉及部门数据
      involvesProcessData: [],
      // 辨识部门
      deptNameList: [],
      // 分页相关数据
      total: 0,
      pageNum: 1,
      pageSize: 15,
      totalPages: 1
    }
  },
  methods: {
    // 点击显示子表数据
    handleUnfold (index, expandedRows) {
      let riskId = index.riskId
      // 只显示一个字表
      if (expandedRows.length > 1) {
        expandedRows.shift()
      }
      inquireSingleRootCause(riskId).then(result => {
        if (result.data.error === 0 && result.data.data !== null) {
          this.RootCauseDatas = result.data.data
          for (var i = 0; i < this.RootCauseDatas.length; i++) {
            this.RootCauseDatas[i].index = i + 1
          }
        }
      })
    },
    // 显示隐藏更多查询条件
    showMoreHandle () {
      this.showMore = !this.showMore
      if (this.showMore) {
        this.showMoreLabel = '隐藏'
      } else {
        this.showMoreLabel = '更多'
      }
    },
    // 查询
    inquireDataList () {
      let {riskGrade, riskNo, status, riskMeasure, involvesProcess, identifyDept} = this.operation
      let dataList = {}
      let deptId = involvesProcess && involvesProcess.length > 0 ? involvesProcess[0] : null
      let level1Process = involvesProcess && involvesProcess.length > 1 ? involvesProcess[1] : null
      let level2Process = involvesProcess && involvesProcess.length > 2 ? involvesProcess[2] : null
      let level3Process = involvesProcess && involvesProcess.length > 3 ? involvesProcess[3] : null
      let level4Process = involvesProcess && involvesProcess.length > 4 ? involvesProcess[4] : null

      dataList.pageNum = this.pageNum - 1
      dataList.pageSize = this.pageSize
      dataList.queryItems = [
        {
          fieldName: 'riskGrade',
          value: riskGrade
        },
        {
          fieldName: 'riskNo',
          value: riskNo
        },
        {
          fieldName: 'identifyDept',
          value: identifyDept
        },
        {
          fieldName: 'status',
          value: status
        },
        {
          fieldName: 'riskMeasure',
          value: riskMeasure
        },
        {
          fieldName: 'deptId',
          value: deptId
        },
        {
          fieldName: 'level1Process',
          value: level1Process
        },
        {
          fieldName: 'level2Process',
          value: level2Process
        },
        {
          fieldName: 'level3Process',
          value: level3Process
        },
        {
          fieldName: 'level4Process',
          value: level4Process
        }
      ]
      inquireHazardList(dataList).then(result => {
        if (result.data.data !== null && result.data.error === 0) {
          this.total = result.data.data.totalElements
          this.totalPages = result.data.data.totalPages
          this.tableData = result.data.data.content
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].index = i + 1
            if (this.tableData[i].status === -1) {
              this.tableData[i].status = '新建'
            } else if (this.tableData[i].status === 0) {
              this.tableData[i].status = '评估'
            } else if (this.tableData[i].status === 1) {
              this.tableData[i].status = '审核'
            } else if (this.tableData[i].status === 2) {
              this.tableData[i].status = '结束'
            }
          }
        } else if (result.data.data === null && result.data.error === 0) {
          this.tableData = []
          this.totalPages = 1
        }
      })
    },
    // 重置
    resetBtnData () {
      this.$refs.operation.resetFields()
      this.pageNum = 1
      // 重置刷新查询列表
      this.inquireDataList()
    },
    // 新建
    goReportStat () {
      // 跳转到新建页面
      this.$router.push({
        path: '/risk/add-hazard',
        query: {
          riskId: 0,
          describe: 'added'
        }
      })
    },
    // 办理
    handleExecute (index, row) {
      // console.log(row)
      let riskId = row.riskId
      this.$router.push({
        path: '/risk/examine-hazard/' + riskId,
        query: {
          riskId: row.riskId,
          flag: row.flag,
          path: '/risk/hazard-list',
          taskInfo: row.taskInfo,
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
        // 显示loading
        this.fullscreenLoading = true
        let taskId = row.taskInfo.taskId
        let userId = this.$store.state.user.userId
        signForTask(taskId, userId).then(result => {
          this.fullscreenLoading = false
          if (result.data.error === 0) {
            this.$message({
              type: 'success',
              message: '签收成功!'
            })
            this.$router.push({
              path: '/risk/examine-hazard/' + riskId,
              query: {
                riskId: row.riskId,
                flag: row.flag,
                taskInfo: row.taskInfo,
                path: '/risk/hazard-list',
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
            this.fullscreenLoading = false
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
        // 显示loading
        this.fullscreenLoading = true
        let taskId = row.taskInfo.taskId
        activitiCancelClaim(taskId).then(result => {
          this.fullscreenLoading = false
          if (result.data.error === 0) {
            this.inquireDataList()
          } else {
            this.$message({
              type: 'error',
              message: '取消签收失败：' + result.data.message
            })
          }
        })
      })
    },
    // 初评退回后的办理
    procInstIdHandleEdit (index, row) {
      // console.log(row)
      // 点击跳转到编辑页面
      this.$router.push({
        path: '/risk/compile-hazard',
        query: {
          riskId: row.riskId,
          taskInfo: row.taskInfo,
          describe: 'handleCompile',
          status: row.status,
          path: '/risk/hazard-list'
        }
      })
    },
    // 查看
    handleLook (index, row) {
      console.log(row)
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
    // 编辑
    handleEdit (index, row) {
      // 点击跳转到编辑页面
      this.$router.push({
        path: '/risk/compile-hazard',
        query: {
          riskId: row.riskId,
          describe: 'compile'
        }
      })
    },
    // 删除
    handleRemove (index, row) {
      // console.log(row)
      this.$confirm('确定删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 显示loading
        this.fullscreenLoading = true
        removeRiskSource(row.riskId).then(result => {
          this.fullscreenLoading = false
          if (result.data.data && +result.data.error === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.inquireDataList()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败：' + result.data.message
            })
          }
        })
          .catch(() => {
            this.fullscreenLoading = false
            this.$message({
              type: 'error',
              message: '删除失败：' + error
            })
          })
      })
        .catch((error) => {
          console.log(error)
        })
    },
    // 发送
    sendAction (index, row) {
      this.$confirm('是否要启动流程？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 显示loading
        this.fullscreenLoading = true
        // 点击启动流程
        let id = row.riskId
        startHazardStream(id).then(result => {
          // 保存成功后关闭loading
          this.fullscreenLoading = false
          if (result.data.error === 0) {
            this.$message({
              type: 'success',
              message: '启动流程成功!'
            })
            // 重新请求数据
            this.inquireDataList()
          } else {
            this.$message({
              type: 'error',
              message: '启动流程失败：' + result.data.message
            })
          }
        })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '启动流程失败：' + error
            })
            this.fullscreenLoading = false
          })
      })
    },
    // 风险等级
    getFCLECdataAction () {
      let num = 3
      getFCLECdata(num).then(result => {
        // console.log(result)
        if (result.data.error === 0 && result.data.data !== null) {
          this.riskGradeData = result.data.data
        }
      })
    }
  },
  watch: {
    pageNum: function (newValue, oldValue) {
      this.inquireDataList()
    }
  },
  created () {
    // 查询数据
    this.inquireDataList()
    // 触发调用涉及过程数据
    getInvolveCourse().then(result => {
      // console.log(result)
      this.involvesProcessData = result
    })
    // 获取风险等级数据
    this.getFCLECdataAction()
  },
  mounted () {
    // 辨识部门
    GetDepartmentListFromList(1).then(result => {
      this.deptNameList = result
    })
  }
}
</script>