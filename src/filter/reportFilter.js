// 将字符串变成*号显示
export function filterNameChange (str) {
  var reg = /(.*)$/
  str = str.replace(reg, function (a, b) {
    return b.replace(/./g, '*')
  })
}
// 获取指定日期前七天
export function getBeforeWeek (d) {
  d = new Date(d)
  d = +d - 1000 * 60 * 60 * 24 * 6
  d = new Date(d)
  var year = d.getFullYear()
  var mon = d.getMonth() + 1
  var day = d.getDate()
  var s = year + '-' + (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0' + day) : day)
  return s
}
export function getBeforeWeeks (d) {
  d = new Date(d)
  d = new Date(d)
  var year = d.getFullYear()
  var mon = d.getMonth() + 1
  var s = year + '-' + (mon < 10 ? ('0' + mon) : mon + '-' + '01')
  return s
}
// 请使用数据字典的值
// for (let obj of options) {
//   if (obj.dictCode === data) {
//     return obj.dictName
//   }
// }
// 处理后台返回回来的FC/LEC
export function sourceDataFilter (sourceData, targetData) {
  if (sourceData && sourceData.length > 0) {
    let filter = sourceData.find(item => {
      return Number(item.refValue) === Number(targetData)
    })
    if (filter && filter.grade) {
      return filter.grade
    } else {
      return ''
    }
  }
}
// 处理FC/LEC转为数字给后台
export function filterFCLEC (sourceData, targetData) {
  if (sourceData && sourceData.length > 0) {
    let filter = sourceData.find(item => {
      return item.grade === targetData
    })
    if (filter && filter.refValue) {
      return filter.refValue
    } else {
      return ''
    }
  }
}
// 处理状态
export function ransfromProcessState (data) {
  switch (data) {
    case -1 :
      return '新建'

    case 0 :
      return '初评'

    case 1 :
      return '单元审核'

    case 2 :
      return '部门审核'

    case 3 :
      return '处理意见'

    case 4 :
      return '处理核准'

    case 5 :
      return '结束'
  }
}
