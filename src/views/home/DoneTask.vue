<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-body>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="信息报告" name="infoReport" :lazy="true">
            <ReportBacklogList />
          </el-tab-pane>
          <el-tab-pane label="飞行品质" name="flyQar" :lazy="true">
            <QualityHaveDone/>
          </el-tab-pane>
          <el-tab-pane label="事件调查" name="evtSurvery" :lazy="true">
            <EventHaveDone/>
          </el-tab-pane>
          <el-tab-pane label="安全监察" name="securityMonitor" :lazy="true">
           <supervision-done></supervision-done>
          </el-tab-pane>
          <el-tab-pane label="安全通知" name="securityNotice" :lazy="true">
          <security-notice></security-notice>
          </el-tab-pane>
          <el-tab-pane label="危险源" name="riskSource" :lazy="true">
            <RiskAgendaList />
          </el-tab-pane>
          <el-tab-pane label="风险管理" name="riskManage" :lazy="true">
           <risk-management></risk-management>
          </el-tab-pane>
          <el-tab-pane label="绩效考核" name="securityPerformance">
            <performance-test-done/>
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
  import ReportBacklogList from '../information_report/ReportBacklogList.vue'
  import EventHaveDone from '../event_inspect/EventHaveDone.vue'
  import securityNotice from '../security_notice/SecurityNoticeDone.vue'
  import riskManagement from '../risk_management/RiskManagementDone.vue'
  import QualityHaveDone from '../flight_quality/QualityHaveDone.vue'
  import RiskAgendaList from '../risk_management/Risk_agendaList.vue'
  import SupervisionDone from '../safety_supervision/SupervisionDone.vue'
  import PerformanceTestDone from '../security_performance/PerformanceTestDone.vue'
  export default {
    name: 'DoneTask',
    components: {
      ReportBacklogList,
      EventHaveDone,
      securityNotice,
      riskManagement,
      RiskAgendaList,
      QualityHaveDone,
      SupervisionDone,
      PerformanceTestDone
    },
    data () {
      return {
        activeName: 'infoReport',
        curUser: {}
      }
    },
    methods: {
      handleClick (tab, event) {
        this.$store.commit('setterDoneActiviTab', tab.name)
      }
    },
    created () {
      this.curUser = this.$store.state.user
      let storeName = this.$store.state.doneActiviTab
      if (storeName !== undefined && storeName !== null && storeName !== '') {
        this.activeName = storeName
      }
    }
  }
</script>

<style scoped>

</style>
