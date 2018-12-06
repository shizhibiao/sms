<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-body>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="信息报告" name="infoReport" ref='infoReport'>
            <ReportBacklogList/>
          </el-tab-pane>
          <el-tab-pane label="飞行品质" name="flyQar" ref='flyQar'>
            <QualityFlightQuality/>
          </el-tab-pane>
          <el-tab-pane label="事件调查" name="evtSurvery" ref='evtSurvery'>
            <EventQuery/>
          </el-tab-pane>
          <el-tab-pane label="安全监察" name="securityMonitor" ref='securityMonitor'>
            <safety-supervision></safety-supervision>
          </el-tab-pane>
          <el-tab-pane label="安全通知" name="securityNotice" ref='securityNotice'>
            <security-notice></security-notice>
          </el-tab-pane>
          <el-tab-pane label="危险源" name="riskSource" ref='riskSource'>
            <RiskAgendaList />
          </el-tab-pane>
          <el-tab-pane label="风险管理" name="riskManage" ref='riskManage'>
            <risk-manage></risk-manage>
          </el-tab-pane>
          <el-tab-pane label="绩效考核" name="securityPerformance">
           <performance-test-todo/>
          </el-tab-pane>
          <!--<el-tab-pane label="威胁评估" name="threatAnalysis">-->
            <!--威胁评估-->
          <!--</el-tab-pane>-->
        </el-tabs>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
  import EventQuery from '../event_inspect/eventlistquery.vue'
  import ReportBacklogList from '../information_report/ReportBacklogList.vue'
  import securityNotice from '../security_notice/SecurityNoticeToDoList.vue'
  import safetySupervision from '../safety_supervision/SafetySupervisionTodoList.vue'
  import riskManage from '../risk_management/RiskManagementToDoList.vue'
  import QualityFlightQuality from '../flight_quality/QualityFlightQuality.vue'
  import RiskAgendaList from '../risk_management/Risk_agendaList.vue'
  import PerformanceTestTodo from '../security_performance/PerformanceTestTodo.vue'


  export default {
    name: 'TodoTask',
    components: {
      EventQuery,
      ReportBacklogList,
      securityNotice,
      safetySupervision,
      riskManage,
      QualityFlightQuality,
      RiskAgendaList,
      PerformanceTestTodo
    },
    data () {
      return {
        activeName: 'infoReport',
        curUser: {}
      }
    },
    methods: {
      handleClick (tab, event) {
        this.$store.commit('setterTodoActiviTab', tab.name)
        console.log(this.$refs)
        if(this.$refs[tab.name]&&this.$refs[tab.name].$children&&this.$refs[tab.name].$children[0]&&this.$refs[tab.name].$children[0].hasOwnProperty('refresh')){
          this.$refs[tab.name].$children[0].refresh()
          this.$forceUpdate()
        }
      }
    },
    created () {
      this.curUser = this.$store.state.user
      let storeName = this.$store.state.todoActiviTab
      if (storeName !== undefined && storeName !== null && storeName !== '') {
        this.activeName = storeName
      }


    }
  }
</script>

<style scoped>

</style>
