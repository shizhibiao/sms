<template>
  <div class="animated fadeIn">
    <el-form :model="preserveData" :rules="rules" ref="preserveData" status-icon size="medium" label-width="120px" inline-message>
        <b-card no-body>
            <b-card-header>
                威胁信息
            </b-card-header>
            <b-card-body>
                <div class="row">
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <el-form-item label="填写人">
                            <el-input v-model="preserveData.trCreatebyName" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <el-form-item label="填写部门" prop="trDeptName">
                            <el-input v-model="preserveData.trDeptName" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <el-form-item label="填写日期" prop="trCreateTime">
                            <el-input v-model="preserveData.trCreateTime" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <el-form-item label="报告人" prop="trReportor">
                            <el-select
                                v-model="preserveData.trReportor"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入关键词"
                                @change="verifyReportHandler"
                                :remote-method="remoteMethod"
                                :loading="loading">
                                <el-option
                                    v-for="item in options4"
                                    :key="item.userId"
                                    :clearable='true'
                                    :label="item.userName"
                                    :value="item.userId">
                                </el-option>
                            </el-select>
                            <!-- <el-autocomplete
                            style="width: 100%"
                            v-model="preserveData.trReportorName"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect"
                            @blur="verifyReportHandler"
                            ></el-autocomplete> -->
                        </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <el-form-item label="报告日期" prop="trReportorDate">
                            <el-date-picker
                                style="width: 100%"
                                v-model="preserveData.trReportorDate"
                                type="date"
                                placeholder="报告日期"
                                value-format="yyyy-MM-dd"
                                @change="flightDateAction">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <el-form-item label="报告人联系电话" prop="trPhone">
                            <el-input v-model="preserveData.trPhone" placeholder="请输入号码" maxlength="20"></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <el-form-item label="威胁信息来源" prop="trKind">
                            <el-select v-model="preserveData.trKind">
                                <el-option v-for="(item, index) in ALL_SELECT_DATA.THREATEN_SOURCE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <el-form-item label="信息类型" prop="trCategory">
                            <el-select v-model="preserveData.trCategory">
                                <el-option v-for="(item, index) in ALL_SELECT_DATA.THREATEN_INFO_TYPE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <el-form-item label="信息的可信度" prop="trIscredible">
                            <el-select v-model="preserveData.trIscredible">
                                <el-option v-for="(item, index) in ALL_SELECT_DATA.INFO_CREDIBLE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <el-form-item label="收到威胁的时间" prop="trAcceptDate">
                            <el-date-picker
                                style="width: 100%;"
                                v-model="preserveData.trAcceptDate"
                                type="datetime"
                                placeholder="选择日期时间"
                                align="right"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :picker-options="pickerOptions1">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <el-form-item label="威胁的形式" prop="trWays">
                            <el-select v-model="preserveData.trWays">
                                <el-option v-for="(item, index) in ALL_SELECT_DATA.THREATEN_WAYS.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="col-sm-12">
                        <el-form-item label="标题" prop="trTitle">
                            <el-input v-model="preserveData.trTitle" placeholder="" style="width: 100%" maxlength="200"></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-12">
                        <el-form-item label="是否涉及航空器" prop="trIsRelAircraft">
                            <el-radio v-model="preserveData.trIsRelAircraft" label='true'>是</el-radio>
                            <el-radio v-model="preserveData.trIsRelAircraft" label='false'>否</el-radio>
                        </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12" v-if="preserveData.trIsRelAircraft === 'true'">
                        <el-form-item label="航班日期" prop="trFlightDate">
                            <el-date-picker
                                style="width: 100%"
                                v-model="preserveData.trFlightDate"
                                type="date"
                                placeholder="航班日期"
                                value-format="yyyy-MM-dd"
                                @change="flightDateAction">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12" v-if="preserveData.trIsRelAircraft === 'true'">
                        <el-form-item label="飞机号" prop="trAirNumber">
                            <el-select v-model="preserveData.trAirNumber" @change="datalist" @focus="inputAction1" :disabled="preserveData.trFlightDate === ''">
                                <el-option v-for="(item, index) in planData" :key="index" :label="item.aircraftno" :value="item.aircraftno"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12" v-if="preserveData.trIsRelAircraft === 'true'">
                        <el-form-item label="航段" prop="trPhase">
                            <el-select v-model="preserveData.trPhase" @change="legAction" @focus="inputAction2" :disabled="preserveData.trAirNumber === ''">
                                <el-option v-for="(item, index) in flightLegData" :key="index" :label="item.name" :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12" v-if="preserveData.trIsRelAircraft === 'true'">
                        <el-form-item label="机型" prop="trAirType"><el-input v-model="preserveData.trAirType" placeholder="" disabled></el-input></el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12" v-if="preserveData.trIsRelAircraft === 'true'">
                        <el-form-item label="机组成员" prop="trMembers">
                            <el-input v-model="preserveData.trMembers" placeholder="" disabled></el-input>
                        </el-form-item>
                    </div>
                    <!-- <div class="col-lg-4 col-md-6 col-sm-12">
                        <el-form-item label="航班号" prop="trFlightNumber">
                            <el-select v-model="preserveData.trFlightNumber">
                                <el-option v-for="(item, index) in planData" :key="index" :label="item.aircraftno" :value="item.aircraftno"></el-option>
                            </el-select>
                        </el-form-item>
                    </div> -->
                    <div class="col-sm-12">
                        <el-form-item label="受威胁的对象" prop="trDesc1">
                            <el-input
                                style="width: 100%;margin-bottom: 8px;"
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="preserveData.trDesc1"
                                maxlength="200">
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-12">
                        <el-form-item label="可能采用的破坏手段" prop="trDesc2">
                            <el-input
                                style="width: 100%;margin-bottom: 8px;"
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="preserveData.trDesc2"
                                maxlength="200">
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-12">
                        <el-form-item label="可能造成的损害" prop="trDesc3">
                            <el-input
                                style="width: 100%;margin-bottom: 8px;"
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="preserveData.trDesc3"
                                maxlength="200">
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="col-sm-12">
                        <el-form-item label="威胁发出者的要求" prop="trDesc4">
                            <el-input
                                style="width: 100%;margin-bottom: 8px;"
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="preserveData.trDesc4"
                                maxlength="200">
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
            </b-card-body>
        </b-card>
        <b-card no-body>
            <b-card-header>
                评估结果
            </b-card-header>
            <b-card-body>
                <div class="row">
                    <div class="col-sm-12">
                        <el-form-item label="FC/LEC" title="可能性(F)/严重性(C)、事故发生可能性(F)/人员暴露于危险环境中频繁程度(E)/事故发生可能造成的后果(C)" prop="anonymous">
                            <el-radio v-model="preserveData.trMethod" label='1' title="可能性(F)/严重性(C)">FC</el-radio>
                            <el-radio v-model="preserveData.trMethod" label='2' title="事故发生可能性(F)/人员暴露于危险环境中频繁程度(E)/事故发生可能造成的后果(C)">LEC</el-radio>
                        </el-form-item>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.trMethod === '1'">
                        <el-form-item label="可能性(F)" prop="trF">
                            <el-select v-model="preserveData.trF" @focus="possibilityAction">
                                <el-option v-for="(item, index) in FCLEC.FCfData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                                    <span style="float: left">{{ item.grade }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.trMethod === '1'">
                        <el-form-item label="严重性(C)" prop="trC">
                            <el-select v-model="preserveData.trC" @focus="ponderanceAction">
                                <el-option v-for="(item, index) in FCLEC.FCcData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                                    <span style="float: left">{{ item.grade }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.trMethod === '2'">
                        <el-form-item label="L" title="事故发生可能性(L)" prop="trL">
                            <el-select v-model="preserveData.trL" @focus="LAction">
                                <el-option v-for="(item, index) in FCLEC.LEClData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                                    <span style="float: left">{{ item.grade }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.trMethod === '2'">
                        <el-form-item label="E" title="人员暴露于危险环境中频繁程度(E)" prop="trE">
                            <el-select v-model="preserveData.trE" @focus="EAction">
                                <el-option v-for="(item, index) in FCLEC.LECeData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                                    <span style="float: left">{{ item.grade }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.trMethod === '2'">
                        <el-form-item label="C" title="事故发生可能造成的后果(C)" prop="trCl">
                            <el-select v-model="preserveData.trCl" @focus="CAction">
                                <el-option v-for="(item, index) in FCLEC.LECcData" :key="index" :label="item.grade" :value="Number(item.refValue)">
                                    <span style="float: left">{{ item.grade }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.refValue }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.trMethod === '2'"></div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <el-form-item label="威胁预警等级" prop="trWarningGrade">
                            <el-select v-model="preserveData.trWarningGrade">
                                <el-option v-for="(item, index) in ALL_SELECT_DATA.THREATEN_LEVEL.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <el-form-item label="预警时间" prop="trWarningtime">
                            <el-date-picker
                                style="width: 100%;"
                                v-model="trWarningTime"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions2"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                </div>
            </b-card-body>
        </b-card>
        <!-- 附件上传 -->
        <security-notice-adjunct ref='adjunct'></security-notice-adjunct>
        <b-card no-body>
            <b-card-body>
                <div style="text-align: center;">
                <el-button size='small' type="primary" @click="preserveAction('preserveData')"
                    v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
                <el-button size='small' @click="gobackAction">返回</el-button>
                </div>
            </b-card-body>
        </b-card>
    </el-form>
  </div>
