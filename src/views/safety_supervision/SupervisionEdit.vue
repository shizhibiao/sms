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
                   status-icon
                   size="medium"
                   :rules="rules"
                   :model="notice">
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="立项部门">
                  <span>{{status == -1 ? user.deptName : notice.deptName}}</span>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="立项人">
                  <span>{{status == -1 ? user.userName : notice.userName}}</span>
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
                             @change="typeAction"
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
                            @change="inAction"
                            placeholder=""></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="监察结束日期"
                              prop="endDate">
                  <el-date-picker v-model="notice.endDate"
                                  type="date"
                                  style="width:100%;"
                                  @change="dateAction"
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
                             @change="selAction"
                             class='select'
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
                             @change="mentAction"
                             v-model="submitDeptName"
                             :clearable='true'
                             ref="cascader">
                    <el-option v-for='item in submitDeptNameList'
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
                             @change="deptAction"
                             collapse-tags
                             value-key="deptId"
                             class='select'
                             :clearable='true'>
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
                            @change="in2Action"
                            style="width:100%;"
                            placeholder="请输入内容"
                            maxlength="500"
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
                             :uploadFile='true'>
    </security-notice-adjunct>
    <b-card no-body>
      <b-card-body>
        <eSteps :pageNum="0"/>
        <!-- <el-steps :active="0"
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
          <el-button type="success"
                     v-loading.fullscreen.lock="fullscreenLoading"
                     @click="saveDataAction"
                     :disabled="saveBtn">保存</el-button>
          <el-button v-if="this.$route.params.id == -1"
                     :disabled="dis"
                     v-loading.fullscreen.lock="fullscreenLoading2"
                     @click="sendAction"
                     type="primary">发送</el-button>
          <el-button @click="backAction">返回</el-button>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>


<script>
import Vuex from 'vuex'
import axios from 'axios'
import {  saveSafetyNoticeData2, getMonitoringType,
  conditionGetDepartmentList, getNotificationLevel,
  conditionGetDepartmentList2, StartupProcess, conditionGetDepartmentList3} from '../../services/safety_supervision'
