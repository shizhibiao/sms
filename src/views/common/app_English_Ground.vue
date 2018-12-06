<template>
  <b-card no-body>
    <b-card-header>ground</b-card-header>
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
            <el-form-item label="">Aircraft1</el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="Aircraft Type" prop="acType1">
              <el-input v-model="operation.acType1" placeholder="" maxlength="20"></el-input>
            </el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="Aircraft Code" prop="acNo1">
              <el-input v-model="operation.acNo1" placeholder="" maxlength="10"></el-input>
            </el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="Department Belonging" prop="acCompany1">
              <el-input v-model="operation.acCompany1" placeholder="" maxlength="100"></el-input>
            </el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="Running Stage" prop="runPhase1">
              <el-select v-model="operation.runPhase1" placeholder="Please select an option">
                <el-option v-for="(item, index) in byData.RUNNING_STATUS.dicts" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12"  v-if="operation.relAircraft == true">
            <el-form-item label="">Aircraft2</el-form-item>
          </div>
          
          <div class="col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="Aircraft Type" prop="acType2" placeholder="Please select an option">
              <el-input v-model="operation.acType2" placeholder="" maxlength="20"></el-input>
            </el-form-item>
          </div>
          
          <div class="col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="Aircraft Code" prop="acNo2" placeholder="Please select an option">
              <el-input v-model="operation.acNo2" placeholder="" maxlength="10"></el-input>
            </el-form-item>
          </div>
          
          <div class="col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="Department Belonging" prop="acCompany2" placeholder="Please select an option">
              <el-input v-model="operation.acCompany2" placeholder="" maxlength="100"></el-input>
            </el-form-item>
          </div>
          
          <div class="col-sm-12" v-if="operation.relAircraft == true">
            <el-form-item label="Running Stage" prop="runPhase2">
              <el-select v-model="operation.runPhase2" placeholder="Please select an option">
                <el-option v-for="(item, index) in byData.RUNNING_STATUS.dicts" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="Vehicle Type" prop="relCar">
              <el-radio v-model="operation.relCar" :label="true">Related</el-radio>
              <el-radio v-model="operation.relCar" :label="false">Unrelated</el-radio>
            </el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relCar == true">
            <el-form-item label="">Vehicle1</el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relCar == true">
            <el-form-item label="Vehicle type" prop="carType1">
              <el-select v-model="operation.carType1" placeholder="Please select an option">
                <el-option v-for="(item, index) in byData.CAR_CATEGORY.dicts" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relCar == true">
            <el-form-item label="Department Belonging" prop="carCompany1"><el-input v-model="operation.carCompany1" placeholder="" maxlength="100"></el-input></el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relCar == true">
            <el-form-item label="">Vehicle2</el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relCar == true">
            <el-form-item label="Vehicle Type" prop="carType2">
              <el-select v-model="operation.carType2" placeholder="Please select an option">
                <el-option v-for="(item, index) in byData.CAR_CATEGORY.dicts" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12" v-if="operation.relCar == true">
            <el-form-item label="Department Belonging" prop="carCompany2"><el-input v-model="operation.carCompany2" placeholder="" maxlength="100"></el-input></el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="Ground Device" prop="relGroundDevice">
              <el-radio v-model="operation.relGroundDevice" :label="true">Related</el-radio>
              <el-radio v-model="operation.relGroundDevice" :label="false">Unrelated</el-radio>
            </el-form-item>
          </div>
          <div class="col-sm-12"  v-if="operation.relGroundDevice == true">
            <el-form-item label="Device Name" prop="deviceName">
              <el-input v-model="operation.deviceName" placeholder="" maxlength="50"></el-input>
            </el-form-item>
          </div>
          <div class="col-sm-12"  v-if="operation.relGroundDevice == true">
            <el-form-item label="Department Belonging" prop="deviceCompany">
              <el-input v-model="operation.deviceCompany" placeholder="" maxlength="100"></el-input>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="Cause Type" prop="causeType">
              <el-select v-model="operation.causeType" placeholder="Please select an option">
                <el-option v-for="(item, index) in byData.REASON_TYEP.dicts" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="Event Level" prop="eventGrade">
              <el-select v-model="operation.eventGrade" placeholder="Please select an option">
                <el-option v-for="(item, index) in byData.EVENT_LEVEL.dicts" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="Delays" prop="flightDelay">
              <el-select v-model="operation.flightDelay" placeholder="Please select an option">
                <el-option v-for="(item, index) in byData.FLIGHT_DELAY.dicts" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="Event Type" prop="eventType">
              <el-select v-model="operation.eventType" placeholder="Please select an option">
                <el-option v-for="(item, index) in byData.EVENT_TYEP.dicts" :key="index" :label="item.dictNameEn" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-sm-12">
            <el-form-item label="Aircraft DamageAircraft Damage" prop="aircraftDamage">
              <el-select v-model="operation.aircraftDamage" placeholder="Please select an option">
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
          <div class="col-sm-12"  v-if="operation.injuriesDeaths == true">
            <el-form-item label="Injured"><el-input v-model="operation.injuries" type="number" min="0"/></el-form-item>
          </div>
          <div class="col-sm-12"  v-if="operation.injuriesDeaths == true">
            <el-form-item label="Death"><el-input v-model="operation.deaths" type="number" min="0"/></el-form-item>
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
        eventGrade: '1',
        // 航班延误情况
        flightDelay: '4',
        // 事件类型
        eventType: '',
        // 航空器损坏
        aircraftDamage: '1',
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
          { required: true, message: 'Aircraft cannot be empty', trigger: 'change' }
        ],
        acType1: [
          { required: true, message: 'Model cannot be empty', trigger: 'blur' }
        ],
        acNo1: [
          { required: true, message: 'The aircraft cannot be empty', trigger: 'blur' }
        ],
        runPhase1: [
          { required: true, message: 'The runtime cannot be empty', trigger: 'change' }
        ],
        relGroundDevice: [
          { required: true, message: 'Ground facilities cannot be empty', trigger: 'change' }
        ],
        deviceName: [
          { required: true, message: 'The ground facility/equipment name cannot be empty', trigger: 'blur' }
        ],
        relCar: [
          { required: true, message: 'Vehicle type cannot be empty', trigger: 'change' }
        ],
        carType1: [
          { required: true, message: 'Vehicle type cannot be empty', trigger: 'change' }
        ],
        eventType: [
          { required: true, message: 'The event type cannot be empty', trigger: 'change' }
        ],
        causeType: [
          { required: true, message: 'Reason classification cannot be empty', trigger: 'change' }
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
    // 表单验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      });
    },
    resetForm(formName) {
      this.$refs[operation].resetFields();
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