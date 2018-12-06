<template>
  <div class="animated fadeIn">
      <!--基本信息模块-->
    <security-notice-base
    ref='base'
    :safetyId='safetyId'
    :taskId='taskId'
    :flag ='flag'
    @getBaseData='getBaseData'
    ></security-notice-base>

     <!--责任部门模块-->
    <security-notice-department
    ref='depatment'
    :safetyId='safetyId'
    :taskId='taskId'
    :flag ='flag'
     @getDeptData='getDeptData'
    ></security-notice-department>

    <!--附件模块-->
    <security-notice-adjunct
    ref='adjunct'
    :safetyId='safetyId'
    :uploadFile='uploadFile'
    :taskId='taskId'
    :flag ='flag'
    ></security-notice-adjunct>
 

    <security-notice-march
    ref='history'
    :safetyId='safetyId'
    :taskId='taskId'
    :flag ='flag'
    >

    </security-notice-march>

    <b-card no-body>
        <h1 class="header"></h1>
        <b-card-body>
            <eSteps :pageNum='0' title="立项修改"></eSteps>
            <div class="btnBox" style='text-align:center'>
                <el-button type="success"  @click ='saveDataAction' :disabled="isSend">保存</el-button>
                <el-button type="primary"  @click ='approveHandle'
                v-loading.fullscreen.lock="fullscreenLoading" :disabled="!isSend">发送</el-button>
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
  SecurityNoticeDialog,
  SecurityNoticeMarch

} from '../../components/System/security_notice/index.js'
import {
  updataNotice,
  SafetyNoticeFlowAduit
} from '../../services/safety_notice'
import eSteps from '@/components/System/security_notice/eSteps.vue'
export default {
  name: 'SecurityNoticeEdit',
  components: {
    SecurityNoticeBase, // 基本信息
    SecurityNoticeDepartment, // 责任部门
    SecurityNoticeAdjunct, // 附件
    SecurityNoticeDialog,
    SecurityNoticeMarch,
    eSteps
  },
  data () {
    return {
      actionTitle: '',
      safetyId: '',
      taskId: '',
      flag: '',
      form: {
        annoucementDO: {
          safetyDepartmentDOList: []
        },
        attachmentDOList: []
      },
      edit: false,
      dataList: {},
      uploadFile: true,
      fullscreenLoading: false,
      auditVO: {
        safetyAuditDO: {
          auditComment: '',
          auditResult: true,
          auditType: 0,
          auditUserName: '',
          safetyId: 0,
          submitUser: 0
        }
      },
      riskInfo: {
        riskDeptData: {},
        riskBaseData: {}
      },
      count: 0,
      isSend: true
    }
  },
  computed: {
  ...Vuex.mapState(['user'])
  },
  methods: {

    getValue () {
      let notice = this.$refs.base.notice
      let safetyDepartmentDOList = this.$refs.depatment.form.safetyDepartmentDOList
      this.form.annoucementDO.mustReportDate = notice.mustReportDate
      this.form.annoucementDO.noticeLevel = notice.noticeLevel
      this.form.annoucementDO.noticeSrcType = notice.noticeSrcType
      this.form.annoucementDO.noticeTitle = notice.noticeTitle
      this.form.annoucementDO.safetyDepartmentDOList = safetyDepartmentDOList
      this.form.attachmentDOList = this.$refs.adjunct.fileFormList
      this.form.annoucementDO.safetyId = this.safetyId
    },
    saveDataAction () {
      let notice = this.$refs.base.notice
      let safetyDepartmentDOList = this.$refs.depatment.form.safetyDepartmentDOList
      for (var i in safetyDepartmentDOList) {
        if (!safetyDepartmentDOList[i].deptContentDOList || safetyDepartmentDOList[i].deptContentDOList.length === 0) {
          this.$message.error('责任部门的依据、通知内容和建议不能为空，请添加')
          return false
        }
      }
      if (notice['noticeLevel'] && notice['noticeTitle'] && notice['noticeSrcType']) {
        if (safetyDepartmentDOList && safetyDepartmentDOList.length > 0) {
          let notice = this.$refs.base.notice
          let safetyDepartmentDOList = this.$refs.depatment.form.safetyDepartmentDOList
          this.form.annoucementDO.mustReportDate = notice.mustReportDate
          this.form.annoucementDO.noticeLevel = notice.noticeLevel
          this.form.annoucementDO.noticeSrcType = notice.noticeSrcType
          this.form.annoucementDO.noticeTitle = notice.noticeTitle
          this.form.annoucementDO.safetyDepartmentDOList = safetyDepartmentDOList
          this.form.attachmentDOList = this.$refs.adjunct.fileFormList
          this.form.annoucementDO.safetyId = this.safetyId
        } else {
          this.$message.error('责任部门不能为空，请输入')
          return false
        }
      } else {
        this.$message.error('标题、通知等级、通知来源不能为空，请输入')
        return false
      }

      updataNotice(this.form).then(result => {
        if (result.data && result.data.error === 0) {
          let data = result.data.data
          if (data && data.safetyId) {
            this.safetyId = data.safetyId
            this.count = 0
            this.isSend = true
            this.$message({
              type: 'success',
              message: '保存成功'

            })
          } else {
            this.$message.error('请先保存')
          }
        } else {
          this.$message.error('保存失败' + result.data.message)
          this.isSend = false
        }
      })
    },
    startNoticeAction (rest) {

    },
    goBack () {
      this.$router.push({
        path: '/notify/list'
      })
    },
    // 发送按钮
    approveHandle () {
      this.$confirm('是否确认发送', '提示', {
        confirmButtonText: '发送',
        distinguishCancelAndClose:true,
        cancelButtonText: '结束流程',
        type: 'warning'
        // 发送
      }).then(() => {
        this.agreeAction()
        // 取消
      }).catch(action => {
            if( action==='cancel'){
              this.submitActionHandle(true)
            }
        
      })
    },
    agreeAction (data) {
      this.auditVO.safetyAuditDO.auditUserName = this.user.userName
      this.auditVO.safetyAuditDO.submitUser = this.user.userId
      this.auditVO.safetyAuditDO.safetyId = this.safetyId
      this.auditVO.safetyAuditDO.auditType = -1
      this.auditVO.safetyAuditDO.auditResult = true
      this.submitAgreeHandle()
    },
    submitAgreeHandle () {
      this.fullscreenLoading = true
      SafetyNoticeFlowAduit(this.auditVO).then(result => {
        this.fullscreenLoading = false
        if (result.data && result.data.error === 0) {
          this.$message({
            type: 'success',
            message: '发送成功!'
          })
          this.goBack()
        } else {
          this.$message({
            type: 'error',
            message: '发送失败'+result.data.message
          })
        }
      }).catch(error => {
        this.fullscreenLoading = false
        this.$message.error('网络或者服务器错误' + error)
      })
    },
    rejectAction (data) {
      this.auditVO.safetyAuditDO.auditUserName = this.user.userName
      this.auditVO.safetyAuditDO.submitUser = this.user.userId
      this.auditVO.safetyAuditDO.safetyId = this.safetyId
      this.auditVO.safetyAuditDO.auditType = -1
      this.auditVO.safetyAuditDO.auditResult = false
      this.submitAgreeHandle()
    },
    getDeptData (data) {
      this.riskInfo.riskDeptData = data
    },
    getBaseData (data) {
      this.riskInfo.riskBaseData = data
    }
  },
  created () {
    this.safetyId = this.$route.query.safetyId
    this.taskId = this.$route.query.taskId

    this.flag = this.$route.query.flag
    this.auditVO.taskInfo = this.$route.params.taskInfo
  },
  watch: {
    riskInfo: {
      handler (data, newdata) {
        this.count++

        if (this.count > 3) {
          this.isSend = false
        }
      },
      deep: true
    }
  },
  mounted () {
    if (this.safetyId && this.flag === 0) {
      this.getValue()
    }
  }

}
</script>
