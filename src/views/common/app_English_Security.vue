<template>
  <b-card no-body>
    <b-card-header>security</b-card-header>
    <b-card-body>
      <el-form :model="operation" :rules="rules" ref="operation" status-icon size="medium" label-width="80px" inline-message>
        <div class="row">
          <div class="col-sm-12">
            <el-form-item label="Aircraft" prop="relAircraft">
              <el-radio v-model="operation.relAircraft" :label="true">Related</el-radio>
              <el-radio v-model="operation.relAircraft" :label="false">Unrelated</el-radio>
            </el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="Flight Date" prop="flightDate">
              <el-date-picker
                style="width: 100%"
                v-model="operation.flightDate"
                type="date"
                placeholder="Please select an option"
                value-format="yyyy-MM-dd"
                @change="flightDateAction">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="Aircraft Code" prop="airNumber">
              <el-select v-model="operation.airNumber" @change="datalist" placeholder="Please select an option" @focus="inputAction1" :disabled="operation.flightDate === ''">
                <el-option v-for="(item, index) in planData" :key="index" :label="item.aircraftno" :value="item.aircraftno"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="Segment" prop="flightLeg">
              <el-select v-model="operation.flightLeg" @change="legAction" placeholder="Please select an option" @focus="inputAction2" :disabled="operation.airNumber === ''">
                <el-option v-for="(item, index) in flightLegData" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="Crew" prop="flightCrew">
              <el-input v-model="operation.flightCrew" placeholder="" disabled></el-input>
            </el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="Aircraft Type" prop="acType">
              <el-input v-model="operation.acType" placeholder="" disabled></el-input>
            </el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relAircraft == true">
          </div>
          <div class="col-sm-12">
            <el-form-item label="Security Incident Category" prop="secEventCategory">
              <el-select v-model="operation.secEventCategory" placeholder="Please select an option">>
                <el-option v-for="(item, index) in byData.SECURITY_EVENT_TYPE.dicts" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="Security Incident Type 1" prop="secEventType1">
              <el-select v-model="operation.secEventType1" placeholder="Please select an option">>
                <el-option v-for="(item, index) in byData.SECURITY_EVENT_TYPE1.dicts" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="Security Incident Type 2" prop="secEventType2">
              <el-select v-model="operation.secEventType2" placeholder="Please select an option">>
                <el-option v-for="(item, index) in byData.SECURITY_EVENT_TYPE2.dicts" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="Event Level" prop="eventGrade">
              <el-select v-model="operation.eventGrade" placeholder="Please select an option">>
                <el-option v-for="(item, index) in byData.EVENT_LEVEL.dicts" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="Delays" prop="flightDelay">
              <el-select v-model="operation.flightDelay" placeholder="Please select an option">>
                <el-option v-for="(item, index) in byData.FLIGHT_DELAY.dicts" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="Aircraft Damage" prop="aircraftDamage">
              <el-select v-model="operation.aircraftDamage" placeholder="Please select an option">>
                <el-option v-for="(item, index) in byData.AIRCRAFT_DAMAGE.dicts" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="People Injury" prop="injuriesDeaths">
              <el-radio v-model="operation.injuriesDeaths" :label="false">No</el-radio>
              <el-radio v-model="operation.injuriesDeaths" :label="true">Yes</el-radio>
            </el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.injuriesDeaths == true">
            <el-form-item label="Injured" prop="injuries"><el-input v-model="operation.injuries" type="number" min="0"/></el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.injuriesDeaths == true">
            <el-form-item label="Death" prop="deaths"><el-input v-model="operation.deaths" type="number" min="0"/></el-form-item>
          </div>
        </div>
        <el-form-item label="Context" prop="eventDescription">
          <el-input
            type="textarea"
            placeholder="Please enter content"
            v-model="operation.eventDescription"
            maxlength="200">
          </el-input>
        </el-form-item>
      </el-form>
    </b-card-body>
  </b-card>
</template>
<script>
import axios from 'axios'

