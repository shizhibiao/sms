<template>
  <div class="animated fadeIn">
    <el-form :model="preserveData" status-icon size="medium" label-width="120px" inline-message>
      <!-- 基本信息 -->
      <b-card no-body>
        <b-card-header>
          基本信息
          <div class="card-actions">
            <b-btn class="btn btn-minimize" v-b-toggle.basic @click="basicAction"><i class="icon-arrow-down" ref="basicDirection"></i></b-btn>
          </div>
        </b-card-header>
        <b-collapse id="basic" :visible="true" ref="basicRef">
          <b-card-body>
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="报告类型">
                  <el-input v-model="preserveData.category" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="是否匿名">
                  <el-radio v-model="preserveData.anonymous" :label='true' :disabled='true'>是</el-radio>
                  <el-radio v-model="preserveData.anonymous" :label='false' :disabled='true'>否</el-radio>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12" v-if="preserveData.anonymous === false">
                <el-form-item label="报告人">
                  <el-input v-model="preserveData.reporterName" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="所在部门" v-if="preserveData.anonymous === false">
                  <el-input v-model="preserveData.deptName" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="报告日期">
                  <el-input v-model="preserveData.reportDate" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="联系电话">
                  <el-input v-model="preserveData.telphone" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="发生地点">
                  <el-input v-model="preserveData.occurAddress" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="发生日期">
                  <el-input v-model="preserveData.occurDate" disabled></el-input>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="标题">
              <el-input v-model="preserveData.title" disabled></el-input>
            </el-form-item>
            <el-form-item label="专业类型">
              <el-radio v-model="preserveData.majorType" :label='1' :disabled='true'>飞行</el-radio>
              <el-radio v-model="preserveData.majorType" :label='2' :disabled='true'>地面</el-radio>
              <el-radio v-model="preserveData.majorType" :label='3' :disabled='true'>安保</el-radio>
            </el-form-item>
          </b-card-body>
        </b-collapse>
      </b-card>
      <!-- 子表信息 -->
      <b-card no-body>
        <b-card-header>
          {{showSublistData}}
          <div class="card-actions">
            <b-btn class="btn btn-minimize" v-b-toggle.collapsel @click="tiggleAction"><i class="icon-arrow-down" ref="upDown"></i></b-btn>
          </div>
        </b-card-header>
        <b-collapse id="collapsel" :visible="true" ref="sublistData">
          <!-- 飞行 -->
          <b-card-body v-if="preserveData.majorType == '1'">
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="航班日期">
                  <el-input v-model="preserveData.reportFlyDO.flightDate" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="飞机号">
                  <el-input v-model="preserveData.reportFlyDO.airNumber" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="航段">
                  <el-select v-model="preserveData.reportFlyDO.flightLeg" disabled>
                    <el-option v-for="(item, index) in flightLegData" :key="index" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="机型">
                  <el-input v-model="preserveData.reportFlyDO.acType" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="机组成员">
                  <el-input v-model="preserveData.reportFlyDO.flightCrew" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="飞行性质">
                  <el-input v-model="preserveData.reportFlyDO.flightName" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="飞行阶段">
                  <el-input v-model="preserveData.reportFlyDO.flightPhase" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="气象条件">
                  <el-input v-model="preserveData.reportFlyDO.weatherCondition" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="光照条件">
                  <el-input v-model="preserveData.reportFlyDO.lightCondition" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="事件类型">
                  <el-input v-model="preserveData.reportFlyDO.eventType" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="事件等级">
                  <el-input v-model="preserveData.reportFlyDO.eventGrade" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="航班延误情况">
                  <el-input v-model="preserveData.reportFlyDO.flightDelay" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="原因分类">
                  <el-input v-model="preserveData.reportFlyDO.causeType" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="航空器损坏">
                  <el-input v-model="preserveData.reportFlyDO.aircraftDamage" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-12 col-md-6 col-sm-12">
                <el-form-item label="有无人员伤亡">
                  <el-radio v-model="preserveData.reportFlyDO.injuriesDeaths" :label="false" :disabled='true'>无</el-radio>
                  <el-radio v-model="preserveData.reportFlyDO.injuriesDeaths" :label="true" :disabled='true'>有</el-radio>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportFlyDO.injuriesDeaths == true">
                <el-form-item label="伤">
                  <el-input v-model="preserveData.reportFlyDO.injuries" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportFlyDO.injuriesDeaths == true">
                <el-form-item label="亡">
                  <el-input v-model="preserveData.reportFlyDO.deaths" disabled></el-input>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="事情简要经过">
              <el-input
                disabled
                type="textarea"
                placeholder="请输入内容"
                v-model="preserveData.reportFlyDO.eventDescription">
              </el-input>
            </el-form-item>
          </b-card-body>
          <!-- 地面页面 -->
          <b-card-body no-body v-if="preserveData.majorType == '2'">
            <div class="row">
              <div class="col-lg-12 col-md-6 col-sm-12">
                <el-form-item label="航空器">
                  <el-radio v-model="preserveData.reportGroundDO.relAircraft" :label="true" :disabled='true'>相关</el-radio>
                  <el-radio v-model="preserveData.reportGroundDO.relAircraft" :label="false" :disabled='true'>无关</el-radio>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relAircraft == true">
                <el-form-item label="">航空器1</el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relAircraft == true">
                <el-form-item label="">航空器2</el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relAircraft == true">
                <el-form-item label="机型">
                  <el-input v-model="preserveData.reportGroundDO.acType1" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relAircraft == true">
                <el-form-item label="机型">
                  <el-input v-model="preserveData.reportGroundDO.acType2" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relAircraft == true">
                <el-form-item label="飞机号">
                  <el-input v-model="preserveData.reportGroundDO.acNo1" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relAircraft == true">
                <el-form-item label="飞机号">
                  <el-input v-model="preserveData.reportGroundDO.acNo2" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relAircraft == true">
                <el-form-item label="所属单位">
                  <el-input v-model="preserveData.reportGroundDO.acCompany1" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relAircraft == true">
                <el-form-item label="所属单位">
                  <el-input v-model="preserveData.reportGroundDO.acCompany2" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relAircraft == true">
                <el-form-item label="运行阶段">
                  <el-input v-model="preserveData.reportGroundDO.runPhase1" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relAircraft == true">
                <el-form-item label="运行阶段">
                  <el-input v-model="preserveData.reportGroundDO.runPhase2" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-12 col-md-6 col-sm-12">
                <el-form-item label="车辆种类">
                  <el-radio v-model="preserveData.reportGroundDO.relCar" :label="true" :disabled='true'>相关</el-radio>
                  <el-radio v-model="preserveData.reportGroundDO.relCar" :label="false" :disabled='true'>无关</el-radio>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relCar == true">
                <el-form-item label="">车辆1</el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relCar == true">
                <el-form-item label="">车辆2</el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relCar == true">
                <el-form-item label="车辆类型">
                  <el-input v-model="preserveData.reportGroundDO.carType1" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relCar == true">
                <el-form-item label="车辆类型">
                  <el-input v-model="preserveData.reportGroundDO.carType2" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relCar == true">
                <el-form-item label="所属单位">
                  <el-input v-model="preserveData.reportGroundDO.carCompany1" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relCar == true">
                <el-form-item label="所属单位">
                  <el-input v-model="preserveData.reportGroundDO.carCompany2" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-12 col-md-6 col-sm-12">
                <el-form-item label="地面设施">
                  <el-radio v-model="preserveData.reportGroundDO.relGroundDevice" :label="true" :disabled='true'>相关</el-radio>
                  <el-radio v-model="preserveData.reportGroundDO.relGroundDevice" :label="false" :disabled='true'>无关</el-radio>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relGroundDevice == true">
                <el-form-item label="地面设施/设备名">
                <el-input v-model="preserveData.reportGroundDO.deviceName" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.relGroundDevice == true">
                <el-form-item label="所属单位">
                  <el-input v-model="preserveData.reportGroundDO.deviceCompany" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="原因分类">
                  <el-input v-model="preserveData.reportGroundDO.causeType" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="事件等级">
                  <el-input v-model="preserveData.reportGroundDO.eventGrade" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="航班延误情况">
                  <el-input v-model="preserveData.reportGroundDO.flightDelay" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="事件类型">
                  <el-input v-model="preserveData.reportGroundDO.eventType" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="航空器损坏">
                  <el-input v-model="preserveData.reportGroundDO.aircraftDamage" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-12 col-md-6 col-sm-12">
                <el-form-item label="有无人员伤亡">
                  <el-radio v-model="preserveData.reportGroundDO.injuriesDeaths" :label="false" :disabled='true'>无</el-radio>
                  <el-radio v-model="preserveData.reportGroundDO.injuriesDeaths" :label="true" :disabled='true'>有</el-radio>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.injuriesDeaths == true">
                <el-form-item label="伤">
                  <el-input v-model="preserveData.reportGroundDO.injuries" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportGroundDO.injuriesDeaths == true">
                <el-form-item label="亡">
                  <el-input v-model="preserveData.reportGroundDO.deaths" disabled></el-input>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="事情简要经过">
              <el-input
                disabled
                type="textarea"
                placeholder="请输入内容"
                v-model="preserveData.reportGroundDO.eventDescription">
              </el-input>
            </el-form-item>
          </b-card-body>
          <!-- 安保页面 -->
          <b-card-body no-body v-if="preserveData.majorType == '3'">
            <div class="row">
              <div class="col-lg-12 col-md-6 col-sm-12">
                <el-form-item label="航空器">
                  <el-radio v-model="preserveData.reportSecurityDO.relAircraft" :label="true" :disabled='true'>相关</el-radio>
                  <el-radio v-model="preserveData.reportSecurityDO.relAircraft" :label="false" :disabled='true'>无关</el-radio>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportSecurityDO.relAircraft == true">
                <el-form-item label="航班日期">
                  <el-input v-model="preserveData.reportSecurityDO.flightDate" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportSecurityDO.relAircraft == true">
                <el-form-item label="飞机号">
                  <el-input v-model="preserveData.reportSecurityDO.airNumber" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportSecurityDO.relAircraft == true">
                <el-form-item label="航段">
                  <el-select v-model="preserveData.reportSecurityDO.flightLeg" disabled>
                    <el-option v-for="(item, index) in flightLegData" :key="index" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportSecurityDO.relAircraft == true">
                <el-form-item label="机组成员">
                  <el-input v-model="preserveData.reportSecurityDO.flightCrew" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportSecurityDO.relAircraft == true">
                <el-form-item label="机型">
                  <el-input v-model="preserveData.reportSecurityDO.acType" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportSecurityDO.relAircraft == true">
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="安保事件类别">
                  <el-input v-model="preserveData.reportSecurityDO.secEventCategory" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="安保事件类型1">
                  <el-input v-model="preserveData.reportSecurityDO.secEventType1" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="安保事件类型2">
                  <el-input v-model="preserveData.reportSecurityDO.secEventType2" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="事件等级">
                  <el-input v-model="preserveData.reportSecurityDO.eventGrade" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="航班延误情况">
                  <el-input v-model="preserveData.reportSecurityDO.flightDelay" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <el-form-item label="航空器损坏">
                  <el-input v-model="preserveData.reportSecurityDO.aircraftDamage" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-12 col-md-6 col-sm-12">
                <el-form-item label="有无人员伤亡">
                  <el-radio v-model="preserveData.reportSecurityDO.injuriesDeaths" :label="false"  :disabled='true'>无</el-radio>
                  <el-radio v-model="preserveData.reportSecurityDO.injuriesDeaths" :label="true"  :disabled='true'>有</el-radio>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportSecurityDO.injuriesDeaths == true">
                <el-form-item label="伤">
                  <el-input v-model="preserveData.reportSecurityDO.injuries" disabled></el-input>
                </el-form-item>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12" v-if="preserveData.reportSecurityDO.injuriesDeaths == true">
                <el-form-item label="亡">
                  <el-input v-model="preserveData.reportSecurityDO.deaths" disabled></el-input>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="事情简要经过">
              <el-input
                disabled
                type="textarea"
                placeholder="请输入内容"
                v-model="preserveData.reportSecurityDO.eventDescription"
                maxlength="200">
              </el-input>
            </el-form-item>
          </b-card-body>
        </b-collapse>
      </b-card>
      <!-- 附件上传 -->
      <security-notice-adjunct
        ref='adjunct'
        :tableName='tableName'
        :uploadFile='uploadFile'
        :safetyId='safetyId'></security-notice-adjunct>
      <!-- 审核历史 -->
      <b-card no-body>
        <b-card-header>
          审核历史
          <div class="card-actions">
            <b-btn class="btn btn-minimize" v-b-toggle.historyTab @click="historyTiggleAction"><i class="icon-arrow-down" ref="historyRef"></i></b-btn>
          </div>
        </b-card-header>
        <b-collapse id="historyTab" :visible="true" ref="historyTab">
          <b-card-body>
            <el-table
              :data="tableData"
              :stripe="true"
              :highlight-current-row ="true"
              style="width: 100%">
              <!-- 外部表 -->
              <el-table-column
                  label="#"
                  prop="index"
                  width='50'
                  >
              </el-table-column>
              <el-table-column
                label="日期"
                prop="auditTime">
              </el-table-column>
              <el-table-column
                label="操作人"
                prop="auditUserName">
              </el-table-column>
              <el-table-column
                label="审核类型"
                prop="auditType">
              </el-table-column>
              <el-table-column
                label="意见"
                prop="auditComment">
              </el-table-column>
              <el-table-column
                label="结果"
                prop="auditResult">
              </el-table-column>
              <el-table-column
                width='250'
                label="操作">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button type="default" size='mini'
                      v-if="(scope.row.auditType == '初评' && preserveData.reward === '是' && scope.row.auditResult == '同意') || scope.row.auditType == '处理意见'"
                      :disabled="disabledAction === 'false'"
                      @click="handleTransaction(scope.$index, scope.row)">查看</el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </b-card-body>
        </b-collapse>
      </b-card>
      <!-- 流程图 -->
      <b-card no-body>
        <b-card-body>
          <div class="text-center">
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
            <el-button size='small' v-if="flag === 1" type="success" @click="transactionAction">发送</el-button>
            <el-button size='small' type="default" @click="preserveAction">返回</el-button>
          </div>
        </b-card-body>
      </b-card>
    </el-form>
    <!-- 办理弹框 -->
    <ReportPopoutTrans ref="popoutTrans" :alertData="preserveData" :taskInfo="taskInfo" :path="path" :auditUser="auditUser" :statusTxt="statusTxt" />
    <!-- 初评/部门审核弹框/部门审核 -->
    <el-dialog :title="auditType" :visible.sync="preliminaryAction" width="30%">
      <el-form :model="preserveData" inline-message label-width="130px" >
        <div v-if="auditType == '初评'">
          <el-form-item label="是否奖励">
            <el-input v-model="preserveData.reward" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
          <el-form-item label="奖励等级" v-if="preserveData.reward === '是'">
            <el-input v-model="preserveData.rewardBonos" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
          <el-form-item label="奖励依据" v-if="preserveData.reward === '是'">
            <el-input v-model="preserveData.rewardBaseon" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
        </div>
        <!-- 处理意见 -->
        <div v-if="auditType == '处理意见'">
          <el-form-item label="是否为事件">
            <el-input v-model="preserveData.event" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
          <el-form-item label="是否启用事件调查">
            <el-input v-model="preserveData.startEventSurvey" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
          <el-form-item label="是否启用风险管理">
            <el-input v-model="preserveData.startRiskFlow" placeholder="请输入内容" disabled></el-input>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import ReportPopoutTrans from './ReportPopoutTrans.vue'
  // 附件上传
  import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'

  // 过滤
  import { getViewAuditHistoryAction, getAllDataAction } from '../../services/information_report/index.js'
  import { sourceDataFilter } from '../../tools'

  export default {
    name: 'reportExamine',
    components: {
      ReportPopoutTrans,
      SecurityNoticeAdjunct
    },
    data () {
      return {
        flightLegData: [],
        preserveData: {
          reportNumber: 0,
          // 报告类型
          category: '',
          // 是否匿名
          anonymous: 'false',
          // 报告人姓名
          reporterName: '',
          // 报告部门deptId
          // 报告时间
          reportDate: '',
          // 联系电话
          telphone: '',
          // 标题
          title: '',
          // 发生日期
          occurDate: '',
          // 发生地点
          occurAddress: '',
          // 报告状态
          status: -1,
          // 当前用户ID userId
          // 专业类型 飞行、地面、安保
          majorType: 0,
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
          reporter: '',
          reward: '',
          rewardBaseon: '',
          rewardBonos: '',
          auditComment: '',
          event: '',
          startEventSurvey: '',
          startRiskFlow: ''
        },
        showSublistData: '',
        // 控制子表显示与否
        showSublist: true,
        flag: 1,
        // 表格数据
        tableData: [],
        taskInfo: {},
        // 处理完成跳转的路经
        path: '',
        safetyId: '',
        // 初评查看
        preliminaryAction: false,
        // 状态
        auditType: '',
        // 流程图对应的值
        auditTypeNum: -1,
        // 附件信息
        adjunctData: [],
        // 处理人id
        auditUser: null,
        // 后台附件存储的表单名
        tableName: 't_report',
        uploadFile: true,
        disabledAction: 'true',
        statusTxt: ''
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
        let result = sourceDataFilter(sourceData, avlue)
        return result
      },
      // 点击返回到列表页面
      preserveAction () {
        this.$router.back()
      },
      // 根据列表页面传过来的id进行请求数据
      saveDatabase () {
        var reportNumber = +this.$route.params.id
        let url = ''
        if (this.$route.query.flag === 2) {
          url = '/api/report/' + reportNumber
        } else if (this.$route.query.flag === 1) {
          let taskId = this.$route.query.taskInfo.taskId
          url = '/api/report/' + reportNumber + '?taskId=' + taskId
        }
        axios.get(url)
          .then(response => {
            // console.log(response, '执行')
            let res = response.data.data
            if (response.data != null && response.data.data != null) {
              this.preserveData = response.data.data
              // 报告类型
              this.preserveData.category = this.dataFilter(this.preserveData.category, 'REPORT_TYPE')
              // 是否奖励
              let reward = this.preserveData.reward
              if (reward === true) {
                this.preserveData.reward = '是'
              } else if (reward === false) {
                this.preserveData.reward = '否'
              }
              // 奖励依据 -------采用这个之后后面的数据显示有问题
              // let { REWARD_BASIS, REWARD_LEVEL } = this.groundList
              this.preserveData.rewardBaseon = this.dataFilter(this.preserveData.rewardBaseon, 'REWARD_BASIS')
              // 奖励等级
              this.preserveData.rewardBonos = this.dataFilter(this.preserveData.rewardBonos, 'REWARD_LEVEL')
              // 处理意见
              if (response.data.data.event === false) {
                this.preserveData.event = '否'
              } else if (response.data.data.event === true) {
                this.preserveData.event = '是'
              }
              if (response.data.data.startEventSurvey === false) {
                this.preserveData.startEventSurvey = '否'
              } else if (response.data.data.startEventSurvey === true) {
                this.preserveData.startEventSurvey = '是'
              }
              if (response.data.data.startRiskFlow === false) {
                this.preserveData.startRiskFlow = '否'
              } else if (response.data.data.startRiskFlow === true) {
                this.preserveData.startRiskFlow = '是'
              }
              if (this.preserveData.majorType === 1) {
                this.showSublistData = '飞行'
                let { flightName, flightPhase, weatherCondition, lightCondition, flightDelay, causeType, aircraftDamage, eventType, eventGrade } = this.preserveData.reportFlyDO
                // 飞行性质
                this.preserveData.reportFlyDO.flightName = this.dataFilter(flightName, 'FLIGHT_PURPOSE')
                // 飞行阶段
                this.preserveData.reportFlyDO.flightPhase = this.dataFilter(flightPhase, 'FLIGHT_STATUS')
                // 气象条件
                this.preserveData.reportFlyDO.weatherCondition = this.dataFilter(weatherCondition, 'WEATHER_CONDITION')
                // 光照条件
                this.preserveData.reportFlyDO.lightCondition = this.dataFilter(lightCondition, 'LIGHT_CONDITION')
                // 原因分类
                this.preserveData.reportFlyDO.causeType = this.dataFilter(causeType, 'REASON_TYEP')
                // 事件等级
                this.preserveData.reportFlyDO.eventGrade = this.dataFilter(eventGrade, 'EVENT_LEVEL')
                // 事件类型
                this.preserveData.reportFlyDO.eventType = this.dataFilter(eventType, 'EVENT_TYEP')
                // 航班延误情况 
                this.preserveData.reportFlyDO.flightDelay = this.dataFilter(flightDelay, 'FLIGHT_DELAY')
                // 航空器损坏
                this.preserveData.reportFlyDO.aircraftDamage = this.dataFilter(aircraftDamage, 'AIRCRAFT_DAMAGE')
                // 航段
                let flightDate = this.preserveData.reportFlyDO.flightDate
                let airNumber = this.preserveData.reportFlyDO.airNumber
                this.flightLegDates(flightDate, airNumber)
              } else if (this.preserveData.majorType === 2) {
                // console.log(this.preserveData.reportGroundDO.relAircraft)
                this.showSublistData = '地面'
                let { runPhase1, runPhase2, carType1, carType2 } = this.preserveData.reportGroundDO
                let aircraftDamage2 = this.preserveData.reportGroundDO.aircraftDamage
                let flightDelay2 = this.preserveData.reportGroundDO.flightDelay
                let eventType2 = this.preserveData.reportGroundDO.eventType
                let eventGrade2 = this.preserveData.reportGroundDO.eventGrade
                let causeType2 = this.preserveData.reportGroundDO.causeType
                // 运行阶段1
                this.preserveData.reportGroundDO.runPhase1 = this.dataFilter(runPhase1, 'RUNNING_STATUS')
                // 运行阶段2
                this.preserveData.reportGroundDO.runPhase2 = this.dataFilter(runPhase2, 'RUNNING_STATUS')
                // 原因分类
                this.preserveData.reportGroundDO.causeType = this.dataFilter(causeType2, 'REASON_TYEP')
                // 车辆类型2
                this.preserveData.reportGroundDO.carType1 = this.dataFilter(carType1, 'CAR_CATEGORY')
                // 车辆类型2
                this.preserveData.reportGroundDO.carType2 = this.dataFilter(carType2, 'CAR_CATEGORY')
                // 航空器损坏
                this.preserveData.reportGroundDO.aircraftDamage = this.dataFilter(aircraftDamage2, 'AIRCRAFT_DAMAGE')
                // 航班延误情况 
                this.preserveData.reportGroundDO.flightDelay = this.dataFilter(flightDelay2, 'FLIGHT_DELAY')
                // 事件等级
                this.preserveData.reportGroundDO.eventGrade = this.dataFilter(eventGrade2, 'EVENT_LEVEL')
                // 事件类型
                this.preserveData.reportGroundDO.eventType = this.dataFilter(eventType2, 'EVENT_TYEP')
              } else if (this.preserveData.majorType === 3) {
                this.showSublistData = '安保'
                let { secEventCategory, secEventType1, secEventType2 } = this.preserveData.reportSecurityDO
                let aircraftDamage3 = this.preserveData.reportSecurityDO.aircraftDamage
                let flightDelay3 = this.preserveData.reportSecurityDO.flightDelay
                let eventGrade3 = this.preserveData.reportSecurityDO.eventGrade
                // 安保事件类别
                this.preserveData.reportSecurityDO.secEventCategory = this.dataFilter(secEventCategory, 'SECURITY_EVENT_TYPE')
                // 安保事件类型2
                this.preserveData.reportSecurityDO.secEventType1 = this.dataFilter(secEventType1, 'SECURITY_EVENT_TYPE1')
                // 安保事件类型2
                this.preserveData.reportSecurityDO.secEventType2 = this.dataFilter(secEventType2, 'SECURITY_EVENT_TYPE2')
                // 事件等级
                this.preserveData.reportSecurityDO.eventGrade = this.dataFilter(eventGrade3, 'EVENT_LEVEL')
                // 航班延误情况 
                this.preserveData.reportSecurityDO.flightDelay = this.dataFilter(flightDelay3, 'FLIGHT_DELAY')
                // 航空器损坏
                this.preserveData.reportSecurityDO.aircraftDamage = this.dataFilter(aircraftDamage3, 'AIRCRAFT_DAMAGE')
                // // 航段
                let flightDate = this.preserveData.reportSecurityDO.flightDate
                let airNumber = this.preserveData.reportSecurityDO.airNumber
                this.flightLegDates(flightDate, airNumber)
              }
            } else {
              this.$message({
                type: 'error',
                message: '请求失败：' + response.data.message
              })
            }
            //  附件的接口
            // console.log(reportNumber, res.status, '附件信息')
            axios.get('/api/attach/list?' + 'tableName=' + 't_report&' + 'sourceNumber=' + reportNumber + '&' + 'procStatus=' + res.status)
              .then(res => {
                if (res.data.error === 0) {
                  this.adjunctData = res.data.data
                } else {
                  this.$message({
                    type: 'error',
                    message: '请求失败：' + res.data.message
                  })
                }
              })
                .catch((error) => {
                  this.$message({
                    type: 'error',
                    message: '请求失败：' + error
                  })
                })
          })
          .catch((error) => {
            this.$message({
              type: 'error',
              message: '请求失败：' + error
            })
          })
      },
      // Tab当中的查看事件
      handleTransaction (index, row) {
        // 当状态值为新建时则返回顶部，查看数据
        if (row.auditType === '新建') {
          // 返回顶部
          var top = document.body.scrollTop || document.documentElement.scrollTop
          scrollBy(0, -top)
        } else if (row.auditType === '初评') {
          this.auditType = '初评'
          if (this.preserveData.reward === '是') {
            this.preliminaryAction = true
          } else if (this.preserveData.reward === '否') {
            this.preliminaryAction = false
          }
        } else if (row.auditType === '处理意见') {
          this.auditType = '处理意见'
          this.preliminaryAction = true
        }
      },
      // 底部办理按钮
      transactionAction () {
        // 显示弹出层
        this.$refs.popoutTrans.handShowPopout('popout')
        // console.log(this.$refs.adjunct.fileFormList)
        this.tiggleAction()
      },
      // 获取审核历史记录
      getHistoryActions () {
        let reportNumber = this.preserveData.reportNumber
        getViewAuditHistoryAction(reportNumber).then(result => {
          if (result.data.error === 0 && result.data.data !== null) {
            this.tableData = result.data.data
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].auditResult === true) {
                this.tableData[i].auditResult = '同意'
              } else if (this.tableData[i].auditResult === false) {
                this.tableData[i].auditResult = '驳回'
              }
              // 添加标题号
              this.tableData[i].index = i + 1
              if (this.tableData[i].auditType === -1 && this.tableData[i].auditMustTime === null) {
                this.tableData[i].auditType = '新建'
              } else if (this.tableData[i].auditType === -1 && this.tableData[i].auditMustTime !== null) {
                this.tableData[i].auditType = '修改'
              } else if (this.tableData[i].auditType === 0) {
                this.tableData[i].auditType = '初评'
              } else if (this.tableData[i].auditType === 1) {
                this.tableData[i].auditType = '单元审核'
              } else if (this.tableData[i].auditType === 2) {
                this.tableData[i].auditType = '部门审核'
              } else if (this.tableData[i].auditType === 3) {
                this.tableData[i].auditType = '处理意见'
              } else if (this.tableData[i].auditType === 4) {
                this.tableData[i].auditType = '处理核准'
              } else if (this.tableData[i].auditType === 5) {
                this.tableData[i].auditType = '结束'
              }
              this.auditUser = this.tableData[i].auditUser
            }
          } else {
            this.$message({
              type: 'error',
              message: '获取失败：' + result.data.message
            })
          }
        })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '获取失败：' + error
            })
          })
      },
      // 点击变换箭头方向
      tiggleAction () {
        if (this.$refs.upDown.className === 'icon-arrow-down') {
          this.$refs.upDown.className = 'icon-arrow-up'
        } else {
          this.$refs.upDown.className = 'icon-arrow-down'
        }
      },
      basicAction () {
        if (this.$refs.basicDirection.className === 'icon-arrow-down') {
          this.$refs.basicDirection.className = 'icon-arrow-up'
        } else {
          this.$refs.basicDirection.className = 'icon-arrow-down'
        }
      },
      adjunctAction () {
        if (this.$refs.adjunct.className === 'icon-arrow-down') {
          this.$refs.adjunct.className = 'icon-arrow-up'
        } else {
          this.$refs.adjunct.className = 'icon-arrow-down'
        }
      },
      historyTiggleAction () {
        if (this.$refs.historyRef.className === 'icon-arrow-down') {
          this.$refs.historyRef.className = 'icon-arrow-up'
        } else {
          this.$refs.historyRef.className = 'icon-arrow-down'
        }
      },
      // 根据航班日期和飞机号请求航段
      flightLegDates(flightDate, airNumber) {
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
    created () {
      this.saveDatabase()
      this.safetyId = this.$route.query.safetyId
    },
    mounted () {
      let user = this.$store.state.user
      // 部门ID和部门名称
      this.preserveData.deptName = user.deptName
      // 判断是查看还是执行操作
      if (this.$route.query.flag === 2) {
        this.flag = 2
        // console.log(this.$route.query.status)
        if (this.$route.query.status === '新建' || this.$route.query.status === -1) {
          this.auditTypeNum = 0
          // 保存status的值
          this.statusTxt = '新建'
        } else if (this.$route.query.status === '初评' || this.$route.query.status === 0) {
          this.auditTypeNum = 1
          this.statusTxt = '初评'
        } else if (this.$route.query.status === '单元审核' || this.$route.query.status === 1) {
          this.auditTypeNum = 2
          this.statusTxt = '单元审核'
        } else if (this.$route.query.status === '部门审核' || this.$route.query.status === 2) {
          this.auditTypeNum = 3
          this.statusTxt = '部门审核'
        } else if (this.$route.query.status === '处理意见' || this.$route.query.status === 3) {
          this.auditTypeNum = 4
          this.statusTxt = '处理意见'
        } else if (this.$route.query.status === '处理核准' || this.$route.query.status === 4) {
          this.auditTypeNum = 5
          this.statusTxt = '处理核准'
        } else if (this.$route.query.status === '结束' || this.$route.query.status === 5) {
          this.auditTypeNum = 7
          this.statusTxt = '结束'
        }
      }
      if (this.$route.query.flag === 1) {
        this.flag = 1
        this.preserveData.reportNumber = this.$route.query.reportNumber
        this.taskInfo = this.$route.query.taskInfo
        this.path = this.$route.query.path
        if (this.$route.query.status === '新建' || this.$route.query.status === -1) {
          this.auditTypeNum = 0
          this.statusTxt = '新建'
        } else if (this.$route.query.status === '初评' || this.$route.query.status === 0) {
          this.auditTypeNum = 1
          this.statusTxt = '初评'
        } else if (this.$route.query.status === '单元审核' || this.$route.query.status === 1) {
          this.auditTypeNum = 2
          this.statusTxt = '单元审核'
        } else if (this.$route.query.status === '部门审核' || this.$route.query.status === 2) {
          this.auditTypeNum = 3
          this.statusTxt = '部门审核'
        } else if (this.$route.query.status === '处理意见' || this.$route.query.status === 3) {
          this.auditTypeNum = 4
          this.statusTxt = '处理意见'
        } else if (this.$route.query.status === '处理核准' || this.$route.query.status === 4) {
          this.auditTypeNum = 5
          this.statusTxt = '处理意见'
        } else if (this.$route.query.status === '结束' || this.$route.query.status === 5) {
          this.auditTypeNum = 6
          this.statusTxt = '结束'
        }
      }
      this.preserveData.reportNumber = this.$route.query.reportNumber
      this.getHistoryActions()
    }
  }
</script>
<style scoped>
  .el-form-item{
    margin-bottom: 0;
  }
</style>
