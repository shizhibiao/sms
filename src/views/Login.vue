<template>
  <div class="container-fluid main mr-0 ml-0" style="padding: 0px; margin: 0px;">
    <div class="row">
      <div class="logo">
        <div class="media" style="margin-top: 0px; margin-left: 30px; cursor: pointer;">
          <img src="/static/img/logo.png" style="height:70px;" class="media-object pull-left" alt='亚联航空'/>
          <div class="row"  style="font-size: 2.5em; padding: 20px; white-space:nowrap;">| 安全管理系统</div>
        </div>
      </div>
    </div>
    <div class="row">
        <div class="col-7">&nbsp;</div>
        <div class="col-3" style="margin-top: 200px">
          <div class="login">
            <div class="pt-4 pl-4 pr-4 pb-4">
                <h2>BAA 安全管理系统</h2>
                <hr>

                <div class="mt-4">
                  <b-input-group class="mb-3">
                    <div class="input-group-prepend"><span class="input-group-text"><i class="icon-user"></i></span></div>
                    <b-form-input type="text" autofocus
                                  class="form-control"
                                  v-model.trim="loginName"
                                  :state="nameState"
                                  placeholder="账户" required>
                    </b-form-input>
                    <b-form-invalid-feedback>
                      请输入登录账号
                    </b-form-invalid-feedback>
                    <b-form-valid-feedback>
                    </b-form-valid-feedback>
                  </b-input-group>
                </div>

                <div>
                  <b-input-group class="mb-4">
                    <div class="input-group-prepend"><span class="input-group-text"><i class="icon-lock"></i></span></div>
                    <b-form-input type="password"
                                  class="form-control"
                                  v-model.trim="password"
                                  :state="pwdState"
                                  @keyup.enter.native="doLogin()"
                                  placeholder="密码" required>
                    </b-form-input>
                    <b-form-invalid-feedback>
                      请输入账号密码
                    </b-form-invalid-feedback>
                    <b-form-valid-feedback>
                    </b-form-valid-feedback>
                  </b-input-group>
                </div>

                <b-row>
                  <b-col cols="6">
                    <b-button variant="primary" class="px-4" @click="doLogin()" :disabled="!nameState || !pwdState" style="width: 302px;"> 登录</b-button>
                  </b-col>

               <!--   <b-col cols="6">
                    <b-button variant="primary" class="px-4" @click="doLogin()" :disabled="!nameState || !pwdState" style="width: 302px;"> 登录</b-button>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    &lt;!&ndash;<b-button variant="link" class="px-0">Forgot password?</b-button>&ndash;&gt;
                  </b-col>-->
                </b-row>
            </div>
          </div>
        </div>
        <div class="col-2">&nbsp;</div>
    </div>
    <div class="row footer" style="margin: 0">
      <div style="text-align: center;">
        <p></p>
        <p>COPYRIGHT ©2018 亚联公务机有限公司 版权所有</p>
        <p>&nbsp;</p>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'login',
    data () {
      return {
        loginName: '',
        password: '',
        init: true
      }
    },
    computed: {
      nameState () {
        if (this.init) {
          return true
        } else {
          return this.loginName.length > 2
        }
      },
      pwdState () {
        if (this.init) {
          return true
        } else {
          return this.password.length > 2
        }
      }
    },
    methods: {
      doLogin () {
        if (this.init) {
          this.init = false
        }
        if (!this.nameState || !this.pwdState) {
          return
        }

        axios.get('/api/security/login?loginName=' + this.loginName + '&password=' + this.password)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let user = data.data
              this.$store.commit('loginState', true)
              this.$store.commit('loginUser', user)
              this.$store.commit('setterToken', user.token)
              this.$router.push({path: '/'})
            } else {
              let msg = {type: 'error', message: '登录失败:' + data.message}
              this.$message({type: 'error', message: msg})
            }
          })
          .catch(response => {
            this.$message({type: 'error', message: '服务器或网络异常'})
          })
      }
    }
  }
</script>

<style scoped>
   .logo {
    height: 85px;
    width: 100%;
    display: block;
    background-color: #f2f4f8;
    margin: 0;
  }
   .footer {

    padding-bottom: 5px;
    height: 100px;
    width: 100%;
    display: block;
    background-color: #f2f4f8;
     position:fixed; bottom:0;
  }
  .main {
    background-image: url('/static/img/baa/bg.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    height: 100%;
    width: 99%;
    min-height: 850px;
  }

  .login {
    background-image: url('/static/img/dh/bg_1.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
    min-width: 350px;
    max-width: 380px;
    border-radius: 2px;
    padding: 15px;
  }
</style>
