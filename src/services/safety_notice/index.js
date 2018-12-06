import axios from 'axios'
import { API } from '../../api'
import {
  AnnounceTypeHandle,
  DepartmentListHandle,
  DisposeAllComboBoxData,
  conditionDepartmentListHandle,
  // AnnounceDataList,
  AnnounceChildrenDataList,
  handleSurveyBasisData
} from '../../tools'
/**
*  安全通知请求
*/

// 基本信息
export function getSafetyNoticeDetailList (safetyId, taskId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.SAFETY_NOTICE_DETAIL_URL}/${safetyId}?taskId=${taskId}`)
      .then(response => {
        resolve(response)
      })
      .catch(error => console.log(error))
  })
}

// 请求安全通知---通知类型
export function getAnnouncementType () {
  return new Promise((resolve, reject) => {
    axios.post(`${API.DICTIONARY_CONTROLLER_URL}`, ['ANNOUNCEMENT_TYPE'])
      .then((response) => {
        resolve(AnnounceTypeHandle(response))
      })
      .catch((error) => { console.log(error) })
  })
}

// 请求安全通知---依据SURVEY—basis
export function getSurveyBasisData () {
  return new Promise((resolve, reject) => {
    axios.post(`${API.DICTIONARY_CONTROLLER_URL}`, ['DEPEND_ON'])
      .then((response) => {
        resolve(handleSurveyBasisData(response))
      })
      .catch((error) => { console.log(error) })
})
}

// 获得部门
export function getDepartmentList () {
  return new Promise((resolve, reject) => {
    axios.get(`${API.DEPARTMENT_LIST}`)
      .then((response) => {
        // console.log(response)
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
  // console.log(url)
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        // console.log(response)
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
        if (response.data.error === 0 && response.data.data) {
          resolve(DisposeAllComboBoxData(response))
        }
      })
      .catch((error) => { console.log(error) })
  })
}

// 保存信息
export function saveSafetyNoticeData (paramas) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.SAVETY_NOTICE_SAVE}`, paramas)
      .then(response => {
        resolve(response)
      })
      .catch(error => console.log(error))
  })
}

// 查询安全通知列表
export function demandSafetyNoticeList (paramas) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.DEMAND_SECURITY_NOTICE_LIST}`, paramas)
      .then(response => {
        if (response.data.data !== null) {
          resolve(response)
        }
      })
      .catch(error => console.log(error))
  })
}

// 查询安全通知列表子表
export function getSafetyNoticeChildrenList (safetyId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.SAFETY_NOTICE_CHILDREN_LIST}` + safetyId)
      .then(response => {
        resolve(AnnounceChildrenDataList(response))
      })
      .catch(error => console.log(error))
  })
}

// 安全通知详情--查看具体的安全通知或者修改安全通知时使用

// 附件查询 tableName=t_safety_annoucement&sourceNumber=15
export function getAttachmentList (sourceNumber, tableName) {
  // console.log(sourceNumber, tableName)
  return new Promise((resolve, reject) => {
    axios.get(`${API.ATTACHMENT_LIST_URL}?sourceNumber=${sourceNumber}&tableName=${tableName}`)
      .then(response => {
        resolve(response)
      })
      .catch(error => console.log(error))
  })
}
// 删除安全通知
export function deleteNoticeData (safetyId) {
  return new Promise((resolve, reject) => {
    axios.delete(`${API.DELETE_NOTICE_URL}/${safetyId}`)
      .then(response => {
        resolve(response)
      })
      .catch(error => { reject(error) })
  })
}
// UPDATE_NOTICE_URL更新安全通知
export function updataNotice (safety) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.UPDATE_NOTICE_URL}`, safety)
      .then(response => {
        resolve(response)
      })
      .catch(error => { reject(error) })
  })
}

// 待办列表
export function getSafetyNoticeToDoListData () {
  return new Promise((resolve, reject) => {
    axios.get(`${API.SAFETY_NOTICE_FLOW_TODO}`)
      .then(response => {
        resolve(response)
      })
      .catch(error => { reject(error) })
  })
}
//
// 历史记录
export function getSafetyNoticehHistoryListData (safetyId, taskId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.SAFETY_NOTICE_AUDIT_HISTORY}/${safetyId}?taskId=${taskId}`)
      .then(response => {
        resolve(response)
      })
      .catch(error => { reject(error) })
  })
}
// 安全通知主流程

