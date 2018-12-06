<template>
<el-form :model="operation" label-width="120px" :rules="rules" ref="operation" status-icon :inline-message="true" size="medium" >
  <b-card no-body>
    <div slot="header" v-if="common === 'true'">
        地面
        <div class="card-actions">
          <b-btn class="btn btn-minimize" @click="Actions" v-b-toggle.coll>
            <i class="icon-arrow-down" ref="upDow"></i>
          </b-btn>
        </div>
    </div>
  <b-collapse id="coll" visible>
    <b-card-body>
      <div class="row">
        <div class="col">
          <el-form-item label="航空器" v-if="display === 1">
            <el-radio v-model="operation.relAircraft" :disabled="relAircraft === 'false' && num === 0"  label="true">相关</el-radio>
            <el-radio v-model="operation.relAircraft" :disabled="relAircrafts === 'false' && num === 0" label="false" @change="relAircraftlist">无关</el-radio>
          </el-form-item>
        </div>
        <div class="col">
        </div>
      </div>
<div v-if="operation.relAircraft == 'true'">
    <div class="row">
       <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="">航空器1</el-form-item>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="">航空器2</el-form-item>
        </div>
         <div class="col-lg-4 col-md-6 col-sm-12">
        </div>
    
       <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="机型" prop="acType1">
            <el-input v-model="operation.acType1" :disabled="num === 0" placeholder=""></el-input>
          </el-form-item>
        </div>
       <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="机型" prop="acType2">
            <el-input v-model="operation.acType2" :disabled="num === 0" placeholder=""></el-input>
          </el-form-item>
        </div>
         <div class="col-lg-4 col-md-6 col-sm-12">
        </div>
      
       <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="飞机号" prop="acNo1">
            <el-input v-model="operation.acNo1" :disabled="num === 0" placeholder=""></el-input>
          </el-form-item>
        </div>
       <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="飞机号" prop="acNo2">
            <el-input v-model="operation.acNo2" :disabled="num === 0" placeholder=""></el-input>
          </el-form-item>
        </div>
         <div class="col-lg-4 col-md-6 col-sm-12">
        </div>
       <div class="col-lg-4 col-md-6 col-sm-12" >
          <el-form-item label="所属单位" prop="acCompany1">
            <el-input v-model="operation.acCompany1"  :disabled="num === 0" placeholder=""></el-input>
          </el-form-item>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12" prop="acCompany2">
          <el-form-item label="所属单位">
            <el-input v-model="operation.acCompany2" :disabled="num === 0" placeholder=""></el-input>
          </el-form-item>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12">
        </div>
     <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="运行阶段">
            <el-select v-model="operation.runPhase1" style="width:100%" :disabled="num === 0">
              <el-option  v-for="(item, index) in byData.RUNNING_STATUS.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
     <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="运行阶段" >
            <el-select v-model="operation.runPhase2" style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.RUNNING_STATUS.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
     </div>
</div>
      <div class="row">
        <div class="col">
          <el-form-item label="车辆种类" v-if="dispaly2 === 1" >
            <el-radio v-model="operation.relCar" :disabled="num === 0"   label="true">相关</el-radio>
            <el-radio v-model="operation.relCar" :disabled="relCar === 'false' && num === 0" label="false" @change="relCarlist">无关</el-radio>
          </el-form-item>
        </div>
        <div class="col"></div>
      </div>
<div v-if="operation.relCar == 'true'" >
      <div class="row">
          <div class="col-lg-4 col-md-6 col-sm-12"><el-form-item label="">车辆1</el-form-item></div>
          <div class="col-lg-4 col-md-6 col-sm-12"><el-form-item label="">车辆2</el-form-item></div>
          <div class="col-lg-4 col-md-6 col-sm-12">
        </div>
 
       <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="车辆类型">
            <el-select v-model="operation.carType1" style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.CAR_CATEGORY.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
      <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="车辆类型">
            <el-select v-model="operation.carType2" style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.CAR_CATEGORY.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
      <div class="col-lg-4 col-md-6 col-sm-12">
        </div>
       <div class="col-lg-4 col-md-6 col-sm-12" >
          <el-form-item label="所属单位" prop="carCompany1"><el-input v-model="operation.carCompany1" :disabled="num === 0" placeholder=""></el-input></el-form-item>
        </div>
       <div class="col-lg-4 col-md-6 col-sm-12" >
          <el-form-item label="所属单位" prop="carCompany2"><el-input v-model="operation.carCompany2" :disabled="num === 0" placeholder=""></el-input></el-form-item>
        </div>
      </div>
</div>
      <div class="row">
        <div class="col">
          <el-form-item label="地面设施" v-if="dispaly1 === 1">
            <el-radio v-model="operation.relGroundDevice" :disabled="num === 0" label="true">相关</el-radio>
            <el-radio v-model="operation.relGroundDevice" :disabled="relGroundDevices === 'false' && num === 0" @change="relGroundDevicelist" label="false">无关</el-radio>
          </el-form-item>
        </div>
        <div class="col">

        </div>
      </div>
<div v-if="operation.relGroundDevice == 'true'">
      <div class="row">
       <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="地面设施/设备" prop="deviceName">
            <el-input v-model="operation.deviceName" :disabled="num === 0" placeholder=""></el-input>
          </el-form-item>
        </div>
      <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="所属单位" prop="deviceCompany">
            <el-input v-model="operation.deviceCompany" :disabled="num === 0" placeholder=""></el-input>
          </el-form-item>
        </div>
    </div>
