<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
        基本信息
      </b-card-header>
      <b-card-body>
        <el-form :model="preserveData" :rules="rules" ref="preserveData" status-icon size="medium" label-width="120px" inline-message>
        <div class="row">
          <div class="col-lg-4 col-md-6 col-sm-12">
            <el-form-item label="报告类型" prop="category">
              <el-select v-model="preserveData.category">
                <el-option v-for="(item, index) in noticeLevelList" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-12">
            <el-form-item label="是否匿名" prop="anonymous">
              <el-radio v-model="preserveData.anonymous" label='true'>是</el-radio>
              <el-radio v-model="preserveData.anonymous" label='false'>否</el-radio>
            </el-form-item>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-12" v-if="preserveData.anonymous == 'false'">
            <el-form-item label="报告人">
              <el-input v-model="preserveData.reporterName" disabled></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-12"  v-if="preserveData.anonymous == 'false'">
            <el-form-item label="所在部门" prop="deptName">
              <el-input v-model="preserveData.deptName" disabled></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-12">
            <el-form-item label="报告日期" prop="reportDate">
              <el-input v-model="preserveData.reportDate" disabled></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-12">
            <el-form-item label="联系电话" prop="telphone">
              <el-input v-model="preserveData.telphone" placeholder="请输入号码" maxlength="20"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-12">
            <el-form-item label="发生地点" prop="occurAddress">
              <el-input v-model="preserveData.occurAddress" placeholder="" maxlength="50"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-12">
            <el-form-item label="发生日期" prop="occurDate">
              <el-date-picker
                style="width: 100%;"
                v-model="preserveData.occurDate"
                type="date"
                placeholder="选择日期"
                align="right"
                :picker-options="pickerOptions1">
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="标题" prop="title">
          <el-input placeholder="请输入内容" v-model="preserveData.title" class="input-with-select" maxlength="200">
            <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 140px;" @change="selectAction">
              <el-option v-for="(item, index) in titles" :key="index" :label="item.dictCode" :value="item.dictCode"></el-option>
            </el-select>
          </el-input>
          <!-- <el-input v-model="preserveData.title" placeholder="" style="width: 100%" maxlength="200"></el-input> -->
        </el-form-item>
        <el-form-item label="专业类型" prop="majorType">
          <el-radio v-model="preserveData.majorType" label='1'>飞行</el-radio>
          <el-radio v-model="preserveData.majorType" label='2'>地面</el-radio>
          <el-radio v-model="preserveData.majorType" label='3'>安保</el-radio>
        </el-form-item>
        </el-form>
      </b-card-body>
    </b-card>
    <Flight v-if="preserveData.majorType == '1'" :byData="groundList" :compileData="sublistData" @getFlight="getFlightData" />
    <Ground v-else-if="preserveData.majorType == '2'" :byData="groundList" :compileData="sublistData" @getGround="getGroundData" />
    <Security v-else-if="preserveData.majorType == '3'" :byData="groundList" :compileData="sublistData" @getSecurity="getSecurityData" />
    <!-- 附件上传 -->
    <security-notice-adjunct ref='adjunct'></security-notice-adjunct>
    <b-card no-body>
      <b-card-body>
        <div style="text-align: center;">
          <div class="text-center">
            <el-steps :active="auditTypeNum" align-center>
              <el-step title="新建"></el-step>
              <el-step title="初评" description="安技部-安全绩效组"></el-step>
              <el-step title="单元审核" description="安技部-安全管理经理"></el-step>
              <el-step title="部门审核" description="安技部-部门管理团队"></el-step>
              <el-step title="处理意见" description="安技部-安全绩效组"></el-step>
              <el-step title="处理核准" description="安技部-安全管理经理"></el-step>
              <el-step title="结束"></el-step>
            </el-steps>
          </div>
          <el-button size='small' type="primary" @click="preserveAction" :disabled="preserveDisabled === 'false'"
            v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
          <el-button size='small' type="success" @click="sendAction" :disabled="sendActin === 'false'"
            v-loading.fullscreen.lock="fullscreenLoading">发送</el-button>
          <el-button size='small' @click="gobackAction">返回</el-button>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
  // 飞行 地面 安保
  import Flight from '../common/Flight'
  import Ground from '../common/Ground'
  import Security from '../common/Security'
  // 过滤
  // import { filterNameChange } from '../../filter/reportFilter.js'
  import { getAllDataAction, getPreserveAction, initiatorProcedureAction } from '../../services/information_report'
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
      Flight,
      Ground,
      Security,
      SecurityNoticeAdjunct
    },
    data () {
      // 判断手机号显示格式
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(
            this.$message({
              type: 'info',
              message: '手机号不能为空!'
            })
          )
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          if (reg.test(value)) {
            callback()
          } else {
            return callback(
              this.$message({
                type: 'info',
                message: '请输入正确的手机号!'
              })
            )
          }
        }
      }
      return {
        preserveData: {
          reportNumber: 0,
          // 报告类型
          category: '自愿报告',
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
          },
          // 飞行事情简要经过模板
          EVENT_FILGHT_TITLE: {
            dicts: []
          },
          // 地面事情简要经过模板
          EVENT_GROUND_TITLE: {
            dicts: []
          },
          // 安保事情简要经过模板
          EVENT_SECURITY_TITLE: {
            dicts: []
          }
        },
        sublistData: {},
        noticeLevelList: [],
        saveError: 1,
        // 保存时的状态
        saveStatus: true,
        rules: {
          telphone: [
            { required: true,  message: '手机号不能为空哦', trigger: 'blur'}
          ],
          category: [
            { required: true, message: '报告类型不能为空哦', trigger: 'change' },
          ],
          occurDate: [
            { required: true, message: '发生日期不能为空哦', trigger: 'blur' }
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
        // 流程图对应的值
        auditTypeNum: 0,
        // 标题对应的数据
        select: '',
        titles: []
      }
    },
    computed: {
      // 所有数据字典中的数据
      ALL_SELECT_DATA () {
       return this.$store.state.ALL_SELECT_DATA
      }
    },
    methods: {
      // 将code值转为name值
      dataFilter (avlue, type) {
        let sourceData = this.ALL_SELECT_DATA[type]
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
              this.$message({
                type: 'success',
                message: '发送成功!'
              })
              // 修改成功跳转到列表页面
              this.$router.push({path: '/report/list'})
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
          this.$message({
            type: 'info',
            message: '请先保存'
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
          var {category, occurDate, occurAddress, majorType, title} = this.preserveData
          this.preserveData.attList = this.$refs.adjunct.fileFormList
          // 判断必选框当中的内容不能为空
          if (category === '') {
            this.$message({
              type: 'info',
              message: '报告类型不能为空哦'
            })
          } else if (occurDate === '') {
            this.$message({
              type: 'info',
              message: '发生日期不能为空哦'
            })
          } else if (occurAddress === '') {
            this.$message({
              type: 'info',
              message: '发生地点不能为空哦'
            })
          } else if (title === '') {
            this.$message({
              type: 'info',
              message: '标题不能为空哦'
            })
          } else if (majorType === 0) {
            this.$message({
              type: 'info',
              message: '专业类型不能为空哦'
            })
          } else {
            var {flightDate, airNumber, flightLeg, flightName, flightPhase, eventType, aircraftDamage, injuriesDeaths, eventDescription} = this.preserveData.reportFlyDO
            if (majorType === '1') {
              if (flightDate === '') {
                this.$message({
                  type: 'info',
                  message: '航班日期不能为空哦'
                })
              } else if (airNumber === '') {
                this.$message({
                  type: 'info',
                  message: '飞机号不能为空哦'
                })
              } else if (flightLeg === '') {
                this.$message({
                  type: 'info',
                  message: '航段不能为空哦'
                })
              } else if (flightName === '') {
                this.$message({
                  type: 'info',
                  message: '飞行性质不能为空哦'
                })
              } else if (flightPhase === '') {
                this.$message({
                  type: 'info',
                  message: '飞行阶段不能为空哦'
                })
              } else if (eventType === '') {
                this.$message({
                  type: 'info',
                  message: '事件类型不能为空哦'
                })
              } else if (aircraftDamage === '') {
                this.$message({
                  type: 'info',
                  message: '航空器损坏不能为空哦'
                })
              } else if (injuriesDeaths === '') {
                this.$message({
                  type: 'info',
                  message: '有无人员伤亡不能为空哦'
                })
              } else if (eventDescription === '') {
                this.$message({
                  type: 'info',
                  message: '事情简要经过不能为空哦'
                })
              } else {
                // 显示loading
                this.fullscreenLoading = true
                let data = JSON.parse(JSON.stringify(this.preserveData))
                // console.log(data)
                if (isNaN(Number(data.category))) {
                  data.category = this.dataFilter(data.category, 'REPORT_TYPE')
                }
                if (isNaN(Number(data.reportFlyDO.eventGrade))) {
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
                  .catch(error => {
                    this.$message({
                      type: 'error',
                      message: '保存失败：' + error
                    })
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
                  this.$message({
                    type: 'info',
                    message: '机型不能为空哦'
                  })
                } else if (acNo1 === '' && acNo2 === '') {
                  this.$message({
                    type: 'info',
                    message: '飞机号不能为空哦'
                  })
                } else if (runPhase1 === '' && runPhase2 === '') {
                  this.$message({
                    type: 'info',
                    message: '运行阶段不能为空哦'
                  })
                } else if (relCar === true) {
                  if (carType1 === '' && carType2 === '') {
                    this.$message({
                      type: 'info',
                      message: '车辆类型不能为空哦'
                    })
                  } else if (relGroundDevice === true) {
                    if (deviceName === '') {
                      this.$message({
                        type: 'info',
                        message: '地面设施/设备名不能为空哦'
                      })
                    } else if (eventType2 === '') {
                      this.$message({
                        type: 'info',
                        message: '事件类型不能为空哦'
                      })
                    } else if (causeType === '') {
                      this.$message({
                        type: 'info',
                        message: '原因分类不能为空哦'
                      })
                    } else if (aircraftDamage2 === '') {
                      this.$message({
                        type: 'info',
                        message: '航空器损坏不能为空哦'
                      })
                    } else if (injuriesDeaths2 === '') {
                      this.$message({
                        type: 'info',
                        message: '有无人员伤亡不能为空哦'
                      })
                    } else if (eventDescription2 === '') {
                      this.$message({
                        type: 'info',
                        message: '事情简要经过不能为空哦'
                      })
                    } else {
                      // 显示loading
                      this.fullscreenLoading = true
                      let data = JSON.parse(JSON.stringify(this.preserveData))
                      // console.log(data)
                      if (isNaN(Number(data.category))) {
                        data.category = this.dataFilter(data.category, 'REPORT_TYPE')
                      }
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
                          this.saveStatus = false
                          this.saveError = +result.data.error
                          this.preserveData.reportNumber = result.data.data.reportNumber
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
                        .catch(error => {
                          this.$message({
                            type: 'error',
                            message: '保存失败：' + error
                          })
                          // 关闭loading
                          this.fullscreenLoading = false
                        })
                    }
                  } else {
                    if (eventType2 === '') {
                      this.$message({
                        type: 'info',
                        message: '事件类型不能为空哦'
                      })
                    } else if (causeType === '') {
                      this.$message({
                        type: 'info',
                        message: '原因分类不能为空哦'
                      })
                    } else if (aircraftDamage2 === '') {
                      this.$message({
                        type: 'info',
                        message: '航空器损坏不能为空哦'
                      })
                    } else if (injuriesDeaths2 === '') {
                      this.$message({
                        type: 'info',
                        message: '有无人员伤亡不能为空哦'
                      })
                    } else if (eventDescription2 === '') {
                      this.$message({
                        type: 'info',
                        message: '事情简要经过不能为空哦'
                      })
                    } else {
                      // 显示loading
                      this.fullscreenLoading = true
                      let data = JSON.parse(JSON.stringify(this.preserveData))
                      // console.log(data)
                      if (isNaN(Number(data.category))) {
                        data.category = this.dataFilter(data.category, 'REPORT_TYPE')
                      }
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
                        // 保存成功后关闭loading
                        this.fullscreenLoading = false
                        if (result.data.data && +result.data.error === 0 && this.saveStatus === true) {
                          this.saveStatus = false
                          this.saveError = +result.data.error
                          this.preserveData.reportNumber = result.data.data.reportNumber
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
                        .catch(error => {
                          this.$message({
                            type: 'error',
                            message: '保存失败：' + error
                          })
                          // 关闭loading
                          this.fullscreenLoading = false
                        })
                    }
                  }
                } else {
                  if (relGroundDevice === true) {
                    if (deviceName === '') {
                      this.$message({
                        type: 'info',
                        message: '地面设施/设备名不能为空哦'
                      })
                    } else if (eventType2 === '') {
                      this.$message({
                        type: 'info',
                        message: '事件类型不能为空哦'
                      })
                    } else if (causeType === '') {
                      this.$message({
                        type: 'info',
                        message: '原因分类不能为空哦'
                      })
                    } else if (aircraftDamage2 === '') {
                      this.$message({
                        type: 'info',
                        message: '航空器损坏不能为空哦'
                      })
                    } else if (injuriesDeaths2 === '') {
                      this.$message({
                        type: 'info',
                        message: '有无人员伤亡不能为空哦'
                      })
                    } else if (eventDescription2 === '') {
                      this.$message({
                        type: 'info',
                        message: '事情简要经过不能为空哦'
                      })
                    } else {
                      // 显示loading
                      this.fullscreenLoading = true
                      let data = JSON.parse(JSON.stringify(this.preserveData))
                      // console.log(data)
                      if (isNaN(Number(data.category))) {
                        data.category = this.dataFilter(data.category, 'REPORT_TYPE')
                      }
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
                          this.saveStatus = false
                          this.saveError = +result.data.error
                          this.preserveData.reportNumber = result.data.data.reportNumber
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
                        .catch(error => {
                          // 关闭loading
                          this.fullscreenLoading = false
                          this.$message({
                            type: 'error',
                            message: '保存失败：' + error
                          })
                        })
                    }
                  } else {
                    if (eventType2 === '') {
                      this.$message({
                        type: 'info',
                        message: '事件类型不能为空哦'
                      })
                    } else if (causeType === '') {
                      this.$message({
                        type: 'info',
                        message: '原因分类不能为空哦'
                      })
                    } else if (aircraftDamage2 === '') {
                      this.$message({
                        type: 'info',
                        message: '航空器损坏不能为空哦'
                      })
                    } else if (injuriesDeaths2 === '') {
                      this.$message({
                        type: 'info',
                        message: '有无人员伤亡不能为空哦'
                      })
                    } else if (eventDescription2 === '') {
                      this.$message({
                        type: 'info',
                        message: '事情简要经过不能为空哦'
                      })
                    } else {
                      // 显示loading
                      this.fullscreenLoading = true
                      let data = JSON.parse(JSON.stringify(this.preserveData))
                      // console.log(data)
                      if (isNaN(Number(data.category))) {
                        data.category = this.dataFilter(data.category, 'REPORT_TYPE')
                      }
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
                          this.saveStatus = false
                          this.saveError = +result.data.error
                          this.preserveData.reportNumber = result.data.data.reportNumber
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
                        .catch(error => {
                          // 关闭loading
                          this.fullscreenLoading = false
                          this.$message({
                            type: 'error',
                            message: '保存失败：' + error
                          })
                        })
                    }
                  }
                }
              } else if (relCar === true) {
                if (carType1 === '' && carType2 === '') {
                  this.$message({
                    type: 'info',
                    message: '车辆类型不能为空哦'
                  })
                } else if (relGroundDevice === true) {
                  if (deviceName === '') {
                    this.$message({
                      type: 'info',
                      message: '地面设施/设备名不能为空哦'
                    })
                  } else if (eventType2 === '') {
                    this.$message({
                      type: 'info',
                      message: '事件类型不能为空哦'
                    })
                  } else if (causeType === '') {
                    this.$message({
                      type: 'info',
                      message: '原因分类不能为空哦'
                    })
                  } else if (aircraftDamage2 === '') {
                    this.$message({
                      type: 'info',
                      message: '航空器损坏不能为空哦'
                    })
                  } else if (injuriesDeaths2 === '') {
                    this.$message({
                      type: 'info',
                      message: '有无人员伤亡不能为空哦'
                    })
                  } else if (eventDescription2 === '') {
                    this.$message({
                      type: 'info',
                      message: '事情简要经过不能为空哦'
                    })
                  } else {
                    // 显示loading
                    this.fullscreenLoading = true
                    let data = JSON.parse(JSON.stringify(this.preserveData))
                    // console.log(data)
                    if (isNaN(Number(data.category))) {
                      data.category = this.dataFilter(data.category, 'REPORT_TYPE')
                    }
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
                        this.saveStatus = false
                        this.saveError = +result.data.error
                        this.preserveData.reportNumber = result.data.data.reportNumber
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
                      .catch(error => {
                        // 关闭loading
                        this.fullscreenLoading = false
                        this.$message({
                          type: 'error',
                          message: '保存失败：' + error
                        })
                      })
                  }
                } else if (eventType2 === '') {
                  this.$message({
                    type: 'info',
                    message: '事件类型不能为空哦'
                  })
                } else if (causeType === '') {
                  this.$message({
                    type: 'info',
                    message: '原因分类不能为空哦'
                  })
                } else if (aircraftDamage2 === '') {
                  this.$message({
                    type: 'info',
                    message: '航空器损坏不能为空哦'
                  })
                } else if (injuriesDeaths2 === '') {
                  this.$message({
                    type: 'info',
                    message: '有无人员伤亡不能为空哦'
                  })
                } else if (eventDescription2 === '') {
                  this.$message({
                    type: 'info',
                    message: '事情简要经过不能为空哦'
                  })
                } else {
                  // 显示loading
                  this.fullscreenLoading = true
                  let data = JSON.parse(JSON.stringify(this.preserveData))
                  // console.log(data)
                  if (isNaN(Number(data.category))) {
                    data.category = this.dataFilter(data.category, 'REPORT_TYPE')
                  }
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
                      this.saveStatus = false
                      this.saveError = +result.data.error
                      this.preserveData.reportNumber = result.data.data.reportNumber
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
                    .catch(error => {
                      // 关闭loading
                      this.fullscreenLoading = false
                      this.$message({
                        type: 'error',
                        message: '保存失败：' + error
                      })
                    })
                }
              } else if (relGroundDevice === true) {
                if (deviceName === '') {
                  this.$message({
                    type: 'info',
                    message: '地面设施/设备名不能为空哦'
                  })
                } else if (eventType2 === '') {
                  this.$message({
                    type: 'info',
                    message: '事件类型不能为空哦'
                  })
                } else if (causeType === '') {
                  this.$message({
                    type: 'info',
                    message: '原因分类不能为空哦'
                  })
                } else if (aircraftDamage2 === '') {
                  this.$message({
                    type: 'info',
                    message: '航空器损坏不能为空哦'
                  })
                } else if (injuriesDeaths2 === '') {
                  this.$message({
                    type: 'info',
                    message: '有无人员伤亡不能为空哦'
                  })
                } else if (eventDescription2 === '') {
                  this.$message({
                    type: 'info',
                    message: '事情简要经过不能为空哦'
                  })
                } else {
                  // 显示loading
                  this.fullscreenLoading = true
                  let data = JSON.parse(JSON.stringify(this.preserveData))
                  // console.log(data)
                  if (isNaN(Number(data.category))) {
                    data.category = this.dataFilter(data.category, 'REPORT_TYPE')
                  }
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
                      this.saveStatus = false
                      this.saveError = +result.data.error
                      this.preserveData.reportNumber = result.data.data.reportNumber
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
                    .catch(error => {
                      // 关闭loading
                      this.fullscreenLoading = false
                      this.$message({
                        type: 'error',
                        message: '保存失败：' + error
                      })
                    })
                }
              } else if (eventType2 === '') {
                this.$message({
                  type: 'info',
                  message: '事件类型不能为空哦'
                })
              } else if (causeType === '') {
                this.$message({
                  type: 'info',
                  message: '原因分类不能为空哦'
                })
              } else if (aircraftDamage2 === '') {
                this.$message({
                  type: 'info',
                  message: '航空器损坏不能为空哦'
                })
              } else if (injuriesDeaths2 === '') {
                this.$message({
                  type: 'info',
                  message: '有无人员伤亡不能为空哦'
                })
              } else if (eventDescription2 === '') {
                this.$message({
                  type: 'info',
                  message: '事情简要经过不能为空哦'
                })
              } else {
                // 显示loading
                this.fullscreenLoading = true
                let data = JSON.parse(JSON.stringify(this.preserveData))
                // console.log(data)
                if (isNaN(Number(data.category))) {
                  data.category = this.dataFilter(data.category, 'REPORT_TYPE')
                }
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
                    this.saveStatus = false
                    this.saveError = +result.data.error
                    this.preserveData.reportNumber = result.data.data.reportNumber
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
                  .catch(error => {
                    // 关闭loading
                    this.fullscreenLoading = false
                    this.$message({
                      type: 'error',
                      message: '保存失败：' + error
                    })
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
                  this.$message({
                    type: 'info',
                    message: '航班日期不能为空哦'
                  })
                } else if (airNumber3 === '') {
                  this.$message({
                    type: 'info',
                    message: '飞机号不能为空哦'
                  })
                } else if (flightLeg3 === '') {
                  this.$message({
                    type: 'info',
                    message: '航段不能为空哦'
                  })
                } else if (secEventType11 === '') {
                  this.$message({
                    type: 'info',
                    message: '安保事件类型1不能为空哦'
                  })
                } else if (secEventType12 === '') {
                  this.$message({
                    type: 'info',
                    message: '安保事件类型2不能为空哦'
                  })
                } else if (aircraftDamage3 === '') {
                  this.$message({
                    type: 'info',
                    message: '航空器损坏不能为空哦'
                  })
                } else if (injuriesDeaths3 === '') {
                  this.$message({
                    type: 'info',
                    message: '有无人员伤亡不能为空哦'
                  })
                } else if (eventDescription3 === '') {
                  this.$message({
                    type: 'info',
                    message: '事情简要经过不能为空哦'
                  })
                } else {
                  // 显示loading
                  this.fullscreenLoading = true
                  let data = JSON.parse(JSON.stringify(this.preserveData))
                  // console.log(data)
                  if (isNaN(Number(data.category))) {
                    data.category = this.dataFilter(data.category, 'REPORT_TYPE')
                  }
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
                    // 保存成功后关闭loading
                    this.fullscreenLoading = false
                    if (result.data.data && +result.data.error === 0 && this.saveStatus === true) {
                      this.saveStatus = false
                      this.saveError = +result.data.error
                      this.preserveData.reportNumber = result.data.data.reportNumber
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
                    .catch(error => {
                      // 保存成功后关闭loading
                      this.fullscreenLoading = false
                      this.$message({
                        type: 'error',
                        message: error
                      })
                    })
                }
              } else if (aircraftDamage3 === '') {
                this.$message({
                  type: 'info',
                  message: '航空器损坏不能为空哦'
                })
              } else if (injuriesDeaths3 === '') {
                this.$message({
                  type: 'info',
                  message: '有无人员伤亡不能为空哦'
                })
              } else if (eventDescription3 === '') {
                this.$message({
                  type: 'info',
                  message: '事情简要经过不能为空哦'
                })
              } else {
                // 显示loading
                this.fullscreenLoading = true
                let data = JSON.parse(JSON.stringify(this.preserveData))
                // console.log(data)
                if (isNaN(Number(data.category))) {
                  data.category = this.dataFilter(data.category, 'REPORT_TYPE')
                }
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
                    this.saveStatus = false
                    this.saveError = +result.data.error
                    this.preserveData.reportNumber = result.data.data.reportNumber
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
                  .catch(error => {
                    // 保存成功后关闭loading
                    this.fullscreenLoading = false
                    this.$message({
                      type: 'error',
                      message: '保存失败：' + error
                    })
                  })
              }
            }
          }
        } else {
          // 保存按钮不可用
          this.preserveDisabled = 'false'
        }
      },
      // 返回按钮
      gobackAction () {
        this.$router.push({
          path: '/report/list'
        })
      },
      // 标题模板
      selectAction () {
        if (this.titles.length > 0) {
          for (var i = 0; i < this.titles.length; i++) {
            if (this.select === this.titles[i].dictCode) {
              this.preserveData.title = this.titles[i].dictName
            }
          }
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
      // console.log(this.$store.state.user)
      let user = this.$store.state.user
      // 部门ID和部门名称
      this.preserveData.deptId = user.deptId
      this.preserveData.deptName = user.deptName
      // 用户ID和名字
      this.preserveData.reporter = user.userId
      this.preserveData.reporterName = user.userName
      // 联系电话
      this.preserveData.telphone = user.userPhone
      // 获取到所有下拉框的内容
      getAllDataAction().then(result => {
        // console.log(result)
        this.noticeLevelList = result.REPORT_TYPE ? result.REPORT_TYPE.dicts : []
        this.titles = result.INFOR_REPORT_Title ?  result.INFOR_REPORT_Title.dicts : []
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
</style>

