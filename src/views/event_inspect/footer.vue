<template>
    <div class="animated fadeIn">
      <!-- 查询页面进入 -->
      <el-form :model="eventDO" label-width="120px">
        <b-card no-body>
          <div slot="header">
            基本信息
            <div class="card-actions">
              <b-btn class="btn btn-minimize" @click="Actions" v-b-toggle.collapse1ss>
                <i class="icon-arrow-down" ref="upDow"></i>
              </b-btn>
            </div>
        </div>
         <b-collapse id="collapse1ss" visible>
          <b-card-body>
            <div class="row">
                 <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="事件来源">
                   {{sourecelist(eventDO.source)}}
                  <!-- <el-select v-model="eventDO.source">
                    <el-option v-for="(item, index) in noticeLevelList" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                  </el-select> -->
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
                <el-form-item label="发生时间" >
                  <el-date-picker
                  style="width:100%"
                  :disabled="num === 0"
                    v-model="eventDO.occurDate"
                    type="date"
                    placeholder="发生时间" >
                  </el-date-picker>
                </el-form-item>
              </div>
                 <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="发生地点" >
                      <el-input :disabled="num === 0" v-model="eventDO.occurAddress" placeholder="请输入内容"></el-input>
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="cateGorys === 2">
                    <el-form-item label="报告类型">
                          {{projectLevelFilter(eventDO.category)}}
                    </el-form-item>
                  </div>
                 <div class="col-lg-4 col-md-6 col-sm-12" v-if="cateGorys === 1">
                    <el-form-item label="报告类型" prop="category" >
                      <el-select v-model="eventDO.category" :disabled="num === 0">
                        <el-option v-for="(item, index) in categorys" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                      </el-select>
                    </el-form-item>
                 </div>
                 <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="是否QAR分析">
                  <el-radio v-model="eventDO.qarNeeded" :disabled="num === 0" label='true'>是</el-radio>
                  <el-radio v-model="eventDO.qarNeeded" :disabled="num === 0" label='false'>否</el-radio>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="标题">
              <el-input :disabled="num === 0" v-model="eventDO.title" placeholder="" style="width: 100%"></el-input>
            </el-form-item>
                <el-form-item label="专业类型" v-model="radio2">
              {{name}}
              <span v-if="init" style="color:red;padding-left:10px">{{initlei}}</span>
               </el-form-item >
              
          </b-card-body>
          </b-collapse>
        </b-card>
            <Eventlistquery v-if=" 1 == radio2" ref="eventlist" :byData="groundList"/>
            <Eventground v-if="2 == radio2" ref="groundlists" :byData="groundList"/>
            <Eventsecurity v-if="3 == radio2" ref="curity" :byData="groundList"/>
        <!-- <security-notice-adjunct ref='adjunct'></security-notice-adjunct> -->
       <security-notice-adjunct
          ref='adjunct'
          :tableName='tableName'
          :uploadFile='uploadFile'
          :safetyId='safetyId'>
        </security-notice-adjunct>
                <b-card no-body v-if="oject1">
              <div slot="header">
                 查看审核记录
                  <div class="card-actions">
                    <b-btn class="btn btn-minimize" @click="tiggleActions" v-b-toggle.collapse1s>
                      <i class="icon-arrow-down" ref="upDowns"></i>
                    </b-btn>
                  </div>
              </div>
            <b-collapse id="collapse1s" visible>
               <b-card-body>
                 <el-table
                      :data="aproject"
                         >
                      <el-table-column
                      prop="auditUserName"
                      label="审核人"
                       >
                      </el-table-column>
                     
                      <el-table-column
                      prop="submitDate"
                      label="审核时间"
                       >
                      </el-table-column>
                       <el-table-column
                      prop="auditType"
                      label="审核流程"
                       >
                      </el-table-column>
                       <el-table-column
                      prop="auditResult"
                      label="结果"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="auditComment"
                      label="审核意见"
                       >
                      </el-table-column>
                  </el-table>
              </b-card-body>
            </b-collapse>
        </b-card>
        <!-- <b-card no-body v-if="oject1">
              <div slot="header">
                 立项核准
                  <div class="card-actions">
                    <b-btn class="btn btn-minimize" @click="tiggleActionss" v-b-toggle.collapse1ss>
                      <i class="icon-arrow-down" ref="upDownss"></i>
                    </b-btn>
                  </div>
              </div>
            <b-collapse id="collapse1ss" visible>
               <b-card-body>
                  <el-table
                    :data="aproject1"
                       >
                    <el-table-column
                    prop="auditUserName"
                    label="审核人"
                     >
                    </el-table-column>
                    <el-table-column
                    prop="submitDate"
                    label="审核时间"
                     >
                    </el-table-column>
                    <el-table-column
                    prop="mustAuditTime"
                    label="要求审核时间"
                     >
                    </el-table-column>
                    <el-table-column
                    prop="auditComment"
                    label="审核意见"
                     >
                    </el-table-column>
                </el-table>
              </b-card-body>
            </b-collapse>
        </b-card> -->
        <b-card no-body v-if="prog" >
              <div slot="header">
                调查方案
                  <div class="card-actions">
                    <b-btn class="btn btn-minimize" @click="tiggleActionsi" v-b-toggle.collapse1si>
                      <i class="icon-arrow-down" ref="upDownsi"></i>
                    </b-btn>
                  </div>
              </div>
            <b-collapse id="collapse1si" visible>
               <b-card-body>
                   <el-table
                      :data="programme"
                      size='small'
                         >
                      <el-table-column
                      prop="plan_user_name"
                      label="方案制定人"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="plan_complete_date"
                      label="方案完成时间"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="zz"
                      label="组长"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="zy"
                      label="组员"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="plan_date"
                      label="方案制定时间"
                       >
                      </el-table-column>
                  </el-table>
              </b-card-body>
            </b-collapse>
        </b-card>
        <b-card no-body v-if="level">
              <div slot="header">
                调查情况
                  <div class="card-actions">
                    <b-btn class="btn btn-minimize" @click="tiggleActions3" v-b-toggle.collapse1s3>
                      <i class="icon-arrow-down" ref="upDowns3"></i>
                    </b-btn>
                  </div>
              </div>
            <b-collapse id="collapse1s3" visible>
               <b-card-body>
                  <el-table
                      size='small'
                      :data="Eventlevel"
                      :stripe="true"
                      :row-key="getRowKeys"
                      :expand-row-keys="expands"
                      @expand-change="activelist"
                      :highlight-current-row ="true"
                      style="width: 100%">
                      <div>
                      </div>
                  <el-table-column type="expand" fixed="left">
                    <template slot-scope="props" >
                     <el-card no-body  v-if="eventsui">
                       <b-card-header>原因分类</b-card-header>
                        <div>
                          <EventForm1 :postDta="getreason" />
                        </div>
                     </el-card>
                       <el-card no-body v-if="sibility">
                         <b-card-header>责任划分</b-card-header>
                        <div>
                          <EventFormResponsibility1 :postDta="EventFormResponsibility" />
                        </div>
                     </el-card>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed
                    label='#'
                    width='60px'>
                    <template slot-scope="scope">
                      {{scope.$index + 1}}
                    </template>
                  </el-table-column>
                      <el-table-column
                      prop="title"
                      label="事件概要"
                      >
                      </el-table-column>
                      <el-table-column
                      prop="caseContent"
                      label="事件详细经过"
                      >
                      </el-table-column>
                  
                      <el-table-column
                      prop="dependent"
                      label="事件性质"
                      >
                      </el-table-column>
                      <el-table-column
                      prop="caseLevelDetail"
                      label="事件等级细分"
                      >
                      </el-table-column>
                      <el-table-column
                      prop="dependent"
                      label="依据"
                      >
                      </el-table-column>
                      <el-table-column
                      prop="caseResult"
                      label="事件结论"
                      >
                      </el-table-column>
                      <el-table-column
                      prop="caseHazard"
                      label="危险来源"
                      >
                      </el-table-column>
                      <el-table-column
                      prop="reportToUp"
                      label="是否上报局方"
                      >
                      </el-table-column>
                      <el-table-column
                      prop="reportDependent"
                      label="上报依据来源"
                       >
                      </el-table-column>
                  </el-table>
              </b-card-body>
            </b-collapse>
        </b-card>
        <b-card no-body>
          <b-card-body>
            <el-steps :active="numsui" align-center style="margin-top:40px" v-if="display !== 'true' && !isshow && sou === 0">
              <el-step title="新建"></el-step>
              <el-step title="立项核准" description="安技部-部门管理团队"></el-step>
              <el-step title="调查方案" description="安技部-安全管理经理"></el-step>
              <el-step title="调查情况" description="安技部-安全监察组"></el-step>
              <el-step title="验证核准" description="安技部-安全管理经理"></el-step>
              <el-step title="处理改进" description="安技部-部门管理团队"></el-step>
              <el-step title="结束"></el-step>
            </el-steps>
            <el-steps :active="numsui" align-center style="margin-top:40px" v-if="display !== 'true' && !isshow && sou === 1">
              <el-step title="新建"></el-step>
              <el-step title="立项核准" description="部门管理团队（非安技部）"></el-step>
                  <el-step title="调查方案" description="SMS对接经理"></el-step>
                  <el-step title="调查情况" description="SMS对接成员"></el-step>
                  <el-step title="验证核准" description="SMS对接经理"></el-step>
                  <el-step title="处理改进" description="部门管理团队（非安技部）"></el-step>
              <el-step title="结束"></el-step>
            </el-steps>
            <div class="text-center">
              <el-button type="primary" size='small' v-if="display === 'true'" v-loading.fullscreen.lock="fullscreenLoading"  @click="postindex">确 定</el-button>
              <el-button @click="sendout" size='small' :disabled="nolist" v-if="isshow" v-loading.fullscreen.lock="fullscreenLoading"  type="success">发 送</el-button>
              <el-button type="warning" size='small' :disabled="nolist" v-if="isshow" @click="process">结束流程</el-button>
              <el-button  size='small'  @click="goback" >返回</el-button>
            </div>
          </b-card-body>
        </b-card>

          <el-dialog title="审核" :visible.sync="dialogFormVisible">
              <el-form :model="form"  ref="form">
                <el-form-item label="意见" :label-width="formLabelWidth" :rules="[{ required: true, message: '审核意见不能为空'}]" prop="auditComment">
                  <el-input
                    auto-complete="off"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="form.auditComment">
                  </el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" size='mini' @click="project('form')">同 意</el-button>
                <el-button  size='mini' @click="dialogFormVisibleback('form')">返 回</el-button>
              </div>
        </el-dialog>
      </el-form>
  </div>
