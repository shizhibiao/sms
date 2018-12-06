import axios from 'axios'
import { API } from '../../api'
// 处理接口数据
import { DisposeAllComboBoxData } from '../../tools'
// 请求到所有下拉框的数据
export function getAllDataAction () {
  return new Promise((resolve, reject) => {
    axios.get(`${API.QUERYALLACTIONDATA}`)
      .then((response) => {
        // console.log(response, '下拉框列表')
        if (response.data.data === null) {
          resolve('')
        } else {
          resolve(DisposeAllComboBoxData(response))
        }
      })
      .catch((error) => { console.log(error) })
  })
}
// 保存前台页面传过来的信息报告基础信息
export function getPreserveAction (data) {
  return new Promise((resolve, reject) => {
    axios.post(API.PRESERVE_MESSAGE, data)
      .then(response => {
        // console.log(response, '保存')
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 保存前台页面传过来的信息报告基础信息
export function getSearchInformation (data) {
  return new Promise((resolve, reject) => {
    axios.post(API.INQUIRE_SELECT, data)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 编辑信息报告
export function compileInformationReports (data) {
  return new Promise((resolve, reject) => {
    axios.put(API.COMPILE_INFORMATION_REPORTS, data)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 启动流程
export function initiatorProcedureAction (reportNumber) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.INITIATORPROCEDURE}/${reportNumber}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 信息报告待办列表
export function getPreserveMessageList () {
  return new Promise((resolve, reject) => {
    axios.get(API.PRESERVE_MESSAGE_LIST)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}
// 处理我的待办中的主流程操作
export function disposeTransactionAction (data) {
  return new Promise((resolve, reject) => {
    axios.post(API.DISPOSE_TRANSACTION_AUDIT, data)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 我的已办
export function getHaveFinishedData (data) {
  return new Promise((resolve, reject) => {
    axios.post(API.HAVE_FINISHED_ACCTION, data)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}
// 信息报告----查看审核历史记录
export function getViewAuditHistoryAction (reportNumber) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.VIEW_AUDIT_HISTORY}/${reportNumber}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 取消认领
export function activitiCancelClaim (taskId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.ACTIVITI_CANCEL_CLAIM_}?taskId=${taskId}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 获取到涉及过程数据
export function getInvolveCourse () {
  return new Promise((resolve, reject) => {
    axios.get('/api/risk_category')
      .then(response => {
        if (response.data && response.data.error === 0) {
          let data = response.data.data
          let newData = data.map(item1 => {
            return {
              value: item1.id,
              label: item1.categoryName,
              id: item1.id,
              children: item1.children ? item1.children.map(item2 => {
                return {
                  value: item2.id,
                  label: item2.categoryName,
                  id: item2.id,
                  children: item2.children ? item2.children.map(item3 => {
                    return {
                      value: item3.id,
                      label: item3.categoryName,
                      id: item3.id,
                      children: item3.children ? item3.children.map(item4 => {
                        return {
                          value: item4.id,
                          label: item4.categoryName,
                          id: item4.id,
                          children: item4.children ? item4.children.map(item5 => {
                            return {
                              value: item5.id,
                              label: item5.categoryName,
                              id: item5.id
                            }
                          }) : null
                        }
                      }) : null
                    }
                  }) : null
                }
              }) : null
            }
          })
          resolve(newData)
        }
      })
      .catch((error) => { console.log(error) })
  })
}
// 新增危险源---保存
export function addHazardAtions (data) {
  return new Promise((resolve, reject) => {
    axios.post(API.ADD_HAZARD_ACTION, data)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 请求FC/LEC下拉框数据
export function getFCLECdata (num) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.GET_FC_LEC_DATA}/${num}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}
// 查询原因分类，按层次关系返回
export function inquireRootCause () {
  return new Promise((resolve, reject) => {
    axios.get(API.GET_ROOT_CAUSE)
      .then(response => {
        // console.log(response)
        if (response.data && response.data.error === 0) {
          let data = response.data.data
          let newData = data.map(item1 => {
            return {
              value: item1.id,
              label: item1.reasonName,
              id: item1.id,
              children: item1.children ? item1.children.map(item2 => {
                return {
                  value: item2.id,
                  label: item2.reasonName,
                  id: item2.id,
                  children: item2.children ? item2.children.map(item3 => {
                    return {
                      value: item3.id,
                      label: item3.reasonName,
                      id: item3.id,
                      children: item3.children ? item3.children.map(item4 => {
                        return {
                          value: item4.id,
                          label: item4.reasonName,
                          id: item4.id,
                          children: item4.children ? item4.children.map(item5 => {
                            return {
                              value: item5.id,
                              label: item5.reasonName,
                              id: item5.id
                            }
                          }) : null
                        }
                      }) : null
                    }
                  }) : null
                }
              }) : null
            }
          })
          resolve(newData)
        }
      })
      .catch((error) => { console.log(error) })
  })
}
// 根据原因分类，查询原因列表
export function QueryListDataAction (id) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.QUERY_LIST_DATA}/${id}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 查询危险源列表
export function inquireHazardList (data) {
  return new Promise((resolve, reject) => {
    axios.post(API.INPUIRE_HAZARD_LIST, data)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 删除危险源信息
export function removeRiskSource (id) {
  return new Promise((resolve, reject) => {
    axios.delete(`${API.REMOVE_RISK_SOURCE}/${id}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 点击编辑获取到数据
export function getCompileDataList (id) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.REMOVE_RISK_SOURCE}/${id}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}
// 危险源编辑---保存
export function compileRiskSource (data) {
  return new Promise((resolve, reject) => {
    axios.put(API.COMPILE_RISK_SOURCE, data)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}
// 启动危险源流程
export function startHazardStream (id) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.START_HAZARD_STREAM}/${id}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 查询单个危险源对应的根原因信息
export function inquireSingleRootCause (riskId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.INPUIRE_SIMGLE_ROOTCAUSE}/${riskId}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}
// 危险源待办列表
export function hazardAgendaList () {
  return new Promise((resolve, reject) => {
    axios.get(API.HAZARD_AGENDA_LIST)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}
// 我的已办--危险源已办列表
export function hazardActionTakenaList (data) {
  return new Promise((resolve, reject) => {
    axios.post(API.HAZARD_ACTION_TaKEN_LIST, data)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 危险源--查看审核历史记录
export function examineAuditHistory (riskId) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.EXAMINE_AUDIT_HISTORY}/${riskId}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { console.log(error) })
  })
}
// 审核--处理我的待办中的主流程操作
export function disposeHazardAudit (data) {
  return new Promise((resolve, reject) => {
    axios.post(API.DISPOSE_HAZARD_AUDIT, data)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 根原因列表与危险源关联解除
export function removeHazardRootCause (id) {
  return new Promise((resolve, reject) => {
    axios.delete(`${API.REMOVE__HAZARD_ROOT_CAUSE}/${id}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 根据id查询单个危险源分类
export function getSingleHazardData (id) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.GET_SINGLE_HAZARD}/${id}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 远程搜索所有用户信息
export function getSelectUserAllAction () {
  return new Promise((resolve, reject) => {
    axios.get(API.SELECT_USER_ALL_ACTION)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 信息报告--本期统计
export function getReportCurrentPeriodData (startDate, endDate, category) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.REPORT_CURRENT_PERIOD}?startDate=${startDate}&endDate=${endDate}&category=${category}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 部门报告统计
export function getDepartmentReportStatisticsData (startDate, endDate, dept, type) {
  return new Promise((resolve, reject) => {
    if (dept.length >= 1 && type.length >= 1) {
      axios.get(`${API.DEPARTMENT_REPORT_STATISTICS}?startDate=${startDate}&endDate=${endDate}&dept=${dept}&type=${type}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    } else if (dept.length >= 1 && type.length < 1) {
      axios.get(`${API.DEPARTMENT_REPORT_STATISTICS}?startDate=${startDate}&endDate=${endDate}&dept=${dept}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    } else if (dept.length < 1 && type.length >= 1) {
      axios.get(`${API.DEPARTMENT_REPORT_STATISTICS}?startDate=${startDate}&endDate=${endDate}&type=${type}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    } else {
      axios.get(`${API.DEPARTMENT_REPORT_STATISTICS}?startDate=${startDate}&endDate=${endDate}`)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    }
  })
}