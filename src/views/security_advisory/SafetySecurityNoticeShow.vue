<template>
  <div class='animated fadeIn'>
    <b-card no-body>
      <div slot='header'>
        基本信息
      </div>
      <b-card-body>
        <el-form :model="safetyForm" :rules="rules" ref="safetyForm" status-icon size="medium" label-width="120px" inline-message>
          <div class="row">
            <div class="col-md-4">
              <el-form-item label="报告人" prop="issuerName">
                <el-input v-if="this.flag === 2" v-model="safetyForm.issuerName" auto-complete="off" style="width: 100%"></el-input>
                <el-input v-if="this.flag === 3" v-model="this.safetyForm.reporterName" readonly auto-complete="off" style="width: 100%"></el-input>
                <strong><el-input v-if="this.flag === 1" v-model="safetyForm.issuerName" readonly auto-complete="off" style="width: 100%"></el-input></strong>
              </el-form-item>
            </div>
            <div class="col-md-4">
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <el-form-item label="标题" prop="noticeTitle">
                <el-input v-if="this.flag === 1" v-model="safetyForm.noticeTitle" readonly auto-complete="off" style="width: 100%"></el-input>
                <el-input v-else v-model="safetyForm.noticeTitle" auto-complete="off" style="width: 100%"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <el-form-item label="公告类型" prop="noticeTypeName" style="width: auto">
                <el-input v-if="this.flag === 1" readonly v-model="safetyForm.noticeTypeName" auto-complete="off" style="width: 100%"></el-input>
                <el-select v-else v-model="safetyForm.noticeType" filterable clearable placeholder="请选择公告类型" style="width: 100%">
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
          <div class="row">
            <div class="col-md-12">
              <el-form-item label="正文内容" prop="content">
                <el-input v-if="this.flag === 1" readonly type="textarea" :rows="3" v-model="safetyForm.content" auto-complete="off"></el-input>
                <el-input v-else type="textarea" :rows="3" v-model="safetyForm.content" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </b-card-body>
    </b-card>
    <!-- 附件上传 -->
    <adjunct
      ref='adjunct'
      :action="uploadUrl"
      :safetyId ='this.safetyForm.noticeId'
      tableName='t_security_notice'
      :flag="this.flag === 1 ? 2 : ''"
      :uploadFile="this.flag === 2 ? true : false"
      :onerror="uploadError"
    >
    </adjunct>
    <b-card no-body>
      <b-card-body>
        <div style="text-align: center;">
          <button class='btn btn-success mt-1' v-if="this.flag !== 1"  @click="saveData()" ><i class='fa fa-save'></i> 保存</button>
          <button class='btn btn-success mt-1' v-if="this.flag === 3"  @click="submitData()" :disabled="sendActin === 'false'"><i class='fa fa-save'></i> 发布</button>
          <button class='btn btn-success mt-1' v-if="this.flag === 2 && this.safetyForm.isSend === 0"  @click="submitData()" ><i class='fa fa-save'></i> 发布</button>
          <button class='btn btn-success mt-1' v-if="this.flag === 2 && this.safetyForm.isSend === 1"  @click="cancel()" ><i class='fa fa-save'></i> 取消发布</button>
          <button class='btn btn-primary mt-1' v-if="this.flag === 3" @click="resetInfo()" ><i class='fa fa-refresh'></i> 重置</button>
          <button class='btn btn-info mt-1' @click="$router.back(-1)" ><i class="fa fa-back"></i> 返回</button>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
  // 附件上传
  import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
  import adjunct from "../../components/System/security_notice/SecurityNoticeAdjunct";
  import axios from 'axios'
  export default {
    name: 'news_edit',
    components: {
      SecurityNoticeAdjunct,
      adjunct
    },
    data () {
      return {
        uploadUrl: '',
        saveFlag: 0,
        flag: 0,
        uploadFlag: 2,
        type: '',
        typeList: [],
        reporterName: '',
        safetyForm: {
          isSend: 0,
          type: '',
          noticeId: 0,
          issuer: 0,
          noticeTitle: '',
          content: '',
          noticeTypeName: '',
          createTime: '',
          issueTime: '',
          createDeptId: 0
        },
        rules: {
          noticeTitle: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          content: [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ]
        },
        // 发布按钮是否可以点击
        sendActin: 'false'
      }
    },
    methods: {
      getData () {
        axios.get('/api/securitynotice/' + this.safetyForm.noticeId)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.safetyForm = data.data
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      getTypeList () {
        axios.get('/api/system/dictionary/by_type?dictType=SECURITY_NOTICE')
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
      saveData () {
        this.$refs.safetyForm.validate((valid) => {
          if (valid) {
            if (this.saveFlag === 1) {
              this.$message({type: 'error', message: '请勿重复保存！'})
              return
            }
            if (this.flag === 3) {
              this.safetyForm.noticeId = 0
              this.safetyForm.issuer = this.user.userId
              this.safetyForm.createDeptId = this.user.deptId
            }
            // console.log(this.safetyForm)
            let params = {
              safetySecurityNoticeDo: this.safetyForm,
              attachementList: this.$refs.adjunct.fileFormList
            };
            axios.post('/api/securitynotice', params)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                  this.$message({type: 'success', message: this.flag === 3 ? '新增安全公告成功' : '修改安全公告成功'})
                  this.saveFlag = 1;
                  if (this.flag === 3) {
                    this.safetyForm.noticeId = data.data.tesmId
                  }
                  this.$router.push('/proclamation/post')
                } else {
                  let msg = {type: 'error', message: (this.flag === 3 ? '新增安全公告失败:' : '修改安全公告失败:') + data.message}
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
      // 文件上传失败时
      uploadError(err, file, fileList) {
        this.$message({
          type: 'error',
          message: '文件上传失败' + err
        })
      },
      submitData () {
        this.$confirm('确定发布该安全公告信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.put('/api/securitynotice/postSecurityNotice', this.safetyForm)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.$message({type: 'success', message: '发布安全公告成功'})
                this.$router.push('/proclamation/post')
              } else {
                let msg = {type: 'error', message: '安全公告发布失败:' + data.message}
                this.$message(msg)
              }
            })
            .catch(response => {
              this.$message({type: 'error', message: '服务器或网络异常'})
            })
        })
      },
      cancel () {
        this.$confirm('确定取消发布该安全公告信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.put('/api/securitynotice/cancelSecurityNotice', this.safetyForm)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.$message({type: 'success', message: '取消发布成功'})
                this.$router.back(-1)
              } else {
                let msg = {type: 'error', message: '取消发布失败:' + data.message}
                this.$message(msg)
              }
            })
            .catch(response => {
              this.$message({type: 'error', message: '服务器或网络异常'})
            })
        })
      },
      resetInfo () {
        this.safetyForm = {
          reporterName: this.user.userName
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
      this.flag = +this.$route.params.flag
      this.safetyForm.noticeId = +this.$route.params.noticeId
      if (this.flag === 1) {
        this.uploadFlag = 2
      } else {
        this.uploadFlag = 1
      }
      if (this.flag !== 3) {
        this.getData()
      }
      if (this.flag === 3) {
        this.safetyForm.issuer = this.user.userId
        this.safetyForm.reporterName = this.user.userName
      }
      if (this.flag !== 1) {
        this.getTypeList()
      }
    }
  }
</script>

<style scoped>

</style>