export function SafetyNoticeFlowAduit (paramas) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.SAFETY_NOTICE_FLOW_ADUIT}`, paramas)
      .then(response => {
        resolve(response)
      })
      .catch(error => { reject(error) })
  })
}
// 安全通知子流程

export function SafetyNoticeFlowAduitChild (paramas) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.SAFETY_NOTICE_FLOW_ADUIT_CHILD}`, paramas)
      .then(response => {
        resolve(response)
      })
      .catch(error => { reject(error) })
  })
}
// 安全通知建议 SAFETY_NOTICE_CONTENT
export function SafetyNoticeContent (safetyDeptId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.SAFETY_NOTICE_CONTENT}/?safetyDeptId=${safetyDeptId}`)
      .then(response => {
        resolve(response)
      })
      .catch(error => { reject(error) })
  })
}
// 保存安全通知建议

export function saveSafetyNoticeContent (paramas) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.SAVE_SAFETY_NOTICE_CONTENT}`, paramas)
      .then(response => {
        // console.log(response)
        resolve(response)
      })
      .catch(error => { console.log(error) })
  })
}

export function getSafetyNoticeDepts (safetyId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.SAVE_SAFETY_NOTICE_DEPTS}/${safetyId}`)
      .then(response => {
        resolve(response)
      })
      .catch(error => { console.log(error) })
  })
}
// list 页面根据部门等级请求数据
export function GetDepartmentListFromList (id) {
  let url = ''
  url = 'api/system/dept/level?levelId=' + id

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        resolve(conditionDepartmentListHandle(response))
      })
      .catch((error) => { console.log(error) })
  })
}

//  我的已办

export function getSavetyNoticeFlowDone (paramas) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.SAFETY_NOTICE_FLOW_DONE}`, paramas)
      .then(response => {
        console.log(response)
        resolve(response)
      })
      .catch(error => {
        console.log(error)
        reject(error)
      })
  })
}

export function savetyNoticeStart (safetyId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.SAFETY_NOTICE_START}/${safetyId}`)
      .then(response => {
        resolve(response)
      })
      .catch(error => { reject(error) })
  })
}

// 认领SIGN_FOR_TASK
export function signForTask (taskId, userId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.SIGN_FOR_TASK}?taskId=${taskId}&userId=${userId}`)
      .then(response => {
        resolve(response)
      })
      .catch(error => { reject(error) })
  })
}
// 取消签收
export function activitiCancelClaim (taskId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.ACTIVITI_CANCEL_CLAIM_}?taskId=${taskId}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}
// 附件上传

export function arrachSave (parmas) {
  return new Promise((resolve, reject) => {
    axios.post(API.ATTACH_SAVE_URL, parmas)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}

// 主查询总计

export function searchSavetyNoticeStatList (parmas) {
  return new Promise((resolve, reject) => {
    axios.post(API.SAFETY_NODTICE_STATIS_LIST, parmas)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 年度查询 来源 SAFETY_NODTICE_YEAR_SRC_TYPE

export function searchSavetyNoticeStatYearSrcType() {
  return new Promise((resolve, reject) => {
    axios.get(API.SAFETY_NODTICE_YEAR_SRC_TYPE)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 本期来源查询

export function searchSavetyNoticePeriodSrcType (parmas) {
  return new Promise((resolve, reject) => {
    axios.post(API.SAFETY_NODTICE_PERIOD_SRC_TYPE, parmas)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 年度部门
export function SafetyNoticeYearDepart (parmas) {
  return new Promise((resolve, reject) => {
    axios.post(API.SAFETY_NODTICE_YEAR_DEPART, parmas)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 本期部门
export function SafetyNoticePeriodDepart (parmas) {
  return new Promise((resolve, reject) => {
    axios.post(API.SAFETY_NODTICE_PERIOD_DEPART, parmas)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 月度部门
export function SafetyNoticeStatMonth (parmas) {
  return new Promise((resolve, reject) => {
    axios.post(API.SAFETY_NODTICE_STATIS_MONTH, parmas)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 部门类型
export function SafetyNoticeSrcDepart (parmas) {
  return new Promise((resolve, reject) => {
    axios.post(API.SAFETY_NODTICE_SRC_DEPART, parmas)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

