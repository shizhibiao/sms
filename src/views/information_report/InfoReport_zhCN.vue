<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
        信息上报
      </b-card-header>
      <b-card-body>
        <el-form :model="preserveData" :rules="rules" ref="preserveData" status-icon size="medium" label-width="80px" inline-message>
          <div class="row">
            <div class="col-sm-12">
              <el-form-item label="报告类型" prop="category">
                <el-select v-model="preserveData.category">
                  <el-option v-for="(item, index) in noticeLevelList" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-sm-12">
              <el-form-item label="是否匿名" prop="anonymous">
                <el-radio v-model="preserveData.anonymous" label='false'>否</el-radio>
                <el-radio v-model="preserveData.anonymous" label='true'>是</el-radio>
              </el-form-item>
            </div>
            <div class="col-sm-12" v-if="preserveData.anonymous == 'false'">
              <el-form-item label="报告人" prop="reporter">
                <el-select
                    v-model="preserveData.reporter"
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
                  v-model="preserveData.reporterName"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入内容"
                  @select="handleSelect"
                  @blur="verifyReportHandler"
                ></el-autocomplete> -->
              </el-form-item>
            </div>
            <div class="col-sm-12"  v-if="preserveData.anonymous == 'false'">
              <el-form-item label="所在部门" prop="deptName">
                <el-input v-model="preserveData.deptName" disabled></el-input>
              </el-form-item>
            </div>
            <div class="col-sm-12">
              <el-form-item label="报告日期" prop="reportDate">
                <el-input v-model="preserveData.reportDate" disabled></el-input>
              </el-form-item>
            </div>
            <div class="col-sm-12">
              <el-form-item label="联系电话" prop="telphone">
                <el-input v-model="preserveData.telphone" placeholder="请输入号码" maxlength="20"></el-input>
              </el-form-item>
            </div>
            <div class="col-sm-12">
              <el-form-item label="发生地点" prop="occurAddress">
                <el-input v-model="preserveData.occurAddress" placeholder="" maxlength="50"></el-input>
              </el-form-item>
            </div>
            <div class="col-sm-12">
              <el-form-item label="发生日期" prop="occurDate">
                <el-date-picker
                  style="width: 100%;"
                  v-model="preserveData.occurDate"
                  type="date"
                  placeholder="选择日期"
                  align="right">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="标题" prop="title">
            <el-input v-model="preserveData.title" placeholder="" style="width: 100%" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="专业类型" prop="majorType">
            <el-radio v-model="preserveData.majorType" label='1'>飞行</el-radio>
            <el-radio v-model="preserveData.majorType" label='2'>地面</el-radio>
            <el-radio v-model="preserveData.majorType" label='3'>安保</el-radio>
          </el-form-item>
        </el-form>
      </b-card-body>
    </b-card>
    <AppFlight v-if="preserveData.majorType == '1'" :byData="groundList" :compileData="sublistData" @getFlight="getFlightData" />
    <AppGround v-else-if="preserveData.majorType == '2'" :byData="groundList" :compileData="sublistData" @getGround="getGroundData" />
    <AppSecurity v-else-if="preserveData.majorType == '3'" :byData="groundList" :compileData="sublistData" @getSecurity="getSecurityData" />
    <!-- 附件上传 -->
    <security-notice-adjunct ref='adjunct'></security-notice-adjunct>
    <b-card no-body class="footer">
      <b-card-body>
        <div style="text-align: center;">
          <el-button size='small' type="primary" @click="preserveAction" :disabled="preserveDisabled === 'false'"
            v-loading.fullscreen.lock="fullscreenLoading">提交</el-button>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
  import axios from 'axios'
  // 飞行 地面 安保
  import AppFlight from '../common/app_Flight.vue'
  import AppGround from '../common/app_Ground.vue'
  import AppSecurity from '../common/app_Security.vue'
  // 过滤
  // import { filterNameChange } from '../../filter/reportFilter.js'
  import { getAllDataAction, getPreserveAction, initiatorProcedureAction, getSelectUserAllAction } from '../../services/information_report'
  // 附件上传
  import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
  import { sourceDataFilterOpposite } from '../../tools'
  import { formatDate } from '../../utils/index.js'

  export default {
    name: 'SecurityNoticeList',
    props: {
      reportNumber: Number
    },
    components: {
      AppFlight,
      AppGround,
      AppSecurity,
      SecurityNoticeAdjunct
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
            { required: true, message: '手机号不能为空哦', trigger: 'change'}
          ],
          reporterName: [
            { required: true, message: '请选择您所对应的名字', trigger: 'change'}
          ],
          category: [
            { required: true, message: '报告类型不能为空哦', trigger: 'change' },
          ],
          occurDate: [
            { required: true, message: '发生日期不能为空哦', trigger: 'change' }
          ],
          occurAddress: [
            { required: true, message: '发生地点不能为空哦', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '标题不能为空哦', trigger: 'blur' }
          ],
          majorType: [
            { required: true, message: '专业类型不能为空哦', trigger: 'change' }
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
        let result = sourceDataFilterOpposite(sourceData, avlue)
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
              this.$layer.msg('信息上报成功!')
              // 修改成功跳转到列表页面
              // this.$router.push({path: '/report/list'})
            } else {
              this.$layer.msg('信息上报成功但是流程启动失败，请到PC端启动流程：' + result.data.message)
            }
          })
            .catch(error => {
              this.$layer.msg('信息上报失败：' + error)
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
            this.$layer.msg('报告类型不能为空哦')
          } else if (reporterName === '') {
            this.$layer.msg('报告人不能为空哦')
          } else if (telphone === '') {
            this.$layer.msg('手机号不能为空哦')
          } else if (occurDate === '') {
            this.$layer.msg('发生日期不能为空哦')
          } else if (occurAddress === '') {
            this.$layer.msg('发生地点不能为空哦')
          } else if (title === '') {
            this.$layer.msg('标题不能为空哦')
          } else if (majorType === 0) {
            this.$layer.msg('专业类型不能为空哦')
          } else {
            var {flightDate, airNumber, flightLeg, flightName, flightPhase, eventType, aircraftDamage, injuriesDeaths, eventDescription} = this.preserveData.reportFlyDO
            if (majorType === '1') {
              if (flightDate === '') {
                this.$layer.msg('航班日期不能为空哦')
              } else if (airNumber === '') {
                this.$layer.msg('飞机号不能为空哦')
              } else if (flightLeg === '') {
                this.$layer.msg('航段不能为空哦')
              } else if (flightName === '') {
                this.$layer.msg('飞行性质不能为空哦')
              } else if (flightPhase === '') {
                this.$layer.msg('飞行阶段不能为空哦')
              } else if (eventType === '') {
                this.$layer.msg('事件类型不能为空哦')
              } else if (aircraftDamage === '') {
                this.$layer.msg('航空器损坏不能为空哦')
              } else if (injuriesDeaths === '') {
                this.$layer.msg('有无人员伤亡不能为空哦')
              } else if (eventDescription === '') {
                this.$layer.msg('事情简要经过不能为空哦')
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
                    this.$layer.msg('保存失败：' + result.data.message)
                  }
                })
                  .catch(error => {
                    this.$layer.msg('保存失败：' + error)
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
                  this.$layer.msg('机型不能为空哦')
                } else if (acNo1 === '' && acNo2 === '') {
                  this.$layer.msg('飞机号不能为空哦')
                } else if (runPhase1 === '' && runPhase2 === '') {
                  this.$layer.msg('运行阶段不能为空哦')
                } else if (relCar === true) {
                  if (carType1 === '' && carType2 === '') {
                    this.$layer.msg('车辆类型不能为空哦')
                  } else if (relGroundDevice === true) {
                    if (deviceName === '') {
                      this.$layer.msg('地面设施/设备名不能为空哦')
                    } else if (eventType2 === '') {
                      this.$layer.msg('事件类型不能为空哦')
                    } else if (causeType === '') {
                      this.$layer.msg('原因分类不能为空哦')
                    } else if (aircraftDamage2 === '') {
                      this.$layer.msg('航空器损坏不能为空哦')
                    } else if (injuriesDeaths2 === '') {
                      this.$layer.msg('有无人员伤亡不能为空哦')
                    } else if (eventDescription2 === '') {
                      this.$layer.msg('事情简要经过不能为空哦')
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
                          this.$layer.msg('保存失败：' + result.data.message)
                        }
                      })
                        .catch(error => {
                          this.$layer.msg('保存失败：' + error)
                          // 关闭loading
                          this.fullscreenLoading = false
                        })
                    }
                  } else {
                    if (eventType2 === '') {
                      this.$layer.msg('事件类型不能为空哦')
                    } else if (causeType === '') {
                      this.$layer.msg('原因分类不能为空哦')
                    } else if (aircraftDamage2 === '') {
                      this.$layer.msg('航空器损坏不能为空哦')
                    } else if (injuriesDeaths2 === '') {
                      this.$layer.msg('有无人员伤亡不能为空哦')
                    } else if (eventDescription2 === '') {
                      this.$layer.msg('事情简要经过不能为空哦')
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
                          this.$layer.msg('保存失败：' + result.data.message)
                        }
                      })
                        .catch(error => {
                          this.$layer.msg('保存失败：' + error)
                          // 关闭loading
                          this.fullscreenLoading = false
                        })
                    }
                  }
                } else {
                  if (relGroundDevice === true) {
                    if (deviceName === '') {
                      this.$layer.msg('地面设施/设备名不能为空哦')
                    } else if (eventType2 === '') {
                      this.$layer.msg('事件类型不能为空哦')
                    } else if (causeType === '') {
                      this.$layer.msg('原因分类不能为空哦')
                    } else if (aircraftDamage2 === '') {
                      this.$layer.msg('航空器损坏不能为空哦')
                    } else if (injuriesDeaths2 === '') {
                      this.$layer.msg('有无人员伤亡不能为空哦')
                    } else if (eventDescription2 === '') {
                      this.$layer.msg('事情简要经过不能为空哦')
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
                          this.$layer.msg('保存失败：' + result.data.message)
                        }
                      })
                        .catch(error => {
                          this.$layer.msg('保存失败：' + error)
                          // 关闭loading
                          this.fullscreenLoading = false
                        })
                    }
                  } else {
                    if (eventType2 === '') {
                      this.$layer.msg('事件类型不能为空哦')
                    } else if (causeType === '') {
                      this.$layer.msg('原因分类不能为空哦')
                    } else if (aircraftDamage2 === '') {
                      this.$layer.msg('航空器损坏不能为空哦')
                    } else if (injuriesDeaths2 === '') {
                      this.$layer.msg('有无人员伤亡不能为空哦')
                    } else if (eventDescription2 === '') {
                      this.$layer.msg('事情简要经过不能为空哦')
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
                          this.$layer.msg('保存失败：' + result.data.message)
                        }
                      })
                        .catch(error => {
                          this.$layer.msg('保存失败：' + error)
                          // 关闭loading
                          this.fullscreenLoading = false
                        })
                    }
                  }
                }
              } else if (relCar === true) {
                if (carType1 === '' && carType2 === '') {
                  this.$layer.msg('车辆类型不能为空哦')
                } else if (relGroundDevice === true) {
                  if (deviceName === '') {
                    this.$layer.msg('地面设施/设备名不能为空哦')
                  } else if (eventType2 === '') {
                    this.$layer.msg('事件类型不能为空哦')
                  } else if (causeType === '') {
                    this.$layer.msg('原因分类不能为空哦')
                  } else if (aircraftDamage2 === '') {
                    this.$layer.msg('航空器损坏不能为空哦')
                  } else if (injuriesDeaths2 === '') {
                    this.$layer.msg('有无人员伤亡不能为空哦')
                  } else if (eventDescription2 === '') {
                    this.$layer.msg('事情简要经过不能为空哦')
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
                          this.$layer.msg('保存失败：' + result.data.message)
                        }
                      })
                        .catch(error => {
                          this.$layer.msg('保存失败：' + error)
                          // 关闭loading
                          this.fullscreenLoading = false
                        })
                  }
                } else if (eventType2 === '') {
                  this.$layer.msg('事件类型不能为空哦')
                } else if (causeType === '') {
                  this.$layer.msg('原因分类不能为空哦')
                } else if (aircraftDamage2 === '') {
                  this.$layer.msg('航空器损坏不能为空哦')
                } else if (injuriesDeaths2 === '') {
                  this.$layer.msg('有无人员伤亡不能为空哦')
                } else if (eventDescription2 === '') {
                  this.$layer.msg('事情简要经过不能为空哦')
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
                      this.$layer.msg('保存失败：' + result.data.message)
                    }
                  })
                    .catch(error => {
                      this.$layer.msg('保存失败：' + error)
                      // 关闭loading
                      this.fullscreenLoading = false
                    })
                }
              } else if (relGroundDevice === true) {
                if (deviceName === '') {
                  this.$layer.msg('地面设施/设备名不能为空哦')
                } else if (eventType2 === '') {
                  this.$layer.msg('事件类型不能为空哦')
                } else if (causeType === '') {
                  this.$layer.msg('原因分类不能为空哦')
                } else if (aircraftDamage2 === '') {
                  this.$layer.msg('航空器损坏不能为空哦')
                } else if (injuriesDeaths2 === '') {
                  this.$layer.msg('有无人员伤亡不能为空哦')
                } else if (eventDescription2 === '') {
                  this.$layer.msg('事情简要经过不能为空哦')
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
                      this.$layer.msg('保存失败：' + result.data.message)
                    }
                  })
                    .catch(error => {
                      this.$layer.msg('保存失败：' + error)
                      // 关闭loading
                      this.fullscreenLoading = false
                    })
                }
              } else if (eventType2 === '') {
                this.$layer.msg('事件类型不能为空哦')
              } else if (causeType === '') {
                this.$layer.msg('原因分类不能为空哦')
              } else if (aircraftDamage2 === '') {
                this.$layer.msg('航空器损坏不能为空哦')
              } else if (injuriesDeaths2 === '') {
                this.$layer.msg('有无人员伤亡不能为空哦')
              } else if (eventDescription2 === '') {
                this.$layer.msg('事情简要经过不能为空哦')
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
                    this.$layer.msg('保存失败：' + result.data.message)
                  }
                })
                  .catch(error => {
                    this.$layer.msg('保存失败：' + error)
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
                  this.$layer.msg('航班日期不能为空哦')
                } else if (airNumber3 === '') {
                  this.$layer.msg('飞机号不能为空哦')
                } else if (flightLeg3 === '') {
                  this.$layer.msg('航段不能为空哦')
                } else if (secEventType11 === '') {
                  this.$layer.msg('安保事件类型1不能为空哦')
                } else if (secEventType12 === '') {
                  this.$layer.msg('安保事件类型2不能为空哦')
                } else if (aircraftDamage3 === '') {
                  this.$layer.msg('航空器损坏不能为空哦')
                } else if (injuriesDeaths3 === '') {
                  this.$layer.msg('有无人员伤亡不能为空哦')
                } else if (eventDescription3 === '') {
                  this.$layer.msg('事情简要经过不能为空哦')
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
                      this.$layer.msg('保存失败：' + result.data.message)
                    }
                  })
                    .catch(error => {
                      this.$layer.msg('保存失败：' + error)
                      // 关闭loading
                      this.fullscreenLoading = false
                    })
                }
              } else if (aircraftDamage3 === '') {
                this.$layer.msg('航空器损坏不能为空哦')
              } else if (injuriesDeaths3 === '') {
                this.$layer.msg('有无人员伤亡不能为空哦')
              } else if (eventDescription3 === '') {
                this.$layer.msg('事情简要经过不能为空哦')
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
                    this.$layer.msg('保存失败：' + result.data.message)
                  }
                })
                  .catch(error => {
                    this.$layer.msg('保存失败：' + error)
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

