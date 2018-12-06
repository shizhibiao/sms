<template>
  <div class="animated fadeIn">
      <!--基本信息模块-->
    <security-notice-base
    ref='base'
    :safetyId='safetyId'
    :taskId='taskId'
    :flag ='flag'
    :procStatus='procStatus'
    :isDisabled = 'true'
    ></security-notice-base>

     <!--责任部门模块-->
    <security-notice-department
    ref='depatment'
    :safetyId='safetyId'

    :taskId='taskId'
    :flag ='flag'
    :isDisabled = 'true'
    ></security-notice-department>

    <!--附件模块-->
    <security-notice-adjunct
    ref='adjunct'
    :safetyId='safetyId'
    :uploadFile='uploadFile'
    :taskId='taskId'
    :flag ='flag'
    ></security-notice-adjunct>

    <!--流程1-->
    <security-notice-march
    ref='history'
    :safetyId='safetyId'

    :taskId='taskId'
    :flag ='flag'

    >

    </security-notice-march>


    <security-notice-dialog ref='dialong' @agreeAction ='agreeAction' @rejectAction='rejectAction'>

    </security-notice-dialog>
<!--
    <security-notice-measures
    ref='measures'
    :safetyId='safetyId'
    :taskId='taskId'
    :flag ='flag'
    ></security-notice-measures> -->
    <b-card no-body>
        <h1 class="header">
            {{actionTitle}}
        </h1>
        <b-card-body>
          <el-steps :active="4" align-center>
            <el-step title="新建"></el-step>
            <el-step title="立项审批"></el-step>
            <el-step title="部门流转"></el-step>
            <el-step title="措施填写"></el-step>
            <el-step title="部门审核"></el-step>
            <el-step title="措施评估"></el-step>
            <el-step title="措施验证"></el-step>
            <el-step title="验证核准"></el-step>
            <el-step title="效果评估"></el-step>
            <el-step title="结束"></el-step>
          </el-steps>
            <div class="btnBox" style='text-align:center'>
                <el-button type="success"  @click ='approveHandle' v-if='this.taskId || this.flag===0' 
                 v-loading.fullscreen.lock="fullscreenLoading"
                >发送</el-button>
                <el-button @click="goBack">返回</el-button>
            </div>
        </b-card-body>
  </b-card>
  </div>
</template>
<script>
import Vuex from 'vuex'
import {
  SecurityNoticeBase,
  SecurityNoticeDepartment,
  SecurityNoticeAdjunct,
  SecurityNoticeMarch,
  SecurityNoticeMeasures,
  SecurityNoticeDialog

} from '../../components/System/security_notice/index.js'
import { SafetyNoticeFlowAduitChild } from '../../services/safety_notice'

export default {
  name: 'SecurityNoticeEdit',
  components: {
    SecurityNoticeBase, // 基本信息
    SecurityNoticeDepartment, // 责任部门
    SecurityNoticeAdjunct, // 附件
    SecurityNoticeMarch, // 可以执行的操作  SecurityNoticeMarch
    SecurityNoticeMeasures,
    SecurityNoticeDialog
  },
  data () {
    return {
      actionTitle: '',
      safetyId: '',
      taskId: '',
      flag: '',
      isShow: true,
      procStatus: 0,
      approveContent: '',
      auditVO: {
        safetyDeptAuditDO: {
          auditComment: '',
          auditResult: true,
          auditType: 0,
          auditUserName: '',
          safetyId: 0,
          submitUser: 0
        },
        taskInfo: {}
      },
      safetyDeptId: '',
      uploadFile: true,
      fullscreenLoading: false
    }
  },
  computed: {...Vuex.mapState(['user'])},
  methods: {
    startNoticeAction (rest) {

    },
    goBack () {
      this.$router.back()
    },
    // 批准按钮
    approveHandle () {
      this.$refs.dialong.show()
      let arrList = this.$refs.history.showData
      this.auditVO.safetyDeptAuditDO = arrList && arrList.filter(item => {
        return item.children && item.children.length > 0
      })[0].children[0]

      this.auditVO.safetyDeptAuditDO.auditId = 0
      this.auditVO.safetyDeptAuditDO.children = null
      this.auditVO.safetyDeptAuditDO.parent = null
      this.auditVO.safetyDeptAuditDO.auditUserName = this.user.userName
      this.auditVO.safetyDeptAuditDO.submitUser = this.user.userId
      this.auditVO.safetyDeptAuditDO.auditType = 2
    },
    agreeAction (data) {
      if (data) {
        this.auditVO.safetyDeptAuditDO.auditComment = data.advise
      }

      this.submitAgreeHandle()
      this.$refs.dialong.hide()
    },
    submitAgreeHandle () {
      this.fullscreenLoading = true
      SafetyNoticeFlowAduitChild(this.auditVO).then(result => {
        this.fullscreenLoading = false
        if (result.data && result.data.error === 0) {
          this.$message({
            type: 'success',
            message: '发送成功'
          })
          this.goBack()
        } else {
          this.$message({
            type: 'error',
            message: '发送失败'+result.data.message
          })
        }
      })
        .catch((error) => {
          this.fullscreenLoading = false
          this.$message({
            type: 'error',
            message: '网络或者服务器错误' + error
          })
        })
    },
    rejectAction (data) {
      if (data) {
        this.auditVO.safetyDeptAuditDO.auditComment = data.advise
      }
      this.auditVO.safetyDeptAuditDO.auditResult = false

      this.submitAgreeHandle()
      this.$refs.dialong.hide()
    }
  },
  created () {
    this.safetyId = this.$route.query.safetyId
    this.taskId = this.$route.query.taskId
    this.flag = this.$route.query.flag
    this.auditVO.taskInfo = this.$route.params.taskInfo
    this.auditType = this.$route.query.auditType
  },
  watch: {

  },
  mounted () {
  }

}
</script>
