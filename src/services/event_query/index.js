import axios from 'axios'
import { API } from '../../api'
import {
  DepartmentListHandles
} from '../../tools'
export function geteventlist (eventReportFlyGroundSeVO) {
  return new Promise((resolve, reject) => {
    axios.post(API.EVENTQUERY_LIST, {
      params: {
        eventReportFlyGroundSeVO
      }
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  })
}
//  审核查询
export function getexminde (id) {
  return new Promise((resolve, reject) => {
    axios.get(`${API.EVENTEXAMINE_TO}?eventNumber=${id}`)
      .then(res => {
        resolve(res)
      })
      .catch(error => { console.log(error) })
  })
}
//  危险源
export function getscrik () {
  return new Promise((resolve, reject) => {
    axios.get(API.EVENTRISK)
      .then(res => {
        //  console.log(res)
        let data = res.data.data.map(item => {
          //  console.log(item)
          return {
            value: item.categoryName,
            label: item.categoryName,
            children: item.children ? item.children.map(items => {
              return {
                value: items.categoryName,
                label: items.categoryName,
                id: items.id,
                children: items.children ? items.children.map(itemlist => {
                  return {
                    value: itemlist.categoryName,
                    label: itemlist.categoryName,
                    id: itemlist.id,
                    children: itemlist.children ? itemlist.children.map(Iitem => {
                      return {
                        value: Iitem.categoryName,
                        label: Iitem.categoryName,
                        id: Iitem.id
                      }
                    }) : null
                  }
                }) : null
              }
            }) : null
          }
        })
        //  console.log(data)
        resolve(data)
      })
      .catch(error => { console.log(error) })
  })
}
//  过滤危险源
export function getCascaderOb (val, opt) {
  return val.map(function (value, index, array) {
    for (var itm of opt) {
      if (itm.value === value) {
        opt = itm.children
        return itm
      }
    }
    return null
  })
}
//  调查情况新增
export function getInvestigation (eventQarCaseDO) {
  return new Promise((resolve, reject) => {
    axios.post('/api/incdent/case/addEventQarCase', eventQarCaseDO)
      .then(res => {
        resolve(res)
      })
  })
}
//  事件等级单个接口新增
export function getEventlevel () {
  return new Promise((resolve, reject) => {
    axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'EVENT_LEVEL')
      .then(res => {
        if (res.data.error === 0) {
          resolve(res)
        }
      })
  })
}
//  调查新增页面数据
export function geteventdata (eventNumber) {
  return new Promise((resolve, reject) => {
    axios.get('/api/incdent/case/listEventQarCaseDO?' + 'eventNumber=' + eventNumber)
      .then(res => {
        resolve(res)
      })
  })
}
//  原因性质的分类单个接口
export function getCause () {
  return new Promise((resolve, reject) => {
    axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'REASON_DUTY')
      .then(res => {
        if (res.data.error === 0) {
          resolve(res)
        }
      })
  })
}
//  原因分类的接口
export function getReason (eventCaseAnalysisDO) {
  return new Promise((resolve, reject) => {
    axios.post(API.CAUSE_CLASSIFICATION, eventCaseAnalysisDO)
      .then(res => {
        resolve(res)
      })
  })
}
//  原因分类get请求接口页面展示
export function getEventReason (caseid) {
  return new Promise((resolve, reject) => {
    axios.get(API.GETCAUSE_CLASSIFICATION + '?caseid=' + caseid)
      .then(res => {
        resolve(res)
      })
  })
}
//   事件审核原因一级原因
export function grtclassa () {
  return new Promise((resolve, reject) => {
    axios.get(API.GETVLASSA_LIST)
      .then(res => {
        let data = res.data.data.map(item => {
          return {
            value: item.reasonName,
            label: item.reasonName,
            id: item.id,
            children: item.children ? item.children.map(items => {
              return {
                value: items.reasonName,
                label: items.reasonName,
                id: items.id,
                children: items.children ? items.children.map(itemlist => {
                  return {
                    value: itemlist.reasonName,
                    label: itemlist.reasonName,
                    id: itemlist.id
                  }
                }) : null
              }
            }) : null
          }
        })
        resolve(data)
      })
  })
}
//  具体原因
export function getspecific (id) {
  return new Promise((resolve, reject) => {
    axios.get(API.GETSPECIFIC_LIST + '/' + id)
      .then(res => {
        resolve(res)
      })
  })
}
//  责任单位
export function getResponsibility () {
  return new Promise((resolve, reject) => {
    axios.get('/api/system/dept/findAllDepart')
      .then(res => {
        resolve(res)
      })
  })
}
//  责任单位页面字表展示
export function getCaseResponsibilityDO (caseid) {
  return new Promise((resolve, reject) => {
    axios.get(API.GETCASERESPONEIILNILTYDO + '?caseid=' + caseid)
      .then(res => {
        resolve(res)
      })
  })
}
//  处理改进中是否更新的接口 POST
export function getmanagement (eventDOS) {
  return new Promise((resolve, reject) => {
    axios.post(API.GETMANAGEMENT_EVET, eventDOS)
      .then(res => {
        resolve(res)
      })
  })
}
//  处理改进的查询接口
export function getqueries (eventNumber) {
  return new Promise((resolve, reject) => {
    axios.get(API.GETQUERIRE_EVENT + '?eventNumber=' + eventNumber)
      .then(res => {
        resolve(res)
      })
  })
}
export function getDepartmentList () {
  return new Promise((resolve, reject) => {
    axios.get(`${API.DEPARTMENT_LIST}`)
      .then((response) => {
        // console.log(response)
        resolve(DepartmentListHandles(response))
      })
      .catch((error) => { console.log(error) })
  })
}
