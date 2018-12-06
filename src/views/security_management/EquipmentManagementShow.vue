<template>
  <div class='animated fadeIn'>
    <b-card no-body>
      <div slot='header'>
        <div class="float-right">
          <el-button size="small" type='success' class='mt-1'
                     @click="submitData()"
                     element-loading-text="正在保存..."
                     element-loading-spinner="el-icon-loading"
                     element-loading-background="rgba(0, 0, 0, 0.1)"
                     v-loading.fullscreen.lock="fullscreenLoading"><i class='fa fa-save'></i> 保存</el-button>
          <el-button size="small" type="primary" class='mt-1' v-if="this.flag === 3" @click="resetInfo()" ><i class='fa fa-refresh'></i> 重置</el-button>
          <el-button size="small" type="info" class='mt-1' @click="$router.back(-1)" ><i class="fa fa-back"></i> 返回</el-button>
        </div>
      </div>
      <b-card-body>
        <el-form :model="managementForm" :rules="rules" ref="managementForm" status-icon size="medium" label-width="120px" inline-message>
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="批次编号" prop="tesmBatch">
                <el-input v-model="managementForm.tesmBatch" auto-complete="off"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="生成厂商" prop="tesmCreator">
                <el-input v-model="managementForm.tesmCreator" auto-complete="off"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="设备类型" prop="tesmType" style="width: auto">
                <el-select v-model="managementForm.tesmType"  placeholder="请选择设备类型">
                  <el-option
                    v-for="item in eqTypeList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="设备名称" prop="tesmName" style="width: auto">
                <el-select v-model="managementForm.tesmName"  placeholder="请选择设备名称">
                  <el-option
                    v-for="item in eqNameList"
                    :key="item.tsesName"
                    :label="item.tsesName"
                    :value="item.tsesName">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="设备型号" prop="tesmModel">
                <el-input v-model="managementForm.tesmModel" auto-complete="off"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="数量" prop="tesmNumber">
                <el-input v-model.number="managementForm.tesmNumber" auto-complete="off"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="有效期" prop="tesmEnddate">
                <el-date-picker v-model="managementForm.tesmEnddate" type="datetime" style="width: 100%"
                                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </b-card-body>
    </b-card>
    <adjunct
      ref='adjunct'
      :action="uploadUrl"
      :safetyId ='this.managementForm.tesmId'
      tableName='t_sequipment_management'
      :flag="this.flag === 1 ? 2 : ''"
      :uploadFile="this.flag === 2 ? true : false"
      :onerror="uploadError"
    >
    </adjunct>
  </div>
</template>

<script>
  import axios from 'axios'
  import { formatDate } from '../../utils/index.js'
  import adjunct from "../../components/System/security_notice/SecurityNoticeAdjunct";
  export default {
    name: 'management-edit',
    components: {
      adjunct
    },
    data () {
      return {
        uploadUrl: '',
        flag: 0,
        saveFlag: 0,
        eqTypeList: [],
        eqNameList: [],
        fullscreenLoading: false,
        managementForm: {
          tesmId: 0,
          tesmName: '',
          tesmType: '',
          tesmBatch: '',
          tesmCreator: '',
          tesmModel: '',
          tesmNumber: '',
          tesmEnddate: '',
          tesmCreatedate: '',
          tesmCreateby: 0,
          tesmCreatedept: 0
        },
        rules: {
          tesmBatch: [
            { required: true, message: '请输入编号批次', trigger: 'blur' }
          ],
          tesmType: [
            { required: true, message: '请选择设备类型', trigger: 'blur' }
          ],
          tesmName: [
            { required: true, message: '请输入设备名称', trigger: 'blur' }
          ],
          tesmModel: [
            { required: true, message: '请输入设备型号', trigger: 'blur' }
          ],
          tesmNumber: [
            { required: true, message: '数量不能为空', trigger: 'blur' },
            { type: 'number', message: '数量必须为数字值', trigger: 'blur' }
          ],
          tesmEnddate: [
            { required: true, message: '有效期不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      getData () {
        axios.get('/api/security_management/' + this.managementForm.tesmId)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.managementForm = data.data
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
      getEqTypeList () {
        axios.get('/api/system/dictionary/by_type?dictType=EQUIPMENT_TYPE')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.eqTypeList = page
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      submitData () {
        if (this.saveFlag === 1) {
          this.$message({type: 'error', message: '请勿重复保存！'})
          return
        }
        this.fullscreenLoading = true
        this.$refs.managementForm.validate((valid) => {
          if (valid) {
            if (this.flag === 3) {
              this.managementForm.tesmId = 0
              this.managementForm.tesmCreateby = this.user.userId
              this.managementForm.tesmCreatedept = this.user.deptId
            }
            this.managementForm.tesmCreatedate = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
            let params = {
              sequipmentManagementDO: this.managementForm,
              attachementList: this.$refs.adjunct.fileFormList
            };
            axios.post('/api/security_management', params)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                  this.$message({type: 'success', message: this.flag === 3 ? '新增设备标准成功' : '修改设备标准成功'})
                  this.saveFlag = 1;
                  if (this.flag === 3) {
                    this.managementForm.tesmId = data.data.tesmId
                  }
                } else {
                  let msg = {type: 'error', message: (this.flag === 3 ? '新增设备标准失败:' : '修改设备标准失败:') + data.message}
                  this.$message(msg)
                }
              })
              .catch(response => {
                this.$message({type: 'error', message: '服务器或网络异常'})
              })
          } else {
            return false
          }
          this.fullscreenLoading = false
        })
      },
      getEqNameList () {
        axios.get('/api/eq_management/standard/allName')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.eqNameList = page || []
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      resetInfo () {
        this.managementForm = {}
      }
    },
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    created () {
      if (process.env.NODE_ENV === 'production') {
        this.uploadUrl = 'http://' + window.location.hostname + ':' + window.location.port + '/file/upload'
      } else {
        this.uploadUrl = 'http://47.98.173.73:8080/file/upload'
      }
      this.managementForm.tesmId= +this.$route.params.tesmId
      this.flag = +this.$route.params.flag
      if (this.flag !== 3) {
        this.getData()
      }
      this.getEqTypeList()
      this.getEqNameList()
    }
  }
</script>

<style scoped>

</style>

