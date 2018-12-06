<template>
  <div class='animated fadeIn'>
    <b-card no-body>
      <b-card-header>
        基本信息
      </b-card-header>
      <b-card-body>
        <el-form :model="safetyForm" :rules="rules" ref="safetyForm" status-icon size="medium" label-width="120px" inline-message>
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="是否匿名" prop="anonymous">
                <el-switch
                  v-if="this.flag === 1"
                  v-model="safetyForm.anonymous"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                  disabled
                >
                </el-switch>
                <el-switch
                  v-else
                  v-model="safetyForm.anonymous"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                >
                </el-switch>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="!safetyForm.anonymous">
              <el-form-item label="报告人" prop="reporterName">
                <el-input v-if="this.flag === 2" v-model="safetyForm.reporterName" auto-complete="off"></el-input>
                <el-input v-else-if="this.flag === 3" v-model="safetyForm.reporterName" readonly auto-complete="off"></el-input>
                <span v-else><strong>{{this.safetyForm.reporterName}}</strong></span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="!safetyForm.anonymous">
              <el-form-item label="报告部门" prop="deptName">
                <el-select v-if="this.flag === 2" v-model="safetyForm.deptName" filterable clearable placeholder="请选择报告部门">
                  <el-option
                    v-for="item in deptList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <el-input v-else-if="this.flag === 3" v-model="safetyForm.deptName" readonly auto-complete="off"></el-input>
                <span v-else><strong>{{this.safetyForm.deptName}}</strong></span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="提交日期" prop="reportDate" style="width: auto">
                <el-date-picker v-if="this.flag !== 1" v-model="safetyForm.reportDate" type="datetime" style="width: 100%"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                <span v-else><strong>{{ this.safetyForm.reportDate }}</strong></span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="机型" prop="acType">
                <el-input v-if="this.flag === 1" v-model="safetyForm.acType" readonly auto-complete="off"></el-input>
                <el-input v-else v-model="safetyForm.acType" auto-complete="off"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="归属地" prop="infoBelong" >
                <el-switch
                  v-if="this.flag === 1"
                  v-model="safetyForm.infoBelong"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="国外"
                  inactive-text="国内"
                  disabled
                >
                </el-switch>
                <el-switch
                  v-else
                  v-model="safetyForm.infoBelong"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="国外"
                  inactive-text="国内"
                >
                </el-switch>
              </el-form-item>
            </div>
            <!-- <div class="col-lg-4 col-md-6 col-sm-12"></div> -->
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="事件等级" prop="eventGrade" style="width: auto">
                <el-input v-if="this.flag === 1" readonly v-model="safetyForm.eventGradeName" auto-complete="off"></el-input>
                <el-select v-else v-model="safetyForm.eventGrade" filterable clearable placeholder="请选择事件等级">
                  <el-option
                    v-for="item in levelList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="事件类型" prop="eventType" style="width: auto">
                <el-input v-if="this.flag === 1" readonly v-model="safetyForm.eventTypeName" auto-complete="off" ></el-input>
                <el-select v-else v-model="safetyForm.eventType" filterable clearable placeholder="请选择事件类型" >
                  <el-option
                    v-for="item in typeList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="原因分类" prop="causeType" style="width: auto">
                <el-input v-if="this.flag === 1" readonly v-model="safetyForm.causeTypeName" auto-complete="off" ></el-input>
                <el-select v-else v-model="safetyForm.causeType" filterable clearable placeholder="请选择原因分类" >
                  <el-option
                    v-for="item in causeList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="发生地点" prop="occurAddress" style="width: auto">
                <el-input v-if="this.flag === 1" v-model="safetyForm.occurAddress" readonly auto-complete="off" ></el-input>
                <el-input v-else v-model="safetyForm.occurAddress"  auto-complete="off" ></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="发生日期" prop="occurDate" style="width: auto">
                <el-date-picker v-if="this.flag === 1" readonly v-model="safetyForm.occurDate" type="datetime" style="width: 100%"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                <el-date-picker v-else v-model="safetyForm.occurDate" type="datetime" style="width: 100%"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="标题" prop="title">
            <el-input v-if="this.flag === 1" v-model="safetyForm.title" readonly auto-complete="off"></el-input>
            <el-input v-else placeholder="请输入标题" v-model="safetyForm.title" class="input-with-select" maxlength="200">
              <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 140px;" @change="selectAction">
                <el-option v-for="(item, index) in ALL_SELECT_DATA.SAFETY_INFORMATION.dicts" :key="index" :label="item.dictCode" :value="item.dictCode"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="事件经过模板">
            <el-select v-model="incident" placeholder="请选择" style="width: 140px;" @change="selectActionIncident">
              <el-option v-for="(item, index) in ALL_SELECT_DATA.SAFETY_INCIDENT.dicts" :key="index" :label="item.dictCode" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="事件经过" prop="eventDesc" >
            <el-input v-if="this.flag === 1" readonly type="textarea" :rows="3" v-model="safetyForm.eventDesc" auto-complete="off"></el-input>
            <el-input v-else type="textarea" :rows="3" v-model="safetyForm.eventDesc" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="事件后果" prop="eventAftermath" style="margin-top: 10px">
            <el-input  v-if="this.flag === 1" readonly type="textarea" :rows="3" v-model="safetyForm.eventAftermath" auto-complete="off"></el-input>
            <el-input  v-else type="textarea" :rows="3" v-model="safetyForm.eventAftermath" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="风险提示" prop="riskHint" style="margin-top: 10px">
            <el-input  v-if="this.flag === 1" readonly type="textarea" :rows="3" v-model="safetyForm.riskHint" auto-complete="off"></el-input>
            <el-input  v-else type="textarea" :rows="3" v-model="safetyForm.riskHint" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </b-card-body>
    </b-card>
    <!-- 附件上传 -->
    <adjunct
      ref='adjunct'
      :action="uploadUrl"
      :safetyId ='this.safetyForm.reportNumber'
      tableName='t_trade_security_info'
      :flag="this.flag === 1 ? 2 : ''"
      :uploadFile="this.flag === 2 ? true : false"
      :onerror="uploadError"
    >
    </adjunct>
    <b-card no-body>
      <b-card-body>
        <div class="text-center">
          <el-button size="small" type='primary' class='mt-1' v-if="this.flag !== 1"  @click="submitData()" >保存</el-button>
          <!-- <el-button size="small" type="primary" class='mt-1' v-if="this.flag === 3" @click="resetInfo()" >重置</el-button> -->
          <el-button size="small" type="success" class='mt-1' v-if="this.flag !== 1 && this.saveFlag === 1" @click="sendMes()"> 发送</el-button>
          <el-button size="small" type="success" class='mt-1' v-else-if="this.flag !== 1 && this.saveFlag !== 1" disabled @click="sendMes()" > 发送</el-button>
          <el-button size="small" class='mt-1' @click="$router.back(-1)" ><i class="fa fa-back"></i> 返回</el-button>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
    // 附件上传
    import adjunct from "../../components/System/security_notice/SecurityNoticeAdjunct";
    import axios from 'axios'
    import { formatDate } from '../../utils/index.js'
    export default {
      name: 'news_edit',
      components: {
        adjunct
      },
      data () {
        return {
          uploadUrl: '',
          flag: 0,
          saveFlag: 0,
          typeList: [],
          levelList: [],
          causeList: [],
          deptList: [],
          safetyForm: {
            reportNumber: 0,
            anonymous: false,
            reporterName: '',
            reporter: 0,
            deptId: 0,
            deptName: '',
            reportDate: '',
            title: '',
            occurDate: '',
            occurAddress: '',
            infoBelong: false,
            acType: '',
            eventGrade: '1',
            eventType: '1',
            causeType: '1',
            eventDesc: '',
            eventAftermath: '',
            riskHint: '',
            eventGradeName: '',
            eventTypeName: '',
            causeTypeName: ''
          },
          rules: {
            title: [
              { required: true, message: '请输入标题', trigger: 'blur' }
            ],
            occurDate: [
              { required: true, message: '发生日期不能为空', trigger: 'blur' }
            ]
          },
          // 标题对应的数据
          select: '',
          // 事情经过对应数据
          incident: ''
        }
      },
      computed: {
        // 所有数据字典中的数据
        ALL_SELECT_DATA () {
          return this.$store.state.ALL_SELECT_DATA
        },
        user () {
          return this.$store.state.user
        }
      },
      watch: {
        safetyForm: function (newValue, oldValue) {
          if (newValue !== oldValue) {
            this.saveFlag = 0
          }
        }
      },
      methods: {
        getData () {
          axios.get('/api/reportIndustrySafety/' + this.safetyForm.reportNumber)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.safetyForm = data.data
                if (data.data.infoBelong === 0) {
                  this.safetyForm.infoBelong = false
                } else {
                  this.safetyForm.infoBelong = true
                }
                if (data.data.anonymous === 0) {
                  this.safetyForm.anonymous = false
                } else {
                  this.safetyForm.anonymous = true
                }
              } else {
                this.$message({
                  type: 'error',
                  message: '请求失败：' + data.message
                })
              }
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '请求失败：' + error
              })
            })
        },
        // 文件上传失败时
        uploadError(err, file, fileList) {
          this.$message({
            type: 'error',
            message: '文件上传失败' + err
          })
        },
        getTypeList () {
          axios.get('/api/system/dictionary/by_type?dictType=EVENT_TYEP')
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                let page = data.data
                this.typeList = page
              } else {
                this.$message({
                  type: 'error',
                  message: '请求失败：' + data.message
                })
              }
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '请求失败：' + error
              })
            })
        },
        sendMes () {
          let url = '/mail/send-mail/1/'+ this.safetyForm.reportNumber
          this.$router.push({path: url})
        },
        getLevelList () {
          axios.get('/api/system/dictionary/by_type?dictType=EVENT_LEVEL')
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                let page = data.data
                this.levelList = page
              } else {
                this.$message({
                  type: 'error',
                  message: '请求失败：' + data.message
                })
              }
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '请求失败：' + error
              })
            })
        },
        getCauseList () {
          axios.get('/api/system/dictionary/by_type?dictType=REASON_TYEP')
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                let page = data.data
                this.causeList = page
              } else {
                this.$message({
                  type: 'error',
                  message: '请求失败：' + data.message
                })
              }
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '请求失败：' + error
              })
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
                // console.log('====' + list)
              } else {
                this.$message({
                  type: 'error',
                  message: '请求失败：' + data.message
                })
              }
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '请求失败：' + error
              })
            })
        },
        submitData () {
          if (this.saveFlag === 1) {
            this.$message({type: 'error', message: '请勿重复保存！'})
          } else {
          this.$refs.safetyForm.validate((valid) => {
            if (valid) {
              if (this.flag === 3) {
                this.safetyForm.reportNumber = 0
                this.safetyForm.reporter = this.user.userId
                this.safetyForm.reporterName = this.user.userName
                this.safetyForm.deptId = this.user.deptId
                this.safetyForm.deptName = this.user.deptName
              }
              if (this.safetyForm.anonymous === true) {
                this.safetyForm.anonymous = 1
              } else {
                this.safetyForm.anonymous = 0
              }
              if (this.safetyForm.infoBelong === true) {
                this.safetyForm.infoBelong = 1
              } else {
                this.safetyForm.infoBelong = 0
              }
              let params = {
                reportIndustrySafetyDo: this.safetyForm,
                attachementList: this.$refs.adjunct.fileFormList
              };
              axios.post('/api/reportIndustrySafety', params)
                .then(response => {
                  let data = response.data
                  if (data && data.error === 0) {
                    this.$message({type: 'success', message: this.flag === 3 ? '新增行业安全信息成功' : '修改行业安全信息成功'})
                    this.saveFlag = 1;
                    if (this.flag === 3) {
                      this.safetyForm.reportNumber = data.data.reportNumber
                    }
                    if (this.safetyForm.anonymous === 1) {
                      this.safetyForm.anonymous = true
                    } else {
                      this.safetyForm.anonymous = false
                    }
                    if (this.safetyForm.infoBelong === 1) {
                      this.safetyForm.infoBelong = true
                    } else {
                      this.safetyForm.infoBelong = false
                    }
                  } else {
                    let msg = {type: 'error', message: (this.flag === 3 ? '新增行业安全信息失败:' : '修改行业安全信息失败:') + data.message}
                    if (this.safetyForm.anonymous === 1) {
                      this.safetyForm.anonymous = true
                    } else {
                      this.safetyForm.anonymous = false
                    }
                    if (this.safetyForm.infoBelong === 1) {
                      this.safetyForm.infoBelong = true
                    } else {
                      this.safetyForm.infoBelong = false
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
        }
        },
        resetInfo () {
          this.safetyForm = {
            reporterName: this.user.userName,
            deptName: this.user.deptName
          }
        },
        // 标题模板
        selectAction () {
          let titles = this.ALL_SELECT_DATA.SAFETY_INFORMATION.dicts
          if (titles.length > 0) {
            for (var i = 0; i < titles.length; i++) {
              if (this.select === titles[i].dictCode) {
                this.safetyForm.title = titles[i].dictName
              }
            }
          }
        },
        // 事情简要经过模板
        selectActionIncident () {
          let titles = this.ALL_SELECT_DATA.SAFETY_INCIDENT.dicts
          if (titles.length > 0) {
            for (var i = 0; i < titles.length; i++) {
              if (this.incident === titles[i].dictCode) {
                this.safetyForm.eventDesc = titles[i].dictName
              }
            }
          }
        }
      },
      created () {
        if (process.env.NODE_ENV === 'production') {
          this.uploadUrl = 'http://' + window.location.hostname + ':' + window.location.port + '/file/upload'
        } else {
          this.uploadUrl = 'http://47.98.173.73:8080/file/upload'
        }
        this.safetyForm.reportNumber = +this.$route.params.reportNumber
        this.flag = +this.$route.params.flag
        if (this.flag !== 3) {
          this.getData()
        }
        if (this.flag === 3) {
          this.safetyForm.reporterName = this.user.userName
          this.safetyForm.deptName = this.user.deptName
          this.safetyForm.reportDate = formatDate(new Date(),"yyyy-MM-dd")
        }
        if (this.flag !== 1) {
          this.getTypeList()
          this.getCauseList()
          this.getLevelList()
          this.getDeptList()
        }
      }
    }
</script>

<style scoped>

</style>
