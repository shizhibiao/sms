import axios from 'axios'
import { API } from '../../api'

// 威胁列表查询
export function getMenaceListInquireData (params) {
    return new Promise((resolve, reject) => {
      axios.post(API.MENACE_LIST_INQUIRE, params)
        .then(response => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }