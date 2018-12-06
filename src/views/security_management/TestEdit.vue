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
                   :rules="rules"
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
        <div class="float-right"
             style="margin-right: 3em">
          <el-button type="primary"
                     size="small"
                     @click="handleAddBtn()">新增</el-button>
        </div>
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
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div slot="reference"
                   class="gist-wrapper">
                <el-button size="mini"
                           @click="batchAddformEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini"
                           type="danger"
                           @click="batchAddformDelete(scope.$index, scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增检查单 -->
        <template>
          <el-dialog title="添加检查单"
                     :visible.sync="btnShow"
                     width='50%'>
            <el-form :model="checklist"
                     :rules="formRules"
                     label-position="left"
                     ref="batchform"
                     inline-message>
              <el-form-item label="被测试部门"
                            label-width="100px"
                            prop='sapdDeptName'>
                <el-select v-model="checklist.sapdDeptName"
                           placeholder="请选择部门"
                           value-key='deptId'
                           :clearable='true'>
                  <el-option :label="item.deptName"
                             :value="item"
                             v-for="(item,index) in deptNameList"
                             :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="测试项目"
                            label-width="100px"
                            prop='sapdProname'>
                <el-select v-model="checklist.sapdProname"
                           placeholder="请选择类型">
                  <el-option :label="item.dictName"
                             :value="item.dictName"
                             v-for="(item,index) in noticeTypeList"
                             :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="测试要点"
                            label-width="100px"
                            prop="sapdDesc1">
                <el-input v-model="checklist.sapdDesc1"
                          placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="涉及部门"
                            label-width="100px"
                            prop='sapdRedept2'>
                <el-select v-model="checklist.sapdRedept2"
                           placeholder="请选择部门"
                           value-key='deptId'
                           multiple
                           :clearable='true'>
                  <el-option :label="item.deptName"
                             :value="item"
                             v-for="(item,index) in deptNameList"
                             :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="测试人"
                            label-width="100px"
                            prop='sapdCheckeName'>
                <el-select v-model="checklist.sapdCheckeName"
                           filterable
                           remote
                           :clearable='true'
                           reserve-keyword
                           value-key="userId"
                           placeholder="请输入工号、姓名"
                           :remote-method="remoteMethod"
                           :loading="loading">
                  <el-option v-for="(item,index) in userList"
                             :key="index"
                             :label="item.userName"
                             :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="计划完成日期"
                            label-width="120px"
                            prop="sapdFinishdate">
                <el-date-picker v-model="checklist.sapdFinishdate"
                                type="date"
                                style="width:100%;"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="实际完成日期"
                            label-width="120px"
                            prop="sapdDealdate">
                <el-date-picker v-model="checklist.sapdDealdate"
                                type="date"
                                style="width:100%;"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结论"
                            label-width="100px"
                            prop="sapdResult">
                <el-select v-model="checklist.sapdResult"
                           placeholder="请选择结论"
                           :clearable='true'>
                  <el-option :label="item.dictName"
                             :value="item.dictName"
                             v-for="(item,index) in resultList"
                             :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="测试情况简述"
                            label-width="120px"
                            prop="sapdDesc2">
                <el-input v-model="checklist.sapdDesc2"
                          placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="性质判定"
                            label-width="100px"
                            prop="sapdDesc3">
                <el-input v-model="checklist.sapdDesc3"
                          placeholder=""></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
              <el-button @click="btnShow=false"
                         size="mini">关 闭</el-button>
              <el-button type="primary"
                         size="mini"
                         @click='batchAddAction'>确 定</el-button>
            </div>
          </el-dialog>
        </template>

        <!--  -->
      </b-collapse>
    </b-card>
    <security-notice-adjunct ref='adjunct'
                             :safetyId="this.$route.query.id"
                             :tableName="tableName"
                             :uploadFile='true'>
    </security-notice-adjunct>
    <b-card no-body>
      <b-card-body>
        <div class="text-center">
          <el-button type="success"
                     v-loading.fullscreen.lock="fullscreenLoading"
                     @click="saveDataAction">保存</el-button>
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
      rules: {
        sapTitile: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 30, message: '不得超过三十个字符', trigger: 'blur' }
        ],
        sapDate: [
          { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
        ],
        sapContent: [
          { required: true, message: '请填写测试内容', trigger: 'blur' }
        ]
      },
      checklistTab: [],
      checklist: {
        sapdDeptName: '',
        sapdProname: '',
        sapdDesc1: '',
        sapdDesc2: '',
        sapdDesc3: '',
        sapdRedept2: [],
        sapdFinishdate: '',
        sapdResult: '',
        sapdCheckeName: '',
        sapdDealdate: ''
      },
      formRules: {
        sapdDesc1: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 30, message: '不得超过三十个字符', trigger: 'blur' }
        ],
        sapdDesc2: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 30, message: '不得超过三十个字符', trigger: 'blur' }
        ],
        sapdDesc3: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 30, message: '不得超过三十个字符', trigger: 'blur' }
        ],
        sapdDeptName: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        sapdProname: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        sapdRedept2: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        sapdCheckeName: [
          { required: true, message: '请选择测试人', trigger: 'change' }
        ],
        sapdResult: [
          { required: true, message: '请选择结论', trigger: 'change' }
        ],
        sapdFinishdate: [
          { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
        ],
        sapdDealdate: [
          { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
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
    // 用户查询
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        axios.get('/api/system/user/search?userNo=' + query).then(res => {
          this.loading = false
          this.userList = res.data.data
        })
      } else {
        this.userList = [];
      }
    },
    // 查询部门

    // 编辑按钮
    batchAddformEdit (index, row) {
      // this.index = index
      // dept(row.sapdDept).then(res => {
      //   row.sapdDeptName = res.data.data[0]
      //   return dept(row.sapdRedept)
      // }).then(de => {
      //   row.sapdRedeptName = de.data.data[0]
      //   row.sapdRedept2 = [row.sapdRedeptName]
      //   this.checklist = { ...row }
      //   this.btnShow = true
      // })
      this.index = index
      row.sapdRedept2 = [row.sapdRedeptName]
      this.checklist = { ...row }
      this.btnShow = true
    },
    // 表格删除按钮
    batchAddformDelete (index, row) {
      this.checklistTab.splice(index, 1)
    },
    // 检查单新增
    handleAddBtn () {
      this.btnShow = true
      if (this.checklistTab.length) {
        this.checklist = {
          sapdDeptName: '',
          sapdProname: '',
          sapdDesc1: '',
          sapdDesc2: '',
          sapdDesc3: '',
          sapdRedept2: [],
          sapdFinishdate: '',
          sapdResult: '',
          sapdCheckeName: ''
        }
        this.$refs['batchform'].resetFields()
      }

    },
    // 返回按钮
    backAction () {
      this.$router.back()
    },
    // 确定按钮
    batchAddAction () {
      this.$refs['batchform'].validate((valid) => {
        if (valid) {
          if (this.index != -1) {
            this.checklistTab.splice(this.index, 1)
          }
          this.checklist.sapdRedept2.forEach(item => {
            var obj = { ...this.checklist, sapdRedeptName: item }
            this.checklistTab.push(obj)
          })
          // console.log(this.checklistTab)
          this.btnShow = false
        } else { //11
          this.$message.error('请填写必填项')
        }
      })
    },
    // 保存按钮事件
    saveDataAction () {
      this.fullscreenLoading = true
      let info = this.info
      this.$refs['form'].validate((valid) => {
        if (valid && this.checklistTab.length > 0) {
          // 保存修改事件
          let form = { ...this.info, details: JSON.parse(JSON.stringify(this.checklistTab)) }
          // console.log(form)
          form.details.forEach(item => {
            item.sapdChecker = item.sapdCheckeName.userId
            item.sapdRedept = item.sapdRedeptName.deptId
            item.sapdRedeptName = item.sapdRedeptName.deptName
            item.sapdDept = item.sapdDeptName.deptId
            item.sapdDeptName = item.sapdDeptName.deptName
          })
          // console.log(form)
          axios.put('/api/securitytest/update', (form))
            .then((res) => {
              // console.log(res)
              this.fullscreenLoading = false
              if (res.data.data) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.$router.back()
              }
            })
            .catch((error) => {              console.log(error)
              this.fullscreenLoading = false            })
        } else { //11
          this.$message.error('请填写必填项和检查单')
          this.fullscreenLoading = false
        }
      })
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
      }, 300)

    })
  }
}
</script>

<style scoped>
</style>
