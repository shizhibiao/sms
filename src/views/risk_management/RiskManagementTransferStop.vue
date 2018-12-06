<template>

    <div class="animated fadeIn">
      <!-- 基本信息 -->
        <risk-management-base
        
        :riskId='riskId'
        :taskId='taskId'
        ref="riskBase"
        @getBaseData ='getBaseDataHandle'
        ></risk-management-base>
        <!-- 附件 -->
         <adjunct
         ref='adjunct'
         :safetyId='riskId'
         :uploadFile='true'
         tableName='t_risk_manager'

         >
         </adjunct>

         <!-- 立项审批 -->
        
        <risk0
        ref ='risk0'
        :riskId='riskId'
        :taskId='taskId'
       
        ></risk0>
           
        <b-card-body>
            <eSteps :active="0" title="立项修改"></eSteps>
            <div class="btnBox" style='text-align:center'>
               <el-button type="success"  @click ='saveBtnAction' :disabled="isAction">保存</el-button>
               <el-button type="primary"  @click ='approveHandle'
                v-loading.fullscreen.lock="fullscreenLoading" :disabled="!isAction">发送</el-button>
               <el-button @click ='goBack()'>返回</el-button>
            </div>
            
        </b-card-body>
        
    </div>
</template>

<script>
import Vuex from 'vuex'
// import {formatDate} from '../../utils'
import {
  RiskManagementBase,
  Risk0,
  eSteps
} from '@/components/System/risk_management'
import {
  updateRiskManage,
  riskManageFlowAudit
} from '../../services/risk'
import adjunct from '../../components/System/security_notice/SecurityNoticeAdjunct'
// import PubSub from 'pubsub-js'
export default {

  name: 'riskEdit',
  components: {
    RiskManagementBase,
    Risk0,
    adjunct,
    eSteps
  },
  data () {
    return {
      // 控制loading
      fullscreenLoading: false,
      isAction: true,
      riskId: '',
      taskId: '',
      count: 0,
      riskBaseObj: {}

    }
  },
  // 当前用户的信息
  computed: {...Vuex.mapState(['user'])},
  methods: {

    // 改变部门下拉
    changeHandle (data) {
      this.$forceUpdate()
    },
    // 返回上一页
    goBack () {
      this.$router.back()
    },
    saveBtnAction () {
      this.$refs.riskBase.$refs['form'].validate((valid) => {
        if (!valid) {
          this.valid = false
          this.$message({
            type: 'info',
            message: '不能为空'
          })
          return false
        } else {
          this.valid = true
        }
      })
      let risk = this.$refs.riskBase.risk
      if (this.valid) {
        if (+risk.projectLevel === 2) {
          risk.rmDepartmentDOList = []
          risk.rmDepartmentDOList.push(risk.rmDepartment)
        }

        updateRiskManage(risk).then(result => {
          if (result.data && result.data.error === 0) {
            this.isAction = true
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          } else {
            this.$message({
              type: 'success',
              message: '保存失败' + result.data.message
            })
          }
        }).catch(error => {
          this.$message({
            type: 'info',
            message: '网络或者服务器错误' + error
          })
        })
      }
    },
    approveHandle () {
      this.$confirm('是否确认发送', '提示', {
        distinguishCancelAndClose:true,
        confirmButtonText: '发送',
        cancelButtonText: '结束流程',
        type: 'warning'
        // 发送
      }).then(() => {
        this.submitActionHandle(true)
        // 取消
      }).catch(action => {
            if( action==='cancel'){
              this.submitActionHandle(true)
            }
        
      })
    },
    submitActionHandle (auditResult) {
      let riskManageAuditDO = {
        auditId: 0,
        auditResult,
        riskId: this.riskId,
        submitUser: this.user.userId,
        auditType: -1,
        auditUserName: this.user.userName
      }
      let params = {
        riskManageAuditDO,
        taskInfo: this.taskInfo
      }

      riskManageFlowAudit(params).then(result => {
        // console.log(result)
        this.fullscreenLoading = false
        if (result.data && result.data.error === 0) {
          this.$message({
            type: 'success',
            message: '发送成功'
          })

          this.$router.back()
        } else {
          this.$message({
            type: 'error',
            message: '发送失败,错误信息：' + result.data.message
          })
        }
      }).catch(error => {
        this.fullscreenLoading = false

        this.$message({
          type: 'error',
          message: '发送失败,错误信息：' + error
        })
      })
    },
    getBaseDataHandle (data) {
      this.riskBaseObj = data
    }
  },
  created () {
    // 请求数据
    this.riskId = this.$route.query.riskId
    this.taskInfo = this.$route.query.taskInfo
    this.taskId = this.$route.query.taskId || 0
  },
  watch: {
    riskBaseObj: {
      handler () {
        this.count++
        if (this.count > 2) {
          this.isAction = false
        }
      },
      deep: true
    }
  },
  mounted () {
  }
}
</script>
