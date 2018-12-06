<template>

    <div class="animated fadeIn">
      <!-- 基本信息 -->
        <risk-management-base

        :riskId='riskId'
        :taskId='taskId'
        ref="riskBase"
        ></risk-management-base>
        <!-- 附件 -->
         <adjunct
         ref='adjunct'
         :safetyId='riskId'
         :uploadFile='true'
         tableName='t_risk_manager'

         >
         </adjunct>

        <b-card>
            <div class="btnBox" style='text-align:center'>
               <el-button type="success"  @click ='saveBtnAction' :disabled="!isAction">保存</el-button>
               <el-button @click ='goBack()'>返回</el-button>
            </div>

        </b-card>

    </div>
</template>

<script>
import Vuex from 'vuex'
// import {formatDate} from '../../utils'
import {
  RiskManagementBase
} from '@/components/System/risk_management'
import {
  updateRiskManage
} from '../../services/risk'
import adjunct from '../../components/System/security_notice/SecurityNoticeAdjunct'
// import PubSub from 'pubsub-js'
export default {

  name: 'riskEdit',
  components: {
    RiskManagementBase,
    adjunct
  },
  data () {
    return {
      // 控制loading
      fullscreenLoading: false,
      isAction: true,
      riskId: '',
      taskId: ''

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
            this.isAction = false
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.$router.back()
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
    }
  },
  created () {
    // 请求数据
    this.riskId = +this.$route.query.riskId
    this.taskId = +this.$route.query.taskId || 0
  },
  watch: {

  },
  mounted () {
  }
}
</script>
