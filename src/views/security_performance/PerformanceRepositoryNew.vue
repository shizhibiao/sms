<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        基本信息
        <div class="card-actions">
          <b-btn class="btn btn-minimize" v-b-toggle.collapse1><i class="icon-arrow-up"></i></b-btn>
        </div>
      </div>
      <b-collapse id="collapse1" :visible='true'>
        <b-card style="border: none">
          <el-form :model="form" class="form-title" ref='form' :inline-message="true" label-width="120px" :rules="rules" :disabled="type==='look'">
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="管理目的" prop="obejective">
                  <el-select v-model="form.obejective">
                    <el-option :label="item.dictName" :value="item.dictCode"
                               v-for="(item , index ) in ALL_SELECT_DATA.INDICATOR_OBJECTIVE.dicts"
                               :key='index'></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="工作子项目" prop="childProject">
                  <el-input v-model="form.childProject"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="指标序号" prop="indicatorNo">
                  <el-input v-model="form.indicatorNo"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="指标名称" prop="indicatorName">
                  <el-input v-model="form.indicatorName"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="指标类型" prop="indicatorType">
                  <el-select v-model="form.indicatorType">
                    <el-option :label="item.dictName" :value="item.dictCode"
                               v-for="(item , index ) in ALL_SELECT_DATA.TARGET_TYPE.dicts" :key='index'></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="设置指标的目的" prop="purpose">
                  <el-input v-model="form.purpose"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="指标来源/依据" prop="source">
                  <el-input v-model="form.source"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="度量单位" prop="metrics">
                  <el-input v-model="form.metrics"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="周期" prop="period">
                  <el-select v-model="form.period">
                    <el-option :label="item.label" :value="item.value" v-for="(item , index ) in periodArr"
                               :key='index'></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="目标值" prop="dtarget">
                  <el-input v-model="form.dtarget"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="检测预警值" prop="dalert">
                  <el-input v-model="form.dalert"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="预警值计算方式" prop="calcuteFormula">
                  <el-input v-model="form.calcuteFormula"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="指标所属" prop="indicatorRank">
                  <el-select v-model="form.indicatorRank" @change="changeIndicatorRank">
                    <el-option :label="item.label" :value="item.value" v-for="(item , index ) in indicatorRankList"
                               :key='index'></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="管理部门" prop="dept">
                  <el-cascader
                    :options="deptNameList"
                    :show-all-levels="false"
                    v-model="form.dept"
                    :clearable='true'
                    :props="{
                        label:'label',
                        value:'deptId',
                        children:'children'
                    }"
                    @change='deptChange'
                  ></el-cascader>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if='form.indicatorRank===0'>
                <el-form-item label="责任部门" prop="dutyDeptList">
                  <el-select v-model="form.dutyDeptList" :clearable='true' multiple value-key="deptId"
                             @change="dutyDeptListHandler">
                    <el-option
                      :label="item.deptName"
                      :value="item"
                      v-for='item in dutyDeptList'

                      :key="item.deptId"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if='form.indicatorRank===1'>
                <el-form-item label="责任部门" prop="dutyDept">
                  <el-select v-model="form.dutyDept" :clearable='true' value-key="deptId" @change="dutyDeptListHandler">
                    <el-option
                      :label="item.deptName"
                      :value="item"
                      v-for='item in dutyDeptList'

                      :key="item.deptId"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6 col-md-12 col-sm-12">
                <el-form-item label="控制措施和方案" prop="controlMeasure">
                  <el-input
                    type="textarea"
                    style="width: 100%"
                    :autosize="{ minRows: 2, maxRows: 20 }"
                    placeholder="请输入内容"
                    v-model="form.controlMeasure">
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </b-card>

        <el-dialog title="选择危险源" :visible.sync="dialogFormVisible" width='70%'>
          <el-form :model="riskSourceForm" inline-message ref='riskSourceForm'>

            <el-form-item label="选择过程" label-width="10%">
              <el-cascader
                :options="riskSourceList"
                :show-all-levels="false"
                v-model="riskSourceForm.dept"
                :clearable='true'
                :props="{
                        label:'categoryName',
                        value:'id',
                        children:'children'
                    }"
                @change='changeRiskSourceDept'
              ></el-cascader>
            </el-form-item>
            <el-table
              ref="RiskTable"
              :data="RiskTableData"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                type="index"
                width="55">
              </el-table-column>
              <el-table-column
                label="危险源编号"
                prop="riskNo"
              >
                <!-- <template slot-scope="scope"></template> -->
              </el-table-column>
              <el-table-column
                prop="riskDesc"
                label="危险源描述"
              >
              </el-table-column>
              <el-table-column
                prop="riskResult"
                label="可能导致的风险或结果"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="riskGrade"
                label="风险等级"
              >
              </el-table-column>
              <el-table-column
                prop="acception"
                label="可接受程度"
              >
              </el-table-column>
              <el-table-column
                prop="riskMeasure"
                label="对应规则编号"
              >
              </el-table-column>
            </el-table>


          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogConfirmBtn">确 定</el-button>
          </div>
        </el-dialog>
      </b-collapse>

    </b-card>
    <b-card no-body>
      <div slot="header">
        关联危险源
        <div class="float-right" style="margin-right: 3em">
          <el-button type="primary" size="mini" @click="selectControlDeptHanle" v-if="type!=='look'" class="pull-right">选择危险源</el-button>
        </div>
        <div class="card-actions">
          <b-btn class="btn btn-minimize" v-b-toggle.collapse3><i class="icon-arrow-up"></i></b-btn>
        </div>
      </div>
      <b-collapse id="collapse3" :visible='true'>
        <b-card-body>
          <el-form ref="riskForm" label-width="120px" label-position="left" :model="risk" inline-message>
            <!--<div class="row mt-0 mb-0 pt-0 pb-0 ">-->
              <!--<div class="col-lg-6 col-md-6 col-sm-12">-->
                <!--<el-form-item label="指定控制部门">-->
                  <!--<el-select v-model="risk.selectControlDept" :clearable='true' @change="selectControlDeptHanle"-->
                             <!--value-key="deptId">-->
                    <!--<el-option :label="item.deptName" :value="item" v-for="item in ControlDept"-->
                               <!--:key='item.deptId'></el-option>-->
                  <!--</el-select>-->
                <!--</el-form-item>-->
              <!--</div>-->
            <!--</div>-->
            <!--

             -->
            <!-- 危险源列表 -->
            <el-table :data="riskTabList">
              <el-table-column fixed width="50" type="index"></el-table-column>
              <el-table-column label="部门" prop="riskSourceDO.deptName"></el-table-column>
              <el-table-column label="危险源编号" prop="riskSourceDO.riskNo"></el-table-column>
              <el-table-column label="危险源描述" prop="riskSourceDO.riskDesc"></el-table-column>
              <el-table-column label="可能导致的风险或后果" prop="riskSourceDO.riskResult"></el-table-column>
              <el-table-column label="风险等级" prop="riskSourceDO.riskGrade"></el-table-column>
              <el-table-column label="可接受程度" prop="riskSourceDO.acception"></el-table-column>
              <el-table-column label="对应规则编号" prop="riskSourceDO.riskMeasure"></el-table-column>
              <el-table-column label="操作" width='150' v-if="type!=='look'">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini"
                             @click.native.prevent="deleteRow(scope.$index, scope.row,riskTabList)">删除
                  </el-button>
                </template>
              </el-table-column>

            </el-table>

          </el-form>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body>
      <div slot="header">
        安全行动计划
        <div class="float-right" style="margin-right: 3em">
          <el-button type="primary" size="small" @click="planVisible=true" v-if="type!=='look'">增加</el-button>
        </div>
        <div class="card-actions">
          <b-btn class="btn btn-minimize" v-b-toggle.collapse2><i class="icon-arrow-up"></i></b-btn>
        </div>
      </div>
      <b-collapse id="collapse2" :visible='true'>
        <b-card style="border: none">
          <el-table :data="datas">
            <el-table-column label="安全绩效目标" prop="target"></el-table-column>
            <el-table-column label="安全行动/措施计划" prop="plan"></el-table-column>
            <el-table-column label="责任部门/人员">
              <template slot-scope="scope">
                {{scope.row.deptName&&scope.row.deptName+':'+scope.row.emplNames}}
              </template>
            </el-table-column>
            <el-table-column label="实施期限" prop="deadLine"></el-table-column>
            <el-table-column label="资源需求" prop="resources"></el-table-column>
            <el-table-column label="监管部门/人员">
              <template slot-scope="scope">
                {{scope.row.monitorDeptName&&scope.row.monitorDeptName+':'+scope.row.monitorNames}}
              </template>
            </el-table-column>
            <el-table-column label="实施状态" prop="implementStatus"></el-table-column>
            <el-table-column label="定期评估结果" prop="assessResult"></el-table-column>
            <el-table-column label="操作" width='150' v-if="type!=='look'">
              <template slot-scope="scope">
                <el-button type="success" size="mini" @click.native.prevent="modifyPlanRow(scope.$index, scope.row,datas)">编辑</el-button>
                <el-button type="danger" size="mini" @click.native.prevent="deletePlanRow(scope.$index, scope.row,datas)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </b-card>
        <el-dialog title="安全行动计划" :visible.sync="planVisible" width='70%'>
          <el-form :model="planForm" inline-message ref='planForm' :rules="planFormRules" label-width="130px">
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="安全绩效目标" prop="target">
                  <el-input v-model="planForm.target"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="安全行动/措施计划" prop="plan">
                  <el-input v-model="planForm.plan"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="责任部门" prop="deptNameArr">
                  <el-cascader
                    :options="deptNameList"
                    :show-all-levels="false"
                    v-model="planForm.deptNameArr"
                    :clearable='true'
                    :props="{
                        label:'label',
                        value:'deptId',
                        children:'children'
                    }"
                    @change = 'changePlanDeptNameArr'
                  ></el-cascader>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="责任人员" prop="emplIdsObj">
                  <el-select multiple placeholder="请输入关键词" v-model="planForm.emplIdsObj" value-key="userId">
                    <el-option v-for="(item,index) in emplNamesArr" :key="index" :label="item.userName" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="实施期限" prop="deadLine">
                  <el-date-picker
                    v-model="planForm.deadLine"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="资源需求" prop="resources">
                  <el-input v-model="planForm.resources"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="监管部门" prop="monitorDeptNameArr">
                  <el-cascader
                    :options="deptNameList"
                    :show-all-levels="false"
                    v-model="planForm.monitorDeptNameArr"
                    :clearable='true'
                    :props="{
                        label:'label',
                        value:'deptId',
                        children:'children'
                    }"
                    @change = 'changeMonitorDeptNameArr'
                  ></el-cascader>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="监管人员" prop="monitorIdsObj">
                  <el-select multiple placeholder="请输入关键词" v-model="planForm.monitorIdsObj" value-key="userId">
                    <el-option v-for="(item,index) in monitorNamesArr" :key="index" :label="item.userName" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="实施状态" prop="implementStatus">
                  <el-input v-model="planForm.implementStatus"></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="定期评估结果" prop="assessResult">
                  <el-input v-model="planForm.assessResult"></el-input>
                </el-form-item>
              </div>
            </div>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="planVisible = false">取 消</el-button>
            <el-button type="primary" @click="planConfirmBtn">确 定</el-button>
          </div>
        </el-dialog>
      </b-collapse>
    </b-card>

    <adjunct
      ref='adjunct'
      tableName="t_safety_indicator"
      :safetyId="id"
      :uploadFile="type==='edit'"
      :flag="type==='look'?2:''"
    >
    </adjunct>

    <el-card style="margin-top:20px;border:none;text-align:center" shadow='never'>
      <el-button type="primary" @click="save()" size='small' v-if="type!=='look'">保存</el-button>
      <el-button type="danger" @click="$router.back()" size='small'>返回</el-button>
    </el-card>


  </div>
