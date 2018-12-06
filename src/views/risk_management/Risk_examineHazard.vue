<template>
 <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
        基本信息
        <div class="card-actions">
            <b-btn class="btn btn-minimize" v-b-toggle.basic @click="basicAction"><i class="icon-arrow-down" ref="basicDirection"></i></b-btn>
        </div>
      </b-card-header>
      <b-collapse id="basic" :visible="true">
        <b-card-body>
            <el-form :model="operation" status-icon size="medium" label-width="150px" inline-message>
            <div class="row">
                <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="辨识部门">
                    <el-input v-model="operation.identifyDeptName" disabled></el-input>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="涉及过程" prop="involvesProcess">
                    <el-cascader disabled :options="involvesProcessData" v-model="involvesProcess" :props='{value:"value"}' :show-all-levels="false" :clearable='true'></el-cascader>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="编号">
                    <el-input v-model="operation.riskNo" disabled></el-input>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="时态">
                    <el-select v-model="operation.riskTense" disabled>
                    <el-option v-for="(item, index) in ALL_SELECT_DATA.TENSE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="类型">
                    <el-select v-model="operation.riskType" disabled>
                        <el-option v-for="(item, index) in ALL_SELECT_DATA.RISKSOURCE_TYPE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="状态">
                    <el-select v-model="operation.riskStatus" disabled>
                        <el-option v-for="(item, index) in ALL_SELECT_DATA.RISKSOURCE_STATUS.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="FC/LEC" title="可能性(F)/严重性(C)、事故发生可能性(F)/人员暴露于危险环境中频繁程度(E)/事故发生可能造成的后果(C)">
                    <el-radio v-model="operation.anonymous" label='FC' title="可能性(F)/严重性(C)" disabled>FC</el-radio>
                    <el-radio v-model="operation.anonymous" label='LEC' title="事故发生可能性(F)/人员暴露于危险环境中频繁程度(E)/事故发生可能造成的后果(C)" disabled>LEC</el-radio>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12"></div>
                <div class="col-lg-4 col-md-6 col-sm-12"></div>
                <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'">
                <el-form-item label="可能性(F)">
                    <el-select v-model="operation.rfcF" disabled>
                      <el-option v-for="(item, index) in FCLEC.FCfData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                        <span style="float: left">{{ item.grade }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                      </el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'">
                <el-form-item label="严重性(C)">
                    <el-select v-model="operation.rfcC" disabled>
                      <el-option v-for="(item, index) in FCLEC.FCcData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                        <span style="float: left">{{ item.grade }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                      </el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'"></div>
                <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
                <el-form-item label="事故发生可能性(L)" title="事故发生可能性(L)">
                    <el-select v-model="operation.lecL" disabled>
                      <el-option v-for="(item, index) in FCLEC.LEClData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                        <span style="float: left">{{ item.grade }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                      </el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
                <el-form-item label="人员暴露于危险环境中频繁程度(E)" title="人员暴露于危险环境中频繁程度(E)">
                    <el-select v-model="operation.lecE" disabled>
                      <el-option v-for="(item, index) in FCLEC.LECeData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                        <span style="float: left">{{ item.grade }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                      </el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
                <el-form-item label="事故发生可能造成的后果(C)" title="事故发生可能造成的后果(C)">
                    <el-select v-model="operation.lecC" disabled>
                      <el-option v-for="(item, index) in FCLEC.LECcData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                        <span style="float: left">{{ item.grade }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                      </el-option>
                    </el-select>
                </el-form-item>
                </div>
            </div>

            <el-form-item label="危险源描述" style="margin-bottom: 8px;">
                <el-input
                disabled
                type="textarea"
                placeholder="请输入内容"
                v-model="operation.riskDesc">
                </el-input>
            </el-form-item>

            <el-form-item label="可能导致风险或后果" style="margin-bottom: 8px;" title="可能导致风险或后果">
                <el-input
                disabled
                type="textarea"
                placeholder="请输入内容"
                v-model="operation.riskResult">
                </el-input>
            </el-form-item>
            <el-form-item label="外部对接" style="margin-bottom: 8px;">
                <el-input
                disabled
                type="textarea"
                placeholder="请输入内容"
                v-model="operation.externalButtJoint">
                </el-input>
            </el-form-item>
            <el-form-item label="风险控制措施或对应规程编号" style="margin-bottom: 8px;" title="风险控制措施或对应规程编号">
                <el-input
                disabled
                type="textarea"
                placeholder="请输入内容"
                v-model="operation.riskMeasure">
                </el-input>
            </el-form-item>

            <el-form-item label="衍生风险" style="margin-bottom: 8px;">
                <el-input
                disabled
                type="textarea"
                placeholder="请输入内容"
                v-model="operation.deriveRisk">
                </el-input>
            </el-form-item>

            <el-form-item label="应急措施" style="margin-bottom: 8px;">
                <el-input
                disabled
                type="textarea"
                placeholder="请输入内容"
                v-model="operation.controlMeasure">
                </el-input>
            </el-form-item>

            <el-form-item label="剩余风险" style="margin-bottom: 8px;">
                <el-input
                disabled
                type="textarea"
                placeholder="请输入内容"
                v-model="operation.residualRisk">
                </el-input>
            </el-form-item>
            <div class="row">
                <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'">
                <el-form-item label="可能性(F)">
                    <el-select v-model="operation.residualRfcF" disabled>
                      <el-option v-for="(item, index) in FCLEC.FCfData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                        <span style="float: left">{{ item.grade }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                      </el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'">
                <el-form-item label="严重性(C)">
                    <el-select v-model="operation.residualRfcC" disabled>
                      <el-option v-for="(item, index) in FCLEC.FCcData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                        <span style="float: left">{{ item.grade }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                      </el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'"></div>
                <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
                <el-form-item label="事故发生可能性(L)" title="事故发生可能性(L)">
                    <el-select v-model="operation.residualLecL" disabled>
                      <el-option v-for="(item, index) in FCLEC.LEClData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                        <span style="float: left">{{ item.grade }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                      </el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
                <el-form-item label="人员暴露于危险环境中频繁程度(E)" title="人员暴露于危险环境中频繁程度(E)">
                    <el-select v-model="operation.residualLecE" disabled>
                      <el-option v-for="(item, index) in FCLEC.LECeData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                        <span style="float: left">{{ item.grade }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                      </el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
                <el-form-item label="事故发生可能造成的后果(C)" title="事故发生可能造成的后果(C)">
                    <el-select v-model="operation.residualLecC" disabled>
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
      </b-collapse>
    </b-card>
    <!-- 根原因 -->
    <b-card no-body>
      <b-card-header>
        根原因
        <div class="card-actions">
            <b-btn class="btn btn-minimize" v-b-toggle.rootCauseId @click="rootCauseAction"><i class="icon-arrow-down" ref="rootCause"></i></b-btn>
        </div>
      </b-card-header>
      <b-collapse id="rootCauseId" :visible="true">
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
                <!-- <el-button type="default" size='mini' disabled>查看</el-button>
                <el-button type="primary" size='mini' disabled>编辑</el-button> -->
                <el-button type="danger" size='mini' disabled>删除</el-button>
                </template>
            </el-table-column>
            </el-table>
        </b-card-body>
      </b-collapse>
    </b-card>
    <!-- 附件上传 -->
    <security-notice-adjunct
        ref='adjunct'
        :tableName='tableName'
        :uploadFile='uploadFile'
        :safetyId='safetyId'></security-notice-adjunct>
    <!-- 审核历史 -->
    <b-card no-body>
      <b-card-header>
        审核历史
        <div class="card-actions">
          <b-btn class="btn btn-minimize" v-b-toggle.historyTab @click="historyTiggleAction"><i class="icon-arrow-down" ref="historyRef"></i></b-btn>
        </div>
      </b-card-header>
      <b-collapse id="historyTab" :visible="true" ref="historyTab">
        <b-card-body>
          <el-table
              :data="historyTableData"
              :stripe="true"
              :highlight-current-row ="true"
              style="width: 100%">
              <!-- 外部表 -->
              <el-table-column
                  label="#"
                  prop="index"
                  width='50'
                  >
              </el-table-column>
              <el-table-column
                label="日期"
                prop="submitDate">
              </el-table-column>
              <el-table-column
                label="操作人"
                prop="auditUserName">
              </el-table-column>
              <el-table-column
                label="审核类型"
                prop="auditType">
              </el-table-column>
              <el-table-column
                label="意见"
                prop="auditComment">
              </el-table-column>
              <el-table-column
                label="结果"
                prop="auditResult">
              </el-table-column>
            </el-table>
        </b-card-body>
      </b-collapse>
    </b-card>
    <!-- 操作按钮 -->
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
          <el-button size='small' type="success" @click="preserveAction" v-if="flag === 1">发送</el-button>
          <el-button size='small' @click="gobackAction">返回</el-button>
        </div>
      </b-card-body>
    </b-card>
    <!-- 办理弹框 -->
    <el-dialog :title="popoutTxt" :visible.sync="preliminaryAction" width="30%">
      <el-form :model="awardData" inline-message label-width="80px" >
        <el-form-item label="审核人">
          <el-input v-model="awardData.userName" placeholder="请输入内容" disabled></el-input>
        </el-form-item>
        <el-form-item label="审核部门">
          <el-input v-model="awardData.deptName" placeholder="请输入内容" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="审核结果" v-if="status === '审核'">
          <el-radio v-model="awardData.auditResult" :label=1>通过</el-radio>
          <el-radio v-model="awardData.auditResult" :label=0>驳回</el-radio>
        </el-form-item> -->
        <el-form-item :label="textCom">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="awardData.riskDesc">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="confirmAction"
          v-loading.fullscreen.lock="fullscreenLoading">同意</el-button>
        <el-button size="small" type="danger" @click="dismissAction"
          v-loading.fullscreen.lock="fullscreenLoading">驳回</el-button>
        <el-button size="small" @click="hide">关闭</el-button>
      </div>
    </el-dialog>
 </div>
