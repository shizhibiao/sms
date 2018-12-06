<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
        <el-row :gutter="12">
          <el-col :span="18">
            <el-form inline :model="dataList" ref="dataList">
              <el-form-item label="报告日期" prop="dateRange">
                <el-date-picker
                  :clearable="false"
                  v-model="dataList.dateRange"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions2"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="报告类型" prop="cateGory">
                <el-select v-model="dataList.cateGory" clearable>
                  <el-option v-for="(item, index) in noticeLevel" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="报告部门" prop="submitDeptName">
                <el-cascader :options="deptNameList" v-model="dataList.submitDeptName" :props='{value:"value"}' :show-all-levels="false" :clearable='true' :change-on-select="true" @change="cascaderHandel"></el-cascader>
              </el-form-item>
              <el-form-item label="报告标题" v-if="showMore" prop="title">
                <el-input v-model="dataList.title" placeholder="" clearable></el-input>
              </el-form-item>
              <el-form-item label="处理状态" v-if="showMore" prop="status">
                <el-select v-model="dataList.status" clearable>
                  <el-option v-for="(item, index) in statuss" :key="index" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="事件类型" v-if="showMore" prop="eventType">
                <el-select v-model="dataList.eventType" clearable>
                  <el-option v-for="(item, index) in event_type" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6" class="text-right">
            <el-button size='small' type="warning" @click="showMoreHandle">{{showMoreLabel}}</el-button>
            <el-button size='small' type="primary" @click="resetBtnData()">重置</el-button>
            <el-button size='small' type="primary" @click="inquireDataList">查询</el-button>
            <el-button size='small' type="success" @click="goReportStat">新增</el-button>
          </el-col>
        </el-row>
      </b-card-header>
      <b-card-body>
        <template>
          <el-table
            size="small"
            :data="tableData"
            :stripe="true"
            :highlight-current-row ="true"
            style="width: 100%"
            @expand-change='handleUnfold'>
            <!-- 内部表 -->
            <el-table-column type="expand">
                  <template slot-scope="props">
                    <b-card no-body>
                      <b-card-header>{{majorTypeName}}</b-card-header>
                      <b-card-body>
                        <!-- 飞行的子页面 -->
                        <el-form :model="reportFlyDO" status-icon size="medium" label-width="120px" inline-message v-if="majorType === 1 && reportFlyDO != null">
                          <div class="row">
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="航班日期">
                                <span>{{reportFlyDO.flightDate}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="航段">
                                <span>{{reportFlyDO.flightLeg}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="事件类型">
                                <span>{{reportFlyDO.eventType}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-8 col-md-6 col-sm-12">
                              <el-form-item label="机组成员">
                                <span class="overflow" :title="reportFlyDO.flightCre">{{reportFlyDO.flightCrew}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="飞行阶段">
                                <span>{{reportFlyDO.flightPhase}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportFlyDO.lightCondition">
                              <el-form-item label="光照条件">
                                <span>{{reportFlyDO.lightCondition}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportFlyDO.eventGrade">
                              <el-form-item label="事件等级">
                                <span>{{reportFlyDO.eventGrade}}</span>
                              </el-form-item>
                            </div>

                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportFlyDO.causeType">
                              <el-form-item label="原因分类">
                                <span>{{reportFlyDO.causeType}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="飞机号">
                                <span>{{reportFlyDO.airNumber}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="机型">
                                <span>{{reportFlyDO.acType}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="飞行性质">
                                <span>{{reportFlyDO.flightName}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportFlyDO.weatherCondition">
                              <el-form-item label="气象条件">
                                <span>{{reportFlyDO.weatherCondition}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportFlyDO.flightDelay">
                              <el-form-item label="航班延误情况">
                                <span>{{reportFlyDO.flightDelay}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="航空器损坏">
                                <span>{{reportFlyDO.aircraftDamage}}</span>
                              </el-form-item>
                            </div>
                          </div>
                          <el-form-item label="事情简要经过">
                            <span>{{reportFlyDO.eventDescription}}</span>
                          </el-form-item>
                        </el-form>
                        <!-- 地面的子页面 -->
                        <el-form :model="reportGroundDO" status-icon size="medium" label-width="120px" inline-message v-if="majorType === 2 && reportGroundDO != null">
                          <div class="row">
                            <div class="col-lg-4 col-md-12 col-sm-12">
                              <el-form-item label="航空器">
                                <span>{{reportGroundDO.relAircraft}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relAircraft === '有关'">
                              <el-form-item label="航空器1">

                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relAircraft === '有关' && (reportGroundDO.acType2 || reportGroundDO.acNo2)">
                              <el-form-item label="航空器2">

                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relAircraft === '有关'">
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12"  v-if="reportGroundDO.relAircraft === '有关' && reportGroundDO.acType1">
                              <el-form-item label="机型1">
                                <span>{{reportGroundDO.acType1}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relAircraft === '有关' && reportGroundDO.acType2">
                              <el-form-item label="机型2">
                                <span>{{reportGroundDO.acType2}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relAircraft === '有关'">
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relAircraft === '有关' && reportGroundDO.acNo1">
                              <el-form-item label="飞机号1">
                                <span>{{reportGroundDO.acNo1}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relAircraft === '有关' && reportGroundDO.acNo2">
                              <el-form-item label="飞机号2">
                                <span>{{reportGroundDO.acNo2}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relAircraft === '有关'">
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relAircraft === '有关' && reportGroundDO.acCompany1">
                              <el-form-item label="所属单位1">
                                <span>{{reportGroundDO.acCompany1}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relAircraft === '有关' && reportGroundDO.acCompany2">
                              <el-form-item label="所属单位2">
                                <span>{{reportGroundDO.acCompany2}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relAircraft === '有关'">
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relAircraft === '有关' && reportGroundDO.runPhase1">
                              <el-form-item label="运行阶段1">
                                <span>{{reportGroundDO.runPhase1}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relAircraft === '有关' && reportGroundDO.runPhase2">
                              <el-form-item label="运行阶段2">
                                <span>{{reportGroundDO.runPhase2}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-12 col-sm-12">
                              <el-form-item label="车辆种类">
                                <span>{{reportGroundDO.relCar}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relCar === '有关'">
                              <el-form-item label="车辆1">

                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relCar === '有关' && reportGroundDO.carType2">
                              <el-form-item label="车辆2">

                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relCar === '有关'">
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relCar === '有关' && reportGroundDO.carType1">
                              <el-form-item label="车辆类型1">
                                <span>{{reportGroundDO.carType1}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relCar === '有关' && reportGroundDO.carType2">
                              <el-form-item label="车辆类型2">
                                <span>{{reportGroundDO.carType2}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relCar === '有关'">
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relCar === '有关' && reportGroundDO.carCompany1">
                              <el-form-item label="所属单位1">
                                <span>{{reportGroundDO.carCompany1}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relCar === '有关' && reportGroundDO.acCompany2">
                              <el-form-item label="所属单位2">
                                <span>{{reportGroundDO.acCompany2}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="地面设施">
                                <span>{{reportGroundDO.relGroundDevice}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relGroundDevice === '有关'">
                              <el-form-item label="设备名">
                                <span>{{reportGroundDO.deviceName}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.relGroundDevice === '有关' && reportGroundDO.deviceCompany">
                              <el-form-item label="所属单位">
                                <span>{{reportGroundDO.deviceCompany}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                                <el-form-item label="原因分类">
                                  <span>{{reportGroundDO.causeType}}</span>
                                </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.flightDelay">
                                <el-form-item label="航班延误情况">
                                  <span>{{reportGroundDO.flightDelay}}</span>
                                </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                                <el-form-item label="航空器损坏">
                                  <span>{{reportGroundDO.aircraftDamage}}</span>
                                </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportGroundDO.eventGrade">
                              <el-form-item label="事件等级">
                                <span>{{reportGroundDO.eventGrade}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="事件类型">
                                <span>{{reportGroundDO.eventType}}</span>
                              </el-form-item>
                            </div>
                          </div>
                          <el-form-item label="事情简要经过">
                            <span>{{reportGroundDO.eventDescription}}</span>
                          </el-form-item>
                        </el-form>
                        <!-- 安保的页面 -->
                        <el-form :model="reportSecurityDO" status-icon size="medium" label-width="120px" inline-message v-if="majorType === 3 && reportSecurityDO != null">
                          <div class="row">
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="航空器">
                                <span>{{reportSecurityDO.relAircraft}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportSecurityDO.relAircraft === '有关'">
                              <el-form-item label="航班日期">
                                <span>{{reportSecurityDO.flightDate}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportSecurityDO.relAircraft === '有关'">
                              <el-form-item label="飞机号">
                                <span>{{reportSecurityDO.airNumber}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportSecurityDO.relAircraft === '有关'">
                              <el-form-item label="航段">
                                <span>{{reportSecurityDO.flightLeg}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-8 col-md-6 col-sm-12" v-if="reportSecurityDO.relAircraft === '有关'">
                              <el-form-item label="机组成员">
                                <span class="overflow" :title="reportSecurityDO.flightCrew">{{reportSecurityDO.flightCrew}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportSecurityDO.relAircraft === '有关'">
                              <el-form-item label="机型">
                                <span>{{reportSecurityDO.acType}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="安保类型">
                                <span>{{reportSecurityDO.secEventCategory}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="安保类型1">
                                <span>{{reportSecurityDO.secEventType1}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="安保类型2">
                                <span>{{reportSecurityDO.secEventType2}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportSecurityDO.eventGrade">
                              <el-form-item label="事件等级">
                                <span>{{reportSecurityDO.eventGrade}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12" v-if="reportSecurityDO.flightDelay">
                              <el-form-item label="航班延误情况">
                                <span>{{reportSecurityDO.flightDelay}}</span>
                              </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                              <el-form-item label="航空器损坏">
                                <span>{{reportSecurityDO.aircraftDamage}}</span>
                              </el-form-item>
                            </div>
                          </div>
                          <el-form-item label="事情简要经过">
                            <span>{{reportSecurityDO.eventDescription}}</span>
                          </el-form-item>
                        </el-form>
                      </b-card-body>
                    </b-card>
                  </template>
                </el-table-column>
            <!-- 外部表 -->
            <el-table-column
                label="#"
                prop="index"
                width="50">
            </el-table-column>
            <el-table-column
              label="标题"
              prop="title">
            </el-table-column>
            <el-table-column
              label="报告类型"
              prop="category">
            </el-table-column>
            <el-table-column
              label="所在部门"
              prop="deptName">
            </el-table-column>
            <el-table-column
              label="报告日期"
              style="width: 100%"
              prop="reportDate">
            </el-table-column>
            <el-table-column
              label="处理状态"
              prop="status">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size='mini' v-if="scope.row.flag == '0' && scope.row.procInstId === null"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size='mini' v-if="scope.row.flag == '0' && scope.row.procInstId === null"
                  @click="handleRemove(scope.$index, scope.row)">删除</el-button>
                <el-button size='mini' type="success" v-if="scope.row.flag == '0' && scope.row.procInstId === null"
                  @click="sendAction(scope.$index, scope.row)"
                  v-loading.fullscreen.lock="fullscreenLoading">发送</el-button>

                <el-button type="primary" size='mini' v-if="scope.row.flag == '0' && scope.row.procInstId !== null && scope.row.taskInfo.assignee != null"
                  @click="procInstIdHandleEdit(scope.$index, scope.row)">办理</el-button>
                <el-button type="success" size='mini' v-if="scope.row.flag == '0' && scope.row.procInstId !== null && scope.row.taskInfo.assignee != null"
                  @click="cancelAction(scope.$index, scope.row)">取消签收</el-button>
                <el-button type="primary" size='mini' v-if="scope.row.flag == '0' && scope.row.taskInfo != null && scope.row.taskInfo.assignee == null"
                  @click="procInstIdSignInAction(scope.$index, scope.row)">签收</el-button>

                <el-button type="primary" size='mini' v-if="scope.row.taskInfo != null && scope.row.taskInfo.assignee != null && scope.row.flag == '1'"
                @click="handleExecute(scope.$index, scope.row)">办理</el-button>
                <el-button type="primary" size='mini' v-if="scope.row.taskInfo != null && scope.row.taskInfo.assignee == null && scope.row.flag == '1'"
                @click="signInAction(scope.$index, scope.row)">签收</el-button>
                <el-button type="success" size='mini' v-if="scope.row.taskInfo != null && scope.row.taskInfo.assignee != null && scope.row.flag == '1'"
                @click="cancelAction(scope.$index, scope.row)">取消签收</el-button>


                <el-button type="default" size='mini' v-if="scope.row.flag == '2'"
                  @click="handleLook(scope.$index, scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div class="block" style="margin-top: 16px;">
          <b-row>
            <b-col md="12" class="my-1 mt-1" v-if="totalPages > 1">
              <!--<b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />-->
              <el-pagination
                background
                :pager-count="5"
                :current-page.sync="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="total"
                align="right">
              </el-pagination>
            </b-col>
          </b-row>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
  import axios from 'axios'
  //  查询信息报告    子表信息
  import { getAllDataAction, getSearchInformation, initiatorProcedureAction, activitiCancelClaim } from '../../services/information_report'
  // 获得部门
  import { getDepartmentList, signForTask } from '../../services/safety_notice'
  // 过滤日期
  import { formatDate } from '../../utils/index.js'
  import { sourceDataFilter } from '../../tools'
  import { getBeforeWeek, ransfromProcessState } from '../../filter/reportFilter.js'
  
  export default {
    name: 'SecurityNoticeList',
    data () {
      return {
        showMore: false,
        showMoreLabel: '更多',
        // 处理状态数据
        statuss: [
          {
            name: '新建',
            code: -1
          },
          {
            name: '初评',
            code: 0
          },
          {
            name: '单元审核',
            code: 1
          },
          {
            name: '部门审核',
            code: 2
          },
          {
            name: '处理意见',
            code: 3
          },
          {
            name: '处理核准',
            code: 4
          },
          {
            name: '结束',
            code: 5
          }
        ],
        noticeLevelId: 1,
        dataList: {
          // 标题
          title: '',
          // 报告日期
          dateRange: [getBeforeWeek(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
          // 发生地点
          address: '',
          // 报告部门
          deptId: '',
          deptName: '',
          // 事件类型
          eventType: '',
          // 关键字
          keyword: '',
          // 报告类型
          cateGory: '',
          // 飞机号
          airNumber: '',
          // 处理状态
          status: null,
          submitDeptName: []
        },
        pickerOptions2: {
          shortcuts: [{
            text: '最近一天',
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
        // 获取部门
        deptNameList: [],
        // 表单信息
        tableData: [],
        majorType: 0,
        // 子表信息
        reportFlyDO: {},
        reportGroundDO: {},
        reportSecurityDO: {},
        total: 0,
        pageNum: 1,
        pageSize: 15,
        totalPages: 1,
        majorTypeName: '',
        // loading
        fullscreenLoading: false,
        // 事件类型数据
        event_type: {},
        // 报告类型
        noticeLevel: {},
      }
    },
    computed: {
      // 所有数据字典中的数据
      ALL_SELECT_DATA () {
       return this.$store.state.ALL_SELECT_DATA
      }
    },
    methods: {
      // 报告部门不能取一级数据
      cascaderHandel () {
        let deptName = this.dataList.submitDeptName && this.dataList.submitDeptName.length > 0 ? this.dataList.submitDeptName[this.dataList.submitDeptName.length - 1] : ''
        if (deptName.length === 1) {
          this.dataList.submitDeptName = []
        }
      },
      // 将code值转为name值
      dataFilter (avlue, type) {
        let sourceData = this.ALL_SELECT_DATA[type]
        let result = sourceDataFilter(sourceData, avlue)
        return result
      },
      showMoreHandle () {
        this.showMore = !this.showMore
        if (this.showMore) {
          this.showMoreLabel = '隐藏'
        } else {
          this.showMoreLabel = '更多'
        }
      },
      goReportStat () {
        this.$router.push({path: '/report/start/0'})
      },
      // 点击查询获取信息
      inquireDataList () {
        this.dataList.deptName = this.dataList.submitDeptName && this.dataList.submitDeptName.length > 0 ? this.dataList.submitDeptName[this.dataList.submitDeptName.length - 1] : ''
        let {title, dateRange, address, deptName, eventType, keyword, cateGory, airNumber, status} = this.dataList
        // console.log(deptName)
        let test = {}
        test.pageNum = this.pageNum - 1
        test.pageSize = this.pageSize

        test.queryItems = [
          {
            fieldName: 'title',
            value: title
          },
          {
            fieldName: 'reportDateStart',
            value: dateRange !== null ? `${dateRange[0]} 00:00:00` : getBeforeWeek(new Date(), 'yyyy-MM-dd')
          },
          {
            fieldName: 'reportDateEnd',
            value: dateRange !== null ? `${dateRange[1]} 23:59:59` : formatDate(new Date(), 'yyyy-MM-dd')
          },
          {
            fieldName: 'address',
            value: address
          },
          {
            fieldName: 'deptName',
            value: deptName
          },
          {
            fieldName: 'eventType',
            value: eventType
          },
          {
            fieldName: 'keyword',
            value: keyword
          },
          {
            fieldName: 'category',
            value: cateGory
          },
          {
            fieldName: 'airNumber',
            value: airNumber
          },
          {
            fieldName: 'status',
            value: status
          }
        ]
        getSearchInformation(test).then(result => {
          if (result.data.data !== null && result.data.error === 0) {
            this.tableData = result.data.data.content
            this.total = result.data.data.totalElements
            this.totalPages = result.data.data.totalPages
            // 给表格添加
            for (var i = 0; i < this.tableData.length; i++) {
              this.tableData[i].index = i + 1
              this.tableData[i].category = this.dataFilter(this.tableData[i].category, 'REPORT_TYPE')
              this.tableData[i].status = ransfromProcessState(+this.tableData[i].status)
            }
          } else {
            this.tableData = []
            this.total = 0
            this.totalPages = 1
          }
        })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '查询失败：' + error
            })
          })
      },
      // 编辑
      handleEdit (index, row) {
        // 点击跳转到编辑页面
        let url = '/report/compile/' + row.reportNumber
        this.$router.push({
          path: url,
          query: {
            flag: row.flag,
            safetyId: row.reportNumber,
            name: 'compile'
          }
        })
      },
      // 删除
      handleRemove (index, row) {
        let id = row.reportNumber
        this.$confirm('确定删除该数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/api/report/' + id)
            .then(response => {
              // console.log(response)
              if (response.data.data && +response.data.error === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.inquireDataList()
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败：' + response.data.message
                })
              }
            })
            .catch((errro) => {
              console.log(error)
            })
        })
          .catch((error) => {
            console.log(error)
          })
      },
      // 办理
      handleExecute (index, row) {
        this.$router.push({
          path: '/report/examine/' + row.reportNumber,
          query: {
            flag: row.flag,
            reportNumber: row.reportNumber,
            taskInfo: row.taskInfo,
            path: '/report/list',
            safetyId: row.reportNumber,
            status: row.status
          }
        })
      },
      // 初评退回后的办理
      procInstIdHandleEdit (index, row) {
        // 点击跳转到编辑页面
        let url = '/report/compile/' + row.reportNumber
        this.$router.push({
          path: url,
          query: {
            flag: row.flag,
            safetyId: row.reportNumber,
            taskInfo: row.taskInfo,
            name: 'handle'
          }
        })
      },
      // 点击查看
      handleLook (index, row) {
        // console.log(row, '查看')
        let url = '/report/examine/' + row.reportNumber
        this.$router.push({
          path: url,
          query: {
            flag: row.flag,
            safetyId: row.reportNumber,
            reportNumber: row.reportNumber,
            status: row.status
          }
        })
      },
      // 点击显示子表数据
      handleUnfold (index, expandedRows) {
        // 点击展开字表关闭上一次展开的字表
        if (expandedRows.length > 1) {
          // shift()：移除数组中的第一个元素，即第一次点击所得到的那个对象
          expandedRows.shift()
        }
        this.majorType = index.majorType
        let reportNumber = index.reportNumber
        if (this.majorType === 1) {
          // 飞机数据
          axios.get('/api/common/fly/listReportFlyDO1?reportNumber=' + reportNumber)
            .then(response => {
              if (response.data != null && response.data.data != null) {
                this.majorTypeName = '飞行'
                this.reportFlyDO = response.data.data[0]
                // 飞行性质
                this.reportFlyDO.flightName = this.dataFilter(response.data.data[0].flightName, 'FLIGHT_PURPOSE')
                // 飞行阶段
                this.reportFlyDO.flightPhase = this.dataFilter(response.data.data[0].flightPhase, 'FLIGHT_STATUS')
                // 气象条件
                this.reportFlyDO.weatherCondition = this.dataFilter(response.data.data[0].weatherCondition, 'WEATHER_CONDITION')
                // 光照条件
                this.reportFlyDO.lightCondition = this.dataFilter(response.data.data[0].lightCondition, 'LIGHT_CONDITION')
                // 航班延误情况
                this.reportFlyDO.flightDelay = this.dataFilter(response.data.data[0].flightDelay, 'FLIGHT_DELAY')
                // 原因分类
                this.reportFlyDO.causeType = this.dataFilter(response.data.data[0].causeType, 'REASON_TYEP')
                // 航空器损坏
                this.reportFlyDO.aircraftDamage = this.dataFilter(response.data.data[0].aircraftDamage, 'AIRCRAFT_DAMAGE')
                // 事件等级
                this.reportFlyDO.eventGrade = this.dataFilter(response.data.data[0].eventGrade, 'EVENT_LEVEL')
                // 事件类型
                this.reportFlyDO.eventType = this.dataFilter(response.data.data[0].eventType, 'EVENT_TYEP')
                if (response.data.data[0].relAircraft === true) {
                  response.data.data[0].relAircraft = '有关'
                } else if (response.data.data[0].relAircraft === false) {
                  response.data.data[0].relAircraft = '无关'
                }
              } else {
                this.$message({
                  type: 'error',
                  message: '查询失败：' + response.data.message
                })
              }
            })
            .catch((error) => {
              this.$message({
                type: 'error',
                message: '查询失败：' + error
              })
            })
        } else if (this.majorType === 2) {
          // 地面数据
          axios.get('/api/common/fly/listReportGound1?reportNumber=' + reportNumber)
            .then(response => {
              if (response.data != null && response.data.data != null) {
                this.majorTypeName = '地面'
                this.reportGroundDO = response.data.data[0]
                // 运行阶段
                this.reportGroundDO.runPhase1 = this.dataFilter(response.data.data[0].runPhase1, 'RUNNING_STATUS')
                this.reportGroundDO.runPhase2 = this.dataFilter(response.data.data[0].runPhase2, 'RUNNING_STATUS')
                // 原因分类
                this.reportGroundDO.causeType = this.dataFilter(response.data.data[0].causeType, 'REASON_TYEP')
                // 事件等级
                this.reportGroundDO.eventGrade = this.dataFilter(response.data.data[0].eventGrade, 'EVENT_LEVEL')
                // 航空器损坏
                this.reportGroundDO.aircraftDamage = this.dataFilter(response.data.data[0].aircraftDamage, 'AIRCRAFT_DAMAGE')
                // 航班延误情况
                this.reportGroundDO.flightDelay = this.dataFilter(response.data.data[0].flightDelay, 'FLIGHT_DELAY')
                // 车辆种类
                this.reportGroundDO.carType1 = this.dataFilter(response.data.data[0].carType1, 'CAR_CATEGORY')
                this.reportGroundDO.carType2 = this.dataFilter(response.data.data[0].carType2, 'CAR_CATEGORY')
                // 事件类型
                this.reportGroundDO.eventType = this.dataFilter(response.data.data[0].eventType, 'EVENT_TYEP')
                if (response.data.data[0].relAircraft === true) {
                  response.data.data[0].relAircraft = '有关'
                } else if (response.data.data[0].relAircraft === false) {
                  response.data.data[0].relAircraft = '无关'
                }
                if (response.data.data[0].relCar === true) {
                  response.data.data[0].relCar = '有关'
                } else if (response.data.data[0].relCar === false) {
                  response.data.data[0].relCar = '无关'
                }
                if (response.data.data[0].relGroundDevice === true) {
                  response.data.data[0].relGroundDevice = '有关'
                } else if (response.data.data[0].relGroundDevice === false) {
                  response.data.data[0].relGroundDevice = '无关'
                }
                // console.log(this.reportGroundDO)
              } else {
                this.$message({
                  type: 'error',
                  message: '查询失败：' + response.data.message
                })
              }
            })
            .catch((error) => {
              this.$message({
                type: 'error',
                message: '查询失败：' + error
              })
            })
        } else if (this.majorType === 3) {
          // 安保数据
          axios.get('/api/common/fly/listReportSecurity1?reportNumber=' + reportNumber)
            .then(response => {
              if (response.data != null && response.data.data != null) {
                this.majorTypeName = '安保'
                this.reportSecurityDO = response.data.data[0]
                // 安保事件类别
                this.reportSecurityDO.secEventCategory = this.dataFilter(response.data.data[0].secEventCategory, 'SECURITY_EVENT_TYPE')
                // 安保事件类型1
                this.reportSecurityDO.secEventType1 = this.dataFilter(response.data.data[0].secEventType1, 'SECURITY_EVENT_TYPE1')
                // 安保事件类型2
                this.reportSecurityDO.secEventType2 = this.dataFilter(response.data.data[0].secEventType2, 'SECURITY_EVENT_TYPE2')
                // 事件等级
                this.reportSecurityDO.eventGrade = this.dataFilter(response.data.data[0].eventGrade, 'EVENT_LEVEL')
                // 航班延误情况
                this.reportSecurityDO.flightDelay = this.dataFilter(response.data.data[0].flightDelay, 'FLIGHT_DELAY')
                // 航空器损坏
                this.reportSecurityDO.aircraftDamage = this.dataFilter(response.data.data[0].aircraftDamage, 'AIRCRAFT_DAMAGE')
                if (response.data.data[0].relAircraft === true) {
                  response.data.data[0].relAircraft = '有关'
                } else if (response.data.data[0].relAircraft === false) {
                  response.data.data[0].relAircraft = '无关'
                }
              } else {
                this.$message({
                  type: 'error',
                  message: '查询失败：' + response.data.message
                })
              }
            })
            .catch((error) => {
              this.$message({
                type: 'error',
                message: '查询失败：' + error
              })
            })
        }
      },
      // 发送
      sendAction (index, row) {
        this.$confirm('确定要启动流程？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 显示loading
          this.fullscreenLoading = true
          // 点击启动流程
          let reportNumber = row.reportNumber
          initiatorProcedureAction(reportNumber).then(result => {
            // 保存成功后关闭loading
            this.fullscreenLoading = false
            if (result.data.error === 0) {
              this.$message({
                type: 'success',
                message: '启动流程成功!'
              })
              // 重新请求数据
              this.inquireDataList()
            } else {
              this.$message({
                type: 'error',
                message: '启动流程失败：' + result.data.message
              })
              // 关闭loading
              this.fullscreenLoading = false
            }
          })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '启动流程失败：' + error
              })
              this.fullscreenLoading = false
            })
        })
      },
      // 重置
      resetBtnData () {
        this.$refs.dataList.resetFields()
        this.dataList.dateRange = [getBeforeWeek(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')]
        this.pageNum = 1
        // 重置刷新查询列表
        this.inquireDataList()
      },
      // 签收
      signInAction (index, row) {
        this.$confirm('确定签收？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let taskId = row.taskInfo.taskId
          let userId = this.$store.state.user.userId
          signForTask(taskId, userId).then(result => {
            if (result.data.error === 0) {
              this.$router.push({
                path: '/report/examine/' + row.reportNumber,
                query: {
                  flag: row.flag,
                  reportNumber: row.reportNumber,
                  taskInfo: row.taskInfo,
                  path: '/report/list',
                  safetyId: row.reportNumber,
                  status: row.status
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: '签收失败：' + result.data.message
              })
            }
          })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '签收失败：' + error
              })
            })
        })
      },
      // 退回后的签收
      procInstIdSignInAction (index, row) {
        this.$confirm('确定签收？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let taskId = row.taskInfo.taskId
          let userId = this.$store.state.user.userId
          signForTask(taskId, userId).then(result => {
            if (result.data.error === 0) {
              this.$router.push({
                path: '/report/compile/' + row.reportNumber,
                query: {
                  flag: row.flag,
                  reportNumber: row.reportNumber,
                  taskInfo: row.taskInfo,
                  path: '/report/list',
                  safetyId: row.reportNumber,
                  status: row.status,
                  name: 'handle'
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: '签收失败：' + result.data.message
              })
            }
          })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '签收失败：' + error
              })
            })
        })
      },
      // 取消签收
      cancelAction (index, row) {
        this.$confirm('确定取消签收？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let taskId = row.taskInfo.taskId
          activitiCancelClaim(taskId).then(result => {
            if (result.data.error === 0) {
              this.inquireDataList()
            } else {
              this.$message({
                type: 'error',
                message: '取消签收' + result.data.message
              })
            }
          })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '签收失败：' + error
              })
            })
        })
      }
    },
    watch: {
      pageNum: function (newValue, oldValue) {
        this.inquireDataList()
      }
    },
    created () {
      // 加载页面查询数据
      this.inquireDataList()
      // 获取到所有下拉框的内容
      this.event_type = this.ALL_SELECT_DATA.EVENT_TYEP ? this.ALL_SELECT_DATA.EVENT_TYEP.dicts : []
      this.noticeLevel = this.ALL_SELECT_DATA.REPORT_TYPE ? this.ALL_SELECT_DATA.REPORT_TYPE.dicts : []
      // 立项部门
      getDepartmentList().then(result => {
        // console.log(result)
        this.deptNameList = result
      })
    }
  }
</script>
<style scoped>
.row .col-lg-4.col-md-6.col-sm-12{
  height: 25px;
}
.overflow{
  overflow: hidden;
}
</style>
