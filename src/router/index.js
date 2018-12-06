import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Login from '@/views/Login'
import RoleList from '@/views/system/RoleList'
import RoleUserEdit from '@/views/system/RoleUserEdit'
import RoleRightsView from '@/views/system/RoleRightsView'
import UserList from '@/views/system/UserList'
import UserRoleEdit from '@/views/system/UserRoleEdit'
import ChangePassword from '@/views/system/ChangePassword'
import SystemLog from '@/views/system/SystemLog'
import OALogin from '@/views/OALogin'
import Dictionary from '@/views/system/Dictionary'
import ReasonList from '@/views/system/ReasonList'
import DepartmentList from '@/views/system/DepartmentList'
import ActivitiManager from '@/views/activiti/ActivitiManager'
import ImageDisplay from '@/views/activiti/ImageDisplay'
import TraceFlowImageDisplay from '@/views/activiti/TraceFlowImageDisplay'

// home
import DoneTask from '@/views/home/DoneTask'
import MyMessage from '@/views/home/MyMessage'
import TodoTask from '@/views/home/TodoTask'
import BillBoard from '@/views/home/BillBoard'
// 信息报告
import ReportList from '@/views/information_report/ReportList'
import ReportAdd from '@/views/information_report/ReportAdd'
import ReportCompile from '@/views/information_report/ReportCompile'
import ReportExamine from '@/views/information_report/ReportExamine'
import ReportIndustrySafety from '@/views/information_report/ReportIndustrySafety'
import ReportIndustrySafetyShow from '@/views/information_report/ReportIndustrySafetyShow'
import ReportStatistics from '@/views/information_report/ReportStatistics'
import InfoReport_enUS from '@/views/information_report/InfoReport_enUS'
import InfoReport_zhCN from '@/views/information_report/InfoReport_zhCN'

// 飞行品质
import QualityList from '@/views/flight_quality/QualityList'
import QualityStat from '@/views/flight_quality/QualityStat'
import QualityEdit from '@/views/flight_quality/QualityEdit'
import QualityFlightReport from '@/views/flight_quality/QualityFlightReport'
import QualityModify from '@/views/flight_quality/QualityModify'
import QualityChange from '@/views/flight_quality/QualityChange'
import QualityProject from '@/views/flight_quality/QualityProject'
// 事件调查
import EventList from '@/views/event_inspect/EventList'
import EventStat from '@/views/event_inspect/EventStat'
import EditPage from '@/views/event_inspect/footer.vue'
import EventExamine from '@/views/event_inspect/EventProject.vue'
import EventStatistics from '@/views/event_inspect/EventStatistics.vue'
// 安全监察
import SupervisionList from '@/views/safety_supervision/SupervisionList'
import SupervisionStat from '@/views/safety_supervision/SupervisionStat'
import SupervisionEdit from '@/views/safety_supervision/SupervisionEdit'
import SupervisionLook from '@/views/safety_supervision/SupervisionLook'
import SupervisionAct from '@/views/safety_supervision/SupervisionAct'
import RejectAdd from '@/views/safety_supervision/RejectAdd'
import Statistics from '@/views/safety_supervision/Statistics'
import CheckAdd from '@/views/safety_supervision/CheckAdd'
import CheckList from '@/views/safety_supervision/CheckList'
import CheckEdit from '@/views/safety_supervision/CheckEdit'
// 邮件发送
import SendMail from '@/views/mail/SendMail'
// 安保管理
import EquipmentStandard from '@/views/security_management/EquipmentStandard'
import EquipmentManagement from '@/views/security_management/EquipmentManagement'
import EquipmentStandardShow from '@/views/security_management/EquipmentStandardShow'
import EquipmentManagementShow from '@/views/security_management/EquipmentManagementShow'
import EquipmentManagementDetail from '@/views/security_management/EquipmentManagementDetail'
import SecurityContract from '@/views/security_management/SecurityContract'
import SecurityContractShow from '@/views/security_management/SecurityContractShow'
import TestPlan from '@/views/security_management/TestPlan'
import SecurityTest from '@/views/security_management/SecurityTest'
import TestAdd from '@/views/security_management/TestAdd'
import TestEdit from '@/views/security_management/TestEdit'
import TestLook from '@/views/security_management/TestLook'
// 威胁信息报告
import ThreatInformationReportList from '@/views/security_management/ThreatInformationReportList'
import ThreatInformationReportAdd from '@/views/security_management/ThreatInformationReportAdd'
import ThreatInformationReportCompile from '@/views/security_management/ThreatInformationReportCompile'
// 威胁评估报告
import ThreatAssessmentReportList from '@/views/security_management/ThreatAssessmentReportList'
import ThreatAssessmentReportAdd from '@/views/security_management/ThreatAssessmentReportAdd'
import ThreatAssessmentReportCompile from '@/views/security_management/ThreatAssessmentReportCompile'

