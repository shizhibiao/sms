<template>
  <div class="animated fadeIn">
      <!--基本信息模块-->
    <security-notice-base
    ref='base'
    :safetyId='safetyId'
    :taskId='taskId'
    :flag ='flag'
    ></security-notice-base>

     <!--责任部门模块-->
    <security-notice-department
    ref='depatment'
    :safetyId='safetyId'
    :taskId='taskId'
    :flag ='flag'
    ></security-notice-department>

    <!--附件模块-->
    <security-notice-adjunct
    ref='adjunct'
    :safetyId='safetyId'
    :uploadFile='true'
    :taskId='taskId'
    :flag ='flag'
    ></security-notice-adjunct>

    <b-card no-body>
        <h1 class="header"></h1>
        <b-card-body>
            <div class="btnBox" style='text-align:center'>
                <el-button type="success"  @click ='saveDataAction' v-if='this.flag === 0' >保存</el-button>
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
  SecurityNoticeAdjunct
} from '../../components/System/security_notice/index.js'
import {
  updataNotice
} from '../../services/safety_notice'
export default {
  name: 'SecurityNoticeEdit',
  components: {
    SecurityNoticeBase, // 基本信息
    SecurityNoticeDepartment, // 责任部门
    SecurityNoticeAdjunct // 附件
  },
  data () {
    return {
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
      dataList: {}
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
            this.isSave = true
            this.$message({
              type: 'success',
              message: '保存成功'

            })
            this.goBack()
          } else {
            this.$message.error('请先保存')
          }
        } else {
          this.$message.error('保存失败' + result.data.message)
          this.isSave = false
        }
      })
    },
    goBack () {
      this.$router.push({
        path: '/notify/list'
      })
    }
  },
  created () {
    this.safetyId = +this.$route.query.safetyId

    this.flag = +this.$route.query.flag
  },
  mounted () {
    if (this.safetyId && this.flag === 0) {
      this.getValue()
    }
  }

}
</script>
