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


    <security-notice-dialog ref='dialong' @agreeAction ='agreeAction'  @rejectAction='rejectAction'>

    </security-notice-dialog>
    <b-card no-body>
        <b-card-body>
            <eSteps :pageNum='7'></eSteps>
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
import { getAllDataAction, SafetyNoticeFlowAduitChild } from '../../services/safety_notice'
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
    // 审核按钮
    approveHandle () {
      this.$refs.dialong.show()

      let arrList = this.$refs.history.showData
      // 找到有子元素的对象
      this.auditVO.safetyDeptAuditDO = arrList && arrList.filter(item => {
        return item.children && item.children.length > 0
      })[0].children[0]

      this.auditVO.safetyDeptAuditDO.auditId = 0
      this.auditVO.safetyDeptAuditDO.children = null
      this.auditVO.safetyDeptAuditDO.parent = null
      this.auditVO.safetyDeptAuditDO.auditUserName = this.user.userName
      this.auditVO.safetyDeptAuditDO.submitUser = this.user.userId
      this.auditVO.safetyDeptAuditDO.safetyId = this.safetyId
      this.auditVO.safetyDeptAuditDO.auditType = 5
    },
    // 同意按钮
    agreeAction (data) {
      // 获得所有的数据

      // 添加建议
      if (data) {
        this.auditVO.safetyDeptAuditDO.auditComment = data.advise
      }
      // 删除多余的数据 和 赋值

      this.auditVO.safetyDeptAuditDO.auditResult = true
      // 请求数据
      this.submitAgreeHandle()

      this.$refs.dialong.hide()
    },
    submitAgreeHandle () {
      // 请求操作
      this.fullscreenLoading = true
      SafetyNoticeFlowAduitChild(this.auditVO).then(result => {
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
      }
      // console.log(this.auditVO)
      this.auditVO.safetyDeptAuditDO.auditResult = false

      this.submitAgreeHandle()
      this.$refs.dialong.hide()
    }
  },
  // 获得当前的状态信息
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
