<template>
 <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
        基本信息
      </b-card-header>
      <b-card-body>
        <el-form :model="operation" :rules="rules" ref="operation" status-icon size="medium" label-width="150px" inline-message>
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="辨识部门">
                <el-input v-model="operation.identifyDeptName" disabled></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="涉及过程" prop="involvesProcess">
                <el-cascader :options="involvesProcessData" v-model="operation.involvesProcess" :props='{value:"value"}' :show-all-levels="false" :clearable='true'></el-cascader>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="编号" prop="riskNo">
                <el-input v-model="operation.riskNo" maxlength="50"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="时态" prop="riskTense">
                <el-select v-model="operation.riskTense">
                  <el-option v-for="(item, index) in ALL_SELECT_DATA.TENSE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="类型" prop="riskType">
                <el-select v-model="operation.riskType">
                    <el-option v-for="(item, index) in ALL_SELECT_DATA.RISKSOURCE_TYPE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="状态" prop="riskStatus">
                <el-select v-model="operation.riskStatus">
                    <el-option v-for="(item, index) in ALL_SELECT_DATA.RISKSOURCE_STATUS.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="FC/LEC" title="可能性(F)/严重性(C)、事故发生可能性(F)/人员暴露于危险环境中频繁程度(E)/事故发生可能造成的后果(C)" prop="anonymous">
                <el-radio :disabled="disableds === true" v-model="operation.anonymous" label='FC' title="可能性(F)/严重性(C)">FC</el-radio>
                <el-radio :disabled="disableds === true" v-model="operation.anonymous" label='LEC' title="事故发生可能性(F)/人员暴露于危险环境中频繁程度(E)/事故发生可能造成的后果(C)">LEC</el-radio>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12"></div>
            <div class="col-lg-4 col-md-6 col-sm-12"></div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'">
              <el-form-item label="可能性(F)" prop="rfcF">
                <el-select v-model="operation.rfcF">
                    <el-option v-for="(item, index) in FCLEC.FCfData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                      <span style="float: left">{{ item.grade }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                    </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'">
              <el-form-item label="严重性(C)" prop="rfcC">
                <el-select v-model="operation.rfcC">
                    <el-option v-for="(item, index) in FCLEC.FCcData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                      <span style="float: left">{{ item.grade }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                    </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'"></div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
              <el-form-item label="事故发生可能性(L)" title="事故发生可能性(L)" prop="lecL">
                <el-select v-model="operation.lecL">
                    <el-option v-for="(item, index) in FCLEC.LEClData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                      <span style="float: left">{{ item.grade }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                    </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
              <el-form-item label="人员暴露于危险环境中频繁程度(E)" title="人员暴露于危险环境中频繁程度(E)" prop="lecE">
                <el-select v-model="operation.lecE">
                    <el-option v-for="(item, index) in FCLEC.LECeData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                      <span style="float: left">{{ item.grade }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                    </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
              <el-form-item label="事故发生可能造成的后果(C)" title="事故发生可能造成的后果(C)" prop="lecC">
                <el-select v-model="operation.lecC">
                    <el-option v-for="(item, index) in FCLEC.LECcData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                      <span style="float: left">{{ item.grade }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                    </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>

          <el-form-item label="危险源描述" style="margin-bottom: 8px;" prop="riskDesc">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="operation.riskDesc"
              maxlength="200">
            </el-input>
          </el-form-item>

          <el-form-item label="可能导致风险或后果" style="margin-bottom: 8px;" title="可能导致风险或后果" prop="riskResult">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="operation.riskResult"
              maxlength="200">
            </el-input>
          </el-form-item>
          <el-form-item label="外部对接" style="margin-bottom: 8px;" prop="externalButtJoint">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="operation.externalButtJoint"
              maxlength="200">
            </el-input>
          </el-form-item>
          <el-form-item label="风险控制措施或对应规程编号" style="margin-bottom: 8px;" title="风险控制措施或对应规程编号" prop="riskMeasure">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="operation.riskMeasure"
              maxlength="200">
            </el-input>
          </el-form-item>

          <el-form-item label="衍生风险" style="margin-bottom: 8px;" prop="deriveRisk">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="operation.deriveRisk"
              maxlength="200">
            </el-input>
          </el-form-item>

          <el-form-item label="应急措施" style="margin-bottom: 8px;" prop="controlMeasure">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="operation.controlMeasure"
              maxlength="200">
            </el-input>
          </el-form-item>

          <el-form-item label="剩余风险" style="margin-bottom: 8px;" prop="residualRisk">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="operation.residualRisk"
              maxlength="200">
            </el-input>
          </el-form-item>
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'">
              <el-form-item label="可能性(剩余风险F)">
                <el-select v-model="operation.residualRfcF">
                   <el-option v-for="(item, index) in FCLEC.FCfData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                      <span style="float: left">{{ item.grade }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                    </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'">
              <el-form-item label="严重性(剩余风险C)">
                <el-select v-model="operation.residualRfcC">
                    <el-option v-for="(item, index) in FCLEC.FCcData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                      <span style="float: left">{{ item.grade }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                    </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'"></div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
              <el-form-item label="事故发生可能性(剩余风险L)" title="事故发生可能性(剩余风险L)">
                <el-select v-model="operation.residualLecL">
                    <el-option v-for="(item, index) in FCLEC.LEClData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                      <span style="float: left">{{ item.grade }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                    </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
              <el-form-item label="人员暴露于危险环境中频繁程度(剩余风险E)" title="人员暴露于危险环境中频繁程度(剩余风险E)">
                <el-select v-model="operation.residualLecE">
                    <el-option v-for="(item, index) in FCLEC.LECeData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                      <span style="float: left">{{ item.grade }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                    </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
              <el-form-item label="事故发生可能造成的后果(剩余风险C)" title="事故发生可能造成的后果(剩余风险C)">
                <el-select v-model="operation.residualLecC">
                    <el-option v-for="(item, index) in FCLEC.LECcData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                      <span style="float: left">{{ item.grade }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                    </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </b-card-body>
    </b-card>
    <!-- 根原因 -->
    <b-card no-body>
      <b-card-header>
        根原因
        <el-button size='small' type="success" @click="addRootCause" style="float: right;">新增</el-button>
      </b-card-header>
      <b-card-body>
        <el-table
          size="small"
          :data="tableData"
          :stripe="true"
          :highlight-current-row ="true"
          style="width: 100%">
          <el-table-column
              label="#"
              prop="index"
              width='50'
              >
          </el-table-column>
          <el-table-column
            label="根原因"
            prop="resonName">
          </el-table-column>
          <el-table-column
            label="根原因分析"
            prop="resonDesc">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <!-- <el-button type="default" size='mini'
                @click="examineAction(scope.$index, scope.row)">查看</el-button>
              <el-button type="primary" size='mini'
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
              <el-button type="danger" size='mini'
                @click="handleRemove(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </b-card-body>
    </b-card>
    <!-- 附件上传 -->
    <security-notice-adjunct ref='adjunct' v-if="describe == 'added'"></security-notice-adjunct>
    <security-notice-adjunct ref='adjunct' :tableName='tableName' :safetyId='safetyId' v-if="describe == 'handleCompile'" :uploadFile='uploadFile'></security-notice-adjunct>
    <b-card no-body>
      <b-card-body>
        <div style="text-align: center;">
          <div class="text-center">
            <el-steps :active="auditTypeNum" align-center>
              <el-step title="新建"></el-step>
              <el-step title="评估">
                <span slot="description">一级措施评估：安技部-安全管理经理(公司级)/SMS对接经理(部门级);<br /></span>
                <span slot="description">二级措施评估：安技部-部门管理团队(公司级)/部门管理团队(非安技部);<br /></span>
                <span slot="description">三级措施评估：公司领导</span>
              </el-step>
              <el-step title="核审" description="安技部-SMS风险管理岗"></el-step>
              <el-step title="结束"></el-step>
            </el-steps>
          </div>
          <el-button size='small' type="primary" @click="preserveAction" :disabled="preserveDisabled === 'false'"
            v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
          <el-button size='small' type="success" @click="sendAction" :disabled="sendActin === false"
            v-loading.fullscreen.lock="fullscreenLoading"
            v-if="describe === 'added' || describe === 'handleCompile'">发送</el-button>
          <!-- <el-button size='small' type="danger" @click="finishFlowAction" v-if="describe === 'handleCompile'">驳回</el-button> -->
          <el-button size='small' @click="gobackAction">返回</el-button>
        </div>
      </b-card-body>
    </b-card>
    <!-- 新增弹框 -->
    <el-dialog title="新增根原因" :visible.sync="preliminaryAction" width="30%">
      <el-form :model="cause" inline-message label-width="100px" >
        <el-form-item label="选择根原因" prop="selectRootCauseArr">
          <el-cascader :options="selectRootCauseData" v-model="selectRootCauseArr" :props='{value:"value"}' :show-all-levels="false" :clearable='true' @change="rootCauseAction(selectRootCauseArr)"></el-cascader>
        </el-form-item>
        <el-form-item label="根原因">
          <el-select v-model="cause.rootCause">
              <el-option v-for="(item, index) in RootCauseDatas" :key="index" :label="item.reasonName" :value="item.reasonName" @click.native="getAnalyzeData(item.reasonDesc)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="根原因分析" style="margin-bottom: 8px;">
          <el-input
            disabled
            type="textarea"
            placeholder="请输入内容"
            v-model="cause.analyze"
            maxlength="200">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="confirmAction">确定</el-button>
        <el-button size="small" @click="closeHandle">关闭</el-button>
      </div>
    </el-dialog>
 </div>
