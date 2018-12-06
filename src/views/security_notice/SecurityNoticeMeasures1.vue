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

    <security-notice-measures
    ref='measures'
    :safetyId='safetyId'
    :taskId='taskId'
    :flag ='flag'
    :safetyDeptId ='safetyDeptId'
    @addAdviseContent ='addAdviseContent'

    ></security-notice-measures>

 <el-dialog title="措施填写" :visible.sync="dialogFormVisible" width='38%'>
  <el-form :model="contentform" :rules="rules" inline-message ref='contentform'>

      <el-form-item label="依据" label-width="25%">
         <el-input :value="dependFiter(contentform.noticeDepend)" auto-complete="off" disabled></el-input>
       </el-form-item>
      <el-form-item label="内容" label-width="25%">
        <el-input v-model="contentform.noticeContent" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="建议" label-width="25%">
         <el-input v-model="contentform.noticeSuggest" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="措施" label-width="25%" prop="correctContent">
          <el-input v-model="contentform.correctContent" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="计划结束日期" label-width="25%" prop="planFinishDate">
            <el-date-picker
              v-model="contentform.planFinishDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              >
            </el-date-picker>
      </el-form-item>
</el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="agreeAddContent">确 定</el-button>
  </div>
</el-dialog>

    <b-card no-body>
        <h1 class="header">
            {{actionTitle}}
        </h1>
        <b-card-body>
          <el-steps :active="3" align-center>
            <el-step title="新建"></el-step>
            <el-step title="立项审批"></el-step>
            <el-step title="部门流转"></el-step>
            <el-step title="措施填写"></el-step>
            <el-step title="部门审核"></el-step>
            <el-step title="措施评估"></el-step>
            <el-step title="措施验证"></el-step>
            <el-step title="验证核准"></el-step>
            <el-step title="效果评估"></el-step>
            <el-step title="结束"></el-step>
          </el-steps>
            <div class="btnBox" style='text-align:center'>
                <el-button type="success"  @click ='approveHandle'
                 v-if='this.taskId || this.flag===0'
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
  SecurityNoticeMeasures,
  SecurityNoticeDialog

} from '../../components/System/security_notice/index.js'
import { SafetyNoticeFlowAduitChild } from '../../services/safety_notice'
import { sourceDataFilter } from '../../tools'
export default {
  name: 'SecurityNoticeEdit',
  components: {
    SecurityNoticeBase, // 基本信息
    SecurityNoticeDepartment, // 责任部门
    SecurityNoticeAdjunct, // 附件
    SecurityNoticeMarch, // 可以执行的操作  SecurityNoticeMarch
    SecurityNoticeMeasures,
    SecurityNoticeDialog
  },
  data () {
    return {
      actionTitle: '',
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
      safetyDeptId: '',
      contentform: {},
      contentformIndex: '',
      dialogFormVisible: false,
      rules: {
        correctContent: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        planFinishDate: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      uploadFile: true,
      fullscreenLoading: false,

      childTableData: []
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
      // console.log(this.safetyDeptId)

      let tableData = this.$refs.measures.tableData
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
      this.auditVO.safetyDeptAuditDO.auditType = 1

      if (tableData && tableData.length > 0) {
        let tab = tableData.find(item => {
          return (item.correctContent === null || item.correctContent === '') || (item.planFinishDate === '' || item.planFinishDate === null)
        })
        if (!tab) {
          this.$refs.dialong.show()
        } else {
          this.$message.error('内容建议不能为空')
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
            message: '发送成功'
          })
          this.goBack()
        } else {
          this.$message({
            type: 'error',
            message: '发送失败'+result.data.message
          })
        }
      })
        .catch(() => {
          this.fullscreenLoading = false

          this.$message({
            type: 'error',
            message: '网络或服务器错误'
          })
        })
    },
    addAdviseContent ({index, row}) {
      this.contentform = JSON.parse(JSON.stringify(row))
      this.contentformIndex = index
      this.dialogFormVisible = true
    },
    agreeAddContent () {
      this.$refs.contentform.validate((valid) => {
        if (valid) {
          this.valid = true
        } else {
          this.valid = false
        }
      })

      if (this.valid) {
        let params = {
          content: this.contentform,
          index: this.contentformIndex
        }

        this.$refs.measures.AdviseContentFinish(params)
        this.dialogFormVisible = false
        this.contentform = {}
        this.contentformIndex = ''
      } else {
        this.$message.error('不能为空')
      }
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
    // childTableData (data, newdata) {

    // }
  },
  mounted () {
    // 得到数据字典里  下拉框数据
    this.childTableData = this.$refs.measures.tableData
  }

}
</script>