</div>
      <div class="row">
    <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="原因分类">
            <el-select v-model="operation.causeType" style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.REASON_TYEP.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
    <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="事件等级">
            <el-select v-model="operation.eventGrade" style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.EVENT_LEVEL.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
    <div class="col-lg-4 col-md-6 col-sm-12">
    </div>
    <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="航班延误情况">
            <el-select v-model="operation.flightDelay" style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.FLIGHT_DELAY.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
    </div>
   <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="事件类型">
            <el-select v-model="operation.eventType" style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.EVENT_TYEP.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
     <div class="col-lg-4 col-md-6 col-sm-12">
    </div>
      <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="航空器损坏">
            <el-select v-model="operation.aircraftDamage" style="width:100%" :disabled="num === 0">
              <el-option v-for="(item, index) in byData.AIRCRAFT_DAMAGE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
        </div>
     
      <div class="col-lg-4 col-md-6 col-sm-12">
          <el-form-item label="有无人员伤亡" v-if="false">
            <el-radio v-model="operation.injuriesDeaths" label='false'>无</el-radio>
            <el-radio v-model="operation.injuriesDeaths" label='true'>有</el-radio>
          </el-form-item>
        </div>
     
       <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.injuriesDeaths == 'true'"><el-form-item label="伤"><el-input v-model="operation.injuries" type="number"/></el-form-item></div>
       <div class="col-lg-4 col-md-6 col-sm-12" v-if="operation.injuriesDeaths == 'true'"><el-form-item label="亡"><el-input v-model="operation.deaths" type="number"/></el-form-item></div>
      </div>
      <div class="row">
        <div class="col">
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
            :disabled="num === 0"
              type="textarea"
              placeholder="请输入内容"
              v-model="operation.eventDescription" style="width: 100%">
            </el-input>
          </el-form-item> -->
        </div>
      </div>

    </b-card-body>
    </b-collapse>
  </b-card>
  </el-form>
</template>
<script>
export default {
  name: 'Ground',
  props: {
    byData: Object
  },
  data () {
    return {
      suiselect: '',
      REPORT_Title: this.$store.state.ALL_SELECT_DATA.EVENT_GROUND_TITLE.dicts,
      rules: {
        acType1: [
          {required: true, message: '不能为空', trigger: 'blur'},
          { max: 20,min:2, message: ' 长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        acNo1: [
          {required: true, message: '不能为空', trigger: 'blur'},
          { max: 10,min:2, message: ' 长度在 2 到 10 个字符', trigger: 'blur'}
        ],
        acCompany1: [
          {required: true, message: '不能为空', trigger: 'blur'},
          { max: 100,min:2, message: ' 长度在 2 到 100 个字符', trigger: 'blur'}
        ],
        carCompany1: [
          {required: true, message: '不能为空', trigger: 'blur'},
          { max: 100,min:2, message: ' 长度在 2 到 100 个字符', trigger: 'blur'}
        ],
        deviceName: [
          {required: true, message: '不能为空', trigger: 'blur'},
          { max: 50,min:2, message: ' 长度在 2 到 50 个字符', trigger: 'blur'}
        ],
        eventDescription: [
          {required: true, message: '不能为空', trigger: 'blur'},
          { max: 200,min:2, message: '长度在 2 到 200 个字符', trigger: 'blur'}
        ],
        deviceCompany: [
          {required: true, message: '不能为空', trigger: 'blur'},
          { max: 100,min:2, message: ' 长度在 2 到 100 个字符', trigger: 'blur'}
        ]
      },
      common: 'true',
      num: 1,
      relAircraft: 'true',
      relAircrafts: 'true',
      relGroundDevices: 'true',
      relCar: 'true',
      display: 1,
      dispaly1: 1,
      dispaly2: 1,
      operation: {
        // 航空器是否相关
        relAircraft: 'true',
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
        relCar: 'true',
        // 车辆类型1
        carType1: '',
        // 车辆类型2
        carType2: '',
        // 所属单位1
        carCompany1: '',
        // 所属单位2
        carCompany2: '',
        // 是否与地面设施相关
        relGroundDevice: 'true',
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
        injuriesDeaths: 'false',
        // 伤
        injuries: '',
        // 亡
        deaths: '',
        // 事情的简要经过
        eventDescription: ''
      }
    }
  },
  methods: {
    validateForm () {
      this.$refs['operation'].validate((valid) => {
          if (valid) {
            //  alert('submit!');
          } else {
            return false;
          }
        })
    },
    Actions () {
      if (this.$refs.upDow.className === 'icon-arrow-down') {
          this.$refs.upDow.className = 'icon-arrow-up'
        } else {
          this.$refs.upDow.className = 'icon-arrow-down'
        }
    },
    relAircraftlist () {
      this.operation.acType1 = ''
      this.operation.acNo1 = ''
      this.operation.acCompany1 = ''
      this.operation.acType2 = ''
      this.operation.acNo2 = ''
      this.operation.acCompany2 = ''
      this.operation.runPhase1 = ''
      this.operation.runPhase2 = ''
    },
    relCarlist () {
      this.operation.carType1 = ''
      this.operation.carType2 = ''
      this.operation.carCompany1 = ''
      this.operation.carCompany2 = ''
    },
    relGroundDevicelist () {
      this.operation.deviceName = ''
      this.operation.deviceCompany = ''
    },
    xuanze() {
      this.operation.eventDescription = this.suiselect
    }
  }
}
</script>
