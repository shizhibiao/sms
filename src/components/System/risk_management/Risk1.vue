<template>
    <b-card  no-body>
            <div slot="header">
              风险分析
                <div class="card-actions">
                    <b-btn class="btn btn-minimize" v-b-toggle.collapse3><i class="icon-arrow-up"></i></b-btn>
                </div>

            </div>
            <b-collapse id="collapse3" :visible='true'>
                <b-card-body>
                    <el-form ref="riskForm" label-width="120px" label-position="left" :model="risk" :rules='formRules' inline-message>
                        <div class="row mt-0 mb-0 pt-0 pb-0 ">
                            <div class="col-lg-6 col-md-6 col-sm-12">
                                <el-form-item label="风险分析员">
                                    <p>{{processDeptObj.processUserName}}</p>
                                </el-form-item>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-12">
                                <el-form-item label="受理部门">
                                     <p>{{processDeptObj.processDeptName}}</p>
                                </el-form-item>
                            </div>

                        </div>
                        <div class="row mt-0 mb-0 pt-0 pb-0 ">
                            <div class="col-lg-6 col-md-6 col-sm-12">
                                <el-form-item label="指定控制部门"  prop="selectControlDept">
                                    <el-select v-model="risk.selectControlDept" :clearable='true'
                                    @change="selectControlDeptHanle" value-key="deptId" :disabled="noWritable"
                                    >
                                        <el-option :label="item.deptName" :value="item" v-for="item in ControlDept" :key ='item.deptId'></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-12" v-if='isShowControlPerson'>
                                <el-form-item label="控制人" prop="ControlPerson" >
                                    <el-select class="level" v-model="risk.ControlPerson" :clearable='true'
                                    value-key="userId" :disabled="noWritable"
                                    >
                                        <el-option :label="item.userName" :value="item" v-for="item in ControlDeptPerson" :key ='item.userId'></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>

                        </div>
                        <el-row style='padding-top:10px' v-if="!noWritable">
                              <el-col :span='10' align='right'>
                                  <el-button type="primary" size="small" @click="saveAllRisk" style='width:100px' >保存</el-button>
                              </el-col>
                              <el-col :span="10" :offset="4">
                                  <el-button type="primary"  @click='selectRiskSourceHandler' size="small" style='width:100px'>选择危险源</el-button>
                                  <el-button type="primary"  @click='addRiskSource' size="small" style='width:100px'>新增危险源</el-button>
                              </el-col>

                        </el-row>
                        <!--

                         -->
                        <!-- 危险源列表 -->
                        <el-table
                                :data="riskTabList"

                                :row-class-name="tableRowClassName">
                            <el-table-column
                                fixed
                                width="50">
                                  <template slot-scope="scopes" v-if='scopes.row.riskSourceDO'>
                                      {{scopes.row.$index}}
                                </template>

                            </el-table-column>
                            <el-table-column

                                label="辨识部门"
                            >
                                <template slot-scope="scopes" v-if='scopes.row.riskSourceDO'>
                                      {{scopes.row.riskSourceDO.identifyDeptName}}
                                </template>
                            </el-table-column>
                            <el-table-column

                                label="危险源编号"
                            >
                                <template slot-scope="scopes" v-if='scopes.row.riskSourceDO'>
                                       {{scopes.row.riskSourceDO.riskNo}}
                                </template>
                            </el-table-column>
                            <el-table-column

                                label="危险源描述">
                                <template slot-scope="scopes" v-if='scopes.row.riskSourceDO'>
                                       {{scopes.row.riskSourceDO.riskDesc}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="riskResult"
                                label="可能导致的风险或后果"
                            >
                                <template slot-scope="scopes" v-if='scopes.row.riskSourceDO'>
                                       {{scopes.row.riskSourceDO.riskResult}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="riskGrade"
                                label="风险等级"
                            >
                                <template slot-scope="scopes" v-if='scopes.row.riskSourceDO'>
                                       {{scopes.row.riskSourceDO.riskGrade}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="acception"
                                label="可接受程度">
                                <template slot-scope="scopes" v-if='scopes.row.riskSourceDO'>
                                       {{scopes.row.riskSourceDO.acception}}
                                </template>
                            </el-table-column>
                            <!-- <el-table-column
                                prop="date"
                                label="根原因"
                                width="180">
                            </el-table-column> -->
                            <el-table-column

                                label="对应规则编号"
                            >
                                <template slot-scope="scopes" v-if='scopes.row.riskSourceDO'>
                                       {{scopes.row.riskSourceDO.riskMeasure}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                width='100'
                                label="操作">
                                <template slot-scope="scope" v-if='scope.row.riskSourceDO'>
                                      <el-button type="danger"
                                      size="mini"
                                      @click.native.prevent="deleteRow(scope.$index, riskTabList)"
                                      v-if="!noWritable"
                                      >删除</el-button>
                                      <el-button type="primary"
                                      size="mini"
                                      @click.native.prevent="modifyRow(scope.$index, riskTabList)"
                                      v-if="!noWritable"
                                      >修改</el-button>
                                      <el-button
                                      size="mini"
                                      @click.native.prevent="lookRow(scope.$index, riskTabList)"
                                      v-if="!noWritable"
                                      >查看</el-button>
                                </template>
                            </el-table-column>

                        </el-table>

                    </el-form>
                </b-card-body>
            </b-collapse>
        <!-- 选择弹出对话框 -->
            <el-dialog title="选择危险源" :visible.sync="dialogFormVisible" width='70%'>
                <el-form :model="riskSourceForm" inline-message ref='riskSourceForm' >

                    <el-form-item label="辨识部门" label-width="10%">
                        <el-cascader
                            style="width:50%"
                            :options="riskSourceList"
                            :show-all-levels="false"
                            :props="{
                                value:'id',
                                label:'categoryName',
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
        <!-- 新增危险源弹出 -->
            <el-dialog title="危险源" :visible.sync="addRiskSourceFormVisible" width='80%'>

                <el-form :model="operation" :rules="operationRules" ref="operation" status-icon size="small" label-width="120px" inline-message :disabled='riskSourcetType==="look"'>
                  <div class="row">
                    <div class="col-lg-4 col-md-6 col-sm-12">
                      <el-form-item label="辨识部门">
                        <el-input v-model="operation.identifyDeptName" disabled></el-input>
                        <!-- <span>{{processDeptObj.processDeptName}}</span> -->
                      </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                      <el-form-item label="涉及部门" prop="involvesProcess">
                        <el-cascader :options="involvesProcessData" v-model="operation.involvesProcess" :props='{value:"value"}' :show-all-levels="false" :clearable='true'></el-cascader>
                      </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                      <el-form-item label="编号" prop="riskNo">
                        <el-input v-model="operation.riskNo"></el-input>
                      </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                      <el-form-item label="时态" prop="riskTense">
                        <el-select v-model="operation.riskTense" :clearable='true'>
                          <el-option v-for="(item, index) in ALL_SELECT_DATA.TENSE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                      <el-form-item label="类型" prop="riskType">
                        <el-select v-model="operation.riskType" :clearable='true'>
                            <el-option v-for="(item, index) in ALL_SELECT_DATA.RISKSOURCE_TYPE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                      <el-form-item label="状态" prop="riskStatus">
                        <el-select v-model="operation.riskStatus" :clearable='true'>
                            <el-option v-for="(item, index) in ALL_SELECT_DATA.RISKSOURCE_STATUS.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="col-lg-12 col-md-12 col-sm-12">

                            <el-form-item label="FC/LEC" title="可能性(F)/严重性(C)、事故发生可能性(F)/人员暴露于危险环境中频繁程度(E)/事故发生可能造成的后果(C)" prop="anonymous">
                                <el-radio :disabled='riskSourcetType==="look"' v-model="operation.anonymous" label='FC' title="可能性(F)/严重性(C)" @click.native.prevent="changeAnonymous('FC')">FC</el-radio>
                                <el-radio :disabled='riskSourcetType==="look"' v-model="operation.anonymous" label='LEC' title="事故发生可能性(F)/人员暴露于危险环境中频繁程度(E)/事故发生可能造成的后果(C)" @click.native.prevent="changeAnonymous('LEC')">LEC</el-radio>
                            </el-form-item>

                    </div>

                  </div>
                  <div class="row">
                      <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'">
                        <el-form-item label="可能性(F)" prop="rfcF">
                            <el-select v-model="operation.rfcF" :clearable='true'>
                                <el-option v-for="(item, index) in FCLEC.FCfData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                                    <span style="float: left">{{ item.grade }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                      </div>
                      <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'">
                        <el-form-item label="严重性(C)" prop="rfcC">
                          <el-select v-model="operation.rfcC" :clearable='true'>
                              <el-option v-for="(item, index) in FCLEC.FCcData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                                  <span style="float: left">{{ item.grade }}</span>
                                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                              </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                      <!-- <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'"></div> -->
                      <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
                        <el-form-item label="事故发生可能性(L)" title="事故发生可能性(L)" prop="lecL">
                          <el-select v-model="operation.lecL" :clearable='true'>
                              <el-option v-for="(item, index) in FCLEC.LEClData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                                  <span style="float: left">{{ item.grade }}</span>
                                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                              </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                      <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
                        <el-form-item label="人员暴露于危险环境中频繁程度(E)" title="人员暴露于危险环境中频繁程度(E)" prop="lecE">
                          <el-select v-model="operation.lecE" :clearable='true'>
                              <el-option v-for="(item, index) in FCLEC.LECeData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                                  <span style="float: left">{{ item.grade }}</span>
                                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                              </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                      <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
                          <el-form-item label="事故发生可能造成的后果(C)" title="事故发生可能造成的后果(C)" prop="lecC">
                              <el-select v-model="operation.lecC" :clearable='true'>
                                  <el-option v-for="(item, index) in FCLEC.LECcData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                                    <span style="float: left">{{ item.grade }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                                  </el-option>
                              </el-select>
                          </el-form-item>
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-lg-6 col-md-6 col-sm-12">
                          <el-form-item label="危险源描述" style="margin-bottom: 8px;" prop="riskDesc">
                              <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="operation.riskDesc">
                              </el-input>
                          </el-form-item>
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-12">
                           <el-form-item label="可能导致风险或后果" style="margin-bottom: 8px;" title="可能导致风险或后果" prop="riskResult">
                              <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="operation.riskResult">
                              </el-input>
                          </el-form-item>
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-lg-6 col-md-6 col-sm-12">
                          <el-form-item label="外部对接" style="margin-bottom: 8px;" prop="externalButtJoint">
                              <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="operation.externalButtJoint">
                              </el-input>
                          </el-form-item>
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-12">
                           <el-form-item label="风险控制措施或对应规程编号" style="margin-bottom: 8px;" title="风险控制措施或对应规程编号" prop="riskMeasure">
                                <el-input
                                  type="textarea"
                                  placeholder="请输入内容"
                                  v-model="operation.riskMeasure">
                                </el-input>
                            </el-form-item>
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-lg-6 col-md-6 col-sm-12">
                          <el-form-item label="衍生风险" style="margin-bottom: 8px;" prop="deriveRisk">
                              <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="operation.deriveRisk">
                              </el-input>
                          </el-form-item>
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-12">
                           <el-form-item label="应急措施" style="margin-bottom: 8px;" prop="controlMeasure">
                              <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="operation.controlMeasure">
                              </el-input>
                          </el-form-item>
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-lg-6 col-md-6 col-sm-12">
                          <el-form-item label="剩余风险" style="margin-bottom: 8px;" prop="residualRisk">
                              <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="operation.residualRisk">
                              </el-input>
                          </el-form-item>
                      </div>
                  </div>
                  <div class="row" style="margin-top:30px">
                    <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'">
                      <el-form-item label="剩余可能性(F)">
                        <el-select v-model="operation.residualRfcF" :clearable='true'>
                          <el-option v-for="(item, index) in FCLEC.FCfData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                              <span style="float: left">{{ item.grade }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                            </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'FC'">
                      <el-form-item label="剩余严重性(C)">
                        <el-select v-model="operation.residualRfcC" :clearable='true'>
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
                        <el-select v-model="operation.residualLecL" :clearable='true'>
                            <el-option v-for="(item, index) in FCLEC.LEClData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                              <span style="float: left">{{ item.grade }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                            </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
                      <el-form-item label="人员暴露于危险环境中频繁程度(E)" title="人员暴露于危险环境中频繁程度(E)">
                        <el-select v-model="operation.residualLecE" :clearable='true'>
                            <el-option v-for="(item, index) in FCLEC.LECeData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                              <span style="float: left">{{ item.grade }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                            </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.anonymous === 'LEC'">
                      <el-form-item label="事故发生可能造成的后果(C)" title="事故发生可能造成的后果(C)">
                        <el-select v-model="operation.residualLecC" :clearable='true'>
                            <el-option v-for="(item, index) in FCLEC.LECcData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                              <span style="float: left">{{ item.grade }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                            </el-option>
                        </el-select>
                      </el-form-item>
                    </div>

                  </div>
                  <div>
                    <el-button class="pull-right" type="primary" @click='preliminaryAction=true' v-if='riskSourcetType!=="look"'>
                      新增根原因
                    </el-button>
                  </div>
                </el-form>

                <!-- table -->
                <el-table

                    size="small"
                    :data="tableData"
                    :stripe="true"
                    :highlight-current-row ="true"
                    style="width: 100%">
                    <el-table-column
                        label="#"
                        type="index"
                        width='40'
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
                      label="操作"
                    v-if='riskSourcetType!=="look"'
                    >
                      <template slot-scope="scope">
                        <el-button type="danger" size='mini'
                          @click="handleRemove(scope.$index, scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                </el-table>


                <!--  -->
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addRiskSourceFormVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="addRiskBtnHandler"  v-if='riskSourcetType!=="look"'>确 定</el-button>
                </div>
            </el-dialog>
          <!--  -->
          <!--新增根原因弹框 -->
          <el-dialog title="新增根原因" :visible.sync="preliminaryAction" width="30%">
            <el-form :model="cause" inline-message label-width="100px" ref="cause">
                <el-form-item label="选择根原因" prop="selectRootCauseArr">
                    <el-cascader :options="selectRootCauseData" v-model="selectRootCauseArr" :props='{value:"value"}' :show-all-levels="false" :clearable='true' @change="rootCauseAction(selectRootCauseArr)"></el-cascader>
                </el-form-item>
                <el-form-item label="根原因" prop="rootCause">
                    <el-select v-model="cause.rootCause">
                        <el-option v-for="(item, index) in RootCauseDatas" :key="index" :label="item.reasonName" :value="item.reasonName" @click.native="getAnalyzeData(item.reasonDesc)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="根原因分析" style="margin-bottom: 8px;">
                    <el-input
                      disabled
                      type="textarea"
                      placeholder="请输入内容"
                      v-model="cause.analyze">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="confirmAction">确定</el-button>
            </div>
        </el-dialog>
    </b-card>
</template>
<script>
import {
  riskManageControlDept,
  riskManageControlPerson,
  getRiskCategoryDept,
  getRiskSourceCategory,
  saveRiskSource,
  searchRiskSourceList,
  saveRiskSourceAndOther,
  deleteRiskSource,
  newRiskSource,
  updateRiskSource
} from '../../../services/risk'
import PubSub from 'pubsub-js'
import Vuex from 'vuex'
import { formatDate } from '../../../utils/index.js'
import { getInvolveCourse, QueryListDataAction, inquireRootCause, getSingleHazardData, getCompileDataList } from '../../../services/information_report/index.js'
export default {
  data () {
    return {
      dialogFormVisible: false,
      processDeptObj: {},
      ControlDept: [],
      isShowControlPerson: false,
      ControlDeptPerson: [], // 可控制人

      risk: {

        selectControlDept: {},
        ControlPerson: {}
      },
      isShow: false,
      riskSourceForm: {},
      riskSourceList: [],
      RiskTableData: [],
      tableRowClassName ({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row'
        } else if (rowIndex === 3) {
          return 'success-row'
        }
        return ''
      },
      riskTabList: [],
      selectRiskSource: [],
      formRules: {
        selectControlDept: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        ControlPerson: [
          { required: true, message: '必填', trigger: 'change' }
        ]
      },
      operationRules: {
        involvesProcess: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        riskNo: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        anonymous: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        rfcF: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        rfcC: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        lecL: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        lecE: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        lecC: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        riskDesc: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        riskResult: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        riskMeasure: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      addRiskSourceFormVisible: false,
      preliminaryAction: false,
      // 新增危险源对象
      operation: {},
      FCLEC: {},
      involvesProcessData: [],
      tableData: [],
      cause: {},
      selectRootCauseArr: [],
      selectRootCauseData: [],
      RootCauseDatas: [],
      riskSourcetType: ''
    }
  },
  props: {
    noWritable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 选择控制部门
    selectControlDeptHanle () {
      if (this.risk.selectControlDept) {
        var selectDeptId = this.risk.selectControlDept.deptId

        if (+this.risk.projectLevel === 2) {
          selectDeptId = this.risk.selectControlDept.deptId
          // 获得可控制人数据
          riskManageControlPerson(selectDeptId).then(result => {
            if (result.data && result.data.data && result.data.error === 0) {
              this.ControlDeptPerson = result.data.data
            }
          })
        }
      }
    },
    // 选择危险源
    selectRiskSourceHandler () {
      this.$refs['riskForm'].validate((valid) => {
        if (valid) {
          this.valid = true
        } else {
          this.valid = false
        }

        if (!this.valid || !this.risk.selectControlDept.deptId) {
          this.$message({
            type: 'error',
            message: '选项不能为空'
          })
        } else {
          this.dialogFormVisible = true
          // 根据分类请求危险源辨识

          if (this.processDeptObj && this.processDeptObj.processDept && this.risk.projectLevel) {
            getRiskCategoryDept(this.processDeptObj.processDept, this.risk.projectLevel).then(result => {
              if (result.data && result.data.error === 0 && result.data.data) {
                this.riskSourceList = result.data.data
              }
            })
          }
        }
      })
    },
    // 删除
    deleteRow (index, arr) {
      if (arr.length > 0) {
        let id = arr[index].id

        // 删除危险源
        deleteRiskSource(id).then(result => {
          if (result.data && result.data.error === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.searchRiskSource()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败，错误信息' + result.data.message
            })
          }
        })
          .catch(error => { this.$message.error('网络或者服务器出错，错误信息' + error) })
      }
    },
    // 选择危险源确定
    dialogConfirmBtn () {
      if (this.selectRiskSource.length > 0 && this.processDeptObj.riskDeptId) {
        let datas = this.selectRiskSource.map(item => {
          return {
            riskDeptId: this.processDeptObj.riskDeptId,
            riskSourceId: item.riskId
          }
        })
        // 保存危险源
        saveRiskSource(datas).then(result => {
          if (result.data && result.data.error === 0) {
            this.riskTabList = result.data.data
            // this.$emit('saveSourceMessage','saveSourceMessage')
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '保存失败' + result.data.message,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message({
            message: '网络或者服务器错误' + error,
            type: 'error'
          })
        })
      } else {
        this.$message({
          message: '您还未选择要保存的危险源',
          type: 'error'
        })
      }
      this.dialogFormVisible = false
      this.RiskTableData = []
      // 查询 危险源
      this.searchRiskSource()
    },
    // 多选时 选中
    handleSelectionChange (val) {
      this.selectRiskSource = val
    },
    // 改变危险源辨识部门
    changeRiskSourceDept (arr) {
      if (arr && arr.length > 0) {
        let id = arr[arr.length - 1]
        getRiskSourceCategory(id).then(result => {
          if (result && result.data && result.data.error === 0) {
            this.RiskTableData = result.data.data
          }
        })
      }
    },
    // 查找已保存的危险源
    searchRiskSource () {
      if (this.processDeptObj.riskDeptId) {
        searchRiskSourceList(this.processDeptObj.riskDeptId).then(res => {
          if (res.data && res.data.error === 0) {
            // this.riskTabList = res.data.data

            let riskTabList = res.data.data
            this.riskTabList = riskTabList.filter(item => {
              return item.riskSourceDO !== null || []
            })
          }
        })
      }
    },
    // 保存危险源
    saveAllRisk () {
      this.$confirm('是否要保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs['riskForm'].validate((valid) => {
          if (!valid || !this.risk.selectControlDept.deptId) {
            this.$message({
              type: 'error',
              message: '该选项不能为空'
            })
          } else {
            this.processDeptObj.controlDept = this.risk.selectControlDept.deptId
            this.processDeptObj.controlDeptName = this.risk.selectControlDept.deptName
            this.processDeptObj.controlUser = this.risk.ControlPerson.userId
            this.processDeptObj.controlUserName = this.risk.ControlPerson.userName

            saveRiskSourceAndOther(this.processDeptObj).then(result => {
              if (result.data && result.data.error === 0) {
                // this.$emit('saveDeptMessage','saveDeptMessage')
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '保存失败，错误信息：' + result.data.message
                })
              }
            })
              .catch(error => {
                this.$message({
                  type: 'error',
                  message: '网络或者服务器异常,错误信息' + error
                })
              })
          }
        })
      })
    },
    // 新增危险源
    addRiskSource () {
      if (this.$refs && this.$refs.operation && this.$refs.operation.hasOwnProperty('resetFields')) {
        this.$refs.operation.resetFields()
        this.operation = {}
        this.operation.identifyDeptName = this.processDeptObj.processDeptName
        this.riskSourcetType = ''
      }
      // if (this.$refs && this.$refs.cause && this.$refs.cause.hasOwnProperty('resetFields')) {
      //   this.$refs.cause.resetFields()
      //   console.log('执行了2')
      // }
      this.addRiskSourceFormVisible = true
    },
    getFcLecDate (index) {
      let fclecTypes
      if (index <= 3) {
        fclecTypes = this.$store.state.fcTypes
      } else {
        fclecTypes = this.$store.state.lecTypes
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
      this.FCLEC.FCfData = this.getFcLecDate(1)
    },
    // C-----w2
    ponderanceAction () {
      this.FCLEC.FCcData = this.getFcLecDate(2)
    },
    // L-----4
    LAction () {
      this.FCLEC.LEClData = this.getFcLecDate(4)
    },
    // E-----5
    EAction () {
      this.FCLEC.LECeData = this.getFcLecDate(5)
      // })
    },
    // C-----6
    CAction () {
      this.FCLEC.LECcData = this.getFcLecDate(6)
    },
    handleRemove (index, arr) {
      this.tableData.splice(index, 1)
    },
    // 新增跟原因确定
    confirmAction () {
      let obj = {}
      obj.reasonDetailId = this.cause.reasonDetailId
      obj.resonName = this.cause.rootCause
      obj.resonDesc = this.cause.analyze
      this.tableData.push(obj)

      this.preliminaryAction = false
      // 清空输入框
      this.selectRootCauseArr = []
      this.cause.rootCause = ''
      this.cause.analyze = ''
    },
    // 根原因
    rootCauseAction (data) {
      // 点击选择根原因下两个清空输入框
      this.cause.rootCause = ''
      this.cause.analyze = ''
      // 截取到最后一级的id值
      let id = data && data.length > 0 ? data[data.length - 1] : ''
      this.cause.reasonDetailId = id
      QueryListDataAction(id).then(result => {
        if (result.data.error === 0 && result.data.data !== []) {
          this.RootCauseDatas = result.data.data
        }
      })
    },
    // 新增危险源确定
    addRiskBtnHandler () {
      // newRiskSource()
      this.$refs.operation.validate((valid) => {
        if (!valid) {
          this.$message({
            type: 'error',
            message: '内容不能为空'
          })
        } else {
          let involvesProcess = this.operation.involvesProcess
          if (this.operation.anonymous === 'FC') {
            // 当anonymous等于FC时清空LEC相关数据
            this.operation.lecL = 0
            this.operation.lecE = 0
            this.operation.lecC = 0
            this.operation.residualLecL = 0
            this.operation.residualLecE = 0
            this.operation.residualLecC = 0
          } else if (this.operation.anonymous === 'LEC') {
            // 当anonymous等于LEC时清空FC相关数据
            this.operation.rfcF = 0
            this.operation.rfcC = 0
            this.operation.residualRfcF = 0
            this.operation.residualRfcC = 0
          }
          this.operation.deptId = involvesProcess && involvesProcess.length > 0 ? involvesProcess[0] : ''
          this.operation.level1Process = involvesProcess && involvesProcess.length > 1 ? involvesProcess[1] : ''
          this.operation.level2Process = involvesProcess && involvesProcess.length > 2 ? involvesProcess[2] : ''
          this.operation.level3Process = involvesProcess && involvesProcess.length > 3 ? involvesProcess[3] : ''
          this.operation.level4Process = involvesProcess && involvesProcess.length > 4 ? involvesProcess[4] : ''
          let data = this.operation
          // 危险源Id categoryName
          if (data.level1Process && data.level2Process && data.level3Process && data.level4Process) {
            data.categoryId = data.level4Process
            this.getCategoryName(data.level4Process)
          } else if (data.level1Process && data.level2Process && data.level3Process) {
            data.categoryId = data.level3Process
            this.getCategoryName(data.level3Process)
          } else if (data.level1Process && data.level2Process) {
            data.categoryId = data.level2Process
            this.getCategoryName(data.level2Process)
          } else if (data.level1Process) {
            data.categoryId = data.level1Process
            this.getCategoryName(data.level1Process)
          } else {
            data.categoryId = data.deptId
            this.getCategoryName(data.deptId)
          }

          data.rootReasonDOList = this.tableData
          data.createByName = this.user.userName
          data.identifyDept = this.processDeptObj.riskDeptId

          data.createTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
          // 显示loading
          this.$nextTick(() => {
            let params = {}
            params.riskDeptId = this.processDeptObj.riskDeptId
            params.riskSourceDO = data
            console.log(params)
            // 新增保存危险源
            if (this.riskSourcetType !== 'modify') {
              newRiskSource(params).then(result => {
                if (result.data.error === 0 && result.data.data !== null) {
                  // 保存ID的值
                  // this.operation.riskId = result.data.data.riskId

                  this.$message({
                    type: 'success',
                    message: '保存成功!'
                  })
                  this.addRiskSourceFormVisible = false
                  this.searchRiskSource()
                } else {
                  this.$message({
                    type: 'error',
                    message: `保存失败: ${result.data.message}`
                  })
                }
              })
                .catch((error) => {
                  // 保存成功后关闭loading
                  this.$message({
                    type: 'error',
                    message: `保存失败: ${error}`
                  })
                })
            } else {
              updateRiskSource(params).then(result => {
                if (result.data.error === 0 && result.data.data !== null) {
                  this.$message({
                    type: 'success',
                    message: '保存成功!'
                  })
                  this.addRiskSourceFormVisible = false
                  this.searchRiskSource()
                } else {
                  this.$message({
                    type: 'error',
                    message: `保存失败: ${result.data.message}`
                  })
                }
              }).catch((error) => {
                // 保存成功后关闭loading
                this.$message({
                  type: 'error',
                  message: `保存失败: ${error}`
                })
              })
            }
          })
        }
      })
    },
    getAnalyzeData (reasonDesc) {
      // 赋值
      this.cause.analyze = reasonDesc

      this.$forceUpdate(() => {})
    },
    getCategoryName (id) {
      getSingleHazardData(id).then(result => {
        if (result.data.data !== null && result.data.error === 0) {
          this.operation.categoryName = result.data.data.categoryName
        }
      })
    },
    //
    lookRow (index, array) {
      // console.log(arr)

      if (array.length > 0) {
        this.riskSourcetType = 'look'
        let riskSourceId = array[index].riskSourceId
        // console.log(arr)
        // console.log(riskSourceId)
        // 查找危险源根原因
        getCompileDataList(riskSourceId).then(result => {
          if (result.data && result.data.error === 0 && result.data.data) {
            this.tableData = result.data.data.rootReasonDOList
          }

          this.operation = array[index].riskSourceDO
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
          if (this.operation.rfcF && this.operation.rfcC) {
            this.operation.anonymous = 'FC'
          } else {
            this.operation.anonymous = 'LEC'
          }
        }).then(() => {
          this.addRiskSourceFormVisible = true
        })
      }
    },
    modifyRow (index, array) {
      // console.log(JSON.parse(JSON.stringify(arr)),'---------------------------------')
      if (array.length > 0) {
        this.riskSourcetType = 'modify'

        let riskSourceId = array[index].riskSourceId
        getCompileDataList(riskSourceId).then(result => {
          if (result.data && result.data.error === 0 && result.data.data) {
            this.tableData = result.data.data.rootReasonDOList
          }
          this.operation = array[index].riskSourceDO
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
          if (this.operation.rfcF && this.operation.rfcC) {
            this.operation.anonymous = 'FC'
          } else {
            this.operation.anonymous = 'LEC'
          }
        }).then(() => {
          this.addRiskSourceFormVisible = true
        })

        // updateRiskSource()
      }
    },
    changeAnonymous (e) {
      if (this.riskSourcetType !== 'look') {
        e === this.operation.anonymous ? this.operation.anonymous = '' : this.operation.anonymous = e

        this.$forceUpdate()
      }
    }

  },
  computed: {
    ...Vuex.mapState(['user']),
    ...Vuex.mapState(['ALL_SELECT_DATA'])
  },
  created () {
    this.possibilityAction()
    this.ponderanceAction()
    this.LAction()
    this.EAction()
    this.CAction()
    // 多级数据
    getInvolveCourse().then(result => {
      this.involvesProcessData = result
    })

    inquireRootCause().then(result => {
      // console.log(result)
      this.selectRootCauseData = result
    })

    this.mySubscriber = PubSub.subscribe('getRiskControlDeptObj', (message, data) => {
      // 获得基本信息
      // console.log(data)
      this.risk.projectLevel = +data.projectLevel
      this.processDeptObj = data.rmDepartmentDOList[0]
      // 辨识部门
      this.operation.identifyDeptName = this.processDeptObj.processDeptName

      this.processDeptObj.processUser = this.processDeptObj.processUser ? this.processDeptObj.processUser : this.user.userId
      this.processDeptObj.processUserName = this.processDeptObj.processUserName ? this.processDeptObj.processUserName : this.user.userName
      if (data.rmDepartmentDOList[0].controlDept) {
        this.risk = {
          selectControlDept: {
            deptId: this.processDeptObj.controlDept,
            deptName: this.processDeptObj.controlDeptName
          },
          ControlPerson: {
            userId: this.processDeptObj.controlUser,
            userName: this.processDeptObj.controlUserName
          },
          projectLevel: +data.projectLevel
        }
        riskManageControlPerson(data.rmDepartmentDOList[0].controlDept).then(result => {
          if (result.data && result.data.data && result.data.error === 0) {
            this.ControlDeptPerson = result.data.data
          }
        })

        this.searchRiskSource()
      }

      if (this.risk.projectLevel) {
        // 获得控制部门数据
        riskManageControlDept(this.risk.projectLevel, data.rmDepartmentDOList[0].processDept).then(result => {
          if (result && result.data && result.data.data && result.data.error === 0) {
            this.ControlDept = result.data.data
            // console.log(this.ControlDept)
          }
        }).then(() => {
          if (this.ControlDept.length > 0 && this.processDeptObj.controlDept) {
            // this.$emit('saveAllMessage','saveAllMessage')
          }
        })
        // 查找已保存的危险源
        // this.searchRiskSource()
        if (+this.risk.projectLevel === 2) {
          // 如果选择的是部门级显示可控制人
          this.isShowControlPerson = true
        }
      }
    })
  },
  mounted () {

  },
  destroyed () {
    PubSub.unsubscribe(this.unSubscribe)
  },
  watch: {
    riskTabList: {
      handler (data, newdata) {
        if (data.length > 0) {
          let arr = newdata.filter(item => {
            return (item.riskSourceDO.deptId || item.riskSourceDO.identifyDeptName || item.riskSourceDO.riskNo) === null || '' || 0
          })

          if (arr.length === 0) {
            this.$emit('saveMessage', 'saveMessage')
          } else {
            this.$emit('deleteMessage', 'deleteMessage')
          }
        } else {
          this.$emit('deleteMessage', 'deleteMessage')
        }
      },
      deep: true
    }

  }
}
</script>

