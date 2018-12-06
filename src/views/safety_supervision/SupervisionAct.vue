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
                             :uploadFile='true'
                             >
    </security-notice-adjunct>
    <audit-plan v-if="this.status == 1"
                @dis="disAction"
                :deptId="deptId"
                ref="adplan"></audit-plan>
    <headman-plan v-if="subProcStatus == 1" :saveHan="saveHan" ref="headman" @dis="disAction" :manId="modifId" :info="info"></headman-plan> 
    <supervision-filling ref="fill" v-if="subProcStatus == 2" :manId="modifId" @dis="disAction" @billId="billAction"></supervision-filling>
    <examine v-if="subProcStatus == 3" ref="exa" :manId="modifId" @dis="disAction"></examine>
    <confirm v-if="subProcStatus == 4" :manId="modifId" ref="confirm" @dis="disAction"></confirm>
    <mon-result v-if="this.status == 3 && taskName == '监察审查结果'" ref="monResult" :revResult="revResult" :departmentDOs="departmentDOs2" @dis="disAction"></mon-result>
    <opinion ref="opinion"
             :tit="title"
             :cancelHide="status == 0 || subProcStatus == 4 ? true :false"
             @agreeAction="agreeAction"
             @rejectAction="cancelAction"></opinion>
    <b-card no-body>
      <b-card-body>
        <eSteps :pageNum="active"/>
        <!-- <el-steps :active="active" align-center>
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
          <el-button type="success"
                     @click="saveDataAction"
                     :disabled="saveBtn"
                     v-loading.fullscreen.lock="fullscreenLoading"
                     v-if="this.status != 0">保存</el-button>
          <el-button :disabled="dis"
                     type="primary"
                     v-loading.fullscreen.lock="fullscreenLoading2"
                     @click="sendAction">发送</el-button>
          <el-button @click="backAction">返回</el-button>
        </div>
      </b-card-body>
    </b-card>
    <flow-record v-if="this.status >= 0"
                 :id="this.modifId"
                 :status="taskName"   
                 :taskId="this.info.taskInfo"></flow-record>
  </div>
</template>


<script>
import Vuex from 'vuex'
import axios from 'axios'
// conditionGetDepartmentList
import { getMonitoringType,
  conditionGetDepartmentList, getNotificationLevel,
  conditionGetDepartmentList2,
  SendTask, saveMonitorTeamLeader,
  findSupervisionAuditPlan, saveMonitorBill, sendTaskChild,
  getRecord, updateItemResult, updateMonitorBillById, updateByIdForHandMan, updateMonitorDepartment, updateMonitorDepartmentByDeptId, updateSafetyMonitorById, findByIdForHandMan, updateByIdForHandManMain, saveBillSaveStatus, findMonitorBillLoad} from '../../services/safety_supervision'
