<template>
  <div class="animated fadeIn">
    <el-form :model="preserveData" :rules="rules" ref="preserveData" status-icon size="medium" label-width="120px" inline-message>
      <b-card no-body>
        <b-card-header>基本信息</b-card-header>
        <b-card-body>
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="报告类型" prop="category">
                <el-select v-model="preserveData.category">
                  <el-option v-for="(item, index) in ALL_SELECT_DATA.REPORT_TYPE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="是否匿名" prop="anonymous">
                <el-radio v-model="preserveData.anonymous" :label='true'>是</el-radio>
                <el-radio v-model="preserveData.anonymous" :label='false'>否</el-radio>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="preserveData.anonymous === false">
              <el-form-item label="报告人" prop="reporterName">
                <el-input v-model="preserveData.reporterName" placeholder="请输入号码" disabled></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="preserveData.anonymous === false">
              <el-form-item label="所在部门" prop="deptName">
                <el-input v-model="preserveData.deptName" placeholder="请输入号码" disabled></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="报告时间" prop="reportDate">
                <el-input v-model="preserveData.reportDate" placeholder="请输入号码" disabled></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="联系电话" prop="telphone">
                <el-input v-model="preserveData.telphone" placeholder="请输入号码" maxlength="20"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="发生地点" prop="occurAddress">
                <el-input v-model="preserveData.occurAddress" placeholder="" maxlength="50"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="发生日期" prop="occurDate">
                <el-date-picker
                  style="width: 100%;"
                  v-model="preserveData.occurDate"
                  type="date"
                  placeholder="选择日期"
                  align="right"
                  :picker-options="pickerOptions1">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="标题" prop="title">
          <el-input placeholder="请输入内容" v-model="preserveData.title" class="input-with-select" maxlength="200">
            <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 140px;" @change="selectAction">
              <el-option v-for="(item, index) in titles" :key="index" :label="item.dictCode" :value="item.dictCode"></el-option>
            </el-select>
          </el-input>
          <!-- <el-input v-model="preserveData.title" placeholder="" style="width: 100%" maxlength="200"></el-input> -->
        </el-form-item>
          <el-form-item label="专业类型" prop="majorType">
            <el-radio v-model="preserveData.majorType" :label='1' :disabled='true'>飞行</el-radio>
            <el-radio v-model="preserveData.majorType" :label='2' :disabled='true'>地面</el-radio>
            <el-radio v-model="preserveData.majorType" :label='3' :disabled='true'>安保</el-radio>
          </el-form-item>
        </b-card-body>
      </b-card>
      <Flight v-if="preserveData.majorType == 1" ref="getFlight" :byData="groundList" :compileData="sublistData" />
      <Ground v-else-if="preserveData.majorType == 2" ref="getGround" :byData="groundList" :compileData="sublistData" />
      <Security v-else-if="preserveData.majorType == 3" ref="getSecurity" :byData="groundList" :compileData="sublistData" />
      <!-- 附件上传 -->
      <security-notice-adjunct
      ref='adjunct'
      :uploadFile='uploadFile'
      :tableName='tableName'
      :safetyId='safetyId'
      :flag="flag"></security-notice-adjunct>
      <!-- 审核历史 -->
      <b-card no-body v-if="name === 'handle'">
        <b-card-header>
          审核历史
          <div class="card-actions">
            <b-btn class="btn btn-minimize" v-b-toggle.historyTab @click="historyTiggleAction"><i class="icon-arrow-down" ref="historyRef"></i></b-btn>
          </div>
        </b-card-header>
        <b-collapse id="historyTab" :visible="true" ref="historyTab">
          <b-card-body>
            <el-table
              :data="tableData"
              :stripe="true"
              :highlight-current-row ="true"
              style="width: 100%">
              <!-- 外部表 -->
              <el-table-column
                  label="#"
                  prop="index"
                  width='50'
                  >
              </el-table-column>
              <el-table-column
                label="日期"
                prop="auditTime">
              </el-table-column>
              <el-table-column
                label="操作人"
                prop="auditUserName">
              </el-table-column>
              <el-table-column
                label="审核类型"
                prop="auditType">
              </el-table-column>
              <el-table-column
                label="意见"
                prop="auditComment">
              </el-table-column>
              <el-table-column
                label="结果"
                prop="auditResult">
              </el-table-column>
              <el-table-column
                width='250'
                label="操作">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button type="default" size='mini'
                      v-if="(scope.row.auditType == '初评' && (scope.row.auditResult == '同意' || scope.row.auditResult == true)) || scope.row.auditType == '处理意见'"
                      @click="handleTransaction(scope.$index, scope.row)">查看</el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </b-card-body>
        </b-collapse>
      </b-card>
      <!-- 操作按钮 -->
      <b-card no-body>
        <b-card-body>
          <div class="text-center">
            <div class="text-center">
              <el-steps :active="auditTypeNum" align-center>
                <el-step title="新建"></el-step>
                <el-step title="初评" description="安技部-安全绩效组"></el-step>
                <el-step title="单元审核" description="安技部-安全管理经理"></el-step>
                <el-step title="部门审核" description="安技部-部门管理团队"></el-step>
                <el-step title="处理意见" description="安技部-安全绩效组"></el-step>
                <el-step title="处理核准" description="安技部-安全管理经理"></el-step>
                <el-step title="结束"></el-step>
              </el-steps>
            </div>
            <el-button size='small' type="primary" @click="preserveAction"
              v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
            <el-button size='small' type="primary" @click="handleAction"
              v-loading.fullscreen.lock="fullscreenLoading" v-if="name === 'handle'"
              :disabled="preserveDisabled === false">发送</el-button>
            <el-button size='small' type="danger" @click="finishFlowAction" v-if="name === 'handle'">结束流程</el-button>
            <el-button size='small' @click="gobackAction">返回</el-button>
          </div>
        </b-card-body>
      </b-card>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  // 飞行 地面 安保
  import Flight from '../common/Flight'
  import Ground from '../common/Ground'
  import Security from '../common/Security'
  // 过滤
  // import { filterNameChange } from '../../filter/reportFilter.js'
  import { getAllDataAction, compileInformationReports, initiatorProcedureAction, disposeTransactionAction, getViewAuditHistoryAction } from '../../services/information_report'
  // 附件上传
  import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'

  import { formatDate } from '../../utils/index.js'
  import { sourceDataFilter, sourceDataFilterOpposite } from '../../tools'

  export default {
    name: 'reportCompile',
    components: {
      Flight,
      Ground,
      Security,
      SecurityNoticeAdjunct
    },
    data () {
      return {
        preserveData: {
          reportNumber: 0,
          // 报告类别
          category: '',
          // 是否匿名
          anonymous: 'false',
          // 报告人姓名
          reporterName: '',
          // 报告部门deptId
          // 报告时间
          reportDate: formatDate(new Date(), 'yyyy-MM-dd'),
          // 联系电话
          telphone: '',
          // 标题
          title: '',
          // 发生日期
          occurDate: new Date(),
          // 发生地点
          occurAddress: '',
          // 报告状态
          status: -1,
          // 当前用户ID userId
          // 专业类型 飞行、地面、安保
          majorType: 0,
          // 实例流程
          procInstId: 0,
          //  飞行里面的数据
          reportFlyDO: {},
          //  地面里面的数据
          reportGroundDO: {},
          //  安保里面的数据
          reportSecurityDO: {},
          // 所在部门
          deptName: '',
          // 报告部门Id
          deptId: '',
          // 报告人Id
          reporter: ''
        },
        pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        },
        // 下拉菜单数据
        groundList: {
          // 飞行性质
          FLIGHT_PURPOSE: {
            dicts: []
          },
          // 飞行阶段
          FLIGHT_STATUS: {
            dicts: []
          },
          // 气象条件
          WEATHER_CONDITION: {
            dicts: []
          },
          // 光照条件
          LIGHT_CONDITION: {
            dicts: []
          },
          // 事件类型
          EVENT_TYEP: {
            dicts: []
          },
          // 事件等级
          EVENT_LEVEL: {
            dicts: []
          },
          // 航班延误情况
          FLIGHT_DELAY: {
            dicts: []
          },
          // 原因分类
          REASON_TYEP: {
            dicts: []
          },
          // 航空器损坏
          AIRCRAFT_DAMAGE: {
            dicts: []
          },
          // 运行阶段
          RUNNING_STATUS: {
            dicts: []
          },
          // 车辆类型
          CAR_CATEGORY: {
            dicts: []
          },
          // 安保事件类别
          SECURITY_EVENT_TYPE: {
            dicts: []
          },
          // 安保事件类型1
          SECURITY_EVENT_TYPE1: {
            dicts: []
          },
          // 安保事件类型2
          SECURITY_EVENT_TYPE2: {
            dicts: []
          },
          // 飞行事情简要经过模板
          EVENT_FILGHT_TITLE: {
            dicts: []
          },
          // 地面事情简要经过模板
          EVENT_GROUND_TITLE: {
            dicts: []
          },
          // 安保事情简要经过模板
          EVENT_SECURITY_TITLE: {
            dicts: []
          }
        },
        // 子表信息
        sublistData: {},
        safetyId: 0,
        // 保存状态--是否修改了内容
        saveStatus: false,
        // 后台附件存储的表单名
        tableName: 't_report',
        // 记录触发监听的次数
        whetherCount: 0,
        rules: {
          // validator: checkPhone, 方法验证
          telphone: [
            { required: true, message: '手机号不能为空哦', trigger: 'blur'}
          ],
          category: [
            { required: true, message: '报告类型不能为空哦', trigger: 'change' },
          ],
          occurDate: [
            { required: true, message: '发生日期不能为空哦', trigger: 'change' }
          ],
          occurAddress: [
            { required: true, message: '发生地点不能为空哦', trigger: 'change' }
          ],
          title: [
            { required: true, message: '标题不能为空哦', trigger: 'change' }
          ],
          majorType: [
            { required: true, message: '专业类型不能为空哦', trigger: 'change' }
          ]
        },
        // loading
        fullscreenLoading: false,
        uploadFile: true,
        flag: '',
        // 记录是哪个事件跳转过来的
        name: '',
        preserveDisabled: true,
        taskInfo: {},
        // 审核历史记录表格数据
        tableData: [],
        // 流程图对应的值
        auditTypeNum: 0,
        // 标题对应的数据
        select: '',
        titles: []
      }
    },
    computed: {
      // 所有数据字典中的数据
      ALL_SELECT_DATA () {
       return this.$store.state.ALL_SELECT_DATA
      }
    },
    methods: {
      // 将code值转为name值
      dataFilter (avlue, type) {
        let sourceData = this.ALL_SELECT_DATA[type]
        let result = sourceDataFilter(sourceData, avlue)
        return result
      },
      // 保存按钮
      preserveAction () {
        this.preserveData.attList = this.$refs.adjunct.fileFormList
        if (isNaN(Number(this.preserveData.category))) {
          this.preserveData.category = sourceDataFilterOpposite(this.ALL_SELECT_DATA.REPORT_TYPE, this.preserveData.category)
        }
        // 显示loading
        this.fullscreenLoading = true
        if (this.preserveData.majorType === 1) {
          // 获取到飞行信息
          this.preserveData.reportFlyDO = this.$refs.getFlight.compileData.data
          compileInformationReports(this.preserveData).then(result => {
            // 关闭loading
            this.fullscreenLoading = false
            if (this.name === 'compile') {
              if (result.data.error === 0 && result.data.data !== null) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.$router.go(-1)
              }
            } else if (this.name === 'handle') {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.preserveDisabled = true
            } else {
              this.$message({
                type: 'error',
                message: '修改失败：' + result.data.message
              })
            }
            this.whetherCount = 0
            this.preserveData.category = this.dataFilter(this.preserveData.category, 'REPORT_TYPE')
          })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '修改失败：' + error
              })
              // 关闭loading
              this.fullscreenLoading = false
            })
        } else if (this.preserveData.majorType === 2) {
          // 获取到地面信息
          this.preserveData.reportGroundDO = this.$refs.getGround.compileData.data
          compileInformationReports(this.preserveData).then(result => {
            // 保存成功后关闭loading
            this.fullscreenLoading = false
            if (this.name === 'compile') {
              if (result.data.error === 0 && result.data.data !== null) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.$router.go(-1)
              }
            } else if (this.name === 'handle') {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.preserveDisabled = true
            } else {
              this.$message({
                type: 'error',
                message: '修改失败：' + result.data.message
              })
            }
            this.whetherCount = 0
            this.preserveData.category = this.dataFilter(this.preserveData.category, 'REPORT_TYPE')
          })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '修改失败：' + error
              })
              // 关闭loading
              this.fullscreenLoading = false
            })
        } else if (this.preserveData.majorType === 3) {
          // 获取到安保信息
          this.preserveData.reportSecurityDO = this.$refs.getSecurity.compileData.data
          compileInformationReports(this.preserveData).then(result => {
            // 保存成功后关闭loading
            this.fullscreenLoading = false
            if (this.name === 'compile') {
              if (result.data.error === 0 && result.data.data !== null) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.$router.go(-1)
              }
            } else if (this.name === 'handle') {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.preserveDisabled = true
            } else {
              this.$message({
                type: 'error',
                message: '修改失败：' + result.data.message
              })
            }
            this.whetherCount = 0
            this.preserveData.category = this.dataFilter(this.preserveData.category, 'REPORT_TYPE')
          })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '修改失败：' + error
              })
              // 关闭loading
              this.fullscreenLoading = false
            })
        }
      },
      // 根据列表页面传过来的id进行请求数据
      upDateCompile () {
        var reportNumber = +this.$route.params.id
        axios.get('/api/report/' + reportNumber)
          .then(response => {
            // console.log(response, '编辑')
            if (response.data != null && response.data.data != null) {
              // console.log(response.data.data.category)
              this.preserveData = response.data.data
              this.sublistData.path = 'reportCompile'
              this.preserveData.category = this.dataFilter(this.preserveData.category, 'REPORT_TYPE')
              if (this.preserveData.majorType === 1) {
                this.sublistData.data = this.preserveData.reportFlyDO
              } else if (this.preserveData.majorType === 2) {
                this.sublistData.data = this.preserveData.reportGroundDO
              } else if (this.preserveData.majorType === 3) {
                this.sublistData.data = this.preserveData.reportSecurityDO
              }
              
            } else {
              this.$message({
                type: 'error',
                message: '请求失败：' + response.data.message
              })
            }
          })
          .catch((error) => {
            this.$message({
              type: 'error',
              message: '请求失败：' + error
            })
          })
      },
      // 返回按钮
      gobackAction () {
        if (this.saveStatus === true) {
          this.$router.go(-1)
        } else {
          this.$confirm('您已修改，确定退出该页面？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.go(-1)
          })
        }
      },
      // 办理/发送
      handleAction () {
        if (this.saveStatus === true) {
          let obj = {}
          obj.reportAuditDO = this.preserveData
          obj.taskInfo = this.taskInfo
          let user = this.$store.state.user
          obj.reportAuditDO.auditResult = 1
          obj.reportAuditDO.auditUser = user.userId
          obj.reportAuditDO.auditUserName = user.userName
          // 显示loading
          this.fullscreenLoading = true
          disposeTransactionAction(obj).then(result => {
            // 关闭loading
            this.fullscreenLoading = false
            if (result.data.error === 0 && result.data.data !== null) {
              this.$router.push('/report/list')
            } else {
              this.$message({
                type: 'error',
                message: '发送失败：' + result.data.message
              })
            }
          })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '发送失败：' + error
              })
              // 关闭loading
              this.fullscreenLoading = false
            })
        } else {
          this.$confirm('您已修改，请先保存！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.preserveDisabled = false
          })
        }
      },
      // 结束流程
      finishFlowAction () {
        this.$confirm('确定驳回？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {}
          obj.reportAuditDO = this.preserveData
          obj.taskInfo = this.taskInfo
          let user = this.$store.state.user
          obj.reportAuditDO.auditResult = 0
          obj.reportAuditDO.auditUser = user.userId
          obj.reportAuditDO.auditUserName = user.userName
          disposeTransactionAction(obj).then(result => {
            if (result.data.error === 0 && result.data.data !== null) {
              this.$router.push('/report/list')
            } else {
              this.$message({
                type: 'error',
                message: '驳回失败：' + result.data.message
              })
            }
          })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '驳回失败：' + error
              })
            })
        })
      },
      // 获取审核历史记录
      getHistoryActions () {
        getViewAuditHistoryAction(this.safetyId).then(result => {
          if (result.data.error === 0 && result.data.data !== null) {
            this.tableData = result.data.data
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].auditResult === true) {
                this.tableData[i].auditResult = '同意'
              } else if (this.tableData[i].auditResult === false) {
                this.tableData[i].auditResult = '驳回'
              }
              // 添加标题号
              this.tableData[i].index = i + 1
              if (this.tableData[i].auditType === -1 && this.tableData[i].auditMustTime === null) {
                this.tableData[i].auditType = '新建'
              } else if (this.tableData[i].auditType === -1 && this.tableData[i].auditMustTime !== null) {
                this.tableData[i].auditType = '修改'
              } else if (this.tableData[i].auditType === 0) {
                this.tableData[i].auditType = '初评'
              } else if (this.tableData[i].auditType === 1) {
                this.tableData[i].auditType = '单元审核'
              } else if (this.tableData[i].auditType === 2) {
                this.tableData[i].auditType = '部门审核'
              } else if (this.tableData[i].auditType === 3) {
                this.tableData[i].auditType = '处理意见'
              } else if (this.tableData[i].auditType === 4) {
                this.tableData[i].auditType = '处理核准'
              } else if (this.tableData[i].auditType === 5) {
                this.tableData[i].auditType = '结束'
              }
              this.auditUser = this.tableData[i].auditUser
            }
          } else {
              this.$message({
                type: 'error',
                message: '获取失败：' + result.data.message
              })
            }
        })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '获取失败：' + error
            })
          })
      },
      historyTiggleAction () {
        if (this.$refs.historyRef.className === 'icon-arrow-down') {
          this.$refs.historyRef.className = 'icon-arrow-up'
        } else {
          this.$refs.historyRef.className = 'icon-arrow-down'
        }
      },
      // 标题模板
      selectAction () {
        if (this.titles.length > 0) {
          for (var i = 0; i < this.titles.length; i++) {
            if (this.select === this.titles[i].dictCode) {
              this.preserveData.title = this.titles[i].dictName
            }
          }
        }
      }
    },
    created () {
      this.upDateCompile()
      this.safetyId = this.$route.query.safetyId
      this.name = this.$route.query.name
      if (this.name === 'handle') {
        this.getHistoryActions()
      }
      this.taskInfo = this.$route.query.taskInfo ? this.$route.query.taskInfo : {}
    },
    mounted () {
      let user = this.$store.state.user
      // 部门ID和部门名称
      this.preserveData.deptName = user.deptName
      // 获取到所有下拉框的内容
      getAllDataAction().then(result => {
        this.titles = result.INFOR_REPORT_Title ?  result.INFOR_REPORT_Title.dicts : []
        this.groundList = result
      })
      // 监听data变化，如果触发多次则必须保存
      this.$watch('preserveData', () => {
        this.whetherCount++
        // console.log(this.whetherCount)
        // 判断修改的次数，如果大于2的话将状态改为true
        if (this.whetherCount >= 2) {
          this.saveStatus = false
        } else if (this.whetherCount < 2) {
          this.saveStatus = true
        }
      }, {
        deep: true
      })
    }
  }
</script>
<style scoped>
.el-select{
  width: 100%;
}
.el-form-item{
  margin-bottom: 0;
}
</style>