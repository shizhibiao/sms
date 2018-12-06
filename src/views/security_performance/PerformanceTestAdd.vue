<template>
  <div class="animated fadeIn">
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
                   :model="info">
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="立项人">
                  <span>{{user.userName}}</span>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="考核时间">
                  <span>{{info.evaluetionTime}}</span>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="考核周期"
                              prop="month">
                  <el-date-picker v-model="info.month"
                                  type="month"
                                  align="right"
                                  unlink-panels
                                  value-format="yyyy-MM"
                                  placeholder="请选择月份">
                  </el-date-picker>
                </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="考核名称"
                              prop="evaluetionName">
                  <el-input v-model="info.evaluetionName"
                            placeholder=""></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
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
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="考核员"
                              prop="evaluetionUser">
                  <el-select v-model="info.evaluetionUser"
                             multiple
                             collapse-tags
                             value-key='userId'
                             :clearable='true'>
                    <el-option :label="item.userName"
                               :value="item"
                               v-for="(item,index) in userList"
                               :key="index">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </b-card-body>
      </b-collapse>
    </b-card>
    <security-notice-adjunct ref='adjunct'
                             :tableName="tableName"
                             :uploadFile='true'>
    </security-notice-adjunct>
    <b-card no-body>
      <b-card-body>
        <el-steps :active="0"
                  align-center>
          <el-step title="新建">
          </el-step>
          <el-step title="表单填写"
                   description="受理的考核员"></el-step>
          <el-step title="单元审核"
                   description="安技部-安全管理经理"></el-step>
          <el-step title="部门审核"
                   description="安技部-部门管理团队"></el-step>
          <el-step title="公司批准"
                   description="公司领导"></el-step>
          <el-step title="结束"></el-step>
        </el-steps>
        <div class="text-center">
          <el-button type="success"
                     :disabled="dis"
                     v-loading.fullscreen.lock="fullscreenLoading"
                     @click="saveDataAction">保存</el-button>
          <el-button :disabled="!dis"
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
import { formatDate } from '../../utils'
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
import { conditionGetDepartmentList, dept } from '../../services/safety_supervision'
export default {
  components: {
    SecurityNoticeAdjunct
  },
  data () {
    return {
      saveId: -1,
      userList: [],
      loading: false,
      deptNameList: [],
      dis: false,
      fullscreenLoading: false,
      fullscreenLoading2: false,
      // 附件表名
      tableName: 't_performance_evaluetion',
      info: {
        // 月份
        month: '',
        // 立项人
        projectUser: '',
        // 考核名称
        evaluetionName: '',
        // 考核日期
        evaluetionTime: formatDate(new Date(), 'yyyy-MM-dd'),
        // 责任部门
        dept: '',
        // 考核员
        evaluetionUser: [],
      },
      rules: {
        month: [
          { required: true, message: '请选择月份', trigger: 'change' }
        ],
        evaluetionName: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 30, message: '不得超过三十个字符', trigger: 'blur' }
        ],
        dept: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        evaluetionUser: [
          { required: true, message: '请选择考核员', trigger: 'change' }
        ]
      },
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  watch: {
  },
  methods: {
    // 返回按钮
    backAction () {
      this.$router.back()
    },
    // 保存按钮事件
    saveDataAction () {
      this.fullscreenLoading = true
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 保存新增事件
          let form = JSON.parse(JSON.stringify(this.info))
          form.projectUser = this.user.userId
          form.deptId = form.dept.deptId
          form.month1 = form.month.split('-')
          let day = new Date(parseInt(form.month1[0]), parseInt(form.month1[1]), 0).getDate()
          form.evaluetionEndTime = form.month + '-' + day
          form.evaluetioinStartTime = form.month + '-' + '01'
          form.evaluetionUserName = form.evaluetionUser.map((item, index) => {
            return item.userName
          })
          form.evaluetionUser = form.evaluetionUser.map(item => {
            return item.userId
          })
          form.evaluetionUserName = JSON.stringify(form.evaluetionUserName)
          form.evaluetionUser = JSON.stringify(form.evaluetionUser)
          form.evaluetionStatus = -1
          form.attachmentDOs = this.$refs.adjunct.fileFormList
          // console.log(form)
          axios.post('/api/performance_evaluetion/createPerformanceEvaluetion', (form))
            .then((res) => {
              // console.log(res)
              this.fullscreenLoading = false
              if (res.data.data) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.dis = !this.dis
                this.saveId = res.data.data.evaluetionId
              } else {
                this.$message.error('保存失败' + res.data.message)
              }
            })
            .catch((error) => {              console.log(error)
              this.fullscreenLoading = false            })
        } else { //11
          this.$message.error('请填写必填项')
          this.fullscreenLoading = false
        }
      })
    },
    sendAction () {
      this.fullscreenLoading2 = true
      axios.get('/api/performance_evaluetion/process/startUpProcess/' + this.saveId).then(res => {
        // console.log(res)
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: '发送成功'
          })
          this.fullscreenLoading2 = false
          this.backAction()
        } else {
          this.fullscreenLoading2 = false
          this.$message.error('发送失败' + res.data.message)
        }
      })
        .catch(() => {
          this.fullscreenLoading2 = false
          this.$message.error('网络错误或服务器错误')
        })
    }
  },
  created () {
    this.info.projectUser = this.user.userId
  },
  mounted () {
    conditionGetDepartmentList(1).then(result => {
      // console.log(result)
      this.deptNameList = result
    })
    dept(120).then(res => {
      this.userList = res.data.data
    })
  }
}
</script>

<style scoped>
</style>
