<template>
    <!--风险分析 -->
    <div class="animated fadeIn">
        <b-card  no-body>
            <div slot="header">
                基本信息
                <div class="card-actions">
                    <b-btn class="btn btn-minimize" v-b-toggle.collapse1><i class="icon-arrow-up"></i></b-btn>
                </div>
            </div>
            <b-collapse id="collapse1" :visible='true'>
                <b-card-body>
                    <el-form ref="form" label-width="100px" label-position="left" :model="risk" :rules='rules'>
                        <div class="row mt-0 mb-0 pt-0 pb-0 ">
                            <div class="col-lg-4 col-md-6 col-sm-12">
                                <el-form-item label="项目来源" v-if='ALL_SELECT_DATA.PROJECT_SOURCE' >
                                    <el-select v-model="risk.projectSrc" :clearable='true' prop='projectSrc' :disabled='noWritable'>
                                        <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.PROJECT_SOURCE.dicts" :key ='index'></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                                <el-form-item label="立项等级" v-if='ALL_SELECT_DATA.ANNOUNCEMENT_LEVEL'>
                                    <el-select class="level" v-model="risk.projectLevel" prop='projectLevel' :disabled='noWritable'>
                                        <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.ANNOUNCEMENT_LEVEL.dicts" :key ='index'></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="row mt-0 mb-0 pt-0 pb-0 ">
                            <div class="col-lg-4 col-md-6 col-sm-12">
                                <el-form-item label="立项部门">
                                    <p>{{risk.submitDeptName}}</p>
                                </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                                <el-form-item label="立项日期">
                                    <p>{{risk.submitDate}}</p>
                                </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                                <el-form-item label="立项人">
                                    <p>{{risk.submitUserName}}</p>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="row mt-0 mb-0 pt-0 pb-0 ">
                            <div class="col-lg-8 col-md-8 col-sm-12">
                                <el-form-item label="项目名称" label-width="100px" prop='riskTitle'>
                                    <el-input v-model="risk.riskTitle" :disabled='noWritable'></el-input>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="row mt-0 mb-0 pt-0 pb-0 ">
                            <div class="col-lg-8 col-md-8 col-sm-12" v-if='isDeptLevel===1'>
                                <el-form-item label="责任单位" prop="rmDepartmentDOList" >
                                    <el-select v-model="risk.rmDepartmentDOList" :clearable='true' multiple value-key="processDept" :disabled='noWritable'>
                                        <el-option
                                        :label="item.processDeptName"
                                        :value="item"
                                        v-for='item in rmDepartmentDOList'

                                        :key="item.processDept"></el-option>
                                    </el-select>

                                </el-form-item>


                            </div>
                            <div class="col-lg-8 col-md-8 col-sm-12"  v-if='isDeptLevel===2'>
                                <el-form-item label="责任单位" prop="rmDepartment">
                                    <el-select v-model="risk.rmDepartment" :clearable='true' value-key="processDept" :disabled='noWritable'>
                                        <el-option
                                        :label="item.processDeptName"
                                        :value="item"
                                        v-for='item in rmDepartmentDOList'

                                        :key="item.processDept"></el-option>
                                    </el-select>

                                </el-form-item>
                            </div>
                        </div>
                        <div class="row mt-0 mb-0 pt-0 pb-0 ">
                            <div class="col-lg-8 col-md-8 col-sm-12">
                                <el-form-item label="项目描述" prop='projectDesc' >
                                    <el-input
                                        :disabled='noWritable'
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 4}"
                                        placeholder="请输入内容"
                                        v-model="risk.projectDesc">
                                    </el-input>
                                </el-form-item>
                            </div>
                        </div>
                    </el-form>

                </b-card-body>
            </b-collapse>
        </b-card>
    </div>
</template>

<script>
import Vuex from 'vuex'
import {formatDate} from '@/utils'
import {
  GetDepartmentListFromList,
  riskManageDetailList

  // addRiskSource
} from '@/services/risk'

import PubSub from 'pubsub-js'
export default {

  name: 'riskBase',
  components: {
  },
  data () {
    return {
      options: [{
        value: '',
        label: ''
      }],

      // 风险对象
      risk: {
        rmDepartment: {}
      },
      deptNameList: [],
      // 控制发送
      // isShowSend: false,
      // 控制loading
      fullscreenLoading: false,
      rmDepartmentDOList: [],
      form: {},
      rules: {
        projectDesc: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        projectLevel: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        projectSrc: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        riskTitle: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        rmDepartmentDOList: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        rmDepartment: [
          { required: true, message: '必填', trigger: 'change' }
        ]

      }

    }
  },
  // 当前用户的信息
  computed: {...Vuex.mapState(['user']),
    // 所有下拉菜单数组
    ...Vuex.mapState(['ALL_SELECT_DATA']),
    isDeptLevel () {
      return +this.risk.projectLevel
    }
  },
  props: {

    riskId: {
      type: Number
    },
    taskId: {
      type: Number
    },
    noWritable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 初始化数据
    initNotice () {
    // 获得当前人的数据
      let { deptId, deptName, userName, userId } = this.user
      // 当前时间
      let submitDate = formatDate(new Date(), 'yyyy-MM-dd')
      // 初始对象
      this.risk = {
        projectSrc: '0',
        projectLevel: '1',
        projectDesc: '',
        riskTitle: '',
        riskId: 0,
        rmDepartmentDOList: [],
        rmDepartment: {},
        submitDept: deptId,
        submitDeptName: deptName,
        submitUserName: userName,
        submitUser: userId,
        submitDate

      }
    }
  },
  created () {
    // 初始化
    this.initNotice()

    // 基本信息

    this.riskId&&riskManageDetailList(this.riskId, this.taskId).then(result => {
      let data = result.data
      if (+data.error === 0 && data.data) {
        this.risk = data.data
        // 初始值rmDepartment
        if (+data.data.projectLevel === 2) {
          this.risk.rmDepartment = data.data.rmDepartmentDOList[0]
        }
        if (data.data.rmDepartmentDOList && data.data.rmDepartmentDOList.length === 1) {
          PubSub.publish('getRiskControlDeptObj', this.risk)
          this.$emit('getRmDepartmentDOHandle',this.risk)
        }
      }
    })

    // 一级责任部门
    GetDepartmentListFromList(1).then(result => {
      this.rmDepartmentDOList = result
    })
  },
  watch: {
    risk: {
      handler (data, newdata) {
        this.$emit('getBaseData', newdata)
      },
      deep: true
    }
  },
  mounted () {
      console.log(this.ALL_SELECT_DATA.PROJECT_SOURCE.dicts)
  }
}
</script>
<style scoped>
</style>