import { formatDate } from '../../utils'
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
import FlowRecord from './FlowRecord.vue'
import ProjectAudit from './ProjectAudit.vue'
import AuditPlan from './AuditPlan.vue'
import HeadmanPlan from './HeadmanPlan.vue'
import Opinion from './Opinion.vue'
import SupervisionFilling from './SupervisionFilling.vue'
import Examine from './Examine.vue'
import Confirm from './Confirm.vue'
import MonResult from './MonResult.vue'
import eSteps from './eSteps.vue'
export default {
  components: {
    SecurityNoticeAdjunct,
    FlowRecord,
    ProjectAudit,
    AuditPlan,
    HeadmanPlan,
    Opinion,
    SupervisionFilling,
    Examine,
    Confirm,
    MonResult,
    eSteps
  },
  data () {
    return {
      billId: '',
      taskName: '',
      saveBtn: false,
      saveHan: false,
      // 监察审查结果
      revResult: {
        risk: '',
        safetyNotice: '',
        monitorResult: ''
      },
      handManUserId: null,
      // 子流程历史最后一条
      auditDOs: null,
      // 子流程历史id
      AuditId: null,
      // 被监察部门
      departmentDOs2: [],
      // 子流程状态
      subProcStatus: null,
      submitUrl: 'http://47.98.173.73:8080/file/upload',
      fullscreenLoading2: false,
      fullscreenLoading: false,
      // 审计计划
      deptId: [],
      title: null,
      // 禁用
      dis: true,
      // 附件表名
      tableName: 't_safety_monitor',
      info: {},
      // 流程Id
      flowId: '',
      // 流程状态
      status: -1,
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
          { required: true, message: '必填', trigger: 'blur' },
          { max: 30, message: '不得超过三十个字符', trigger: 'blur' }
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
      } else if (this.subProcStatus === 1) {
        return 3
      } else if (this.subProcStatus === 2) {
        return 4
      } else if (this.subProcStatus === 3) {
        return 5
      } else if (this.subProcStatus === 4) {
        return 6
      } else if (this.status == 3 && this.taskName == '监察审查结果') {
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
      if (this.status === 0) {
        this.title = '立项审核'
      }
    },
    deptId: {
      handler: function () {
        // this.dis = true
      },
      deep: true
    }
  },
  methods: {
    billAction (val) {
      this.billId = val
    },
    disAction () {
      this.dis = true
      this.saveBtn = false
    },
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
            },
            {
              fieldName: 'SubDeptId',
              value: this.user.deptId
            }
          ]
        }
        // console.log(form)
        // console.log(this.user.deptId)
        axios.post('/api/securitymonitor/findByParam', (this.user.userId, form))
          .then(res => {
            let data = res.data.data.content[0]
            // console.log(data)
            this.info = data
            this.taskName = data.taskInfo.taskName
            this.departmentDOs2 = data.departmentDOs
             let subProcStatus = this.departmentDOs2.filter(sub => {
              return sub.deptId === this.user.deptId
            })
            // 获取子流程状态
            this.subProcStatus = subProcStatus.length > 0 ? subProcStatus[0].status : null
            // console.log(this.subProcStatus)
            let querySave = {
              deptId: this.user.deptId,
              id: this.$route.query.id
            }
            // console.log(querySave)
            let data2 = {}
            findByIdForHandMan(querySave).then(res2 => {
                // console.log(res2)
                let id = this.info.id
                data2 = res2.data.data ? res2.data.data : {}
                this.handManUserId = data2.handManUserId ? data2.handManUserId : null
                let localname1 = '组长安排' + id + this.user.userId
                let localname3 = '组长审核' + id + this.user.userId
                let localname4 = '各部门确认' + id + this.user.userId
                if (data2.saveStatus === localname1 && this.subProcStatus === 1) {
                  this.dis = false
                  this.title = '组长安排'
                  this.saveHan = true
                }  else if (data2.saveStatus === localname3 && this.subProcStatus === 3) {
                  this.dis = false
                  this.title = '组长审核'
                } else if (data2.saveStatus === localname4 && this.subProcStatus === 4) {
                  this.dis = false
                  this.title = '各部门确认'
                }
              })
            if (this.subProcStatus == 2) {
              let localname2 = '表单填写' + this.$route.query.id + this.user.userId
              let saveQuery = {
                  monitorId: this.$route.query.id,
                  monitorDeptId: this.user.deptId,
                  status: 0
              }
              findMonitorBillLoad(saveQuery).then(res => {
                // console.log(res)
                let saveData = res.data.data
                saveData.forEach((item,index) => {
                  item.teamDOs.forEach(team => {
                    if (team.teamUserId == this.user.userId) {
                      if (item.saveStatus == localname2) {
                            this.dis = false
                            this.title = '工作执行'
                            return false
                      }
                    }
                  })
                })
              })
            }

            this.revResult = {
              risk: data.risk,
              safetyNotice: data.safetyNotice,
              monitorResult: data.monitorResult
            }
            // let subProcStatus = this.departmentDOs2.filter(sub => {
            //   return sub.deptId === this.user.deptId
            // })
            // // 获取子流程状态
            // this.subProcStatus = subProcStatus.length > 0 ? subProcStatus[0].status : null
            // console.log(this.subProcStatus)

            // 获取上一节点auditId
            getRecord(this.info.id, this.info.taskInfo.taskId).then(res => {
              // console.log(res.data.data.auditDOs)
              this.AuditId = res.data.data.auditDOs.filter(au => {
                return au.auditType === 2 && au.auditRole == this.user.deptId //eslint-disable-line
              })[0] || {}
              if (this.AuditId.children) {
                this.auditDOs = this.AuditId.children.filter(aud => {
                  return aud.auditComment === '子子流程-工作执行-虚拟'
                })[0] || ''
              } else {
                this.auditDOs = ''
              }
              // console.log(this.AuditId.auditId, this.auditDOs.auditId)
            })
            let plan = false
            let id = this.info.id
            let localname0 = '审计计划' + id + this.user.userId
            let localname5 = '监察审查结果' + id + this.user.userId
            if (data.procStatus == 0){
              this.title = '立项审核'
            }
            // 更新监察审计计划
            if (data.saveStatus === localname0 && data.procStatus === 1) {
              this.dis = false
              this.title = '监察审计计划'
              plan = true
              findSupervisionAuditPlan(this.modifId).then(res => {
                let data = res.data.data
                // console.log(data)
                let list = data.map(item => {
                  let id = item.handManId.split(',')
                  let name = item.handManName.split(',')
                  let leader = id.map((d, i) => {
                    return {
                      userId: parseInt(d),
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
            }else if (data.saveStatus === localname5 && data.procStatus === 3) {
              this.dis = false
              this.title = '监察审查结果'
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
            // console.log(arr)
            if (plan) {
              // this.deptId = list
            } else {
              this.deptId = arr
            }
            if (data.projectLevel === '1') {
              this.submitDeptName = arr
            } else if (data.projectLevel === '2') {
              this.notice.submitDeptId = arr
            }
            this.notice.textarea = data.projectContent
            this.status = data.procStatus
            // 发送按钮状态
            if (this.status === 0) {
              this.dis = false
              this.title = '立项审核'
            } else if (this.status === 1) {
              this.title = '审计计划'
            }
          })
      }
    },
    beal (data) {
      if (data) {
        return true
      } else {
        return false
      }
    },
    // 返回按钮
    backAction () {
      // let url = '/monitor/list'
      this.$router.back()
      // console.log(this.AuditId)
    },
    // 保存按钮事件
    saveDataAction () {
      this.fullscreenLoading = true
      let id = this.info.id
      let count = true
      if (this.status === 1) {
        // 保存监察审计计划
        let list = this.$refs.adplan.deptId
        // console.log(list)
        list.map(item => {
          if (!item.leader.length) {
            count = false
          }
        })
        if (count) {
          let arr = this.deptId.map((item, index) => {
            return {
              monitorId: this.modifId,
              deptId: item.deptId,
              sysUserVOs: list[index].leader.map(i => {
                return {
                  userId: i.userId,
                  userName: i.userName
                }
              })
            }
          })
          // console.log(arr)
          saveMonitorTeamLeader(arr).then(res => {
            // console.log(res)
            if (res.data.data) {
              this.fullscreenLoading = false
              let localname = '审计计划' + id + this.user.userId
              let hanman = {
                    id: this.modifId,
                    saveStatus: localname
                  }
                  // console.log(hanman)
              updateByIdForHandManMain(hanman).then(res => {
                console.log(res)
              })
              this.dis = false
              this.saveBtn = true
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            } else {
              this.fullscreenLoading = false
              this.$message.error('保存失败' + res.data.message)
            }
          })
            .catch(() => {
              this.$message.error('网络错误或服务器错误')
              this.fullscreenLoading = false
            })
        } else {
          this.fullscreenLoading = false
          this.$message.error('请选择组长')
        } // 保存组长安排
      } else if (this.subProcStatus === 1) {
        let judge = true
        let data = this.$refs.headman.saveAction()
        data.map(item => {
          item.monitorId = this.modifId
          item.detailDOs = item.tableData
          if (!item.tableData.length) {
            judge = false
          }
        })
        if (judge) {
          // console.log(data)
          saveMonitorBill(data).then(res => {
            // console.log(res)
            if (res.data.data) {
              this.fullscreenLoading = false
              let localname = '组长安排' + id + this.user.userId
              let hanman = {
                    id: this.modifId,
                    saveStatus: localname,
                    deptId: this.user.deptId,
                    handManUserId: this.user.userId
                  }
                  // console.log(hanman)
              updateByIdForHandMan(hanman).then(res => {
                console.log(res)
              })
              this.dis = false
              this.saveBtn = true
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.title = '组长安排'
            } else {
              if (data.length > 0) {
                this.$message.error('保存失败' + res.data.message)
                this.fullscreenLoading = false
              } else {
                this.$message.error('请创建任务')
                this.fullscreenLoading = false
              }
            }
          })
            .catch(() => {
              this.$message.error('网络错误或服务器错误')
              this.fullscreenLoading = false
            })
        } else {
          this.$message.error('请载入检查单')
          this.fullscreenLoading = false
        } // 保存工作执行
      } else if (this.subProcStatus === 2) {
        let tab = this.$refs.fill.getTab()
        tab.map(item => {
          if (!item.itemResult) {
            count = false
          }
        })
        if (count) {
          updateItemResult(tab).then(res => {
            if (res.data.data) {
              this.fullscreenLoading = false
              let localname = '表单填写' + id + this.user.userId
               let hanman = {
                    billId: this.billId,
                    saveStatus: localname
                  }
                  // console.log(hanman)
              saveBillSaveStatus(hanman).then(res => {
                console.log(res)
              })
              this.dis = false
              this.saveBtn = true
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.title = '工作执行'
            } else {
              this.$message.error('保存失败' + res.data.message)
              this.fullscreenLoading = false
            }
          })
            .catch(() => {
              this.$message.error('网络错误或服务器错误')
              this.fullscreenLoading = false
            })
        } else {
          this.$message.error('请选择结果')
          this.fullscreenLoading = false
        } // 保存组长审核
      } else if (this.subProcStatus === 3) {
        let list = this.$refs.exa.getData()
        let exName = this.$refs.exa.getName()
        let billId = list.filter(l => {
          return l.value === exName.billName
        })
        // alert(list, exName, billId[0].id, exName.textarea)
        let params2 = {
          billId: billId[0].id,
          auditContent: exName.textarea
        }
        updateMonitorBillById(params2).then(res => {
          if (res.data.data) {
            this.fullscreenLoading = false
            let localname = '组长审核' + id + this.user.userId
            let hanman = {
                    id: this.modifId,
                    saveStatus: localname,
                    deptId: this.user.deptId
                  }
              updateByIdForHandMan(hanman).then(res => {
                console.log(res)
              })
            this.dis = false
            this.saveBtn = true
            this.title = '组长审核'
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          } else {
            this.$message.error('保存失败' + res.data.message)
            this.fullscreenLoading = false
          }
        })
          .catch(() => {
            this.$message.error('网络错误或服务器错误')
            this.fullscreenLoading = false
          }) // 保存各部门确认
      } else if (this.subProcStatus === 4) {
        let Opinion = {
          monitorId: this.modifId,
          confirmContent: this.$refs.confirm.getInt(),
          deptId: this.user.deptId
        }
        updateMonitorDepartmentByDeptId(Opinion).then(res => {
          if (res.data.data) {
            this.fullscreenLoading = false
            let localname = '各部门确认' + id + this.user.userId
            let hanman = {
                    id: this.modifId,
                    saveStatus: localname,
                    deptId: this.user.deptId
                  }
              updateByIdForHandMan(hanman).then(res => {
                console.log(res)
              })
            this.dis = false
            this.saveBtn = true
            this.title = '各部门确认'
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          } else {
            this.$message.error('保存失败' + res.data.message)
            this.fullscreenLoading = false
          }
        })
          .catch(() => {
            this.$message.error('网络错误或服务器错误')
            this.fullscreenLoading = false
          }) // 保存监察结果 123444
      } else if (this.status === 3 && this.taskName == '监察审查结果') {  //this.subProcStatus === 5
        let monResult = this.$refs.monResult.getForms()
        let monData = {
          id: this.modifId,
          monitorResult: monResult.textarea,
          risk: Number(monResult.radio2),
          safetyNotice: Number(monResult.radio)
        }
        // console.log(monData)
        updateSafetyMonitorById(monData).then(res => {
          // console.log(res)
          if (res.data.data) {
            this.fullscreenLoading = false
            let localname = '监察审查结果' + id + this.user.userId
             let hanman = {
                    id: this.modifId,
                    saveStatus: localname
                  }
              updateByIdForHandManMain(hanman).then(res => {
                console.log(res)
              })
            this.dis = false
            this.saveBtn = true
            this.title = '监察审查结果'
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          } else {
            this.$message.error('保存失败' + res.data.message)
            this.fullscreenLoading = false
          }
        })
          .catch(() => {
            this.$message.error('网络错误或服务器错误')
            this.fullscreenLoading = false
          })
      }
    },
    // 发送流程
    sendFlow (form, result) {
      this.fullscreenLoading2 = true
      let arr = []
      let count = true
      if (this.status === 1) {
        let list = this.$refs.adplan.deptId
        // console.log(list)
        list.map(item => {
          if (!item.leader.length) {
            count = false
          }
        })
        if (count) {
          arr = this.deptId.map((item, index) => {
            return {
              monitorId: this.modifId,
              deptId: item.deptId,
              sysUserVOs: list[index].leader.map(i => {
                return {
                  userId: i.userId,
                  userName: i.userName
                }
              })
            }
          })
        } else {
          this.fullscreenLoading2 = false
          this.$message.error('请选择组长')
        }
      }
      this.$refs.adjunct.fileFormList.map(f => {
        this.$refs.adjunct.fileInfo.push(f)
      })
      let data = {
        auditDO: {
          monitorId: this.info.id,
          auditType: this.status, // this.subProcStatus === 4 ||=== 3 ? this.info.procStatus : this.info.procStatus - 1
          submitUser: this.user.userId,
          auditResult: result,
          auditComment: form.advise
        },
        taskInfo: this.info.taskInfo,
        deptIdVOs: arr,
        monitorDO: {
          attachmentDOs: this.$refs.adjunct.fileInfo,
          risk: this.status == 3 && this.taskName == '监察审查结果' ? Number(this.$refs.monResult.getForms().radio2) : false,  // 11111
          safetyNotice: this.status == 3 && this.taskName == '监察审查结果' ? Number(this.$refs.monResult.getForms().radio) : false
        }
      }
      // console.log(data)
      let moid = this.departmentDOs2.filter(item => {
        return this.user.deptId === item.deptId
      })
      // console.log(moid)
      // console.log(this.AuditId)
      let data2 = {
        deptAuditDO: {
          auditComment: form.advise,
          auditResult: result,
          auditType: this.subProcStatus,
          monDeptId: moid.length > 0 ? moid[0].monDeptId : '',
          parentAuditId: this.AuditId ? this.AuditId.auditId : '',
          parentId: this.subProcStatus === 2 ? this.auditDOs.auditId : '',
          submitUser: this.user.userId
        },
        handManUserId: this.subProcStatus === 2 ? this.handManUserId : '',
        taskInfo: this.info.taskInfo,
        monitorDO: {
          id: this.modifId,
          procStatus: this.status,
          deptId: this.user.deptId
        }
      }
      // console.log(data)
      if (count) {                // this.status === 3 && this.subProcStatus == 5
        if (this.status < 2 || (this.status === 3 && this.taskName == '监察审查结果')) {
          SendTask(this.user.userId, data).then(res => {
            // console.log(res)
            if (res.data.data) {
              this.fullscreenLoading2 = false
              // console.log(res.data.data)
              this.$router.back()
              this.$message({
                type: 'success',
                message: '发送成功'
              })
            } else {
              this.fullscreenLoading2 = false
              this.$message.error('发送失败' + res.data.message)
            }
          })
            .catch(() => {
              this.fullscreenLoading2 = false
              this.$message.error('网络错误或服务器错误')
            })
        } else if (this.status === 2 || (this.status === 3 && this.taskName != '监察审查结果')) {
          // console.log(data2)
          sendTaskChild(this.user.userId, data2).then(res => {
            // console.log(res)
            if (res.data.data) {
              // if (this.subProcStatus === 1) {
              //   let hanman = {
              //         handManUserId: this.user.userId,
              //         id: this.modifId,
              //         deptId: this.user.deptId
              //       }
              //   updateByIdForHandMan(hanman).then(res => {
              //     console.log(res)
              //   })
              // }
              this.fullscreenLoading2 = false
              // console.log(res.data.data)
              this.$router.back()
              this.$message({
                type: 'success',
                message: '发送成功'
              })
              if (this.subProcStatus === 3) {
                updateMonitorDepartment(this.modifId, this.user.deptId).then(res => {
                  console.log(res)
                })
              }
            } else {
              this.fullscreenLoading2 = false
              this.$message.error('发送失败' + res.data.message)
            }
          })
            .catch(() => {
              this.$message.error('网络错误或服务器错误')
              this.fullscreenLoading2 = false
            })
        }
      } else {
        this.fullscreenLoading2 = false
        this.$message.error('发送失败')
      }
    },
    // 发送按钮
    sendAction () {
      this.$refs.opinion.show()
    },
    // 同意
    agreeAction (form) {
      this.sendFlow(form, 1)
      this.$refs.opinion.hide()
    },
    // 驳回
    cancelAction (form) {
      this.sendFlow(form, 0)
      this.$refs.opinion.hide()
    }
  },
  created () {
    this.department = this.user.deptName
  },
  mounted () {
    // console.log(this.$route.params.id)
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
  }
}
</script>

<style>
</style>
