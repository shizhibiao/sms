<template>
    <div class="animated fadeIn">
      <el-form :model="eventDO" label-width="120px" :rules="rules" ref="eventDO" status-icon :inline-message="true" size="medium">
        <b-card no-body>
          <b-card-header>基本信息</b-card-header>
          <b-card-body>
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="事件来源">
                  {{eventDO.source}}
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="报告人">
                  {{eventDO.reporterName}}
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                 <el-form-item label="报告时间">
                   {{eventDO.createDate}}
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="所在部门">
                  {{eventDO.repDeptName}}
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
               <el-form-item label="联系电话">
                 {{eventDO.phone}}
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="发生时间">
                  <el-date-picker
                  style="width:100%"
                    v-model="eventDO.occurDate"
                    type="date"
                    placeholder="发生时间" >
                  </el-date-picker>
                </el-form-item>
              </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="发生地点" prop="occurAddress">
                      <el-input v-model="eventDO.occurAddress" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                  <el-form-item label="报告类型" v-show="showlist" prop="category">
                      <el-select v-model="eventDO.category">
                        <el-option  v-for="(item,index) in category"
                          :key="index"
                          :label="item.dictName"
                          :value="item.dictCode"></el-option>
                      </el-select>
                    </el-form-item>
                </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                  <el-form-item label="是否QAR分析" prop="qarNeeded">
                    <el-radio v-model="eventDO.qarNeeded" label='true'>是</el-radio>
                    <el-radio v-model="eventDO.qarNeeded" label='false'>否</el-radio>
                  </el-form-item>
              </div>
          </div>



            <el-form-item label="标题" prop="title">
              <!-- <el-input v-model="eventDO.title" placeholder="" style="width: 100%"></el-input> -->
              <el-input placeholder="请输入内容" v-model="eventDO.title" class="input-with-select">
                <el-select slot="prepend" v-model="suiselect"   placeholder="请选择" style="width:110px" @change="xuanze">
                  <el-option v-for="(item,index) in REPORT_Title" 
                  :key="index"
                  :label=item.dictCode
                  :value=item.dictName
                  >

                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>




              <el-form-item label="专业类型" v-model="radio2" prop="majorType">
              <el-radio v-model="eventDO.majorType"  :label=1  @click.native.prevent="clickitem(1)">飞行</el-radio>
              <el-radio v-model="eventDO.majorType"  :label=2 @click.native.prevent="clickitem(2)">地面</el-radio>
              <el-radio v-model="eventDO.majorType" :label=3 @click.native.prevent="clickitem(3)">安保</el-radio>
              <span v-if="init" style="color:red;padding-left:10px">{{initlei}}</span>
               </el-form-item >
          </b-card-body>
        </b-card>
            <Eventlistquery v-if=" 1 == radio2" ref="eventlist" :byData="groundList"/>
            <Eventground v-if="2 == radio2" ref="groundlists" :byData="groundList"/>
            <Eventsecurity v-if="3 == radio2" ref="curity" :byData="groundList"/>
        <security-notice-adjunct ref='adjunct'></security-notice-adjunct>
        <b-card no-body>
          <b-card-body>
            <el-steps :active="0" align-center style="margin-top:40px" v-if="sou === 0">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description="安技部-部门管理团队"></el-step>
                  <el-step title="调查方案" description="安技部-安全管理经理"></el-step>
                  <el-step title="调查情况" description="安技部-安全监察组"></el-step>
                  <el-step title="验证核准" description="安技部-安全管理经理"></el-step>
                  <el-step title="处理改进" description="安技部-部门管理团队"></el-step>
                  <el-step title="结束"></el-step>
                </el-steps>
                <el-steps :active="0"  align-center style="margin-top:40px" v-if="sou === 1">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description="部门管理团队（非安技部）"></el-step>
                  <el-step title="调查方案" description="SMS对接经理"></el-step>
                  <el-step title="调查情况" description="SMS对接成员"></el-step>
                  <el-step title="验证核准" description="SMS对接经理"></el-step>
                  <el-step title="处理改进" description="部门管理团队（非安技部）"></el-step>
                  <el-step title="结束"></el-step>
                </el-steps>
            <div class="text-center">
              <el-button type="success" size='small' :disabled="relGroundDevices === 'false'" @click="postindex('eventDO')">保存</el-button>
              <el-button type="primary" size='small' v-loading.fullscreen.lock="fullscreenLoading" :disabled="relGroundDevicess === 'true'" @click="Sendout" >发送</el-button>
              <el-button  size='small' @click="goback">返回</el-button>
            </div>
          </b-card-body>
        </b-card>
      </el-form>
  </div>
