<template>
  <b-card no-body>
    <b-card-header>地面</b-card-header>
    <b-card-body>
      <el-form :model="operation" :rules="rules" ref="operation" status-icon size="medium" label-width="120px" inline-message>
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <el-form-item label="航空器" prop="relAircraft">
              <el-radio v-model="operation.relAircraft" :label="true">相关</el-radio>
              <el-radio v-model="operation.relAircraft" :label="false">无关</el-radio>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="">航空器1</el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12"  v-if="operation.relAircraft == true">
            <el-form-item label="">航空器2</el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="机型" prop="acType1">
              <el-input v-model="operation.acType1" placeholder="" maxlength="20"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="机型" prop="acType2">
              <el-input v-model="operation.acType2" placeholder="" maxlength="20"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="飞机号" prop="acNo1">
              <el-input v-model="operation.acNo1" placeholder="" maxlength="10"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="飞机号" prop="acNo2">
              <el-input v-model="operation.acNo2" placeholder="" maxlength="10"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="所属单位" prop="acCompany1">
              <el-input v-model="operation.acCompany1" placeholder="" maxlength="100"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="所属单位" prop="acCompany2">
              <el-input v-model="operation.acCompany2" placeholder="" maxlength="100"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="运行阶段" prop="runPhase1">
              <el-select v-model="operation.runPhase1">
                <el-option v-for="(item, index) in byData.RUNNING_STATUS.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="运行阶段" prop="runPhase2">
              <el-select v-model="operation.runPhase2">
                <el-option v-for="(item, index) in byData.RUNNING_STATUS.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12">
            <el-form-item label="车辆种类" prop="relCar">
              <el-radio v-model="operation.relCar" :label="true">相关</el-radio>
              <el-radio v-model="operation.relCar" :label="false">无关</el-radio>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relCar == true">
            <el-form-item label="">车辆1</el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relCar == true">
            <el-form-item label="">车辆2</el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relCar == true">
            <el-form-item label="车辆类型" prop="carType1">
              <el-select v-model="operation.carType1">
                <el-option v-for="(item, index) in byData.CAR_CATEGORY.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relCar == true">
            <el-form-item label="车辆类型" prop="carType2">
              <el-select v-model="operation.carType2">
                <el-option v-for="(item, index) in byData.CAR_CATEGORY.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relCar == true">
            <el-form-item label="所属单位" prop="carCompany1"><el-input v-model="operation.carCompany1" placeholder="" maxlength="100"></el-input></el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="operation.relCar == true">
            <el-form-item label="所属单位" prop="carCompany2"><el-input v-model="operation.carCompany2" placeholder="" maxlength="100"></el-input></el-form-item>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12">
            <el-form-item label="地面设施" prop="relGroundDevice">
              <el-radio v-model="operation.relGroundDevice" :label="true">相关</el-radio>
              <el-radio v-model="operation.relGroundDevice" :label="false">无关</el-radio>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12"  v-if="operation.relGroundDevice == true">
            <el-form-item label="地面设施/设备名" prop="deviceName">
              <el-input v-model="operation.deviceName" placeholder="" maxlength="50"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12"  v-if="operation.relGroundDevice == true">
            <el-form-item label="所属单位" prop="deviceCompany">
              <el-input v-model="operation.deviceCompany" placeholder="" maxlength="100"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="原因分类" prop="causeType">
              <el-select v-model="operation.causeType">
                <el-option v-for="(item, index) in byData.REASON_TYEP.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="事件等级" prop="eventGrade">
              <el-select v-model="operation.eventGrade">
                <el-option v-for="(item, index) in byData.EVENT_LEVEL.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="航班延误情况" prop="flightDelay">
              <el-select v-model="operation.flightDelay">
                <el-option v-for="(item, index) in byData.FLIGHT_DELAY.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="事件类型" prop="eventType">
              <el-select v-model="operation.eventType">
                <el-option v-for="(item, index) in byData.EVENT_TYEP.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="航空器损坏" prop="aircraftDamage">
              <el-select v-model="operation.aircraftDamage">
                <el-option v-for="(item, index) in byData.AIRCRAFT_DAMAGE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="有无人员伤亡" prop="injuriesDeaths">
              <el-radio v-model="operation.injuriesDeaths" :label="false">无</el-radio>
              <el-radio v-model="operation.injuriesDeaths" :label="true">有</el-radio>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12"  v-if="operation.injuriesDeaths == true">
            <el-form-item label="伤"><el-input v-model="operation.injuries" type="number" min="0"/></el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12"  v-if="operation.injuriesDeaths == true">
            <el-form-item label="亡"><el-input v-model="operation.deaths" type="number" min="0"/></el-form-item>
          </div>
        </div>
        <el-form-item label="事情经过模板">
          <el-select v-model="select" placeholder="请选择" style="width: 140px;" @change="selectAction">
            <el-option v-for="(item, index) in byData.EVENT_GROUND_TITLE.dicts" :key="index" :label="item.dictCode" :value="item.dictCode"></el-option>
          </el-select>
        </el-form-item>
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
export default {
  name: 'Ground',
  props: {
    byData: Object,
    compileData: Object
  },
  data () {
    return {
      operation: {
        // 航空器是否相关
        relAircraft: true,
        // 机型1
        acType1: '',
        // 飞机号1
        acNo1: '',
        // 所属单位1
        acCompany1: '',
        // 机型2
        acType2: '',
        // 飞机号2
        acNo2: '',
        // 所属单位2
        acCompany2: '',
        // 运行阶段1
        runPhase1: '',
        // 运行阶段2
        runPhase2: '',
        // 是否与车辆相关
        relCar: true,
        // 车辆类型1
        carType1: '',
        // 车辆类型2
        carType2: '',
        // 所属单位1
        carCompany1: '',
        // 所属单位2
        carCompany2: '',
        // 是否与地面设施相关
        relGroundDevice: true,
        // 地面设施/设备名
        deviceName: '',
        // 原因分类
        causeType: '',
        // 所属单位
        deviceCompany: '',
        // 事件等级
        eventGrade: '一般事件',
        // 航班延误情况
        flightDelay: '未延误',
        // 事件类型
        eventType: '',
        // 航空器损坏
        aircraftDamage: '未损坏',
        // 有无人员受伤
        injuriesDeaths: false,
        // 伤
        injuries: '',
        // 亡
        deaths: '',
        // 事情的简要经过
        eventDescription: ''
      },
      rules: {
        relAircraft: [
          { required: true, message: '航空器不能为空', trigger: 'change' }
        ],
        acType1: [
          { required: true, message: '机型不能为空', trigger: 'blur' }
        ],
        acNo1: [
          { required: true, message: '飞机号不能为空', trigger: 'blur' }
        ],
        runPhase1: [
          { required: true, message: '运行阶段不能为空', trigger: 'change' }
        ],
        relGroundDevice: [
          { required: true, message: '地面设施不能为空', trigger: 'change' }
        ],
        deviceName: [
          { required: true, message: '地面设施/设备名不能为空', trigger: 'blur' }
        ],
        relCar: [
          { required: true, message: '车辆种类不能为空', trigger: 'change' }
        ],
        carType1: [
          { required: true, message: '车辆类型不能为空', trigger: 'change' }
        ],
        eventType: [
          { required: true, message: '事件类型不能为空哦', trigger: 'change' }
        ],
        causeType: [
          { required: true, message: '原因分类不能为空哦', trigger: 'change' }
        ],
        aircraftDamage: [
          { required: true, message: '航空器损坏不能为空哦', trigger: 'change' }
        ],
        eventDescription: [
          { required: true, message: '事情简要经过不能为空哦', trigger: 'blur' }
        ]
      },
      // 事情简要经过对应的数据
      select: ''
    }
  },
  methods: {
    // 事情简要经过模板
    selectAction () {
      let titles = this.byData.EVENT_GROUND_TITLE.dicts
      if (titles.length > 0) {
        for (var i = 0; i < titles.length; i++) {
          if (this.select === titles[i].dictCode) {
            this.operation.eventDescription = titles[i].dictName
          }
        }
      }
    }
  },
  mounted () {
    // 将地面的输入框数据传给父组件
    this.$emit('getGround', this.operation)
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