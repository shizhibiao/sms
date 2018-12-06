export function AnnounceTypeHandle (sourceData) {
  let data = sourceData.data.data[0].dicts

  let newdata = data.map(item => {
    return {
      dictName: item.dictName,
      orderNo: item.orderNo,
      dictCode: item.dictCode,
      dictId: item.dictId
    }
  })

  return newdata
}
// 查找公司部门
export function DepartmentListHandle (sourceData) {
  // console.log(sourceData)
  let data = sourceData.data.data
  let newData = data.map(item => {
    return {
      label: item.deptName,
      value: item.deptCode,
      deptCode: item.deptCode,
      deptId: item.deptId,
      children: item.children ? item.children.map(cItem => {
        return {
          value: cItem.deptName,
          label: cItem.deptName,
          deptCode: cItem.deptCode,
          deptId: cItem.deptId,
          children: cItem.children ? cItem.children.map(children => {
            return {
              value: children.deptName,
              label: children.deptName,
              deptCode: children.deptCode,
              deptId: children.deptId
            }
          }) : null
        }
      }) : null
    }
  })
  // console.log(newData)
  return newData
}
//  事件里面的部门
export function DepartmentListHandles (sourceData) {
  // console.log(sourceData)
  let data = sourceData.data.data
  let newData = data.map(item => {
    return {
      label: item.deptName,
      value: item.deptCode,
      deptCode: item.deptId,
      children: item.children ? item.children.map(cItem => {
        return {
          value: cItem.deptName,
          label: cItem.deptName,
          deptCode: cItem.deptId,
          children: cItem.children ? cItem.children.map(children => {
            return {
              value: children.deptName,
              label: children.deptName,
              deptCode: children.deptId
            }
          }) : null
        }
      }) : null
    }
  })
  // console.log(newData)
  return newData
}
// 查找公司部门ID
export function DepartmentListHandleId (sourceData) {
  let data = sourceData.data.data
  let newData = data.map(item => {
    return {
      label: item.deptName,
      value: item.deptId,
      deptCode: item.deptCode,
      children: item.children ? item.children.map(cItem => {
        return {
          value: cItem.deptId,
          label: cItem.deptName,
          deptCode: cItem.deptCode,
          children: cItem.children ? cItem.children.map(children => {
            return {
              value: children.deptId,
              label: children.deptName,
              deptCode: children.deptCode
            }
          }) : null
        }
      }) : null
    }
  })
  return newData
}

// 按照条件查找部门
export function conditionDepartmentListHandle (sourceData) {
  // console.log(sourceData)
  let data = sourceData.data
  if (data && data.error === 0) {
    let newdata = data.data
    return newdata
  }
}
// 安全通知----------------------------结束-----------------------------------

// 处理所有下拉框数据
export function DisposeAllComboBoxData (res) {
  var datas = res.data.data
  let nameAction = {}
  datas.map(item => {
    let dictType = item.dictType
    if (!nameAction[dictType]) {
      nameAction[dictType] = {
        dictType: item.dictType,
        dictTypeDesc: item.dictTypeDesc,
        dicts: item.dicts
      }
    }
  })
  return nameAction
}

// 查询安全通知列表

export function AnnounceDataList (data, type) {
  if (!data.data && data.data.error !== 0 && !data.data.data) {
    return
  }
  let datas = data.data.data.content
  console.log(datas)
  let count = 1
  let newdata = datas.map(item => {
    return {
      noticeTitle: item.noticeTitle,
      noticeLevel: item.noticeLevel,
      noticeSrcType: item.noticeSrcType,
      submitDeptName: item.submitDeptName,
      submitDate: item.submitDate,
      procStatus: item.procStatus,
      procStatusDesc: item.procStatusDesc,
      flag: item.flag,
      id: count++,
      safetyId: item.safetyId,
      safetyDepartmentDOList: item.safetyDepartmentDOList,
      taskInfo: item.taskInfo
    }
  })

  return newdata
}
// 子表
export function AnnounceChildrenDataList (sourceData) {
  if (sourceData && sourceData.data.data && sourceData.data.error === 0) {
    let datas = sourceData.data.data
    let newdata = datas.map(item => {
      return {
        deptId: item.deptId,
        deptName: item.deptName,
        replayIssue: item.replayIssue,
        safetyDeptId: item.safetyDeptId,
        safetyId: item.safetyId,
        status: item.status,
        noticeType: item.noticeType,
        statusDesc: item.statusDesc

      }
    })
    // console.log(newdata[0], 'tool')
    return newdata
  }
}
// 请求安全通知依据
export function handleSurveyBasisData (sourceData) {
  // console.log(sourceData)
  let datas = sourceData.data.data[0].dicts
  let newdata = datas.map(item => {
    return {
      dictCode: item.dictCode,
      dictId: item.dictId,
      dictName: item.dictName,
      dictTypeDesc: item.dictTypeDesc

    }
  })
  return newdata
}

// 此方法介绍：    这是将后台的到的code值转为相应的字符   参数1为源数组（获取到的类型数组） 参数2 是目标值
export function sourceDataFilter (sourceData, targetData) {
  if (!sourceData) {
    return ''
  }
  if (sourceData.dicts && sourceData.dicts.length > 0) {
    // console.log(sourceData)
    let filter = sourceData.dicts.find(item => {
      return Number(item.dictCode) === Number(targetData)
    })
    if (filter && filter.dictName) {
      return filter.dictName
    } else {
      return ''
    }
  } else if (sourceData && sourceData.length > 0) {
    let filter = sourceData.find(item => {
      return Number(item.dictCode) === Number(targetData)
    })
    if (filter && filter.dictName) {
      return filter.dictName
    } else {
      return ''
    }
  }
}
// 此方法介绍：    将相对应的name值转为code值   参数1为源数组（获取到的类型数组） 参数2 是目标值
export function sourceDataFilterOpposite (sourceData, targetData) {
  if (!sourceData) {
    return ''
  }
  if (sourceData.dicts && sourceData.dicts.length > 0) {
    // console.log(sourceData)
    let filter = sourceData.dicts.find(item => {
      return item.dictName === targetData
    })
    if (filter && filter.dictCode) {
      return filter.dictCode
    } else {
      return ''
    }
  } else if (sourceData && sourceData.length > 0) {
    let filter = sourceData.find(item => {
      return item.dictName === targetData
    })
    if (filter && filter.dictCode) {
      return filter.dictCode
    } else {
      return ''
    }
  }
}
// 此方法介绍：    将相对应的dictNameEn值转为code值   参数1为源数组（获取到的类型数组） 参数2 是目标值
export function sourceDataFilterOppositeEn (sourceData, targetData) {
  if (!sourceData) {
    return ''
  }
  if (sourceData.dicts && sourceData.dicts.length > 0) {
    // console.log(sourceData)
    let filter = sourceData.dicts.find(item => {
      return item.dictNameEn === targetData
    })
    if (filter && filter.dictCode) {
      return filter.dictCode
    } else {
      return ''
    }
  } else if (sourceData && sourceData.length > 0) {
    let filter = sourceData.find(item => {
      return item.dictNameEn === targetData
    })
    if (filter && filter.dictCode) {
      return filter.dictCode
    } else {
      return ''
    }
  }
}
// 转换月份
export function monthData (mon) {
  console.log(mon)
  if (!mon) {
    return ''
  }
  let arr = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  let newarr = arr.find((item, index, arr) => {
    return +mon === (index + 1)
  })
  console.log(newarr)
  return newarr
}
