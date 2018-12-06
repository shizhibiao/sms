export const API = {
  // 请求数据字典 请求方式post 例如参数['ANNOUNCEMENT_TYPE']
  DICTIONARY_CONTROLLER_URL: '/api/system/dictionary/by_types',
  // 查询部门列表  get 无参数
  DEPARTMENT_LIST: '/api/system/dept',
  // 事件新增的数据 post 参数： eventReportFlyGroundSeVO
  EVENTQUERY_LIST: '/api/incdent/event/addEvent',
  //  事件里面的立项审核查询
  EVENTEXAMINE_TO: '/api/incdent/Audit/listEventAuditDO',
  //  事件审核原因分类 post
  CAUSE_CLASSIFICATION: '/api/incdent/case/addEventCaseAnalysis',
  //  获取事件审核原因分类 get
  GETCAUSE_CLASSIFICATION: '/api/incdent/case/listEventCaseAnalysisDO',
  //  事件审核原因一级原因get
  GETVLASSA_LIST: '/api/reason',
  //  事件审核原因具体原因get
  GETSPECIFIC_LIST: '/api/reason/detail',
  //  获取责任划分  get
  GETCASERESPONEIILNILTYDO: '/api/incdent/case/listEventCaseResponsibilityDO',
  //  处理改进中是否更新的接口 POST
  GETMANAGEMENT_EVET: '/api/incdent/event/updateEvenTrisk',
  //  获取处理改进的查询接口
  GETQUERIRE_EVENT: '/api/incdent/annoucement/listEventQarAnnoucement',
  //  责任单位
  RESPONSIBISITY_UNITl: '/api/system/dept/findAllDepart',
  //  危险源关联get
  EVENTRISK: '/api/risk_category/findAllEvent',
  //  查询到所有的下拉框内容 get 无参数
  QUERYALLACTIONDATA: '/api/system/dictionary/all',
  //  信息报告 保存前台页面传过来的基础信息 post
  PRESERVE_MESSAGE: '/api/report/addReport',
  // 查询信息报告
  INQUIRE_SELECT: '/api/report/select',
  // 保存安全通告信息
  SAVETY_NOTICE_SAVE: '/api/safetynotice/save_all',
  // 查询通知列表
  DEMAND_SECURITY_NOTICE_LIST: '/api/safetynotice/list',
  // 查询通知列表的子列表 参数{safetyId}
  SAFETY_NOTICE_CHILDREN_LIST: '/api/safetynotice/depts/',
  // 安全通知详情--查看具体的安全通知或者修改安全通知时使用
  SAFETY_NOTICE_DETAIL_URL: '/api/safetynotice/',
  // 附件下载
  ATTACHMENT_LIST_URL: '/api/attach/list_all',
  // 更新安全通知
  UPDATE_NOTICE_URL: '/api/safetynotice/update_all',
  // 处理我的待办中的主流程操作
  DISPOSE_TRANSACTION_AUDIT: '/api/reportworkflow/audit',
  // 删除安全通知信息 api/safetynotice/del/1
  DELETE_NOTICE_URL: 'api/safetynotice/del',
  // 编辑信息报告
  COMPILE_INFORMATION_REPORTS: '/api/report/editReport',
  // 保存安全监察信息
  SAFETY_SUPERVISION_SAVE: '/api/securitymonitor/saveSafetyMonitor',
  // get启动信息报告流程
  INITIATORPROCEDURE: '/api/reportworkflow/start',
  // 安全通知处理我的待办 SAFETY_NOTICE_FLOW_AUDIT
  SAFETY_NOTICE_FLOW_TODO: '/api/safetynoticeflow/todo',
  // 我的待办--信息报告待办列表------GET
  PRESERVE_MESSAGE_LIST: '/api/reportworkflow/todo',
  // 我的已办--信息报告已办列表----POST
  HAVE_FINISHED_ACCTION: '/api/reportworkflow/done',
  // 查看历史详情
  SAFETY_NOTICE_AUDIT_HISTORY: '/api/safetynotice/audit_his',
  // 查询监察列表
  DEMAND_SECURITY_SUPERVISION_LIST: '/api/securitymonitor/findByParam',
  // 信息报告----查看审核历史记录---GET
  VIEW_AUDIT_HISTORY: '/api/report/audit_his',
  // 发送安全通知 主流程
  SAFETY_NOTICE_FLOW_ADUIT: '/api/safetynoticeflow/audit',
  // 安全通知子流程
  SAFETY_NOTICE_FLOW_ADUIT_CHILD: '/api/safetynoticeflow/audit_child',
  // 安全通知获得内容建议
  SAFETY_NOTICE_CONTENT: '/api/safetynotice/content',
  // 安全通知更新内容建议
  SAVE_SAFETY_NOTICE_CONTENT: '/api/safetynotice/content',
  // 安全通知单个部门详情
  SAVE_SAFETY_NOTICE_DEPTS: '/api/safetynotice/depts',
  // 安全通知已办
  SAFETY_NOTICE_FLOW_DONE: '/api/safetynoticeflow/done',
  // 发送安全通知
  SAFETY_NOTICE_START: '/api/safetynoticeflow/start',
  // 认领，签收
  SIGN_FOR_TASK: '/api/activiti/claim',
  // 取消认领 GET
  ACTIVITI_CANCEL_CLAIM_: '/api/activiti/unclaim',
  // 附件上传--单附件上传
  ATTACH_SAVE_URL: '/api/attach/save',
  // 附件下载
  FILE_DOWNLOAD: '/file/download',
  // 危险源新增----post
  ADD_HAZARD_ACTION: '/api/risk_source/addRiskSource',
  // 请求FC/LEC下拉框数据
  GET_FC_LEC_DATA: '/api/lecfc',
  // 保存风险管理
  SAVEAllRISKMANAGE: '/api/riskmanage/save_all',
  // 风险管理查询列表
  RISK_MANAGE_SEARCH_LIST: '/api/riskmanage/list',
  // 风险管理详情列表查询
  RISK_MANAGE_DETAIL_LIST: '/api/riskmanage',

  // 请求根原因下拉框数据----GET
  GET_ROOT_CAUSE: '/api/reason',
  // 根据原因分类，查询原因列表
  QUERY_LIST_DATA: '/api/reason/detail',
  // 查询危险源列表-----POST
  INPUIRE_HAZARD_LIST: '/api/risk_source/select',
  // 删除危险源信息
  REMOVE_RISK_SOURCE: '/api/risk_source',
  // 修改危险源信息
  COMPILE_RISK_SOURCE: '/api/risk_source/editRiskSource',
  // 启动危险源流程
  START_HAZARD_STREAM: '/api/risksourceworkflow/start',
  // 风险管理编辑
  UPDATE_RISK_MANAGE: '/api/riskmanage/update',
  // 删除风险管理 列表页使用
  DELETE_RISK_MANAGE: '/api/riskmanage',
  // 风险管理启动流程
  START_RISK_MANAGE: 'api/riskmanageflow/start',
  // 风险管理子列表详情
  RISK_MANAGE_CHILDREN: 'api/riskmanage/depts',
  // 风险管理我的代办
  RISK_MANAGE_TODOlIST: '/api/riskmanageflow/todo',
  // 风险管理主操作 审核历史
  RISK_MANAGE_START_0: 'api/riskmanage/audit_his',
  // 查询单个危险源对应的根原因信息
  INPUIRE_SIMGLE_ROOTCAUSE: '/api/risk_source/reasons',
  // 风险管理我的已办
  RISK_MANAGE_FLOW_DONE: '/api/riskmanageflow/done',
  // 风险管理-列出可选的控制部门
  RISK_MANAGE_CONTROL: '/api/riskmanage/control_depts',

  // 我的待办--危险源待办列表---GET
  HAZARD_AGENDA_LIST: '/api/risksourceworkflow/todo',
  // 我的已办--危险源已办列表
  HAZARD_ACTION_TaKEN_LIST: '/api/risksourceworkflow/done',
  // 危险源--查看审核历史记录
  EXAMINE_AUDIT_HISTORY: '/api/risk_source/audit_his',
  // 审核--处理我的待办中的主流程操作
  DISPOSE_HAZARD_AUDIT: '/api/risksourceworkflow/audit',
  // 根原因列表与危险源关联解除----delete
  REMOVE__HAZARD_ROOT_CAUSE: '/api/risk_source/rootReason',
  // 根据id查询单个危险源分类---GET
  GET_SINGLE_HAZARD: '/api/risk_category',
  // 风险管理审核意见
  RISK_MANAGE_FLOW_AUDIT: '/api/riskmanageflow/audit',
  // 风险管理部门级请求可控制人
  RISK_MANAGE_DEPT_CONTROL_PERSON: '/api/system/user/dept',
  // 风险管理增加危险源
  ADD_DEPT_RISK_SOURCE: '/api/risk_source/cateogry',
  // 风险管理根据辨识部门 和等级请求危险源分类
  RISK_CATEGORY_DEPT: '/api/risk_category',
  // 风险管理根据分类请求危险源
  RISK_SOURCE_CATEGORY: 'api/risk_source/category',
  // 风险管理保存危险源
  SAVE_RISK_MANAGE_CONTORL_SOURCE: '/api/riskmanage/dept_risk_source',
  // 风险管理查询已保留的风险源
  SEARCH_RISK_SOURCE: '/api/riskmanage/dept_risk_source',
  // 风险管理删除
  DELETE_RISK_SOURCE: '/api/riskmanage/dept_risk_source',
  // 风险管理保存危险源以及可控制人
  SAVE_ALL_CONTROL_DEPTS: '/api/riskmanage/control_depts',
  // 风险管理子流程审核
  RISK_MANAGE_FLOW_CHILD: '/api/riskmanageflow/audit_child',
  // 风险管理新增 措施
  ADD_RISK_MANAGE_STEP: '/api/riskmanage/dept_step',
  // 风险管理查询 措施
  SEARCH_RISK_MANAGE_DEPT_STEPS: '/api/riskmanage/dept_steps',
  // 风险管理编辑 措施
  MODIFY_RISK_MANAGE_DEPT_STEPS: '/api/riskmanage/dept_step',
  // 风险管理删除 措施
  DELETE_RISK_MANAGE_DEPT_STEPS: '/api/riskmanage/dept_step',
  // 风险管理 编辑 效果评估
  MODIFY_RISK_MANAGE_DEPTS_RESULT:'/api/riskmanage/depts',
  // 风险管理新增危险源 
  NEW_RISK_SOURCE:'/api/riskmanage/new_risk_source',
  // 风险管理修改
  UPDATE_RISK_SOURCE:'/api/riskmanage/update_risk_source',
  // 远程搜索所有用户信息
  SELECT_USER_ALL_ACTION: '/api/system/user/all',
  // 安全通知统计--主查询
  SAFETY_NODTICE_STATIS_LIST:'/api/safetynoticestatis/list',
  // 安全通知 年度查询
  SAFETY_NODTICE_YEAR_SRC_TYPE:'/api/safetynoticestatis/year_srctype',
  // 安全通知 本期来源
  SAFETY_NODTICE_PERIOD_SRC_TYPE:'/api/safetynoticestatis/period_srctype',
  // 安全通知 年度部门
  SAFETY_NODTICE_YEAR_DEPART:'/api/safetynoticestatis/year_depart',
  // 安全通知 本期部门
  SAFETY_NODTICE_PERIOD_DEPART:'/api/safetynoticestatis/period_depart',
  // 安全通知 月度部门
  SAFETY_NODTICE_STATIS_MONTH:'/api/safetynoticestatis/month',
  // 安全通知 部门类型
  SAFETY_NODTICE_SRC_DEPART:'/api/safetynoticestatis/depart',
  //风险管理  主查询
  RISK_STATIS_LIST:'/api/riskstatis/list',
  //风险管理 年度部门查询
  RISK_STATIS_YEAR_DEPART:'/api/riskstatis/year_depart',
  //风险管理 本期部门
  RISK_STATIS_PERIOD_DEPART:'/api/riskstatis/period_depart',
  //风险管理 危险源部门查询
  RISK_STATIS_RISK_SOURCE_YEAR_DEPART:'/api/riskstatis/rs_year_depart',
  // 信息报告--本期统计
  REPORT_CURRENT_PERIOD: '/api/report/selectReportStatistics',
  // 部门报告统计
  DEPARTMENT_REPORT_STATISTICS: '/api/report/selectReportStatisticsdept',
  // 新增规章制度  ---post
  ADD_RULES_REGULATIONS: '/api/train/rules/save',
  // 规章制度列表 ----get
  LIST_RULES_REGULATIONS: '/api/train/rules/list',
  // 删除规章制度
  DELETE_RULES_REGULATIONS: '/api/train/rules/delete',
  // 威胁列表查询 ---post
  MENACE_LIST_INQUIRE: '/api/treport/list'
}
