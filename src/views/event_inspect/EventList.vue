<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
        <el-row :gutter="12">
          <el-col :span="18">
            <el-form :inline="true" :model="queryParams"  ref="queryParams" status-icon>
               <el-form-item label="报告日期" prop="createDate">
                <el-date-picker
                :clearable='false'
                  v-model="queryParams.createDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  auto-complete="off"
                  :picker-options="pickerOptions2"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                </el-form-item>
                <el-form-item label="事件来源"  prop="source">
                  <el-select v-model="queryParams.source" clearable>
                    <el-option  v-for="(item,index) in source"
                      clearable
                      :key="index"
                      auto-complete="off"
                      :label="item.dictName"
                      :value="item.dictCode"></el-option>
                  </el-select>
                </el-form-item>
                 <el-form-item
                 prop="title"
                label="标题">
                  <el-input v-model="queryParams.title" clearable placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="处理状态" v-if="showMore" prop="status">
                  <el-select v-model="queryParams.status" clearable>
                    <el-option v-for="item in statuss"
                      :key="item.value"
                      :label="item.name"
                      auto-complete="off"
                      :value="item.code"></el-option>
                  </el-select>
              </el-form-item>
                <el-form-item label="发生地点" v-if="showMore" prop="occurDddress">
                  <el-input clearable v-model="queryParams.occurDddress" auto-complete="off" placeholder="请输入内容"></el-input>
                </el-form-item>
                
            </el-form>
          </el-col>
          <el-col :span="6" class="text-right">
              <el-button type="warning" size='small'  @click="showMoreHandle()" v-if="true">{{showMoreLabel}}</el-button>
             <el-button type="primary" size='small'  @click="resetForm('queryParams')">重置</el-button>
              <el-button type="primary" size='small'  @click="querylist">查询</el-button>
              <el-button  type="success" size='small' @click="addbtn">新增</el-button>
          </el-col>
        </el-row>




  </b-card-header>
  <el-form :model="queryParams" label-width="120px" style="height:75vh; overflow-y: auto">
         <b-card-body>
              <el-table
                :data="formlist"
                :stripe="true"
                size='small'
                :highlight-current-row ="true"
                @expand-change="activelist"
                style="width: 100%">
                <div>
                </div>
                <el-table-column type="expand">
                  <template slot-scope="props" >
                     <el-card>
                       <b-card-header>{{namelist}}</b-card-header>
                        <!-- 飞行 -->
                <div class="row" v-if="majorTypes === 1 && majorType1 != null">
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="航班日期:">
                      {{majorType1.flightDate}}
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="航段:">
                      {{majorType1.flightLeg}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="事件类型:">
                      {{dataFilter(majorType1.eventType,'EVENT_TYEP')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="机组成员:">
                      {{majorType1.flightCrew}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="飞行阶段:">
                      {{dataFilter(majorType1.flightPhase, 'FLIGHT_STATUS')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="光照条件:">
                     {{dataFilter(majorType1.lightCondition, 'LIGHT_CONDITION')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="事件等级:">
                    {{dataFilter(majorType1.eventGrade, 'EVENT_LEVEL')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="原因分类:">
                    {{dataFilter(majorType1.causeType, 'REASON_TYEP')}}
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="飞机号:">
                   {{majorType1.airNumber}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="机型:">
                   {{majorType1.acType}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="飞行性质:">
                   {{dataFilter(majorType1.flightName, 'FLIGHT_PURPOSE')}}
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="气象条件:">
                   {{dataFilter(majorType1.weatherCondition, 'WEATHER_CONDITION')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="航班延误情况:">
                  {{dataFilter(majorType1.flightDelay, 'FLIGHT_DELAY')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="航空器损坏:">
                  {{dataFilter(majorType1.aircraftDamage, 'AIRCRAFT_DAMAGE')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                  </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="事件经过：">
                  {{majorType1.eventDescription}}
                    </el-form-item>
                  </div>

                </div>
                
                        <!-- 地面 -->
                <div class="row" v-if="majorTypes === 2 && majorType2 != null">
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                    <el-form-item label="航空器:">
                      {{majorType2.relAircraft}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                    <el-form-item label="航空器1:">
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                    <el-form-item label="航空器2:">
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                    <el-form-item label="机型:">
                      {{majorType2.acType1}}
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                    <el-form-item label="机型:">
                       {{majorType2.acType2}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                    <el-form-item label="飞机号:">
                       {{majorType2.acNo1}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                    <el-form-item label="飞机号:">
                       {{majorType2.acNo2}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                  </div>  
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                    <el-form-item label="所属单位:">
                       {{majorType2.acCompany1}}
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                    <el-form-item label="所属单位:">
                       {{majorType2.acCompany2}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                    <el-form-item label="运行阶段:">
                      {{dataFilter(majorType2.runPhase1, 'RUNNING_STATUS')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relAircraft === '有关'">
                    <el-form-item label="运行阶段:">
                      {{dataFilter(majorType2.runPhase2, 'RUNNING_STATUS')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relCar === '有关'">
                    <el-form-item label="车辆种类:">
                      {{majorType2.relCar}} 
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relCar === '有关'">
                    <el-form-item label="车辆1:">
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relCar === '有关'">
                    <el-form-item label="车辆2:">
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relCar === '有关'">
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relCar === '有关'">
                    <el-form-item label="车辆类型:">
                       {{dataFilter(majorType2.carType1, 'CAR_CATEGORY')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relCar === '有关'">
                    <el-form-item label="车辆类型:">
                       {{dataFilter(majorType2.carType2, 'CAR_CATEGORY')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relCar === '有关'">
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relCar === '有关'">
                    <el-form-item label="所属单位:">
                       {{majorType2.carCompany1}}
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relCar === '有关'">
                    <el-form-item label="所属单位:">
                      {{majorType2.carCompany2}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relCar === '有关'">
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relGroundDevice === '有关'">
                    <el-form-item label=" 地面设施:">
                      {{majorType2.relGroundDevice}}
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relGroundDevice === '有关'">
                    <el-form-item label=" 设备名:">
                     {{majorType2.deviceName}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relGroundDevice === '有关'">
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relGroundDevice === '有关'">
                    <el-form-item label="所属单位:">
                     {{majorType2.deviceCompany}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType2.relGroundDevice === '有关'">
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="原因分类:">
                     {{dataFilter(majorType2.causeType, 'REASON_TYEP')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="航班延误:">
                     {{dataFilter(majorType2.flightDelay, 'FLIGHT_DELAY')}}
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="航班损坏:">
                     {{dataFilter(majorType2.aircraftDamage, 'AIRCRAFT_DAMAGE')}}
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="事件等级:">
                    {{dataFilter(majorType2.eventGrade, 'EVENT_LEVEL')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="事件类型:">
                    {{dataFilter(majorType2.eventType, 'EVENT_TYEP')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                  </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="事件经过：">
                  {{majorType2.eventDescription}}
                    </el-form-item>
                  </div>
                </div>
                 
                        <!-- 安保 -->
                <div class="row" v-if="majorTypes === 3 && majorType3 != null">
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="航空器:" v-if="majorType3.relAircraft === '有关'">
                  {{majorType3.relAircraft}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType3.relAircraft === '有关'">
                    <el-form-item label="航班日期:" >
                    {{majorType3.flightDate}}
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType3.relAircraft === '有关'">
                    <el-form-item label="飞机号:">
                   {{majorType3.airNumber}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType3.relAircraft === '有关'">
                    <el-form-item label="机型:">
                  {{majorType3.acType}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-8 col-md-6 col-sm-12" v-if="majorType3.relAircraft === '有关'">
                    <el-form-item label="机组成员:">
                  {{majorType3.flightCrew}}
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType3.relAircraft === '有关'">
                    <el-form-item label="航段:">
                  {{majorType3.flightLeg}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType3.relAircraft === '有关'"></div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType3.relAircraft === '有关'"></div>
                  <div class="col-lg-4 col-md-6 col-sm-12" v-if="majorType3.relAircraft === '有关'"></div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="安保类型:">
                   {{dataFilter(majorType3.secEventCategory, 'SECURITY_EVENT_TYPE')}}
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="安保类型1:">
                   {{dataFilter(majorType3.secEventType1, 'SECURITY_EVENT_TYPE1')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="安保类型2:">
                   {{dataFilter(majorType3.secEventType2, 'SECURITY_EVENT_TYPE2')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="事件等级:">
                   {{dataFilter(majorType3.eventGrade, 'EVENT_LEVEL')}}
                    </el-form-item>
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="航班延误:">
                   {{dataFilter(majorType3.flightDelay, 'FLIGHT_DELAY')}}
                    </el-form-item>
                  </div>
                  
                   <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="航空损坏:">
                  {{dataFilter(majorType3.aircraftDamage, 'AIRCRAFT_DAMAGE')}}
                    </el-form-item>
                  </div>
                   <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="事件经过：">
                  {{majorType3.eventDescription}}
                    </el-form-item>
                  </div>
                  </div> 

                 </el-card>
                    </template>
                </el-table-column>
                <el-table-column
                  label='#'
                  width='60px'>
                  <template slot-scope="scope">
                    {{scope.$index + 1}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="标题"
                  prop="title">
                </el-table-column>
                <el-table-column
                  label="报告人"
                  prop="reporterName"
                  >
                </el-table-column>
                <el-table-column
                  label="事件来源"
                  prop="source"
                  :formatter='projectLevelFilter'>
                </el-table-column>
                <el-table-column
                  label="报告日期"
                  prop="createDate">
                </el-table-column>
                
                 <!-- <el-table-column
                  label="发生日期"
                  prop="createDate">
                </el-table-column> -->
                 <el-table-column
                  label="发生地点"
                  prop="occurAddress">
                </el-table-column>
                <el-table-column
                  label="处理状态"
                  prop="status"
                  >
                </el-table-column>
                  <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" v-if="scope.row.flag === 2"    @click="handleEdit(scope.$index, scope.row, formlist)">查 看</el-button>
                    <el-button size="mini"  v-if="scope.row.flag === 0" type="primary" @click="handleDelete(scope.$index, scope.row, scope.row)">编 辑</el-button>
                    <el-button type="success" size='mini' v-if="scope.row.flag === 0" @click="startup(scope.$index, scope.row, scope.row)"  v-loading.fullscreen.lock="fullscreenLoading">发 送</el-button>
                    <el-button v-if="scope.row.flag === 1 && scope.row.taskInfo.assignee === null" type="primary"  @click="signin(scope.$index, scope.row, formlist)" style="margin-left:0" size="mini">签 收</el-button>
                    <el-button v-if="scope.row.flag === 1 && scope.row.taskInfo.assignee !== null" type="primary"  @click="handle(scope.$index, scope.row, formlist)" style="margin-left:0" size="mini">办 理</el-button>
                    <el-button v-if="scope.row.flag === 1 && scope.row.taskInfo.assignee !== null" type="success"  @click="cancelthesign(scope.$index, scope.row, formlist)" style="margin-left:0" size="mini">取消签收</el-button>
                    <el-button v-if="scope.row.flag === 0" @click="deleteRow(scope.$index, scope.row, formlist)" type="danger"  size="mini">删 除</el-button>
                  </template>
                </el-table-column>
              </el-table>


              <b-row>
                <b-col md="12" class="my-1 mt-1" v-if="totalPages > 1">
                  <!--<b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />-->
                  <el-pagination
                    background
                    :pager-count="5"
                    v-model="curPage"
                    :current-page.sync="curPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="total"
                    align="right">
                  </el-pagination>
                </b-col>
              </b-row>
        </b-card-body>
  </el-form>
   </b-card>
  </div>
</template>
<script>
  import { getDepartmentList } from '../../services/safety_supervision'
  import { getAllDataAction } from '../../services/information_report'
  import { formatDate } from '../../utils/index.js'
  import { getBeforeWeek } from '../../filter/reportFilter.js'
  import axios from 'axios'
  import { sourceDataFilter } from '../../tools'
  export default {
    data () {
      return {
        total: 0,
        pageSize: 15,
        curPage: 1,
        totalPages: 1,
        majorTypes: 0,
        majorType1: {},
        majorType2: {},
        majorType3: {},
        fullscreenLoading: false,
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        queryParams: {
          //  标题
          title: '',
          //  事件发生日期
          createDate: [getBeforeWeek(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')],
          //  报告日期
          //  createDate: '',
          //  事件来源
          source: null,
          //  处理状态
          status: null,
          //  发生地点
          occurDddress: ''
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
        //  遍历的数据
        showMoreLabel: '更多',
        showMore: false,
        //  表格里面的数据
        formlist: [],
        //  处理状态的数据
        statuss: [
          {
            name: '新建',
            code: -1
          },
          {
            name: '立项核准',
            code: 0
          },
          {
            name: '调查方案',
            code: 1
          },
          {
            name: '调查情况',
            code: 2
          },
          {
            name: '验证核准',
            code: 3
          },
          {
            name: '处理改进',
            code: 4
          },
          {
            name: '结束',
            code: 5
          }
        ],
        //  事件来源
        source: [],
        //  遍历得到部门
        deptNameList: [],
        namelist: ''
      }
    },
    methods: {
      projectLevelFilter (alue) {
        let sourceData = this.source
        let result = sourceDataFilter(sourceData, alue.source)
        return result
      },
      //  重置按钮
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.queryParams.createDate = [getBeforeWeek(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
        this.querylist()
      },
      activelist (index, arrly) {
        if (arrly.length > 1) {
          arrly.shift()
        }
        // this.index = index
        // this.arrly = arrly
        //  根际number来来获取路径
        let number = index.eventNumber
        let majorType = index.majorType
        this.majorTypes = majorType
        let url = ''
        if (majorType === 1) {
          this.namelist = '飞行'
          url = '/api/common/fly/listReportFlyDO'
        } else if (majorType === 2) {
          this.namelist = '地面'
          url = '/api/common/fly/listReportGound'
        } else if (majorType === 3) {
          this.namelist = '安保'
          url = '/api/common/fly/listReportSecurity'
        }
        axios.get(url + '?reportNumber' + '=' + number)
          .then(res => {
            if (majorType === 1) {
              this.majorType1 = res.data.data[0]
              if (res.data.data[0].flightLeg === 'I') {
                res.data.data[0].flightLeg = '国外'
              } else if (res.data.data[0].flightLeg === 'D') {
                res.data.data[0].flightLeg = '国内'
              }
            } else if (majorType === 2) {
              if (res.data.data[0].relAircraft === true) {
                res.data.data[0].relAircraft = '有关'
              } else if (res.data.data[0].relAircraft === false) {
                res.data.data[0].relAircraft = '无关'
              }
              if (res.data.data[0].relCar === true) {
                res.data.data[0].relCar = '有关'
              } else if (res.data.data[0].relCar === false) {
                res.data.data[0].relCar = '无关'
              }
              if (res.data.data[0].relGroundDevice === true) {
                res.data.data[0].relGroundDevice = '有关'
              } else if (res.data.data[0].relGroundDevice === false) {
                res.data.data[0].relGroundDevice = '无关'
              }
              if (res.data.data[0].acCompany2 === 'null') {
                res.data.data[0].acCompany2 = ''
              }
              if (res.data.data[0].carCompany2 === 'null') {
                res.data.data[0].carCompany2 = ''
              }
              this.majorType2 = res.data.data[0]
            } else if (majorType === 3) {
              if (res.data.data[0].relAircraft === true) {
                res.data.data[0].relAircraft = '有关'
              } else if (res.data.data[0].relAircraft === true) {
                res.data.data[0].relAircraft = '无关'
              } else if (res.data.data[0].flightLeg === 'I') {
                res.data.data[0].flightLeg = '国外'
              } else if (res.data.data[0].flightLeg === 'D') {
                res.data.data[0].flightLeg = '国内'
              }
              this.majorType3 = res.data.data[0]
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      showMoreHandle () {
        this.showMore = !this.showMore
        if (this.showMore) {
          this.showMoreLabel = '隐藏'
        } else {
          this.showMoreLabel = '更多'
        }
      },
      //  跳转新增的页面
      addbtn () {
        this.$router.push({
          path: 'start/0'
        })
      },
      //  查询
      querylist () {
        let data = {
          pageNum: this.curPage - 1,
          pageSize: this.pageSize,
          queryItems: [{
            //  标题
            fieldName: 'title',
            value: this.queryParams.title
          },
          {
            //  处理状态
            fieldName: 'status',
            value: this.queryParams.status
          },
          {
            //  报告开始日期
            fieldName: 'createDateStat',
            value: this.queryParams.createDate[0]
          },
          {
            //  报告结束日期
            fieldName: 'createDateEnd',
            value: this.queryParams.createDate[1]
          },
          {
            //  事件来源
            fieldName: 'source',
            value: this.queryParams.source
          },
          {
            //  发生地点
            fieldName: 'occurAddress',
            value: this.queryParams.occurDddress
          }]
        }
        axios.post('/api/incdent/event/listEventDOfgs', (1, data))
          .then(res => {
            if (res.data.data === null) {
              this.formlist = []
            }
            this.total = res.data.data.totalElements
            this.totalPages = res.data.data.totalPages
            let Data = res.data.data.content.map((item) => {
              //  判断事件来源
              // 判断处理状态
              if (item.status === -1) {
                item.status = '新建'
              } else if (item.status === 0) {
                item.status = '立项核准'
              } else if (item.status === 1) {
                item.status = '调查方案'
              } else if (item.status === 2) {
                item.status = '调查情况'
              } else if (item.status === 3) {
                item.status = '验证核准'
              } else if (item.status === 4) {
                item.status = '处理改进'
              } else if (item.status === 5) {
                item.status = '结束'
              }
              //  启用安全通知
              let startSafetyNotice = item.startSafetyNotice
              if (startSafetyNotice === false) {
                item.startSafetyNotice = '不启用'
              } else if (startSafetyNotice === true) {
                item.startSafetyNotice = '启用'
              }
              if (item.acCompany2 === null) {
                item.acCompany2 = ''
              }
              if (item.carCompany2 === null) {
                item.carCompany2 = ''
              }
              return item
            })
            this.formlist = Data
          })
          .catch(error => {
            console.log(error)
          })
      },
      //  查看的按钮
      handleEdit (index, paramas) {
        this.$router.push({
          path: '/event/modify/' + paramas.eventNumber + '/' + -1,
          query: {
            flag: paramas.flag
          }
          })
      },
      //  编辑的按钮
      handleDelete (index, paramas) {
        this.$router.push({path: 'modify/' + paramas.eventNumber + '/' + 0})
      },
      //  删除的按钮
      deleteRow (index, paramas, rows) {
        let id = paramas.eventNumber
        this.$confirm('此操作将永久删除该文件, 是否继续?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            axios.delete('/api/incdent/event/deleteEvent?' + 'eventNumber' + '=' + id)
              .then(res => {
                if (res.data.error === 0) {
                  this.total--
                  rows.splice(index, 1)
                } else if (res.data.error !== 0) {
                  this.$message.error('删除失败' + res.data.message)
                }
              })
              .catch(error => {
                console.log(error)
              })
          })
          .catch(() => {
          })
      },
      //  签收
      signin (index, paramas) {
        this.$confirm('是否签收?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/activiti/claim?' + 'taskId=' + paramas.taskInfo.taskId + '&userId=' + this.$store.state.user.userId)
            .then(res => {
              if (res.data.error === 0) {
                this.$message.success('签收成功')
                this.$router.push({path: '/event/examine/' + paramas.eventNumber + '/' + paramas.taskInfo.taskId})
                this.querylist()
              }
            })
        }).catch(() => {
        })
      },
      // 取消办理
      cancelthesign (index, paramas) {
        this.$confirm('是否取消签收?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/activiti/unclaim?' + 'taskId=' + paramas.taskInfo.taskId)
            .then(res => {
              if (res.data.error === 0) {
                this.$message.success('取消签收成功')
                this.querylist()
              }
            })
        }).catch(() => {
        })
      },
      handle (index, paramas) {
        if (paramas.status === '新建' && paramas.taskInfo.assignee !== null) {
          this.$router.push({path: 'modify/' + paramas.eventNumber + '/' + paramas.taskInfo.taskId})
        } else {
          this.$router.push({path: '/event/examine/' + paramas.eventNumber + '/' + paramas.taskInfo.taskId})
        }
      },
      //  发送
      startup (index, row, scope) {
        this.$confirm('是否启动流程', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.fullscreenLoading = true
          axios.get('/api/incdent/workflow/start/' + row.eventNumber + '/' + this.$store.state.user.userName)
            .then(res => {
              this.fullscreenLoading = false
              if (res.data.error === 0) {
                this.$message({
                  type: 'success',
                  message: '发送成功'
                })
                this.querylist()
              } else if (res.data.error !== 0) {
                this.$message.error('发送失败，请重试：' + res.data.message)
              }
            })
            .catch(error => {
              console.log(error)
              this.fullscreenLoading = false
              this.$message.error('网咯超时请检查网咯')
            })
        })
      },
      dataFilter (avlue, type) {
        let sourceData = this.ALL_SELECT_DATA[type]
        let result = sourceDataFilter(sourceData, avlue)
        return result
      }
    },
    mounted () {
      //  所有下拉框
      getAllDataAction().then(result => {
      })
      //  部门
      getDepartmentList().then(result => {
        this.deptNameList = result
      })
    },
    created () {
      axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'EVENT_SOURCE')
        .then(res => {
          if (res.data.error === 0) {
            this.source = res.data.data
          }
        })
      this.querylist()
    },
    watch: {
      curPage: function (newval, oldval) {
        this.querylist()
      }
    },
    computed: {
      ALL_SELECT_DATA () {
       return this.$store.state.ALL_SELECT_DATA
      }
    }
  }
</script>
<style scoped>

.col-lg-4.col-md-6.col-sm-12{
  height: 25px;
}
</style>
