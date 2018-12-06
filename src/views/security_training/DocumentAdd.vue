<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <div class="float-right">
          <el-button size="small" type='success' class='mt-1' @click="submitData()" ><i class='fa fa-save'></i> 保存</el-button>
          <el-button size="small" type="primary" class='mt-1' @click="resetInfo()" v-if="this.flag === 3 || this.flag === 4" ><i class='fa fa-refresh'></i> 重置</el-button>
          <el-button size="small" type="info" class='mt-1' @click="$router.back(-1)" ><i class="fa fa-back"></i> 返回</el-button>
        </div>
      </div>
    </b-card>
    <el-form :model="documentForm" :rules="rules" status-icon size="medium" ref="documentForm" label-width="120px" inline-message>
      <!-- 基本信息 -->
      <b-card no-body>
        <b-card-header>
          基本信息
          <div class="card-actions">
            <b-btn class="btn btn-minimize" v-b-toggle.basic @click="basicAction"><i class="icon-arrow-down" ref="basicDirection"></i></b-btn>
          </div>
        </b-card-header>
        <b-collapse id="basic" :visible="true" ref="basicRef">
          <b-card-body>
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="人员姓名" prop="name">
                  <el-input v-if="this.flag === 1 || this.flag === 3" v-model="documentForm.name" readonly auto-complete="off"></el-input>
                  <el-input v-else v-model="documentForm.name" auto-complete="off"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="部门名称" prop="department">
                  <el-cascader  v-if="this.flag === 1 || this.flag === 3" disabled="true" :options="submitDeptNameList" v-model="documentForm.department" change-on-select :show-all-levels='false':clearable='true' @change="changeClassDept"></el-cascader>
                  <el-cascader v-else :options="submitDeptNameList" v-model="documentForm.department" change-on-select :show-all-levels='false':clearable='true' @change="changeClassDept"></el-cascader>
                  <!--<el-input v-if="this.flag === 1 || this.flag === 3" v-model="documentForm.department" readonly auto-complete="off"></el-input>-->
                  <!--<el-input v-else v-model="documentForm.department" auto-complete="off"></el-input>-->
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="科目" prop="lessonName">
                  <el-input v-if="this.flag === 1 || this.flag === 3" v-model="documentForm.lessonName" readonly auto-complete="off"></el-input>
                  <el-input v-else v-model="documentForm.lessonName" auto-complete="off"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="考试时间" prop="examTime" style="width: auto">
                  <el-date-picker v-if="this.flag === 1 || this.flag === 3" readonly v-model="documentForm.examTime" type="datetime" style="width: 100%"
                                  format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  <el-date-picker v-else v-model="documentForm.examTime" type="datetime" style="width: 100%"
                                  format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="考试成绩" prop="examScore">
                  <el-input v-if="this.flag === 1 || this.flag === 3" v-model="documentForm.examScore" readonly auto-complete="off"></el-input>
                  <el-input v-else v-model.number="documentForm.examScore" auto-complete="off"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="是否通过" prop="isPass" style="width: auto">
                  <el-input v-if="this.flag === 1 || this.flag === 3" readonly v-model="documentForm.isPass" auto-complete="off" ></el-input>
                  <el-select v-else v-model="documentForm.isPass" isPass clearable placeholder="请选择是否通过" >
                    <el-option
                      v-for="item in isPassList"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="类型" prop="type">
                  <el-switch
                    v-if="this.flag === 1"
                    v-model="documentForm.type"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="公司"
                    inactive-text="部门"
                    disabled
                  >
                  </el-switch>
                  <el-switch
                    v-else
                    v-model="documentForm.type"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="公司"
                    inactive-text="部门"
                  >
                  </el-switch>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="是否外委" prop="outside">
                  <el-switch
                    v-if="this.flag === 1"
                    v-model="documentForm.outside"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="是"
                    inactive-text="否"
                    disabled
                  >
                  </el-switch>
                  <el-switch
                    v-else
                    v-model="documentForm.outside"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="是"
                    inactive-text="否"
                  >
                  </el-switch>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="培训单位" prop="trainingUnit">
                  <el-input v-if="this.flag === 1" v-model="documentForm.trainingUnit" readonly auto-complete="off"></el-input>
                  <el-input v-else v-model="documentForm.trainingUnit" auto-complete="off"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="教员" prop="teacher">
                  <el-input v-if="this.flag === 1" v-model="documentForm.teacher" readonly auto-complete="off"></el-input>
                  <el-input v-else v-model="documentForm.teacher" auto-complete="off"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="培训地点" prop="location">
                  <el-input v-if="this.flag === 1" v-model="documentForm.location" readonly auto-complete="off"></el-input>
                  <el-input v-else v-model="documentForm.location" auto-complete="off"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="培训方式" prop="trainingMethod" style="width: auto">
                  <el-input v-if="this.flag === 1" readonly v-model="documentForm.trainingMethod" auto-complete="off" ></el-input>
                  <el-select v-else v-model="documentForm.trainingMethod" filterable clearable placeholder="请选择培训方式" >
                    <el-option
                      v-for="item in trainMethodList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="人员类型" prop="staffType" style="width: auto">
                  <el-input v-if="this.flag === 1" readonly v-model="documentForm.staffTypeName" auto-complete="off" ></el-input>
                  <el-select v-else v-model="documentForm.staffType" filterable clearable placeholder="请选择人员类型" >
                    <el-option
                      v-for="item in staffTypList"
                      :key="item.dictCode"
                      :label="item.dictName"
                      :value="item.dictCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="培训类别" prop="trainingCate" style="width: auto">
                  <el-input v-if="this.flag === 1" readonly v-model="documentForm.trainingCateName" auto-complete="off" ></el-input>
                  <el-select v-else v-model="documentForm.trainingCate" filterable clearable placeholder="请选择培训类别" >
                    <el-option
                      v-for="item in trainCateList"
                      :key="item.dictCode"
                      :label="item.dictName"
                      :value="item.dictCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="培训类型" prop="trainingType" style="width: auto">
                  <el-input v-if="this.flag === 1" readonly v-model="documentForm.trainingType" auto-complete="off" ></el-input>
                  <el-select v-else v-model="documentForm.trainingType" filterable clearable placeholder="请选择培训类型" >
                    <el-option
                      v-for="item in trainTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="是否获证" prop="certificate">
                  <el-switch
                    v-if="this.flag === 1"
                    v-model="documentForm.certificate"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="是"
                    inactive-text="否"
                    disabled
                  >
                  </el-switch>
                  <el-switch
                    v-else
                    v-model="documentForm.certificate"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="是"
                    inactive-text="否"
                  >
                  </el-switch>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="课时" prop="time">
                  <el-input v-if="this.flag === 1" v-model="documentForm.time" readonly auto-complete="off"></el-input>
                  <el-input v-else v-model.number="documentForm.time" auto-complete="off"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="培训有效期" prop="validTime" style="width: auto">
                  <el-date-picker v-if="this.flag === 1" readonly v-model="documentForm.validTime" type="date" style="width: 100%"
                                  format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                  <el-date-picker v-else v-model="documentForm.validTime" type="date" style="width: 100%"
                                  format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="培训内容" prop="content" >
              <el-input v-if="this.flag === 1" readonly type="textarea" :rows="3" v-model="documentForm.content" auto-complete="off"></el-input>
              <el-input v-else type="textarea" :rows="3" v-model="documentForm.content" auto-complete="off"></el-input>
            </el-form-item>
          </b-card-body>
        </b-collapse>
      </b-card>
      <!-- 附件上传 -->
      <adjunct
        ref='adjunct'
        :action="uploadUrl"
        :safetyId ='this.documentForm.id'
        tableName='t_document'
        :flag="this.flag === 1 ? 2 : ''"
        :uploadFile="this.flag === 2 ? true : false"
        :onerror="uploadError"
      >
      </adjunct>
    </el-form>
  </div>

