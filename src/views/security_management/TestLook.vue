<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        基本信息
        <div class="card-actions">
          <b-btn class="btn btn-minimize"
                 v-b-toggle.collapse1>
            <i class="icon-arrow-up"></i>
          </b-btn>
        </div>
      </div>
      <b-collapse id="collapse1"
                  :visible='true'>
        <b-card-body>
          <el-form ref="form"
                   label-width="110px"
                   inline-message
                   label-position="left"
                   status-icon
                   size="medium"
                   :model="info">
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="制定人">
                  <span>{{user.userName}}</span>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="制定部门">
                  <span>{{user.deptName}}</span>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="制定日期">
                  <span>{{info.sapCreateDate}}</span>
                </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="标题"
                              prop="sapTitile">
                  <el-input v-model="info.sapTitile"
                            disabled
                            placeholder=""></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="计划实施时间"
                              prop="sapDate">
                  <el-date-picker v-model="info.sapDate"
                                  type="date"
                                  style="width:100%;"
                                  placeholder="选择日期"
                                  disabled
                                  value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-8 col-md-6 col-sm-12">
                <el-form-item label="测试内容"
                              prop="sapContent">
                  <el-input type="textarea"
                            :rows="4"
                            disabled
                            style="width:100%;"
                            placeholder="请输入内容"
                            v-model="info.sapContent">
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card no-body>
      <div slot="header">
        检查单明细列表
        <div class="card-actions">
          <b-btn class="btn btn-minimize"
                 v-b-toggle.collapse4><i class="icon-arrow-up"></i></b-btn>
        </div>
      </div>
      <b-collapse id="collapse4"
                  :visible='true'>
        <!-- 表 -->
        <el-table style="width: 100%"
                  :data="checklistTab">
          <el-table-column label="被测试部门"
                           prop='sapdDeptName.deptName'>
          </el-table-column>
          <el-table-column label="测试项目"
                           prop='sapdProname'>
          </el-table-column>
          <el-table-column label="测试要点"
                           prop='sapdDesc1'>
          </el-table-column>
          <el-table-column label="涉及部门"
                           prop='sapdRedeptName.deptName'>
          </el-table-column>
          <el-table-column label="测试人"
                           prop='sapdCheckeName.userName'>
          </el-table-column>
          <el-table-column label="计划完成日期"
                           prop='sapdFinishdate'>
          </el-table-column>
          <el-table-column label="结论"
                           prop='sapdResult'>
          </el-table-column>
          <el-table-column label="测试情况简述"
                           prop='sapdDesc2'>
          </el-table-column>
          <el-table-column label="性质判定"
                           prop='sapdDesc3'>
          </el-table-column>
          <el-table-column label="实际完成日期"
                           prop='sapdDealdate'>
          </el-table-column>
        </el-table>
      </b-collapse>
    </b-card>
    <security-notice-adjunct ref='adjunct'
                             :tableName="tableName"
                             :flag="2"
                             :safetyId="this.$route.query.id"
                             :uploadFile='true'>
    </security-notice-adjunct>
    <b-card no-body>
      <b-card-body>
        <div class="text-center">
          <el-button @click="backAction">返回</el-button>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
import { formatDate } from '../../utils'
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
import { conditionGetDepartmentList, getTestProject, getTestConclusion, dept } from '../../services/safety_supervision'
export default {
  components: {
    SecurityNoticeAdjunct
  },
  data () {
    return {
      index: -1,
      resultList: [],
      userList: [],
      loading: false,
      noticeTypeList: [],
      deptNameList: [],
      btnShow: false,
      modifId: '',
      fullscreenLoading: false,
      // 附件表名
      tableName: 't_supervisce_audit_plan',
      info: {
        // 标题
        sapTitile: '',
        // 测试内容
        sapContent: '',
        // 制定日期
        sapCreateDate: formatDate(new Date(), 'yyyy-MM-dd'),
        // 计划实施时间日期
        sapDate: '',
        // 状态
        sapStatus: 0,
        sapCreateby: '',
        sapCreatebyName: '',
        sapDept: '',
        sapDeptName: '',
      },
      checklistTab: [],
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  watch: {
  },
  methods: {
    // 返回按钮
    backAction () {
      this.$router.back()
    },
  },
  created () {
    this.info.sapCreateby = this.user.userId
    this.info.sapCreatebyName = this.user.userName
    this.info.sapDept = this.user.deptId
    this.info.sapDeptName = this.user.deptName
  },
  mounted () {
    conditionGetDepartmentList(1).then(result => {
      // console.log(result)
      this.deptNameList = result
    })
    getTestProject().then(res => {
      this.noticeTypeList = res
    })
    getTestConclusion().then(res => {
      this.resultList = res
    })
    axios.get('/api/securitytest/' + this.$route.query.id).then(res => {
      this.info = res.data.data
      let data = res.data.data
      // console.log(data)
      data.details.forEach((item) => {
        axios.get('/api/system/user/' + item.sapdChecker).then(user => {
          item.sapdCheckeName = user.data.data
          item.sapdRedeptName2 = item.sapdRedeptName
          item.sapdRedeptName = {}
          item.sapdRedeptName.deptName = item.sapdRedeptName2
          item.sapdDeptName2 = item.sapdDeptName
          item.sapdDeptName = {}
          item.sapdDeptName.deptName = item.sapdDeptName2
        })
      })
      setTimeout(() => {
        this.checklistTab = data.details
        this.checklistTab.forEach(item => {
          conditionGetDepartmentList(1).then(res => {
            // console.log(res)
            item.sapdDeptName = res.find(f => {
              return f.deptId == item.sapdDept
            })
            return conditionGetDepartmentList(1)
          }).then(de => {
            item.sapdRedeptName = de.find(d => {
              return d.deptId == item.sapdRedept
            })
            this.userList.push(data.details[0].sapdCheckeName)
          })
        })
        // console.log(this.checklistTab)
      }, 500)

    })
  }
}
</script>

<style scoped>
</style>