</template>
<script>
  import {formatDate} from "../../utils/index.js";
  import adjunct from "../../components/System/security_notice/SecurityNoticeAdjunct";
  import axios from "axios";
  import Vuex from "vuex";
  import {sourceDataFilter, monthData} from "../../tools";
  import {getDepartmentList} from "../../services/safety_notice";
  import {getRiskCategoryDept, getRiskSourceCategory, saveRiskSource} from "../../services/risk"

  export default {
    components: {
      adjunct
    },
    data() {
      return {
        form: {},
        datas: [],
        indicatorRankList: [
          {
            label: '公司级',
            value: 0
          },
          {
            label: '部门级',
            value: 1
          }
        ],
        periodArr: [
          {
            label: '年',
            value: '年'
          },
          {
            label: '季',
            value: '季'
          },
          {
            label: '月',
            value: '月'
          },
          {
            label: '周',
            value: '周'
          },
          {
            label: '日',
            value: '日'
          }
        ],
        deptNameList: [],
        deptName: [],
        metricsList: [],
        rules: {
          obejective: [{required: true, message: "必填", trigger: "change"}],
          childProject: [{required: true, message: "必填", trigger: "blur"}],
          indicatorNo: [{required: true, message: "必填", trigger: "blur"}],
          indicatorName: [{required: true, message: "必填", trigger: "blur"}],
          indicatorType: [{required: true, message: "必填", trigger: "change"}],
          purpose: [{required: true, message: "必填", trigger: "blur"}],
          source:[{required: true, message: "必填", trigger: "blur"}],
          metrics:[{required: true, message: "必填", trigger: "blur"}],
          period:[{required: true, message: "必填", trigger: "change"}],
          dtarget:[{required: true, message: "必填", trigger: "blur"}],
          dalert:[{required: true, message: "必填", trigger: "blur"}],
          calcuteFormula:[{required: true, message: "必填", trigger: "blur"}],
          dutyDept:[{required: true, message: "必填", trigger: "change"}],
          dept:[{required: true, message: "必填", trigger: "change"}],
          indicatorRank:[{required: true, message: "必填", trigger: "change"}],
          dutyDeptList:[{required: true, message: "必填", trigger: "change"}],
          controlMeasure:[{required: true, message: "必填", trigger: "blur"}]
        },
        dutyDeptList: [],
        type: "",
        clssDeptId: 1,
        dialogFormVisible: false,
        planVisible:false,
        riskSourceForm: {},
        riskSourceList: [],
        RiskTableData: [],
        ControlDept: [],
        riskTabList: [],
        risk: {},
        selectRiskSource: [],
        emplNamesArr:[],
        monitorNamesArr:[],
        planForm:{},
        planFormRules:{
          target: [{ required: true, message: "必填", trigger: "blur" }],
          plan: [{ required: true, message: "必填", trigger: "blur" }],
          deptNameArr: [{ required: true, message: "必填", trigger: "change" }],
          emplIdsObj:[{ required: true, message: "必填", trigger: "change" }],
          monitorDeptNameArr:[{ required: true, message: "必填", trigger: "change" }],
          deadLine:[{ required: true, message: "必填", trigger: "change" }],
          resources:[{ required: true, message: "必填", trigger: "blur" }],
          monitorIdsObj: [{ required: true, message: "必填", trigger: "change" }],
          implementStatus: [{ required: true, message: "必填", trigger: "blur" }],
          assessResult: [{ required: true, message: "必填", trigger: "blur" }],
        },
        planType:'add',
        type:'',
        id:''
      };
    },
    computed: {
      ...Vuex.mapState(["ALL_SELECT_DATA", "user"])
    },
    created() {
      getDepartmentList().then(result => {
        this.deptNameList = result;
        console.log(result);
      });
      axios.get('/api/system/dept/level?levelId=1').then(result => {
        if (result.data && result.data.error === 0&&result.data.data instanceof Array) {
          this.dutyDeptList = result.data.data.map(item=>{
            return {
              deptId:item.deptId,
              deptName:item.deptName
            }
          })
        }
      })
      if (this.$route.query && this.$route.query.id) {
        let id = this.$route.query.id;
        this.id = id
        this.type = this.$route.query.type;
        axios
          .get("/api/indicator/" + id)
          .then(result => {
            console.log(result);
            if (result.data && result.data.error === 0) {
              this.form = result.data.data;
              this.riskTabList = this.form.riskSourceList
              this.datas = this.form.actionList
              this.ControlDept = this.form.dutyDeptList
            }
          })
          .then(() => {
            if (this.form.deptId) {
              axios
                .get("/api/system/dept/parents?deptId=" + this.form.deptId)
                .then(result => {
                  if (result.data && result.data.error === 0) {
                    let arr = result.data.data;
                    if (arr.length > 0) {
                      this.form.dept = arr;
                    }
                  }

                  this.$forceUpdate();
                });
            }
          });

      }
    },
    watch: {
    },
    methods: {
      getCascaderObj(val, opt) {
        return val.map(function (value, index, array) {
          for (var itm of opt) {
            if (itm.deptId == value) {
              opt = itm.children;
              return itm;
            }
          }
          return null;
        });
      },
      deptChange() {
        //   console.log(this.deptName, this.deptNameList)
        let arr = this.getCascaderObj(this.form.dept, this.deptNameList);
        if (arr&&arr.length > 0) {
          console.log(arr);
          this.form.deptId = arr[arr.length - 1].deptId;
          this.form.deptName = arr[arr.length - 1].label;
        }
      },
      save() {
        this.$refs["form"].validate(valid => {
          if (!valid) {
            this.$message({
              type: "error",
              message: "内容不能为空"
            });
            return false;
          } else {
          let url =''
          let method = ''
          let params ={}
          if(this.type===''){
            url ="/api/indicator/save"
            method='post'
            params = {
              attachementList:this.$refs.adjunct.fileFormList,
              safetyIndicatorDO:JSON.parse(JSON.stringify(this.form))
            }
            params.safetyIndicatorDO.actionList=this.datas
            params.safetyIndicatorDO.riskSourceList=this.riskTabList
          }else{
            url ="/api/indicator/update"
            method='put'
            params = JSON.parse(JSON.stringify(this.form))
            params.actionList=this.datas
            params.riskSourceList=this.riskTabList
          }
              axios[method](url, params)
                .then(result => {
                  console.log(result)
                  if (result.data && result.data.error === 0) {
                    this.$message({
                      type: "success",
                      message: "保存成功"
                    });
                    this.$router.back()
                  } else {
                    this.$message({
                      type: "error",
                      message: "保存失败" + result.data.message
                    });
                  }
                })
                .catch(error => {
                  this.$message({
                    type: "error",
                    message: "保存失败" + error
                  });
                });
            }

        });
      },
      changeIndicatorRank() {
        // this.form.dutyDeptList =[]
        console.log(this.form.indicatorRank)
      },
      //改变辨识部门出发
      changeRiskSourceDept(arr) {
        if (arr && arr.length > 0) {
          let id = arr[arr.length - 1]
          getRiskSourceCategory(id).then(result => {
            if (result && result.data && result.data.error === 0) {
              this.RiskTableData = result.data.data
            }
          })
        }
      },
      // 选择责任部门时触发
      dutyDeptListHandler() {
        this.ControlDept = []
        this.risk = {}
        if (this.form.indicatorRank === 0) {
          this.ControlDept = this.form.dutyDeptList
        } else if (this.form.indicatorRank === 1) {
          this.ControlDept.push(this.form.dutyDept)
        }
      },
      // 选择危险源确定
      dialogConfirmBtn() {
        this.dialogFormVisible = false
        let arr = JSON.parse(JSON.stringify(this.selectRiskSource))
        if(arr.length>0){
          let newarr = arr.map(item=>{
            return {
              riskId:item.riskId,
              riskSourceDO:item
            }
          })
          this.riskTabList = this.riskTabList.concat(newarr)
          console.log(this.riskTabList)
          this.$forceUpdate()
        }




      },
      // 多选时 选中
      handleSelectionChange(val) {
        this.selectRiskSource = val
      },
      //选择控制部门
      selectControlDeptHanle() {
        this.dialogFormVisible=true
        console.log(JSON.parse(JSON.stringify(this.form)))
        if ((this.form.dutyDeptList||this.form.dutyDept)&&this.form.indicatorRank === 0 || this.form.indicatorRank === 1) {
          let str = ''
          let newStr=''
          if(this.form.dutyDeptList&&this.form.dutyDeptList.length>0&&this.form.indicatorRank === 0){
            let id = this.form.dutyDeptList.forEach((item)=>{
              str += ','+ item.deptId
            })
              newStr= str.substr(1)
          }else if(this.form.dutyDept&&this.form.indicatorRank === 1){
            let id = this.form.dutyDept.deptId
            newStr = String(id)
          }

          newStr&&axios.get('api/risk_category/depts?deptIds='+ newStr).then(result => {
            console.log( result)
            if (result.data && result.data.error === 0 && result.data.data) {
              this.riskSourceList = result.data.data

            }
          })
        }

      },
      //删除 该行危险源
      deleteRow(index, row, arr) {
        arr.splice(index, 1)
      },
      changePlanDeptNameArr(){

        if(this.planForm.deptNameArr&&this.planForm.deptNameArr.length>0){
          let arr = this.getCascaderObj(this.planForm.deptNameArr, this.deptNameList);
          if (arr&&arr.length > 0) {
            this.planForm.deptId = arr[arr.length - 1].deptId;
            this.planForm.deptName = arr[arr.length - 1].label;
          }
          if(this.planForm.deptId){
            axios.get('/api/system/user/dept?deptId='+this.planForm.deptId).then(result=>{
              console.log(result)
              if(result.data&&result.data.error===0&&result.data.data instanceof Array){
                this.emplNamesArr =result.data.data.map(item=>{
                  return{
                    userId:item.userId,
                    userName:item.userName
                  }
                })
              }
            })
          }
        }
      },
      changeMonitorDeptNameArr(){
        if(this.planForm.monitorDeptNameArr&&this.planForm.monitorDeptNameArr.length>0){
          let arr = this.getCascaderObj(this.planForm.monitorDeptNameArr, this.deptNameList);
          if (arr&&arr.length > 0) {
            this.planForm.monitorDeptId = arr[arr.length - 1].deptId;
            this.planForm.monitorDeptName = arr[arr.length - 1].label;
          }
          if(this.planForm.monitorDeptId){
            axios.get('/api/system/user/dept?deptId='+this.planForm.monitorDeptId).then(result=>{
              console.log(result)
              if(result.data&&result.data.error===0&&result.data.data instanceof Array){
                this.monitorNamesArr =result.data.data.map(item=>{
                  return{
                    userId:item.userId,
                    userName:item.userName
                  }
                })
              }
            })
          }
        }
      },
      // 安全行动计划 弹出窗确定事件
      planConfirmBtn(){
        if(this.planForm.emplIdsObj&&this.planForm.emplIdsObj.length>0){
          let str1 =''
          let str2 =''
          this.planForm.emplIdsObj.forEach((item)=>{
            str1 =  str1 + ","+item.userId
            str2 =  str2 + ","+item.userName
          })
          this.planForm.emplIds = str1.substr(1)
          this.planForm.emplNames = str2.substr(1)
        }
        if(this.planForm.monitorIdsObj&&this.planForm.monitorIdsObj.length>0){
          let str1 =''
          let str2 =''
          this.planForm.monitorIdsObj.forEach((item)=>{
            str1 =  str1 + ","+item.userId
            str2 =  str2 + ","+item.userName
          })
          this.planForm.monitorIds = str1.substr(1)
          this.planForm.monitorNames = str2.substr(1)
        }
        let obj = JSON.parse(JSON.stringify(this.planForm))
        if(this.planType==='add'){
          this.datas.push(obj)
        }
        this.planVisible = false
        this.planForm={
          target:'',
          plan:'',
          deptNameArr:[],
          emplIdsObj:[],
          resources:'',
          monitorDeptNameArr:[],
          monitorIdsObj:[],
          implementStatus:'',
          assessResult:'',
          deadLine:''
        }
        this.planType==='add'
        console.log(this.planForm)
      },
      modifyPlanRow(index, row, arr){
        this.planVisible = true
        this.planType = 'edit'
        this.planForm = row
      },
      deletePlanRow(index, row, arr){
        arr.splice(index, 1)
      }
    }
  }
  ;
</script>

