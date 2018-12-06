<template>
  <div class="animated fadeIn">
   <el-form :model="QAR" label-width="120px" :rules="rules" ref="QAR" status-icon :inline-message="true" size="medium" >
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
                        <el-date-picker  style="width:100%" v-model="QAR.occurDate"
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
                    placeholder="报告时间" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="飞机号" prop="airNumber">
                    <el-select v-model="QAR.airNumber" @change="datalist"  style="width:100%">
                    <el-option
                    v-for="(item, index) in planData" :key="index" :label="item.aircraftno" :value="item.aircraftno"></el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="航段" prop="flightLeg">
                    <el-select v-model="QAR.flightLeg" @change="flightLeglist" value-key="name" style="width:100%">
                    <el-option v-for="(item, index) in flightLegData" :key="index" :label="item.name" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="机型" >
                        <el-input disabled v-model="QAR.acType" placeholder=""></el-input>
                    </el-form-item>
                </div>
                 <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="机组成员" >
                        <el-input disabled v-model="QAR.flightCrew" placeholder=""></el-input>
                    </el-form-item>
                </div>

                


                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="飞行阶段(QAR)">
                        <el-select v-model="QAR.flightPhaseQar" style="width:100%">
                        <el-option v-for="(item, index) in responsess" :key="index" :label="item.stateName" :value="item.stateName"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                 <div class="col-lg-6 col-md-6 col-sm-12">
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
                <div class="col-lg-6 col-md-6 co l-sm-12">
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

                <div class="col-lg-12 col-md-12 col-sm-12">
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
      <security-notice-adjunct
        ref='adjunct'
        :tableName='tableName'
        :uploadFile='uploadFile'
        :safetyId='safetyId'>
      </security-notice-adjunct>
      <b-card no-body v-if="fromisshow">
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
                          <el-button @click="tabledelete(scope.$index, scope.row, formlist)" :disabled='scope.$index === 0' size='small' type="danger">移 除</el-button>
                        </template>
                    </el-table-column>
                 </el-table>
             </b-card-body>
            </el-form>
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
                <el-button type="success" size='mini' @click="dialogFormVisibleback('form')">返 回</el-button>
              </div>
        </el-dialog>
      <b-card no-body>
          <b-card-body>
            <div class="text-center">
               <el-button @click="preservation('QAR')" size='small'  type="primary">确 定</el-button>
                <el-button @click="sendout" size='small' :disabled="nolist" v-if="isshow" v-loading.fullscreen.lock="fullscreenLoading"  type="success">发 送</el-button>
              <el-button type="warning" size='small' :disabled="nolist" v-if="isshow" @click="process">结束流程</el-button>
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
  components: {
    SecurityNoticeAdjunct
  },
  data () {
    return {
      tdAirport: '',
      toAirport: '',
      flightLegData: [],
      rules: {
        title: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {max: 200, min:2, message: '长度在 2 到 200 个字符', trigger: 'blur'}
        ],
        pm: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {max: 20, min:2, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        pmTechLevel: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {max: 20, min:2, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        pf: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {max: 20, min:2, message: '长度在 2 到 20 个字符', trigger: 'blur'}
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
        ],
        flightLeg: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]
      },
      QAR: {
        lightCondition: '',
        eventType: '',
        aircraftDamage: '',
        weatherCondition: '',
        flightDelay: '',
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
        ids: 0,
        eventGrade: ''
      },
      statuss: [],
      safetyId: '',
      uploadFile: true,
      planData: [],
      planDatas: [],
      tableName: 't_qar',
      queryParams: {},
      formlist: [],
      classification: false,
      causeclassification: {
        eventNo: null,
        eventName: '',
        peakValue: ''
      },
      formLabelWidth: '120px',
      objlist: {},
      ids: [],
      onShow: false,
      legstutass: [],
      responsess: [],
      tableData: [],
      isshow: false,
      nums: 0,
      nolist: false,
      dialogFormVisible: false,
      form: {
        auditComment: ''
      },
      fullscreenLoading: false,
      fromisshow: true,
      arr: [],
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
          type: 'info',
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
                  //this.QAR.flightCrew = '暂无数据'
                } else if (item.sicValue === null && item.sicValue === null) {
                  this.QAR.flightCrew = item.picValue
                } else if (item.picValue === null && item.cValue === null) {
                  this.QAR.flightCrew = item.sicValue
                } else if (item.picValue === null && item.sicValue === null) {
                  this.QAR.flightCrew = item.cValue
                } else if (item.cValue === undefined) {
                  this.QAR.flightCrew = item.picValue + '、' + item.sicValue
                } else if (item.sicValue === null) {
                  this.QAR.flightCrew = item.picValue + '、' + item.cValue
                } else if (item.picValue === null) {
                  this.QAR.flightCrew = item.sicValue + '、' + item.cValue
                } else {
                  this.QAR.flightCrew = item.picValue + '、' + item.sicValue + '、' + item.cValue
                }
              })
            }
          })
      }
    },
    goback () { this.$router.push({ path: '/qar/list' }) },
    //  保存
    preservation (formName) {
      this.$refs[formName].validate((valid)=>{
        if(valid) {
          this.QAR.ids = this.arr.join(',')
          this.QAR.listQarDetail = this.formlist
          let QarDO = this.QAR
          axios.post('/api/qar/event/updateQar', QarDO)
            .then(res => {
              if (res.data.error === 0) {
                this.$message.success('修改成功')
                this.$router.back(-1)
                this.nums = 1
                this.nolist = false
              } else {
                this.$message.error('保存失败' + res.data.message)
              }
            })
        } else {
          return false
        }
      })
      
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
    dialogFormVisibleback (form) {
      this.dialogFormVisible = false
      this.$refs[form].resetFields()
    },
    //  删除
    tabledelete (index, paramas, rows) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          axios.delete('/api/qar/event/deleteQarDetail?' + 'detailId=' + paramas.detailId)
            .then(res => {
              if (res.data.error === 0) {
                rows.splice(index, 1)
              } else {
                this.$message.error('删除失败:' + res.data.message)
              }
            })
        })
    },
    newlyaddeds () {
      this.classification = true
      let arr = []
      this.formlist.map(item => {
        arr.push(item.qarEventId)
      })
      axios.post('/api/qar/event/listQarEventStart?' + 'id=' + arr + '&tdDatetime=' + this.QAR.flightDate + '&airNumber=' + this.QAR.airNumber + '&tdAirport=' + this.tdAirport + '&toAirport=' + this.toAirport)
        .then(res => {
          this.planDatas = res.data.data
        })
    },
    //  新增
    newlyadded () {
      this.classification = true
      let arr = []
      this.formlist.map(item => {
        arr.push(item.qarEventId)
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
        axios.post('/api/qar/event/addqarDetails', this.objlist)
        .then(res => {
          if (res.data.error === 0) {
            this.$message.success('新增成功')
          }
          axios.get('/api/qar/event/selectQarDetail?' + 'reportNumber=' + this.$route.params.id)
          .then(res => {
            if (res.data.error === 0) {
              if (res.data.data.length === 0) {
                this.fromisshow = false
              }
              this.formlist = res.data.data
            }
          })
        })
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
      this.arr.push(id)
      axios.post('/api/qar/event/listQarEventId?' + 'id=' + id)
        .then(res => {
          if (res.data.error === 0) {
            this.causeclassification.eventNo = res.data.data.eventCode
            this.causeclassification.eventName = res.data.data.eventName
            this.causeclassification.peakValue = res.data.data.eventValue
            //  this.causeclassification.reportNumber = res.data.data.id
            let objlist = {}
            objlist.eventNo = res.data.data.eventCode
            objlist.eventName = res.data.data.eventName
            objlist.peakValue = res.data.data.eventValue
            objlist.reportNumber = this.$route.params.id
            objlist.qarEventId = res.data.data.id
            this.objlist = objlist
            this.idi = res.data.data.id
          }
        })
    },
    process () {
      this.dialogFormVisible = true
    },
    project (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let eventid = parseInt(this.$route.params.id)
          let taskId = this.$route.params.taskId
          let qarVo = {
            qarAuditDO: {
              reportNumber: eventid,
              auditComment: this.form.auditComment,
              auditUserName: this.$store.state.user.userName
            },
            result: 2,
            taskInfo: {
              taskId: taskId
            }
          }
          axios.post('/api/qar/complete', qarVo)
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
      axios.get('/api/qar/start/' + this.$route.params.id + '/' + this.$store.state.user.userName)
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
    }
  },
  created () {
    this.safetyId = this.$route.params.id
    axios.get('/api/third/foc/selectfoc')
      .then(res => {
        this.legstutass = res.data.data
      })
    axios.get('/api/qar/event/listQars')
      .then(res => {
        if (res.data.error === 0) {
          this.responsess = res.data.data
        }
      })
    axios.get('/api/qar/event/findOne?' + 'reportNumber=' + this.$route.params.id)
      .then(res => {
        if (res.data.error === 0) {
          if (res.data.data.procInstId !== null) {
            this.isshow = true
          }
          this.QAR = res.data.data
          this.toAirport = res.data.data.flightLeg.split('-')[1]
          this.tdAirport = res.data.data.flightLeg.split('-')[0]
          axios.get('/api/attach/list?' + 'tableName=' + 't_qar&' + 'sourceNumber=' + res.data.data.reportNumber + '&' + 'procStatus=' + res.data.data.status)
            .then(res => {
              if (res.data.error === 0) {
                this.tableData = res.data.data
              }
            })
        }
      })
    axios.get('/api/qar/event/selectQarDetail?' + 'reportNumber=' + this.$route.params.id)
      .then(res => {
        if (res.data.error === 0) {
          // if (res.data.data.length === 0 && this.$route.params.taskId !== '0') {
          //   this.fromisshow = false
          // }
          if (res.data.data.length === 0) {
            this.fromisshow = false
          }
          this.formlist = res.data.data
        }
      })
  },
  mounted () {
    this.$watch('QAR', () => {
      this.nums++
      if (this.nums > 1) {
        this.nolist = true
      }
    }, {
      deep: true
    })
  }
}
</script>
