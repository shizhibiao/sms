<template>
  <div class='animated fadeIn'>
    <b-card no-body>
      <div slot='header'>
        <div class="float-right">
          <el-button size="small" type='success' class='mt-1' v-if="this.flag !== 1"
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
        <el-form :model="standardForm" :rules="rules" ref="standardForm" status-icon size="medium" label-width="120px" inline-message>
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="设备名称" prop="tsesName">
                <el-input v-if="this.flag === 1" v-model="standardForm.tsesName" readonly auto-complete="off"></el-input>
                <el-input v-else v-model="standardForm.tsesName" auto-complete="off"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="设备类型" prop="tsesType" style="width: auto">
                <el-input v-if="this.flag === 1" readonly v-model="standardForm.tsesTypeName" auto-complete="off"></el-input>
                <el-select v-else v-model="standardForm.tsesType"  placeholder="请选择设备类型">
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
              <el-form-item label="是否需要设备许可证书" prop="tsesCertificatied" label-width="200px">
                <el-switch
                  v-if="this.flag === 1"
                  v-model="standardForm.tsesCertificatied"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                  disabled
                >
                </el-switch>
                <el-switch
                  v-else
                  v-model="standardForm.tsesCertificatied"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                >
                </el-switch>
              </el-form-item>
            </div>
          </div>
              <el-form-item label="设备技术标准" prop="tsesTecStandard" style="margin-top: 10px">
                <el-input v-if="this.flag === 1" readonly type="textarea" :rows="3" v-model="standardForm.tsesTecStandard" auto-complete="off"></el-input>
                <el-input v-else type="textarea" :rows="3" v-model="standardForm.tsesTecStandard" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="设备报废标准" prop="tsesScrappedStandard" style="margin-top: 10px">
                <el-input  v-if="this.flag === 1" readonly type="textarea" :rows="3" v-model="standardForm.tsesScrappedStandard" auto-complete="off"></el-input>
                <el-input  v-else type="textarea" :rows="3" v-model="standardForm.tsesScrappedStandard" auto-complete="off"></el-input>
              </el-form-item>
        </el-form>
      </b-card-body>
    </b-card>
    <adjunct
      ref='adjunct'
      :action="uploadUrl"
      :safetyId ='this.standardForm.tsesId'
      tableName='t_sequipment_standard'
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
    name: 'standard-edit',
    components: {
      adjunct
    },
    data () {
      return {
        uploadUrl: '',
        flag: 0,
        saveFlag: 0,
        eqTypeList: [],
        fullscreenLoading: false,
        standardForm: {
          tsesId: 0,
          tsesName: '',
          tsesTypeName: '',
          tsesType: '',
          tsesTecStandard: '',
          tsesScrappedStandard: '',
          tsesCertificatied: false,
          tsesIsfinished: '',
          tsesNubmer: '',
          tsesCreatetime: '',
          tsesCreateby: ''
        },
        rules: {
          tsesName: [
            { required: true, message: '请输入设备名称', trigger: 'blur' }
          ],
          tsesType: [
            { required: true, message: '请选择设备类型', trigger: 'blur' }
          ],
          tsesCertificatied: [
            { required: true, message: '请选择是否需要许可证书', trigger: 'blur' }
          ],
          tsesTecStandard: [
            { required: true, message: '请输入设备技术标准', trigger: 'blur' }
          ],
          tsesScrappedStandard: [
            { required: true, message: '请输入设备报废标准', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      getData () {
        axios.get('/api/eq_management/standard/' + this.standardForm.tsesId)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.standardForm = data.data
              if (data.data.tsesCertificatied === 0) {
                this.standardForm.tsesCertificatied = false
              } else {
                this.standardForm.tsesCertificatied = true
              }
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
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
      // 文件上传失败时
      uploadError(err, file, fileList) {
        this.$message({
          type: 'error',
          message: '文件上传失败' + err
        })
      },
      submitData () {
        if (this.saveFlag === 1) {
          this.$message({type: 'error', message: '请勿重复保存！'})
          return
        }
        this.fullscreenLoading = true
        this.$refs.standardForm.validate((valid) => {
          if (valid) {
            if (this.flag === 3) {
              this.standardForm.tsesId = 0
              this.standardForm.tsesCreatetime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
              this.standardForm.tsesCreateby = this.user.userId
            }
            if (this.standardForm.tsesCertificatied === true) {
              this.standardForm.tsesCertificatied = 1
            } else {
              this.standardForm.tsesCertificatied = 0
            }
            console.log(this.standardForm)
            let params = {
              sequipmentStandardDO: this.standardForm,
              attachementList: this.$refs.adjunct.fileFormList
            };
            axios.post('/api/eq_management/standard', params)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                  this.$message({type: 'success', message: this.flag === 3 ? '新增设备标准成功' : '修改设备标准成功'})
                  this.saveFlag = 1
                  if (this.flag === 3) {
                    this.standardForm.tsesId = data.data.tsesId
                  }
                  if (this.standardForm.tsesCertificatied === 1) {
                    this.standardForm.tsesCertificatied = true
                  } else {
                    this.standardForm.tsesCertificatied = false
                  }
                } else {
                  let msg = {type: 'error', message: (this.flag === 3 ? '新增设备标准失败:' : '修改设备标准失败:') + data.message}
                  if (this.standardForm.tsesCertificatied === 1) {
                    this.standardForm.tsesCertificatied = true
                  } else {
                    this.standardForm.tsesCertificatied = false
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
          this.fullscreenLoading = false
        })
      },
      resetInfo () {
        this.standardForm = {}
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
      this.standardForm.tsesId = +this.$route.params.tsesId
      this.flag = +this.$route.params.flag
      if (this.flag !== 3) {
        this.getData()
      }
      if (this.flag !== 1) {
        this.getEqTypeList()
      }
    }
  }
</script>

<style scoped>

</style>

