<template>
  <div class="animated fadeIn"
       id="safety_supervisionAdd"
       ref="body">
    <b-card no-body>
      <div slot="header">
        基本信息
        <div class="card-actions">
          <b-btn class="btn btn-minimize"
                 v-b-toggle.collapse1>
            <i class="icon-arrow-up"></i>
          </b-btn>
        </div>
      </div>
      <b-collapse id="collapse1"
                  :visible='true'>
        <b-card-body>
          <el-form ref="form"
                   label-width="110px"
                   inline-message
                   label-position="left"
                   size="medium"
                   :rules="rules"
                   :model="notice">
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="立项部门">
                  <span>{{notice.deptName}}</span>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="立项人">
                  <span>{{notice.userName}}</span>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="立项日期">
                  <span>{{notice.dateTime}}</span>
                </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="监察审计类型"
                              prop="monitoringType">
                  <el-select v-model="notice.monitoringType"
                             class='select'
                             disabled
                             :clearable='true'>
                    <el-option v-for="item in monitoringList"
                               :key="item.dictId"
                               :label="item.dictName"
                               :value="item.dictId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="项目名称"
                              prop="entryName">
                  <el-input v-model="notice.entryName"
                            placeholder=""
                            disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="监察结束日期"
                              prop="endDate">
                  <el-date-picker v-model="notice.endDate"
                                  type="date"
                                  style="width:100%;"
                                  disabled
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="监察审计等级"
                              prop="monitoringGrade">
                  <el-select v-model="notice.monitoringGrade"
                             class='select'
                             disabled
                             :clearable='true'>
                    <el-option v-for="item in leaveList"
                               :key="item.dictId"
                               :label="item.dictName"
                               :value="item.dictCode"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="被监察部门"
                              prop="sDepartment"
                              v-if="notice.monitoringGrade != 2">
                  <el-select value-key="deptName"
                             multiple
                             class='select'
                             v-model="submitDeptName"
                             :clearable='true'
                             disabled
                             ref="cascader">
                    <el-option v-for='item in submitDeptNameList'
                               :label="item.deptName"
                               :value="item"
                               :key='item.deptId'></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="被监察单元"
                              prop="sUnit"
                              v-if="notice.monitoringGrade == '2'">
                  <el-select v-model="notice.submitDeptId"
                             multiple
                             value-key="deptName"
                             class='select'
                             :clearable='true'
                             disabled>
                    <el-option v-for='item in departmentlist'
                               :label="item.deptName"
                               :value="item"
                               :key='item.deptId'></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-8 col-md-6 col-sm-12">
                <el-form-item label="立项概述"
                              prop="textarea">
                  <el-input type="textarea"
                            :rows="4"
                            style="width:100%;"
                            disabled
                            placeholder="请输入内容"
                            v-model="notice.textarea">
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </b-card-body>
      </b-collapse>
    </b-card>

    <security-notice-adjunct ref='adjunct'
                             :safetyId="this.$route.query.id"
                             :tableName="tableName"
                             :uploadFile='false'
                             :flag="2">
    </security-notice-adjunct>
    <!-- <audit-plan 
                :dis="true"
                :deptId="deptId"
                ref="adplan"></audit-plan>
     <headman-plan  ref="headman" :info="info" :look="true" :manId="modifId"></headman-plan> 
    <supervision-filling ref="fill"  :manId="modifId" ></supervision-filling>
    <examine  ref="exa" :manId="modifId" ></examine>
    <confirm  :manId="modifId" ref="confirm"></confirm>
    <mon-result :revResult="revResult" :departmentDOs="departmentDOs2"></mon-result> -->
    <look-audit />
    <look-headman :depmentlist="departmentDOs2"
                  :operator="operator2"
                  :status="status2" />
    <look-fill :depmentlist="departmentDOs2" />
    <look-examine :depmentlist="departmentDOs2" />
    <look-confirm :depmentlist="departmentDOs2" />
    <look-mon-result :revResult="revResult"
                     :departmentDOs="departmentDOs2"
                     :status="status" />
    <flow-record ref="flow"
                 :id="modifId"
                 :taskId="info.taskInfo"
                 :look="true"></flow-record>
    <b-card no-body>
      <b-card-body>
        <eSteps :pageNum="-1"/>
        <!-- <el-steps :active="-1"
                  align-center>
          <el-step title="新建"></el-step>
          <el-step title="立项审批">
            <span slot="description">公司级：安技部-部门管理团队<br></span>
            <span slot="description">部门级：部门管理团队(非安技部)</span>
          </el-step>
          <el-step title="监察审计计划">
            <span slot="description">公司级：安技部-安全管理经理<br></span>
            <span slot="description">部门级：SMS对接经理</span>
          </el-step>
          <el-step title="组长安排"
                   description="受理的组长"></el-step>
          <el-step title="表单填写"
                   description="受理的组员"></el-step>
          <el-step title="组长审核"
                   description="受理的组长"></el-step>
          <el-step title="各部门确认">
            <span slot="description">公司级：部门管理团队(非安技部)<br></span>
            <span slot="description">部门级：单元经理</span>
          </el-step>
          <el-step title="监察审查结果">
            <span slot="description">公司级：安技部-部门管理团队<br></span>
            <span slot="description">部门级：部门管理团队(非安技部)</span>
          </el-step>
          <el-step title="结束"></el-step>
        </el-steps> -->
        <div class="text-center">
          <el-button @click="backAction">返回</el-button>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>


