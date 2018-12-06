import axios from 'axios'
import { API } from '../../api'
import {
  AnnounceTypeHandle,
  DepartmentListHandle,
  DisposeAllComboBoxData,
  conditionDepartmentListHandle,
  DepartmentListHandleId
} from '../../tools'
/**
*  安全通知请求
*/

// 请求安全通知---通知类型
export function getAnnouncementType () {
  return new Promise((resolve, reject) => {
    axios.post(`${API.DICTIONARY_CONTROLLER_URL}`, ['ANNOUNCEMENT_TYPE'])
      .then((response) => {
        // console.log(response)
        resolve(AnnounceTypeHandle(response))
      })
      .catch((error) => { console.log(error) })
  })
}
// 获得部门
export function getDepartmentList (path, params) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.DEPARTMENT_LIST}`)
      .then((response) => {
        // console.log(response, 'response')
        resolve(DepartmentListHandle(response))
      })
      .catch((error) => { console.log(error) })
  })
}
//  根据条件请求部门
export function conditionGetDepartmentList (id, deptId) {
  let url = ''
  if (+id === 1) {
    url = '/api/system/dept/level?levelId=1'
  } else {
    url = '/api/system/dept/user_subdept?deptId=' + deptId
  }
  console.log(url)
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(conditionDepartmentListHandle(response))
      })
      .catch((error) => { console.log(error) })
  })
}

// 请求到所有下拉框的数据
export function getAllDataAction () {
  return new Promise((resolve, reject) => {
    axios.get(`${API.QUERYALLACTIONDATA}`)
      .then((response) => {
        resolve(DisposeAllComboBoxData(response))
      })
      .catch((error) => { console.log(error) })
  })
}

// 保存信息
export function saveSafetyNoticeData (paramas) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.SAVETY_NOTICE_SAVE}`, paramas)
      .then(response => {
        console.log(response)
      })
      .catch(error => console.log(error))
  })
}

// 请求监察类型
export function getMonitoringType () {
  return new Promise((resolve, reject) => {
    axios.post(`${API.DICTIONARY_CONTROLLER_URL}`, ['SUPERVISE_TYPE'])
      .then((response) => {
        let data = response.data.data[0].dicts
        resolve(data)
      })
      .catch((error) => { console.log(error) })
  })
}

// 保存安全监察信息
export function saveSafetyNoticeData2 (paramas) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.SAFETY_SUPERVISION_SAVE}`, paramas)
      .then(response => {
        resolve(response)
      })
      .catch(error => console.log(error))
  })
}

// 获得部门ID
export function getDepartmentListId (path, params) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.DEPARTMENT_LIST}`)
      .then((response) => {
        // console.log(response)
        resolve(DepartmentListHandleId(response))
      })
      .catch((error) => { console.log(error) })
  })
}

// 获得通知等级
export function getNotificationLevel () {
  return new Promise((resolve, reject) => {
    axios.post(`${API.DICTIONARY_CONTROLLER_URL}`, ['ANNOUNCEMENT_LEVEL'])
      .then((response) => {
        // console.log(response)
        let data = response.data.data[0].dicts
        resolve(data)
      })
      .catch((error) => { console.log(error) })
  })
}

