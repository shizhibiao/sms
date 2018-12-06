<template>
  <b-card no-body>
    <b-card-header>飞行</b-card-header>
    <b-card-body>
      <el-form :model="operation" :rules="rules" ref="operation" status-icon size="medium" label-width="80px" inline-message>
        <div class="row">
          <div class="col-sm-12">
            <el-form-item label="航班日期" prop="flightDate">
              <el-date-picker
                style="width: 100%"
                v-model="operation.flightDate"
                type="date"
                placeholder="航班日期"
                value-format="yyyy-MM-dd"
                @change="flightDateAction">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="飞机号" prop="airNumber">
              <el-select v-model="operation.airNumber" @change="datalist" @focus="inputAction1" :disabled="operation.flightDate === ''">
                <el-option v-for="(item, index) in planData" :key="index" :label="item.aircraftno" :value="item.aircraftno"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="航段" prop="flightLeg">
              <el-select v-model="operation.flightLeg" @change="legAction" @focus="inputAction2" :disabled="operation.airNumber === ''">
                <el-option v-for="(item, index) in flightLegData" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="机型" prop="acType"><el-input v-model="operation.acType" placeholder="" disabled></el-input></el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="机组成员" prop="flightCrew">
              <el-input v-model="operation.flightCrew" placeholder="" disabled></el-input>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="飞行性质" prop="flightName">
              <el-select v-model="operation.flightName">
                <el-option v-for="(item, index) in byData.FLIGHT_PURPOSE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="飞行阶段" prop="flightPhase">
              <el-select v-model="operation.flightPhase">
                <el-option v-for="(item, index) in byData.FLIGHT_STATUS.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="气象条件" prop="weatherCondition">
              <el-select v-model="operation.weatherCondition">
                <el-option v-for="(item, index) in byData.WEATHER_CONDITION.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="光照条件" prop="lightCondition">
              <el-select v-model="operation.lightCondition">
                <el-option v-for="(item, index) in byData.LIGHT_CONDITION.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="事件类型" prop="eventType">
              <el-select v-model="operation.eventType">
                <el-option v-for="(item, index) in byData.EVENT_TYEP.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="事件等级" prop="eventGrade">
              <el-select v-model="operation.eventGrade">
                <el-option v-for="(item, index) in byData.EVENT_LEVEL.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="航班延误情况" prop="flightDelay">
              <el-select v-model="operation.flightDelay">
                <el-option v-for="(item, index) in byData.FLIGHT_DELAY.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="原因分类" prop="causeType">
              <el-select v-model="operation.causeType" prop="causeType">
                <el-option v-for="(item, index) in byData.REASON_TYEP.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="航空器损坏" prop="aircraftDamage">
              <el-select v-model="operation.aircraftDamage">
                <el-option v-for="(item, index) in byData.AIRCRAFT_DAMAGE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="有无人员伤亡" prop="injuriesDeaths">
              <el-radio v-model="operation.injuriesDeaths" :label="false">无</el-radio>
              <el-radio v-model="operation.injuriesDeaths" :label="true">有</el-radio>
            </el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.injuriesDeaths == true">
            <el-form-item label="伤" prop="injuries"><el-input v-model="operation.injuries" type="number" min="0"/></el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.injuriesDeaths == true">
            <el-form-item label="亡" prop="deaths"><el-input v-model="operation.deaths" type="number" min="0"/></el-form-item>
          </div>
        </div>
        <el-form-item label="事情简要经过" prop="eventDescription">
          <el-input
            type="textarea"
            placeholder="请输入内容"
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
  name: 'Flight',
  props: {
    byData: Object,
    compileData: Object
  },
  data () {
    return {
      flightLegData: [],
      operation: {
        // 航班日期
        flightDate: '',
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
        eventGrade: '一般事件',
        // 航空器损坏
        aircraftDamage: '未损坏',
        // 延误情况
        flightDelay: '未延误',
        // 有无人员伤亡
        injuriesDeaths: false,
        // 伤
        injuries: '',
        // 亡
        deaths: '',
        // 事情简要经过
        eventDescription: ''
      },
      planData: [],
      rules: {
        flightDate: [
          { required: true, message: '航班日期不能为空哦', trigger: 'blur' },
        ],
        airNumber: [
          { required: true, message: '飞机号不能为空哦', trigger: 'change' }
        ],
        flightLeg: [
          { required: true, message: '航段不能为空哦', trigger: 'change' }
        ],
        flightName: [
          { required: true, message: '飞行性质不能为空哦', trigger: 'change' }
        ],
        flightPhase: [
          { required: true, message: '飞行阶段不能为空哦', trigger: 'change' }
        ],
        eventType: [
          { required: true, message: '事件类型不能为空哦', trigger: 'change' }
        ],
        aircraftDamage: [
          { required: true, message: '航空器损坏不能为空哦', trigger: 'change' }
        ],
        eventDescription: [
          { required: true, message: '事情简要经过不能为空哦', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击航班日期获取到飞机号
    flightDateAction () {
      this.operation.flightCrew = ''
      this.operation.acType = ''
      this.operation.airNumber = ''
      this.operation.flightLeg = ''
      let flightDate = this.operation.flightDate
      axios.get('/api/third/foc/' + flightDate)
        .then(response => {
          if (response.data.error === 0) {
            // console.log(response.data)
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
        this.$layer.msg('请先填写航班日期')
      } else {
        let flightDate = this.operation.flightDate
        let airNumber = this.operation.airNumber
        axios.get('/api/third/foc/' + flightDate + '?' + 'aircraftNo=' + airNumber)
          .then(response => {
            if (response.data.error === 0) {
              response.data.data.map(item => {
                let depAirportCN = item.depAirportCN ? item.depAirportCN : item.depCode
                let arrivalAirportCN = item.arrivalAirportCN ? item.arrivalAirportCN : item.arrivalCode
                this.flightLegData.push({
                  name: depAirportCN + '-' + arrivalAirportCN,
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
        this.$layer.msg('请先填写航班日期和飞机号')
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
                    this.operation.flightCrew = '暂无数据'
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
                this.operation.acType = '暂无数据'
                this.operation.flightCrew = '暂无数据'
              }
            }
          })
          .catch(error => { console.log(error) })
      }
    },
    // 当飞机号的input框获取焦点时触发
    inputAction1 () {
      if (this.operation.flightDate === '') {
        this.$layer.msg('请先填写航班日期')
      } else {
          return
      }
    },
    // 当航段的input框获取焦点时触发
    inputAction2 () {
      if (this.operation.flightDate === '') {
        this.$layer.msg('请先填写航班日期')
      } else if (this.operation.airNumber === '') {
        this.$layer.msg('请先填写飞机号')
      } else {
          return
      }
    }
  },
  mounted () {
    // 触发传值给父组件
    this.$emit('getFlight', this.operation)
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