</template>
<script>
  import Eventlistquery from '../common/eventlistquery'
  import Eventground from '../common/eventground'
  import Eventsecurity from '../common/eventsecurity'
  import axios from 'axios'
  //  下拉框的接口
  import { getAllDataAction } from '../../services/information_report'
  //  部门的接口
  import { getDepartmentList } from '../../services/safety_supervision'
  import { formatDate } from '../../utils/index.js'
  import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
  export default {
    name: 'SecurityNoticeList',
    components: {
      Eventlistquery,
      Eventground,
      Eventsecurity,
      SecurityNoticeAdjunct
    },
    data () {
      return {
        REPORT_Title: [],
        suiselect: '',
        rules: {
          occurAddress: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 30, min:2, message: '长度在 2 到 30 个字符', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 200, min:2, message: '长度在 2 到 200 个字符', trigger: 'blur'}
          ]
        },
        relGroundDevices: 'true',
        relGroundDevicess: 'true',
        eventNumber: 0,
        showlist: true,
        fullscreenLoading: false,
        id: 0,
        //  新增上面的数据
        eventDO: {
          //  报告人ID
          reporter: 0,
          //  报告人名字
          reporterName: '',
          //  报告部门的id
          repDept: 0,
          //  所在部门
          repDeptName: '',
          //  报告日期
          createDate: '',
          //  手机号码
          phone: '',
          //  发生日期
          occurDate: '',
          //  标题
          title: '',
          //  发生地点
          occurAddress: '',
          //  是否开启QAR分析0-否 1-是
          qarNeeded: 'true',
          //  专业类型 1-飞行 2-地面 3-安保
          majorType: 1,
          //  报告类别
          category: null,
          //  事件类别
          source: 0,
          //  飞行里面的数据
          reportFlyDO: {},
          //  地面里面的数据
          reportGroundDO: {},
          //  安保里面的数据
          reportSecurityDO: {},
          //  附件上传
          attachmentDOList: []
        },
        groundList: {
          // 飞行性质
          FLIGHT_PURPOSE: {
            dicts: []
          },
          // 飞行阶段
          FLIGHT_STATUS: {
            dicts: []
          },
          // 气象条件
          WEATHER_CONDITION: {
            dicts: []
          },
          // 光照条件
          LIGHT_CONDITION: {
            dicts: []
          },
          // 事件类型
          EVENT_TYEP: {
            dicts: []
          },
          // 事件等级
          EVENT_LEVEL: {
            dicts: []
          },
          // 航班延误情况
          FLIGHT_DELAY: {
            dicts: []
          },
          // 原因分类
          REASON_TYEP: {
            dicts: []
          },
          // 航空器损坏
          AIRCRAFT_DAMAGE: {
            dicts: []
          },
          // 运行阶段
          RUNNING_STATUS: {
            dicts: []
          },
          // 车辆类型
          CAR_CATEGORY: {
            dicts: []
          },
          // 安保事件类别
          SECURITY_EVENT_TYPE: {
            dicts: []
          },
          // 安保事件类型1
          SECURITY_EVENT_TYPE1: {
            dicts: []
          },
          // 安保事件类型2
          SECURITY_EVENT_TYPE2: {
            dicts: []
          }
        },
        //  用户信息
        user: {},
        //  事件类型
        noticeLevelList: [{
          dictName: '新建',
          dictCode: 0
        },
        {
          dictName: '报告',
          dictCode: 1
        }],
        //  报告类型
        category: [],
        //  传去组件里的参数
        radio2: 1,
        initlei: '',
        init: true,
        pickerOptions1: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
      }
    },
    methods: {
      xuanze () {
        this.eventDO.title = this.suiselect
      },
      clickitem (e) {
        e === this.radio2 ? this.radio2 = e : this.radio2 = e
        if (e === 1) {
          this.$nextTick(function () {
            //  从子组件获取到的数据query
            this.eventDO.reportFlyDO = this.$refs.eventlist.operation
          })
        } else if (e === 2) {
          this.$nextTick(function () {
            this.eventDO.reportGroundDO = this.$refs.groundlists.operation
          })
        } else if (e === 3) {
          this.$nextTick(function () {
            this.eventDO.reportSecurityDO = this.$refs.curity.operation
          })
        }
        this.$nextTick(function () {
          this.init = false
          this.eventDO.majorType = e
        })
      },
      postindex (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.radio2 !== 1 || this.radio2 !== 2 || this.radio2 !== 3) {
                this.initlei = '请选择专业类型'
              }
              let data = this.$refs.adjunct.fileFormList
              this.eventDO.attachmentDOList = data
              if (this.eventDO.source === '新建') {
                this.eventDO.source = 0
              } else if (this.eventDO.source === '报告') {
                this.eventDO.source = 1
              }
              let eventReportFlyGroundSeVO = this.eventDO
              if (this.eventDO.occurAddress === '') {
                this.$message.error('发生地点不能为空')
              } else if (this.eventDO.title === '') {
                this.$message.error('请填写标题')
              } else if (this.eventDO.occurDate === '') {
                this.$message.error('请填写发生日期')
              } else {
                if (this.eventDO.majorType === 1) {
                  this.$refs.eventlist.validateForm()
                  this.eventDO.reportFlyDO = this.$refs.eventlist.operation
                  if (this.eventDO.reportFlyDO.flightDate === '') {
                    this.$message.error('请填写航班日期')
                  } else if (this.eventDO.reportFlyDO.airNumber === '') {
                    this.$message.error('请填写飞机号')
                  } else if (this.eventDO.reportFlyDO.flightLeg === '') {
                    this.$message.error('请填写航段')
                  } else if (this.eventDO.reportFlyDO.flightName === '') {
                    this.$message.error('请填写飞机性质')
                  } else if (this.eventDO.reportFlyDO.flightPhase === '') {
                    this.$message.error('请填写飞行阶段')
                  } else if (this.eventDO.reportFlyDO.weatherCondition === '') {
                    this.$message.error('请填写气象条件')
                  } else if (this.eventDO.reportFlyDO.lightCondition === '') {
                    this.$message.error('请填写光照条件')
                  } else if (this.eventDO.reportFlyDO.eventType === '') {
                    this.$message.error('请填写事件类型')
                  } else if (this.eventDO.reportFlyDO.eventGrade === '') {
                    this.$message.error('请填写事件等级')
                  } else if (this.eventDO.reportFlyDO.flightDelay === '') {
                    this.$message.error('请填写航班延误情况')
                  } else if (this.eventDO.reportFlyDO.causeType === '') {
                    this.$message.error('请填写原因分类')
                  } else if (this.eventDO.reportFlyDO.aircraftDamage === '') {
                    this.$message.error('请填写航空器损坏')
                  } else if (this.eventDO.reportFlyDO.eventDescription === '' || !(this.eventDO.reportFlyDO.eventDescription.length >= 2 && this.eventDO.reportFlyDO.eventDescription.length <= 200)) {
                    this.$message.error('请填写事情经过')
                  } else {
                    axios.post('/api/incdent/event/addEvent', eventReportFlyGroundSeVO)
                      .then(res => {
                        if (res.data.error === 0) {
                          this.relGroundDevices = 'false'
                          this.relGroundDevicess = 'false'
                          this.eventNumber = res.data.data.eventNumber
                          this.$message.success('保存成功')
                          this.$refs.adjunct.isShow = false
                        
                        } else if (res.data.error !== 0) {
                          this.$message.error(res.data.message)
                        }
                      })
                      .catch(error => {
                        console.log(error)
                      })
                  }
                }
                
                if (this.eventDO.majorType === 2) {
                  this.$refs.groundlists.validateForm()
                  console.log(this.eventDO.reportGroundDO.acType1.length)
                  if (this.eventDO.reportGroundDO.relAircraft === 'true') {
                    if (this.eventDO.reportGroundDO.acType1 === '' || !(this.eventDO.reportGroundDO.acType1.length >= 2 && this.eventDO.reportGroundDO.acType1.length <= 20)) {
                      this.$message.error('请填写机型')
                    } else if (this.eventDO.reportGroundDO.acNo1 === '' || !(this.eventDO.reportGroundDO.acNo1.length >= 2 && this.eventDO.reportGroundDO.acNo1.length <= 10)) {
                      this.$message.error('请填写飞机号')
                    } else if (this.eventDO.reportGroundDO.acCompany1 === '' || !(this.eventDO.reportGroundDO.acCompany1.length >=2 && this.eventDO.reportGroundDO.acCompany1.length <= 100)) {
                      this.$message.error('请填写所属单位')
                    } else if (this.eventDO.reportGroundDO.runPhase1 === '') {
                      this.$message.error('请填写运行阶段')
                    } else if (this.eventDO.reportGroundDO.relCar === 'true') {
                      if (this.eventDO.reportGroundDO.carType1 === '') {
                        this.$message.error('请填写车辆类型')
                      } else if (this.eventDO.reportGroundDO.carCompany1 === '' || !(this.eventDO.reportGroundDO.carCompany1.length >= 2 && this.eventDO.reportGroundDO.carCompany1.length <= 100)) {
                        this.$message.error('请填写所属单位')
                      } else if (this.eventDO.reportGroundDO.relGroundDevice === 'true') {
                        if (this.eventDO.reportGroundDO.deviceName === '' || !(this.eventDO.reportGroundDO.deviceName.length >= 2 && this.eventDO.reportGroundDO.deviceName.length <= 50)) {
                          this.$message.error('请填写地面设施')
                        } else if (this.eventDO.reportGroundDO.deviceCompany === '' || !(this.eventDO.reportGroundDO.deviceCompany.length >=2 && this.eventDO.reportGroundDO.deviceCompany.length <= 100)) {
                          this.$message.error('请填写所属单位')
                        }  else if (this.eventDO.reportGroundDO.causeType === '') {
                          this.$message.error('请填写原因分类')
                        } else if (this.eventDO.reportGroundDO.flightDelay === '') {
                          this.$message.error('请填写延误情况')
                        } else if (this.eventDO.reportGroundDO.eventType === '') {
                          this.$message.error('请填写事件类型')
                        } else if (this.eventDO.reportGroundDO.aircraftDamage === '') {
                          this.$message.error('请填写航空损坏情况')
                        } else if (this.eventDO.reportGroundDO.eventDescription === '' || !(this.eventDO.reportGroundDO.eventDescription.length >=2 && this.eventDO.reportGroundDO.eventDescription.length <= 200)) {
                          this.$message.error('请填写事情的经过')
                        } else {
                          axios.post('/api/incdent/event/addEvent', eventReportFlyGroundSeVO)
                            .then(res => {
                              if (res.data.error === 0) {
                                this.relGroundDevices = 'false'
                                this.relGroundDevicess = 'false'
                                this.eventNumber = res.data.data.eventNumber
                                this.$message.success('保存成功')
                                this.$refs.adjunct.isShow = false
                              } else if (res.data.error !== 0) {
                                this.$message.error(res.data.message)
                              }
                            })
                            .catch(error => {
                              console.log(error)
                            })
                        }
                      } else {
                        if (this.eventDO.reportGroundDO.causeType === '') {
                          this.$message.error('请填写原因分类')
                        } else if (this.eventDO.reportGroundDO.flightDelay === '') {
                          this.$message.error('请填写延误情况')
                        } else if (this.eventDO.reportGroundDO.eventType === '') {
                          this.$message.error('请填写事件类型')
                        } else if (this.eventDO.reportGroundDO.aircraftDamage === '') {
                          this.$message.error('请填写航空损坏情况')
                        } else if (this.eventDO.reportGroundDO.eventDescription === '' || !(this.eventDO.reportGroundDO.eventDescription.length >=2 && this.eventDO.reportGroundDO.eventDescription.length <= 200)) {
                          this.$message.error('请填写事情的经过')
                        } else {
                          axios.post('/api/incdent/event/addEvent', eventReportFlyGroundSeVO)
                            .then(res => {
                              if (res.data.error === 0) {
                                this.relGroundDevices = 'false'
                                this.relGroundDevicess = 'false'
                                this.eventNumber = res.data.data.eventNumber
                                this.$message.success('保存成功')
                                this.$refs.adjunct.isShow = false
                              } else if (res.data.error !== 0) {
                                this.$message.error(res.data.message)
                              }
                            })
                            .catch(error => {
                              console.log(error)
                            })
                        }
                      }
                    } else {
                      if (this.eventDO.reportGroundDO.relGroundDevice === 'true') {
                        if (this.eventDO.reportGroundDO.deviceName === '' || !(this.eventDO.reportGroundDO.deviceName.length >= 2 && this.eventDO.reportGroundDO.deviceName.length <= 50)) {
                          this.$message.error('请填写地面设施')
                        } else if (this.eventDO.reportGroundDO.deviceCompany === '' || !(this.eventDO.reportGroundDO.deviceCompany.length >=2 && this.eventDO.reportGroundDO.deviceCompany.length <= 100)) {
                          this.$message.error('请填写所属单位')
                        }  else if (this.eventDO.reportGroundDO.causeType === '') {
                          this.$message.error('请填写原因分类')
                        } else if (this.eventDO.reportGroundDO.flightDelay === '') {
                          this.$message.error('请填写延误情况')
                        } else if (this.eventDO.reportGroundDO.eventType === '') {
                          this.$message.error('请填写事件类型')
                        } else if (this.eventDO.reportGroundDO.aircraftDamage === '') {
                          this.$message.error('请填写航空损坏情况')
                        } else if (this.eventDO.reportGroundDO.eventDescription === '' || !(this.eventDO.reportGroundDO.eventDescription.length >=2 && this.eventDO.reportGroundDO.eventDescription.length <= 200)) {
                          this.$message.error('请填写事情的经过')
                        } else {
                          axios.post('/api/incdent/event/addEvent', eventReportFlyGroundSeVO)
                            .then(res => {
                              if (res.data.error === 0) {
                                this.relGroundDevices = 'false'
                                this.relGroundDevicess = 'false'
                                this.eventNumber = res.data.data.eventNumber
                                this.$message.success('保存成功')
                                this.$refs.adjunct.isShow = false
                              } else if (res.data.error !== 0) {
                                this.$message.error(res.data.message)
                              }
                            })
                            .catch(error => {
                              console.log(error)
                            })
                        }
                      } else {
                        if (this.eventDO.reportGroundDO.causeType === '') {
                          this.$message.error('请填写原因分类')
                        } else if (this.eventDO.reportGroundDO.flightDelay === '') {
                          this.$message.error('请填写延误情况')
                        } else if (this.eventDO.reportGroundDO.eventType === '') {
                          this.$message.error('请填写事件类型')
                        } else if (this.eventDO.reportGroundDO.aircraftDamage === '') {
                          this.$message.error('请填写航空损坏情况')
                        } else if (this.eventDO.reportGroundDO.eventDescription === '' || !(this.eventDO.reportGroundDO.eventDescription.length >=2 && this.eventDO.reportGroundDO.eventDescription.length <= 200)) {
                          this.$message.error('请填写事情的经过')
                        } else {
                          axios.post('/api/incdent/event/addEvent', eventReportFlyGroundSeVO)
                            .then(res => {
                              if (res.data.error === 0) {
                                this.relGroundDevices = 'false'
                                this.relGroundDevicess = 'false'
                                this.eventNumber = res.data.data.eventNumber
                                this.$message.success('保存成功')
                                this.$refs.adjunct.isShow = false
                              } else if (res.data.error !== 0) {
                                this.$message.error(res.data.message)
                              }
                            })
                            .catch(error => {
                              console.log(error)
                            })
                        }
                      }
                    }
                  } else {
                    if (this.eventDO.reportGroundDO.relCar === 'true') {
                      if (this.eventDO.reportGroundDO.carType1 === '') {
                        this.$message.error('请填写车辆类型')
                      } else if (this.eventDO.reportGroundDO.carCompany1 === '' || !(this.eventDO.reportGroundDO.carCompany1.length >= 2 && this.eventDO.reportGroundDO.carCompany1.length <= 100)) {
                        this.$message.error('请填写所属单位')
                      } else if (this.eventDO.reportGroundDO.relGroundDevice === 'true') {
                        if (this.eventDO.reportGroundDO.deviceName === '' || !(this.eventDO.reportGroundDO.deviceName.length >= 2 && this.eventDO.reportGroundDO.deviceName.length <= 50)) {
                          this.$message.error('请填写地面设施')
                        } else if (this.eventDO.reportGroundDO.deviceCompany === '' || !(this.eventDO.reportGroundDO.deviceCompany.length >=2 && this.eventDO.reportGroundDO.deviceCompany.length <= 100)) {
                          this.$message.error('请填写所属单位')
                        }  else if (this.eventDO.reportGroundDO.causeType === '') {
                          this.$message.error('请填写原因分类')
                        } else if (this.eventDO.reportGroundDO.flightDelay === '') {
                          this.$message.error('请填写延误情况')
                        } else if (this.eventDO.reportGroundDO.eventType === '') {
                          this.$message.error('请填写事件类型')
                        }  else if (this.eventDO.reportGroundDO.aircraftDamage === '') {
                          this.$message.error('请填写航空损坏情况')
                        } else if (this.eventDO.reportGroundDO.eventDescription === '' || !(this.eventDO.reportGroundDO.eventDescription.length >=2 && this.eventDO.reportGroundDO.eventDescription.length <= 200)) {
                          this.$message.error('请填写事情的经过')
                        } else {
                          axios.post('/api/incdent/event/addEvent', eventReportFlyGroundSeVO)
                            .then(res => {
                              if (res.data.error === 0) {
                                this.relGroundDevices = 'false'
                                this.relGroundDevicess = 'false'
                                this.eventNumber = res.data.data.eventNumber
                                this.$message.success('保存成功')
                                this.$refs.adjunct.isShow = false
                              } else if (res.data.error !== 0) {
                                this.$message.error(res.data.message)
                              }
                            })
                            .catch(error => {
                              console.log(error)
                            })
                        }
                      } else {
                        if (this.eventDO.reportGroundDO.causeType === '') {
                          this.$message.error('请填写原因分类')
                        } else if (this.eventDO.reportGroundDO.flightDelay === '') {
                          this.$message.error('请填写延误情况')
                        } else if (this.eventDO.reportGroundDO.eventType === '') {
                          this.$message.error('请填写事件类型')
                        }  else if (this.eventDO.reportGroundDO.aircraftDamage === '') {
                          this.$message.error('请填写航空损坏情况')
                        } else if (this.eventDO.reportGroundDO.eventDescription === '' || !(this.eventDO.reportGroundDO.eventDescription.length >=2 && this.eventDO.reportGroundDO.eventDescription.length <= 200)) {
                          this.$message.error('请填写事情的经过')
                        } else {
                          axios.post('/api/incdent/event/addEvent', eventReportFlyGroundSeVO)
                            .then(res => {
                              if (res.data.error === 0) {
                                this.relGroundDevices = 'false'
                                this.relGroundDevicess = 'false'
                                this.eventNumber = res.data.data.eventNumber
                                this.$message.success('保存成功')
                                this.$refs.adjunct.isShow = false
                              } else if (res.data.error !== 0) {
                                this.$message.error(res.data.message)
                              }
                            })
                            .catch(error => {
                              console.log(error)
                            })
                        }
                      }
                    } else {
                      if (this.eventDO.reportGroundDO.relGroundDevice === 'true') {
                        if (this.eventDO.reportGroundDO.deviceName === '' || !(this.eventDO.reportGroundDO.deviceName.length >= 2 && this.eventDO.reportGroundDO.deviceName.length <= 50)) {
                          this.$message.error('请填写地面设施')
                        } else if (this.eventDO.reportGroundDO.deviceCompany === '' || !(this.eventDO.reportGroundDO.deviceCompany.length >=2 && this.eventDO.reportGroundDO.deviceCompany.length <= 100)) {
                          this.$message.error('请填写所属单位')
                        } else if (this.eventDO.reportGroundDO.causeType === '') {
                          this.$message.error('请填写原因分类')
                        } else if (this.eventDO.reportGroundDO.flightDelay === '') {
                          this.$message.error('请填写延误情况')
                        } else if (this.eventDO.reportGroundDO.eventType === '') {
                          this.$message.error('请填写事件类型')
                        }  else if (this.eventDO.reportGroundDO.aircraftDamage === '') {
                          this.$message.error('请填写航空损坏情况')
                        } else if (this.eventDO.reportGroundDO.eventDescription === '' || !(this.eventDO.reportGroundDO.eventDescription.length >=2 && this.eventDO.reportGroundDO.eventDescription.length <= 200)) {
                          this.$message.error('请填写事情的经过')
                        } else {
                          axios.post('/api/incdent/event/addEvent', eventReportFlyGroundSeVO)
                            .then(res => {
                              if (res.data.error === 0) {
                                this.relGroundDevices = 'false'
                                this.relGroundDevicess = 'false'
                                this.eventNumber = res.data.data.eventNumber
                                this.$message.success('保存成功')
                                this.$refs.adjunct.isShow = false
                              } else if (res.data.error !== 0) {
                                this.$message.error(res.data.message)
                              }
                            })
                            .catch(error => {
                              console.log(error)
                            })
                        }
                      } else {
                        if (this.eventDO.reportGroundDO.causeType === '') {
                          this.$message.error('请填写原因分类')
                        } else if (this.eventDO.reportGroundDO.flightDelay === '') {
                          this.$message.error('请填写延误情况')
                        } else if (this.eventDO.reportGroundDO.eventType === '') {
                          this.$message.error('请填写事件类型')
                        } else if (this.eventDO.reportGroundDO.aircraftDamage === '') {
                          this.$message.error('请填写航空损坏情况')
                        } else if (this.eventDO.reportGroundDO.eventDescription === '' || !(this.eventDO.reportGroundDO.eventDescription.length >=2 && this.eventDO.reportGroundDO.eventDescription.length <= 200)) {
                          this.$message.error('请填写事情的经过')
                        } else {
                          axios.post('/api/incdent/event/addEvent', eventReportFlyGroundSeVO)
                            .then(res => {
                              if (res.data.error === 0) {
                                this.relGroundDevices = 'false'
                                this.relGroundDevicess = 'false'
                                this.eventNumber = res.data.data.eventNumber
                                this.$message.success('保存成功')
                                this.$refs.adjunct.isShow = false
                              } else if (res.data.error !== 0) {
                                this.$message.error(res.data.message)
                              }
                            })
                            .catch(error => {
                              console.log(error)
                            })
                        }
                      }
                    }
                  }
                }
                if (this.eventDO.majorType === 3) {
                  this.$refs.curity.validateForm()
                  if (this.eventDO.reportSecurityDO.relAircraft === 'true') {
                    if (this.eventDO.reportSecurityDO.flightDate === '') {
                      this.$message.error('请填写航空日期')
                    } else if (this.eventDO.reportSecurityDO.flightLeg === '') {
                      this.$message.error('请填写航段')
                    } else if (this.eventDO.reportSecurityDO.airNumber === '') {
                      this.$message.error('请填写飞机号')
                    } else if (this.eventDO.reportSecurityDO.secEventCategory === '') {
                      this.$message.error('请填写安保事件类别')
                    } else if (this.eventDO.reportSecurityDO.secEventType1 === '') {
                      this.$message.error('请填写安保事件类型1')
                    } else if (this.eventDO.reportSecurityDO.secEventType2 === '') {
                      this.$message.error('请填写安保事件类型2')
                    } else if (this.eventDO.reportSecurityDO.eventGrade === '') {
                      this.$message.error('请填写事件等级')
                    } else if (this.eventDO.reportSecurityDO.flightDelay === '') {
                      this.$message.error('请填写航班延误')
                    } else if (this.eventDO.reportSecurityDO.aircraftDamage === '') {
                      this.$message.error('请填写航空损坏')
                    } else if (this.eventDO.reportSecurityDO.eventDescription === '' || !(this.eventDO.reportSecurityDO.eventDescription.length >= 2 && this.eventDO.reportSecurityDO.eventDescription.length <= 200)) {
                      this.$message.error('请填写事情的经过')
                    } else {
                      axios.post('/api/incdent/event/addEvent', eventReportFlyGroundSeVO)
                        .then(res => {
                          if (res.data.error === 0) {
                            this.relGroundDevices = 'false'
                            this.relGroundDevicess = 'false'
                            this.eventNumber = res.data.data.eventNumber
                            this.$message.success('保存成功')
                            this.$refs.adjunct.isShow = false
                          } else if (res.data.error !== 0) {
                            this.$message.error(res.data.message)
                          }
                        })
                        .catch(error => {
                          console.log(error)
                        })
                    }
                  } else {
                    if (this.eventDO.reportSecurityDO.secEventCategory === '') {
                      this.$message.error('请填写安保事件类别')
                    } else if (this.eventDO.reportSecurityDO.secEventType1 === '') {
                      this.$message.error('请填写安保事件类型1')
                    } else if (this.eventDO.reportSecurityDO.secEventType2 === '') {
                      this.$message.error('请填写安保事件类型2')
                    } else if (this.eventDO.reportSecurityDO.eventGrade === '') {
                      this.$message.error('请填写事件等级')
                    } else if (this.eventDO.reportSecurityDO.flightDelay === '') {
                      this.$message.error('请填写航班延误')
                    } else if (this.eventDO.reportSecurityDO.aircraftDamage === '') {
                      this.$message.error('请填写航空损坏')
                    } else if (this.eventDO.reportSecurityDO.eventDescription === '' || !(this.eventDO.reportSecurityDO.eventDescription.length >= 2 && this.eventDO.reportSecurityDO.eventDescription.length <= 200)) {
                      this.$message.error('请填写事情的经过')
                    } else {
                      axios.post('/api/incdent/event/addEvent', eventReportFlyGroundSeVO)
                        .then(res => {
                          if (res.data.error === 0) {
                            this.relGroundDevices = 'false'
                            this.relGroundDevicess = 'false'
                            this.eventNumber = res.data.data.eventNumber
                            this.$message.success('保存成功')
                            this.$refs.adjunct.isShow = false
                          } else if (res.data.error !== 0) {
                            this.$message.error(res.data.message)
                          }
                        })
                        .catch(error => {
                          console.log(error)
                        })
                    }
                  }
                }
              }
          } else {
            
            return false;
          }
        })



        
      },
      Sendout () {
        let eventNumber = this.eventNumber
        let userName = this.$store.state.user.userName
        this.fullscreenLoading = true
        axios.get('/api/incdent/workflow/start/' + eventNumber + '/' + userName)
          .then(res => {
            this.fullscreenLoading = false
            if (res.data.error === 0) {
              this.$message.success('发送成功')
              this.$router.back(-1)
            } else if (res.data.error !== 0) {
              this.$message.error('发送失败，请重试：' + res.data.message)
            }
          })
          .catch(error => {
            console.log(error)
            this.fullscreenLoading = false
            this.$message.error('网咯超时请检查网咯')
          })
      },
      goback () {
        this.$router.push({ path: '/event/list' })
      }
    },
    mounted () {
      getDepartmentList().then(item => {
        item.map(result => {
        })
      })
    },
    created () {
      getAllDataAction().then(result => {
        this.REPORT_Title = result.EVENT_SURVEY_TITLE.dicts
        this.category = result.REPORT_TYPE.dicts
        this.groundList = result
      })
      this.user = this.$store.state.user
      this.id = +this.$route.params.id
      if (this.$store.state.user.deptName.substring(0,2) === '安全') {
        this.sou = 0
      } else {
        this.sou = 1
      }
      if (this.id === 0) {
        this.showlist = false
        this.eventDO.source = '新建'
        this.eventDO.reporter = this.user.userId
        this.eventDO.reporterName = this.user.userName
        this.eventDO.phone = this.user.userPhone
        this.eventDO.repDeptName = this.user.deptName
        this.eventDO.repDept = this.user.deptId
        this.eventDO.createDate = formatDate(new Date(), 'yyyy-MM-dd')
      }
      this.user = this.$store.state.user
      if (this.id === 1) {
        this.eventDO = {}
        this.eventDO.reporter = this.user.userId
        this.eventDO.reporterName = this.user.userName
        this.eventDO.phone = this.user.userPhone
        this.eventDO.repDeptName = this.user.deptName
        this.eventDO.repDept = this.user.deptId
        this.eventDO.createDate = formatDate(new Date(), 'yyyy-MM-dd')
        this.eventDO.source = this.$route.query.source
        this.eventDO.occurDate = this.$route.query.occurDate
        this.eventDO.occurAddress = this.$route.query.occurAddress
        this.eventDO.category = this.$route.query.category
        if (this.$route.query.qarNeeded === true) {
          this.$route.query.qarNeeded = 'true'
        } else if (this.$route.query.qarNeeded === false) {
          this.$route.query.qarNeeded = 'false'
        }
        this.eventDO.qarNeeded = this.$route.query.qarNeeded
        this.eventDO.title = this.$route.query.title
        this.eventDO.majorType = this.$route.query.majorType
        this.di = false
        this.an = false
        this.radio2 = 1
      }
    }
}
</script>
<style scoped>
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
