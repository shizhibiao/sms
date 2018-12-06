<template>
  <div class="animated fadeIn">
      <el-form :model="QAR" label-width="120px" >
        <b-card no-body>
          <!-- 查看 -->
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
                    <el-form-item label="报告人:">{{QAR.reporterName}}</el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="报告部门:">{{QAR.reportDeptName}}</el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="报告日期:">{{QAR.reportDate}}</el-form-item>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <el-form-item label="标题">
                        <el-input v-model="QAR.title" disabled placeholder="" style="width: 100%"></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="发生日期" >
                        <el-date-picker  style="width:100%" disabled v-model="QAR.occurDate"
                            type="date"
                            placeholder="发生日期" >
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="航班日期">
                    <el-date-picker
                    disabled
                    v-model="QAR.flightDate"
                    type="date"
                    style="width:100%"
                    placeholder="报告时间" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="飞机号">
                    <el-select v-model="QAR.airNumber" disabled  style="width:100%">
                    <el-option
                    v-for="(item, index) in planData" :key="index" :label="item.aircraftno" :value="item.aircraftno"></el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="航段">
                    <el-select v-model="QAR.flightLeg" disabled style="width:100%">
                    <el-option v-for="(item, index) in flightLegData" :key="index" :label="item.name" :value="item.name"></el-option>
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
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="飞行阶段(QAR)">
                        <el-select disabled v-model="QAR.flightPhaseQar" style="width:100%">
                        <el-option v-for="(item, index) in responsess" :key="index" :label="item.stateName" :value="item.stateName"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                 <div class="col-lg-6 col-md-6 col-sm-12">
                   <el-form-item label="事件等级">
                        <el-input  v-model="QAR.eventGrade" disabled placeholder=""></el-input>
                    </el-form-item>
                 </div>
                 <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="主操纵">
                       <el-input v-model="QAR.pm" disabled placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="主操纵技术等级">
                       <el-input v-model="QAR.pmTechLevel" disabled placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="辅助操纵">
                       <el-input disabled v-model="QAR.pf" placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 co l-sm-12">
                    <el-form-item label="辅操纵技术等级">
                       <el-input disabled v-model="QAR.pfTechLevel" placeholder=""></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <el-form-item label="光照条件">
                    <el-select disabled v-model="QAR.lightCondition" >
                      <el-option v-for="(item, index) in LIGHT_CONDITION" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </div>


                <div class="col-lg-6 col-md-6 col-sm-12">
                  <el-form-item label="气象条件">
                    <el-select disabled v-model="QAR.weatherCondition">
                      <el-option v-for="(item, index) in WEATHER_CONDITION" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <el-form-item label="航空器损坏">
                    <el-select disabled v-model="QAR.aircraftDamage">
                      <el-option v-for="(item, index) in AIRCRAFT_DAMAGE" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <el-form-item label="事件类型" class="">
                    <el-select disabled v-model="QAR.eventType">
                      <el-option v-for="(item, index) in EVENT_TYEP" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <el-form-item label="航班延误情况" >
                    <el-select disabled v-model="QAR.flightDelay">
                      <el-option v-for="(item, index) in FLIGHT_DELAY" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <el-form-item label="飞行性质" >
                    <el-select disabled v-model="QAR.flightName">
                      <el-option v-for="(item, index) in FLIGHT_PURPOSE" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <el-form-item label="飞行员反映情况">
                        <el-input
                        disabled
                        type="textarea"
                        v-model="QAR.eventDesc" style="width: 100%">
                        </el-input>
                    </el-form-item>
                </div>
                  </div>
                </b-card-body>
            </b-collapse>
        </b-card>
        <b-card no-body >
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
                      prop="auditTime"
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
        <security-notice-adjunct
          ref='adjunct'
          :tableName='tableName'
          :uploadFile='uploadFile'
          :safetyId='safetyId'>
        </security-notice-adjunct>
        <!-- <b-card no-body v-if="ject1">
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
                    prop="auditTime"
                    label="审核时间"
                     >
                    </el-table-column>
                    <el-table-column
                    prop="auditMustTime"
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
        <b-card no-body v-if="prog">
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
                          <QulityForm ref="formlist" :postDta="getreason" />
                        </div>
                     </el-card>
                       <el-card no-body v-if="sibility">
                         <b-card-header>责任划分</b-card-header>
                        <div>
                          <QualityFormResponsibility ref="bility" :postDta="EventFormResponsibility" />
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
            <el-steps :active="numsui" align-center style="margin-top:40px">
            <el-step title="新建"></el-step>
            <el-step title="立项核准" description='安技部-部门管理团队'></el-step>
            <el-step title="调查方案" description='安技部-安全管理经理'></el-step>
            <el-step title="调查情况" description='安技部-安全监察组'></el-step>
            <el-step title="验证核准" description='安技部-安全管理经理'></el-step>
            <el-step title="处理改进" description='安技部-部门管理团'></el-step>
            <el-step title="结束"></el-step>
          </el-steps>
            <div class="text-center">
              <el-button  size='small'  @click="goback" >返回</el-button>
            </div>
          </b-card-body>
        </b-card>
      </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import QulityForm from './QulityForm'