<script>
import Vuex from 'vuex'
import axios from 'axios'
// conditionGetDepartmentList
import {  getMonitoringType,
  conditionGetDepartmentList, getNotificationLevel,
  conditionGetDepartmentList2, findSupervisionAuditPlan} from '../../services/safety_supervision'
import { formatDate } from '../../utils'
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
import FlowRecord from './FlowRecord.vue'
import ProjectAudit from './ProjectAudit.vue'
import AuditPlan from './AuditPlan.vue'
import HeadmanPlan from './HeadmanPlan.vue'
import SupervisionFilling from './SupervisionFilling.vue'
import Examine from './Examine.vue'
import Confirm from './Confirm.vue'
import MonResult from './MonResult.vue'
import LookAudit from './LookAudit.vue'
import LookHeadman from './LookHeadman.vue'
import LookFill from './LookFill.vue'
import LookExamine from './LookExamine.vue'
import LookConfirm from './LookConfirm.vue'
import LookMonResult from './LookMonResult.vue'
import eSteps from './eSteps.vue'
export default {
  components: {
    SecurityNoticeAdjunct,
    FlowRecord,
    ProjectAudit,
    AuditPlan,
    HeadmanPlan,
    SupervisionFilling,
    Examine,
    Confirm,
    MonResult,
    LookAudit,
    LookHeadman,
    LookFill,
    LookExamine,
    LookConfirm,
    LookMonResult,
    eSteps
  },
  data () {
    return {
      status2: {
        status: '',
        subProcStatus: ''
      },
      operator: '',
      operator2: '',
      departmentDOs2: [],
      revResult: {
        risk: '',
        safetyNotice: '',
        monitorResult: ''
      },
      subProcStatus: null,
      submitUrl: 'http://192.168.17.139:9090/file/upload',
      deptId: [],
      // 附件表名
      tableName: 't_safety_monitor',
      // 查看状态
      info: {},
      // 流程Id
      flowId: '',
      // 流程状态
      status: -1,
      // 信息ID
      modifId: null,
      // 新增被监察部门
      departmentDOs: [],
      // 通知等级
      leaveList: [],
      // 所有监察类型
      monitoringList: [],
      // 部门单元
      departmentlist: [],
      // 选中部门对象
      submitDeptName: [],
      // 部门列表
      submitDeptNameList: [],
      // 表单数据
      notice: {
        // 选中监察类型
        monitoringType: '',
        // 选中监察等级
        monitoringGrade: '',
        // 选中部门对象
        supervisedDepartment: '',
        // 项目名称
        entryName: '',
        // 立项概述
        textarea: '',
        // 立项日期
        dateTime: formatDate(new Date(), 'yyyy-MM-dd'),
        // 结束日期
        endDate: '',
        // 被监察单元对象
        submitDeptId: [],
        establishmenDepartment: '',
        userName: '',
        deptName: ''
      },
      rules: {
        monitoringType: [
          { required: true, message: '请选择审计类型', trigger: 'change' }
        ],
        entryName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        endDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        monitoringGrade: [
          { required: true, message: '请选择审计等级', trigger: 'change' }
        ],
        textarea: [
          { required: true, message: '请填写立项概述', trigger: 'blur' }
        ],
        sDepartment: [
          { required: true, message: '请选择被监察部门', trigger: 'required' }
        ],
        sUnit: [
          { required: true, message: '请选择被监察单元', trigger: 'required' }
        ]
      }
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    }),
    active () {
      if (this.status < 2) {
        return this.status + 1
      } else if (this.status === 2 && this.subProcStatus === 1) {
        return 3
      } else if (this.status === 2 && this.subProcStatus === 2) {
        return 4
      } else if (this.status === 2 && this.subProcStatus === 3) {
        return 5
      } else if (this.status === 2 && this.subProcStatus === 4) {
        return 6
      } else if (this.status === 3) {
        return 7
      }
    }
  },
  watch: {
    $route () {
      this.$forceUpdate()
      if (this.$route.query.status) {
        this.status = this.$route.query.status
      }
    }
  },
  methods: {
    modif () {
      // 获取基本数据
      // console.log(this.$route.params.id)
      if (this.$route.params.id !== '-1') {
        // console.log(this.$route.query.id)
        let query = this.$route.query
        this.modifId = query.id
        // console.log(query.id)
        let form = {
          orderby: '',
          pageNum: 0,
          pageSize: 1,
          queryItems: [
            {
              fieldName: 'id',
              value: query.id
            }
          ]
        }
        axios.post('/api/securitymonitor/findByParam', (this.user.userId, form))
          .then(res => {
            let data = res.data.data.content[0]
            this.info = data
            // console.log(this.info)
            let subProcStatus = data.departmentDOs.map(sub => {
              return sub.status
            })
            this.$sub.$on('anpai', (operator) => {
              this.operator2 = operator
            })
            // 获取子流程状态 Math.max.apply(null, a)
            this.subProcStatus = subProcStatus.length > 0 ? Math.max.apply(null, subProcStatus) : null
            // console.log(this.subProcStatus)
            this.departmentDOs2 = data.departmentDOs
            this.revResult = {
              risk: data.risk,
              safetyNotice: data.safetyNotice,
              monitorResult: data.monitorResult
            }
            let plan = false
            let id = this.info.id
            let localname0 = '审计计划' + id + this.user.userId
            if (data.procStatus >= 1) {
              plan = true
              findSupervisionAuditPlan(this.modifId).then(res => {
                let data = res.data.data
                // console.log(data)
                let list = data.map(item => {
                  let id = item.handManId.split(',')
                  let name = item.handManName.split(',')
                  let leader = id.map((d, i) => {
                    return {
                      userId: d,
                      userName: name[i]
                    }
                  })
                  return {
                    deptId: item.deptId,
                    deptName: item.deptName,
                    leader,
                    leaderList: []
                  }
                })
                // console.log(list)
                this.deptId = list
              })
            }
            // console.log(data)
            this.notice.userName = data.userName
            this.notice.deptName = data.deptName
            this.notice.dateTime = formatDate(new Date(data.projectStartDate), 'yyyy-MM-dd')
            this.notice.monitoringType = Number(data.monitorType)
            this.notice.entryName = data.projectName
            this.notice.endDate = new Date(formatDate(new Date(data.projectEndDate), 'yyyy-MM-dd'))
            this.notice.monitoringGrade = data.projectLevel.toString()
            let arr = data.departmentDOs.map((item, index) => {
              return {
                deptId: JSON.parse(data.monitorDeptId)[index],
                deptName: item.deptName,
                leader: [],
                leaderList: []
              }
            })
            if (plan) {
              // this.deptId = list
            } else {
              this.deptId = arr
            }
            // console.log(arr)
            if (data.projectLevel === '1') {
              this.submitDeptName = arr
            } else if (data.projectLevel === '2') {
              this.notice.submitDeptId = arr
            }
            this.notice.textarea = data.projectContent
            this.status = data.procStatus
            // console.log(this.status)
            this.status2 = {
              status: data.procStatus,
              subProcStatus: this.subProcStatus
            }
          })
      }
    },
    // 返回按钮
    backAction () {
      // let url = '/monitor/list'
      this.$router.back()
    }
  },
  created () {
    this.department = this.user.deptName
  },
  mounted () {
    // 获取监察类型
    getMonitoringType().then(result => {
      // console.log(result)
      this.monitoringList = result
    })
    // 获得通知等级
    getNotificationLevel().then(result => {
      // console.log(result)
      this.leaveList = result
    })
    // 获得部门单元
    conditionGetDepartmentList2(2).then(result => {
      // console.log(result)
      this.departmentlist = result
    })
    // 获取分好类的所有公司
    conditionGetDepartmentList(1).then(result => {
      // console.log(result)
      this.submitDeptNameList = result
    })
    // 修改数据
    this.modif()
    // console.log(this.user)
  }
}
</script>

<style>
</style>
