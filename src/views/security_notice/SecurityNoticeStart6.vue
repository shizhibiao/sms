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


    <security-notice-dialog ref='dialong' @agreeAction ='agreeAction' :cancelHide='true' :isResultPage='true'>

    </security-notice-dialog>
    <b-card no-body>
        <b-card-body>
          <eSteps :pageNum='8'></eSteps>
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

  SecurityNoticeDialog

} from '../../components/System/security_notice/index.js'
import { getAllDataAction, SafetyNoticeFlowAduit } from '../../services/safety_notice'
import eSteps from '@/components/System/security_notice/eSteps.vue'
export default {
  name: 'SecurityNoticeEdit',
  components: {
    SecurityNoticeBase, // 基本信息
    SecurityNoticeDepartment, // 责任部门
    SecurityNoticeAdjunct, // 附件
    SecurityNoticeMarch, // 可以执行的操作  SecurityNoticeMarch

    SecurityNoticeDialog,
    eSteps
  },
  data () {
    return {
      safetyId: '',
      taskId: '',
      flag: '',
      isShow: true,
      procStatus: 0,
      approveContent: '',
      auditVO: {
        safetyAuditDO: {
          auditComment: '',
          auditResult: true,
          auditType: 0,
          auditUserName: '',
          safetyId: 0,
          submitUser: 0
        },
        taskInfo: {}
      },
      uploadFile: true,
      fullscreenLoading: false
    }
  },
  computed: {
    ...Vuex.mapState(['user']),
    ...Vuex.mapState(['ALL_SELECT_DATA'])
  },
  methods: {
    startNoticeAction (rest) {

    },
    goBack () {
      this.$router.back()
    },
    // 批准按钮
    approveHandle () {
      this.$refs.dialong.show()
    },
    agreeAction (data) {
      if (data) {
        this.auditVO.safetyAuditDO.auditComment = data.advise
        this.auditVO.safetyAuditDO.accessResult = data.accessResult
      }
      this.auditVO.safetyAuditDO.auditUserName = this.user.userName
      this.auditVO.safetyAuditDO.submitUser = this.user.userId
      this.auditVO.safetyAuditDO.safetyId = this.safetyId
      this.auditVO.safetyAuditDO.auditType = 2
      this.auditVO.safetyAuditDO.auditResult = true
      this.submitAgreeHandle()
      this.$refs.dialong.hide()
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
        this.auditVO.safetyAuditDO.accessResult = data.accessResult
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
