<template>
    <e-steps :active="pageNum">
        <e-step :title="title?title:'新建/修改'"></e-step>
        <e-step title="立项审批" 
        description="公司级:安技部-部门管理团队 部门级:部门管理团队（非安技部）"
        abbreviation="部门管理团队">
        </e-step>
        <e-step title="部门流转" 
        description="公司级:部门管理团队（非安技部） 部门级:单元经理"
        abbreviation="部门管理团队<br/>或<br/>单元经理"
        ></e-step>
        <e-step title="措施填写" 
        description="公司级:SMS对接成员 部门级:SMS对接组"
        abbreviation="SMS对接成员<br/>或<br/>SMS对接组">
        </e-step>
        <e-step title="部门审核" 
        description="公司级:部门管理团队（非安技部） 部门级:单元经理"
        abbreviation="部门管理团队<br/>或<br/>单元经理">
        </e-step>
        <e-step title="措施评估" 
        description="公司级:安技部-安全管理经理 部门级:SMS对接经理"
        abbreviation="安全管理经理<br/>或<br/>SMS对接经理">
        </e-step>
        <e-step title="措施验证" 
        description="公司级:安技部-全体成员 部门级:SMS对接成员"
        abbreviation="安技部全体成员<br/>或<br/>SMS对接成员">
        </e-step>
        <e-step title="验证核准" 
        description="公司级:安技部-安全管理经理 部门级:SMS对接经理"
        abbreviation="安全管理经理<br/>或<br/>SMS对接经理">
        </e-step>
        <e-step title="效果评估" 
        description="公司级:安技部-部门管理团队 部门级:部门管理团队（非安技部）"
        abbreviation="部门管理团队<br/>或<br/>部门管理团队">
        </e-step>
        <e-step title="结束"></e-step>
    </e-steps>
</template>
<script>
import eSteps from '@/components/steps/src/steps.vue'
import eStep from '@/components/steps/src/step.vue'
export default {
    props:['pageNum','title'],
    components:{
        eStep,
        eSteps
    }
}
</script>

