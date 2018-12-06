<template>

    <div class="animated fadeIn">

        <risk-management-base

        :riskId='riskId'
        :taskId='taskId'
        :noWritable='true'
        ></risk-management-base>

        <!-- 立项审批 -->
        <risk0
        :riskId='riskId'
        :taskId='taskId'
        ></risk0>

        <!-- 附件 -->
         <adjunct
         ref='adjunct'
         :safetyId='riskId'
         :uploadFile='true'
          tableName='t_risk_manager'
         >
         </adjunct>

        <!-- 发送建议 -->
        <el-dialog title="立项审批" :visible.sync="dialogFormVisible"  width="30%">
            <el-form :model="opinionForm" :rules="adviseRules" ref="opinionForm">
                <el-form-item label="意见" label-width="18%" prop="adviseContent">
                    <el-input v-model="opinionForm.adviseContent" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitActionHandle(true)">同意</el-button>
                <el-button type="danger" @click="submitActionHandle(false)">驳回</el-button>
                <el-button @click="dialogFormVisible = false">关闭</el-button>
            </div>
        </el-dialog>

        <!-- 发送btn -->

        <b-card-body>
            <eSteps :pageNum='1'></eSteps>
            <div class="btnBox" style='text-align:center'>
               <!-- <el-button type="success"  @click ='saveBtnAction' :disabled="isShowSend">保存</el-button> -->
                <el-button type="primary"  @click ='dialogFormVisible = true' v-loading.fullscreen.lock="fullscreenLoading">发送</el-button>
               <el-button @click ='goBack()'>返回</el-button>
            </div>

        </b-card-body>

    </div>
</template>

<script>
import {
  RiskManagementBase,
  Risk0,
  eSteps
} from '@/components/System/risk_management'
import Vuex from 'vuex'
import {

  // updateRiskManage,
  riskManageFlowAudit
} from '../../services/risk'

import adjunct from '../../components/System/security_notice/SecurityNoticeAdjunct'
// import PubSub from 'pubsub-js'
export default {

  name: 'start0', // 启动流程
  components: {
    adjunct,
    RiskManagementBase,
    Risk0,
    eSteps
  },
  data () {
    return {
      fullscreenLoading: false,
      dialogFormVisible: false,
      riskId: '',
      taskId: '',
      opinionForm: {
        adviseContent: ''
      },
      adviseRules: {
        adviseContent: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    }
  },
  // 当前用户的信息
  computed: {...Vuex.mapState(['user'])},
  methods: {
    // 发送
    sendBtnAction (params) {
      riskManageFlowAudit(params).then(result => {
        console.log(result)
        this.fullscreenLoading = false
        if (result.data && result.data.error === 0) {
          this.$message({
            type: 'success',
            message: '发送成功'
          })
          this.dialogFormVisible =false
          this.$router.back()
        } else {
          this.$message({
            type: 'info',
            message: '发送失败'+result.data.message
          })
        }
      }).catch(error => {
        this.fullscreenLoading = false

        this.$message({
          type: 'info',
          message: '发送失败' + error
        })
      })
    },
    // 返回上一页
    goBack () {
      this.$router.back()
    },
    submitActionHandle (auditResult) {
      this.$refs.opinionForm.validate(valid=>{
        if(!valid){
          this.$message({
            type:'error',
            message:'意见不能为空'
          })
        }else{
            let riskManageAuditDO = {
                auditComment: this.opinionForm.adviseContent,
                auditId: 0,
                auditResult: auditResult,
                riskId: this.riskId,
                submitUser: this.user.userId,
                auditType: 0,
                auditUserName: this.user.userName
            }


            let params = {
                riskManageAuditDO,
                taskInfo: this.taskInfo
            }
               this.fullscreenLoading = true
                this.sendBtnAction(params)
              }
            })

    },
  },
  created () {
    // 请求数据
    this.riskId = +this.$route.query.riskId
    this.taskInfo = this.$route.query.taskInfo
    this.taskId = +this.$route.query.taskInfo.taskId || 0
  },
  watch: {

  },
  mounted () {

  }
}
</script>
