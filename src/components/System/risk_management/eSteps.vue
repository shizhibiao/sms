<template>
    <e-steps :active="pageNum">
        <e-step :title="title?title:'新建/修改'"></e-step>
        <e-step title="立项审批" 
        description="公司级:安技部-部门管理团队 部门级:部门管理团队（非安技部）"
        abbreviation="部门管理团队">
        </e-step>
        <e-step title="风险分析" 
        description="公司级:安技部-SMS风险管理岗 或 部门管理团队（非安技部） 部门级:SMS风险管理岗（非安技部）"
        abbreviation="SMS风险管理岗"
        ></e-step>
        <e-step title="风险控制措施" 
        description="公司级:安技部-SMS风险控制岗 或 SMS风险控制岗（非安技部）部门级:被指定人"
        abbreviation="SMS风险控制岗<br/>或<br/>被指定人">
        </e-step>
        <e-step title="部门审核" 
        description="公司级:安技部-部门管理团队 或 部门管理团队（非安技部） 部门级:单元经理"
        abbreviation="部门管理团队<br/>或<br/>单元经理">
        </e-step>
        <e-step title="一级风险核准" 
        description="公司级:安技部-安全管理经理 部门级:SMS对接经理"
        abbreviation="安全管理经理<br/>或<br/>SMS对接经理">
        </e-step>
        <e-step title="二级风险核准" 
        description="公司级:安技部-安全管理经理 部门级:SMS对接经理"
        abbreviation="安全管理经理<br/>或<br/>SMS对接经理">
        </e-step>
        <e-step title="三级风险核准" 
        description="公司级:公司领导 部门级:SMS对接经理"
        abbreviation="公司领导<br/>或<br/>SMS对接经理">
        </e-step>
        <e-step title="措施验证" 
        description="公司级:安技部-安全管理单元 部门级:SMS对接组"
        abbreviation="安全管理单元<br/>或<br/>SMS对接组">
        </e-step>
        <e-step title="验证核准" 
        description="公司级:安技部-安全管理经理 部门级:SMS对接经理"
        abbreviation="安全管理经理<br/>或<br/>SMS对接经理">
        </e-step>
        <e-step title="效果评估" 
        description="公司级:安技部-部门管理团队 部门级:部门管理团队（非安技部）"
        abbreviation="部门管理团队">
        </e-step>
        <e-step title="项目评价" 
        description="公司级:安技部-SMS风险管理岗 部门级:SMS风险控制岗（非安技部）"
        abbreviation="SMS风险管理岗">
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