// 请求监察列表
export function getSupervisionList (id, list) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.DEMAND_SECURITY_SUPERVISION_LIST}`, list)
      .then((response) => {
        // console.log(response)
        // let data = response.data.data[0].dicts
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 根据级次查询部门列表
export function conditionGetDepartmentList2 (id) {
  let url = ''
  url = '/api/system/dept/level?levelId=' + id
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(conditionDepartmentListHandle(response))
      })
      .catch((error) => { console.log(error) })
  })
}
// 根据用户部门ID查询部门单元
export function conditionGetDepartmentList3 (id) {
  let url = ''
  url = '/api/system/dept/user_subdept?deptId=' + id
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(conditionDepartmentListHandle(response))
      })
      .catch((error) => { console.log(error) })
  })
}

// 启动安全监察流程
export function StartupProcess (id) {
  let url = ''
  url = '/api/securitymonitor/process/startUpProcess/' + id
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 发送安全监察主流程任务
export function SendTask (id, params) {
  let url = '/api/securitymonitor/process/sendTask'
  return new Promise((resolve, reject) => {
    axios.post(url, (id, params))
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 安全监察代办
export function Agency () {
  let url = '/api/securitymonitor/process/todo'
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 查询部门员工
export function getStaff (id) {
  let url = '/api/system/user/dept?deptId=' + id
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 流程记录
export function getRecord (id, taskId) {
  let url = '/api/securitymonitor/findProcessHis/' + id + '?taskId=' + taskId
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 查询用户
export function getUser (id) {
  let url = '/api/system/user/' + id
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}
//  认领任务
export function claim (taskId, userId) {
  let url = '/api/activiti/claim?taskId=' + taskId + '&userId=' + userId
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 取消签收
export function unClaim (taskId) {
  let url = '/api/activiti/unclaim?taskId=' + taskId
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 保存审计计划
export function saveMonitorTeamLeader (params) {
  let url = '/api/securitymonitor/saveMonitorTeamLeader'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 查询审计计划
export function findSupervisionAuditPlan (id) {
  let url = '/api/securitymonitor/findSupervisionAuditPlan/' + id
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 根据部门查询项目
export function findMonitorItemByDeptId (id) {
  let url = '/api/securitymonitor/findMonitorItemByDeptId/' + id
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 查询监察单项目
export function findMonitorItem (params) {
  let url = '/api/securitymonitor/findMonitorItem'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 保存检查单主从关系
export function saveMonitorBill (params) {
  let url = '/api/securitymonitor/saveMonitorBill'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 查询组长安排信息
export function findMonitorBill (monitorId, monitorDeptId, userId) {
  let url = '/api/securitymonitor/findMonitorBill/' + monitorId + '/' + monitorDeptId + '/' + userId
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 查询表单填写信息
export function findMonitorBillLoad (params) {
  let url = '/api/securitymonitor/findMonitorBillLoad'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 获取审查结果
export function checkResult () {
  return new Promise((resolve, reject) => {
    axios.post(`${API.DICTIONARY_CONTROLLER_URL}`, ['TEST_RESULT'])
      .then((response) => {
        // console.log(response)
        let data = response.data.data[0].dicts
        resolve(data)
      })
      .catch((error) => { console.log(error) })
  })
}

// 检查方式
export function TESTMODE () {
  return new Promise((resolve, reject) => {
    axios.post(`${API.DICTIONARY_CONTROLLER_URL}`, ['TEST_MODE'])
      .then((response) => {
        // console.log(response)
        let data = response.data.data[0].dicts
        resolve(data)
      })
      .catch((error) => { console.log(error) })
  })
}

// 更新工作执行结果
export function updateItemResult (params) {
  let url = '/api/securitymonitor/updateItemResult'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 发送子流程任务
export function sendTaskChild (id, params) {
  let url = '/api/securitymonitor/process/sendTaskChild'
  return new Promise((resolve, reject) => {
    axios.post(url, (id, params))
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 各部门确认
export function findDepartmentConfirm (id, deptId) {
  let url = '/api/securitymonitor/findDepartmentConfirm/' + id + '/' + deptId
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 更新组长审核意见
export function updateMonitorBillById (params) {
  let url = '/api/securitymonitor/updateMonitorBillById'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}
// 保存组长ID
export function updateByIdForHandMan (params) {
  let url = '/api/securitymonitor/updateByIdForHandMan'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 组长审核发送时
export function updateMonitorDepartment (monitorId, monitorDeptId) {
  let url = '/api/securitymonitor/updateMonitorDepartment/' + monitorId + '/' + monitorDeptId
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 各部门确认保存意见
export function updateMonitorDepartmentByDeptId (paramas) {
  let url = '/api/securitymonitor/updateMonitorDepartmentByDeptId'
  return new Promise((resolve, reject) => {
    axios.post(url, paramas)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 监察审查结果保存
export function updateSafetyMonitorById (paramas) {
  let url = '/api/securitymonitor/updateSafetyMonitorById'
  return new Promise((resolve, reject) => {
    axios.post(url, paramas)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 监察审查结果查询
export function findByMonitorIdAndDeptId (monitorId, deptId) {
  let url = '/api/securitymonitor/findByMonitorIdAndDeptId/' + monitorId + '/' + deptId
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 我的已办
export function done (userId, params) {
  let url = '/api/securitymonitor/process/done'
  return new Promise((resolve, reject) => {
    axios.post(url, (userId, params))
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 根据部门ID查询部门
export function dept (deptId) {
  let url = '/api/system/user/dept?deptId=' + deptId
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 下拉二级表格
export function findByMonitorIdForTwo (id) {
  let url = '/api/securitymonitor/findByMonitorIdForTwo/' + id
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 查询组长id和保存状态
export function findByIdForHandMan (params) {
  let url = '/api/securitymonitor/findByIdForHandMan'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 保存主对象按钮状态
export function updateByIdForHandManMain (params) {
  let url = '/api/securitymonitor/updateByIdForHandManMain'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 新建驳回保存
export function updateMonitor (params) {
  let url = '/api/securitymonitor/updateMonitor'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 查询单个用户
export function lookUser (userId) {
  let url = '/api/system/user/' + userId
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 保存工作执行时的保存状态
export function saveBillSaveStatus (params) {
  let url = '/api/securitymonitor/saveBillSaveStatus'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 统计分析-列表查询
export function chartList (params) {
  let url = '/api/securitymonitor/chart/list'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

//统计分析-本期来源
export function currentType (params) {
  let url = '/api/securitymonitor/chart/currentType'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

//统计分析-部门类型
export function departmentType1 (params) {
  let url = '/api/securitymonitor/chart/departmentType'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

//统计分析-部门结果
export function departmentResult1 (params) {
  let url = '/api/securitymonitor/chart/departmentResult'
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 请求测试项目
export function getTestProject () {
  return new Promise((resolve, reject) => {
    axios.post(`${API.DICTIONARY_CONTROLLER_URL}`, ['TEST_PROJECT'])
      .then((response) => {
        let data = response.data.data[0].dicts
        resolve(data)
      })
      .catch((error) => { console.log(error) })
  })
}

// 请求结论
export function getTestConclusion () {
  return new Promise((resolve, reject) => {
    axios.post(`${API.DICTIONARY_CONTROLLER_URL}`, ['TEST_CONCLUSION'])
      .then((response) => {
        let data = response.data.data[0].dicts
        resolve(data)
      })
      .catch((error) => { console.log(error) })
  })
}