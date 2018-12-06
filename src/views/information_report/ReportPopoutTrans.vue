<template>
    <el-dialog :title="statusTxt" :visible.sync="adviceContentFormVisible" width="30%">
        <el-form :model="contentForm" :rules="rules" ref='contentForm' inline-message label-width="130px" >
            <el-form-item label="实际处理日期" v-if="alertData.status === 0 || alertData.status === 1">
                <el-input v-model="contentForm.auditTime" disabled></el-input>
            </el-form-item>
            <!-- 初评 -->
            <div v-if="alertData.status === 0">
              <el-form-item label="是否奖励">
                  <el-radio v-model="reward" :label="true">是</el-radio>
                  <el-radio v-model="reward" :label="false">否</el-radio>
              </el-form-item>
              <el-form-item label="奖励等级" v-show="reward">
                  <el-select v-model="rewardBonos" placeholder="奖励等级">
                      <el-option v-for ='(item , index) in ALL_SELECT_DATA.REWARD_LEVEL.dicts' :key='index' :label="item.dictName" :value="item.dictCode"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="奖励依据" v-show="reward">
                  <el-select v-model="rewardBaseon" placeholder="奖励依据">
                      <el-option v-for ='(item , index) in ALL_SELECT_DATA.REWARD_BASIS.dicts' :key='index' :label="item.dictName" :value="item.dictCode"></el-option>
                  </el-select>
              </el-form-item>
            </div>
            <!-- 处理意见 -->
            <div v-if="alertData.status === 3">
              <el-form-item label="是否为事件">
                <el-radio v-model="contentForm.event" :label=1>是</el-radio>
                <el-radio v-model="contentForm.event" :label=0>否</el-radio>
              </el-form-item>
              <el-form-item label="是否启用事件调查" v-if="contentForm.event === 1">
                <el-radio v-model="contentForm.startEventSurvey" :label=1>是</el-radio>
                <el-radio v-model="contentForm.startEventSurvey" :label=0>否</el-radio>
              </el-form-item>
              <el-form-item label="是否启用风险管理" v-if="contentForm.event === 1">
                <el-radio v-model="contentForm.startRiskFlow" :label=1>是</el-radio>
                <el-radio v-model="contentForm.startRiskFlow" :label=0>否</el-radio>
              </el-form-item>
            </div>
            <el-form-item :label="disabledIdea" prop="auditComment">
                <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="contentForm.auditComment"
                maxlength="200">
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmContent"
              v-loading.fullscreen.lock="fullscreenLoading">同意</el-button>
            <el-button type="danger" @click="dismissAction"
              v-if="alertData.status === 1 || alertData.status === 2 || alertData.status === 4"
              v-loading.fullscreen.lock="fullscreenLoading">驳回</el-button>
            <el-button type="danger" @click="drawBackAction" v-if="alertData.status === 0"
              v-loading.fullscreen.lock="fullscreenLoading">驳回</el-button>
            <el-button @click="hide">关闭</el-button>
        </div>
    </el-dialog>
