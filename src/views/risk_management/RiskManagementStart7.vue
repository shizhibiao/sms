<template>
    <!--效果评估 -->
    <div class="animated fadeIn">
        <!-- 基本信息 -->
        <risk-management-base

        :riskId='riskId'
        :taskId='taskId'
        :noWritable='true'
        ></risk-management-base>
        <!-- 立项审批 -->

        <risk0
        ref ='risk0'
        :riskId='riskId'
        :taskId='taskId'
        @getRiskChildObj ='getRiskChildObjHandle'

        ></risk0>
        <!-- 风险分析 -->


        <risk1
        :riskId='riskId'
        :taskId='taskId'
        :noWritable="true"

        ></risk1>

        <risk2
        ref ='risk2'
        :riskId='riskId'
        :riskDeptId ='riskDeptId'
        :taskId='taskId'
        :noWritable="true"
        @getRiskChildObj ='getRiskChildObjHandle'

        ></risk2>
        <risk5
        ref ='risk5'
        :riskId='riskId'
        :riskDeptId ='riskDeptId'
        :taskId='taskId'
        :noWritable='true'

        ></risk5>

        <!-- 附件 -->
         <adjunct
         ref='adjunct'
         :safetyId='riskId'
         :uploadFile='true'
          tableName='t_risk_manager'
         >
         </adjunct>

        <!--措施验证-->





        <el-dialog title="效果评估" :visible.sync="dialogFormVisible"  width="30%">
            <el-form :model="opinionForm" :rules="adviseRules" ref="opinionForm" inline-message >
                <el-form-item label="评估结果" v-if='ALL_SELECT_DATA.ASSESS_RESULT' label-width="22%" prop="accessResult">
                    <el-select v-model="opinionForm.accessResult" :clearable='true'>
                        <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.ASSESS_RESULT.dicts" :key ='index' ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="意见" label-width="22%" prop="adviseContent">
                    <el-input v-model="opinionForm.adviseContent" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitHandle(true)">同意</el-button>
                <el-button type="danger" @click="submitHandle(false)">驳回</el-button>
                <el-button @click="dialogFormVisible=false">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 发送btn -->

        <b-card-body>
            <eSteps :pageNum='10'></eSteps>
            <div class="btnBox" style='text-align:center'>
               <!-- <el-button type="success"  @click ='saveBtnAction' :disabled="isShowSend">保存</el-button> -->
                 <el-button type="primary"  @click ='dialogFormVisible = true'  v-loading.fullscreen.lock="fullscreenLoading">发送</el-button>
                 <el-button @click ='goBack()'>返回</el-button>
            </div>

        </b-card-body>

    </div>
</template>

<script>
import {
  RiskManagementBase,
  Risk0,
  Risk1,
  Risk2,
  Risk5,
  eSteps
} from '@/components/System/risk_management'

import Vuex from 'vuex'
// import {formatDate} from '../../utils'

import {
  riskMangeFlowChild// 发送
//   modifyRiskResult
  // riskManageControlPerson
  // addRiskSource
} from '../../services/risk'
import adjunct from '../../components/System/security_notice/SecurityNoticeAdjunct'
// import PubSub from 'pubsub-js'
export default {

  name: 'start0',
  components: {
    RiskManagementBase,
    adjunct,
    Risk0,
    Risk1,
    Risk2,
    Risk5,
    eSteps
  },
  data () {
    return {
      options: [{
        value: '',
        label: ''
      }],
      // 所有下拉菜单数组
      // 风险对象
      risk: {
        rmDepartment: {}
      },
      deptNameList: [],
      // 控制发送
      // isShowSend: false,
      // 控制loading
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
        ],
        accessResult:[
        { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      childObj: {},
      riskDeptId: 0,
      rmDepartmentDO :{}

    }
  },
  // 当前用户的信息
  computed: {...Vuex.mapState(['user']),
  ...Vuex.mapState(['ALL_SELECT_DATA'])},
  methods: {
    // 发送按钮
    sendBtnAction (params) {
      riskMangeFlowChild(params).then(result => {
        console.log(result)
        this.fullscreenLoading = false
        this.dialogFormVisible = false
        if (result.data && result.data.error === 0) {
          this.$message({
            type: 'success',
            message: '发送成功'
          })

          this.$router.back()
        } else {
          this.$message({
            type: 'error',
            message: '发送失败' + result.data.message
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
    getRiskChildObjHandle (obj) {
      this.childObj = obj
      this.riskDeptId = obj.riskDeptId
    },
    // 同意按钮
    submitHandle (auditResult) {
      this.$refs['opinionForm'].validate((valid) => {
          if(!valid){
                this.$message({
                  type: 'error',
                  message: '评估意见不能为空'
                })


          } else {
            let riskManageDeptAuditDO = {
                  auditComment: this.opinionForm.adviseContent,
                  auditId: 0,
                  auditResult,
                  submitUser: this.user.userId,
                  auditType: 8,
                  riskDeptId: this.childObj.riskDeptId,
                  parentAuditId: this.childObj.parentAuditId,
                  auditUserName: this.user.userName,
                  accessResult:this.opinionForm.accessResult
                }

                this.fullscreenLoading = true
                let params = {
                  riskManageDeptAuditDO,
                  taskInfo: this.taskInfo
                }
                console.log()
                this.sendBtnAction(params)
          }

      })
    }

  },
  created () {
    // 初始化

    // 请求数据
    this.riskId = +this.$route.query.riskId
    this.taskInfo = this.$route.query.taskInfo
    this.taskId = this.$route.query.taskInfo && (+this.$route.query.taskInfo.taskId || 0)
  },
  watch: {
  },
  mounted () {
  }
}
</script>
