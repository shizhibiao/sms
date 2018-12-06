<template>
  <div class="animated fadeIn">
      <!--基本信息模块-->
    <security-notice-base 
    ref='base' 
    :safetyId='safetyId'
    :isDisabled='true'
    :taskId='taskId'
    :flag ='flag'
    ></security-notice-base>

     <!--责任部门模块-->
    <security-notice-department 
    ref='depatment'
    :safetyId='safetyId'
    :isDisabled='true'
    :taskId='taskId'
    :flag ='flag'
    ></security-notice-department>


    <!--附件模块-->
    <security-notice-adjunct 
    ref='adjunct'
    :safetyId='safetyId'
    :taskId='taskId'
    :flag ='flag'
    ></security-notice-adjunct>
    <!-- 审核历史 -->
    <security-notice-march
    ref='history'
    :safetyId='safetyId'
    :taskId='taskId'
    :flag ='flag'
    >
    </security-notice-march>
    <b-card no-body>
        <b-card-body>
            <eSteps></eSteps>
            <div class="btnBox" style='text-align:center'>
          
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
  SecurityNoticeMarch

} from '../../components/System/security_notice/index.js'
import eSteps from '@/components/System/security_notice/eSteps.vue'
export default {
  name: 'SecurityNoticeEdit',
  components: {
    SecurityNoticeBase, // 基本信息
    SecurityNoticeDepartment, // 责任部门
    SecurityNoticeAdjunct, // 附件
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
      }
    }
  },
  computed: {...Vuex.mapState(['user'])},
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
    },
    goBack () {
      this.$router.back()
    }
  },
  created () {
    this.safetyId = this.$route.query.safetyId
    this.taskId = this.$route.query.taskId || 0
    this.flag = this.$route.query.flag
  },
  mounted () {
    if (this.safetyId) {
      this.getValue()
    }
  }

}
</script>