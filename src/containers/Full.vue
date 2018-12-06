<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <breadcrumb :list="list"/>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <AppAside/>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
  import axios from 'axios'
  import {Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb} from '../components/'
  import {getAllDataAction} from '../services/safety_notice'
  export default {
    name: 'full',
    components: {
      AppHeader,
      Sidebar,
      AppAside,
      AppFooter,
      Breadcrumb
    },
    data () {
      return {
        user: null,
        websock: null,
        nav: []
      }
    },
    methods: {
      calcNav (funcs) {
        let navs = []
        for (let func of funcs) {
          let item0 = {}
          item0.title = true
          item0.name = func.funcName
          item0.wrapper = {element: 'span', attributes: {}}
          item0.class = 'text-center'
          item0.icon = func.funcIcon
          navs.push(item0)

          let children1 = func.children
          for (let c1 of children1) {
            let item1 = {}
            item1.name = c1.funcName
            item1.url = c1.funcUrl
            item1.icon = c1.funcIcon
            navs.push(item1)

            if (c1.children.length > 0) {
              let children2 = c1.children
              item1.children = []
              for (let c2 of children2) {
                let item2 = {}
                item2.name = c2.funcName
                item2.url = c2.funcUrl
                item2.icon = c2.funcIcon
                item1.children.push(item2)
              }
            }
          }
        }
        this.nav = navs
      },
      getUserFunctions (user) {
        if (user) {
          axios.get('/api/system/role?userId=' + user.userId)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                let functions = data.data
                this.$store.commit('setterFuncs', functions)
                this.calcNav(functions)
              } else {
                alert(data.message)
              }
            })
            .catch(response => {
              alert(response)
            })
        }
      },
      getUserRoles (user) {
        axios.get('/api/system/role/byuser?userId=' + user.userId)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let rs = data.data
              this.$store.commit('setterRoles', rs)
            }
          })
      },
      initWebSocket () { //初始化websocket
        let wsuri = null
        if (process.env.NODE_ENV === 'production') {
          wsuri = 'ws://' + window.location.hostname + ':' + window.location.port + '/websocket'
        } else {
          // wsuri = 'ws://10.26.136.17:8080/websocket'
          wsuri = 'ws://10.26.136.53:8080/websocket'
        }
        this.websock = new WebSocket(wsuri)
        this.websock.onopen = this.websocketOpen
        this.websock.onmessage = this.websocketOnMessage
        this.websock.onclose = this.websocketClose
        this.websock.onerror = this.websocketError
      },
      websocketOpen () { //打开
        console.log("WebSocket连接成功")
        let msg = {}
        msg.msgType = 'connect'
        msg.token = this.$store.state.token
        msg.userId = this.$store.state.user.userId
        this.websock.send(JSON.stringify(msg))
      },
      websocketOnMessage (e) { //数据接收
        let data = e.data
        if (data === "heartbeat") return

        let msg = JSON.parse(e.data)
        if (msg.hasOwnProperty('msgType') && msg.msgType === 'new_bill_push') {
          this.$store.commit('addMessage', msg)
        }
      },
      websocketClose () {  //关闭
        console.log("WebSocket关闭")
        this.websock.close()
        this.$router.push({path: '/login'})
      },
      websocketError () {  //失败
        console.log("WebSocket连接失败")
        this.$router.push({path: '/login'})
      },
      getFcLecData () {
        this.$store.commit('resetFcLecTypes', null)
        axios.get('/api/lecfc')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let datas = data.data
              for (let lecfcType of datas) {
                if (+lecfcType.code < 4) {
                  this.$store.commit('setterFcTypes', lecfcType)
                } else if (+lecfcType.code < 8) {
                  this.$store.commit('setterLecTypes', lecfcType)
                }
              }
            }
          })
      }
    },
    computed: {
      // user () {
      //   return this.$store.state.user
      // },
      name () {
        return this.$route.name
      },
      list () {
        return this.$route.matched
      }
    },
    created () {
      let user = this.$store.state.user
      this.nav = []
      this.getUserFunctions(user)
      this.getUserRoles(user)
      this.initWebSocket()
      this.getFcLecData()

      getAllDataAction().then(result => {
        this.$store.commit('setterAllSelectData', result)
      })
    },
    destroyed () {
      if (this.websock) {
        this.websock.close()
      }
    }
  }
</script>
