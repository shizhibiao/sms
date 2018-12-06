<template>
  <div class="animated fadeIn">
    <b-card no-body >
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" style="height:75vh; overflow-y: auto">
        <el-tab-pane label="统计" name="statistics" :lazy="true">
            <EventTableStatistics/>
        </el-tab-pane>
          <el-tab-pane label="责任部门-事件等级" name="department" :lazy="true">
            <EventDepartment/>
          </el-tab-pane>
          <el-tab-pane label="月度-事件等级" name="monthly" :lazy="true">
            <EventMonthly/>
          </el-tab-pane>
          <el-tab-pane label="事件等级" name="level" :lazy="true">
            <EventLevel/>
          </el-tab-pane>
          <el-tab-pane label="责任部门-原因分析一级" name="responsible" :lazy="true">
            <EventResponsible/>
          </el-tab-pane>
          <el-tab-pane label="本期-原因分析一级" name="Curren1" :lazy="true">
            <EventCurrent/>
          </el-tab-pane>
          <el-tab-pane label="本期-原因二级" name="Curren2" :lazy="true">
            <EventCurrent2/>
          </el-tab-pane>
          <el-tab-pane label="事件等级-原因分析一级" name="reason1" :lazy="true">
            <EventReason1/>
          </el-tab-pane>
          <el-tab-pane label="机型-原因分析一级" name="reason2" :lazy="true">
            <EventReason2/>
          </el-tab-pane>
        </el-tabs>
    </b-card>
  </div>
</template>
<script>
import EventDepartment from './EventStatistics/EventDepartment.vue'
import EventMonthly from './EventStatistics/EventMonthly.vue'
import EventLevel from './EventStatistics/EventLevel.vue'
import EventResponsible from './EventStatistics/EventResponsible.vue'
import EventCurrent from './EventStatistics/EventCurrent.vue'
import EventCurrent2 from './EventStatistics/EventCurrent2.vue'
import EventReason1 from './EventStatistics/EventReason1.vue'
import EventReason2 from './EventStatistics/EventReason2.vue'
import EventTableStatistics from './EventStatistics/EventTableStatistics.vue'
export default {
  components: {
    EventDepartment,
    EventMonthly,
    EventLevel,
    EventResponsible,
    EventCurrent,
    EventCurrent2,
    EventReason1,
    EventReason2,
    EventTableStatistics
  },
  data () {
    return {
      activeName: 'statistics',
      curUser: {}
    }
  },
  methods: {
    handleClick (tab, event) {
      this.$store.commit('eventstatistics', tab.name)
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
