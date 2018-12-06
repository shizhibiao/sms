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
      <b-collapse id="collapse1" :visible='true'>
      <b-card-body>
        <el-form ref="form"
                 label-width="110px"
                 inline-message
                 status-icon
                 size="medium"
                 :rules="rules"
                 :model="notice">
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="立项部门">
                <span>{{user.deptName}}</span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="立项人">
                <span>{{user.userName}}</span>
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
                           :disabled="this.$route.params.id == 2 || this.$route.params.id == 1"
                           :clearable='true'>
                  <el-option v-for="item in monitoringList"
                             :key="item.dictId"
                             :label="item.dictName"
                             :value="item.dictId"
                             >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="项目名称"
                            prop="entryName">
                <el-input v-model="notice.entryName"
                          placeholder=""
                          :disabled="this.$route.params.id == 2 || this.$route.params.id == 1"
                          ></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="监察结束日期"
                            prop="endDate">
                <el-date-picker v-model="notice.endDate"
                                type="date"
                                style="width:100%;"
                                :disabled="this.$route.params.id == 2 || this.$route.params.id == 1"
                                placeholder="选择日期"
                                >
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
                           :disabled="this.$route.params.id == 2 || this.$route.params.id == 1"
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
                           collapse-tags
                           class='select'
                           v-model="submitDeptName"
                           :clearable='true'
                           :disabled="this.$route.params.id == 2 || this.$route.params.id == 1"
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
                           collapse-tags
                           value-key="deptName"
                           class='select'
                           :clearable='true'
                           :disabled="this.$route.params.id == 2 || this.$route.params.id == 1"
                           >
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
                      :disabled="this.$route.params.id == 2 || this.$route.params.id == 1"
                      placeholder="请输入内容"
                      v-model="notice.textarea"
                      >
            </el-input>
          </el-form-item>
          </div>
          </div>
        </el-form>
      </b-card-body>
      </b-collapse>
    </b-card>

    <security-notice-adjunct ref='adjunct' :safetyId="this.$route.query.id"
    :tableName="tableName">
    </security-notice-adjunct>
    <audit-plan v-if="this.status == 1"></audit-plan>
    <headman-plan v-if="this.status == 2"></headman-plan>
    <flow-record v-if="this.status >= 0"
                 :id="this.modifId"
                 :taskId="this.info"></flow-record>
    <opinion ref="opinion"></opinion>
    <b-card no-body>
      <b-card-body>
        <div class="text-center">
          <el-button type="success"
                     @click="saveDataAction"
                     v-if="this.$route.params.id != 2 && this.status != 0">保存</el-button>
          <el-button v-if="this.$route.params.id ==1 || this.$route.params.id == -1"
                     :disabled="dis"
                     type="primary"
                     @click="sendAction">发送</el-button>
          <el-button 
                     @click="backAction">返回</el-button>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>


<script>
import Vuex from 'vuex'
import axios from 'axios'
// conditionGetDepartmentList
import { saveSafetyNoticeData2, getMonitoringType,
  conditionGetDepartmentList, getNotificationLevel,
  conditionGetDepartmentList2,
  StartupProcess, SendTask} from '../../services/safety_supervision'
