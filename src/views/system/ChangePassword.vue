<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="6">
        <b-card>
          <div slot="header">
            修改密码
            <!--<button class="btn btn-info btn-sm float-right mt-0" @click="$router.back(-1)">-->
              <!--<i class="fa fa-back"></i> 返回-->
            <!--</button>-->
          </div>
          <b-col md="9" class="mt-4">
            <el-form :model="ruleForm" status-icon :inline-message="true" :rules="rules" ref="ruleForm"
                     label-width="120px" class="demo-ruleForm" size="medium">
              <el-form-item label="原密码" prop="oldPassword">
                <el-input type="password" v-model="ruleForm.oldPassword" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="ruleForm.newPassword" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPasd">
                <el-input type="password" v-model="ruleForm.confirmPasd" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm()">提交</el-button>
                <el-button type="info" @click="$router.back(-1)">返回</el-button>
              </el-form-item>
            </el-form>
          </b-col>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'change-password',
    data () {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        userId: -1,
        ruleForm: {
          oldPassword: '',
          newPassword: '',
          confirmPasd: ''
        },
        rules: {
          oldPassword: [
            {required: true, message: '请输入原密码', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          newPassword: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          confirmPasd: [
            {validator: validatePass2, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            axios.get('/api/system/user/' + this.userId + '/paswd?oldp=' + this.ruleForm.oldPassword + '&newp=' + this.ruleForm.newPassword)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                  this.$message({type: 'success', message: '密码修改成功'})
                } else {
                  let msg = {type: 'error', message: '密码修改失败:' + data.message}
                  this.$message(msg)
                }
              })
              .catch(response => {
                this.$message({type: 'error', message: '密码修改失败'})
              })
          } else {
            return false
          }
        })
      }
    },
    created () {
      this.userId = +this.$route.params.id
    }
  }
</script>

<style scoped>

</style>
