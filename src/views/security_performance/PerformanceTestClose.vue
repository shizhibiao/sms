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
                  <span>{{info.projectUserName}}</span>
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
                                  format="yyyy-MM"
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
                             value-key='userId'
                             multiple
                             collapse-tags
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
                             :safetyId="this.$route.query.id"
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
                     @click="sendAction"
                     type="primary">发送</el-button>
          <el-button @click="backAction">返回</el-button>
          <el-button type="danger"
                     @click="handleClose()">
            关闭</el-button>
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
import { conditionGetDepartmentList, getTestProject, getTestConclusion, dept } from '../../services/safety_supervision'
export default {
  components: {
    SecurityNoticeAdjunct
  },
  data () {
    return {
      dis: false,
      userList: [],
      loading: false,
      deptNameList: [],
      fullscreenLoading: false,
      // 附件表名
      tableName: 't_performance_evaluetion',
      info: {
        // 月份
        month: '',
        // 立项人
        projectUserName: '',
        // 考核名称
        evaluetionName: '',
        // 考核日期
        evaluetionTime: formatDate(new Date(), 'yyyy-MM-dd'),
        // 责任部门
        dept: {},
        // 考核员
        evaluetionUser: [],
      },
      rules: {
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
    // 关闭按钮
    handleClose () {
      let data = {
        status: 4,
        evaluetionDO: {
          evaluetionId: this.$route.query.id
        },
        recordDO: {
          dealResult: 0,
          submitUser: this.user.userId
        },
        taskInfo: this.$route.query.taskInfo
      }
      // console.log(data)
      axios.post('/api/performance_evaluetion/process/sendTask', (this.user.userId, data)).then(res => {
        // console.log(res)
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: '关闭成功'
          })
          this.backAction()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 发送事件
    sendAction () {
      let data = {
        evaluetionDO: {
          evaluetionId: this.$route.query.id
        },
        recordDO: {
          dealResult: 1,
          submitUser: this.user.userId
        },
        taskInfo: this.$route.query.taskInfo
      }
      // console.log(data)
      axios.post('/api/performance_evaluetion/process/sendTask', (this.user.userId, data)).then(res => {
        // console.log(res)
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: '发送成功'
          })
          this.backAction()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 返回按钮
    backAction () {
      this.$router.back()
    },
    // 保存按钮事件
    saveDataAction () {
      this.fullscreenLoading = true
      let info = this.info
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 保存修改事件
          let form = JSON.parse(JSON.stringify(this.info))
          form.deptId = form.dept.deptId
          form.deptName = form.dept.deptName
          form.month1 = form.month.split('-')
          let day = new Date(parseInt(form.month1[0]), parseInt(form.month1[1]), 0).getDate()
          form.evaluetionEndTime = form.month + '-' + day
          form.evaluetioinStartTime = form.month + '-' + '01'
          // form.evaluetionUserName = ''
          // form.evaluetionUser2 = form.evaluetionUser
          // form.evaluetionUser = ''
          // form.evaluetionUser2.forEach((item, index) => {
          //   if (index) {
          //     form.evaluetionUserName += ',' + item.userName
          //     form.evaluetionUser += ',' + item.userId
          //   } else {
          //     form.evaluetionUserName += item.userName
          //     form.evaluetionUser += item.userId
          //   }
          // })
          form.evaluetionUserName = form.evaluetionUser.map((item, index) => {
            return item.userName
          })
          form.evaluetionUser = form.evaluetionUser.map(item => {
            return item.userId
          })
          form.evaluetionUserName = JSON.stringify(form.evaluetionUserName)
          form.evaluetionUser = JSON.stringify(form.evaluetionUser)
          form.evaluetionStatus = -1
          // console.log(form)
          axios.post('/api/performance_evaluetion/updatePerformanceEvaluetion', (form))
            .then((res) => {
              // console.log(res)
              this.fullscreenLoading = false
              if (res.data.data) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.dis = !this.dis
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
    query () {
      // 查询基本信息
      let form = {
        orderby: '',
        pageNum: 0,
        pageSize: 1,
        queryItems: [
          {
            fieldName: 'evaluetionId',
            value: this.$route.query.id
          }
        ]
      }
      // 获取基本信息
      axios.post('/api/performance_evaluetion/findForList', (this.user.userId, form))
        .then(res => {
          // console.log(res)
          let data = JSON.parse(JSON.stringify(res.data.data.content[0]))
          data.evaluetionUser = JSON.parse(data.evaluetionUser).map((item, index) => {
            return {
              userName: JSON.parse(data.evaluetionUserName)[index],
              userId: parseInt(item)
            }
          })
          data.dept = {
            deptId: data.deptId,
            deptName: data.deptName
          }
          data.month = data.evaluetionEndTime.substring(0, data.evaluetionEndTime.length - 3)
          axios.get('/api/system/user/' + data.projectUser).then(res2 => {
            data.projectUserName = res2.data.data.userName
            this.info = data
          })
        })
    }
  },
  created () {
  },
  mounted () {
    conditionGetDepartmentList(1).then(result => {
      // console.log(result)
      this.deptNameList = result
    })
    dept(120).then(res => {
      this.userList = res.data.data
    })
    this.query()
  }
}
</script>

<style scoped>
</style>
