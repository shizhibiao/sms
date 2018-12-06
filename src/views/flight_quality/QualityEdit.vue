<template>
  <div class="animated fadeIn">
   <el-form :model="QAR" label-width="120px" :rules="rules" ref="QAR" status-icon :inline-message="true" size="medium">
     <b-card no-body>
       <b-card-header>基本信息</b-card-header>
        <b-card-body>
            <div class="row">
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="报告人:">{{QAR.reporterName}}</el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="报告部门:">{{QAR.reportDeptName}}</el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="报告日期:">{{QAR.reportDate}}</el-form-item>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="QAR.title" placeholder="" style="width: 100%"></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="发生日期">
                        <el-date-picker   style="width:100%" v-model="QAR.occurDate"
                            type="date"
                            placeholder="发生日期" >
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="航班日期">
                    <el-date-picker
                    v-model="QAR.flightDate"
                    type="date"
                    style="width:100%"
                    @change="btnlist"
                   value-format="yyyy-MM-dd"
                   placeholder="航班日期">
                    </el-date-picker>
                </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="飞机号" prop="airNumber">
                    <el-select v-model="QAR.airNumber" @change="datalist"  style="width:100%" :disabled='num === 0'>
                    <el-option
                      v-for="(item, index) in planData" :key="index" :label="item.aircraftno" :value="item.aircraftno"></el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="航段">
                    <el-select v-model="QAR.flightLeg"  @change="flightLeglist" value-key="name"  style="width:100%" :disabled='nums === 0'>
                    <el-option v-for="(item, index) in flightLegData" :key="index" :label="item.name" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="机型">
                        <el-input disabled v-model="QAR.acType" placeholder=""></el-input>
                    </el-form-item>
                </div>
                 <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="机组成员">
                        <el-input disabled v-model="QAR.flightCrew" placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12" v-if="zero === 0">
                    <el-form-item label="飞行阶段(QAR)">
                        <el-select v-model="QAR.flightPhaseQar" style="width:100%">
                        <el-option v-for="(item, index) in responsess" :key="index" :label="item.stateName" :value="item.stateName"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                 <div class="col-lg-6 col-md-6 col-sm-12" v-if="one === 1">
                    <el-form-item label="飞行阶段(QAR)">
                        <el-input disabled v-model="QAR.flightPhaseQar" placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12" v-if="one === 1">
                  <el-form-item label="事件等级" prop="eventGrade">
                        <el-input :disabled=ishow v-model="QAR.eventGrade" placeholder=""></el-input>
                    </el-form-item>
                 </div>
                 <div class="col-lg-6 col-md-6 col-sm-12" v-if="zero === 0">
                    <el-form-item label="事件等级">
                        <el-select v-model="QAR.eventGrade" style="width:100%">
                        <el-option v-for="(item, index) in eventlevel" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                 <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="主操纵" prop="pm">
                       <el-input v-model="QAR.pm" placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="主操纵技术等级" prop="pmTechLevel">
                       <el-input v-model="QAR.pmTechLevel" placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="辅助操纵" prop="pf">
                       <el-input v-model="QAR.pf" placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="辅操纵技术等级" prop="pfTechLevel">
                       <el-input v-model="QAR.pfTechLevel" placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <el-form-item label="光照条件">
                    <el-select v-model="QAR.lightCondition" >
                      <el-option v-for="(item, index) in LIGHT_CONDITION" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </div>


                <div class="col-lg-6 col-md-6 col-sm-12">
                  <el-form-item label="气象条件">
                    <el-select v-model="QAR.weatherCondition">
                      <el-option v-for="(item, index) in WEATHER_CONDITION" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <el-form-item label="航空器损坏">
                    <el-select v-model="QAR.aircraftDamage">
                      <el-option v-for="(item, index) in AIRCRAFT_DAMAGE" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <el-form-item label="事件类型" class="">
                    <el-select v-model="QAR.eventType">
                      <el-option v-for="(item, index) in EVENT_TYEP" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <el-form-item label="航班延误情况" >
                    <el-select v-model="QAR.flightDelay">
                      <el-option v-for="(item, index) in FLIGHT_DELAY" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <el-form-item label="飞行性质" >
                    <el-select v-model="QAR.flightName">
                      <el-option v-for="(item, index) in FLIGHT_PURPOSE" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </div>


                <div class="col-lg-12 col-md-12 col-sm-12" >
                    <el-form-item label="飞行员反映情况" prop="eventDesc">
                        <el-input
                        type="textarea"
                        v-model="QAR.eventDesc" style="width: 100%">
                        </el-input>
                    </el-form-item>
                </div>
            </div>
        </b-card-body>
     </b-card>
     <security-notice-adjunct ref='adjunct'></security-notice-adjunct>
      <b-card no-body v-if="ishows">
             <b-card-header>超限事件
               <div class="float-right" >
                    <el-button @click="newlyadded" v-if="!onShow" size='small' type="success">新 增</el-button>
                    <el-button @click="newlyaddeds" v-if="onShow"  size='small' type="success">新 增</el-button>
                  </div>
             </b-card-header>
              <el-form :model="queryParams" label-width="120px" >
             <b-card-body>
                 <el-table
                    :stripe="true"
                    :data="formlist"
                    size='small'
                    :highlight-current-row ="true"
                    style="width: 100%">
                    <el-table-column label='#'  width='60px'>
                        <template slot-scope="scope">
                            {{scope.$index + 1}}
                        </template>
                    </el-table-column>
                     <el-table-column
                        label="事件编号"
                        prop="eventNo">
                    </el-table-column>
                     <el-table-column
                        label="事件名称"
                        prop="eventName">
                    </el-table-column>
                     <el-table-column
                        label="事件峰值"
                        prop="peakValue">
                    </el-table-column>
                     <!-- <el-table-column
                        label="QAR超限等级"
                         prop="eventNo">
                    </el-table-column> -->
                    <el-table-column
                        label="操作" >
                          <template slot-scope="scope">
                          <el-button @click="tabledelete(scope.$index, formlist)" size='small' :disabled='scope.$index === 0 && ishow' type="danger">移 除</el-button>
                        </template>
                    </el-table-column>
                 </el-table>
             </b-card-body>
            </el-form>
        </b-card>
      <b-card no-body>
          <b-card-body>
            <el-steps :active="0" align-center style="margin-top:40px">
              <el-step title="新建"></el-step>
              <el-step title="立项核准" description='安技部-部门管理团队'></el-step>
              <el-step title="调查方案" description='安技部-安全管理经理'></el-step>
              <el-step title="调查情况" description='安技部-安全监察组'></el-step>
              <el-step title="验证核准" description='安技部-安全管理经理'></el-step>
              <el-step title="处理改进" description='安技部-部门管理团'></el-step>
              <el-step title="结束"></el-step>
            </el-steps>
            <div class="text-center">
              <el-button @click="preservation" size='small' :disabled="qarstate === 1" type="primary">保 存</el-button>
              <el-button @click="sendout" size='small' v-loading.fullscreen.lock="fullscreenLoading" :disabled="qarstate === 0"  type="success">发 送</el-button>
              <el-button @click="goback" size='small' >返 回</el-button>
            </div>
          </b-card-body>
        </b-card>
        <el-dialog title="超限事件" :visible.sync="classification">
          <el-form :model="causeclassification"  ref="causeclassification">
            <div class="row">
              <div class="col">
                   <el-form-item label="事件编号" :label-width="formLabelWidth"  prop="eventCode">
                      <el-select v-model="causeclassification.eventCode" style="width:100%" @change="newevents" >
                      <el-option v-for="(item, index) in planDatas"
                      :key="index" :label="item.eventCode" :value='item.id'></el-option>
                    </el-select>
                  </el-form-item>
              </div>
              <div class="col">
                   <el-form-item label="事件名称" :label-width="formLabelWidth"  prop="eventName">
                     <el-input v-model="causeclassification.eventName" disabled placeholder=""></el-input>
                  </el-form-item>
              </div>
            </div>
             <div class="row">
              <div class="col">
                   <el-form-item label="事件峰值" :label-width="formLabelWidth" prop="peakValue">
                      <el-input v-model="causeclassification.peakValue" disabled placeholder=""></el-input>
                  </el-form-item>
              </div>
              <div class="col">
                   <el-form-item label="QAR超限等级" :label-width="formLabelWidth"  prop="eventNo">
                     <el-input v-model="causeclassification.eventNo" disabled placeholder=""></el-input>
                  </el-form-item>
              </div>
            </div>
            
          </el-form>
          
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size='mini' @click="Preservation('causeclassification')">保 存</el-button>
            <el-button type="success" size='mini' @click="classificationslists('causeclassification')">关闭</el-button>
          </div>
        </el-dialog>
   </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import { formatDate } from '../../utils/index.js'
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
export default {
  components: { SecurityNoticeAdjunct },
  data () {
    return {
      tdAirport: '',
      toAirport: '',
      num: 1,
      nums:1,
      ishows: true,
      ishow: true,
      flightLegData: [],
      QAR: {
        lightCondition: '',
        eventType: '',
        aircraftDamage: '1',
        weatherCondition: '',
        flightDelay: '1',
        flightName: '',
        //  报告人
        //  majorType: 0,
        reporterName: '',
        //  id
        reporter: this.$store.state.user.userId,
        //  报告部门
        reportDeptName: '',
        //  id
        reportDept: this.$store.state.user.deptId,
        //  报告日期
        reportDate: '',
        title: '',
        //  发生日期
        occurDate: '',
        //  航班日期
        flightDate: '',
        //  机型
        airNumber: '',
        //  航段
        flightLeg: '',
        //  机型
        acType: '',
        //  机组成员
        flightCrew: '',
        //  飞行阶段foc
        //  flightPhaseFoc: '',
        //  飞行阶段QAR
        flightPhaseQar: '',
        //  主操作
        pm: '',
        //  公司技术等级
        pmTechLevel: '',
        //  辅助操纵
        pf: '',
        //  公司技术等级
        pfTechLevel: '',
        //  飞行员反应情况
        eventDesc: '',
        listQarDetail: [],
        ids: '',
        attachmentDOList: [],
        qarEventId: [],
        eventGrade: ''
      },
      rules: {
        title: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {max: 200, min:2, message: '长度在 2 到 200 个字符', trigger: 'blur'}
        ],
        pm: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {max: 60, min:2, message: '长度在 2 到 60 个字符', trigger: 'blur'}
        ],
        pmTechLevel: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {max: 20, min:2, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        pf: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {max: 60, min:2, message: '长度在 2 到 60 个字符', trigger: 'blur'}
        ],
        pfTechLevel: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {max: 20, min:2, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        eventDesc: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {max: 500, min:2, message: '长度在 2 到 500 个字符', trigger: 'blur'}
        ],
        airNumber: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]
      },
      statuss: [],
      planData: [],
      planDatas: [],
      qarstate: 0,
      queryParams: {},
      formlist: [],
      classification: false,
      causeclassification: {
        eventNo: null,
        eventName: '',
        peakValue: '',
        eventCode: ''
      },
      formLabelWidth: '120px',
      objlist: {},
      id: null,
      ids: [],
      onShow: false,
      fullscreenLoading: false,
      legstutass: [],
      zero: 1,
      one: 0,
      responsess: [],
      reportNumber: 0,
      ishow: true,
      deleid: [],
      eventlevel: [
        {
          name: 'Critical'
        },
        {
          name: 'Major'
        },
        {
          name: 'Minor'
        }
      ],
      LIGHT_CONDITION: this.$store.state.ALL_SELECT_DATA.LIGHT_CONDITION.dicts,
      WEATHER_CONDITION: this.$store.state.ALL_SELECT_DATA.WEATHER_CONDITION.dicts,
      AIRCRAFT_DAMAGE: this.$store.state.ALL_SELECT_DATA.AIRCRAFT_DAMAGE.dicts,
      EVENT_TYEP: this.$store.state.ALL_SELECT_DATA.EVENT_TYEP.dicts,
      FLIGHT_DELAY: this.$store.state.ALL_SELECT_DATA.FLIGHT_DELAY.dicts,
      FLIGHT_PURPOSE: this.$store.state.ALL_SELECT_DATA.FLIGHT_PURPOSE.dicts
    }
  },
  methods: {
    btnlist () {
      this.num = 1
      this.QAR.flightLeg = ''
      this.QAR.flightCrew = ''
      this.QAR.acType = ''
      this.QAR.airNumber = ''
      this.planData = []
      this.flightLegData = []
      let flightDate = this.QAR.flightDate
      axios.get('/api/third/foc/' + flightDate)
        .then(response => {
          if (response.data.error === 0) {
            let arr = []
            response.data.data.map(item => {
              if (arr.indexOf(item.aircraftno) === -1) {
                arr.push(
                  item.aircraftno
                )
              }
            })
            arr.map(item =>{
              this.planData.push({
                aircraftno: item
              })
            })
          }
        })
    },
    datalist () {
      this.nums = 1
      this.QAR.flightLeg = ''
      this.QAR.flightCrew = ''
      this.QAR.acType = ''
      if (this.QAR.flightDate === '') {
        this.$message({
          type: 'error',
          message: '请先填写航班日期'
        })
      } else {
        let flightDate = this.QAR.flightDate
        let airNumber = this.QAR.airNumber
        axios.get('/api/third/foc/' + flightDate + '?' + 'aircraftNo=' + airNumber)
          .then(response => {
            if (response.data.error === 0) {
              response.data.data.map(item => {
                if (item.depAirportCN !== ''  || item.arrivalAirportCN !== '') {
                  this.flightLegData.push({
                    name: item.depAirportCN + '-' + item.arrivalAirportCN,
                    code: item.depCode + '-' + item.arrivalCode
                  })
                } else {
                  this.flightLegData.push({
                    name: item.depAirportEN + '-' + item.arrivalAirportEN,
                    code: item.depCode + '-' + item.arrivalCode
                  })
                }
              })
            }
          })
      }
    },
    flightLeglist () {
      let flightLeg = this.QAR.flightLeg.code
      let flightDate = this.QAR.flightDate
      let airNumber = this.QAR.airNumber
      this.QAR.flightLeg = this.QAR.flightLeg.name
      if (this.QAR.flightDate === '' || this.QAR.airNumber === '') {
        this.$message({
          type: 'error',
          message: '请先填写航班日期和飞机号'
        })
        this.QAR.flightLeg = ''
      } else {
        axios.get('/api/third/foc/' + flightDate + '?' + 'aircraftNo=' + airNumber + '&' + 'legcf=' + flightLeg)
          .then(response => {
            if (response.data.error === 0) {
              response.data.data.map(item => {
                this.QAR.acType = item.acType
                // 判断数据是否为null或者undefined
                if (item.picValue === null && item.sicValue === null && item.cValue === undefined) {
                  //  this.QAR.flightCrew = '暂无数据'
                } else if (item.sicValue === null && item.sicValue === null) {
                  this.QAR.flightCrew = item.picValue
                  this.QAR.pm = item.picValue
                  this.QAR.pf = item.sicValue
                } else if (item.picValue === null && item.cValue === null) {
                  this.QAR.flightCrew = item.sicValue
                  this.QAR.pm = item.picValue
                  this.QAR.pf = item.sicValue
                } else if (item.picValue === null && item.sicValue === null) {
                  this.QAR.flightCrew = item.cValue
                  this.QAR.pm = item.picValue
                  this.QAR.pf = item.sicValue
                } else if (item.cValue === undefined) {
                  this.QAR.flightCrew = item.picValue + '、' + item.sicValue
                  this.QAR.pm = item.picValue
                  this.QAR.pf = item.sicValue
                } else if (item.sicValue === null) {
                  this.QAR.flightCrew = item.picValue + '、' + item.cValue
                  this.QAR.pm = item.picValue
                  this.QAR.pf = item.sicValue
                } else if (item.picValue === null) {
                  this.QAR.flightCrew = item.sicValue + '、' + item.cValue
                  this.QAR.pm = item.picValue
                  this.QAR.pf = item.sicValue
                } else {
                  this.QAR.flightCrew = item.picValue + '、' + item.sicValue + '、' + item.cValue
                  this.QAR.pm = item.picValue
                  this.QAR.pf = item.sicValue
                }
              })
            }
          })
      }
    },
    goback () { this.$router.push({ path: '/qar/list' }) },
    preservation () {
      let array = this.formlist.map(item => {
        return item.id
      })
      this.QAR.ids = array.join(',')
      this.QAR.attachmentDOList = this.$refs.adjunct.fileFormList
      this.QAR.listQarDetail = this.formlist
      if (this.$route.params.id === '0') {
        if (this.QAR.title=== '' || !(this.QAR.title.length >= 2 && this.QAR.title.length <= 200)) {
          this.$message.error('请填写标题')
        } else if (this.QAR.occurDate === '') {
          this.$message.error('请先选择发生日期')
        } else if (this.QAR.flightDate === '') {
          this.$message.error('请先选择航班日期')
        } else if (this.QAR.airNumber === '') {
          this.$message.error('请先选择飞机号')
        } else if (this.QAR.flightLeg === '') {
          this.$message.error('请先选择航段')
        } else if (this.QAR.pm === '' || !(this.QAR.pm.length >= 2 && this.QAR.pm.length <= 60)) {
          this.$message.error('请先填写主操纵')
        } else if (this.QAR.pmTechLevel === '' || !(this.QAR.pmTechLevel.length >= 2 && this.QAR.pmTechLevel.length <= 20)) {
          this.$message.error('请先填写主操纵技术等级')
        } else if (this.QAR.pf === '' || !(this.QAR.pf.length >= 2 && this.QAR.pf.length <= 60)) {
          this.$message.error('请先填写辅助操纵')
        } else if (this.QAR.pfTechLevel === '' || !(this.QAR.pfTechLevel.length >= 2 && this.QAR.pfTechLevel.length <= 20)) {
          this.$message.error('请先填写辅助操纵技术等级')
        } else if (this.QAR.eventDesc === '' || !(this.QAR.eventDesc.length >= 2 && this.QAR.eventDesc.length <= 500)) {
          this.$message.error('请先填写飞行员反映情况')
        } else if (this.QAR.eventGrade === '') {
          this.$message.error('请先填写事件等级')
        } else if (this.QAR.lightCondition === '') {
          this.$message.error('请先选择光照条件')
        } else if (this.QAR.weatherCondition === '') {
          this.$message.error('请先选择气象条件')
        } else if (this.QAR.aircraftDamage === '') {
          this.$message.error('请先选择航空器损坏')
        } else if (this.QAR.eventType === '') {
          this.$message.error('请先选择事件类型')
        } else if (this.QAR.flightDelay === '') {
          this.$message.error('请先选择航班延误情况')
        } else if (this.QAR.flightName === '') {
          this.$message.error('请先选择飞行性质')
        } else {
          this.QAR.listQarDetail = this.formlist
          axios.post('/api/qar/event/addQarEvent', this.QAR)
            .then(res => {
              if (res.data.error === 0) {
                this.reportNumber = res.data.data.reportNumber
                this.$message.success('保存成功')
                this.$refs.adjunct.isShow = false
                this.qarstate = 1
              } else {
                this.$message.warning('保存失败' + res.data.message)
              }
            })
        }
      } else {
        if (this.QAR.pm === '' || !(this.QAR.pm.length >= 2 && this.QAR.pm.length <= 60)) {
          this.$message.error('请先填写主操纵')
        } else if (this.QAR.pmTechLevel === '' || !(this.QAR.pmTechLevel.length >= 2 && this.QAR.pmTechLevel.length <= 20)) {
          this.$message.error('请先填写主操纵技术等级')
        } else if (this.QAR.pf === '' || !(this.QAR.pf.length >= 2 && this.QAR.pf.length <= 60)) {
          this.$message.error('请先填写辅助操纵')
        } else if (this.QAR.pfTechLevel === '' || !(this.QAR.pfTechLevel.length >= 2 && this.QAR.pfTechLevel.length <= 20)) {
          this.$message.error('请先填写辅助操纵技术等级')
        } else if (this.QAR.eventDesc === '' || !(this.QAR.eventDesc.length >= 2 && this.QAR.eventDesc.length <= 500)) {
          this.$message.error('请先填写飞行员反映情况')
        } else if (this.QAR.eventGrade === '') {
          this.$message.error('请先填写事件等级')
        } else  if (this.QAR.lightCondition === '') {
          this.$message.error('请先选择光照条件')
        } else if (this.QAR.weatherCondition === '') {
          this.$message.error('请先选择气象条件')
        } else if (this.QAR.aircraftDamage === '') {
          this.$message.error('请先选择航空器损坏')
        } else if (this.QAR.eventType === '') {
          this.$message.error('请先选择事件类型')
        } else if (this.QAR.flightDelay === '') {
          this.$message.error('请先选择航班延误情况')
        } else if (this.QAR.flightName === '') {
          this.$message.error('请先选择飞行性质')
        } else {
          this.QAR.listQarDetail = this.formlist
          axios.post('/api/qar/event/addQarEvent', this.QAR)
            .then(res => {
              if (res.data.error === 0) {
                this.reportNumber = res.data.data.reportNumber
                this.$message.success('保存成功')
                this.$refs.adjunct.isShow = false
                this.qarstate = 1
              } else {
                this.$message.warning('保存失败' + res.data.message)
              }
            })
        }
      }
      
    },
    sendout () {
      this.fullscreenLoading = true
      axios.get('/api/qar/start/' + this.reportNumber + '/' + this.$store.state.user.userName)
        .then(res => {
          this.fullscreenLoading = false
          if (res.data.error === 0) {
            this.$message.success('发送成功')
            this.$router.push({ path: '/qar/list' })
          } else {
            this.$message.warning('发送失败' + res.data.message)
          }
        })
        .catch(error => {
          console.log(error)
          this.fullscreenLoading = false
          this.$message.error('网咯超时请检查网咯')
        })
    },
    tabledelete (index, rows) {
        rows.splice(index, 1)
      
    },
    newlyaddeds () {
      this.classification = true
      let arr = []
      this.formlist.map(item => {
        arr.push(item.id)
      })
      axios.post('/api/qar/event/listQarEventStart?' + 'id=' + arr + '&tdDatetime=' + this.QAR.flightDate + '&airNumber=' + this.QAR.airNumber + '&tdAirport=' + this.tdAirport + '&toAirport=' + this.toAirport)
        .then(res => {
          this.planDatas = res.data.data
          this.deleid = []
        })
    },
    newlyadded () {
      this.classification = true
      let arr = []
      this.formlist.map(item => {
        arr.push(item.id)
      })
      axios.post('/api/qar/event/listQarEventStart?' + 'id=' + arr + '&tdDatetime=' + this.QAR.flightDate + '&airNumber=' + this.QAR.airNumber + '&tdAirport=' + this.tdAirport + '&toAirport=' + this.toAirport)
        .then(res => {
          this.planDatas = res.data.data
        })
    },
    Preservation (causeclassification) {
      this.onShow = true
      if (this.causeclassification.eventCode === '') {
        this.$message.warning('请先选择事件编号')
      } else {
        this.formlist.push(this.objlist)
        this.classification = false
        this.$refs[causeclassification].resetFields()
      }
    },
    classificationslists (causeclassification) {
      this.classification = false
      this.$refs[causeclassification].resetFields()
    },
    newevents (id) {
      axios.post('/api/qar/event/listQarEventId?' + 'id=' + id)
        .then(res => {
          if (res.data.error === 0) {
            this.causeclassification.eventNo = res.data.data.eventCode
            this.causeclassification.eventName = res.data.data.eventName
            this.causeclassification.peakValue = res.data.data.eventValue
            let objlist = {}
            objlist.eventNo = res.data.data.eventCode
            objlist.eventName = res.data.data.eventName
            objlist.peakValue = res.data.data.eventValue
            objlist.id = res.data.data.id
            objlist.qarEventId = res.data.data.id
            this.objlist = objlist
            this.idi = res.data.data.id
          }
        })
    }
  },
  created () {
    this.QAR.reporterName = this.$store.state.user.userName
    this.QAR.reportDeptName = this.$store.state.user.deptName
    this.QAR.reportDate = formatDate(new Date(), 'yyyy-MM-dd')
    axios.get('/api/third/foc/selectfoc')
      .then(res => {
        this.legstutass = res.data.data
      })
    if (this.$route.params.id === '0') {
      this.ishow = false
      this.zero = 0
      this.ishow = false
      this.ishows = false
      this.num = 0
      this.nums = 0
      axios.get('/api/qar/event/listQars')
        .then(res => {
          if (res.data.error === 0) {
            this.responsess = res.data.data
          }
        })
    } else {
      this.ishow = true
      axios.post('/api/qar/event/listQarEventId?' + 'id=' + this.$route.params.id)
        .then(res => {
          if (res.data.error === 0) {
            this.one = 1
            this.QAR.title = res.data.data.eventName
            this.QAR.occurDate = res.data.data.toDatetime.split(' ')[0]
            this.QAR.flightPhaseQar = res.data.data.stateName
            this.QAR.airNumber = res.data.data.aircraft
            this.QAR.flightDate = res.data.data.tdDatetime.split(' ')[0]
            this.QAR.eventGrade = res.data.data.severity
            this.QAR.acType = res.data.data.aircraftType
            this.toAirport = res.data.data.toAirport
            this.tdAirport = res.data.data.tdAirport
            this.QAR.flightLeg = res.data.data.tdAirport + '-' + res.data.data.toAirport
            let obj = {}
            obj.qarEventId = res.data.data.id
            obj.eventNo = res.data.data.eventCode
            obj.eventName = res.data.data.eventName
            obj.peakValue = res.data.data.eventValue
            obj.id = res.data.data.id
            this.QAR.ids = res.data.data.id
            this.formlist.push(obj)
            this.QAR.listQarDetail = this.formlist
            this.ids.push(res.data.data.id)
            axios.get('/api/third/foc/' +  res.data.data.tdDatetime.split(' ')[0])
              .then(response => {
                if (response.data.error === 0) {
                  this.planData = response.data.data
                }
              })
            axios.get('/api/third/foc/' + this.QAR.flightDate + '?' + 'aircraftNo=' + this.QAR.airNumber + '&' + 'legcf=' + this.QAR.flightLeg)
              .then(response => {
                if (response.data.error === 0) {
                  response.data.data.map(item => {
                    this.QAR.acType = item.acType
                    // 判断数据是否为null或者undefined
                    if (item.picValue === null && item.sicValue === null && item.cValue === undefined) {
                      //  this.QAR.flightCrew = '暂无数据'
                    } else if (item.sicValue === null && item.sicValue === null) {
                      this.QAR.pm = item.picValue
                      this.QAR.pf = item.sicValue
                      this.QAR.flightCrew = item.picValue
                    } else if (item.picValue === null && item.cValue === null) {
                      this.QAR.flightCrew = item.sicValue
                      this.QAR.pm = item.picValue
                      this.QAR.pf = item.sicValue
                    } else if (item.picValue === null && item.sicValue === null) {
                      this.QAR.flightCrew = item.cValue
                      this.QAR.pm = item.picValue
                      this.QAR.pf = item.sicValue
                    } else if (item.cValue === undefined) {
                      this.QAR.flightCrew = item.picValue + '、' + item.sicValue
                      this.QAR.pm = item.picValue
                      this.QAR.pf = item.sicValue
                    } else if (item.sicValue === null) {
                      this.QAR.flightCrew = item.picValue + '、' + item.cValue
                      this.QAR.pm = item.picValue
                      this.QAR.pf = item.sicValue
                    } else if (item.picValue === null) {
                      this.QAR.flightCrew = item.sicValue + '、' + item.cValue
                      this.QAR.pm = item.picValue
                      this.QAR.pf = item.sicValue
                    } else {
                      this.QAR.flightCrew = item.picValue + '、' + item.sicValue + '、' + item.cValue
                      this.QAR.pm = item.picValue
                      this.QAR.pf = item.sicValue
                    }
                  })
                }
              })
          }
        })
    }

  }
}
</script>
