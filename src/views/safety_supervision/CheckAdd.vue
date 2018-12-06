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
                <el-form-item label="创建人">
                  <span>{{user.userName}}</span>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="创建日期">
                  <span>{{info.time}}</span>
                </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="项目"
                              prop="project">
                  <el-input v-model="info.project"
                            placeholder=""
                            maxlength="50"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="监察部门"
                              prop="dept">
                  <el-select v-model="info.dept"
                             value-key='deptId'>
                    <el-option :label="item.deptName"
                               :value="item"
                               v-for="(item,index) in deptNameList"
                               :key="index">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="检查方式"
                              prop="itemCheckType">
                  <el-select v-model="info.itemCheckType"
                             value-key='dictCode'>
                    <el-option :label="item.dictName"
                               :value="item"
                               v-for="(item,index) in inspect"
                               :key="index">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="条款号"
                              prop="itemNo">
                  <el-input v-model="info.itemNo"
                            placeholder=""
                            maxlength="50"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="提示"
                              prop="itemHint">
                  <el-input v-model="info.itemHint"
                            placeholder=""
                            maxlength="50"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="抽样数"
                              prop="itemSampleSum">
                  <el-input v-model.number="info.itemSampleSum"
                            placeholder=""
                            ></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-8 col-md-6 col-sm-12">
                <el-form-item label="条款内容"
                              prop="itemContent">
                  <el-input type="textarea"
                            :rows="4"
                            style="width:100%;"
                            placeholder="请输入内容"
                            v-model="info.itemContent"
                            maxlength="1000">
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </b-card-body>
      </b-collapse>
    </b-card>
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
import { conditionGetDepartmentList, dept, TESTMODE } from '../../services/safety_supervision'
export default {
  data () {
    return {
      inspect: [],
      loading: false,
      deptNameList: [],
      fullscreenLoading: false,
      info: {
        time: formatDate(new Date(), 'yyyy-MM-dd'),
        // 项目
        project: '',
        // 检查方式
        itemCheckType: '',
        // 条款号
        itemNo: '',
        // 提示
        itemHint: '',
        // 责任部门
        dept: '',
        // 抽样数
        itemSampleSum: '',
        // 条款内容
        itemContent: ''
      },
      rules: {
        itemCheckType: [
          { required: true, message: '请选择检查方式', trigger: 'change' }
        ],
        project: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 50, message: '不得超过50个字符', trigger: 'blur' }
        ],
        itemNo: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        dept: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        itemHint: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        itemSampleSum: [
          { required: true, message: '必填' },
          { type: 'number', message: '必须为数字值' }
        ],
        itemContent: [
          { required: true, message: '必填', trigger: 'blur' }
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
    // 返回按钮
    backAction () {
      this.$router.back()
    },
    // 保存按钮事件
    saveDataAction () {
      this.fullscreenLoading = true
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 保存新增事件
          let form = JSON.parse(JSON.stringify(this.info))
          // form.createTime = form.time
          form.createUser = this.user.userId
          form.createUserName = this.user.userName
          form.deptId = form.dept.deptId
          form.deptName = form.dept.deptName
          form.itemCheckType = form.itemCheckType.dictCode
          // console.log(form)
          axios.post('/api/securitymonitor/saveItem', (form))
            .then((res) => {
              // console.log(res)
              this.fullscreenLoading = false
              if (res.data.data) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.backAction()
              } else {
                this.$message.error('保存失败' + res.data.message)
              }
            })
            .catch((error) => {              console.log(error)
              this.fullscreenLoading = false            })
        } else { //11
          this.$message.error('请填写必填项')
          this.fullscreenLoading = false
        }
      })
    },
  },
  created () {
    TESTMODE().then(res => {
      this.inspect = res
      this.info.itemCheckType = this.inspect[0]
      // this.info.itemCheckType = this.inspect[0].dictName
    })
  },
  mounted () {
    conditionGetDepartmentList(1).then(result => {
      // console.log(result)
      this.deptNameList = result
    })
  }
}
</script>

<style scoped>
</style>