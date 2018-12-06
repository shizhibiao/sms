<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
        Information Reporting
      </b-card-header>
      <b-card-body>
        <el-form :model="preserveData" :rules="rules" ref="preserveData" status-icon size="medium" label-width="98px" inline-message>
          <div class="row">
            <div class="col-sm-12">
              <el-form-item label="Report Type" prop="category" title="report type">
                <el-select v-model="preserveData.category" placeholder="Please select an option">
                  <el-option v-for="(item, index) in noticeLevelList" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-sm-12">
              <el-form-item label="Anouymous" prop="anonymous" title="Whether anonymous">
                <el-radio v-model="preserveData.anonymous" label='false'>No</el-radio>
                <el-radio v-model="preserveData.anonymous" label='true'>Yes</el-radio>
              </el-form-item>
            </div>
            <div class="col-sm-12" v-if="preserveData.anonymous == 'false'">
              <el-form-item label="Reporter" prop="reporterName" title="Reporter">
                <el-select
                    v-model="preserveData.reporter"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="Enter Keywords"
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
                  v-model="state4"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="Please enter content"
                  @select="handleSelect"
                  @blur="verifyReportHandler"
                ></el-autocomplete> -->
              </el-form-item>
            </div>
            <div class="col-sm-12"  v-if="preserveData.anonymous == 'false'">
              <el-form-item label="Department" prop="deptName" title="Department">
                <el-input v-model="preserveData.deptName" disabled></el-input>
              </el-form-item>
            </div>
            <div class="col-sm-12">
              <el-form-item label="Report Date" prop="reportDate" title="Report Date">
                <el-input v-model="preserveData.reportDate" disabled></el-input>
              </el-form-item>
            </div>
            <div class="col-sm-12">
              <el-form-item label="Phone" prop="telphone" title="Phone">
                <el-input v-model="preserveData.telphone" placeholder="Please enter your phone number" maxlength="20"></el-input>
              </el-form-item>
            </div>
            <div class="col-sm-12">
              <el-form-item label="Location" prop="occurAddress" title="Location of Occurence">
                <el-input v-model="preserveData.occurAddress" placeholder="" maxlength="50"></el-input>
              </el-form-item>
            </div>
            <div class="col-sm-12">
              <el-form-item label="Happended Date" prop="occurDate" title="Date of Occurrence">
                <el-date-picker
                  style="width: 100%;"
                  v-model="preserveData.occurDate"
                  type="date"
                  placeholder="option date"
                  align="right">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="Title" prop="title">
            <el-input v-model="preserveData.title" placeholder="" style="width: 100%" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="Category" prop="majorType">
            <el-radio v-model="preserveData.majorType" label='1'>Flight </el-radio>
            <el-radio v-model="preserveData.majorType" label='2'>Ground</el-radio>
            <el-radio v-model="preserveData.majorType" label='3'>Security</el-radio>
          </el-form-item>
        </el-form>
      </b-card-body>
    </b-card>
    <AppEnglishFlight v-if="preserveData.majorType == '1'" :byData="groundList" :compileData="sublistData" @getFlight="getFlightData" />
    <AppEnglishGround v-else-if="preserveData.majorType == '2'" :byData="groundList" :compileData="sublistData" @getGround="getGroundData" />
    <AppEnglishSecurity v-else-if="preserveData.majorType == '3'" :byData="groundList" :compileData="sublistData" @getSecurity="getSecurityData" />
    <!-- 附件上传 -->
    <SecurityNoticeAdjunct_en ref='adjunct'></SecurityNoticeAdjunct_en>
    <b-card no-body class="footer">
      <b-card-body>
        <div style="text-align: center;">
          <el-button size='small' type="primary" @click="preserveAction" :disabled="preserveDisabled === 'false'"
            v-loading.fullscreen.lock="fullscreenLoading">Submit</el-button>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
  import axios from 'axios'
  // 飞行 地面 安保
  import AppEnglishFlight from '../common/app_English_Flight.vue'
  import AppEnglishGround from '../common/app_English_Ground.vue'
  import AppEnglishSecurity from '../common/app_English_Security.vue'
  // 过滤
  // import { filterNameChange } from '../../filter/reportFilter.js'
  import { getAllDataAction, getPreserveAction, initiatorProcedureAction, getSelectUserAllAction } from '../../services/information_report'
  // 附件上传
  import { SecurityNoticeAdjunct_en } from '../../components/System/security_notice/index.js'
  import { sourceDataFilterOppositeEn } from '../../tools'
  import { formatDate } from '../../utils/index.js'

  export default {
    name: 'SecurityNoticeList',
    props: {
      reportNumber: Number
    },
    components: {
      AppEnglishFlight,
      AppEnglishGround,
      AppEnglishSecurity,
      SecurityNoticeAdjunct_en
    },
    data () {
      return {
        preserveData: {
          reportNumber: 0,
          // 报告类型
          category: '1',
          // 是否匿名
          anonymous: 'false',
          // 报告人姓名
          reporterName: '',
          // 报告部门deptId
          // 报告时间
          reportDate: formatDate(new Date(), 'yyyy-MM-dd'),
          // 联系电话
          telphone: '',
          // 标题
          title: '',
          // 发生日期
          occurDate: new Date(),
          // 发生地点
          occurAddress: '',
          // 报告状态
          status: -1,
          // 当前用户ID userId
          // 专业类型 飞行、地面、安保
          majorType: '1',
          // 实例流程
          procInstId: 0,
          //  飞行里面的数据
          reportFlyDO: {},
          //  地面里面的数据
          reportGroundDO: {},
          //  安保里面的数据
          reportSecurityDO: {},
          // 所在部门
          deptName: '',
          // 报告部门Id
          deptId: '',
          // 报告人Id
          reporter: ''
        },
        // 地面相关信息
        groundRelation: null,
        // 安保相关信息
        SecurityrelRelation: null,
        noticeLevelList: [],
        // 下拉菜单数据
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
        sublistData: {},
        saveError: 1,
        // 保存时的状态
        saveStatus: true,
        rules: {
          telphone: [
            { required: true, message: 'The phone number cannot be empty', trigger: 'change'}
          ],
          reporterName: [
            { required: true, message: 'Please select your corresponding name', trigger: 'change'}
          ],
          category: [
            { required: true, message: 'Report type cannot be empty', trigger: 'change' },
          ],
          occurDate: [
            { required: true, message: 'Date cannot be blank', trigger: 'change' }
          ],
          occurAddress: [
            { required: true, message: 'The location cannot be empty', trigger: 'blur' }
          ],
          title: [
            { required: true, message: 'The title cannot be empty', trigger: 'blur' }
          ],
          majorType: [
            { required: true, message: 'Professional type cannot be empty', trigger: 'change' }
          ]
        },
        // 发送按钮是否可以点击
        sendActin: 'false',
        // 保存
        preserveDisabled: 'true',
        // loading
        fullscreenLoading: false,
        // 报告人搜索框的数据
        options4: [],
        loading: false
      }
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
          if (data[item].userId === this.preserveData.reporter) {
            // console.log(item)
            // 部门ID和部门名称
            this.preserveData.deptId = data[item].deptId
            this.preserveData.deptName = data[item].deptName
            // 用户ID和名字
            this.preserveData.reporter = data[item].userId
            this.preserveData.reporterName = data[item].userName
            // 联系电话联系电话
            this.preserveData.telphone = data[item].userPhone
            // console.log(item, 'user')
            this.$store.commit('loginUser', data[item])
            this.$store.commit('setterToken', 'item')
          }
        }
      },
      // 将code值转为name值
      dataFilter (avlue, type) {
        let sourceData = this.groundList[type]
        let result = sourceDataFilterOppositeEn(sourceData, avlue)
        return result
      },
      sendAction () {
        // 点击启动流程并跳转到查询页
        if (this.saveError === 0) {
          // 显示loading
          this.fullscreenLoading = true
          let reportNumber = this.preserveData.reportNumber
          initiatorProcedureAction(reportNumber).then(result => {
            // 关闭loading
            this.fullscreenLoading = false
            if (result.data.error === 0) {
              this.$layer.msg('Information reported successfully!')
              // 修改成功跳转到列表页面
              // this.$router.push({path: '/report/list'})
            } else {
              this.$layer.msg('The information was reported successfully but the process started failed. Please go to the PC to start the process：' + result.data.message)
            }
          })
            .catch(error => {
              this.$layer.msg('Information reporting failed：' + error)
              // 关闭loading
              this.fullscreenLoading = false
            })
        }
      },
      // 点击获取到飞行页面的数据
      getFlightData (filghtData) {
        this.preserveData.reportFlyDO = filghtData
      },
      // 点击获取到地面页面的数据
      getGroundData (groundData) {
        this.preserveData.reportGroundDO = groundData
      },
      // 点击获取安保页面信息
      getSecurityData (securityData) {
        this.preserveData.reportSecurityDO = securityData
      },
      // 保存
      preserveAction () {
        // 判断用户是否已经保存过，保存过则不能再次保存
        if (this.saveStatus === true) {
          var {reporterName, telphone, category, occurDate, occurAddress, majorType, title} = this.preserveData
          this.preserveData.attList = this.$refs.adjunct.fileFormList
          // 判断必选框当中的内容不能为空
          if (category === '') {
            this.$layer.msg('Report type cannot be empty')
          } else if (reporterName === '') {
            this.$layer.msg("The reporter can't be empty")
          } else if (telphone === '') {
            this.$layer.msg('The phone number cannot be empty')
          } else if (occurDate === '') {
            this.$layer.msg('Date cannot be blank')
          } else if (occurAddress === '') {
            this.$layer.msg('The location cannot be empty')
          } else if (title === '') {
            this.$layer.msg('The title cannot be empty')
          } else if (majorType === 0) {
            this.$layer.msg('Professional type cannot be empty')
          } else {
            var {flightDate, airNumber, flightLeg, flightName, flightPhase, eventType, aircraftDamage, injuriesDeaths, eventDescription} = this.preserveData.reportFlyDO
            if (majorType === '1') {
              if (flightDate === '') {
                this.$layer.msg('The flight date cannot be empty')
              } else if (airNumber === '') {
                this.$layer.msg("The plane can't be empty")
              } else if (flightLeg === '') {
                this.$layer.msg('The segment cannot be empty')
              } else if (flightName === '') {
                this.$layer.msg('The nature of flight cannot be empty')
              } else if (flightPhase === '') {
                this.$layer.msg('The flight stage cannot be empty')
              } else if (eventType === '') {
                this.$layer.msg('The event type cannot be empty')
              } else if (aircraftDamage === '') {
                this.$layer.msg('The aircraft cannot be empty')
              } else if (injuriesDeaths === '') {
                this.$layer.msg('No loss of life')
              } else if (eventDescription === '') {
                this.$layer.msg('A brief account cannot be empty')
              } else {
                // 显示loading
                this.fullscreenLoading = true
                let data = JSON.parse(JSON.stringify(this.preserveData))
                if (isNaN(Number(data.reportFlyDO.eventGrade))) {
                  // console.log(this.dataFilter(data.reportFlyDO.eventGrade, 'EVENT_LEVEL'))
                  // 事件等级
                  data.reportFlyDO.eventGrade = this.dataFilter(data.reportFlyDO.eventGrade, 'EVENT_LEVEL')
                }
                if (isNaN(Number(data.reportFlyDO.aircraftDamage))) {
                  // 航空器损坏
                  data.reportFlyDO.aircraftDamage = this.dataFilter(data.reportFlyDO.aircraftDamage, 'AIRCRAFT_DAMAGE')
                }
                if (isNaN(Number(data.reportFlyDO.flightDelay))) {
                  // 航班延误情况
                  data.reportFlyDO.flightDelay = this.dataFilter(data.reportFlyDO.flightDelay, 'FLIGHT_DELAY')
                }
                getPreserveAction(data).then(result => {
                  // 关闭loading
                  this.fullscreenLoading = false
                  if (result.data.data && +result.data.error === 0 && this.saveStatus === true) {
                    this.saveError = +result.data.error
                    this.preserveData.reportNumber = result.data.data.reportNumber
                    this.saveStatus = false
                    // 保存成功可以点击发送
                    this.sendActin = true
                    // 保存按钮不可用
                    this.preserveDisabled = 'false'
                    // 点击确定启动流程
                    this.sendAction()
                  } else {
                    this.$layer.msg('submit failure：' + result.data.message)
                  }
                })
                  .catch(error => {
                    this.$layer.msg('submit failure：' + error)
                    // 关闭loading
                    this.fullscreenLoading = false
                  })
              }
            }
            if (majorType === '2') {
              // 航空器是否相关 relAircraft 是否与车辆相关 relCar 是否与地面设施相关 relGroundDevice
              var {acType1, acNo1, acType2, acNo2, runPhase1, runPhase2, carType1, carType2, deviceName, causeType, relAircraft, relCar, relGroundDevice} = this.preserveData.reportGroundDO
              var eventType2 = this.preserveData.reportGroundDO.eventType
              var aircraftDamage2 = this.preserveData.reportGroundDO.aircraftDamage
              var injuriesDeaths2 = this.preserveData.reportGroundDO.injuriesDeaths
              var eventDescription2 = this.preserveData.reportGroundDO.eventDescription
              // 判断航空器是否相关
              if (relAircraft === true) {
                if (acType1 === '' && acType2 === '') {
                  this.$layer.msg('The model cannot be empty')
                } else if (acNo1 === '' && acNo2 === '') {
                  this.$layer.msg("The plane can't be empty")
                } else if (runPhase1 === '' && runPhase2 === '') {
                  this.$layer.msg('The runtime cannot be empty')
                } else if (relCar === true) {
                  if (carType1 === '' && carType2 === '') {
                    this.$layer.msg('The vehicle type cannot be empty')
                  } else if (relGroundDevice === true) {
                    if (deviceName === '') {
                      this.$layer.msg('Ground facilities/equipment names cannot be empty')
                    } else if (eventType2 === '') {
                      this.$layer.msg('The event type cannot be empty')
                    } else if (causeType === '') {
                      this.$layer.msg('Reason classification cannot be empty')
                    } else if (aircraftDamage2 === '') {
                      this.$layer.msg('The aircraft cannot be empty')
                    } else if (injuriesDeaths2 === '') {
                      this.$layer.msg('No loss of life')
                    } else if (eventDescription2 === '') {
                      this.$layer.msg('A brief account cannot be empty')
                    } else {
                      // 显示loading
                      this.fullscreenLoading = true
                      let data = JSON.parse(JSON.stringify(this.preserveData))
                      // console.log(data)
                      if (isNaN(Number(data.reportGroundDO.eventGrade))) {
                        // 事件等级
                        data.reportGroundDO.eventGrade = this.dataFilter(data.reportGroundDO.eventGrade, 'EVENT_LEVEL')
                      }
                      if (isNaN(Number(data.reportGroundDO.aircraftDamage))) {
                        // 航空器损坏
                        data.reportGroundDO.aircraftDamage = this.dataFilter(data.reportGroundDO.aircraftDamage, 'AIRCRAFT_DAMAGE')
                      }
                      if (isNaN(Number(data.reportGroundDO.flightDelay))) {
                        // 航班延误情况
                        data.reportGroundDO.flightDelay = this.dataFilter(data.reportGroundDO.flightDelay, 'FLIGHT_DELAY')
                      }
                      getPreserveAction(data).then(result => {
                        // 关闭loading
                        this.fullscreenLoading = false
                        if (result.data.data && +result.data.error === 0 && this.saveStatus === true) {
                          this.saveError = +result.data.error
                          this.preserveData.reportNumber = result.data.data.reportNumber
                          this.saveStatus = false
                          // 保存成功可以点击发送
                          this.sendActin = true
                          // 保存按钮不可用
                          this.preserveDisabled = 'false'
                          // 点击确定启动流程
                          this.sendAction()
                        } else {
                          this.$layer.msg('submit failure：' + result.data.message)
                        }
                      })
                        .catch(error => {
                          this.$layer.msg('submit failure：' + error)
                          // 关闭loading
                          this.fullscreenLoading = false
                        })
                    }
                  } else {
                    if (eventType2 === '') {
                      this.$layer.msg('The event type cannot be empty')
                    } else if (causeType === '') {
                      this.$layer.msg('Reason classification cannot be empty')
                    } else if (aircraftDamage2 === '') {
                      this.$layer.msg('The aircraft cannot be empty')
                    } else if (injuriesDeaths2 === '') {
                      this.$layer.msg('No loss of life')
                    } else if (eventDescription2 === '') {
                      this.$layer.msg('A brief account cannot be empty')
                    } else {
                      // 显示loading
                      this.fullscreenLoading = true
                      let data = JSON.parse(JSON.stringify(this.preserveData))
                      // console.log(data)
                      if (isNaN(Number(data.reportGroundDO.eventGrade))) {
                        // 事件等级
                        data.reportGroundDO.eventGrade = this.dataFilter(data.reportGroundDO.eventGrade, 'EVENT_LEVEL')
                      }
                      if (isNaN(Number(data.reportGroundDO.aircraftDamage))) {
                        // 航空器损坏
                        data.reportGroundDO.aircraftDamage = this.dataFilter(data.reportGroundDO.aircraftDamage, 'AIRCRAFT_DAMAGE')
                      }
                      if (isNaN(Number(data.reportGroundDO.flightDelay))) {
                        // 航班延误情况
                        data.reportGroundDO.flightDelay = this.dataFilter(data.reportGroundDO.flightDelay, 'FLIGHT_DELAY')
                      }
                      getPreserveAction(data).then(result => {
                        // 关闭loading
                        this.fullscreenLoading = false
                        if (result.data.data && +result.data.error === 0 && this.saveStatus === true) {
                          this.saveError = +result.data.error
                          this.preserveData.reportNumber = result.data.data.reportNumber
                          this.saveStatus = false
                          // 保存成功可以点击发送
                          this.sendActin = true
                          // 保存按钮不可用
                          this.preserveDisabled = 'false'
                          // 点击确定启动流程
                          this.sendAction()
                        } else {
                          this.$layer.msg('submit failure：' + result.data.message)
                        }
                      })
                        .catch(error => {
                          this.$layer.msg('submit failure：' + error)
                          // 关闭loading
                          this.fullscreenLoading = false
                        })
                    }
                  }
                } else {
                  if (relGroundDevice === true) {
                    if (deviceName === '') {
                      this.$layer.msg('Ground facilities/equipment names cannot be empty')
                    } else if (eventType2 === '') {
                      this.$layer.msg('The event type cannot be empty')
                    } else if (causeType === '') {
                      this.$layer.msg('Reason classification cannot be empty')
                    } else if (aircraftDamage2 === '') {
                      this.$layer.msg('The aircraft cannot be empty')
                    } else if (injuriesDeaths2 === '') {
                      this.$layer.msg('No loss of life')
                    } else if (eventDescription2 === '') {
                      this.$layer.msg('A brief account cannot be empty')
                    } else {
                      // 显示loading
                      this.fullscreenLoading = true
                      let data = JSON.parse(JSON.stringify(this.preserveData))
                      // console.log(data)
                      if (isNaN(Number(data.reportGroundDO.eventGrade))) {
                        // 事件等级
                        data.reportGroundDO.eventGrade = this.dataFilter(data.reportGroundDO.eventGrade, 'EVENT_LEVEL')
                      }
                      if (isNaN(Number(data.reportGroundDO.aircraftDamage))) {
                        // 航空器损坏
                        data.reportGroundDO.aircraftDamage = this.dataFilter(data.reportGroundDO.aircraftDamage, 'AIRCRAFT_DAMAGE')
                      }
                      if (isNaN(Number(data.reportGroundDO.flightDelay))) {
                        // 航班延误情况
                        data.reportGroundDO.flightDelay = this.dataFilter(data.reportGroundDO.flightDelay, 'FLIGHT_DELAY')
                      }
                      getPreserveAction(data).then(result => {
                        // 关闭loading
                        this.fullscreenLoading = false
                        if (result.data.data && +result.data.error === 0 && this.saveStatus === true) {
                          this.saveError = +result.data.error
                          this.preserveData.reportNumber = result.data.data.reportNumber
                          this.saveStatus = false
                          // 保存成功可以点击发送
                          this.sendActin = true
                          // 保存按钮不可用
                          this.preserveDisabled = 'false'
                          // 点击确定启动流程
                          this.sendAction()
                        } else {
                          this.$layer.msg('submit failure：' + result.data.message)
                        }
                      })
                        .catch(error => {
                          this.$layer.msg('submit failure：' + error)
                          // 关闭loading
                          this.fullscreenLoading = false
                        })
                    }
                  } else {
                    if (eventType2 === '') {
                      this.$layer.msg('The event type cannot be empty')
                    } else if (causeType === '') {
                      this.$layer.msg('Reason classification cannot be empty')
                    } else if (aircraftDamage2 === '') {
                      this.$layer.msg('The aircraft cannot be empty')
                    } else if (injuriesDeaths2 === '') {
                      this.$layer.msg('No loss of life')
                    } else if (eventDescription2 === '') {
                      this.$layer.msg('A brief account cannot be empty')
                    } else {
                      // 显示loading
                      this.fullscreenLoading = true
                      let data = JSON.parse(JSON.stringify(this.preserveData))
                      // console.log(data)
                      if (isNaN(Number(data.reportGroundDO.eventGrade))) {
                        // 事件等级
                        data.reportGroundDO.eventGrade = this.dataFilter(data.reportGroundDO.eventGrade, 'EVENT_LEVEL')
                      }
                      if (isNaN(Number(data.reportGroundDO.aircraftDamage))) {
                        // 航空器损坏
                        data.reportGroundDO.aircraftDamage = this.dataFilter(data.reportGroundDO.aircraftDamage, 'AIRCRAFT_DAMAGE')
                      }
                      if (isNaN(Number(data.reportGroundDO.flightDelay))) {
                        // 航班延误情况
                        data.reportGroundDO.flightDelay = this.dataFilter(data.reportGroundDO.flightDelay, 'FLIGHT_DELAY')
                      }
                      getPreserveAction(data).then(result => {
                        // 关闭loading
                        this.fullscreenLoading = false
                        if (result.data.data && +result.data.error === 0 && this.saveStatus === true) {
                          this.saveError = +result.data.error
                          this.preserveData.reportNumber = result.data.data.reportNumber
                          this.saveStatus = false
                          // 保存成功可以点击发送
                          this.sendActin = true
                          // 保存按钮不可用
                          this.preserveDisabled = 'false'
                          // 点击确定启动流程
                          this.sendAction()
                        } else {
                          this.$layer.msg('submit failure：' + result.data.message)
                        }
                      })
                        .catch(error => {
                          this.$layer.msg('submit failure：' + error)
                          // 关闭loading
                          this.fullscreenLoading = false
                        })
                    }
                  }
                }
              } else if (relCar === true) {
                if (carType1 === '' && carType2 === '') {
                  this.$layer.msg('The vehicle type cannot be empty')
                } else if (relGroundDevice === true) {
                  if (deviceName === '') {
                    this.$layer.msg('Ground facilities/equipment names cannot be empty')
                  } else if (eventType2 === '') {
                    this.$layer.msg('The event type cannot be empty')
                  } else if (causeType === '') {
                    this.$layer.msg('Reason classification cannot be empty')
                  } else if (aircraftDamage2 === '') {
                    this.$layer.msg('The aircraft cannot be empty')
                  } else if (injuriesDeaths2 === '') {
                    this.$layer.msg('No loss of life')
                  } else if (eventDescription2 === '') {
                    this.$layer.msg('A brief account cannot be empty')
                  } else {
                    // 显示loading
                      this.fullscreenLoading = true
                      let data = JSON.parse(JSON.stringify(this.preserveData))
                      // console.log(data)
                      if (isNaN(Number(data.reportGroundDO.eventGrade))) {
                        // 事件等级
                        data.reportGroundDO.eventGrade = this.dataFilter(data.reportGroundDO.eventGrade, 'EVENT_LEVEL')
                      }
                      if (isNaN(Number(data.reportGroundDO.aircraftDamage))) {
                        // 航空器损坏
                        data.reportGroundDO.aircraftDamage = this.dataFilter(data.reportGroundDO.aircraftDamage, 'AIRCRAFT_DAMAGE')
                      }
                      if (isNaN(Number(data.reportGroundDO.flightDelay))) {
                        // 航班延误情况
                        data.reportGroundDO.flightDelay = this.dataFilter(data.reportGroundDO.flightDelay, 'FLIGHT_DELAY')
                      }
                      getPreserveAction(data).then(result => {
                        // 关闭loading
                        this.fullscreenLoading = false
                        if (result.data.data && +result.data.error === 0 && this.saveStatus === true) {
                          this.saveError = +result.data.error
                          this.preserveData.reportNumber = result.data.data.reportNumber
                          this.saveStatus = false
                          // 保存成功可以点击发送
                          this.sendActin = true
                          // 保存按钮不可用
                          this.preserveDisabled = 'false'
                          // 启动流程
                          this.sendAction()
                        } else {
                          this.$layer.msg('submit failure：' + result.data.message)
                        }
                      })
                        .catch(error => {
                          this.$layer.msg('submit failure：' + error)
                          // 关闭loading
                          this.fullscreenLoading = false
                        })
                  }
                } else if (eventType2 === '') {
                  this.$layer.msg('The event type cannot be empty')
                } else if (causeType === '') {
                  this.$layer.msg('Reason classification cannot be empty')
                } else if (aircraftDamage2 === '') {
                  this.$layer.msg('The aircraft cannot be empty')
                } else if (injuriesDeaths2 === '') {
                  this.$layer.msg('No loss of life')
                } else if (eventDescription2 === '') {
                  this.$layer.msg('A brief account cannot be empty')
                } else {
                  // 显示loading
                  this.fullscreenLoading = true
                  let data = JSON.parse(JSON.stringify(this.preserveData))
                  // console.log(data)
                  if (isNaN(Number(data.reportGroundDO.eventGrade))) {
                    // 事件等级
                    data.reportGroundDO.eventGrade = this.dataFilter(data.reportGroundDO.eventGrade, 'EVENT_LEVEL')
                  }
                  if (isNaN(Number(data.reportGroundDO.aircraftDamage))) {
                    // 航空器损坏
                    data.reportGroundDO.aircraftDamage = this.dataFilter(data.reportGroundDO.aircraftDamage, 'AIRCRAFT_DAMAGE')
                  }
                  if (isNaN(Number(data.reportGroundDO.flightDelay))) {
                    // 航班延误情况
                    data.reportGroundDO.flightDelay = this.dataFilter(data.reportGroundDO.flightDelay, 'FLIGHT_DELAY')
                  }
                  getPreserveAction(data).then(result => {
                    // 关闭loading
                    this.fullscreenLoading = false
                    if (result.data.data && +result.data.error === 0 && this.saveStatus === true) {
                      this.saveError = +result.data.error
                      this.preserveData.reportNumber = result.data.data.reportNumber
                      this.saveStatus = false
                      // 保存成功可以点击发送
                      this.sendActin = true
                      // 保存按钮不可用
                      this.preserveDisabled = 'false'
                      // 启动流程
                      this.sendAction()
                    } else {
                      this.$layer.msg('submit failure：' + result.data.message)
                    }
                  })
                    .catch(error => {
                      this.$layer.msg('submit failure：' + error)
                      // 关闭loading
                      this.fullscreenLoading = false
                    })
                }
              } else if (relGroundDevice === true) {
                if (deviceName === '') {
                  this.$layer.msg('Ground facilities/equipment names cannot be empty')
                } else if (eventType2 === '') {
                  this.$layer.msg('The event type cannot be empty')
                } else if (causeType === '') {
                  this.$layer.msg('Reason classification cannot be empty')
                } else if (aircraftDamage2 === '') {
                  this.$layer.msg('The aircraft cannot be empty')
                } else if (injuriesDeaths2 === '') {
                  this.$layer.msg('No loss of life')
                } else if (eventDescription2 === '') {
                  this.$layer.msg('A brief account cannot be empty')
                } else {
                  // 显示loading
                  this.fullscreenLoading = true
                  let data = JSON.parse(JSON.stringify(this.preserveData))
                  // console.log(data)
                  if (isNaN(Number(data.reportGroundDO.eventGrade))) {
                    // 事件等级
                    data.reportGroundDO.eventGrade = this.dataFilter(data.reportGroundDO.eventGrade, 'EVENT_LEVEL')
                  }
                  if (isNaN(Number(data.reportGroundDO.aircraftDamage))) {
                    // 航空器损坏
                    data.reportGroundDO.aircraftDamage = this.dataFilter(data.reportGroundDO.aircraftDamage, 'AIRCRAFT_DAMAGE')
                  }
                  if (isNaN(Number(data.reportGroundDO.flightDelay))) {
                    // 航班延误情况
                    data.reportGroundDO.flightDelay = this.dataFilter(data.reportGroundDO.flightDelay, 'FLIGHT_DELAY')
                  }
                  getPreserveAction(data).then(result => {
                    // 关闭loading
                    this.fullscreenLoading = false
                    if (result.data.data && +result.data.error === 0 && this.saveStatus === true) {
                      this.saveError = +result.data.error
                      this.preserveData.reportNumber = result.data.data.reportNumber
                      this.saveStatus = false
                      // 保存成功可以点击发送
                      this.sendActin = true
                      // 保存按钮不可用
                      this.preserveDisabled = 'false'
                      // 启动流程
                      this.sendAction()
                    } else {
                      this.$layer.msg('submit failure：' + result.data.message)
                    }
                  })
                    .catch(error => {
                      this.$layer.msg('submit failure：' + error)
                      // 关闭loading
                      this.fullscreenLoading = false
                    })
                }
              } else if (eventType2 === '') {
                this.$layer.msg('The event type cannot be empty')
              } else if (causeType === '') {
                this.$layer.msg('Reason classification cannot be empty')
              } else if (aircraftDamage2 === '') {
                this.$layer.msg('The aircraft cannot be empty')
              } else if (injuriesDeaths2 === '') {
                this.$layer.msg('No loss of life')
              } else if (eventDescription2 === '') {
                this.$layer.msg('A brief account cannot be empty')
              } else {
                // 显示loading
                this.fullscreenLoading = true
                let data = JSON.parse(JSON.stringify(this.preserveData))
                // console.log(data)
                if (isNaN(Number(data.reportGroundDO.eventGrade))) {
                  // 事件等级
                  data.reportGroundDO.eventGrade = this.dataFilter(data.reportGroundDO.eventGrade, 'EVENT_LEVEL')
                }
                if (isNaN(Number(data.reportGroundDO.aircraftDamage))) {
                  // 航空器损坏
                  data.reportGroundDO.aircraftDamage = this.dataFilter(data.reportGroundDO.aircraftDamage, 'AIRCRAFT_DAMAGE')
                }
                if (isNaN(Number(data.reportGroundDO.flightDelay))) {
                  // 航班延误情况
                  data.reportGroundDO.flightDelay = this.dataFilter(data.reportGroundDO.flightDelay, 'FLIGHT_DELAY')
                }
                getPreserveAction(data).then(result => {
                  // 关闭loading
                  this.fullscreenLoading = false
                  if (result.data.data && +result.data.error === 0 && this.saveStatus === true) {
                    this.saveError = +result.data.error
                    this.preserveData.reportNumber = result.data.data.reportNumber
                    this.saveStatus = false
                    // 保存成功可以点击发送
                    this.sendActin = true
                    // 保存按钮不可用
                    this.preserveDisabled = 'false'
                    // 启动流程
                    this.sendAction()
                  } else {
                    this.$layer.msg('submit failure：' + result.data.message)
                  }
                })
                  .catch(error => {
                    this.$layer.msg('submit failure：' + error)
                    // 关闭loading
                    this.fullscreenLoading = false
                  })
              }
            }
            if (majorType === '3') {
              var flightDate3 = this.preserveData.reportSecurityDO.flightDate
              var airNumber3 = this.preserveData.reportSecurityDO.airNumber
              var flightLeg3 = this.preserveData.reportSecurityDO.flightLeg
              var secEventType11 = this.preserveData.reportSecurityDO.secEventType1
              var secEventType12 = this.preserveData.reportSecurityDO.secEventType2
              var aircraftDamage3 = this.preserveData.reportSecurityDO.aircraftDamage
              var injuriesDeaths3 = this.preserveData.reportSecurityDO.injuriesDeaths
              var eventDescription3 = this.preserveData.reportSecurityDO.eventDescription
              var SecurityrelRelations = this.preserveData.reportSecurityDO.relAircraft
              if (SecurityrelRelations === true) {
                if (flightDate3 === '') {
                  this.$layer.msg('The flight date cannot be empty')
                } else if (airNumber3 === '') {
                  this.$layer.msg("The plane can't be empty")
                } else if (flightLeg3 === '') {
                  this.$layer.msg('The segment cannot be empty')
                } else if (secEventType11 === '') {
                  this.$layer.msg('Security incident type 1 cannot be empty')
                } else if (secEventType12 === '') {
                  this.$layer.msg('Security incident type 2 cannot be empty')
                } else if (aircraftDamage3 === '') {
                  this.$layer.msg('The aircraft cannot be empty')
                } else if (injuriesDeaths3 === '') {
                  this.$layer.msg('No loss of life')
                } else if (eventDescription3 === '') {
                  this.$layer.msg('A brief account cannot be empty')
                } else {
                  // 显示loading
                  this.fullscreenLoading = true
                  let data = JSON.parse(JSON.stringify(this.preserveData))
                  // console.log(data)
                  if (isNaN(Number(data.reportSecurityDO.eventGrade))) {
                    // 事件等级
                    data.reportSecurityDO.eventGrade = this.dataFilter(data.reportSecurityDO.eventGrade, 'EVENT_LEVEL')
                  }
                  if (isNaN(Number(data.reportSecurityDO.aircraftDamage))) {
                    // 航空器损坏
                    data.reportSecurityDO.aircraftDamage = this.dataFilter(data.reportSecurityDO.aircraftDamage, 'AIRCRAFT_DAMAGE')
                  }
                  if (isNaN(Number(data.reportSecurityDO.flightDelay))) {
                    // 航班延误情况
                    data.reportSecurityDO.flightDelay = this.dataFilter(data.reportSecurityDO.flightDelay, 'FLIGHT_DELAY')
                  }
                  getPreserveAction(data).then(result => {
                    // 关闭loading
                    this.fullscreenLoading = false
                    if (result.data.data && +result.data.error === 0 && this.saveStatus === true) {
                      this.saveError = +result.data.error
                      this.preserveData.reportNumber = result.data.data.reportNumber
                      this.saveStatus = false
                      // 保存成功可以点击发送
                      this.sendActin = true
                      // 保存按钮不可用
                      this.preserveDisabled = 'false'
                      // 启动流程
                      this.sendAction()
                    } else {
                      this.$layer.msg('submit failure：' + result.data.message)
                    }
                  })
                    .catch(error => {
                      this.$layer.msg('submit failure：' + error)
                      // 关闭loading
                      this.fullscreenLoading = false
                    })
                }
              } else if (aircraftDamage3 === '') {
                this.$layer.msg('The aircraft cannot be empty')
              } else if (injuriesDeaths3 === '') {
                this.$layer.msg('No loss of life')
              } else if (eventDescription3 === '') {
                this.$layer.msg('A brief account cannot be empty')
              } else {
                // 显示loading
                this.fullscreenLoading = true
                let data = JSON.parse(JSON.stringify(this.preserveData))
                // console.log(data)
                if (isNaN(Number(data.reportSecurityDO.eventGrade))) {
                  // 事件等级
                  data.reportSecurityDO.eventGrade = this.dataFilter(data.reportSecurityDO.eventGrade, 'EVENT_LEVEL')
                }
                if (isNaN(Number(data.reportSecurityDO.aircraftDamage))) {
                  // 航空器损坏
                  data.reportSecurityDO.aircraftDamage = this.dataFilter(data.reportSecurityDO.aircraftDamage, 'AIRCRAFT_DAMAGE')
                }
                if (isNaN(Number(data.reportSecurityDO.flightDelay))) {
                  // 航班延误情况
                  data.reportSecurityDO.flightDelay = this.dataFilter(data.reportSecurityDO.flightDelay, 'FLIGHT_DELAY')
                }
                getPreserveAction(data).then(result => {
                  // 关闭loading
                  this.fullscreenLoading = false
                  if (result.data.data && +result.data.error === 0 && this.saveStatus === true) {
                    this.saveError = +result.data.error
                    this.preserveData.reportNumber = result.data.data.reportNumber
                    this.saveStatus = false
                    // 保存成功可以点击发送
                    this.sendActin = true
                    // 保存按钮不可用
                    this.preserveDisabled = 'false'
                    // 启动流程
                    this.sendAction()
                  } else {
                    this.$layer.msg('submit failure：' + result.data.message)
                  }
                })
                  .catch(error => {
                    this.$layer.msg('submit failure：' + error)
                    // 关闭loading
                    this.fullscreenLoading = false
                  })
              }
            }
          }
        } else {
          // 保存按钮不可用
          this.preserveDisabled = 'false'
        }
      }
    },
    watch: {
      // 监听专业类型
      'preserveData.majorType': function (newVal) {
        this.preserveData.majorType = newVal
      }
    },
    mounted () {
      // 获取到所有下拉框的内容
      getAllDataAction().then(result => {
        // console.log(result)
        this.noticeLevelList = result.REPORT_TYPE.dicts
        if (result != null) {
          this.groundList = result
        }
      })
    }
  }
</script>
<style scoped>
.el-select{
  width: 100%;
}
.el-form-item{
  margin-bottom: 0;
}
.el-radio+.el-radio{
  margin-left: 10px;
}
.footer{
  margin-bottom: 0
}
</style>