import { formatDate } from '../../utils'
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
// '../../components/System/security_notice/index.js'
import eSteps from './eSteps.vue'
export default {
  components: {
    SecurityNoticeAdjunct,
    eSteps
  },
  data () {
    return {
      saveBtn: false,
      saveId: -1,
      dis: true,
      submitUrl: 'http://47.98.173.73:8080/file/upload',
      fullscreenLoading: false,
      fullscreenLoading2: false,
      // 附件表名
      tableName: 't_safety_monitor',
      // 查看状态
      info: null,
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
      // 临时保存
      addDate: [],
      notice: {
        // 选中监察类型
        monitoringType: 130,
        // 选中监察等级
        monitoringGrade: '1',
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
        // sDepartment: [
        //   { required: false, message: '请选择被监察部门', trigger: 'required' }
        // ],
        submitDeptId: [
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
    in2Action () {
      // this.dis = true
      // this.saveBtn = false
    },
    deptAction () {
      // this.dis = true
      // this.saveBtn = false
    },
    mentAction () {
      // this.dis = true
      // this.saveBtn = false
    },
    selAction () {
      // this.dis = true
      // this.saveBtn = false
    },
    dateAction () {
      // this.dis = true
      // this.saveBtn = false
    },
    inAction () {
      // this.dis = true
      // this.saveBtn = false
    },
    typeAction () {
      // this.dis = true
      // this.saveBtn = false
    },
    sendAction () {
      this.fullscreenLoading2 = true
      StartupProcess(this.$route.query.id || this.saveId).then(res => {
        // console.log(res)
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: '发送成功'
          })
          this.fullscreenLoading2 = false
          this.$router.back()
        } else {
          this.fullscreenLoading2 = false
          this.$message.error('发送失败' + res.data.message)
        }
      })
        .catch(() => {
          this.fullscreenLoading2 = false
          this.$message.error('网络错误或服务器错误')
        })
    },
    modif () {
      // 修改数据
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
        // 获取基本信息
        axios.post('/api/securitymonitor/findByParam', (this.user.userId, form))
          .then(res => {
            let data = res.data.data.content[0]
            this.info = data
            // console.log(data,data.projectEndDate)
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
      this.fullscreenLoading = true
      let notice = this.notice
      notice.establishmenDepartment = this.user.deptName
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (notice.monitoringType && notice.monitoringGrade && notice.entryName && notice.endDate && notice.textarea && (this.submitDeptName.length > 0 || notice.submitDeptId.length > 0)) {
            if (this.$route.params.id === '-1') {
              // 临时保存
              this.addDate.push(notice)
              let addData = JSON.stringify(this.addDate)
              localStorage.setItem('add', addData)
              // 判断等级
              if (this.notice.monitoringGrade === '1') {
                // console.log(this.submitDeptName)
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
              // console.log(notice.endDate)
              saveSafetyNoticeData2({
                attachmentDOs: this.$refs.adjunct.fileFormList,
                departmentDOs: this.departmentDOs,
                deptId: this.user.deptId,
                deptName: this.user.deptName,
                userId: this.user.userId,
                userName: this.user.userName,
                projectStartDate: notice.dateTime,
                projectLevel: notice.monitoringGrade,
                projectName: notice.entryName,
                projectEndDate: new Date(formatDate(new Date(notice.endDate), 'yyyy-MM-dd')), // notice.endDate,
                monitorType: notice.monitoringType,
                projectContent: notice.textarea,
                procStatus: -1 // 新建状态
              }).then(result => {
                // console.log(result)
                if (result.data.error === 0) {
                  this.fullscreenLoading = false
                  this.dis = false
                  this.saveBtn = true
                  this.saveId = result.data.data.id
                  this.$message({
                    type: 'success',
                    message: '保存成功'
                  })
                } else {
                  this.$message.error('保存失败' + result.data.message)
                  this.fullscreenLoading = false
                }
              })
            } else if (this.$route.params.id === '0') {
              // 修改事件
              if (this.notice.monitoringGrade === '1') {
                // console.log(this.submitDeptName)
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
              this.$refs.adjunct.fileFormList.map(f => {
                this.$refs.adjunct.fileInfo.push(f)
              })
              console.log(this.$refs.adjunct.fileInfo)
              // console.log(notice.endDate)
              axios.post('/api/securitymonitor/updateSafetyMonitor', {
                attachmentDOs: this.$refs.adjunct.fileInfo,
                departmentDOs: this.departmentDOs,
                deptId: this.user.deptId,
                deptName: this.user.deptName,
                userId: this.user.userId,
                userName: this.user.userName,
                projectStartDate: notice.dateTime,
                projectLevel: notice.monitoringGrade,
                projectName: notice.entryName,
                projectEndDate: new Date(formatDate(new Date(notice.endDate), 'yyyy-MM-dd')), // notice.endDate,
                monitorType: notice.monitoringType,
                projectContent: notice.textarea,
                procStatus: -1, // 新建状态
                id: this.modifId
              })
                .then(result => {
                  if (result.data.data) {
                    this.fullscreenLoading = false
                    if (this.$route.query.reject) {
                      let localname = '新建' + this.info.id + this.user.userId
                      localStorage.setItem(localname, '1')
                    }
                    this.$router.back()
                    this.$message({
                      type: 'success',
                      message: '保存成功'
                    })
                  } else {
                    this.$message.error('保存失败' + result.data.message)
                    this.fullscreenLoading = false
                  }
                })
                .catch(() => {
                  this.$message.error('网络错误或服务器错误')
                  this.fullscreenLoading = false
                })
            }
          } else { // 11
            this.$message.error('请填写必填项')
            this.fullscreenLoading = false
          }
        } else { // 11
          this.$message.error('请填写必填项')
          this.fullscreenLoading = false
        }
      })
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
    conditionGetDepartmentList3(this.user.deptId).then(result => {
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