import { formatDate } from '../../utils'
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
import FlowRecord from './FlowRecord.vue'
import ProjectAudit from './ProjectAudit.vue'
import AuditPlan from './AuditPlan.vue'
import HeadmanPlan from './HeadmanPlan.vue'
import Opinion from './Opinion.vue'
export default {
  components: {
    SecurityNoticeAdjunct,
    FlowRecord,
    ProjectAudit,
    AuditPlan,
    HeadmanPlan,
    Opinion
  },
  data () {
    return {
      // 禁用
      dis: true,
      // 附件表名
      tableName: 't_safety_monitor',
      // 查看状态
      view: true,
      info: null,
      // 流程Id
      flowId: '',
      // 流程状态
      status: -1,
      children: null,
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
      // 临时保存
      addDate: [],
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
        establishmenDepartment: ''
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
    })
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
      // 修改数据
      // console.log(this.$route.params.id)
      if (this.$route.params.id !== '-1') {
        console.log(this.$route.query.id)
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
            console.log(data)
            this.notice.dateTime = formatDate(new Date(data.projectStartDate), 'yyyy-MM-dd')
            this.notice.monitoringType = Number(data.monitorType)
            this.notice.entryName = data.projectName
            this.notice.endDate = formatDate(new Date(data.projectEndDate), 'yyyy-MM-dd')
            this.notice.monitoringGrade = data.projectLevel.toString()
            let arr = data.departmentDOs.map((item, index) => {
              return {
                deptId: JSON.parse(data.monitorDeptId)[index],
                deptName: item.deptName
              }
            })
            // console.log(arr)
            if (data.projectLevel === '1') {
              this.submitDeptName = arr
            } else if (data.projectLevel === '2') {
              this.notice.submitDeptId = arr
            }
            this.notice.textarea = data.projectContent
            this.status = data.procStatus
            if (this.status === 0) {
              this.dis = false
            }
          })
      }
    },
    // 返回按钮
    backAction () {
      // let url = '/monitor/list'
      this.$router.back()
    },
    // 保存按钮事件
    saveDataAction () {
      let notice = this.notice
      notice.establishmenDepartment = this.user.deptName
      if (notice.monitoringType && notice.monitoringGrade && notice.entryName && notice.endDate && notice.textarea && (this.submitDeptName.length > 0 || notice.submitDeptId.length > 0)) {
        if (this.$route.params.id === '-1') {
          // 临时保存
          this.addDate.push(notice)
          let addData = JSON.stringify(this.addDate)
          localStorage.setItem('add', addData)
          // 判断等级
          if (this.notice.monitoringGrade === '1') {
            console.log(this.submitDeptName)
            this.submitDeptName.map(item => {
              this.departmentDOs.push({
                deptId: item.deptId,
                deptName: item.deptName
              })
            })
          } else if (this.notice.monitoringGrade === '2') {
            notice.submitDeptId.map(item => {
              this.departmentDOs.push({
                deptId: item.deptId,
                deptName: item.deptName
              })
            })
          }
          console.log(this.$refs.adjunct.fileFormList)
          // console.log(notice.monitoringGrade)
          // 保存新增信息
          saveSafetyNoticeData2({
            attachmentDOs: this.$refs.adjunct.fileFormList,
            departmentDOs: this.departmentDOs,
            deptId: this.user.deptId,
            deptName: this.user.deptName,
            userId: this.user.userId,
            projectStartDate: notice.dateTime,
            projectLevel: notice.monitoringGrade,
            projectName: notice.entryName,
            projectEndDate: notice.endDate,
            monitorType: notice.monitoringType,
            projectContent: notice.textarea,
            procStatus: -1 // 新建状态
          }).then(result => {
            console.log(result)
            if (result.data.error === 0) {
              this.$router.back()
              this.$message({
                message: '保存成功',
                onClose: () => {
                  Object.keys(this.notice).map(item => {
                    if (item === 'submitDeptId') {
                      this.notice[item] = []
                    }
                    if (item !== 'dateTime' && item !== 'submitDeptId') {
                      this.notice[item] = ''
                    }
                  })
                  this.submitDeptName = []
                  this.departmentDOs = []
                }
              })
            } else {
              this.$message.error(result.data.message)
            }
          })
        } else if (this.$route.params.id === '0') {
          // 修改事件
          if (this.notice.monitoringGrade === '1') {
            console.log(this.submitDeptName)
            this.submitDeptName.map(item => {
              this.departmentDOs.push({
                deptId: item.deptId,
                deptName: item.deptName
              })
            })
          } else if (this.notice.monitoringGrade === '2') {
            notice.submitDeptId.map(item => {
              this.departmentDOs.push({
                deptId: item.deptId,
                deptName: item.deptName
              })
            })
          }
          axios.post('/api/securitymonitor/updateSafetyMonitor', {
            departmentDOs: this.departmentDOs,
            deptId: this.user.deptId,
            deptName: this.user.deptName,
            userId: this.user.userId,
            projectStartDate: notice.dateTime,
            projectLevel: notice.monitoringGrade,
            projectName: notice.entryName,
            projectEndDate: notice.endDate,
            monitorType: notice.monitoringType,
            projectContent: notice.textarea,
            procStatus: -1, // 新建状态
            id: this.modifId
          })
            .then(result => {
              if (result.data.data) {
                this.$router.back()
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
              } else {
                this.$message.error('保存失败')
              }
            })
            .catch(() => {
              this.$message.error('网络错误或服务器错误')
            })
        }
      } else {
        this.$message.error('请填写必填项')
      }
    },
    // 发送按钮
    sendAction () {
      if (this.status === -1) {
        StartupProcess(this.modifId).then(res => {
          if (res.data.data) {
            this.$router.back()
            this.$message({
              type: 'success',
              message: '发送成功'
            })
          } else {
            this.$message.error('发送失败')
          }
        })
          .catch(() => {
            this.$message.error('网络错误或服务器错误')
          })
      } else {
        this.$refs.opinion.show()
        let data = {
          auditDO: {
            monitorId: this.info.id,
            auditType: this.info.procStatus,
            submitUser: this.user.userId,
            auditResult: 1,
            auditComment: this.$refs.proaudit.form.textarea
          },
          taskInfo: this.info.taskInfo
        }
        SendTask(this.user.userId, data).then(res => {
          if (res.data.data) {
            this.$router.back()
            this.$message({
              type: 'success',
              message: '发送成功'
            })
          } else {
            this.$message.error('发送失败')
          }
        })
          .catch(() => {
            this.$message.error('网络错误或服务器错误')
          })
      }
    }
  },
  created () {
    this.department = this.user.deptName
  },
  mounted () {
    this.children = this.$refs.body.parentNode.parentNode.firstChild.children[2].children[0]
    if (this.$route.params.id === '-1') {
      this.children.innerText = '新建'
    } else if (this.$route.params.id === '0') {
      this.children.innerText = '编辑'
    } else if (this.$route.params.id === '1') {
      this.children.innerText = '发送'
    } else if (this.$route.params.id === '2') {
      this.children.innerText = '查看'
    }
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