</template>
<script>
  import Eventlistquery from '../common/eventlistquery'
  import Eventground from '../common/eventground'
  import Eventsecurity from '../common/eventsecurity'
  import EventForm1 from './EeventForm1'
  import EventFormResponsibility1 from './EventFormResponsibility1'
  import axios from 'axios'
  //  下拉框的接口
  import { getAllDataAction } from '../../services/information_report'
  //  部门的接口
  import { getDepartmentList } from '../../services/safety_supervision'
  import { formatDate } from '../../utils/index.js'
  import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
  import { sourceDataFilter } from '../../tools'
  import { geteventdata, getEventReason, getCaseResponsibilityDO } from '../../services/event_query'
  export default {
    name: 'SecurityNoticeList',
    components: {
      Eventlistquery,
      Eventground,
      Eventsecurity,
      EventForm1,
      EventFormResponsibility1,
      SecurityNoticeAdjunct
    },
    data () {
      return {
        getRowKeys(row) {
          return row.caseId;
        },
        sou: 0,
        numsui: 0,
        expands: [],
        dialogFormVisible: false,
        isshow: false,
        nolist: false,
        showlist: true,
        fullscreenLoading: false,
        aproject: [],
        num: 0,
        name: '',
        id: 0,
        display: 'true',
        //  附件
        enclosure: '',
        //  新增上面的数据
        eventDO: {
          eventNumber: 0,
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
          majorType: 0,
          majorTypes: 0,
          //  报告类别
          category: null,
          //  事件类别
          source: 0,
          status: 0,
          //  飞行里面的数据
          reportFlyDO: {},
          //  地面里面的数据
          reportGroundDO: {},
          //  安保里面的数据
          reportSecurityDO: {}
          //  附件上传
          //  attachmentDOList: [],
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
        programme: [],
        Eventlevel: [],
        level: true,
        //  附件
        tableData: [],
        //  事件类型
        noticeLevelList: [],
        //  报告类型
        categorys: [],
        eventsui: true,
        getreason: [],
        EventFormResponsibility: [],
        sibility: true,
        //  传去组件里的参数
        radio2: 0,
        initlei: '',
        init: true,
        whetherCount: 0,
        pickerOptions1: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        //  点击上穿的配置
        fileList: [],
        eventNumber: 0,
        majorType: 0,
        cateGorys: 0,
        flag: 0,
        aproject1: [],
        oject1: true,
        prog: true,
        form: {
          auditComment: ''
        },
        formLabelWidth: '120px',
        source: [],
        tableName: 't_event',
        uploadFile: true
      }
    },
    methods: {
      sourecelist (alue) {
        let sourceData = this.source
        let result = sourceDataFilter(sourceData, alue)
        return result
      },
      project (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let eventid = parseInt(this.$route.params.id)
            let taskId = this.$route.params.taskId
            let eventAuditVo = {
              eventAuditDO: {
                eventNumber: eventid,
                auditComment: this.form.auditComment,
                auditResult: 2,
                auditUserName: this.$store.state.user.userName
              },
              taskInfo: {
                taskId: taskId
              }
            }
            axios.post('/api/incdent/workflow/complete', eventAuditVo)
              .then(res => {
                if (res.data.error === 0) {
                  this.$router.back(0)
                  this.$message.success('已结束流程')
                  this.dialogFormVisible = false
                } else {
                  this.$message.error('请重试' + res.data.message)
                }
              })
          } else {
            return false
          }
        })
      },
      sendout () {
        this.fullscreenLoading = true
        axios.get('/api/incdent/workflow/start/' + this.$route.params.id + '/' + this.$store.state.user.userName)
          .then(res => {
            this.fullscreenLoading = false
            if (res.data.error === 0) {
              this.$message.success('发送成功')
              this.$router.push({ path: '/event/list' })
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
      dialogFormVisibleback (form) {
        this.dialogFormVisible = false
        this.$refs[form].resetFields()
      },
      process () {
        this.dialogFormVisible = true
      },
      postindex () {
        if (this.eventDO.majorType === 0) {
          this.eventDO.majorType = this.majorType
        }
        if (this.eventDO.occurAddress === null) {
          this.$message.error('发生地点不能为空')
        } else if (this.eventDO.title === null) {
          this.$message.error('请填写标题')
        } else if (this.eventDO.occurDate === null) {
          this.$message.error('请填写发生日期')
        } else {
          if (this.eventDO.majorType === 1) {
            if (this.eventDO.reportFlyDO.flightDate === null) {
              this.$message.error('请填写航班日期')
            } else if (this.eventDO.reportFlyDO.flightLeg === null) {
              this.$message.error('请填写航段')
            } else if (this.eventDO.reportFlyDO.flightName === null) {
              this.$message.error('请填写飞机性质')
            } else if (this.eventDO.reportFlyDO.flightPhase === null) {
              this.$message.error('请填写飞行阶段')
            } else if (this.eventDO.reportFlyDO.weatherCondition === null) {
              this.$message.error('请填写气象条件')
            } else if (this.eventDO.reportFlyDO.lightCondition === null) {
              this.$message.error('请填写光照条件')
            } else if (this.eventDO.reportFlyDO.eventType === null) {
              this.$message.error('请填写事件类型')
            } else if (this.eventDO.reportFlyDO.eventGrade === null) {
              this.$message.error('请填写事件等级')
            } else if (this.eventDO.reportFlyDO.flightDelay === null) {
              this.$message.error('请填写航班延误情况')
            } else if (this.eventDO.reportFlyDO.causeType === null) {
              this.$message.error('请填写原因分类')
            } else if (this.eventDO.reportFlyDO.aircraftDamage === null) {
              this.$message.error('请填写航空器损坏')
            } else if (this.eventDO.reportFlyDO.eventDescription === null) {
              this.$message.error('请填写事情经过')
            } else {
                let eventDO = this.eventDO
                this.fullscreenLoading = true
                axios.put('/api/incdent/event/updateEventfgs', eventDO)
                  .then(res => {
                    this.fullscreenLoading = false
                    if (res.data.error === 0 && res.data.data === null) {
                      this.$message.success('修改成功')
                      this.$router.back(-1)
                      this.whetherCount = 2
                      this.nolist = false
                    }
                  })
                  .catch(error => {
                    console.log(error)
                    this.fullscreenLoading = false
                    this.$message.error('网咯超时请检查网咯')
                  })
            }
          }
          if (this.eventDO.majorType === 2) {
            if (this.eventDO.reportGroundDO.relAircraft === 'true') {
              if (this.eventDO.reportGroundDO.acType1 === null) {
                this.$message.error('请填写机型')
              } else if (this.eventDO.reportGroundDO.acNo1 === null) {
                this.$message.error('请填写飞机号')
              } else if (this.eventDO.reportGroundDO.acCompany1 === null) {
                this.$message.error('请填写所属单位')
              } else if (this.eventDO.reportGroundDO.runPhase1 === null) {
                this.$message.error('请填写运行阶段')
              } else if (this.eventDO.reportGroundDO.relCar === 'true') {
                if (this.eventDO.reportGroundDO.carType1 === null) {
                  this.$message.error('请填写车辆类型')
                } else if (this.eventDO.reportGroundDO.carCompany1 === null) {
                  this.$message.error('请填写所属单位')
                } else if (this.eventDO.reportGroundDO.relGroundDevice === 'true') {
                  if (this.eventDO.reportGroundDO.deviceName === null) {
                    this.$message.error('请填写地面设施')
                  } else if (this.eventDO.reportGroundDO.causeType === null) {
                    this.$message.error('请填写原因分类')
                  } else if (this.eventDO.reportGroundDO.flightDelay === null) {
                    this.$message.error('请填写延误情况')
                  } else if (this.eventDO.reportGroundDO.aircraftDamage === null) {
                    this.$message.error('请填写航空损坏情况')
                  } else if (this.eventDO.reportGroundDO.eventDescription === null) {
                    this.$message.error('请填写事情的经过')
                  } else {
                    let eventDO = this.eventDO
                    this.fullscreenLoading = true
                    axios.put('/api/incdent/event/updateEventfgs', eventDO)
                      .then(res => {
                        this.fullscreenLoading = false
                        if (res.data.error === 0 && res.data.data === null) {
                          this.$message.success('修改成功')
                          this.$router.back(-1)
                          this.whetherCount = 2
                          this.nolist = false
                        }
                      })
                      .catch(error => {
                        console.log(error)
                        this.fullscreenLoading = false
                        this.$message.error('网咯超时请检查网咯')
                      })
                  }
                } else {
                  if (this.eventDO.reportGroundDO.causeType === null) {
                    this.$message.error('请填写原因分类')
                  } else if (this.eventDO.reportGroundDO.flightDelay === null) {
                    this.$message.error('请填写延误情况')
                  } else if (this.eventDO.reportGroundDO.aircraftDamage === null) {
                    this.$message.error('请填写航空损坏情况')
                  } else if (this.eventDO.reportGroundDO.eventDescription === null) {
                    this.$message.error('请填写事情的经过')
                  } else {
                    let eventDO = this.eventDO
                    this.fullscreenLoading = true
                    axios.put('/api/incdent/event/updateEventfgs', eventDO)
                      .then(res => {
                        this.fullscreenLoading = false
                        if (res.data.error === 0 && res.data.data === null) {
                          this.$message.success('修改成功')
                          this.$router.back(-1)
                          this.whetherCount = 2
                          this.nolist = false
                        }
                      })
                      .catch(error => {
                        console.log(error)
                        this.fullscreenLoading = false
                        this.$message.error('网咯超时请检查网咯')
                      })
                  }
                }
              } else {
                if (this.eventDO.reportGroundDO.relGroundDevice === 'true') {
                  if (this.eventDO.reportGroundDO.deviceName === null) {
                    this.$message.error('请填写地面设施')
                  } else if (this.eventDO.reportGroundDO.causeType === null) {
                    this.$message.error('请填写原因分类')
                  } else if (this.eventDO.reportGroundDO.flightDelay === null) {
                    this.$message.error('请填写延误情况')
                  } else if (this.eventDO.reportGroundDO.aircraftDamage === null) {
                    this.$message.error('请填写航空损坏情况')
                  } else if (this.eventDO.reportGroundDO.eventDescription === null) {
                    this.$message.error('请填写事情的经过')
                  } else {
                    let eventDO = this.eventDO
                    this.fullscreenLoading = true
                    axios.put('/api/incdent/event/updateEventfgs', eventDO)
                      .then(res => {
                        this.fullscreenLoading = false
                        if (res.data.error === 0 && res.data.data === null) {
                          this.$message.success('修改成功')
                          this.$router.back(-1)
                          this.whetherCount = 2
                          this.nolist = false
                        }
                      })
                      .catch(error => {
                        console.log(error)
                        this.fullscreenLoading = false
                        this.$message.error('网咯超时请检查网咯')
                      })
                  }
                } else {
                  if (this.eventDO.reportGroundDO.causeType === null) {
                    this.$message.error('请填写原因分类')
                  } else if (this.eventDO.reportGroundDO.flightDelay === null) {
                    this.$message.error('请填写延误情况')
                  } else if (this.eventDO.reportGroundDO.aircraftDamage === null) {
                    this.$message.error('请填写航空损坏情况')
                  } else if (this.eventDO.reportGroundDO.eventDescription === null) {
                    this.$message.error('请填写事情的经过')
                  } else {
                    let eventDO = this.eventDO
                    this.fullscreenLoading = true
                    axios.put('/api/incdent/event/updateEventfgs', eventDO)
                      .then(res => {
                        this.fullscreenLoading = false
                        if (res.data.error === 0 && res.data.data === null) {
                          this.$message.success('修改成功')
                          this.$router.back(-1)
                          this.whetherCount = 2
                          this.nolist = false
                        }
                      })
                      .catch(error => {
                        console.log(error)
                        this.fullscreenLoading = false
                        this.$message.error('网咯超时请检查网咯')
                      })
                  }
                }
              }
            } else {
              if (this.eventDO.reportGroundDO.relCar === 'true') {
                if (this.eventDO.reportGroundDO.carType1 === null) {
                  this.$message.error('请填写车辆类型')
                } else if (this.eventDO.reportGroundDO.carCompany1 === null) {
                  this.$message.error('请填写所属单位')
                } else if (this.eventDO.reportGroundDO.relGroundDevice === 'true') {
                  if (this.eventDO.reportGroundDO.deviceName === null) {
                    this.$message.error('请填写地面设施')
                  } else if (this.eventDO.reportGroundDO.causeType === null) {
                    this.$message.error('请填写原因分类')
                  } else if (this.eventDO.reportGroundDO.flightDelay === null) {
                    this.$message.error('请填写延误情况')
                  } else if (this.eventDO.reportGroundDO.aircraftDamage === null) {
                    this.$message.error('请填写航空损坏情况')
                  } else if (this.eventDO.reportGroundDO.eventDescription === null) {
                    this.$message.error('请填写事情的经过')
                  } else {
                    let eventDO = this.eventDO
                    this.fullscreenLoading = true
                    axios.put('/api/incdent/event/updateEventfgs', eventDO)
                      .then(res => {
                        this.fullscreenLoading = false
                        if (res.data.error === 0 && res.data.data === null) {
                          this.$message.success('修改成功')
                          this.$router.back(-1)
                          this.whetherCount = 2
                          this.nolist = false
                        }
                      })
                      .catch(error => {
                        console.log(error)
                        this.fullscreenLoading = false
                        this.$message.error('网咯超时请检查网咯')
                      })
                  }
                } else {
                  if (this.eventDO.reportGroundDO.causeType === null) {
                    this.$message.error('请填写原因分类')
                  } else if (this.eventDO.reportGroundDO.flightDelay === null) {
                    this.$message.error('请填写延误情况')
                  } else if (this.eventDO.reportGroundDO.aircraftDamage === null) {
                    this.$message.error('请填写航空损坏情况')
                  } else if (this.eventDO.reportGroundDO.eventDescription === null) {
                    this.$message.error('请填写事情的经过')
                  } else {
                    let eventDO = this.eventDO
                    this.fullscreenLoading = true
                    axios.put('/api/incdent/event/updateEventfgs', eventDO)
                      .then(res => {
                        this.fullscreenLoading = false
                        if (res.data.error === 0 && res.data.data === null) {
                          this.$message.success('修改成功')
                          this.$router.back(-1)
                          this.whetherCount = 2
                          this.nolist = false
                        }
                      })
                      .catch(error => {
                        console.log(error)
                        this.fullscreenLoading = false
                        this.$message.error('网咯超时请检查网咯')
                      })
                  }
                }
              } else {
                if (this.eventDO.reportGroundDO.relGroundDevice === 'true') {
                  if (this.eventDO.reportGroundDO.deviceName === null) {
                    this.$message.error('请填写地面设施')
                  } else if (this.eventDO.reportGroundDO.causeType === null) {
                    this.$message.error('请填写原因分类')
                  } else if (this.eventDO.reportGroundDO.flightDelay === null) {
                    this.$message.error('请填写延误情况')
                  } else if (this.eventDO.reportGroundDO.aircraftDamage === null) {
                    this.$message.error('请填写航空损坏情况')
                  } else if (this.eventDO.reportGroundDO.eventDescription === null) {
                    this.$message.error('请填写事情的经过')
                  } else {
                    let eventDO = this.eventDO
                    this.fullscreenLoading = true
                    axios.put('/api/incdent/event/updateEventfgs', eventDO)
                      .then(res => {
                        this.fullscreenLoading = false
                        if (res.data.error === 0 && res.data.data === null) {
                          this.$message.success('修改成功')
                          this.$router.back(-1)
                          this.whetherCount = 2
                          this.nolist = false
                        }
                      })
                      .catch(error => {
                        console.log(error)
                        this.fullscreenLoading = false
                        this.$message.error('网咯超时请检查网咯')
                      })
                  }
                } else {
                  if (this.eventDO.reportGroundDO.causeType === null) {
                    this.$message.error('请填写原因分类')
                  } else if (this.eventDO.reportGroundDO.flightDelay === null) {
                    this.$message.error('请填写延误情况')
                  } else if (this.eventDO.reportGroundDO.aircraftDamage === null) {
                    this.$message.error('请填写航空损坏情况')
                  } else if (this.eventDO.reportGroundDO.eventDescription === null) {
                    this.$message.error('请填写事情的经过')
                  } else {
                    let eventDO = this.eventDO
                    this.fullscreenLoading = true
                    axios.put('/api/incdent/event/updateEventfgs', eventDO)
                      .then(res => {
                        this.fullscreenLoading = false
                        if (res.data.error === 0 && res.data.data === null) {
                          this.$message.success('修改成功')
                          this.$router.back(-1)
                          this.whetherCount = 2
                          this.nolist = false
                        }
                      })
                      .catch(error => {
                        console.log(error)
                        this.fullscreenLoading = false
                        this.$message.error('网咯超时请检查网咯')
                      })
                  }
                }
              }
            }
          }
          if (this.eventDO.majorType === 3) {
            if (this.eventDO.reportSecurityDO.relAircraft === 'true') {
              if (this.eventDO.reportSecurityDO.flightDate === null) {
                this.$message.error('请填写航空日期')
              } else if (this.eventDO.reportSecurityDO.flightLeg === null) {
                this.$message.error('请填写航段')
              } else if (this.eventDO.reportSecurityDO.airNumber === null) {
                this.$message.error('请填写飞机号')
              } else if (this.eventDO.reportSecurityDO.secEventCategory === null) {
                this.$message.error('请填写安保事件类别')
              } else if (this.eventDO.reportSecurityDO.secEventType1 === null) {
                this.$message.error('请填写安保事件类型1')
              } else if (this.eventDO.reportSecurityDO.secEventType2 === null) {
                this.$message.error('请填写安保事件类型2')
              } else if (this.eventDO.reportSecurityDO.eventGrade === null) {
                this.$message.error('请填写事件等级')
              } else if (this.eventDO.reportSecurityDO.flightDelay === null) {
                this.$message.error('请填写航班延误')
              } else if (this.eventDO.reportSecurityDO.aircraftDamage === null) {
                this.$message.error('请填写航空损坏')
              } else if (this.eventDO.reportSecurityDO.eventDescription === null) {
                this.$message.error('请填写事情的经过')
              } else {
                let eventDO = this.eventDO
                this.fullscreenLoading = true
                axios.put('/api/incdent/event/updateEventfgs', eventDO)
                  .then(res => {
                    this.fullscreenLoading = false
                    if (res.data.error === 0 && res.data.data === null) {
                      this.$message.success('修改成功')
                      this.$router.back(-1)
                      this.whetherCount = 2
                      this.nolist = false
                    }
                  })
                  .catch(error => {
                    console.log(error)
                    this.fullscreenLoading = false
                    this.$message.error('网咯超时请检查网咯')
                  })
              }
            } else {
              if (this.eventDO.reportSecurityDO.secEventCategory === null) {
                this.$message.error('请填写安保事件类别')
              } else if (this.eventDO.reportSecurityDO.secEventType1 === null) {
                this.$message.error('请填写安保事件类型1')
              } else if (this.eventDO.reportSecurityDO.secEventType2 === null) {
                this.$message.error('请填写安保事件类型2')
              } else if (this.eventDO.reportSecurityDO.eventGrade === null) {
                this.$message.error('请填写事件等级')
              } else if (this.eventDO.reportSecurityDO.flightDelay === null) {
                this.$message.error('请填写航班延误')
              } else if (this.eventDO.reportSecurityDO.aircraftDamage === null) {
                this.$message.error('请填写航空损坏')
              } else if (this.eventDO.reportSecurityDO.eventDescription === null) {
                this.$message.error('请填写事情的经过')
              } else {
                let eventDO = this.eventDO
                this.fullscreenLoading = true
                axios.put('/api/incdent/event/updateEventfgs', eventDO)
                  .then(res => {
                    this.fullscreenLoading = false
                    if (res.data.error === 0 && res.data.data === null) {
                      this.$message.success('修改成功')
                      this.$router.back(-1)
                      this.whetherCount = 2
                      this.nolist = false
                    }
                  })
                  .catch(error => {
                    console.log(error)
                    this.fullscreenLoading = false
                    this.$message.error('网咯超时请检查网咯')
                  })
              }
            }
          }
        }
        
      },
      tiggleActionsi () {
        if (this.$refs.upDownsi.className === 'icon-arrow-down') {
          this.$refs.upDownsi.className = 'icon-arrow-up'
        } else {
          this.$refs.upDownsi.className = 'icon-arrow-down'
        }
      },
      tiggleActionss () {
        if (this.$refs.upDownss.className === 'icon-arrow-down') {
          this.$refs.upDownss.className = 'icon-arrow-up'
        } else {
          this.$refs.upDownss.className = 'icon-arrow-down'
        }
      },
      goback () {
        this.$router.back(-1)
      },
      tiggleActions3 () {
        if (this.$refs.upDowns3.className === 'icon-arrow-down') {
          this.$refs.upDowns3.className = 'icon-arrow-up'
        } else {
          this.$refs.upDowns3.className = 'icon-arrow-down'
        }
      },
      //  附件下载的
      deleteRow (index, rows) {
        axios({
          method: 'get',
          url: '/file/download?' + 'filename=' + rows[index].fileUrl,
          responseType: 'blob',
          rows: rows,
          index: index
        })
          .then(res => {
            let index = res.config.index
            let fileName = res.config.rows
            let headers = res.headers
            let blob = new Blob([res.data], { type: headers['content-type'] })
            let title = fileName[index].fileName
            if ('msSaveOrOpenBlob' in navigator) {
              window.navigator.msSaveOrOpenBlob(blob, title)
            } else {
              let link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = title
              link.click()
            }
          })
      },
      projectLevelFilter (alue) {
        let sourceData = this.groundList.REPORT_TYPE
        let result = sourceDataFilter(sourceData, alue)
        return result
      },
      activelist (index, params) {
        if (params.length > 1) {
          params.shift()
        }
        this.caseId = index.caseId
        //  原因分类请求
        getEventReason(index.caseId).then(item => {
          if (item.data.data.length === 0) {
            this.eventsui = false
          } else {
            this.eventsui = true
          }
          this.getreason = item.data.data
        })
        //  责任划分
        getCaseResponsibilityDO(index.caseId).then(item => {
          if (item.data.data.length === 0) {
            this.sibility = false
          } else {
            this.sibility = true
          }
          this.EventFormResponsibility = item.data.data
        })
      },
      tiggleActions () {
        if (this.$refs.upDowns.className === 'icon-arrow-down') {
          this.$refs.upDowns.className = 'icon-arrow-up'
        } else {
          this.$refs.upDowns.className = 'icon-arrow-down'
        }
      },
      Actions () {
        if (this.$refs.upDow.className === 'icon-arrow-down') {
            this.$refs.upDow.className = 'icon-arrow-up'
          } else {
            this.$refs.upDow.className = 'icon-arrow-down'
          }
       }
    },
    mounted () {
      //  请求所有的下拉框
      getAllDataAction().then(result => {
        this.categorys = result.REPORT_TYPE.dicts
        this.groundList = result
      })
      //  请求部门
      getDepartmentList().then(item => {
        item.map(result => {
        })
      })
      this.$watch('eventDO', () => {
        this.whetherCount++
        // 判断修改的次数，如果大于2的话将状态改为true
        if (this.whetherCount > 2) {
          this.nolist = true
        }
      }, {
        deep: true
      })
    },
    created () {
      this.safetyId = this.$route.params.id
      axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'EVENT_SOURCE')
        .then(res => {
          if (res.data.error === 0) {
            this.noticeLevelList = res.data.data
          }
        })
      axios.get('/api/incdent/plan/listEventQarPlanDO?' + 'eventNumber=' + this.$route.params.id)
        .then(res => {
          if (res.data.data.length > 0) {
            this.showslist = 'false'
          }
          if (res.data.data.length === 0) {
            this.prog = false
          } else {
            let data = res.data.data[0]
            let arr = [{
              plan_complete_date:data.plan_complete_date,
              plan_date:data.plan_date,
              plan_dept:data.plan_dept,
              plan_dept_name: data.plan_dept_name,
              plan_id: data.plan_id,
              plan_user_name: data.plan_user_name,
              user_id: data.user_id,
              zz: '',
              zy: ''
            }]
            res.data.data.map(item => {
              if(item.member_type === false) {
                arr[0].zz += item.user_name + ','
              } else {
                arr[0].zy += item.user_name + ','
              }
            })
            arr[0].zz = arr[0].zz.substring(0, arr[0].zz.lastIndexOf(','))
            arr[0].zy = arr[0].zy.substring(0, arr[0].zy.lastIndexOf(','))
            this.programme = arr
          }
          
        })
      geteventdata(this.$route.params.id).then(item => {
        if (item.data.data.length > 0) {
          this.showslists = 'false'
        }
        item.data.data.map(items => {
          if (items.reportToUp === true) {
            items.reportToUp = '是'
          } else if (items.reportToUp === false) {
            items.reportToUp = '否'
          }
        })
        if (item.data.data.length === 0) {
          this.level = false
        }
        this.Eventlevel = item.data.data
        if (item.data.data.length !== 0) {
            getEventReason(item.data.data[0].caseId).then(item => {
            if (item.data.data.length === 0) {
              this.eventsui = false
            } else {
              this.eventsui = true
            }
            this.getreason = item.data.data
          })
          //  责任划分
          getCaseResponsibilityDO(item.data.data[0].caseId).then(item => {
            if (item.data.data.length === 0) {
              this.sibility = false
            } else {
              this.sibility = true
            }
            this.EventFormResponsibility = item.data.data
          })
            this.expands.push(this.Eventlevel[0].caseId)
        }
        
      })
      this.user = this.$store.state.user
      this.id = +this.$route.params.id
      this.user = this.$store.state.user
      let id = this.$route.params.id
      axios.get('/api/incdent/Audit/listEventAuditDO?' + 'eventNumber=' + id)
        .then(res => {
          if (res.data.error === 0) {
            let Data = res.data.data.map(item => {
              if (item.auditType === 0) {
                item.auditType = '立项核准'
              } else if (item.auditType ===-1) {
                item.auditType = '新建'
              } else if (item.auditType === 1) {
                item.auditType = '调查方案'
              } else if (item.auditType === 2) {
                item.auditType = '调查情况'
              } else if (item.auditType === 3) {
                item.auditType = '验证核准'
              } else if (item.auditType === 4) {
                item.auditType = '处理改进'
              } else if (item.auditType === 5) {
                item.auditType = '结束'
              }
              if (item.auditResult === 0) {
                item.auditResult = '驳回'
              } else if (item.auditResult === 1) {
                item.auditResult = '通过'
              }
              return item
            })
            this.aproject = Data
            if (this.$route.params.taskId === '0') {
              this.oject1 = false
            }
            this.aproject1.push(Data[0])
          }
        })
      axios.get('/api/incdent/event/listeventNumbler' + '?eventNumber' + '=' + id)
        .then(res => {
          let data = res.data.data
          this.numsui = data.status + 1
          if (res.data.data.procInstId !== null) {
            this.isshow = true
          }
          if (data.repDeptName.substring(0,2) === '安全') {
              this.sou = 0
            } else {
              this.sou = 1
            }
          if (this.$route.params.taskId === '-1') {
            this.isshow = false
            this.display = 'false'
          }
          //  附件的接口
          if (data.status === -1) {
            this.showlist = false
            this.num = 1
          }
          axios.get('/api/attach/list?' + 'tableName=' + 't_event&' + 'sourceNumber=' + data.eventNumber + '&' + 'procStatus=' + data.status)
            .then(res => {
              if (res.data.error === 0) {
                this.tableData = res.data.data
              }
            })
          if (data.flag === 2) {
            this.display = 'false'
            this.flag = 2
          }
          axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'EVENT_SOURCE')
            .then(res => {
              if (res.data.error === 0) {
                this.source = res.data.data
              }
            })
          this.eventDO.reporter = data.reporter
          this.eventDO.reporterName = data.reporterName
          this.eventDO.phone = data.phone
          this.eventDO.repDeptName = data.repDeptName
          this.eventDO.repDept = data.repDept
          this.eventDO.createDate = data.createDate




          this.eventDO.category = data.category
          this.eventDO.source = data.source
          //  发生时间
          this.eventDO.occurDate = data.occurDate
          this.eventDO.majorTypes = data.majorType
          //  发生地点
          this.eventDO.occurAddress = data.occurAddress
          //  QAR
          if (data.qarNeeded === true) {
            this.eventDO.qarNeeded = 'true'
          } else if (data.qarNeeded === false) {
            this.eventDO.qarNeeded = 'false'
          }
          if (data.majorType === 1) {
            this.radio2 = 1
            this.name = '飞行'
            let majorType = data.majorType
            let number = data.eventNumber
            let url = ''
            if (majorType === 1) {
              url = '/api/common/fly/listReportFlyDO'
            } else if (majorType === 2) {
              url = '/api/common/fly/listReportGound'
            } else if (majorType === 3) {
              url = '/api/common/fly/listReportSecurity'
            }
            axios.get(url + '?reportNumber' + '=' + number)
              .then(res => {
                let data1 = res.data.data[0]
                if (this.flag === 2) {
                  this.$refs.eventlist.num = 0
                }
                this.$refs.eventlist.operation.flightDate = data1.flightDate
                this.$refs.eventlist.operation.flightNo = data1.flightNo
                this.$refs.eventlist.operation.airNumber = data1.airNumber
                this.$refs.eventlist.operation.acType = data1.acType
                this.$refs.eventlist.operation.flightLeg = data1.flightLeg
                this.$refs.eventlist.operation.flightCrew = data1.flightCrew
                this.$refs.eventlist.operation.flightName = data1.flightName
                this.$refs.eventlist.operation.flightPhase = data1.flightPhase
                this.$refs.eventlist.operation.lightCondition = data1.lightCondition
                this.$refs.eventlist.operation.weatherCondition = data1.weatherCondition
                this.$refs.eventlist.operation.eventType = data1.eventType
                this.$refs.eventlist.operation.causeType = data1.causeType
                this.$refs.eventlist.operation.eventGrade = data1.eventGrade
                this.$refs.eventlist.operation.aircraftDamage = data1.aircraftDamage
                this.$refs.eventlist.operation.flightDelay = data1.flightDelay
                this.$refs.eventlist.operation.eventDescription = data1.eventDescription
                this.eventDO.reportFlyDO = this.$refs.eventlist.operation
              })
          }
          if (data.majorType === 2) {
            this.radio2 = 2
            this.name = '地面'
            let number = data.eventNumber
            let url = '/api/common/fly/listReportGound'
            axios.get(url + '?reportNumber' + '=' + number)
              .then(res => {
                let data1 = res.data.data[0]
                if (this.flag === 2) {
                  this.$refs.groundlists.num = 0
                }
                this.$refs.groundlists.operation.deviceName = data1.deviceName
                this.$refs.groundlists.operation.causeType = data1.causeType
                this.$refs.groundlists.operation.deviceCompany = data1.deviceCompany
                this.$refs.groundlists.operation.eventGrade = data1.eventGrade
                this.$refs.groundlists.operation.flightDelay = data1.flightDelay
                this.$refs.groundlists.operation.eventType = data1.eventType
                this.$refs.groundlists.operation.aircraftDamage = data1.aircraftDamage
                this.$refs.groundlists.operation.eventDescription = data1.eventDescription
                this.$refs.groundlists.operation.acType1 = data1.acType1
                this.$refs.groundlists.operation.acNo1 = data1.acNo1
                this.$refs.groundlists.operation.acCompany1 = data1.acCompany1
                this.$refs.groundlists.operation.acType2 = data1.acType2
                this.$refs.groundlists.operation.acNo2 = data1.acNo2
                this.$refs.groundlists.operation.acCompany2 = data1.acCompany2
                this.$refs.groundlists.operation.runPhase1 = data1.runPhase1
                this.$refs.groundlists.operation.runPhase2 = data1.runPhase2
                this.$refs.groundlists.operation.carType1 = data1.carType1
                this.$refs.groundlists.operation.carType2 = data1.carType2
                this.$refs.groundlists.operation.carCompany1 = data1.carCompany1
                this.$refs.groundlists.operation.carCompany2 = data1.carCompany2
                if (data1.relAircraft === true) {
                  this.$refs.groundlists.relAircrafts = 'false'
                } else if (data1.relAircraft === false) {
                  this.$refs.groundlists.operation.relAircraft = 'false'
                }
                if (data1.relCar === true) {
                  this.$refs.groundlists.relCar = 'false'
                } else if (data1.relCar === false) {
                  this.$refs.groundlists.operation.relCar = 'false'
                }
                if (data1.relGroundDevice === true) {
                  this.$refs.groundlists.relGroundDevices = 'false'
                } else if (data1.relGroundDevice === false) {
                  this.$refs.groundlists.operation.relGroundDevice = 'false'
                }
                if (data1.acCompany2 === 'null') {
                  this.$refs.groundlists.operation.acCompany2 = ''
                }
                if (data1.carCompany2 === 'null') {
                  this.$refs.groundlists.operation.carCompany2 = ''
                }
                this.eventDO.reportGroundDO = this.$refs.groundlists.operation
              })
          }
          if (data.majorType === 3) {
            this.name = '安保'
            this.radio2 = 3
            let number = data.eventNumber
            let url = '/api/common/fly/listReportSecurity'
            axios.get(url + '?reportNumber' + '=' + number)
              .then(res => {
                let data = res.data.data[0]
                if (this.eventDO.source === '报告') {
                  this.$refs.curity.operation.relAircraft = 'true'
                }
                if (data.relAircraft === true) {
                  this.$refs.curity.relAircrafts = 'false'
                } else if (data.relAircraft === false) {
                  this.$refs.curity.operation.relAircraft = 'false'
                }
                if (this.flag === 2) {
                  this.$refs.curity.num = 0
                }
                this.$refs.curity.operation.flightDate = data.flightDate
                this.$refs.curity.operation.flightCrew = data.flightCrew
                this.$refs.curity.operation.flightLeg = data.flightLeg
                this.$refs.curity.operation.secEventType1 = data.secEventType1
                this.$refs.curity.operation.secEventType2 = data.secEventType2
                this.$refs.curity.operation.airNumber = data.airNumber
                this.$refs.curity.operation.secEventCategory = data.secEventCategory
                this.$refs.curity.operation.acType = data.acType
                this.$refs.curity.operation.eventGrade = data.eventGrade
                this.$refs.curity.operation.flightDelay = data.flightDelay
                this.$refs.curity.operation.aircraftDamage = data.aircraftDamage
                this.$refs.curity.operation.eventDescription = data.eventDescription
                this.eventDO.reportSecurityDO = this.$refs.curity.operation
              })
          }
          this.eventDO.title = data.title
          this.eventNumber = data.eventNumber
          this.eventDO.eventNumber = data.eventNumber
          this.majorType = data.majorType
          this.eventDO.status = data.status
        })
        .catch(error => { console.log(error) })
    }
}
</script>