</template>
<script>
  // 附件上传
  import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
  import adjunct from "../../components/System/security_notice/SecurityNoticeAdjunct";
  import axios from 'axios'
  import {
    getDepartmentList
  } from '../../services/safety_notice'
  export default {
    name: 'document-add',
    components: {
      SecurityNoticeAdjunct,
      adjunct
    },
    data () {
      return {
        submitDeptNameList: [],
        uploadUrl: '',
        flag: 0,
        saveFlag: 0,
        trainMethodList: [
          {
            value: 0,
            label: '自学'
          }, {
            value: 1,
            label: '授课'
          },{
            value: 2,
            label: '实操'
          }
        ],
        uploadFlag: 2,
        staffTypList: [],
        trainCateList: [],
        trainTypeList: [
          {
            value: 0,
            label: '日常'
          }, {
            value: 1,
            label: '初训'
          },{
            value: 2,
            label: '复训'
          },{
            value: 3,
            label: '其他'
          }
        ],
        isPassList: [
          {
            value: '未交卷'
          }, {
            value: '不合格'
          }, {
            value: '等待阅卷'
          }, {
            value: '合格'
          }
        ],
        recordId: 0,
        tempPa: [],
        submitDeptName: [],
        documentForm: {
          id: 0,
          type: 0,
          outside: 0,
          name: '',
          staffId: '',
          trainingUnit: '',
          teacher: '',
          location: '',
          examTime: '',
          trainingMethod: '',
          staffType: '',
          staffTypeName: '',
          trainingCate: '',
          trainingCateName: '',
          trainingType: '',
          content: '',
          certificate: 0,
          examScore: '',
          isPass: '',
          time: 0,
          validTime: '',
          lessonName: ''
        },
        rules: {
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' },
          ],
          department: [
            { required: true, message: '部门不能为空', trigger: 'blur' },
          ],
          lessonName: [
            { required: true, message: '科目不能为空', trigger: 'blur' },
          ],
          examTime: [
            { required: true, message: '考试时间不能为空', trigger: 'blur' },
          ],
          examScore: [
            { required: true, message: '考试成绩不能为空', trigger: 'blur' },
            { type: 'number', message: '考试成绩必须为数字值', trigger: 'blur' }
          ],
          isPass: [
            { required: true, message: '是否通过不能为空', trigger: 'blur' },
          ],
        }
      }
    },
    methods: {
      getScoreInfo () {
        axios.get('/api/securityExam/byId?id=' + this.recordId)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.documentForm =data.data
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      // 文件上传失败时
      uploadError(err, file, fileList) {
        this.$message({
          type: 'error',
          message: '文件上传失败' + err
        })
      },
      getStaffTypList () {
        axios.get('/api/system/dictionary/by_type?dictType=STAFF_TYPE')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.staffTypList = page
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      changeClassDept(arr){
        if(arr.length<2){
          this.submitDeptName =[]
        }
      },
      submitData () {
        if (this.saveFlag === 1) {
          this.$message({type: 'error', message: '请勿重复保存！'})
          return
        }
        this.$refs.documentForm.validate((valid) => {
          if (valid) {
            if (this.flag === 3 || this.flag === 4) {
              this.documentForm.id = 0
            }
            if (this.documentForm.type === true) {
              this.documentForm.type = 1
            } else {
              this.documentForm.type = 0
            }
            if (this.documentForm.certificate === true) {
              this.documentForm.certificate = 1
            } else {
              this.documentForm.certificate = 0
            }
            if (this.documentForm.outside === true) {
              this.documentForm.outside = 1
            } else {
              this.documentForm.outside = 0
            }
            this.tempPa =  this.documentForm.department[this.documentForm.department.length - 1]
            this.documentForm.department = this.documentForm.department[this.documentForm.department.length - 1]
            console.log(this.documentForm)
            let params = {
              documentDO: this.documentForm,
              attachementList: this.$refs.adjunct.fileFormList
            };
            axios.post('/api/securityDocument?type=' + this.flag + '&recordId=' + this.recordId, params)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                    this.$message({type: 'success', message: this.flag === 3 ? '新增档案成功' : '修改档案成功'})
                  this.saveFlag = 1
                  if (this.flag === 3 || this.flag === 4) {
                    this.documentForm.id = data.data.id
                  }
                  if (this.documentForm.type === 1) {
                    this.documentForm.type = true
                  } else {
                    this.documentForm.type = false
                  }
                  if (this.documentForm.certificate === 1) {
                    this.documentForm.certificate = true
                  } else {
                    this.documentForm.certificate = false
                  }
                  if (this.documentForm.outside === 1) {
                    this.documentForm.outside = true
                  } else {
                    this.documentForm.outside = false
                  }
                } else {
                  let msg = {type: 'error', message: (this.flag === 3 ? '新增档案失败:' : '修改档案失败:') + data.message}
                  if (this.documentForm.type === 1) {
                    this.documentForm.type = true
                  } else {
                    this.documentForm.type = false
                  }
                  if (this.documentForm.certificate === 1) {
                    this.documentForm.certificate = true
                  } else {
                    this.documentForm.certificate = false
                  }
                  if (this.documentForm.outside === 1) {
                    this.documentForm.outside = true
                  } else {
                    this.documentForm.outside = false
                  }
                  this.$message(msg)
                }
              })
              .catch(response => {
                this.$message({type: 'error', message: '服务器或网络异常'})
              })
          } else {
            return false
          }
        })
        this.documentForm.department = this.tempPa
      },
      getDocumentInfo () {
        axios.get('/api/securityDocument/' + this.documentForm.id)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.documentForm = data.data
              if (this.documentForm.trainingMethod === '0') {
                this.documentForm.trainingMethod = '日常'
              } else if (this.documentForm.trainingMethod === '1') {
                this.documentForm.trainingMethod = '初训'
              } else if (this.documentForm.trainingMethod === '2') {
                this.documentForm.trainingMethod = '复训'
              } else if (this.documentForm.trainingMethod === '3') {
                this.documentForm.trainingMethod = '其他'
              }
              if (this.documentForm.trainingType === '0') {
                this.documentForm.trainingType = '自学'
              } else if (this.documentForm.trainingType === '1') {
                this.documentForm.trainingType = '授课'
              } else if (this.documentForm.trainingType === '2') {
                this.documentForm.trainingType = '实操'
              }
              if (this.documentForm.certificate === 0) {
                this.documentForm.certificate = false
              } else {
                this.documentForm.certificate = true
              }
              if (this.documentForm.outside === 0) {
                this.documentForm.outside = false
              } else {
                this.documentForm.outside = true
              }
              if (this.documentForm.type === 0) {
                this.documentForm.type = false
              } else {
                this.documentForm.type = true
              }
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      getTrainCateList () {
        axios.get('/api/system/dictionary/by_type?dictType=TRAINING_CATE')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.trainCateList = page
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      // 点击变换箭头方向
      tiggleAction () {
        if (this.$refs.upDown.className === 'icon-arrow-down') {
          this.$refs.upDown.className = 'icon-arrow-up'
        } else {
          this.$refs.upDown.className = 'icon-arrow-down'
        }
      },
      historyTiggleAction () {
        if (this.$refs.historyRef.className === 'icon-arrow-down') {
          this.$refs.historyRef.className = 'icon-arrow-up'
        } else {
          this.$refs.historyRef.className = 'icon-arrow-down'
        }
      },
      basicAction () {
        if (this.$refs.basicDirection.className === 'icon-arrow-down') {
          this.$refs.basicDirection.className = 'icon-arrow-up'
        } else {
          this.$refs.basicDirection.className = 'icon-arrow-down'
        }
      }
    },
    mounted () {
      // 立项部门
      getDepartmentList().then(result => {
        this.submitDeptNameList = result
        //  console.log(result)
      })
    },
    created () {
      if (process.env.NODE_ENV === 'production') {
        this.uploadUrl = 'http://' + window.location.hostname + ':' + window.location.port + '/file/upload'
      } else {
        this.uploadUrl = 'http://47.98.173.73:8080/file/upload'
      }
      this.flag = +this.$route.params.flag
      //查看
      if (this.flag === 1) {
        this.documentForm.id = +this.$route.params.id
        this.getDocumentInfo()
        //编辑
      } else if (this.flag === 2) {
        this.documentForm.id = +this.$route.params.id
        this.getDocumentInfo()
        //考试跳转新建
      } else if (this.flag === 3) {
        this.recordId = +this.$route.params.id
        this.getScoreInfo()
        //查询页面新建
      } else if (this.flag === 4) {}
      if (this.flag !== 1) {
        this.uploadFlag = 1
        this.getTrainCateList ()
        this.getStaffTypList ()
      } else {
        this.uploadFlag = 2
      }
    }
  }
</script>

<style scoped>

</style>
