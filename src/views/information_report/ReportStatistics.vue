<template>
  <div class="animated fadeIn">
    <b-card no-body>
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick" style="height:75vh; overflow-y: auto">
          <el-tab-pane label="月度报告类型" name="MonthlyReportType" :lazy="true">
            <MonthlyReportType />
          </el-tab-pane>
          <el-tab-pane label="月度报告类型-图表" name="ReportMonthlyDepartmentType" :lazy="true">
            <ReportMonthlyDepartmentType />
          </el-tab-pane>
          <el-tab-pane label="月度部门报告数量" name="ReportsDepartmentNumber" :lazy="true">
            <ReportsDepartmentNumber />
          </el-tab-pane>
          <el-tab-pane label="月度部门报告数量-图表" name="ReportMonthlyDepartmentNumber" :lazy="true">
            <ReportMonthlyDepartmentNumber />
          </el-tab-pane>
          <el-tab-pane label="本期部门报告类型-图表" name="currentPeriod" :lazy="true">
            <ReportInformationTrendStatistics />
          </el-tab-pane>
        </el-tabs>
    </b-card>
</div>
</template>
<script>
import MonthlyReportType from './MonthlyReportType.vue'
import ReportsDepartmentNumber from './ReportsDepartmentNumber'
import ReportInformationTrendStatistics from './ReportInformationTrendStatistics'
import ReportMonthlyDepartmentType from './ReportMonthlyDepartmentType'
import ReportMonthlyDepartmentNumber from './ReportMonthlyDepartmentNumber'

export default {
  components: {
    MonthlyReportType,
    ReportsDepartmentNumber,
    ReportInformationTrendStatistics,
    ReportMonthlyDepartmentType,
    ReportMonthlyDepartmentNumber
  },
  data () {
    return {
      activeName: 'MonthlyReportType'
    }
  },
  methods: {
    handleClick () {
      console.log('点击了')
    }
  }
}
</script>
