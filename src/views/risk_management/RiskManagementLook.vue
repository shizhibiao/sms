<template>

    <div class="animated fadeIn">

        <risk-management-base

        :riskId='riskId'
        :taskId='taskId'
        :noWritable='true'
        ></risk-management-base>
        <!-- 附件 -->

        <el-tabs  type="border-card" style="margin-bottom:24px" @tab-click='handleTabsClick'>
           <el-tab-pane :label="item.processDeptName"  v-for='(item,index) in rmDepartmentDOList' :key='index' >
                <template>
                    <el-card>
                        <el-table size="mini"
                          :data="[item]"
                          style="width: 100%">
                              <el-table-column
                                 fixed

                                label="责任部门">
                                    <template slot-scope="scope">
                                        <div slot="reference" class="gist-wrapper">
                                            {{ scope.row.processDeptName}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                label="风险分析员">
                                    <template slot-scope="scope">
                                        <div slot="reference" class="gist-wrapper">
                                            {{ scope.row.processUserName}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                label="风险分析时间">
                                    <template slot-scope="scope">
                                        <div slot="reference" class="gist-wrapper">
                                            {{ scope.row.processDate}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                label="控制部门">
                                    <template slot-scope="scope">
                                        <div slot="reference" class="gist-wrapper">
                                            {{ scope.row.controlDeptName}}
                                        </div>

                                    </template>
                                </el-table-column>
                                <el-table-column
                                label="控制人">
                                    <template slot-scope="scope">
                                        <div slot="reference" class="gist-wrapper">
                                            {{ scope.row.controlUserName}}
                                        </div>

                                    </template>
                                </el-table-column>
                                <el-table-column
                                label="风险等级">
                                    <template slot-scope="scope">
                                        <div slot="reference" class="gist-wrapper">
                                            {{ scope.row.riskLevel}}
                                        </div>

                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="评估人">
                                    <template slot-scope="scope">
                                        <div slot="reference" class="gist-wrapper">
                                            {{ scope.row.verifierName}}
                                        </div>

                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="评估时间">
                                    <template slot-scope="scope">
                                        <div slot="reference" class="gist-wrapper">
                                            {{ scope.row.verifyDate}}
                                        </div>

                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="评估结果">
                                    <template slot-scope="scope">
                                        <div slot="reference" class="gist-wrapper">
                                            {{ resultFilter(scope.row.effectEvaluate)}}
                                        </div>

                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="流程状态">
                                    <template slot-scope="scope">
                                        <div slot="reference" class="gist-wrapper">
                                            {{ scope.row.statusDesc}}
                                        </div>

                                    </template>
                                </el-table-column>

                        </el-table>
                    </el-card>

                </template>
                <template>
                    <el-tabs tab-position="top" @tab-click="handleClick(item)" style='margin-top:30px'  type="border-card">
                        <el-tab-pane label="风险分析">
                            <template>
                                <el-table
                                :data="riskTabList"
                                >
                                        <el-table-column
                                            type="index"
                                            fixed

                                            width="50">
                                        </el-table-column>
                                        <el-table-column

                                            label="辨识部门"
                                        >
                                            <template slot-scope="scopes">
                                                  {{scopes.row.riskSourceDO.identifyDeptName}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column

                                            label="危险源编号"
                                        >
                                            <template slot-scope="scopes">
                                                  {{scopes.row.riskSourceDO.riskNo}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column

                                            label="危险源描述">
                                            <template slot-scope="scopes">
                                                  {{scopes.row.riskSourceDO.riskDesc}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="riskResult"
                                            label="可能导致的风险或后果"
                                        >
                                            <template slot-scope="scopes">
                                                  {{scopes.row.riskSourceDO.riskResult}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="riskGrade"
                                            label="风险等级"
                                        >
                                            <template slot-scope="scopes">
                                                  {{scopes.row.riskSourceDO.riskGrade}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="acception"
                                            label="可接受程度">
                                            <template slot-scope="scopes">
                                                  {{scopes.row.riskSourceDO.acception}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column

                                            label="对应规则编号"
                                        >
                                            <template slot-scope="scopes">
                                                  {{scopes.row.riskSourceDO.riskMeasure}}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                            </template>
                        </el-tab-pane>
                            <el-tab-pane label="控制措施">
                                <template>
                                    <el-table
                                    :data="controlTableData"
                                    style="width: 100%">
                                        <el-table-column
                                            prop="deptName"
                                            label="责任部门"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                            prop="userName"
                                            label="责任人"
                                            width="180">
                                        </el-table-column>
                                        <el-table-column
                                            prop="planDate"
                                            label="计划日期"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                            prop="content"
                                            label="控制措施"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                            label="完成情况"
                                        >
                                            <template slot-scope="scopes">

                                                <el-switch
                                                v-model="scopes.row.doneResult"
                                                :active-value="1"
                                                :inactive-value="0"
                                                active-text="完成"
                                                inactive-text="未完成"
                                                disabled
                                                >
                                            </el-switch>
                                            </template>
                                        </el-table-column>

                                    </el-table>
                                </template>
                        </el-tab-pane>

                    </el-tabs>
                </template>


           </el-tab-pane>

        </el-tabs>

        <risk0
        :riskId='riskId'
        :taskId='taskId'
        :noWritable='true'
        ></risk0>

        <adjunct
         ref='adjunct'
         :safetyId='riskId'
         :taskId='taskId'
         :uploadFile='true'
         tableName='t_risk_manager'
         >
         </adjunct>

        <b-card>
            <eSteps></eSteps>
            <div class="btnBox" style='text-align:center'>
               <el-button @click ='goBack()'>返回</el-button>
            </div>

        </b-card>

    </div>
</template>

<script>
import {
  RiskManagementBase,
  Risk0,
  Risk1,
  eSteps
} from '@/components/System/risk_management'
import {riskManageDeptsInfo,searchRiskSourceList,searchRiskManageDeptSteps} from '@/services/risk'
import adjunct from '../../components/System/security_notice/SecurityNoticeAdjunct'
 import Vuex from 'vuex'
import {

   sourceDataFilter } from '../../tools'
export default {

  name: 'riskLook',
  components: {
    RiskManagementBase,
    adjunct,
    Risk0,
    Risk1,
    eSteps
  },
  data () {
    return {
      rules: {},
      // 风险对象
      deptNameList: [],
      // 控制发送
      isShowSend: false,
      // 控制loading
      fullscreenLoading: false,
      riskId: '',
      taskId: '',
      rmDepartmentDOList:[],
      riskTabList:[],
      controlTableData:[],
      riskDeptId:0

    }
  },
  // 当前用户的信息
  computed: {
    ...Vuex.mapState(['ALL_SELECT_DATA'])
  },
  methods: {
    // 返回上一页
    goBack () {
      this.$router.back()
    },
    handleClick(deptIdObj){
      let deptId = deptIdObj.riskDeptId
       searchRiskSourceList(deptId).then(result=>{
         if(result.data&&result.data.error===0){
            this.riskTabList=result.data.data
         }
       })

       searchRiskManageDeptSteps(deptId).then(result=>{

         if(result.data&&result.data.error===0){
            this.controlTableData=result.data.data
         }
       })
    },
    resultFilter(alue){
      let sourceData = this.ALL_SELECT_DATA.ASSESS_RESULT

       let result = sourceDataFilter(sourceData, alue)
       return result
    },
    handleTabsClick(tab,event){
        let deptIdObj =  this.rmDepartmentDOList[+tab.index]
        this.handleClick(deptIdObj)
        this.$forceUpdate(()=>{})
    }
  },
  created () {
    // 请求数据
    this.riskId = this.$route.query.riskId

    this.taskId = this.$route.query.taskId || 0
  },
  watch: {

  },
  mounted () {
    this.riskId&&riskManageDeptsInfo(this.riskId).then(result=>{
      if(result.data&&result.data.error===0){
         this.rmDepartmentDOList = result.data.data
         let deptId = result.data.data[0].riskDeptId
       searchRiskSourceList(deptId).then(result=>{
         if(result.data&&result.data.error===0){
            this.riskTabList=result.data.data
         }
       })
      }

    })
  }
}
</script>
