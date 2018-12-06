<template>
  <div class="animated fadeIn">
    <security-notice-base ref='base'></security-notice-base>

    <security-notice-department ref='depatment'></security-notice-department>

    <security-notice-adjunct ref='adjunct'></security-notice-adjunct>

  <b-card no-body>

        <b-card-body>
            <eSteps :pageNum='0'></eSteps>
            <div class="btnBox" style='text-align:center'>
                <el-button type="success"  @click ='saveDataAction' :disabled="isShowSend">保存</el-button>
                <el-button type="primary"  @click ='sendHandle' :disabled="!isShowSend" v-loading.fullscreen.lock="fullscreenLoading">发送</el-button>
                <el-button @click ='goBack()'>返回</el-button>
            </div>
        </b-card-body>
  </b-card>
  </div>
</template>

<script>
import Vuex from 'vuex'
import {formatDate} from '../../utils'
import axios from 'axios'
import eSteps from '@/components/System/security_notice/eSteps.vue'
import {
  SecurityNoticeBase,
  SecurityNoticeDepartment,
  SecurityNoticeAdjunct
  // SecurityNoticeHandle
} from '../../components/System/security_notice/index.js'
import {
  saveSafetyNoticeData
} from '../../services/safety_notice'
export default {
  name: 'SecurityNoticeEdit',
  components: {
    SecurityNoticeBase, // 基本信息
    SecurityNoticeDepartment, // 责任部门
    SecurityNoticeAdjunct ,// 附件
    eSteps

  },
  data () {
    let user = this.$store.state.user
    let date = formatDate(new Date(), 'yyyy-MM-dd')
    return {
      actionTitle: '',

      form: {
        annoucementDO: {
          accessDate: date,
          accessResult: '',
          accessUser: 0,
          accessUserName: user.userName,

          mustReportDate: '',
          noticeLevel: '',
          noticeSrcType: 0,
          noticeTitle: '',
          procInstId: 0,
          procStatus: -1,
          safetyDepartmentDOList: [
            {
              demandDate: date,
              deptContentDOList: [
                {
                  completed: false,
                  correctContent: '',
                  deptContentId: 0,
                  description: '',
                  noticeContent: '',
                  noticeDepend: '',
                  noticeSuggest: '',
                  passed: false,
                  planFinishDate: date,
                  replayIssue: false,
                  safetyDeptId: 0,
                  safetyId: 0
                }
              ],
              deptId: 0,
              deptName: '',
              deptSuggest: '',
              designatedUser: 0,
              designatedUserName: '',
              noticeDepend: '',
              noticeType: '',
              operationUser: 0,
              perationUserName: '',
              procInstId: 0,
              processDate: '',
              replayIssue: true,
              safetyDeptId: 0,
              safetyId: 0,
              status: -1
            }
          ],
          safetyId: 0,
          srcId: 0,
          submitDate: date,
          submitDeptId: user.deptId,
          submitDeptName: user.deptName,
          submitPhone: user.userPhone,
          submitUserId: user.userId,
          submitUserName: user.userName
        },
        attachmentDOList: [
          {
            fileExtName: '',
            fileName: '',
            fileUrl: '',
            id: 0,
            procStatus: -1,
            sourceNumber: 0,
            sourceTable: '',
            uploadTime: '',
            uploader: 0,
            uploaderName: ''
          }
        ]
      },
      safetyId: '',
      isDisabled: false,
      isShowSend: false,
      fullscreenLoading: false

    }
  },
  computed: {...Vuex.mapState(['user'])},
  methods: {
    saveDataAction () {
      let notice = this.$refs.base.notice
      let safetyDepartmentDOList = this.$refs.depatment.form.safetyDepartmentDOList

      if (notice['noticeLevel'] && notice['noticeTitle'] && notice['noticeSrcType']) {
        if (safetyDepartmentDOList && safetyDepartmentDOList.length > 0) {
          this.form.annoucementDO.mustReportDate = notice.mustReportDate
          this.form.annoucementDO.noticeLevel = notice.noticeLevel
          this.form.annoucementDO.noticeSrcType = notice.noticeSrcType
          this.form.annoucementDO.noticeTitle = notice.noticeTitle
          this.form.annoucementDO.safetyDepartmentDOList = safetyDepartmentDOList
          this.form.attachmentDOList = this.$refs.adjunct.fileFormList
          // -----------没有填写建议返回------------------------

          for (var i in safetyDepartmentDOList) {
            if (!safetyDepartmentDOList[i].deptContentDOList) {
              this.$message.error('责任部门的依据、通知内容和建议不能为空，请添加')
              return false
            }
          }
          saveSafetyNoticeData(this.form).then(result => {
            if (result.data && result.data.error === 0) {
              let data = result.data.data

              if (data && data.safetyId) {
                this.isShowSend = true
                this.safetyId = data.safetyId
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
              } else {
                this.$message.error('保存失败' + result.data.message)
                this.isSave = false
              }
            }
          }).catch(error => {
            this.$message.error('网络或者服务器错误' + error)
          })
        // -------------------------------------
        } else {
          //   请填写部门
          this.$message.error('责任部门不能为空，请输入')
          this.isSave = false
        }
      } else {
        //    请填写基本信息
        this.$message.error('标题、通知等级、通知来源不能为空，请输入')
        this.isSave = false
      }
    },
    goBack () {
      this.$router.push({
        path: '/notify/list'
      })
    },
    sendHandle () {
      // console.log(this.safetyId)
      this.fullscreenLoading = true
      if (this.isShowSend) {
        axios.get('/api/safetynoticeflow/start/' + this.safetyId).then(result => {
          this.fullscreenLoading = false
          if (result.data && +result.data.error === 0) {
            this.$message({
              type: 'success',
              message: '发送成功!'
            })
            this.goBack()
          } else {
            this.$message({
              type: 'error',
              message: '发送失败'+result.data.error
            })
          }
        }).catch((error) => {
          this.fullscreenLoading = false
          this.$message.error('网络或者服务器错误' + error)
        })
      }
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
