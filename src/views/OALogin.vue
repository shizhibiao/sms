<template>
  <div>

  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'oalogin',
    data () {
      return {
        loading: null,
        ltpa: ''
      }
    },
    methods: {
      openFullScreen () {
        this.loading = this.$loading({
          lock: true,
          text: '载入中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        })
      },
      oaLogin () {
        let url = 'http://oa.baasia.com/pro/sso/validate.do?ltpa=' + this.ltpa
        console.log(url)
        axios.post(url, "")
          .then(response => {
            this.loading.close()
            console.log(response.data)
            let flag = response.data.flag
            let username = response.data.username
            if (flag === '1' && username.length > 0) {
              axios.get('/api/security/oalogin?loginName=' + username)
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
                    this.$router.push({path: '/login'})
                  }
                })
                .catch(response => {
                  this.$message({type: 'error', message: '服务器或网络异常'})
                })
            } else {
              this.$router.push({path: '/login'})
            }
          })
          .catch(response => {
            this.loading.close()
            this.$message({type: 'error', message: '服务器或网络异常,请手动登录'})
            this.$router.push({path: '/login'})
          })
      }
    },
    created () {
      this.openFullScreen()
      this.ltpa = window.location.search
      if (this.ltpa && this.ltpa.length > 6) {
        this.ltpa = this.ltpa.substr(6)
        this.oaLogin()
      } else {
        this.$router.push({path: '/login'})
      }
    }
  }
</script>

<style scoped>

</style>
