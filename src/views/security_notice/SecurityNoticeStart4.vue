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


    <security-notice-dialog ref='dialong' @agreeAction ='agreeAction' @rejectAction='rejectAction'>

    </security-notice-dialog>
<!--
    <security-notice-measures
    ref='measures'
    :safetyId='safetyId'
    :taskId='taskId'
    :flag ='flag'

    @addAdviseContent ='addAdviseContent'

    ></security-notice-measures> -->
    <security-notice-verification
    :safetyId='safetyId'
    :taskId='taskId'
    :flag ='flag'

    ref='verification'
    @addAdviseContent ='addAdviseContent'
    >

    </security-notice-verification>

 <el-dialog title="添加说明" :visible.sync="dialogFormVisible" width='40%'  >
  <el-form :model="contentform" :rules="rules" inline-message ref='contentform'>
    <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="依据" label-width="120px">
              <el-input :value="dependFiter(contentform.noticeDepend)" disabled></el-input>
            </el-form-item>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="内容" label-width="120px">
              <el-input :value="contentform.noticeContent" disabled></el-input>
            </el-form-item>
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="建议" label-width="120px">
              <el-input :value="contentform.noticeSuggest" disabled></el-input>
            </el-form-item>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12">
          <el-form-item label="措施" label-width="120px">
              <el-input :value="contentform.correctContent" disabled></el-input>
          </el-form-item>
        </div>

      <div class="col-lg-6 col-md-6 col-sm-12">
          <el-form-item label="计划结束日期" label-width="120px">
              <el-input :value="contentform.planFinishDate" disabled></el-input>
          </el-form-item>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12">
          <el-form-item label="是否完成" label-width="120px" prop="completed">
              <el-switch
                v-model="contentform.completed"
                active-text="完成"
                inactive-text="未完成">
              </el-switch>
          </el-form-item>
      </div>

        <div class="col-lg-12 col-md-12 col-sm-12">
            <el-form-item label="情况说明" label-width="120px" prop="description">
               <el-input v-model="contentform.description" auto-complete="off"></el-input>
            </el-form-item>
        </div>
    </div>


  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">关 闭</el-button>
    <el-button type="primary" @click="agreeAddContent">确 定</el-button>
  </div>
</el-dialog>

    <b-card no-body>
        <b-card-body>
            <eSteps :pageNum='6'></eSteps>
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
  SecurityNoticeVerification,
  SecurityNoticeDialog

} from '../../components/System/security_notice/index.js'
import { getAllDataAction, SafetyNoticeFlowAduitChild } from '../../services/safety_notice'
import { sourceDataFilter } from '../../tools'
import eSteps from '@/components/System/security_notice/eSteps.vue'
export default {
  name: 'SecurityNoticeEdit',
  components: {
    SecurityNoticeBase, // 基本信息
    SecurityNoticeDepartment, // 责任部门
    SecurityNoticeAdjunct, // 附件
    SecurityNoticeMarch, // 可以执行的操作  SecurityNoticeMarch
    SecurityNoticeVerification,
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

      contentform: {},
      contentformIndex: '',
      dialogFormVisible: false,
      rules: {
        description: [
          { required: true, message: '不能为空', trigger: 'blue' }
        ]
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
    // 批准按钮
    approveHandle () {
      let tableData = this.$refs.verification.tableData
      let arrList = this.$refs.history.showData
      // 找到有子元素的对象
      this.auditVO.safetyDeptAuditDO = arrList && arrList.filter(item => {
        return item.children && item.children.length > 0
      })[0].children[0]
      // 删除多余的数据 和 赋值
      this.auditVO.safetyDeptAuditDO.auditId = 0
      this.auditVO.safetyDeptAuditDO.children = null
      this.auditVO.safetyDeptAuditDO.parent = null
      this.auditVO.safetyDeptAuditDO.auditUserName = this.user.userName
      this.auditVO.safetyDeptAuditDO.submitUser = this.user.userId
      this.auditVO.safetyDeptAuditDO.auditType = 4

      if (tableData && tableData.length > 0) {
        let tab = tableData.find(item => {
          return (item.description === null || item.description === '') || (item.completed === '' || item.completed === null)
        })
        if (!tab) {
          this.$refs.dialong.show()
        } else {
          this.$message.error('建议不能为空')
        }
      }
    },
    // 点击同意请求数据
    agreeAction (data) {
      if (data) {
        this.auditVO.safetyDeptAuditDO.auditComment = data.advise
      }
      this.submitAgreeHandle()
      this.$refs.dialong.hide()
    },
    // 审批同意操作
    submitAgreeHandle () {
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

    addAdviseContent ({index, row}) {
      this.contentform = JSON.parse(JSON.stringify(row))
      this.contentformIndex = index
      this.dialogFormVisible = true
    },
    // 添加说明的方法
    agreeAddContent (data) {
      this.$refs.contentform.validate((valid) => {
        // console.log(valid)
        if (valid) {
          this.valid = true
        } else {
          this.valid = false
        }
        if (this.valid) {
          let params = {
            content: this.contentform,
            index: this.contentformIndex
          }

          // 传值到子组件
          this.$refs.verification.AdviseContentFinish(params)
          this.dialogFormVisible = false
          this.contentform = {}
          this.contentformIndex = ''
        } else {
          this.$message.error('不能为空')
        }
      })
    },
    rejectAction (data) {
      if (data) {
        this.auditVO.safetyDeptAuditDO.auditComment = data.advise
      }
      this.auditVO.safetyDeptAuditDO.auditResult = false

      this.submitAgreeHandle()
      this.$refs.dialong.hide()
    },
    dependFiter (noticeDepend) {
      let sourceData = this.ALL_SELECT_DATA.DEPEND_ON
      let filter = sourceDataFilter(sourceData, noticeDepend)
      return filter
    }
  },
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