export default {
  name: 'Security',
  props: {
    byData: Object,
    compileData: Object
  },
  data () {
    return {
      flightLegData: [],
      operation: {
        // 是否与航空器相关
        relAircraft: true,
        // 航班日期
        flightDate: '',
        // 机组成员
        flightCrew: '',
        // 航段
        flightLeg: '',
        // 安保事件类别
        secEventCategory: '',
        // 安保事件类型1
        secEventType1: '',
        // 安保事件类型2
        secEventType2: '',
        // 飞机号
        airNumber: '',
        // 机型
        acType: '',
        // 事件等级
        eventGrade: '1',
        // 航班延误情况
        flightDelay: '4',
        // 航空器损坏
        aircraftDamage: '1',
        //  有无人员伤亡
        injuriesDeaths: false,
        // 伤
        injuries: '',
        // 亡
        deaths: '',
        // 事情简要经过
        eventDescription: ''
      },
      planData: [],
      // 表单验证
      rules: {
        relAircraft: [
          { required: true, message: 'Aircraft correlation', trigger: 'change' },
        ],
        flightDate: [
          { required: true, message: 'The flight date cannot be empty', trigger: 'blur' },
        ],
        airNumber: [
          { required: true, message: "The plane can't be empty", trigger: 'change' }
        ],
        flightLeg: [
          { required: true, message: 'The segment cannot be empty', trigger: 'change' }
        ],
        secEventType1: [
          { required: true, message: 'Security incident type one cannot be empty', trigger: 'change' }
        ],
        secEventType2: [
          { required: true, message: 'Security incident type two cannot be empty', trigger: 'change' }
        ],
        aircraftDamage: [
          { required: true, message: 'The aircraft cannot be empty', trigger: 'change' }
        ],
        eventDescription: [
          { required: true, message: 'A brief account cannot be empty', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击航班日期获取到飞机号
    flightDateAction () {
      this.operation.flightLeg = ''
      this.operation.flightCrew = ''
      this.operation.acType = ''
      this.operation.airNumber = ''
      let flightDate = this.operation.flightDate
      axios.get('/api/third/foc/' + flightDate)
        .then(response => {
          if (response.data.error === 0) {
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
    datalist () {
      this.operation.flightLeg = ''
      this.operation.flightCrew = ''
      this.operation.acType = ''
      if (this.operation.flightDate === '') {
        this.$layer.msg('Please fill in the flight date first')
      } else {
        let flightDate = this.operation.flightDate
        let airNumber = this.operation.airNumber
        axios.get('/api/third/foc/' + flightDate + '?' + 'aircraftNo=' + airNumber)
          .then(response => {
            if (response.data.error === 0) {
              response.data.data.map(item => {
                let depAirportEN = item.depAirportEN ? item.depAirportEN : item.depCode
                let arrivalAirportEN = item.arrivalAirportEN ? item.arrivalAirportEN : item.arrivalCode
                this.flightLegData.push({
                  name: depAirportEN + '-' + arrivalAirportEN,
                  code: item.depCode + '-' + item.arrivalCode
                })
              })
            }
          })
          .catch(error => { console.log(error) })
      }
    },
    // 点击航段获取到机型和机组成员
    legAction () {
      let flightLeg = this.operation.flightLeg
      let flightDate = this.operation.flightDate
      let airNumber = this.operation.airNumber
      if (this.operation.flightDate === '' || this.operation.airNumber === '') {
        this.$layer.msg('Please fill in the flight date and flight number first')
        this.operation.flightLeg = ''
      } else {
        axios.get('/api/third/foc/' + flightDate + '?' + 'aircraftNo=' + airNumber + '&' + 'legcf=' + flightLeg)
          .then(response => {
            if (response.data.error === 0) {
              if (response.data.data.length > 0) {
                response.data.data.map(item => {
                  this.operation.acType = item.acType
                  // 判断数据是否为null或者undefined
                  if (item.picValue === null && item.sicValue === null && item.cValue === undefined) {
                    this.operation.flightCrew = 'No Data'
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
              } else {
                this.operation.acType = 'No Data'
                this.operation.flightCrew = 'No Data'
              }
            }
          })
          .catch(error => { console.log(error) })
      }
    },
    // 当飞机号的input框获取焦点时触发
    inputAction1 () {
      if (this.operation.flightDate === '') {
        this.$layer.msg('Please fill in the flight date first')
      } else {
          return
      }
    },
    // 当航段的input框获取焦点时触发
    inputAction2 () {
      if (this.operation.flightDate === '') {
        this.$layer.msg('Please fill in the flight date first')
      } else if (this.operation.airNumber === '') {
        this.$layer.msg('Please fill in the plane number first')
      } else {
          return
      }
    }
  },
  mounted () {
    // 将数据传给父组件
    this.$emit('getSecurity', this.operation)
    // 编辑页面传过来的值
    if (this.compileData.path === 'reportCompile') {
      this.operation = this.compileData.data
    }
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