// 安全通知
import SecurityNoticeNew from '@/views/security_notice/SecurityNoticeNew'
import SecurityNoticeList from '@/views/security_notice/SecurityNoticeList'
import SecurityNoticeLook from '@/views/security_notice/SecurityNoticeLook'
import SecurityNoticeListEdit from '@/views/security_notice/SecurityNoticeListEdit'
import SecurityNoticeStat from '@/views/security_notice/SecurityNoticeStat'
// 安全通知-----------立项审批
import SecurityNoticeStart0 from '@/views/security_notice/SecurityNoticeStart0'
// 安全通知-----------部门流转
import SecurityNoticeStart1 from '@/views/security_notice/SecurityNoticeStart1'
// 安全通知-----------措施填写 子流程
import SecurityNoticeMeasures from '@/views/security_notice/SecurityNoticeMeasures1'
// 安全通知-----------部门审核 子流程
import SecurityNoticeAudit from '@/views/security_notice/SecurityNoticeAudit2'
// 安全通知-----------措施评估 子流程
import SecurityNoticeAssessment from '@/views/security_notice/SecurityNoticeStart3'
// 安全通知-----------措施验证 子流程
import SecurityNoticeVerification from '@/views/security_notice/SecurityNoticeStart4'
// 安全通知-----------验证核准 子流程
import SecurityNoticeApprove from '@/views/security_notice/SecurityNoticeStart5'
// 安全通知-----------效果评估 主流程
import SecurityNoticeResult from '@/views/security_notice/SecurityNoticeStart6'
// 安全通知-----------立项审批（中转站）
import TransferStop from '@/views/security_notice/TransferStop'
// 安全公告
import SafetySecurityNotice from '@/views/security_advisory/SafetySecurityNotice'
// 安全公告
import SafetySecurityNoticeShow from '@/views/security_advisory/SafetySecurityNoticeShow'
// 安全培训
import SecurityTrainingDocument from '@/views/security_training/document'
import SecurityExamination from '@/views/security_training/SecurityExamination'
import DocumentAdd from '@/views/security_training/DocumentAdd'
import RegulationsList from '@/views/security_training/RegulationsList'
import SecurityResource from '@/views/security_training/SecurityResource'
import SecurityResourceAdd from '@/views/security_training/SecurityResourceAdd'
// 风险管理
import RiskManagementList from '@/views/risk_management/RiskManagementList'
// 风险管理新增
import RiskManagementNew from '@/views/risk_management/RiskManagementNew'
// 风险管理查看
import RiskManagementLook from '@/views/risk_management/RiskManagementLook'
// 风险管理编辑
import RiskManagementEdit from '@/views/risk_management/RiskManagementEdit'
// 风险管理立项审批
import RiskManagementStart0 from '@/views/risk_management/RiskManagementStart0'
// 风险管理 风险分析
import RiskManagementStart1 from '@/views/risk_management/RiskManagementStart1'
// 风险管理 风险控制措施
import RiskManagementStart2 from '@/views/risk_management/RiskManagementStart2'
// 风险管理 部门审核
import RiskManagementStart3 from '@/views/risk_management/RiskManagementStart3'
// 风险管理 风险等级核准
import RiskManagementStart4 from '@/views/risk_management/RiskManagementStart4'
// 风险管理 措施验证
import RiskManagementStart5 from '@/views/risk_management/RiskManagementStart5'
// 风险管理 验证核准
import RiskManagementStart6 from '@/views/risk_management/RiskManagementStart6'
// 风险管理 效果评估
import RiskManagementStart7 from '@/views/risk_management/RiskManagementStart7'
// 风险管理 项目统计
import RiskManagementStart8 from '@/views/risk_management/RiskManagementStart8'

