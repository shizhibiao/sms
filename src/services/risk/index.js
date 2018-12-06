import axios from 'axios'
import { API } from '../../api'
// 请求一级或二级部门
export function GetDepartmentListFromList (id, deptId) {
  let url = ''
  if (!deptId && deptId !== 0) {
    url = 'api/system/dept/level?levelId=' + id
  } else {
    url = '/api/system/dept/user_subdept?deptId=' + deptId
  }

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        if (response && response.data && response.data.error === 0) {
          let arr = response.data.data.map(item => {
            return {
              data: item,
              processDept: item.deptId,
              processDeptName: item.deptName
            }
          })
          resolve(arr)
        }
      })
      .catch((error) => { console.log(error) })
  })
}
// 新增风险管理/保存
export function saveAllRisk (params) {
  return new Promise((resolve, reject) => {
    axios.post(API.SAVEAllRISKMANAGE, params)
      .then((response) => {
        if (response && response.data && response.data.error === 0) {
          resolve(response)
        }
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 请求列表数据

export function riskManageSearchList (params) {
  return new Promise((resolve, reject) => {
    axios.post(API.RISK_MANAGE_SEARCH_LIST, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 请求风险管理单个详情

export function riskManageDetailList (riskId, taskId) {
  console.log(riskId, taskId)
  return new Promise((resolve, reject) => {
    axios.get(`${API.RISK_MANAGE_DETAIL_LIST}/${riskId}?taskId=${taskId}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 风险管理编辑保存
export function updateRiskManage (params) {
  return new Promise((resolve, reject) => {
    axios.post(API.UPDATE_RISK_MANAGE, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 删除风险管理DELETE_RISK_MANAGE

export function deleteRiskManage (riskId) {
  return new Promise((resolve, reject) => {
    axios.delete(`${API.DELETE_RISK_MANAGE}/${riskId}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 启动流程
export function startRiskManage (riskId) {
  // console.log(riskId, `${API.START_RISK_MANAGE}/${riskId}`)
  return new Promise((resolve, reject) => {
    axios.get(`${API.START_RISK_MANAGE}/${riskId}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 列表页面子表详情  RISK_MANAGE_CHILDREN
export function riskManageChildrenTab (riskId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.RISK_MANAGE_CHILDREN}?riskId=${riskId}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 代办列表
export function riskManageToDoList () {
  return new Promise((resolve, reject) => {
    axios.get(`${API.RISK_MANAGE_TODOlIST}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 审核历史
export function getRiskStartData0 (riskId, taskId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.RISK_MANAGE_START_0}/${riskId}?taskId=${taskId}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 我的已办列表
export function riskManageFlowDone (params) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.RISK_MANAGE_FLOW_DONE}`, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 列出可选的控制部门

export function riskManageControlDept (level, deptId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.RISK_MANAGE_CONTROL}?deptId=${deptId}&level=${level}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 审核意见
export function riskManageFlowAudit (params) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.RISK_MANAGE_FLOW_AUDIT}`, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 请求可控制人
export function riskManageControlPerson (deptId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.RISK_MANAGE_DEPT_CONTROL_PERSON}?deptId=${deptId}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 增加危险源
export function addRiskSource (id) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.ADD_DEPT_RISK_SOURCE}/${id}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 选择危险源
export function getRiskCategoryDept (deptId, level) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.RISK_CATEGORY_DEPT}/dept?deptId=${deptId}&level=${level}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 根据危险源分类请求危险源

export function getRiskSourceCategory (Id) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.RISK_SOURCE_CATEGORY}/${Id}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 保存危险源
export function saveRiskSource (params) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.SAVE_RISK_MANAGE_CONTORL_SOURCE}`, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 查找已保留的危险源

export function searchRiskSourceList (riskDeptId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.SEARCH_RISK_SOURCE}?riskDeptId=${riskDeptId}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 删除危险源
export function deleteRiskSource (id) {

  return new Promise((resolve, reject) => {
    axios.delete(`${API.DELETE_RISK_SOURCE}/${id}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 保存 危险源以及部门和可控制人
export function saveRiskSourceAndOther (params) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.SAVE_ALL_CONTROL_DEPTS}`, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 子流程审核

export function riskMangeFlowChild (params) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.RISK_MANAGE_FLOW_CHILD}`, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 新增措施

export function addRiskManageStep (params) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.ADD_RISK_MANAGE_STEP}`, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 查询 措施

export function searchRiskManageDeptSteps (riskDeptId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.SEARCH_RISK_MANAGE_DEPT_STEPS}?riskDeptId=${riskDeptId}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 编辑 措施
export function modifyRiskManageStep (params) {
  return new Promise((resolve, reject) => {
    axios.put(`${API.MODIFY_RISK_MANAGE_DEPT_STEPS}`, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 删除 措施
export function deleteRiskManageStep (id) {
  return new Promise((resolve, reject) => {
    axios.delete(`${API.DELETE_RISK_MANAGE_DEPT_STEPS}?id=${id}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 获得责任部门信息

export function riskManageDeptsInfo (riskId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.MODIFY_RISK_MANAGE_DEPTS_RESULT}?riskId=${riskId}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 效果评估

export function modifyRiskResult (params) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.MODIFY_RISK_MANAGE_DEPTS_RESULT}`, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 新增危险源

export function newRiskSource (params) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.NEW_RISK_SOURCE}`, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 修改危险源 

export function updateRiskSource (params) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.UPDATE_RISK_SOURCE}`, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

// 统计主查询
export function riskStatisList (params) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.RISK_STATIS_LIST}`, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 年度部门
export function riskStatisYearDepart (params) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.RISK_STATIS_YEAR_DEPART}`, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 本期部门
export function riskStatisPeriodDepart (params) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.RISK_STATIS_PERIOD_DEPART}`, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}
// 统计危险源查询
export function riskStatisSourceYearDepart (params) {
  return new Promise((resolve, reject) => {
    axios.post(`${API.RISK_STATIS_RISK_SOURCE_YEAR_DEPART}`, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}