</template>
<script>
import Vuex from 'Vuex'
// 附件上传
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
import { getInvolveCourse, getAllDataAction, getCompileDataList, examineAuditHistory, disposeHazardAudit } from '../../services/information_report/index.js'
// import { sourceDataFilter } from '../../filter/reportFilter.js'

export default {
  name: 'risk_add_hazard',
  components: {
    SecurityNoticeAdjunct
  },
  data () {
    return {
      description: "一级措施评估：安技部-安全管理经理(公司级)/SMS对接经理(部门级);\n 二级措施评估：安技部-部门管理团队(公司级)/部门管理团队(非安技部);\n 三级措施评估：公司领导",
      cause: {
        reasonDetailId: '',
        // 根原因
        rootCause: '',
        // 根原因分析
        analyze: ''
      },
      operation: {
        // ID
        riskId: 0,
        // 危险源类型id
        categoryId: '',
        // 危险源类型
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
        anonymous: '',
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
        riskGrade: ''
      },
      // 表格数据
      tableData: [],
      // 审核历史表格数据
      historyTableData: [],
      // 新增弹框
      preliminaryAction: false,
      // FC/LEC下拉框数据
      FCLEC: {
        FCfData: [],
        FCcData: [],
        LEClData: [],
        LECeData: [],
        LECcData: [],
      },
      // loading
      fullscreenLoading: false,
      // 涉及过程数据
      involvesProcessData: [],
      involvesProcess: [],
      // 选择原因数据
      selectRootCauseData: [],
      selectRootCauseArr: [],
      // push进来的页面描述
      describe: '',
      // 后台附件存储的表单名
      tableName: 't_risk_source',
      safetyId: 0,
      flag: 1,
      // 弹框数据
      awardData: {
        auditResult: -1,
        // 评估
        riskDesc: '',
        // 审核部门
        deptName: '',
        // 审核人
        userName: '',
        // 部门Id
        deptId: '',
        // 审核人Id
        userId: ''
      },
      taskInfo: {},
      path: '',
      status: '',
      uploadFile: true,
      textCom: '评估',
      popoutTxt: '风险等级核准',
      // 流程图对应的值
      auditTypeNum: -1
    }
  },
  computed: {
    ...Vuex.mapState(["ALL_SELECT_DATA"])
  },
  methods: {
    // 关闭
    hide () {
      this.preliminaryAction = false
    },
    // 返回
    gobackAction () {
      this.$router.go(-1)
    },
    // 办理/发送
    preserveAction () {
      this.preliminaryAction = true
    },
    // 获取查看数据
    getExamineData () {
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
          this.involvesProcess = arr
          // 处理FC/LEC选框的显示
          if (this.operation.rfcF || this.operation.rfcC) {
            this.operation.anonymous = 'FC'
          } else {
            this.operation.anonymous = 'LEC'
          }
        } else {
          this.$message({
            type: 'error',
            message: '获取失败：' + result.data.message
          })
        }
      })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '获取失败：' + error
          })
        })
    },
    // 发送/同意
    confirmAction () {
      if (this.awardData.riskDesc === '') {
        this.$message({
          type: 'info',
          message: '请填写处理意见'
        })
      } else {
        this.awardData.auditResult = 1
        let obj = {}
        obj.riskAuditDO = this.awardData
        obj.taskInfo = this.taskInfo
        obj.riskAuditDO.auditComment = this.awardData.riskDesc
        obj.riskAuditDO.auditUserName = this.awardData.userName
        obj.riskAuditDO.submitUser = this.awardData.userId
        obj.riskAuditDO.riskId = this.operation.riskId
        // 开启loading
        this.fullscreenLoading = true
        disposeHazardAudit(obj).then(result => {
          this.fullscreenLoading = false
          if (result.data.error === 0 && result.data.data !== null) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$router.push(this.path)
            // 清空输入框
            this.awardData.riskDesc = ''
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
            this.fullscreenLoading = false
          })
      }
    },
    // 点击切换方向
    basicAction () {
      if (this.$refs.basicDirection.className === 'icon-arrow-down') {
        this.$refs.basicDirection.className = 'icon-arrow-up'
      } else {
        this.$refs.basicDirection.className = 'icon-arrow-down'
      }
    },
    rootCauseAction () {
      if (this.$refs.rootCause.className === 'icon-arrow-down') {
        this.$refs.rootCause.className = 'icon-arrow-up'
      } else {
        this.$refs.rootCause.className = 'icon-arrow-down'
      }
    },
    historyTiggleAction () {
      if (this.$refs.historyRef.className === 'icon-arrow-down') {
        this.$refs.historyRef.className = 'icon-arrow-up'
      } else {
        this.$refs.historyRef.className = 'icon-arrow-down'
      }
    },
    // 审核历史
    ReviewTheHistory () {
      this.operation.riskId = this.$route.query.riskId
      examineAuditHistory(this.operation.riskId).then(result => {
        // console.log(result, '历史')
        if (result.data.error === 0 && result.data.data !== null) {
          this.historyTableData = result.data.data
          for (var i = 0; i < this.historyTableData.length; i++) {
            this.historyTableData[i].index = i + 1
            if (this.historyTableData[i].auditType === -1 && this.historyTableData[i].mustAuditTime === null) {
              this.historyTableData[i].auditType = '新建'
            } else if (this.historyTableData[i].auditType === -1 && this.historyTableData[i].mustAuditTime !== null) {
              this.historyTableData[i].auditType = '修改'
            } else if (this.historyTableData[i].auditType === 0) {
              this.historyTableData[i].auditType = '评估'
            } else if (this.historyTableData[i].auditType === 1) {
              this.historyTableData[i].auditType = '审核'
            } else if (this.historyTableData[i].auditType === 2) {
              this.historyTableData[i].auditType = '结束'
            }
            if (this.historyTableData[i].auditResult === 1) {
              this.historyTableData[i].auditResult = '同意'
            } else if (this.historyTableData[i].auditResult === 0) {
              this.historyTableData[i].auditResult = '驳回'
            }
          }
        } else {
            this.$message({
              type: 'error',
              message: '获取失败：' + result.data.message
            })
          }
      })
        .catch(error => {
            this.$message({
              type: 'error',
              message: '获取失败：' + error
            })
          })
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
    // 驳回
    dismissAction () {
      this.$confirm('确定驳回？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.awardData.auditResult = 0
        let obj = {}
        obj.riskAuditDO = this.awardData
        obj.taskInfo = this.taskInfo
        obj.riskAuditDO.auditComment = this.awardData.riskDesc
        obj.riskAuditDO.auditUserName = this.awardData.userName
        obj.riskAuditDO.submitUser = this.awardData.userId
        obj.riskAuditDO.riskId = this.operation.riskId
        // 开启loading
        this.fullscreenLoading = true
        disposeHazardAudit(obj).then(result => {
          this.fullscreenLoading = false
          if (result.data.error === 0 && result.data.data !== null) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$router.push(this.path)
            // 清空输入框
            this.awardData.riskDesc = ''
          } else {
            this.$message({
              type: 'error',
              message: '操作失败：' + result.data.message
            })
          }
        })
          .catch(error => {
            // 关闭
            this.fullscreenLoading = false
            this.$message({
              type: 'error',
              message: '操作失败：' + error
            })
          })
      })
    }
  },
  created () {
    this.possibilityAction()
    this.ponderanceAction()
    this.LAction()
    this.EAction()
    this.CAction()
    // 附件上传的safetyId
    this.safetyId = this.$route.query.riskId ? this.$route.query.riskId : 0
    let user = this.$store.state.user
    // 部门ID和部门名称
    this.awardData.deptId = user.deptId
    this.awardData.deptName = user.deptName
    // 用户ID和名字
    this.awardData.userId = user.userId
    this.awardData.userName = user.userName
    // 触发调用涉及过程数据
    getInvolveCourse().then(result => {
      // console.log(result)
      this.involvesProcessData = result
    })
    // 获取数据
    this.getExamineData()
    // 获取审核历史数据
    this.ReviewTheHistory()
  },
  mounted () {
    if (this.$route.query.flag === 2) {
      this.flag = 2
      this.status = this.$route.query.status
      console.log(this.status)
      if (this.status === '结束' || this.status === 2) {
        this.auditTypeNum = 4
      } else if (this.status === '审核' || this.status === 1) {
        this.auditTypeNum = 2
      } else if (this.status === '评估' || this.status === 0) {
        this.auditTypeNum = 1
      } else if(this.status === '新建' || this.status === -1) {
        this.auditTypeNum = 0
      }
    }
    if (this.$route.query.flag === 1) {
      this.flag = 1
      // 点击办理时保存点击进来的路径
      this.path = this.$route.query.path
      this.taskInfo = this.$route.query.taskInfo
      this.status = this.$route.query.status
      // console.log(this.status)
      if (this.status === '结束' || this.status === 2) {
        this.auditTypeNum = 3
      } else if (this.status === '审核' || this.status === 1) {
        this.textCom = '审核意见'
        this.popoutTxt = '核审'
        this.auditTypeNum = 2
      } else if (this.status === '评估' || this.status === 0) {
        this.textCom = '评估'
        this.popoutTxt = '风险等级核准'
        this.auditTypeNum = 1
      } else if(this.status === '新建' || this.status === -1) {
        this.auditTypeNum = 0
      }
      // console.log(this.status)
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