// 风险管理 立项修改
import RiskManagementTransferStop from '@/views/risk_management/RiskManagementTransferStop'

import RiskManagementStat from '@/views/risk_management/RiskManagementStat'
import RiskStandard from '@/views/risk_management/RiskStandard'
import RiskSourceList from '@/views/risk_management/RiskSourceList'
import RiskListHazard from '@/views/risk_management/Risk_ListHazard'
import RiskExamineHazard from '@/views/risk_management/Risk_examineHazard'
import RiskCompileHazard from '@/views/risk_management/Risk_CompileHazard'
// 新增危险源
import RiskAddHazard from '@/views/risk_management/Risk_AddHazard'

import ThreatenFcLec from '@/views/security_management/ThreatenFcLec'

// 安全日志
import SecurityLog from '@/views/security_log/SecurityLog'
import SecurityReport from '@/views/security_log/SecurityReport'
import SecurityReportAdd from '@/views/security_log/SecurityReportAdd'

// 安全目标
import SecurityGoalList from '@/views/security_goal/SecurityGoalList'
import SecurityGoalNew from '@/views/security_goal/SecurityGoalNew'

// 安全绩效
import PerformanceRepository from '@/views/security_performance/PerformanceRepository'
import PerformanceSearch from '@/views/security_performance/PerformanceSearch'
import PerformanceTest from '@/views/security_performance/PerformanceTest'
import PerformanceTestAdd from '@/views/security_performance/PerformanceTestAdd'
import PerformanceTestEdit from '@/views/security_performance/PerformanceTestEdit'
import PerformanceTestForm from '@/views/security_performance/PerformanceTestForm'
import PerformanceTestAct from '@/views/security_performance/PerformanceTestAct'
import PerformanceTestAct1 from '@/views/security_performance/PerformanceTestAct1'
import PerformanceTestAct2 from '@/views/security_performance/PerformanceTestAct2'
import PerformanceTestClose from '@/views/security_performance/PerformanceTestClose'
import PerformanceTestLook from '@/views/security_performance/PerformanceTestLook'
import PerformanceWarning from '@/views/security_performance/PerformanceWarning'
import PerformanceRepositoryNew from '@/views/security_performance/PerformanceRepositoryNew'
import PerformanceStat from '@/views/security_performance/PerformanceStat'
Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/oalogin',
      name: 'OALogin',
      component: OALogin
    },
    {
      path: '/info_cn',
      name: 'InfoReportCn',
      component: InfoReport_zhCN
    },
    {
      path: '/info_en',
      name: 'InfoReportEn',
      component: InfoReport_enUS
    },
    {
      path: '/',
      redirect: '/home/todo',
      name: '首页',
      component: Full,
      children: [
        {
          path: 'home',
          name: '我的',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'todo',
              name: '待办事项',
              component: TodoTask
            },
            {
              path: 'done',
              name: '已办事项',
              component: DoneTask
            },
            {
              path: 'message',
              name: '站内消息',
              component: MyMessage
            },
            {
              path: 'board',
              name: '公告和信息',
              component: BillBoard
            }
          ]
        },
        {
          path: 'notify',
          redirect: '/notify/list',
          name: '安全通知',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'list',
              name: '通知列表',
              component: SecurityNoticeList
            },
            {
              path: 'new',
              name: '新建',
              component: SecurityNoticeNew
            },
            {
              path: 'edit/:id',
              name: '编辑',
              component: SecurityNoticeListEdit

            },
            {
              path: 'look',
              name: '查看',
              component: SecurityNoticeLook
            },
            {
              path: 'approve/:id',
              name: '立项审批',
              component: SecurityNoticeStart0
            },
            {
              path: 'start/:id',
              name: '部门流转',
              component: SecurityNoticeStart1
            },
            {
              path: 'measures/:id',
              name: '措施填写',
              component: SecurityNoticeMeasures
            },
            {
              path: 'audit/:id',
              name: '部门审核',
              component: SecurityNoticeAudit
            },
            {
              path: 'assessment/:id',
              name: '措施评估',
              component: SecurityNoticeAssessment
            },
            {
              path: 'verification/:id',
              name: '措施验证',
              component: SecurityNoticeVerification
            },
            {
              path: 'approve/:id',
              name: '验证核准',
              component: SecurityNoticeApprove
            },
            {
              path: 'result/:id',
              name: '效果评估',
              component: SecurityNoticeResult
            },
            {
              path: 'stat',
              name: '统计',
              component: SecurityNoticeStat
            },
            {
              path: 'transferStop',
              name: '立项修改',
              component: TransferStop
            }

          ]
        },
        {
          path: 'proclamation',
          redirect: '/proclamation/post',
          name: '安全公告',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'post',
              name: '公告发布',
              component: SafetySecurityNotice
            },
            {
              path: 'news_edit/:noticeId/:flag',
              name: '新增编辑公告',
              component: SafetySecurityNoticeShow
            }
          ]
        },
        {
          path: 'event',
          redirect: '/event/list',
          name: '事件调查',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'list',
              name: '列表查询',
              component: EventList,
              props: true
            },
            {
              path: 'start/:id',
              name: '编辑',
              component: EventStat,
              props: true
            },
            {
              path: 'modify/:id/:taskId',
              name: '修改',
              component: EditPage,
              props: true
            },
            {
              path: 'examine/:id/:taskId',
              name: '立项审核',
              component: EventExamine
            },
            {
              path: 'stat',
              name: '统计',
              component: EventStatistics
            }
          ]
        },
        {
          path: 'report',
          redirect: '/report/list',
          name: '信息报告',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'list',
              name: '报告列表',
              component: ReportList
            },
            {
              path: 'start/:id',
              name: '新建',
              component: ReportAdd
            },
            {
              path: 'compile/:id',
              name: '编辑',
              component: ReportCompile
            },
            {
              path: 'examine/:id',
              name: '查看/执行',
              component: ReportExamine
            },
            {
              path: 'stat',
              name: '统计',
              component: ReportStatistics
            },
            {
              path: 'news',
              name: '行业安全信息',
              component: ReportIndustrySafety
            },
            {
              path: 'news_edit/:reportNumber/:flag',
              name: '查看/新增/编辑行业信息',
              component: ReportIndustrySafetyShow
            }
          ]
        },
        {
          path: 'security',
          redirect: '/security/equipment/standard',
          name: '安保管理',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'contract',
              name: '安保协议',
              component: SecurityContract
            },
            {
              path: 'news_edit/:tscId/:flag',
              name: '新增编辑安保协议',
              component: SecurityContractShow
            },
            {
              path: 'equipment/standard',
              name: '设备标准',
              component: EquipmentStandard
            },
            {
              path: 'standard-edit/:tsesId/:flag',
              name: '查看/新增/编辑设备标准',
              component: EquipmentStandardShow
            },
            {
              path: 'equipment/management',
              name: '设备管理',
              component: EquipmentManagement
            },
            {
              path: 'management-edit/:tesmId/:flag',
              name: '新增/编辑设备管理',
              component: EquipmentManagementShow
            },
            {
              path: 'management-detail/:tesmId/:flag',
              name: '设备管理详情',
              component: EquipmentManagementDetail
            },
            {
              path: 'standard',
              name: '威胁评估标准',
              component: ThreatenFcLec
            },
            {
              path: 'treport',
              name: '威胁信息报告列表',
              component: ThreatInformationReportList
            },
            {
              path: 'testplan',
              name: '安保测试计划',
              component: TestPlan
            },
            {
              path: 'testadd',
              name: '安保测试计划新增',
              component: TestAdd
            },
            {
              path: 'testedit',
              name: '安保测试计划编辑',
              component: TestEdit
            },
            {
              path: 'testlook',
              name: '安保测试计划查看',
              component: TestLook
            },
            {
              path: 'test',
              name: '安保测试',
              component: SecurityTest
            },
            {
              path: 'add-treport',
              name: '新增威胁信息报告',
              component: ThreatInformationReportAdd
            },
            {
              path: 'compile-treport',
              name: '修改威胁信息报告',
              component: ThreatInformationReportCompile
            },
            {
              path: 'treport1',
              name: '威胁评估报告列表',
              component: ThreatAssessmentReportList
            },
            {
              path: 'add-treport1',
              name: '新增威胁评估报告',
              component: ThreatAssessmentReportAdd
            },
            {
              path: 'compile-treport1',
              name: '修改威胁评估报告',
              component: ThreatAssessmentReportCompile
            }
          ]
        },
        {
          path: 'log',
          redirect: '/log/statis',
          name: '安全日志',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'statis',
              name: '业务统计',
              component: SecurityLog
            },
            {
              path: 'report',
              name: '日志报告',
              component: SecurityReport

            },
            {
              path: 'new',
              name: '新增日志报告 ',
              component: SecurityReportAdd
            }
          ]
        },
        {
          path: 'training',
          redirect: '/training/document',
          name: '安全培训',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'document',
              name: '列表',
              component: SecurityTrainingDocument
            },
            {
              path: 'examination',
              name: '考试',
              component: SecurityExamination
            },
            {
              path: 'documentAdd/:id/:flag',
              name: '新建',
              component: DocumentAdd
            },
            {
              path: 'regulationsList',
              name: '规章列表',
              component: RegulationsList
            },
            {
              path: 'resource',
              name: '材料',
              component: SecurityResource
            },
            {
              path: 'new_resource',
              name: '新增/编辑/查看',
              component: SecurityResourceAdd
            }
          ]
        },
        {
          path: 'qar',
          redirect: '/qar/list',
          name: '飞行品质',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'list',
              name: '列表',
              component: QualityList
            },
            {
              path: 'start/:id',
              name: '编辑',
              component: QualityEdit
            },
            {
              path: 'stat',
              name: '统计',
              component: QualityStat
            },
            {
              path: 'report',
              name: '报告',
              component: QualityFlightReport
            },
            {
              path: 'modilfy/:id',
              name: '事件报告',
              component: QualityModify
            },
            {
              path: 'change/:id/:taskId',
              name: '修改',
              component: QualityChange
            },
            {
              path: 'examine/:id/:taskId',
              name: '立项审核',
              component: QualityProject
            }
          ]
        },
        {
          path: 'monitor',
          redirect: '/monitor/list',
          name: '安全监察',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'list',
              name: '列表',
              component: SupervisionList
            },
            {
              path: 'edit/:id',
              name: '新增 / 编辑',
              component: SupervisionEdit
            },
            {
              path: 'look/:id',
              name: '查看',
              component: SupervisionLook
            },
            {
              path: 'act/:id',
              name: '流程执行',
              component: SupervisionAct
            },
            {
              path: 'reject/:id',
              name: '立项修改',
              component: RejectAdd
            },
            {
              path: 'start/:id',
              name: '流程执行',
              component: SupervisionStat
            },
            {
              path: 'stat',
              name: '统计',
              component: Statistics
            },
            {
              path: 'bill',
              name: '监察单',
              component: CheckList
            },
            {
              path: 'billadd',
              name: '新增监察单',
              component: CheckAdd
            },
            {
              path: 'billedit',
              name: '编辑监察单',
              component: CheckEdit
            }

          ]
        },
        {
          path: 'risk',
          redirect: '/risk/list',
          name: '风险管理',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'list',
              name: '风险列表',
              component: RiskManagementList
            },
            {
              path: 'start/:id',
              name: '编辑',
              component: null
            },
            {
              path: 'stat',
              name: '风险统计',
              component: RiskManagementStat
            },
            {
              path: 'standard',
              name: '风险标准',
              component: RiskStandard
            },
            {
              path: 'hazard-stat',
              name: '危险源管理',
              component: RiskSourceList
            },
            {
              path: 'hazard-list',
              name: '危险源列表',
              component: RiskListHazard
            },
            {
              path: 'add-hazard',
              name: '新增危险源',
              component: RiskAddHazard,
              hidden: true
            },
            {
              path: 'compile-hazard',
              name: '编辑危险源',
              component: RiskCompileHazard,
              hidden: true
            },
            {
              path: 'examine-hazard/:id',
              name: '查看/执行',
              component: RiskExamineHazard
            },
            {
              path: 'new',
              name: '新增风险管理',
              component: RiskManagementNew
            },
            {
              path: 'edit/:id',
              name: '编辑风险管理',
              component: RiskManagementEdit
            },
            {
              path: 'look',
              name: '查看风险管理',
              component: RiskManagementLook
            },
            {
              path: 'start0',
              name: '立项审批',
              component: RiskManagementStart0
            },
            {
              path: 'start1',
              name: '风险分析',
              component: RiskManagementStart1
            },
            {
              path: 'start2',
              name: '风险控制措施',
              component: RiskManagementStart2
            },
            {
              path: 'start3',
              name: '部门审核',
              component: RiskManagementStart3
            },
            {
              path: 'start4',
              name: '风险等级核准',
              component: RiskManagementStart4
            },
            {
              path: 'start5',
              name: '措施验证',
              component: RiskManagementStart5
            },
            {
              path: 'start6',
              name: '验证核准',
              component: RiskManagementStart6
            },
            {
              path: 'start7',
              name: '效果评估',
              component: RiskManagementStart7
            },
            {
              path: 'start8',
              name: '项目统计',
              component: RiskManagementStart8
            },
            {
              path: 'risk_transfer_stop',
              name: '立项修改',
              component: RiskManagementTransferStop
            }
          ]
        },
        {
          path: 'goal',
          redirect: '/goal/list',
          name: '安全目标',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '/goal/list',
              name: '安全目标管理',
              component: SecurityGoalList
            },
            {
              path: '/goal/new',
              name: '安全目标管理',
              component: SecurityGoalNew
            }
          ]
        },
        {
          path: 'performance',
          redirect: '/performance/repository',
          name: '安全绩效',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '/performance/repository',
              name: '绩效指标库',
              component: PerformanceRepository
            },
            {
              path: '/performance/warning',
              name: '绩效预警',
              component: PerformanceWarning
            },
            {
              path: '/performance/search',
              name: '绩效查询',
              component: PerformanceSearch
            },
            {
              path: '/performance/test',
              name: '绩效考核',
              component: PerformanceTest
            },
            {
              path: '/performance/new_repository',
              name: '指标库',
              component: PerformanceRepositoryNew
            },
            {
              path: '/performance/testadd',
              name: '绩效考核新增',
              component: PerformanceTestAdd
            },
            {
              path: '/performance/testedit',
              name: '绩效考核编辑',
              component: PerformanceTestEdit
            },
            {
              path: '/performance/testform',
              name: '表单填写',
              component: PerformanceTestForm
            },
            {
              path: '/performance/stat',
              name: '统计',
              component: PerformanceStat
            },
            {
              path: '/performance/testact',
              name: '单元审核',
              component: PerformanceTestAct
            },
            {
              path: '/performance/testact1',
              name: '部门审核',
              component: PerformanceTestAct1
            },
            {
              path: '/performance/testact2',
              name: '公司批准',
              component: PerformanceTestAct2
            },
            {
              path: '/performance/testclose',
              name: '驳回新增',
              component: PerformanceTestClose
            },
            {
              path: '/performance/testlook',
              name: '查看',
              component: PerformanceTestLook
            }
          ]
        },
        {
          path: 'mail',
          redirect: '/mail/send-mail',
          name: '邮件',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'send-mail/:type/:id',
              name: '邮件发送',
              component: SendMail
            }
          ]
        },
        {
          path: 'system',
          redirect: '/system/role-list',
          name: '系统',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'role-list',
              name: '角色列表',
              component: RoleList
            },
            {
              path: 'role-user/:id',
              name: '角色成员管理',
              component: RoleUserEdit
            },
            {
              path: 'role-rights/:id',
              name: '查看权限角色列表',
              component: RoleRightsView
            },
            {
              path: 'user-list',
              name: '用户列表',
              component: UserList
            },
            {
              path: 'user-role/:id',
              name: '分配角色',
              component: UserRoleEdit
            },
            {
              path: 'change-password/:id',
              name: '修改密码',
              component: ChangePassword
            },
            {
              path: 'log',
              name: '日志',
              component: SystemLog
            },
            {
              path: 'dictionary',
              name: '数据字典',
              component: Dictionary
            },
            {
              path: 'reason',
              name: '事件原因',
              component: ReasonList
            },
            {
              path: 'depart',
              name: '部门维护',
              component: DepartmentList
            },
            {
              path: 'activiti',
              name: '流程图管理',
              component: ActivitiManager
            },
            {
              path: 'jbpm/:id',
              name: '查看流程图',
              component: ImageDisplay
            },
            {
              path: 'trace/:id',
              name: '流程跟踪图',
              component: TraceFlowImageDisplay
            }
          ]
        }
      ]
    }
  ]
})
