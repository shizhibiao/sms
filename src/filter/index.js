
export function transformNoticeLevelFilter (data) {
  if (!data) {
    return '公司'
  }

  switch (+data) {
    case 1 :
      return '公司'

    case 2 :
      return '部门'
  }
}
