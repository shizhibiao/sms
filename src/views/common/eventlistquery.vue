<template>
<el-form :model="operation" label-width="120px" :rules="rules" ref="operation" status-icon :inline-message="true" size="medium" >
  <b-card no-body>
    <div slot="header" v-if="common === 'true'">
        飞行
        <div class="card-actions">
          <b-btn class="btn btn-minimize" @click="Actions" v-b-toggle.coll1>
            <i class="icon-arrow-down" ref="upDow"></i>
          </b-btn>
        </div>
    </div>
    <b-collapse id="coll1" visible>
    <b-card-body>
      <div class="row">
      <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="航班日期">
            <el-date-picker
            :disabled="num === 0"
              v-model="operation.flightDate"
              type="date"
              style="width:100%"
              @change="btnlist"
              placeholder="报告时间" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </div>
      <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="飞机号">
            <el-select v-model="operation.airNumber" @change="datalist" @visible-change="anbtn"  style="width:100%" :disabled="num === 0  || ishow === 0">
              <el-option
               v-for="(item, index) in planData" :key="index" :label="item.aircraftno" :value="item.aircraftno"></el-option>
            </el-select>
          </el-form-item>
        </div>
     
    <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="航段">
            <el-select v-model="operation.flightLeg" @change="flightLeglist" @visible-change="anbtns" value-key="name"  style="width:100%" :disabled="num === 0 || ishows === 0">
              <el-option v-for="(item, index) in flightLegData" :key="index" :label="item.name" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </div>
    <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="机型"><el-input disabled v-model="operation.acType" placeholder=""></el-input></el-form-item>
        </div>
    
     <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="机组成员">
            <el-input disabled v-model="operation.flightCrew" placeholder=""></el-input>
          </el-form-item>
        </div>
     <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="飞行性质" >
            <el-select v-model="operation.flightName"  style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.FLIGHT_PURPOSE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
     
    <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="飞行阶段">
            <el-select v-model="operation.flightPhase"  style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.FLIGHT_STATUS.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
     <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="气象条件">
            <el-select v-model="operation.weatherCondition"  style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.WEATHER_CONDITION.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
     
     <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="光照条件">
            <el-select v-model="operation.lightCondition"  style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.LIGHT_CONDITION.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
     <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="事件类型" class="">
            <el-select v-model="operation.eventType"  style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.EVENT_TYEP.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
     
    <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="事件等级" class="">
            <el-select v-model="operation.eventGrade"  style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.EVENT_LEVEL.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
     <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="航班延误情况" >
            <el-select v-model="operation.flightDelay"  style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.FLIGHT_DELAY.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
     
     <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="原因分类">
            <el-select v-model="operation.causeType"  style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.REASON_TYEP.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
      <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="航空器损坏">
            <el-select v-model="operation.aircraftDamage" style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.AIRCRAFT_DAMAGE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
     
      <div class="row" v-if="operation.injuriesDeaths">
        <div class="col">
          <el-form-item label="有无人员伤亡">
            <el-radio v-model="operation.injuriesDeaths" label="false">无</el-radio>
            <el-radio v-model="operation.injuriesDeaths" label="true">有</el-radio>
          </el-form-item>
        </div>
        <div class="col"><el-form-item label="伤"><el-input v-model="operation.injuries" type="number"/></el-form-item></div>
        <div class="col"><el-form-item label="亡"><el-input v-model="operation.deaths" type="number"/></el-form-item></div>
      </div>
      </div>
          <el-form-item label="事情简要经过" prop="eventDescription">
              <el-input placeholder="请输入内容" v-model="operation.eventDescription" class="input-with-select"   :disabled="num === 0">
                <el-select slot="prepend" v-model="suiselect"   placeholder="请选择" style="width:110px" @change="xuanze" :disabled="num === 0">
                  <el-option v-for="(item,index) in REPORT_Title" :key="index" :label=item.dictCode :value=item.dictName>
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>

          <!-- <el-form-item label="事情简要经过" prop="eventDescription">
            <el-input
              type="textarea"
              :disabled="num === 0"
              placeholder="请输入内容"
              v-model="operation.eventDescription" style="width:100%">
            </el-input>
          </el-form-item> -->




    </b-card-body>
    </b-collapse>
  </b-card>
