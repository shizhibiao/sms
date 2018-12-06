import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  logined: false, // false
  user: {},
  functions: [],
  token: null,
  roles: [],
  todoActiviTab: '',
  doneActiviTab: '',
  ALL_SELECT_DATA: {},
  statistics: '',
  msgList: [
  //   {
  //   msgType: 'new_bill_push',
  //   sysMessageDO: {
  //     id: 1,
  //     sourceNumber: 209,
  //     sourceTable: 't_safety_announement',
  //     title: '安全通知[测试]由其它流程导入，需进一步处理',
  //     content: '安全通知[测试]由其它流程导入，需进一步处理',
  //     sourceUrl: '/notify/edit/0?safetyId=209&theme=edit&flag=0',
  //     createdOn: 1,
  //     createTime: '2018-09-20 14:31:29'
  //   }
  // }
  ],
  fcTypes: [],
  lecTypes: []
}

const mutations = {
  loginUser (state, user) {
    state.user = user
  },
  setterFuncs (state, funcs) {
    state.functions = funcs
  },
  loginState (state, logined) {
    state.logined = logined
  },
  setterToken (state, token) {
    state.token = token
  },
  setterRoles (state, roles) {
    state.roles = roles
  },
  setterTodoActiviTab (state, tabName) {
    state.todoActiviTab = tabName
  },
  setterDoneActiviTab (state, tabName) {
    state.doneActiviTab = tabName
  },
  // 保留数据字典数据
  setterAllSelectData (state, data) {
    state.ALL_SELECT_DATA = data
  },
  addMessage (state, msg) {
    state.msgList.push(msg)
    console.log("收到一条消息, msgList.length=" + state.msgList.length)
  },
  removeMsg (state, index) {
    if (state.msgList.length > index) {
      state.msgList.splice(index, 1)
    }
  },
  setterFcTypes(state, data) {
    state.fcTypes.push(data)
  },
  setterLecTypes(state, data) {
    state.lecTypes.push(data)
  },
  resetFcLecTypes(state, data) {
    state.fcTypes = []
    state.lecTypes = []
  },
  eventstatistics (state, tabName) {
    state.statistics = tabName
  }
}

const getters = {
  msgList: state => {
    return state.msgList
  },
  msgCount: state => {
    return state.msgList.length
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations
})