</template>
<script>
import Vuex from 'Vuex'
// 附件上传
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
import { getSingleHazardData, removeHazardRootCause, getInvolveCourse, addHazardAtions, getFCLECdata, inquireRootCause, QueryListDataAction, getCompileDataList, compileRiskSource, startHazardStream, disposeHazardAudit } from '../../services/information_report/index.js'
import { sourceDataFilter, filterFCLEC } from '../../filter/reportFilter.js'

export default {
  name: 'risk_add_hazard',
  components: {
    SecurityNoticeAdjunct
  },
  data () {
    return {
      cause: {
        reasonDetailId: '',
        // 根原因
        rootCause: '',
        // 根原因分析
        analyze: ''
      },
      operation: {
        // 用户名
        createByName: '',
        // 用户ID
        createBy: '',
        // ID
        riskId: 0,
        // 危险源类型id
        categoryId: '',
        // 危险源类型名称
        categoryName: '',
        // 辨识部门
        identifyDept: '',
        // 辨识部门名辨识部门名
        identifyDeptName: '',
        // 涉及部门
        deptId: '',
        // 涉及部门名
        deptName: '',
        // 一二三四级过程
        level1Process: '',
        level2Process: '',
        level3Process: '',
        level4Process: '',
        // 危险源编号
        riskNo: '',
        // 等级过程
        courseAction: '',
        // 危险源描述
        riskDesc: '',
        // 可能导致风险或后果
        riskResult: '',
        // 外部对接
        externalButtJoint: '',
        // 时态
        riskTense: '',
        // 类型
        riskType: '',
        // 状态
        riskStatus: '',
        // FC/LEC
        anonymous: 'FC',
        // 可能性(F)
        rfcF: '',
        // 严重性(C)
        rfcC: '',
        // 事故发生可能性(F)
        lecL: '',
        lecE: '',
        lecC: '',
        // 风险控制措施或对应规程编号
        riskMeasure: '',
        // 衍生风险
        deriveRisk: '',
        // 管控措施
        controlMeasure: '',
        // 剩余风险
        residualRisk: '',
        // 剩余风险F
        residualRfcF: '',
        // 剩余风险C
        residualRfcC: '',
        // 剩余风险L
        residualLecL: '',
        // 剩余风险E
        residualLecE: '',
        // 剩余风险C
        residualLecC: '',
        // 风险等级
        riskGrade: '',
        // 可接受程度
        acception: '',
        // 应急响应
        response: '',
        // 跨系统危险源(1为是，0为否)
        crossSystem: false,
        involvesProcess: []
      },
      // 表格数据
      tableData: [],
      // 保存是否可用
      preserveDisabled: 'true',
      // 发送是否可用
      sendActin: false,
      // 新增弹框
      preliminaryAction: false,
      // loading
      fullscreenLoading: false,
      // 保存按钮
      saveStatus: true,
      // 涉及过程数据
      involvesProcessData: [],
      // 选择原因数据
      selectRootCauseData: [],
      selectRootCauseArr: [],
      // 根原因下拉框数据
      RootCauseDatas: [],
      // FC/LEC下拉框数据
      FCLEC: {
        FCfData: [],
        FCcData: [],
        LEClData: [],
        LECeData: [],
        LECcData: [],
      },
      // push进来的页面描述
      describe: 'added',
      // 后台附件存储的表单名
      tableName: 't_risk_source',
      safetyId: 0,
      uploadFile: true,
      // FC、LEC是否可改
      disableds: true,
      rules: {
        involvesProcess: [
          { required: true, message: '涉及部门不能为空哦', trigger: 'change' },
        ],
        riskNo: [
          { required: true, message: '编号不能为空哦', trigger: 'change' }
        ],
        anonymous: [
          { required: true, message: 'FC/LEC不能为空哦', trigger: 'change' }
        ],
        rfcF: [
          { required: true, message: '可能性(F)', trigger: 'change' }
        ],
        rfcC: [
          { required: true, message: '严重性(C)', trigger: 'change' }
        ],
        lecL: [
          { required: true, message: '事故发生可能性(L)', trigger: 'change' }
        ],
        lecE: [
          { required: true, message: '人员暴露于危险环境中频繁程度(E)', trigger: 'change' }
        ],
        lecC: [
          { required: true, message: '事故发生可能造成的后果(C)', trigger: 'change' }
        ],
        riskDesc: [
          { required: true, message: '危险源描述不能为空哦', trigger: 'change' }
        ],
        riskResult: [
          { required: true, message: '可能导致风险或后果不能为空哦', trigger: 'change' }
        ],
        riskMeasure: [
          { required: true, message: '风险控制措施或对应规程编号', trigger: 'change' }
        ]
      },
      awardData: {
        auditResult: -1
      },
      // 流程图对应的值
      auditTypeNum: 0
    }
  },
  computed: {
    ...Vuex.mapState(["ALL_SELECT_DATA"])
  },
  methods: {
    // 增加根原因
    addRootCause () {
      this.preliminaryAction = true
      inquireRootCause().then(result => {
        // console.log(result)
        this.selectRootCauseData = result
      })
    },
    // 确定添加
    confirmAction () {
      if (this.selectRootCauseArr === '') {
        this.$message({
          type: 'info',
          message: '请选择根原因'
        })
      } else if (this.cause.rootCause === '') {
        this.$message({
          type: 'info',
          message: '根原因不能为空哦'
        })
      } else if (this.cause.analyze === '') {
        this.$message({
          type: 'info',
          message: '根原因分析不能为空哦'
        })
      } else {
        // console.log(this.cause.rootCause, this.cause.analyze)
        let obj = {}
        obj.reasonDetailId = this.cause.reasonDetailId
        obj.resonName = this.cause.rootCause
        obj.resonDesc = this.cause.analyze
        this.tableData.push(obj)
        for (var i = 0; i < this.tableData.length; i++) {
          this.tableData[i].index = i + 1
        }
        // 关闭弹窗
        // 清空输入框
        this.closeHandle()
      }
    },
    // 关闭
    closeHandle () {
      // 关闭弹窗
      this.preliminaryAction = false
      // 清空输入框
      this.selectRootCauseArr = []
      this.cause.rootCause = ''
      this.cause.analyze = ''
    },
    // 根据id查询单个危险源分类
    getCategoryName (id) {
      getSingleHazardData(id).then(result => {
        if (result.data.data !== null && result.data.error === 0) {
          this.operation.categoryName = result.data.data.categoryName
        } else {
          this.$message({
            type: 'error',
            message: '查询失败：' + result.data.message
          })
        }
      })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '查询失败：' + error
          })
        })
    },
    // 新建保存调用的接口
    findleAction () {
      let data = this.operation
      data.attList = this.$refs.adjunct.fileFormList
      data.taskInfo = {}
      data.status = -1
      // 危险源Id categoryName
      if (data.deptId && data.level1Process && data.level2Process && data.level3Process && data.level4Process) {
        data.categoryId = data.level4Process
        this.getCategoryName(data.level4Process)
      } else if (data.deptId && data.level1Process && data.level2Process && data.level3Process) {
        data.categoryId = data.level3Process
        this.getCategoryName(data.level3Process)
      } else if (data.deptId && data.level1Process && data.level2Process) {
        data.categoryId = data.level2Process
        this.getCategoryName(data.level2Process)
      } else if (data.deptId && data.level1Process) {
        data.categoryId = data.level1Process
        this.getCategoryName(data.level1Process)
      } else if (data.deptId) {
        data.categoryId = data.deptId
        this.getCategoryName(data.deptId)
      }
      data.rootReasonDOList = this.tableData
      // 显示loading
      this.fullscreenLoading = true
      this.$nextTick(() => {
        addHazardAtions(data).then(result => {
          // 关闭loading
          this.fullscreenLoading = false
          if (result.data.error === 0 && result.data.data !== null) {
            // 保存ID的值
            this.operation.riskId = result.data.data.riskId
            // 保存成功可以点击发送
            this.sendActin = true
            // 保存按钮不可用
            this.preserveDisabled = 'false'
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            // 将附件改成不能上传
            this.$refs.adjunct.isShow = false
          } else {
            this.$message({
              type: 'error',
              message: '保存失败：' + result.data.message
            })
          }
        })
          .catch((error) => {
            this.$message({
              type: 'error',
              message: '保存失败：' + error
            })
            // 保存成功后关闭loading
            this.fullscreenLoading = false
          })
      })
    },
    // 保存
    preserveAction () {
      // 判断用户是否已经保存过，保存过则不能再次保存
      let involvesProcess = this.operation.involvesProcess
      this.operation.deptId = involvesProcess && involvesProcess.length > 0 ? involvesProcess[0] : ''
      this.operation.level1Process = involvesProcess && involvesProcess.length > 1 ? involvesProcess[1] : ''
      this.operation.level2Process = involvesProcess && involvesProcess.length > 2 ? involvesProcess[2] : ''
      this.operation.level3Process = involvesProcess && involvesProcess.length > 3 ? involvesProcess[3] : ''
      this.operation.level4Process = involvesProcess && involvesProcess.length > 4 ? involvesProcess[4] : ''
      // 获取到输入框当中的内容
      var { deptId, riskNo, anonymous, rfcF, rfcC, lecL, lecE, lecC, riskDesc, riskResult, riskMeasure } = this.operation
      if (deptId === '') {
        this.$message({
          type: 'info',
          message: '涉及部门不能为空哦'
        })
      } else if (riskNo === '') {
        this.$message({
          type: 'info',
          message: '编号不能为空哦'
        })
      } else if (anonymous === '') {
        this.$message({
          type: 'info',
          message: 'FC/LEC不能为空哦'
        })
      } else if (anonymous !== '') {
        if (anonymous === 'FC') {
          if (rfcF === '') {
            this.$message({
              type: 'info',
              message: '可能性（F）不能为空哦'
            })
          } else if (rfcC === '') {
            this.$message({
              type: 'info',
              message: '严重性(C)不能为空哦'
            })
          } else if (riskDesc === '') {
            this.$message({
              type: 'info',
              message: '危险源描述不能为空哦'
            })
          } else if (riskResult === '') {
            this.$message({
              type: 'info',
              message: '可能导致风险或后果不能为空哦'
            })
          } else if (riskMeasure === '') {
            this.$message({
              type: 'info',
              message: '风险控制措施或对应规程编号'
            })
          } else {
            // 调用保存方法触发保存
            // 新建保存---编辑
            if (this.describe === 'added') {
              this.findleAction()
            } else if (this.describe === 'compile' || this.describe === 'handleCompile') {
              // 编辑保存
              this.compileAction()
            }
          }
        } else if (anonymous === 'LEC') {
          if (lecL === '') {
            this.$message({
              type: 'info',
              message: '事故发生可能性(L)不能为空哦'
            })
          } else if (lecE === '') {
            this.$message({
              type: 'info',
              message: '人员暴露于危险环境中频繁程度(E)不能为空哦'
            })
          } else if (lecC === '') {
            this.$message({
              type: 'info',
              message: '事故发生可能造成的后果(C)不能为空哦'
            })
          } else if (riskDesc === '') {
            this.$message({
              type: 'info',
              message: '危险源描述不能为空哦'
            })
          } else if (riskResult === '') {
            this.$message({
              type: 'info',
              message: '可能导致风险或后果不能为空哦'
            })
          } else if (riskMeasure === '') {
            this.$message({
              type: 'info',
              message: '风险控制措施或对应规程编号'
            })
          } else {
            // 调用保存方法触发保存
            // 新建保存---编辑
            if (this.describe === 'added') {
              this.findleAction()
            } else if (this.describe === 'compile' || this.describe === 'handleCompile') {
              // 编辑保存
              this.compileAction()
            }
          }
        }
      }
    },
    // 发送
    sendAction () {
      if (this.sendActin === true) {
        // 点击启动流程并跳转到查询页
        // 显示loading
        this.fullscreenLoading = true
        let id = this.operation.riskId
        startHazardStream(id).then(result => {
          // 关闭loading
          this.fullscreenLoading = false
          if (result.data.error === 0) {
            this.$message({
              type: 'success',
              message: '发送成功!'
            })
            // 修改成功跳转到列表页面
            this.$router.push({path: '/risk/hazard-list'})
          } else {
            this.$message({
              type: 'error',
              message: '发送失败：' + result.data.message
            })
          }
        })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '发送失败：' + error
            })
            // 关闭loading
            this.fullscreenLoading = false
          })
      } else {
        this.$confirm('您已修改，请先保存！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.sendActin = false
        })
      }
    },
    // 返回
    gobackAction () {
      this.$router.push('/risk/hazard-list')
    },
    getFcLecDate (index) {
      let fclecTypes
      if (index <= 3) {
        fclecTypes = this.$store.state.fcTypes
      } else {
        fclecTypes = this.$store.state.lecTypes;
      }
      for (let type of fclecTypes) {
        if (+type.code === index) {
          return type.datas
        }
      }
      return null
    },
    // F-----1
    possibilityAction () {
      let index = 1
      this.FCLEC.FCfData = this.getFcLecDate(index)
      // getFCLECdata(index).then(result => {
      //   if (result.data.error === 0 && result.data.data !== null) {
      //     this.FCLEC.FCfData = result.data.data
      //   }
      // })
    },
    // C-----w2
    ponderanceAction () {
      let index = 2
      this.FCLEC.FCcData = this.getFcLecDate(index)
      // getFCLECdata(index).then(result => {
      //   if (result.data.error === 0 && result.data.data !== null) {
      //     this.FCLEC.FCcData = result.data.data
      //   }
      // })
    },
    // L-----4
    LAction () {
      let index = 4
      this.FCLEC.LEClData = this.getFcLecDate(index)
      // getFCLECdata(index).then(result => {
      //   if (result.data.error === 0 && result.data.data !== null) {
      //     this.FCLEC.LEClData = result.data.data
      //   }
      // })
    },
    // E-----5
    EAction () {
      let index = 5
      this.FCLEC.LECeData = this.getFcLecDate(index)
      // getFCLECdata(index).then(result => {
      //   if (result.data.error === 0 && result.data.data !== null) {
      //     this.FCLEC.LECeData = result.data.data
      //   }
      // })
    },
    // C-----6
    CAction () {
      let index = 6
      this.FCLEC.LECcData = this.getFcLecDate(index)
      // getFCLECdata(index).then(result => {
      //   if (result.data.error === 0 && result.data.data !== null) {
      //     this.FCLEC.LECcData = result.data.data
      //   }
      // })
    },
    // tabData----删除
    handleRemove (index, row) {
      if (this.describe === 'compile') {
        this.$confirm('确定删除该数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = row.id
          removeHazardRootCause(id).then(result => {
            if (result.data.data && result.data.error === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.tableData.splice(index, 1)
              for (var i = 0; i < this.tableData.length; i++) {
                this.tableData[i].index = i + 1
              }
            } else {
              this.$message({
                type: 'error',
                message: '删除失败：' + result.data.message
              })
            }
          })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '删除失败：' + error
              })
            })
        })
      } else {
        this.$confirm('确定删除该数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(index, 1)
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].index = i + 1
          }
        })
        
      }
    },
    // 选择根原因查询出根原因以及根原因分析
    rootCauseAction (data) {
      // 点击选择根原因下两个清空输入框
      this.cause.rootCause = ''
      this.cause.analyze = ''
      // 截取到最后一级的id值
      let id = data && data.length > 0 ? data[data.length - 1] : ''
      this.cause.reasonDetailId = id
      QueryListDataAction(id).then(result => {
        if (result.data.error === 0 && result.data.data !== []) {
          // console.log(result.data.data[0].reasonName)
          this.RootCauseDatas = result.data.data
        }
      })
    },
    // 点击根原因并将根原因分析显示出来
    getAnalyzeData (reasonDesc) {
      // 点击根原因清空上一次填写的根原因分析输入框
      this.cause.analyze = ''
      // 赋值
      this.cause.analyze = reasonDesc
    },
    // 结束流程/驳回
    finishFlowAction () {
      this.$confirm('确定驳回？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.awardData.auditResult = 0
        let obj = {}
        obj.taskInfo = this.$route.query.taskInfo ? this.$route.query.taskInfo : {}
        // 用户人ID及姓名
        obj.riskAuditDO = this.awardData
        let user = this.$store.state.user
        obj.riskAuditDO.auditUserName = user.userName
        obj.riskAuditDO.submitUser = user.userId
        obj.riskAuditDO.riskId = this.safetyId
        disposeHazardAudit(obj).then(result => {
          if (result.data.error === 0 && result.data.data !== null) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$router.go(-1)
          } else {
            this.$message({
              type: 'error',
              message: '操作失败：' + result.data.message
            })
          }
        })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '操作失败：' + error
            })
          })
      })
    }
  },
  watch: {
    // 当FC或者LEC为true或者为false时获取到下拉框的数据
    'operation.anonymous': function (newVal, oldVal) {
      // console.log(newVal)
      if (newVal === 'FC') {
        // 当anonymous等于FC时清空LEC相关数据
        this.operation.lecL = ''
        this.operation.lecE = ''
        this.operation.lecC = ''
        this.operation.residualLecL = ''
        this.operation.residualLecE = ''
        this.operation.residualLecC = ''
        this.possibilityAction()
        this.ponderanceAction()
      } else if (newVal === 'LEC') {
        // 当anonymous等于LEC时清空FC相关数据
        this.operation.rfcF = ''
        this.operation.rfcC = ''
        this.operation.residualRfcF = ''
        this.operation.residualRfcC = ''
        this.LAction()
        this.EAction()
        this.CAction()
      }
    }
  },
  created () {
    // 请求FC、LEC数据
    this.possibilityAction()
    this.ponderanceAction()
    this.LAction()
    this.EAction()
    this.CAction()
    // 附件上传的safetyId
    this.safetyId = this.$route.query.riskId ? this.$route.query.riskId : 0
    // console.log(this.safetyId)
    let user = this.$store.state.user
    // 部门ID和部门名称
    this.operation.identifyDept = user.deptId
    this.operation.identifyDeptName = user.deptName
    // 用户ID和名字
    this.operation.createBy = user.userId
    this.operation.createByName = user.userName
    // 触发调用涉及过程数据
    getInvolveCourse().then(result => {
      // console.log(result)
      this.involvesProcessData = result
    })
    // push进来的是哪个
    this.describe = this.$route.query.describe ? this.$route.query.describe : 'added'
    // 如果是从编辑进来的则获取到相对应的数据
    if (this.describe === 'handleCompile') {
      this.disableds = true
      this.operation.riskId = this.$route.query.riskId
      getCompileDataList(this.operation.riskId).then(result => {
        // console.log(result)
        if (result.data.error === 0 && result.data.data !== null) {
          this.operation = result.data.data
          this.tableData = result.data.data.rootReasonDOList
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].index = i + 1
          }
          // 处理涉及部门
          let arr = []
          let data = result.data.data
          if (data.deptId && data.level1Process && data.level2Process && data.level3Process && data.level4Process) {
            arr.push(data.deptId, data.level1Process, data.level2Process, data.level3Process, data.level4Process)
          } else if (data.deptId && data.level1Process && data.level2Process && data.level3Process) {
            arr.push(data.deptId, data.level1Process, data.level2Process, data.level3Process)
          } else if (data.deptId && data.level1Process && data.level2Process) {
            arr.push(data.deptId, data.level1Process, data.level2Process)
          } else if (data.deptId && data.level1Process) {
            arr.push(data.deptId, data.level1Process)
          } else if (data.deptId) {
            arr.push(data.deptId)
          }
          this.operation.involvesProcess = arr
          // 处于编辑页面时根据新建的FC或LEC显示 anonymous
          if (this.operation.rfcF !== null && this.operation.rfcC !== null) {
            this.operation.anonymous = 'FC'
            // this.operation.rfcF = sourceDataFilter(this.FCLEC.FCfData, this.operation.rfcF)
            // this.operation.rfcC = sourceDataFilter(this.FCLEC.FCcData, this.operation.rfcC)
            // this.operation.residualRfcF = sourceDataFilter(this.FCLEC.FCfData, this.operation.residualRfcF)
            // this.operation.residualRfcC = sourceDataFilter(this.FCLEC.FCcData, this.operation.residualRfcC)
          } else {
            this.operation.anonymous = 'LEC'
            // this.operation.lecL = sourceDataFilter(this.FCLEC.LEClData, this.operation.lecL)
            // this.operation.lecE = sourceDataFilter(this.FCLEC.LECeData, this.operation.lecE)
            // this.operation.lecC = sourceDataFilter(this.FCLEC.LECcData, this.operation.lecC)
            // this.operation.residualLecL = sourceDataFilter(this.FCLEC.LEClData, this.operation.residualLecL)
            // this.operation.residualLecE = sourceDataFilter(this.FCLEC.LECeData, this.operation.residualLecE)
            // this.operation.residualLecC = sourceDataFilter(this.FCLEC.LECcData, this.operation.residualLecC)
          }
        }
      })
    }
    // 新建初始值
    if (this.describe === 'added') {
      this.disableds = false
      this.operation.riskId = this.$route.query.riskId
    }
  }
}
</script>
<style>
.el-select, .el-cascader--medium, .el-cascader{
  width: 100%;
}
.el-form-item{
  margin-bottom: 0;
}
/* .el-form-item__label{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
} */
</style>