</el-form>
</template>
<script>
import axios from 'axios'
import { sourceDataFilter } from '../../tools'
export default {
  name: 'Flight',
  props: {
    byData: Object
  },
  data () {
    return {
      REPORT_Title: this.$store.state.ALL_SELECT_DATA.EVENT_FILGHT_TITLE.dicts,
      suiselect: '',
      rules: {
        eventDescription: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {max: 200,min:2, message: '长度在 2 到 200 个字符', trigger: 'blur'}
        ]
      },
      num: 1,
      ishow: 0,
      ishows: 0,
      common: 'true',
      flightLegData: [],
      operation: {
        // 航班日期
        flightDate: '',
        // 航班号
        //  flightNo: '',
        // 机号
        airNumber: '',
        // 机型
        acType: '',
        // 航段
        flightLeg: '',
        // 机组成员
        flightCrew: '',
        // 飞行性质
        flightName: '',
        // 飞行阶段
        flightPhase: '',
        // 光照条件
        lightCondition: '',
        // 气象条件
        weatherCondition: '',
        // 事件类型
        eventType: '',
        // 原因分类
        causeType: '',
        // 事件等级
        eventGrade: '1',
        // 航空器损坏
        aircraftDamage: '1',
        // 延误情况
        flightDelay: '4',
        // 有无人员伤亡
        injuriesDeaths: false,
        // 伤
        injuries: '',
        // 亡
        deaths: '',
        //  主要事情经过
        eventDescription: ''
      },
      planData: []
    }
  },
  methods: {
    xuanze() {
      this.operation.eventDescription = this.suiselect
    },
    validateForm () {
      console.log(1)
      this.$refs['operation'].validate((valid) => {
          if (valid) {
            //  alert('submit!');
          } else {
            return false;
          }
        })
    },
    btnlist () {
      this.ishow = 1
      this.operation.flightLeg = ''
      this.operation.flightCrew = ''
      this.operation.acType = ''
      this.operation.airNumber = ""
      this.planData = []
      this.flightLegData = []
      let flightDate = this.operation.flightDate
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
        .catch(error => { console.log(error) })
    },
    anbtn (parmas) {
      if (parmas === true) {
        if (this.operation.flightDate === '') {
          this.$message({
            type: 'error',
            message: '请先填写航班日期'
          })
        }
      }
    },
    anbtns (parmas) {
      if (parmas === true) {
        if (this.operation.flightDate === '' || this.operation.airNumber === "") {
          this.$message({
            type: 'error',
            message: '请先填写航班日期和飞机号'
          })
        }
      }
    },
    dataFilter (avlue, type) {
      let sourceData = this.ALL_SELECT_DATA[type]
      let result = sourceDataFilter(sourceData, avlue)
      return result
    },
    datalist () {
      this.ishows = 1
      this.operation.flightLeg = ''
      this.operation.flightCrew = ''
      this.operation.acType = ''
      if (this.operation.flightDate === '') {
        this.$message({
          type: 'error',
          message: '请先填写航班日期'
        })
      } else {
        let flightDate = this.operation.flightDate
        let airNumber = this.operation.airNumber
        axios.get('/api/third/foc/' + flightDate + '?' + 'aircraftNo=' + airNumber)
          .then(response => {
            if (response.data.error === 0) {
              response.data.data.map(item => {
                if (item.depAirportCN !== '' || item.arrivalAirportCN !== '') {
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
          .catch(error => { console.log(error) })
      }
    },
    flightLeglist (parmas) {
      let flightLeg = this.operation.flightLeg.code
      let flightDate = this.operation.flightDate
      let airNumber = this.operation.airNumber
      this.operation.flightLeg = this.operation.flightLeg.name
      if (this.operation.flightDate === '' || this.operation.airNumber === '') {
        this.$message({
          type: 'error',
          message: '请先填写航班日期和飞机号'
        })
        this.operation.flightLeg = ''
      } else {
        axios.get('/api/third/foc/' + flightDate + '?' + 'aircraftNo=' + airNumber + '&' + 'legcf=' + flightLeg)
          .then(response => {
            if (response.data.error === 0) {
              response.data.data.map(item => {
                this.operation.acType = item.acType
                // 判断数据是否为null或者undefined
                if (item.picValue === null && item.sicValue === null && item.cValue === undefined) {
                  //  this.operation.flightCrew = '暂无数据'
                } else if (item.sicValue === null && item.sicValue === null) {
                  this.operation.flightCrew = item.picValue
                } else if (item.picValue === null && item.cValue === null) {
                  this.operation.flightCrew = item.sicValue
                } else if (item.picValue === null && item.sicValue === null) {
                  this.operation.flightCrew = item.cValue
                } else if (item.cValue === undefined) {
                  this.operation.flightCrew = item.picValue + '、' + item.sicValue
                } else if (item.sicValue === null) {
                  this.operation.flightCrew = item.picValue + '、' + item.cValue
                } else if (item.picValue === null) {
                  // console.log(234)
                  this.operation.flightCrew = item.sicValue + '、' + item.cValue
                } else {
                  // console.log(123)
                  this.operation.flightCrew = item.picValue + '、' + item.sicValue + '、' + item.cValue
                }
              })
            }
          })
          .catch(error => { console.log(error) })
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
  computed: {
    ALL_SELECT_DATA () {
      return this.$store.state.ALL_SELECT_DATA
    }
  },
  created () {
    console.log(this.$store.state.ALL_SELECT_DATA.EVENT_FILGHT_TITLE)
  }
}
</script>