import QualityFormResponsibility from './QualityFormResponsibility.vue'
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
export default {
  components: {
    QulityForm,
    QualityFormResponsibility,
    SecurityNoticeAdjunct
  },
  data () {
    return {
      numsui: 0,
      getRowKeys(row) {
        return row.caseId;
      },
      expands: [],
      QAR: {
      },
      fullscreenLoading: false,
      flightLegData: [],
      responsess: [],
      planData: [],
      aproject: [],
      tableData: [],
      aproject1: [],
      programme: [],
      Eventlevel: [],
      eventsui: true,
      sibility: true,
      EventFormResponsibility: [],
      getreason: [],
      ject1: true,
      prog: true,
      level: true,
      tableName: 't_qar',
      uploadFile: true,
      safetyId: '',
      LIGHT_CONDITION: this.$store.state.ALL_SELECT_DATA.LIGHT_CONDITION.dicts,
      WEATHER_CONDITION: this.$store.state.ALL_SELECT_DATA.WEATHER_CONDITION.dicts,
      AIRCRAFT_DAMAGE: this.$store.state.ALL_SELECT_DATA.AIRCRAFT_DAMAGE.dicts,
      EVENT_TYEP: this.$store.state.ALL_SELECT_DATA.EVENT_TYEP.dicts,
      FLIGHT_DELAY: this.$store.state.ALL_SELECT_DATA.FLIGHT_DELAY.dicts,
      FLIGHT_PURPOSE: this.$store.state.ALL_SELECT_DATA.FLIGHT_PURPOSE.dicts
    }
  },
  created () {
    axios.get('/api/attach/list_all?' + 'tableName=' + 't_qar&' + 'sourceNumber=' + this.$route.params.id)
      .then(res => {
        if (res.data.error === 0) {
          this.tableData = res.data.data
        }
      })
    this.safetyId = this.$route.params.id
    axios.get('/api/qar/event/findOne?' + 'reportNumber=' + this.$route.params.id)
      .then(res => {
        if (res.data.error === 0) {
          this.QAR = res.data.data
          console.log(res.data.data)
          this.numsui = res.data.data.status + 1
        }
      })
    axios.get('/api/qar/case/listQarCaseDO?' + 'qarNumber=' + this.$route.params.id)
      .then(item => {
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
          axios.get('/api/qar/case/listQarCaseAnalysisDO?' + 'caseid=' + item.data.data[0].caseId)
            .then(item => {
              if (item.data.data.length === 0) {
                this.eventsui = false
              } else {
                this.eventsui = true
              }
              this.getreason = item.data.data
            })
          //  责任划分
          axios.get('/api/qar/case/listQarCaseResponsibilityDO?' + 'caseid=' + item.data.data[0].caseId)
            .then(item => {
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
    axios.get('/api/qar/plan/listQarPlanDO?' + 'reportNumber=' + this.$route.params.id)
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
    axios.get('/api/qar/event/listQarAuditId?' + 'reportNumber=' + this.$route.params.id)
      .then(res => {
        if (res.data.error === 0) {
          let Data = res.data.data.map(item => {
            if (item.auditType === 0) {
              item.auditType = '立项核准'
            } else if (item.auditType === -1) {
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
            if (item.auditResult === false) {
              item.auditResult = '驳回'
            } else if (item.auditResult === true) {
              item.auditResult = '通过'
            }
            return item
          })
          this.aproject = Data
          if (res.data.data.length === 0) {
            this.ject1 = false
          }
          this.aproject1.push(Data[0])
        }
      })
  },
  methods: {
    preservation () {
      let qarDetailDO = {
        eventName: this.QAR.eventName,
        eventNo: this.QAR.eventInstance,
        peakValue: this.QAR.eventValue,
        reportNumber: this.QAR.id
      }
      this.fullscreenLoading = true
      axios.post('/api/qar/event/addqarDetail', qarDetailDO)
        .then(res => {
          this.fullscreenLoading = false
          if (res.data.error === 0) {
            this.$message.success('保存成功')
            this.$router.back()
          } else {
            this.$message.error('保存失败')
          }
        })
        .catch(() => {
          this.fullscreenLoading = false
          this.$message.error('网咯超时请检查网咯')
        })
    },
    tiggleActions () {
      if (this.$refs.upDowns.className === 'icon-arrow-down') {
        this.$refs.upDowns.className = 'icon-arrow-up'
      } else {
        this.$refs.upDowns.className = 'icon-arrow-down'
      }
    },
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
    tiggleActionss () {
      if (this.$refs.upDownss.className === 'icon-arrow-down') {
        this.$refs.upDownss.className = 'icon-arrow-up'
      } else {
        this.$refs.upDownss.className = 'icon-arrow-down'
      }
    },
    tiggleActionsi () {
      if (this.$refs.upDownsi.className === 'icon-arrow-down') {
        this.$refs.upDownsi.className = 'icon-arrow-up'
      } else {
        this.$refs.upDownsi.className = 'icon-arrow-down'
      }
    },
    activelist (index, params) {
      if (params.length > 1) {
        params.shift()
      }
      this.caseId = index.caseId
      //  原因分类请求
      axios.get('/api/qar/case/listQarCaseAnalysisDO?' + 'caseid=' + index.caseId)
        .then(item => {
          if (item.data.data.length === 0) {
            this.eventsui = false
          } else {
            this.eventsui = true
          }
          this.getreason = item.data.data
        })
      //  责任划分
      axios.get('/api/qar/case/listQarCaseResponsibilityDO?' + 'caseid=' + index.caseId)
        .then(item => {
          if (item.data.data.length === 0) {
            this.sibility = false
          } else {
            this.sibility = true
          }
          this.EventFormResponsibility = item.data.data
        })
    },
    tiggleActions3 () {
      if (this.$refs.upDowns3.className === 'icon-arrow-down') {
        this.$refs.upDowns3.className = 'icon-arrow-up'
      } else {
        this.$refs.upDowns3.className = 'icon-arrow-down'
      }
    },
    Actions () {
      if (this.$refs.upDow.className === 'icon-arrow-down') {
          this.$refs.upDow.className = 'icon-arrow-up'
        } else {
          this.$refs.upDow.className = 'icon-arrow-down'
        }
    },
    goback () {
      this.$router.back(-1)
    }
  }
}
</script>
