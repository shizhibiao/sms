<template>

    <div class="animated fadeIn"> 
       <!-- 基本信息 -->
        <risk-management-base
        ref ='riskBase'
        ></risk-management-base>
        <!-- 附件 -->
         <adjunct
         ref='adjunct'
         :safetyId='riskId'
         tableName='t_risk_manager'>
         </adjunct>
           
        <b-card>
            <eSteps :pageNum='0'></eSteps>
            <div class="btnBox" style='text-align:center'>
                <el-button type="success"  @click ='saveBtnAction' :disabled="isShowSend">保存</el-button>
                <el-button type="primary"  @click ='sendBtnAction' :disabled="!isShowSend" v-loading.fullscreen.lock="fullscreenLoading">发送</el-button>
                <el-button @click ='goBack()'>返回</el-button>
            </div>
            
        </b-card>
        
    </div>
</template>

<script>
import {
  RiskManagementBase,
  eSteps
} from '@/components/System/risk_management'
import Vuex from 'vuex'

import {
  saveAllRisk,
  startRiskManage
} from '../../services/risk'
import adjunct from '../../components/System/security_notice/SecurityNoticeAdjunct'
// import PubSub from 'pubsub-js'
export default {

  name: 'riskNew',
  components: {
    RiskManagementBase,
    adjunct,
    eSteps
  },
  data () {
    return {
      // 控制发送
      isShowSend: false,
      // 控制loading
      fullscreenLoading: false,
      rmDepartmentDOList: [],
      riskId: ''

    }
  },
  // 当前用户的信息
  computed: {...Vuex.mapState(['user'])
  },
  methods: {
    // 保存按钮
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
        let form = {
          riskManagerDO: risk,
          attachmentDOList: this.$refs.adjunct.fileFormList
        }
        // console.log(this.form)
        saveAllRisk(form).then(result => {
          this.isShowSend = true
          this.riskId = result.data.data.riskId
          // console.log(result)
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.uploadFile = true
        }).catch(error => {
          this.$message({
            type: 'info',
            message: '保存失败' + error
          })
        })
      }
    },
    // 发送按钮
    sendBtnAction () {
      this.fullscreenLoading = true
      startRiskManage(this.riskId).then(result => {
        this.fullscreenLoading = false
        if (result.data && result.data.error === 0) {
          this.$message({
            type: 'success',
            message: '发送成功'
          })

          this.$router.push({
            path:'/risk/list'
          })
        } else {
          this.$message({
            type: 'info',
            message: '发送失败'
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
      this.$router.push('/risk/list')
    },
    // 改变部门
    changeDept () {

    }
  },
  created () {

  },
  watch: {
  },
  mounted () {
  }

}
</script>