</template>
<script>
  import Vuex from 'Vuex'
  // 请求到所有下拉框的数据
  import { disposeTransactionAction } from '../../services/information_report'
  import { formatDate } from '../../utils/index.js'

  export default {
    props: {
      alertData: Object,
      taskInfo: Object,
      path: String,
      auditUser: Number,
      statusTxt: String
    },
    data () {
      return {
        adviceContentFormVisible: null,
        // 是否奖励
        reward: false,
        // 奖励等级
        rewardBonos: null,
        // 奖励依据
        rewardBaseon: null,
        contentForm: {
          reportNumber: '',
          // 处理人/用户
          auditUser: '',
          auditUserName: '',
          // 审核类型 num
          auditType: '',
          // 实际处理日期
          auditTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          // 结果/奖励审核结果
          auditResult: -1,
          // 处理意见
          auditComment: '',
          // 角色 num
          auditRole: '',
          // 是否为事件
          event: -1,
          // 是否启用事件调查
          startEventSurvey: -1,
          // 是否启用风险管理
          startRiskFlow: -1
        },
        type: '',
        // 处理意见
        disabledIdea: '处理意见',
        // loading
        fullscreenLoading: false,
        rules: {
          auditComment: [
            { required: true, message: '不能为空',trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...Vuex.mapState(["ALL_SELECT_DATA"])
    },
    methods: {
      hide () {
        this.adviceContentFormVisible = false
      },
      show () {
        this.adviceContentFormVisible = true
      },
      handShowPopout () {
        // 显示弹框
        this.show()
        this.type = 'popout'
      },
      // 点击同意
      confirmContent () {
        if (this.contentForm.auditComment === '') {
          this.$message({
            type: 'info',
            message: '请填写处理意见'
          })
          return
        }
        let obj = {}
        obj.reportAuditDO = this.contentForm
        obj.taskInfo = this.taskInfo
        let user = this.$store.state.user
        if (this.alertData.status === 0) {
          obj.reportAuditDO.auditResult = 1
        }
        obj.reportAuditDO.reportNumber = this.alertData.reportNumber
        obj.reportAuditDO.auditUser = user.userId
        obj.reportAuditDO.auditUserName = user.userName
        obj.reward = this.reward
        obj.rewardBonos = this.rewardBonos
        obj.rewardBaseon = this.rewardBaseon
        obj.prelimAssessId = this.auditUser
        // 是否为事件
        obj.event = this.contentForm.event
        // 是否启用事件调查
        obj.startEventSurvey = this.contentForm.startEventSurvey
        // 是否启用风险管理
        obj.startRiskFlow = this.contentForm.startRiskFlow
        this.fullscreenLoading = true
        disposeTransactionAction(obj).then(result => {
          // 关闭loading
          this.fullscreenLoading = false
          if (result.data.error === 0 && result.data.data !== null) {
            this.$message({
              type: 'success',
              message: '发送成功'
            })
            this.$router.push(this.path)
          } else {
            this.$message({
              type: 'error',
              message: '发送失败：' + result.data.message
            })
          }
        })
        .catch((error) => {
          this.fullscreenLoading = false
          this.$message({
              type: 'error',
              message: '发送失败：' + error
            })
        })
      },
      // 退回到新建
      drawBackAction () {
        this.$confirm('确定驳回？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {}
          obj.reportAuditDO = this.contentForm
          obj.taskInfo = this.taskInfo
          let user = this.$store.state.user
          if (this.alertData.status === 0) {
            obj.reportAuditDO.auditResult = 0
          }
          obj.reportAuditDO.reportNumber = this.alertData.reportNumber
          obj.reportAuditDO.auditUser = user.userId
          obj.reportAuditDO.auditUserName = user.userName
          obj.reward = this.reward
          obj.rewardBonos = this.rewardBonos
          obj.rewardBaseon = this.rewardBaseon
          obj.prelimAssessId = this.auditUser
          this.fullscreenLoading = true
          disposeTransactionAction(obj).then(result => {
            this.fullscreenLoading = false
            if (result.data.error === 0 && result.data.data !== null) {
              this.$router.push(this.path)
            } else {
              this.$message({
                type: 'error',
                message: '驳回失败：' + result.data.message
              })
            }
          })
            .catch(error => {
              // 关闭loading
              this.fullscreenLoading = false
              this.$message({
                type: 'error',
                message: '驳回失败：' + error
              })
            })
        })
          .catch(error => {
            console.log(error)
          })
      },
      // 驳回
      dismissAction () {
        if (this.contentForm.auditComment === '') {
          this.$message({
            type: 'info',
            message: '请填写处理意见'
          })
        } else {
          this.$confirm('确定驳回？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let obj = {}
            obj.reportAuditDO = this.contentForm
            obj.taskInfo = this.taskInfo
            let user = this.$store.state.user
            obj.reportAuditDO.auditResult = 0
            obj.reportAuditDO.reportNumber = this.alertData.reportNumber
            obj.reportAuditDO.auditUser = user.userId
            obj.reportAuditDO.auditUserName = user.userName
            obj.reward = this.reward
            obj.rewardBonos = this.rewardBonos
            obj.rewardBaseon = this.rewardBaseon
            obj.prelimAssessId = this.auditUser
            // 是否为事件
            obj.event = this.contentForm.event
            // 是否启用事件调查
            obj.startEventSurvey = this.contentForm.startEventSurvey
            // 是否启用风险管理
            obj.startRiskFlow = this.contentForm.startRiskFlow
            this.fullscreenLoading = true
            disposeTransactionAction(obj).then(result => {
              this.fullscreenLoading = false
              if (result.data.error === 0 && result.data.data !== null) {
                this.$message({
                  type: 'success',
                  message: '驳回成功'
                })
                this.$router.push(this.path)
              } else {
                this.$message({
                  type: 'error',
                  message: '驳回失败：' + result.data.message
                })
              }
            })
             .catch((error) => {
                this.fullscreenLoading = false
                this.$message({
                  type: 'error',
                  message: '驳回失败：' + error
                })
             })
          })
            .catch(error => {
              console.log(error)
            })
        }
      }
    },
    created () {
      // 改变处理意见的值
      if (this.alertData.status === 4) {
        this.disabledIdea = '审核结论'
      }
    }
  }
</script>
