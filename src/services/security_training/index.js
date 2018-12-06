import axios from 'axios'
import { API } from '../../api'

// 新增规章制度
export function addRulesRegulations (params) {
  return new Promise((resolve, reject) => {
    axios.post(API.ADD_RULES_REGULATIONS, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 规章制度列表
export function getListRulesRegulations (ruleType, pageSize, pageNo) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.LIST_RULES_REGULATIONS}?ruleType=${ruleType}&pageSize=${pageSize}&pageNo=${pageNo}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 删除规章制度
export function deleteRulesRegulations (id) {
  return new Promise((resolve, reject) => {
    axios.delete(`${API.DELETE_RULES_REGULATIONS}/${id}`)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
