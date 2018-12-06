<template>
  <e-steps :active="pageNum">
    <e-step title="新建"></e-step>
    <e-step title="立项审核"
            description="公司级：安技部-部门管理团队  部门级：部门管理团队(非安技部)"
            abbreviation="部门管理团队<br/>或<br/>部门管理团队">
    </e-step>
    <e-step title="监察审计计划"
            description="公司级：安技部-安全管理经理 部门级：SMS对接经理"
            abbreviation="安全管理经理<br/>或<br/>SMS对接经理"></e-step>
    <e-step title="组长安排"
            description="受理的组长"
            abbreviation="受理的组长">
    </e-step>
    <e-step title="表单填写"
            description="受理的组员"
            abbreviation="受理的组员">
    </e-step>
    <e-step title="组长审核"
            description="受理的组长"
            abbreviation="受理的组长">
    </e-step>
    <e-step title="各部门确认"
            description="公司级：部门管理团队(非安技部)  部门级：单元经理"
            abbreviation="部门管理团队<br/>或<br/>单元经理">
    </e-step>
    <e-step title="监察审查结果"
            description="公司级：安技部-部门管理团队  部门级：部门管理团队(非安技部)"
            abbreviation="部门管理团队<br/>或<br/>部门管理团队">
    </e-step>
    <e-step title="结束"></e-step>
  </e-steps>
</template>
<script>
import eSteps from '@/components/steps/src/steps.vue'
import eStep from '@/components/steps/src/step.vue'
export default {
  props: ['pageNum', 'title'],
  components: {
    eStep,
    eSteps
  }
}
</script>

