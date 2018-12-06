<template>
  <div class='animated fadeIn'>
    <b-card no-body>
      <div slot='header'>
        <div class="float-right">
          <el-button size="small" type='success' class='mt-1' v-if="this.flag !== 1"  @click="submitData()" ><i class='fa fa-save'></i> 保存</el-button>
          <el-button size="small" type="primary" class='mt-1' v-if="this.flag === 3" @click="resetInfo()" ><i class='fa fa-refresh'></i> 重置</el-button>
          <el-button size="small" type="info" class='mt-1' @click="$router.back(-1)" ><i class="fa fa-back"></i> 返回</el-button>
        </div>
      </div>
      <b-card-body>
        <el-form :model="securityForm" :rules="rules" ref="securityForm" status-icon size="medium" label-width="120px" inline-message>
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="填写人" prop="tscCreatebyName">
                <el-input v-if="this.flag === 2" v-model="securityForm.tscCreatebyName" readonly auto-complete="off"></el-input>
                <el-input v-else-if="this.flag === 3" v-model="securityForm.tscCreatebyName" readonly auto-complete="off"></el-input>
                <span v-else><strong>{{this.securityForm.tscCreatebyName}}</strong></span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="填写部门" prop="tscCreatedeptName">
                <el-input v-if="this.flag === 2" v-model="securityForm.tscCreatedeptName" readonly auto-complete="off"></el-input>
                <el-input v-else-if="this.flag === 3" v-model="securityForm.tscCreatedeptName" readonly auto-complete="off"></el-input>
                <span v-else><strong>{{this.securityForm.tscCreatedeptName}}</strong></span>
              </el-form-item>
            </div>
            <div></div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="签约日期" prop="tscContractdate" style="width: auto">
                <el-date-picker v-if="this.flag !== 1" v-model="securityForm.tscContractdate" type="datetime" style="width: 100%"
                                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                <span v-else><strong>{{ this.securityForm.tscContractdate }}</strong></span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="到期日期" prop="tscEnddate" style="width: auto">
                <el-date-picker v-if="this.flag !== 1" v-model="securityForm.tscEnddate" type="datetime" style="width: 100%"
                                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                <span v-else><strong>{{ this.securityForm.tscEnddate }}</strong></span>
              </el-form-item>
            </div>
            <div class="col-lg-8 col-md-6 col-sm-12">
              <el-form-item label="签约方" prop="tscContracter">
                <el-input v-if="this.flag === 1" v-model="securityForm.tscContracter" readonly auto-complete="off"></el-input>
                <el-input v-else v-model="securityForm.tscContracter" auto-complete="off"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
            <el-form-item label="服务项目" prop="tscService">
              <el-input v-if="this.flag === 1" v-model="securityForm.tscService" readonly auto-complete="off"></el-input>
              <el-input v-else v-model="securityForm.tscService" auto-complete="off"></el-input>
            </el-form-item>
          </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="机场名称" prop="tscAirportName">
                <el-input v-if="this.flag === 1" v-model="securityForm.tscAirportName" readonly auto-complete="off"></el-input>
                <el-input v-else v-model="securityForm.tscAirportName" auto-complete="off"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="是否付费" prop="tscIspayed" >
                <el-switch
                  v-if="this.flag === 1"
                  v-model="securityForm.tscIspayed"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="付费"
                  inactive-text="不付费"
                  disabled
                >
                </el-switch>
                <el-switch
                  v-else
                  v-model="securityForm.tscIspayed"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="付费"
                  inactive-text="不付费"
                >
                </el-switch>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="涉及国家" prop="tscAirportName">
                <el-input v-if="this.flag === 1" v-model="securityForm.tscCountry" readonly auto-complete="off"></el-input>
                <el-input v-else v-model="securityForm.tscCountry" auto-complete="off"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="协议种类" prop="tscType" style="width: auto">
                <el-input v-if="this.flag === 1" readonly v-model="securityForm.tscTypeName" auto-complete="off" ></el-input>
                <el-select v-else v-model="securityForm.tscType" filterable clearable placeholder="请选择协议种类" >
                  <el-option
                    v-for="item in typeList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode">
                  </el-option>
                </el-select>
              </el-form-item>
          </div>
          </div>
          <!-- 附件上传 -->
          <adjunct
            ref='adjunct'
            :action="uploadUrl"
            :safetyId ='this.securityForm.tscId'
            tableName='t_security_contract'
            :flag="this.flag === 1 ? 2 : ''"
            :uploadFile="this.flag === 2 ? true : false"
            :onerror="uploadError"
          >
          </adjunct>
        </el-form>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
    import axios from 'axios'
    import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
    import adjunct from "../../components/System/security_notice/SecurityNoticeAdjunct";
    export default {
      name: 'news_edit',
      components: {
        SecurityNoticeAdjunct,
        adjunct
      },
      data () {
        return {
          uploadUrl: '',
          flag: 0,
          saveFlag: 0,
          typeList: [],
          deptList: [],
          tscCreatedeptName: '',
          tscCreatebyName: '',
          securityForm: {
            tscCountry: '',
            tscId: 0,
            tscCreateby: 0,
            tscCreatedept: 0,
            tscContractdate: '',
            tscEnddate: '',
            tscIspayed: false,
            tscContracter: '',
            tscService: '',
            tscType: '',
            tscTypeName: '',
            tscAirportName: '',
            tscStatus: 0
          },
          rules: {
            tscContracter: [
              { required: true, message: '请输入签约方', trigger: 'blur' }
            ],
            tscContractdate: [
              { required: true, message: '请输入签约日期', trigger: 'blur' }
            ],
            tscEnddate: [
              { required: true, message: '请输入到期日期', trigger: 'blur' }
            ]
          }
        }
      },
      methods: {
        getData () {
          axios.get('/api/securitycontract/' + this.securityForm.tscId)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.securityForm = data.data
                if (data.data.tscIspayed === 0) {
                  this.securityForm.tscIspayed = false
                } else {
                  this.securityForm.tscIspayed = true
                }
              } else {
                alert(data.message)
              }
            })
            .catch(response => {
              alert(response)
            })
        },
        getTypeList () {
          axios.get('/api/system/dictionary/by_type?dictType=SECURITY_CONTRACT')
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                let page = data.data
                this.typeList = page
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
        getDeptList () {
          axios.get('/api/system/dept/children')
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                let page = data.data
                let list = []
                for (var i = 0; i < page.length; i++) {
                  list[i] = page[i].deptName
                }
                this.deptList = list
                console.log('====' + list)
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
          this.$refs.securityForm.validate((valid) => {
            if (valid) {
              if (this.flag === 3) {
                this.securityForm.tscId = 0
                this.securityForm.tscCreateby = this.user.userId
                this.securityForm.tscCreatedept = this.user.deptId
              }
              if (this.securityForm.tscIspayed === true) {
                this.securityForm.tscIspayed = 1
              } else {
                this.securityForm.tscIspayed = 0
              }
              console.log(this.securityForm)
              let params = {
                securityContractDO: this.securityForm,
                attachementList: this.$refs.adjunct.fileFormList
              };
              console.log('=======' + params.securityContractDO.tscAirportName)
              console.log('=======' + params.securityContractDO.tscContracter)
              console.log('=======' + params.attachementList)
              axios.post('/api/securitycontract', params)
                .then(response => {
                  let data = response.data
                  if (data && data.error === 0) {
                    this.$message({type: 'success', message: this.flag === 3 ? '新增行业安全信息成功' : '修改行业安全信息成功'})
                    this.saveFlag = 1
                    if (this.flag === 3) {
                      this.securityForm.tscId = data.data.tscId
                    }
                  } else {
                    let msg = {type: 'error', message: (this.flag === 3 ? '新增行业安全信息失败:' : '修改行业安全信息失败:') + data.message}
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
        },
        resetInfo () {
          this.securityForm = {
            tscCreatebyName: this.user.userName,
            tscCreatedeptName: this.user.deptName
          }
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
        this.securityForm.tscId = +this.$route.params.tscId
        this.flag = +this.$route.params.flag
        if (this.flag !== 3) {
          this.getData()
        }
        if (this.flag === 3) {
          this.securityForm.tscCreatebyName = this.user.userName
          this.securityForm.tscCreatedeptName = this.user.deptName
        }
        if (this.flag === 2) {
          this.securityForm.tscCreatebyName = this.user.userName
          this.securityForm.tscCreateby = this.user.id
          this.securityForm.tscCreatedept = this.user.deptId
          this.securityForm.tscCreatedeptName = this.user.deptName
        }
        if (this.flag !== 1) {
          this.getTypeList()
          this.getDeptList()
        }
      }
    }
</script>

<style scoped>

</style>