</template>
<script>
import Vuex from 'Vuex'
import axios from 'axios'
// 附件上传
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
import { getSelectUserAllAction } from '../../services/information_report'
import { formatDate } from '../../utils/index.js'

export default {
    components: {
        SecurityNoticeAdjunct
    },
    data () {
        return {
            preserveData: {
                // 填写人
                trCreatebyName: '',
                // 填写人ID
                trCreateby: '',
                // 填写部门
                trDeptName: '',
                // 填写部门ID
                trDept: '',
                // 填写日期
                trCreateTime: formatDate(new Date(), 'yyyy-MM-dd'),
                // 报告人
                trReportorName: '',
                // 报告人ID
                trReportor: '',
                // 报告日期
                trReportorDate: formatDate(new Date(), 'yyyy-MM-dd'),
                // 标题
                trTitle: '',
                // 联系电话
                trPhone: '',
                // 威胁信息来源
                trKind: '',
                // 信息类型
                trCategory: '',
                // 信息的可信度
                trIscredible: '',
                // 收到威胁的日期
                trAcceptDate: '',
                // 威胁的形式
                trWays: '',
                // 是否涉及航空器
                trIsRelAircraft: 'true',
                // 航班日期
                trFlightDate: '',
                // 航班号
                trFlightNumber: '',
                // 机型
                trAirType: '',
                // 航段
                trPhase: '',
                // 机号
                trAirNumber: '',
                // 机组成员
                trMembers: '',
                // 受威胁的对象
                trDesc1: '',
                // 可能采用的破坏手段
                trDesc2: '',
                // 可能造成的损害
                trDesc3: '',
                // 威胁发出者的要求
                trDesc4: '',
                // 报告编号
                // trNumber: 0,
                // 发生日期
                // trOccureDate: formatDate(new Date(), 'yyyy-MM-dd'),
                // 发生地点
                // trOccureAddress: '',
                // 区分是威胁信息报告(0)还是威胁评估报告(1)
                trType: 1,
                // FC/LEC
                trMethod: '1',
                trF: '',
                trC: '',
                trL: '',
                trE: '',
                trCl: '',
                // 威胁预警等级
                trWarningGrade: ''
            },
            // 威胁预警日期
            trWarningTime: null,
            // loading
            fullscreenLoading: false,
            // 时间控件
            pickerOptions1: {
                shortcuts: [{
                    text: '今天',
                    onClick (picker) {
                        picker.$emit('pick', new Date())
                    }
                }, {
                    text: '昨天',
                    onClick (picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24)
                        picker.$emit('pick', date)
                    }
                }, {
                    text: '一周前',
                    onClick (picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }],
                // 限制日期不能选择之后的
                disabledDate (time) {
                    return time.getTime() > Date.now() - 8.64e6
                }
            },
            rules: {
                trTitle: [
                    { required: true, message: '请填写标题', trigger: 'blur' }
                ],
                trPhone: [
                    { required: true, message: '请填写联系电话', trigger: 'blur' }
                ],
                trKind: [
                    { required: true, message: '请选择威胁信息来源', trigger: 'change' }
                ],
                trCategory: [
                    { required: true, message: '请选择信息类型', trigger: 'change' }
                ],
                trIscredible: [
                    { required: true, message: '请选择信息的可信度', trigger: 'change' }
                ],
                trAcceptDate: [
                    { required: true, message: '请选择收到威胁的日期', trigger: 'change' }
                ],
                trWays: [
                    { required: true, message: '请选择威胁的形式', trigger: 'change' }
                ],
                trIsRelAircraft: [
                    { required: true, message: '是否涉及航空器', trigger: 'change' }
                ],
                trFlightDate: [
                    { required: true, message: '请选择航班日期', trigger: 'blur' }
                ],
                trAirNumber: [
                    { required: true, message: '飞机号不能为空', trigger: 'change' }
                ],
                trPhase: [
                    { required: true, message: '航段不能为空', trigger: 'change' }
                ],
                trDesc1: [
                    { required: true, message: '请填写受威胁的对象', trigger: 'blur' }
                ],
                trDesc2: [
                    { required: true, message: '请填写可能采用的破坏手段', trigger: 'blur' }
                ],
                trDesc3: [
                    { required: true, message: '请填写可能造成的损害', trigger: 'blur' }
                ],
                trDesc4: [
                    { required: true, message: '请填写威胁发出者的要求', trigger: 'blur' }
                ]
            },
            // 航班号
            planData: [],
            // 航段
            flightLegData: [],
            // FC/LEC下拉框数据
            FCLEC: {
                FCfData: [],
                FCcData: [],
                LEClData: [],
                LECeData: [],
                LECcData: []
            },
            // 时间数据
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一天',
                    onClick (picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24)
                    picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三天',
                    onClick (picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
                    picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一周',
                    onClick (picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
                    picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一月',
                    onClick (picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                    picker.$emit('pick', [start, end])
                    }
                }]
            },
            options4: [],
            loading: false
        }
    },
    computed: {
      ...Vuex.mapState(["ALL_SELECT_DATA"])
    },
    methods: {
        // 报告人
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true
                axios.get('/api/system/user/search?userNo=' + query).then(result=>{
                this.loading = false
                    if(result.data&&result.data.error===0&&result.data.data){
                    //   this.list =result.data.data
                        this.options4 = result.data.data
                    }
                }).catch(error=>{
                this.loading = false  
                console.log(error)
                })

            } else {
                this.options4 = [];
            }
        },
        // 验证报告人是否匹配所有用户,如果不是的话所在部门为空(@blur)
        verifyReportHandler () {
            let data = this.options4
            for (var item in data) {
                if (data[item].userId === this.preserveData.trReportor) {
                    this.preserveData.trReportor = data[item].userId
                    this.preserveData.trReportorName = data[item].userName
                    // 联系电话联系电话
                    this.preserveData.trPhone = data[item].userPhone
                }
            }
        },
        // 保存
        preserveAction (preserveData) {
            this.$refs[preserveData].validate((valid) => {
                if (valid) {
                    let obj = {}
                    // 附件信息
                    obj.attachments = this.$refs.adjunct.fileFormList
                    obj.treportDO = this.preserveData
                    obj.treportDO.id = 0
                    obj.treportDO.trWarningEtime =  this.trWarningTime ? this.trWarningTime[1] : ""
                    obj.treportDO.trWarningStime = this.trWarningTime ? this.trWarningTime[0] : ""
                    // 开启loading
                    this.fullscreenLoading = true
                    axios.post('/api/treport/saves', obj).then(result => {
                        // console.log(result)
                        // 关闭loading
                        this.fullscreenLoading = false
                        if (result.data.data && result.data.error === 0) {
                            this.$message({
                                type: 'success',
                                message: '保存成功'
                            })
                            // 返回到列表页面
                            this.gobackAction()
                        } else {
                            this.$message({
                                type: 'error',
                                message: '保存失败' + result.data.message
                            })
                        }
                    })
                        .catch(error => {
                            // 关闭loading
                            this.fullscreenLoading = false
                            this.$message({
                                type: 'error',
                                message: '保存失败' + error
                            })
                        })
                } else {
                    this.$message({
                        type: 'info',
                        message: '请完善页面信息'
                    })
                    return false;
                }
            });
        },
        // 返回
        gobackAction () {
            this.$router.back()
        },
        // 点击航班日期获取到飞机号
        flightDateAction () {
            this.preserveData.trMembers = ''
            this.preserveData.trAirType = ''
            this.preserveData.trAirNumber = ''
            this.preserveData.trPhase = ''
            let trFlightDate = this.preserveData.trFlightDate
            axios.get('/api/third/foc/' + trFlightDate)
                .then(response => {
                    // console.log(response, '日期')
                    if (response.data.error === 0) {
                        // console.log(response.data)
                        var hash = {};
                        this.planData = response.data.data.reduce(function (item, next) {
                            hash[next['aircraftno']] ? '' : hash[next['aircraftno']] = true && item.push(next);
                            return item;
                        }, [])
                        // this.planData = response.data.data
                    }
                })
                .catch(error => { console.log(error) })
        },
        // 点击飞机号获取航段
        datalist () {
            this.preserveData.trMembers = ''
            this.preserveData.trAirType = ''
            this.preserveData.trPhase = ''
            let trFlightDate = this.preserveData.trFlightDate
                let trAirNumber = this.preserveData.trAirNumber
                axios.get('/api/third/foc/' + trFlightDate + '?' + 'aircraftNo=' + trAirNumber)
                .then(response => {
                    // console.log(response, '飞机号')
                    if (response.data.error === 0) {
                        response.data.data.map(item => {
                            let depAirportCN = item.depAirportCN ? item.depAirportCN : item.depCode
                            let arrivalAirportCN = item.arrivalAirportCN ? item.arrivalAirportCN : item.arrivalCode
                            this.flightLegData.push({
                                name: depAirportCN + '-' + arrivalAirportCN,
                                code: item.depCode + '-' + item.arrivalCode
                            })
                        })
                    }
                })
                .catch(error => { console.log(error) })
        },
        // 点击航段获取到机型和机组成员
        legAction () {
            let trPhase = this.preserveData.trPhase
            let trFlightDate = this.preserveData.trFlightDate
            let trAirNumber = this.preserveData.trAirNumber
            axios.get('/api/third/foc/' + trFlightDate + '?' + 'aircraftNo=' + trAirNumber + '&' + 'legcf=' + trPhase)
                .then(response => {
                    // console.log(response, '航段')
                    if (response.data.error === 0) {
                        if (response.data.data.length > 0) {
                            response.data.data.map(item => {
                                this.preserveData.trAirType = item.acType
                                // 判断数据是否为null或者undefined
                                if (item.picValue === null && item.sicValue === null && item.cValue === undefined) {
                                    this.preserveData.trMembers = '暂无数据'
                                } else if (item.sicValue === null && item.sicValue === null) {
                                    this.preserveData.trMembers = item.picValue
                                } else if (item.picValue === null && item.cValue === null) {
                                    this.preserveData.trMembers = item.sicValue
                                } else if (item.picValue === null && item.sicValue === null) {
                                    this.preserveData.trMembers = item.cValue
                                } else if (item.cValue === undefined) {
                                    this.preserveData.trMembers = item.picValue + '、' + item.sicValue
                                } else if (item.sicValue === null) {
                                    this.preserveData.trMembers = item.picValue + '、' + item.cValue
                                } else if (item.picValue === null) {
                                    this.preserveData.trMembers = item.sicValue + '、' + item.cValue
                                } else {
                                    this.preserveData.trMembers = item.picValue + '、' + item.sicValue + '、' + item.cValue
                                }
                            })
                        } else {
                            this.preserveData.trAirType = '暂无数据'
                            this.preserveData.trMembers = '暂无数据'
                        }
                        
                    }
                })
                .catch(error => { console.log(error) })
        },
        // 当飞机号的input框获取焦点时触发
        inputAction1 () {
            if (this.preserveData.trFlightDate === '') {
                this.$message({
                    type: 'info',
                    message: '请先填写航班日期'
                })
            } else {
                return
            }
        },
        // 当航段的input框获取焦点时触发
        inputAction2 () {
            if (this.preserveData.trFlightDate === '') {
                this.$message({
                    type: 'info',
                    message: '请先填写航班日期'
                })
            } else if (this.preserveData.trAirNumber === '') {
                this.$message({
                    type: 'info',
                    message: '请先填写飞机号'
                })
            } else {
                return
            }
        },
        // FC/LEC处理
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
        },
        // C-----w2
        ponderanceAction () {
            let index = 2
            this.FCLEC.FCcData = this.getFcLecDate(index)
        },
        // L-----4
        LAction () {
            let index = 4
            this.FCLEC.LEClData = this.getFcLecDate(index)
        },
        // E-----5
        EAction () {
            let index = 5
            this.FCLEC.LECeData = this.getFcLecDate(index)
        },
        // C-----6
        CAction () {
            let index = 6
            this.FCLEC.LECcData = this.getFcLecDate(index)
        },
    },
    mounted () {
        // console.log(this.$store.state.user)
        let user = this.$store.state.user
        // 部门ID和部门名称
        this.preserveData.trDept = user.deptId
        this.preserveData.trDeptName = user.deptName
        // 用户ID和名字
        this.preserveData.trCreateby = user.userId
        this.preserveData.trCreatebyName = user.userName
    }
}
</script>