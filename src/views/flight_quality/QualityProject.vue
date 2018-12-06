<template>
  <el-form :model="eventDO" label-width="120px">
    <b-card no-body>
        <div slot="header">
            基本信息
            <div class="card-actions">
              <b-btn class="btn btn-minimize" @click="Actions" v-b-toggle.collapse11s>
                <i class="icon-arrow-down" ref="upDow"></i>
              </b-btn>
            </div>
        </div>
         <b-collapse id="collapse11s" visible>
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
                <el-form-item label="标题:">
                    {{QAR.title}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="发生日期:">
                    {{QAR.occurDate}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="航班日期:">
                    {{QAR.flightDate}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="飞机号:">
                    {{QAR.airNumber}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="航段:">
                    {{QAR.flightLeg}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="机型:">
                    {{QAR.acType}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="机组成员:">
                    {{QAR.flightCrew}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12" >
                <el-form-item label="飞行阶段(QAR):">
                    {{QAR.flightPhaseQar}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12" >
                <el-form-item label="事件等级:">
                    {{QAR.eventGrade}}
                </el-form-item>
            </div>
             <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="主操纵:">
                    {{QAR.pm}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="主操纵技术等级:">
                    {{QAR.pmTechLevel}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="辅助操纵:">
                    {{QAR.pf}}
                </el-form-item>
            </div>
             <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="辅操纵技术等级:">
                    {{QAR.pfTechLevel}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="光照条件:">
                    {{dataFilter(QAR.lightCondition, 'LIGHT_CONDITION')}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="气象条件:">
                    {{dataFilter(QAR.weatherCondition, 'WEATHER_CONDITION')}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="航空器损坏:">
                    {{dataFilter(QAR.aircraftDamage, 'AIRCRAFT_DAMAGE')}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="事件类型:">
                    {{dataFilter(QAR.eventType, 'EVENT_TYEP')}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="航班延误情况:">
                    {{dataFilter(QAR.flightDelay, 'FLIGHT_DELAY')}}
                </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="飞行性质:">
                    {{dataFilter(QAR.flightName, 'FLIGHT_PURPOSE')}}
                </el-form-item>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12">
                <el-form-item label="飞行员反映情况:">
                    {{QAR.eventDesc}}
                </el-form-item>
            </div>
          </div>
        </b-card-body>
        </b-collapse>
    </b-card>
        <b-card no-body v-if="bntshow">
            <div slot="header">
                 查看审核记录
                  <div class="card-actions">
                    <b-btn class="btn btn-minimize" @click="tiggleActions" v-b-toggle.collapse1s>
                      <i class="icon-arrow-down" ref="upDowns"></i>
                    </b-btn>
                  </div>
              </div>
              <b-collapse id="collapse1s" visible>
               <b-card-body>
                  <el-table
                      :data="aproject"
                         >
                         <el-table-column
                      prop="auditTime"
                      label="审核时间"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="auditUserName"
                      label="操作人"
                       >
                      </el-table-column>
                       <el-table-column
                      prop="auditType"
                      label="审核流程"
                       >
                      </el-table-column>
                       <el-table-column
                      prop="auditResult"
                      label="结果"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="auditComment"
                      label="审核意见"
                       >
                      </el-table-column>
                  </el-table>
              </b-card-body>
            </b-collapse>
        </b-card>
    <security-notice-adjunct
        ref='adjunct'
        :tableName='tableName'
        :uploadFile='uploadFile'
        :safetyId='safetyId'>
      </security-notice-adjunct>
      <b-card no-body v-if="status === 2 || status === 3 || status === 4">
        <div slot="header" >
              调查方案
              <div class="card-actions">
                <b-btn class="btn btn-minimize" @click="tiggleAclisst" v-b-toggle.collapselist>
                  <i class="icon-arrow-down" ref="upDownlist"></i>
                </b-btn>
              </div>
          </div>
          <b-collapse id="collapselist" visible>
              <b-card-body >
                  <el-table
                      :data="programme"
                      size='small'
                         >
                      <el-table-column
                      prop="plan_user_name"
                      label="方案制定人"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="plan_complete_date"
                      label="方案完成时间"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="zz"
                      label="组长"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="zy"
                      label="组员"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="plan_date"
                      label="方案制定时间"
                       >
                      </el-table-column>
                  </el-table>
              </b-card-body>
          </b-collapse>
      </b-card>
      <b-card no-body v-if="status === 3 || status === 4">
        <div slot="header" >
              调查情况
              <div class="card-actions">
                <b-btn class="btn btn-minimize" @click="tiggleAclissts" v-b-toggle.collapselists>
                  <i class="icon-arrow-down" ref="upDownlists"></i>
                </b-btn>
              </div>
          </div>
         <b-collapse id="collapselists" visible>
           <b-card-body>
                                <el-table
                      size='small'
                      :data="Eventlevel"
                      :row-key="getRowKeys"
                      :expand-row-keys="expands"
                      :stripe="true"
                      @expand-change="activelist"
                      :highlight-current-row ="true"
                      style="width: 100%">
                      <div>
                      </div>
                  <el-table-column type="expand" fixed="left">
                    <template slot-scope="props" >
                     <el-card no-body  v-if="eventsui">
                       <b-card-header>原因分类</b-card-header>
                        <div>
                          <QulityForm :postDta="getreason"/>
                        </div>
                     </el-card>
                        <div style="padding:10px 0"></div>
                       <el-card no-body v-if="sibility">
                         <b-card-header>责任划分</b-card-header>
                        <div>
                          <QualityFormResponsibility :postDta="EventFormResponsibility"/>
                        </div>
                     </el-card>
                    </template>
                  </el-table-column>
                      <el-table-column
                      fixed
                      label='#'
                      width='60px'>
                      <template slot-scope="scope">
                        {{scope.$index + 1}}
                      </template>
                    </el-table-column>
                      <el-table-column
                      prop="title"
                      label="事件概要"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="caseContent"
                      label="事件详细经过"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="dependent"
                      label="事件性质"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="caseLevelDetail"
                      label="事件等级细分"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="dependent"
                      label="依据"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="caseResult"
                      label="事件结论"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="caseHazard"
                      label="危险来源"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="reportToUp"
                      label="是否上报局方"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="reportDependent"
                      label="上报依据来源"
                       >
                      </el-table-column>
                  </el-table>
           </b-card-body>
         </b-collapse>
      </b-card>
    <b-card no-body>
        <b-card-header>{{examinename}} </b-card-header>
        <b-card-body v-if="status === 0 ">
                <el-table
                    :data="aproject"
                       >
                    <el-table-column
                    prop="auditTime"
                    label="审核时间"
                     >
                    </el-table-column>
                    <el-table-column
                    prop="auditUserName"
                    label="操作人"
                     >
                    </el-table-column>
                    
                     <el-table-column
                      prop="auditType"
                      label="审核流程"
                       >
                      </el-table-column>
                       <el-table-column
                      prop="auditResult"
                      label="结果"
                       >
                      </el-table-column>
                    <el-table-column
                    prop="auditComment"
                    label="审核意见"
                     >
                    </el-table-column>
                </el-table>
                <el-steps :active="1" align-center style="margin-top:40px">
                  <el-step title="新建" ></el-step>
                  <el-step title="立项核准" description='安技部-部门管理团队'></el-step>
                  <el-step title="调查方案" description='安技部-安全管理经理'></el-step>
                  <el-step title="调查情况" description='安技部-安全监察组'></el-step>
                  <el-step title="验证核准" description='安技部-安全管理经理'></el-step>
                  <el-step title="处理改进" description='安技部-部门管理团'></el-step>
                  <el-step title="结束" ></el-step>
                </el-steps>
                <div class="text-center" style="padding-top:30px">
                  <el-button type="primary" size='small' v-if="visible === 0" @click="proces(0)">发送</el-button>
                  <el-button    v-if="visible === 0" @click="gobacklist">返 回</el-button>
                   <!-- <el-button type="warning" size='small'  v-if="visible === 0" @click="proces(3)">回 退</el-button> -->
                </div>
        </b-card-body>

                  <!-- 调查方案 -->
            <b-card-body v-if="status === 1">
                  <el-table
                      :data="programme"
                      size='small'
                         >
                      <el-table-column
                      prop="plan_user_name"
                      label="方案制定人"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="plan_complete_date"
                      label="方案完成时间"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="zz"
                      label="组长"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="zy"
                      label="组员"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="plan_date"
                      label="方案制定时间"
                       >
                      </el-table-column>
                      <el-table-column
                      
                      label="操作"
                       >
                       <template slot-scope="scope">
                          <el-button type="success" size='mini' @click="scheme(1, scope.$index, scope.row)">修 改</el-button>
                          <el-button type="danger" size='mini' @click="deletelist(scope.$index, scope.row)">删 除</el-button>
                        </template>
                      </el-table-column>
                  </el-table>
                   <el-steps :active="2" align-center style="margin-top:40px">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description='安技部-部门管理团队'></el-step>
                  <el-step title="调查方案" description='安技部-安全管理经理'></el-step>
                  <el-step title="调查情况" description='安技部-安全监察组'></el-step>
                  <el-step title="验证核准" description='安技部-安全管理经理'></el-step>
                  <el-step title="处理改进" description='安技部-部门管理团'></el-step>
                  <el-step title="结束"></el-step>
                </el-steps>
                  <div class="text-center" style="padding-top:30px">
                    <el-button type="primary" v-if="isshow" size='small' @click="dialogFormVisibleslist(0)">新增</el-button>
                    <el-button @click="postlist" v-loading.fullscreen.lock="fullscreenLoading" size='small' :disabled="showslist === 'true'" type="success">发 送</el-button>
                  </div>
            </b-card-body>
                    <!-- 调查情况 -->
            <b-card-body v-if="status === 2">
                  <el-table
                      size='small'
                      :data="Eventlevel"
                      :stripe="true"
                      @expand-change="activelist"
                      :highlight-current-row ="true"
                      style="width: 100%">
                      <div>
                      </div>
                  <el-table-column type="expand" fixed="left">
                    <template slot-scope="props" >
                     <el-card no-body  v-if="eventsui">
                       <b-card-header>原因分类</b-card-header>
                        <div>
                          <EventForm :postDta="getreason" @getevent="getevent" @getremove="removelist"/>
                        </div>
                     </el-card>
                       <el-card no-body v-if="sibility">
                         <b-card-header>责任划分</b-card-header>
                        <div>
                          <EventFormResponsibility :postDta="EventFormResponsibility" @getevents="getevents" @getremoves="removelists"/>
                        </div>
                     </el-card>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed
                    label='#'
                    width='60px'>
                    <template slot-scope="scope">
                      {{scope.$index + 1}}
                    </template>
                  </el-table-column>
                      <el-table-column
                      prop="title"
                      label="事件概要"
                      >
                      </el-table-column>
                      <el-table-column
                      prop="caseContent"
                      label="事件详细经过"
                      >
                      </el-table-column>
                  
                      <el-table-column
                      prop="dependent"
                      label="事件性质"
                      >
                      </el-table-column>
                      <el-table-column
                      prop="caseLevelDetail"
                      label="事件等级细分"
                      >
                      </el-table-column>
                      <el-table-column
                      prop="dependent"
                      label="依据"
                      >
                      </el-table-column>
                      <el-table-column
                      prop="caseResult"
                      label="事件结论"
                      >
                      </el-table-column>
                      <el-table-column
                      prop="caseHazard"
                      label="危险来源"
                      >
                      </el-table-column>
                      <el-table-column
                      prop="reportToUp"
                      label="是否上报局方"
                      >
                      </el-table-column>
                      <el-table-column
                      prop="reportDependent"
                      label="上报依据来源"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="city"
                      label="操作"
                      
                       >
                      <template slot-scope="scope">
                        <el-button type="success" :disabled="yesno" size='mini' @click="classifications(0, scope.$index, scope.row)">原因分类</el-button>
                        <el-button type="info" size='mini' @click="classificationslist(0, scope.$index, scope.row)">责任划分</el-button>
                        <el-button type="primary" size='mini' @click="modelyclassifications(1, scope.$index, scope.row)">修 改</el-button>
                        <el-button type="danger" size='mini' @click="removeclassificationslist(scope.$index, scope.row)">删 除</el-button>
                      </template>
                      </el-table-column>
                  </el-table>
                   <el-steps :active="3" align-center style="margin-top:40px">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description='安技部-部门管理团队'></el-step>
                  <el-step title="调查方案" description='安技部-安全管理经理'></el-step>
                  <el-step title="调查情况" description='安技部-安全监察组'></el-step>
                  <el-step title="验证核准" description='安技部-安全管理经理'></el-step>
                  <el-step title="处理改进" description='安技部-部门管理团'></el-step>
                  <el-step title="结束"></el-step>
                </el-steps>
                  <div class="text-center" style="padding-top:30px">
                    <el-button type="primary" size='small' :disabled="showslists !== 'true'" @click="dialogFormVisibleadds(0)">调查情况新增</el-button>
                    <el-button @click="postlist1" v-loading.fullscreen.lock="fullscreenLoading" size='small' :disabled="showslists === 'true'" type="success">发 送</el-button>
                  </div>
            </b-card-body>
                          <!-- 验证核准 -->
            <b-card-body v-if="status === 3">
                  <el-table
                      size='small'
                      :data="Eventlevel"
                      :stripe="true"
                      
                      @expand-change="activelist"
                      :highlight-current-row ="true"
                      style="width: 100%">
                      <div>
                      </div>
                  <el-table-column type="expand" fixed="left">
                    <template slot-scope="props" >
                     <el-card no-body  v-if="eventsui">
                       <b-card-header>原因分类</b-card-header>
                        <div>
                          <QulityForm :postDta="getreason"/>
                        </div>
                     </el-card>
                        <div style="padding:10px 0"></div>
                       <el-card no-body v-if="sibility">
                         <b-card-header>责任划分</b-card-header>
                        <div>
                          <QualityFormResponsibility :postDta="EventFormResponsibility"/>
                        </div>
                     </el-card>
                    </template>
                  </el-table-column>
                      <el-table-column
                      fixed
                      label='#'
                      width='60px'>
                      <template slot-scope="scope">
                        {{scope.$index + 1}}
                      </template>
                    </el-table-column>
                      <el-table-column
                      prop="title"
                      label="事件概要"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="caseContent"
                      label="事件详细经过"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="dependent"
                      label="事件性质"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="caseLevelDetail"
                      label="事件等级细分"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="dependent"
                      label="依据"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="caseResult"
                      label="事件结论"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="caseHazard"
                      label="危险来源"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="reportToUp"
                      label="是否上报局方"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="reportDependent"
                      label="上报依据来源"
                       >
                      </el-table-column>
                  </el-table>
                   <el-steps :active="4" align-center style="margin-top:40px">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description='安技部-部门管理团队'></el-step>
                  <el-step title="调查方案" description='安技部-安全管理经理'></el-step>
                  <el-step title="调查情况" description='安技部-安全监察组'></el-step>
                  <el-step title="验证核准" description='安技部-安全管理经理'></el-step>
                  <el-step title="处理改进" description='安技部-部门管理团'></el-step>
                  <el-step title="结束"></el-step>
                </el-steps>
                  <div class="text-center" style="padding-top:30px">
                    <el-button @click="proces(0)" v-loading.fullscreen.lock="fullscreenLoading" size='small'  type="success">发送</el-button>
                    <!-- <el-button @click="proces(3)" size='small'  type="warning">驳 回</el-button> -->
                  </div>
            </b-card-body>
              <!-- 处理改进 -->
            <b-card-body v-if="status === 4">
                <el-table
                      size='small'
                      :data="Eventlevel"
                      :stripe="true"
                      
                      @expand-change="activelist"
                      :highlight-current-row ="true"
                      style="width: 100%">
                      <div>
                      </div>
                  <el-table-column type="expand" fixed="left">
                    <template slot-scope="props" >
                     <el-card no-body v-if="eventsui">
                       <b-card-header>原因分类</b-card-header>
                        <div>
                          <QulityForm  :postDta="getreason"/>
                        </div>
                     </el-card>
                        <div style="padding:10px 0"></div>
                       <el-card no-body v-if="sibility">
                         <b-card-header>责任划分</b-card-header>
                        <div>
                          <QualityFormResponsibility :postDta="EventFormResponsibility"/>
                        </div>
                     </el-card>
                    </template>
                  </el-table-column>
                  <el-table-column
                      fixed
                      label='#'
                      width='60px'>
                      <template slot-scope="scope">
                        {{scope.$index + 1}}
                      </template>
                    </el-table-column>
                      <el-table-column
                      prop="title"
                      label="事件概要"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="caseContent"
                      label="事件详细经过"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="dependent"
                      label="事件性质"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="caseLevelDetail"
                      label="事件等级细分"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="dependent"
                      label="依据"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="caseResult"
                      label="事件结论"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="caseHazard"
                      label="危险来源"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="reportToUp"
                      label="是否上报局方"
                       >
                      </el-table-column>
                      <el-table-column
                      prop="reportDependent"
                      label="上报依据来源"
                       >
                      </el-table-column>
                  </el-table>
                  <div class="row" v-if="status === 4" style="margin-top:20px">
                    <div class="col">
                      <el-form-item label="下发整改" v-model="startRisk">
                       <el-radio v-model="eventDOS.startSafetyNotice"  label="true"  @change="clickitem('true')">是</el-radio>
                       <el-radio v-model="eventDOS.startSafetyNotice" label="false" @change="clickitem('false')">否</el-radio>
                      </el-form-item>
                    </div>
                    <div class="col">
                    <el-form-item label="风险管理">
                        <el-radio v-model="eventDOS.startRisk"  label="true">是</el-radio>
                        <el-radio v-model="eventDOS.startRisk" label="false" >否</el-radio>
                    </el-form-item>
                    </div>
                    <div class="text-right; mt-2">
                        <el-button size='small' type="primary" :disabled="cation" @click="Newviewss(1)">整改建议新增</el-button>
                    </div>
                  </div>
                  <div class="row" v-if="startRisk == 'true'">
                     <div style="padding-right:3%"></div>
                        <b-card-body>
                              <el-table
                                  :data="transformRequest"
                                  size='small'
                                     >
                                  <el-table-column
                                  prop="deptName"
                                  label="责任单位"
                                   >
                                  </el-table-column>
                                  <el-table-column
                                  prop="improveContent"
                                  label="整改意见"
                                   >
                                  </el-table-column>
                                  <el-table-column
                                  prop="improveType"
                                  label="整改类型"
                                   >
                                  </el-table-column>
                                   <el-table-column
                                  prop="improveType"
                                  label="操作"
                                   >
                                  <template slot-scope="scope">
                                    <el-button size='mini' type="success" @click="Newviewss(2, scope.$index, scope.row)">修 改</el-button>
                                    <el-button type="danger" size='mini' @click="removeeventDOS(scope.$index, scope.row)">删 除</el-button>
                                  </template>
                                  </el-table-column>
                              </el-table>
                              
                        </b-card-body>
                  </div> 
                   <el-steps :active="5" align-center style="margin-top:40px">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description='安技部-部门管理团队'></el-step>
                  <el-step title="调查方案" description='安技部-安全管理经理'></el-step>
                  <el-step title="调查情况" description='安技部-安全监察组'></el-step>
                  <el-step title="验证核准" description='安技部-安全管理经理'></el-step>
                  <el-step title="处理改进" description='安技部-部门管理团'></el-step>
                  <el-step title="结束"></el-step>
                </el-steps>
                  <div class="text-center" style="padding-top:30px">
                    <el-button size='small' type="primary" @click="riskpreservation">保 存</el-button>
                    <el-button @click="postlists" v-loading.fullscreen.lock="fullscreenLoading" size='small'  type="success">发 送</el-button>
                  </div>
                
            </b-card-body>
    </b-card>
    <el-dialog title="审核" :visible.sync="dialogFormVisible">
          <el-form :model="form"  ref="form">
            <el-form-item label="意见" :label-width="formLabelWidth" :rules="[{ required: true, message: '意见不能为空'}]" prop="auditComment">
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
            <el-button type="primary" size='mini' v-loading.fullscreen.lock="fullscreenLoading" @click="project('form')">同 意</el-button>
            <el-button type="success" size='mini' v-loading.fullscreen.lock="fullscreenLoading" @click="dialogFormVisibleback('form')">驳 回</el-button>
            <el-button  size='mini' @click="Return('form')">返 回</el-button>
          </div>
    </el-dialog>
                  <!-- 新增的弹框 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisibles">
      <el-form :model="newadded"  ref="newadded">
        <div class="row">
          <div class="col">
            <el-form-item label="方案制定人" :label-width="formLabelWidth" :rules="[{ required: true, message: '请填写内容'}]" prop="planUserName">
                <el-input placeholder="请输入内容" :disabled="true" v-model="newadded.planUserName" clearable>
                </el-input>
            </el-form-item>
          </div>
          <div class="col">
            <el-form-item label="方案制定时间" :label-width="formLabelWidth" :rules="[{ required: true, message: '请选择时间'}]" prop="planDate">
                <el-date-picker
                v-model="newadded.planDate"
                type="date"
                style="width:100%"
                placeholder="航班日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <el-form-item label="调查部门" :label-width="formLabelWidth">
                <el-cascader 
                :change-on-select='true'
                :options="deptNameList" 
                @change="handleChangebtn"
                style="width:100%"
                v-model="newaddeds.planDeptName" 
                :props='{value:"value"}' 
                :show-all-levels="false" 
                :clearable='true'>
                </el-cascader>


              <!-- <el-select v-model="newaddeds.planDeptName"  value-key="deptName"  @change="btn" style="width:100%">
              <el-option v-for="(item, index) in submitDeptNameList"
                :key="index" :label="item.deptName" :value='item'></el-option>
            </el-select> -->
          </el-form-item>
          </div>
          <div class="col">
              <el-form-item label="调查组组长" :label-width="formLabelWidth">
                <el-select v-model="userName1" multiple style="width:100%" @change="toid" value-key='id'>
                  <el-option v-for="(item,index) in statuss"
                    :key="index"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
          </div>
        </div>
        <div class="row">
            <div class="col">
                <el-form-item label="调查组组员" :label-width="formLabelWidth">
                <el-select v-model="userName2" multiple style="width:100%" @change="toid1" value-key='id'>
                  <el-option v-for="(item,index) in statuss"
                    :key="index"
                    :label="item.name"
                    :value="item"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col">
            </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size='mini' @click="sendout('newadded')">保 存 </el-button>
        <el-button  size='mini' @click="dialogFormVisibless">返 回</el-button>
      </div>
    </el-dialog>
<!-- 调查新增的弹框 -->
         <el-dialog title="调查新增" :visible.sync="dialogFormVisibleadd">
            <el-form :model="newaddedlist"  ref="newaddedlist">
                <div class="row">
                    <div class="col">
                        <el-form-item label="事件性质" :label-width="formLabelWidth" :rules="[{ required: true, message: '请选择部门'}]" prop="caseNature">
                            <el-select v-model="newaddedlist.caseNature" style="width:100%" >
                            <el-option v-for="(item, index) in REASON_CHARACTER"
                            :key="index" :label="item.dictName" :value='item.dictName'></el-option>
                          </el-select>
                        </el-form-item>
                    </div>
                    <div class="col">
                        <el-form-item label="事件等级细分" :label-width="formLabelWidth" :rules="[{ required: true, message: '请选择部门'}]" prop="caseLevelDetail">
                            <el-select v-model="newaddedlist.caseLevelDetail"  style="width:100%" >
                            <el-option v-for="(item, index) in EVENT_LEVEL_DETAIL"
                            :key="index" :label="item.dictName" :value='item.dictName'></el-option>
                          </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="row">
                  <div class="col">
                    <el-form-item label="危险关联" :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]" >
                        <el-cascader
                          :props='{value:"value"}'
                          :options="optionslist"
                          :show-all-levels="false" 
                          v-model="caseHazard"
                          :clearable='true'
                           style="width:100%"
                          @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                  </div>
                  <div class="col">
                    <el-form-item label="危险源" :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]" prop="caseHazard">
                        <el-select v-model="newaddedlist.caseHazard"  style="width:100%">
                        <el-option v-for="(item, index) in DANGER"
                        :key="index" :label="item.riskDesc" :value='item.riskDesc'></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="row">
                    <div class="col">
                      <el-form-item label="依据" :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]" prop="dependent">
                          <el-select v-model="newaddedlist.dependent"  style="width:100%">
                          <el-option v-for="(item, index) in EVENT_LEVEL_DETAILA"
                          :key="index" :label="item.dictName" :value='item.dictName'></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="col">
                      <el-form-item label=事件等级 :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]" prop="caseLevel">
                        <el-select v-model="newaddedlist.caseLevel"  style="width:100%">
                          <el-option v-for="(item, index) in EVENT_LEVEL"
                          :key="index" :label="item.dictName" :value='item.dictName'></el-option>
                        </el-select>
                      </el-form-item>
                  </div>
                  </div>
                    <el-form-item label="事件结论" :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]" prop="caseResult">
                        <el-input  style="width:100%" v-model="newaddedlist.caseResult" placeholder="请输入内容"  ></el-input>
                    </el-form-item>
                <div class="row">
                  <div class="col" >
                    <el-form-item label="是否上报局方" style="margin-left:6%" prop="reportToUp">
                      <el-radio @change="yes" v-model="newaddedlist.reportToUp" label='true'>是</el-radio>
                      <el-radio @change="fou" v-model="newaddedlist.reportToUp" label='false'>否</el-radio>
                    </el-form-item>
                  </div>
                  <div class="col">
                     <el-form-item label="依据选择"
                     v-if="prescription" 
                     :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]"  prop="reportDependent">
                          <el-select v-model="newaddedlist.reportDependent"  style="width:100%">
                          <el-option v-for="(item, index) in EVENT_LEVEL_JF"
                          :key="index" :label="item.dictName" :value='item.dictName' ></el-option>
                        </el-select>
                      </el-form-item>
                  </div>
                </div>
                 <div class="row-12">
                  <el-form-item label="事情概要" :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]" prop="title">
                    <el-input
                      auto-complete="off"
                      type="textarea"
                      :rows="4"
                      placeholder="请输入内容"
                      v-model="newaddedlist.title">
                    </el-input>
                  </el-form-item>
                 </div>
                <div class="row-12" style="margin:20px 0">
                    <el-form-item label="事情详细经过" :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]"    prop="caseContent">
                      <el-input
                        auto-complete="off"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入内容"
                        v-model="newaddedlist.caseContent">
                      </el-input>
                    </el-form-item>
                </div>
                <div class="row-12" v-if="official === 'true'">
                    <el-form-item label="QAR分析结论" :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]" prop="qarResult">
                  <el-input
                    auto-complete="off"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="newaddedlist.qarResult">
                  </el-input>
                </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" size='mini' @click="investigationsendout('newaddedlist')">确 定</el-button>
              <el-button type="success" size='mini' @click="dialogFormVisibleaddsui('newaddedlist')">关 闭</el-button>
            </div>
        </el-dialog>

 <!-- 调查新增原因分类的弹框 -->
        <el-dialog title="原因分类" :visible.sync="classification">
          <el-form :model="causeclassification"  ref="causeclassification">
            <div class="row">
              <div class="col">
                  <el-form-item label="一级原因" :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]">
                     <el-cascader
                          :props='{value:"value"}'
                          :options="resonId1"
                          :show-all-levels="false" 
                          v-model="resonId1s"
                          :clearable='true'
                          style="width:100%"
                          @change="handleChanges">
                        </el-cascader>
                  </el-form-item>
              </div>
                <div class="col">
                   <el-form-item label="原因性质" :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]" prop="resonNature">
                      <el-select v-model="causeclassification.resonNature" style="width:100%">
                      <el-option v-for="(item, index) in REASON_DUTY"
                      :key="index" :label="item.dictName" :value='item.dictName'></el-option>
                    </el-select>
                  </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col">
                   <el-form-item label="具体原因" :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]" prop="resonDetailId">
                      <el-select v-model="causeclassification.resonDetailId" style="width:100%" >
                      <el-option v-for="(item, index) in resonDetailId"
                      :key="index" :label="item.reasonName" :value='item.reasonName'></el-option>
                    </el-select>
                  </el-form-item>
              </div>
              
            </div>
            <el-form-item label="事实分析" :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]" prop="resonAnalysis">
              <el-input
                auto-complete="off"
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="causeclassification.resonAnalysis">
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size='mini' @click="Preservation('causeclassification')">保 存</el-button>
            <el-button type="success" size='mini' @click="classificationslists('causeclassification')">关闭</el-button>
          </div>
        </el-dialog>
<!-- 调查新增责任划分的弹框 -->
        <el-dialog title="主要责任" :visible.sync="responsibility">
          <el-form :model="TypeOfResponsibility"  ref="TypeOfResponsibility">
            <div class="row">
              <div class="col">
                  <el-form-item label="责任单位" :label-width="formLabelWidth" :rules="[{ required: true, message: '请选责任单位'}]">
                      <el-cascader 
                        :change-on-select='true'
                        :options="deptNameList" 
                        @change="evevtsubmit"
                        style="width:100%"
                        v-model="caseHazardlist" 
                        :props='{value:"value"}' 
                        :show-all-levels="false" 
                        :clearable='true'>
                      </el-cascader>
                  </el-form-item>
              </div>
              <div class="col">
                  <el-form-item label="责任人" :label-width="formLabelWidth" :rules="[{ required: true, message: '请选责任人'}]">
                      <el-select v-model="submitDeptNameLists.resUserName" value-key="userName" @change="evevtsubmis" style="width:100%">
                      <el-option v-for="(item, index) in Personliable"
                      :key="index" :label="item.userName" :value='item'></el-option>
                    </el-select>
                  </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col">
                   <el-form-item label="责任类型" :label-width="formLabelWidth" :rules="[{ required: true, message: '请选择责任类型'}]">
                      <el-select v-model="TypeOfResponsibility.resType" style="width:100%">
                      <el-option v-for="(item, index) in DUTY_TYPE"
                      :key="index" :label="item.dictName" :value='item.dictName'></el-option>
                    </el-select>
                  </el-form-item>
              </div>
              <div class="col">
                   
              </div>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size='mini' @click="Liability('TypeOfResponsibility')">保 存</el-button>
            <el-button type="success" size='mini'  @click="responsibility = false">关 闭</el-button>
          </div>
        </el-dialog>
<!-- 驳回的弹框 -->
        <el-dialog title="驳回" :visible.sync="dialogFormVisibleReject">
          <el-form :model="form"  ref="form">
            <el-form-item label="驳回意见" :label-width="formLabelWidth" :rules="[{ required: true, message: '审核意见不能为空'}]" prop="auditComment">
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
            <el-button  size='mini' @click="dialogFormVisibleRejects('form')">返 回</el-button>
          </div>
        </el-dialog>
<!-- 建议整改新增的弹框 -->
        <el-dialog title="添加意见" :visible.sync="Newviews">
          <el-form :model="teventqarannoucement"  ref="teventqarannoucement">
            <div class="row">
              <div class="col">
                  <el-form-item label="责任单位" :label-width="formLabelWidth">
                  <!-- <el-select v-model="submitDeptNameLists.resDeptName" value-key="deptName" @change="evevtsubmits" >
                      <el-option v-for="(item, index) in Responsibilityunit"
                      :key="index" :label="item.deptName" :value='item'></el-option>
                    </el-select> -->
                    <el-cascader 
                      :change-on-select='true'
                      :options="deptNameList" 
                      @change="evevtsubmits"
                      style="width:100%"
                      v-model="submitDeptNameListsresDeptName" 
                      :props='{value:"value"}' 
                      :show-all-levels="false" 
                      :clearable='true'>
                    </el-cascader>
              </el-form-item>
              </div>
              <div class="col">
                  <el-form-item label="" v-if="startRisk == 'true'">
                        <el-radio v-model="teventqarannoucement.improveType"  label="true">整改项</el-radio>
                        <el-radio v-model="teventqarannoucement.improveType" label="false">建议项</el-radio>
                  </el-form-item>
              </div>
            </div>
             <el-form-item label="整改/建议要求" :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]" prop="improveContent">
              <el-input
                auto-complete="off"
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="teventqarannoucement.improveContent">
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size='mini'  @click="teventsendout('teventqarannoucement')">确 定</el-button>
            <el-button type="success" size='mini' @click="CloseNewviews">关 闭</el-button>
          </div>
        </el-dialog>
  </el-form>
</template>
<script>
import axios from 'axios'
import QulityForm from './QulityForm'
import QualityFormResponsibility from './QualityFormResponsibility.vue'
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
import { conditionGetDepartmentList } from '../../services/safety_supervision'
import { sourceDataFilter } from '../../tools'
import {
  getCascaderOb,
  getEventlevel,
  getscrik,
  grtclassa,
  getCause,
  getspecific,
  getResponsibility
} from '../../services/event_query'
import EventForm from '../event_inspect/EeventForm'
import EventFormResponsibility from '../event_inspect/EventFormResponsibility'
import { getDepartmentList } from '../../services/event_query'
export default {
  created () {
    getDepartmentList().then(result => {
      this.deptNameList = result
    })
    conditionGetDepartmentList(1).then(result => {
      result.map(item => {
        this.submitDeptNameList.push(item)
      })
    })
    this.safetyId = this.$route.params.id
    axios.get('/api/qar/event/selectQarAnnoucement?' + 'qarNumber=' + this.$route.params.id)
      .then(item => {
        if (item.data.error === 0) {
          item.data.data.map(result => {
            if (result.improveType === 'true') {
              result.improveType = '整改项'
            } else if (result.improveType === 'false') {
              result.improveType = '建议项'
            }
          })
          this.transformRequest = item.data.data
        }
      })
    axios.get('/api/qar/case/listQarCaseDO?' + 'qarNumber=' + this.$route.params.id)
      .then(item => {
        if (item.data.data.length > 0) {
          this.showslists = 'false'
        }
        item.data.data.map(items => {
          if (items.reportToUp === true) {
            items.reportToUp = '是'
          } else if (items.reportToUp === false) {
            items.reportToUp = '否'
          }
        })
        this.Eventlevel = item.data.data
        if (item.data.data.length !== 0) {
          axios.get('/api/qar/case/listQarCaseAnalysisDO?' + 'caseid=' + item.data.data[0].caseId)
            .then(item => {
              if (item.data.data.length === 0) {
                this.eventsui = false
              } else {
                this.eventsui = true
                this.yesno = true
              }
              this.getreason = item.data.data
            })
          //  责任划分
          axios.get('/api/qar/case/listQarCaseResponsibilityDO?' + 'caseid=' + item.data.data[0].caseId)
            .then(item => {
              if (item.data.data.length === 0) {
                this.sibility = false
              } else {
                this.sibility = true
              }
              this.EventFormResponsibility = item.data.data
            })
            this.expands.push(this.Eventlevel[0].caseId)
        }
      })
    this.newadded.planUserName = this.$store.state.user.userName
    this.newadded.planUser = this.$store.state.user.userId
    axios.get('/api/qar/plan/listQarPlanDO?' + 'reportNumber=' + this.$route.params.id)
      .then(res => {
        if (res.data.data.length > 0) {
          this.showslist = 'false'
          this.isshow = false
          let item = res.data.data[0]
          let arr = [{
            plan_complete_date: item.plan_complete_date,
            plan_dept_name: item.plan_dept_name,
            plan_date: item.plan_date,
            plan_id: item.plan_id,
            plan_user_name: item.plan_user_name,
            plan_dept: item.plan_dept,
            zz: '',
            zy: '',
            qarPlanVozz: [],
            qarPlanVozy: [],
          }]
          let data = res.data.data.map(item => {
            if (item.member_type === false) {
              arr[0].zz += item.user_name + ','
              arr[0].qarPlanVozz.push({
                name:item.user_name,
                id: item.user_id
              })
            } else {
              arr[0].zy += item.user_name + ','
              arr[0].qarPlanVozy.push({
                name:item.user_name,
                id: item.user_id
              })
            }
          })
          arr[0].zz = arr[0].zz.substring(0, arr[0].zz.lastIndexOf(','))
          arr[0].zy = arr[0].zy.substring(0, arr[0].zy.lastIndexOf(','))
          this.programme = arr
        }
      })
    //  查询当个事件
    axios.get('/api/qar/event/findOne?' + 'reportNumber=' + this.$route.params.id)
      .then(res => {
        if (res.data.error === 0) {
          let data = res.data.data
          if (data.startSafetyNotice === true) {
            this.eventDOS.startSafetyNotice = 'true'
            this.startRisk = 'true'
            this.cation = false
          } else if (data.startSafetyNotice === false) {
            this.eventDOS.startSafetyNotice = 'false'
            this.startRisk = 'false'
            this.cation = true
          }
          if (data.startRisk === true) {
            this.eventDOS.startRisk = 'true'

          } else if (data.startRisk === false) {
            this.eventDOS.startRisk = 'false'
          }
          this.QAR = res.data.data
          this.procInstId = res.data.data.procInstId
          this.status = res.data.data.status
          this.newadded.qarNumber = data.reportNumber
          this.eventDOS.title = data.title
          if (data.status === 0) {
            this.examinename = '立项核准'
            this.namelist = '立项核准'
            this.bntshow = false
          } else if (data.status === 1) {
            this.examinename = '调查方案'
            this.namelist = '调查方案'
          } else if (data.status === 2) {
            this.examinename = '调查情况'
            this.namelist = '调查情况'
            getscrik().then(item => {
              this.optionslist = item
            })
            grtclassa().then(item => {
              this.resonId1 = item
            })
            getCause().then(item => {
              this.REASON_DUTY = item.data.data
            })
            getResponsibility().then(item => {
              if (item.data.error === 0) {
                this.Responsibilityunit = item.data.data
              }
            })
            axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'EVENT_LEVEL_JF')
              .then(res => {
                if (res.data.error === 0) {
                  this.EVENT_LEVEL_JF = res.data.data
                }
              })
            axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'REASON_CHARACTER')
              .then(res => {
                if (res.data.error === 0) {
                  this.REASON_CHARACTER = res.data.data
                }
              })
            axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'DUTY_TYPE')
              .then(res => {
                if (res.data.error === 0) {
                  this.DUTY_TYPE = res.data.data
                }
              })
            axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'EVENT_LEVEL_DETAIL')
              .then(res => {
                if (res.data.error === 0) {
                  this.EVENT_LEVEL_DETAIL = res.data.data
                }
              })
            axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'EVENT_LEVEL_DETAILA')
              .then(res => {
                if (res.data.error === 0) {
                  this.EVENT_LEVEL_DETAILA = res.data.data
                }
              })
            getEventlevel().then(item => {
              this.EVENT_LEVEL = item.data.data
            })
          } else if (data.status === 3) {
            this.examinename = '验证核准'
            this.namelist = '验证核准'
          } else if (data.status === 4) {
            this.examinename = '处理改进'
            this.namelist = '处理改进'
            getResponsibility().then(item => {
              if (item.data.error === 0) {
                this.Responsibilityunit = item.data.data
              }
            })
          }
        }
      })
    axios.get('/api/attach/list_all?' + 'tableName=' + 't_qar&' + 'sourceNumber=' + this.$route.params.id)
      .then(res => {
        if (res.data.error === 0) {
        }
      })
    axios.get('/api/qar/event/listQarAuditId?' + 'reportNumber=' + this.$route.params.id)
      .then(res => {
        if (res.data.error === 0) {
          let Data = res.data.data.map(item => {
            if (item.auditType === 0) {
              item.auditType = '立项核准'
            } else if (item.auditType === -1) {
              item.auditType = '新建'
            } else if (item.auditType === 1) {
              item.auditType = '调查方案'
            } else if (item.auditType === 2) {
              item.auditType = '调查情况'
            } else if (item.auditType === 3) {
              item.auditType = '验证核准'
            } else if (item.auditType === 4) {
              item.auditType = '处理改进'
            } else if (item.auditType === 5) {
              item.auditType = '结束'
            }
            if (item.auditResult === false) {
              item.auditResult = '驳回'
            } else if (item.auditResult === true) {
              item.auditResult = '通过'
            }
            return item
          })
          this.aproject = Data
        }
      })
  },
  components: {
    SecurityNoticeAdjunct,
    EventForm,
    EventFormResponsibility,
    QulityForm,
    QualityFormResponsibility
  },
  data () {
    return {
      yesno: true,
      num1: 0,
      num2: 0,
      getRowKeys(row) {
        return row.caseId;
      },
      procInstId: '',
      namelist: '',
      expands: [],
      caseHazardlist: [],
      submitDeptNameListsresDeptName: [],
      deptNameList: [],
      cation: true,
      tableName: 't_qar',
      uploadFile: true,
      eventDO: {},
      QAR: {},
      status: 0,
      safetyId: '',
      caseId: 0,
      examinename: '',
      visible: 0,
      aproject: [],
      Eventlevel: [],
      dialogFormVisible: false,
      form: {
        auditComment: ''
      },
      formLabelWidth: '120px',
      bntshow: true,
      programme: [],
      fullscreenLoading: false,
      showslist: 'true',
      dialogFormVisibles: false,
      newadded: {
        qarNumber: 0,
        //  方案制定人
        planUserName: '',
        //  制定id
        planUser: 0,
        //  时间
        planDate: '',
        //  调查部门
        planDeptName: '',
        //  调查部门的id
        planDept: 0,
        //  组长
        userName: '',
        qarPlanVo: []
      },
      newaddeds: {planDeptName: []},
      submitDeptNameList: [],
      userName1: [],
      userName2: [],
      statuss: [],
      statelist: 0,
      eventsui: true,
      getreason: [],
      sibility: true,
      EventFormResponsibility: [],
      dialogFormVisibleaddss: 0,
      newaddedlist: {
        qarNumber: this.$route.params.id,
        caseUser: this.$store.state.user.userId,
        caseUserName: this.$store.state.user.userName,
        caseNature: '',
        caseLevelDetail: '',
        dependent: '',
        caseResult: '',
        reportDependent: '',
        reportToUp: 'true',
        caseHazard: '',
        title: '',
        caseContent: '',
        qarResult: '',
        caseLevel: ''
      },
      REASON_CHARACTER: [],
      EVENT_LEVEL_DETAIL: [],
      caseHazard: [],
      DANGER: [],
      EVENT_LEVEL_DETAILA: [],
      EVENT_LEVEL: [],
      groundList: {
        FLIGHT_PURPOSE: {
          dicts: []
        },
        FLIGHT_STATUS: {
          dicts: []
        },
        WEATHER_CONDITION: {
          dicts: []
        },
        LIGHT_CONDITION: {
          dicts: []
        },
        EVENT_TYEP: {
          dicts: []
        },
        EVENT_LEVEL: {
          dicts: []
        },
        FLIGHT_DELAY: {
          dicts: []
        },
        REASON_TYEP: {
          dicts: []
        },
        AIRCRAFT_DAMAGE: {
          dicts: []
        },
        RUNNING_STATUS: {
          dicts: []
        },
        CAR_CATEGORY: {
          dicts: []
        },
        SECURITY_EVENT_TYPE: {
          dicts: []
        },
        SECURITY_EVENT_TYPE1: {
          dicts: []
        },
        SECURITY_EVENT_TYPE2: {
          dicts: []
        }
      },
      isshow: true,
      dialogFormVisibleadd: false,
      optionslist: [],
      EVENT_LEVEL_JF: [],
      official: 'true',
      showslists: 'true',
      classification: false,
      resonId1: [],
      resonId1s: [],
      responsibility: false,
      causeclassification: {
        //  每行中的id
        caseId: 0,
        //  原因性质
        resonNature: '',
        //  一级原因
        resonId1: '',
        //  具体原因
        resonDetailId: '',
        //  原因分析
        resonAnalysis: '',
        annlysisId: 0,
        resonId2: ''
      },
      REASON_DUTY: [],
      resonDetailId: [],
      TypeOfResponsibility: {
        caseId: 0,
        //  责任类型
        resType: '',
        //  责任单位名称
        resDeptName: '',
        //  责任单位id
        resDeptId: 0,
        //  责任人
        resUserName: '',
        //  责任人id
        resUserId: 0
      },
      Responsibilityunit: [],
      Personliable: [],
      submitDeptNameLists: {
        resDeptName: '',
        resUserName: ''
      },
      DUTY_TYPE: [],
      modliyTypeOfResponsibility: 0,
      dialogFormVisibleReject: false,
      eventDOS: {
        //  是否下发整改
        startSafetyNotice: '',
        //  风险
        startRisk: '',
        reportNumber: this.$route.params.id,
        reporter: this.$store.state.user.userId,
        reporterName: this.$store.state.user.userName,
        reportDept: this.$store.state.user.deptId,
        reportDeptName: this.$store.state.user.deptName,
        title: ''
      },
      startRisk: 'false',
      transformRequest: [],
      teventqarannoucement: {
        qarNumber: this.$route.params.id,
        //  单位id
        deptId: this.$store.state.user.deptId,
        //  单位名称
        deptName: this.$store.state.user.deptName,
        //  建议整改内容
        improveContent: '',
        //  选项
        improveType: ''
      },
      Newviews: false,
      prescription: true,
      update: 0,
      end: 0
    }
  },
  methods: {
    dataFilter (avlue, type) {
      let sourceData = this.ALL_SELECT_DATA[type]
      let result = sourceDataFilter(sourceData, avlue)
      return result
    },
    Actions () {
      if (this.$refs.upDow.className === 'icon-arrow-down') {
          this.$refs.upDow.className = 'icon-arrow-up'
        } else {
          this.$refs.upDow.className = 'icon-arrow-down'
        }
    },
    gobacklist () {
      this.$router.back(-1)
    },
    proces (val) {
      if (val === 0) {
        this.end = val
        this.dialogFormVisible = true
      }
      if (val === 1) {
        this.dialogFormVisible = true
        this.end = val
      }
      if (val === 2) {
        this.dialogFormVisible = true
        this.end = val
      }
      if (val === 3) {
        this.dialogFormVisibleReject = true
        this.end = val
      }
    },
    project (formName) {
      if (this.end === 0) {
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
              result: 1,
              taskInfo: {
                taskId: taskId,
                taskName: this.namelist,
                procInstId: this.procInstId
              }
            }
            this.fullscreenLoading = true
            axios.post('/api/qar/complete', qarVo)
              .then(res => {
                this.fullscreenLoading = false
                if (res.data.error === 0) {
                  this.$router.back(0)
                  this.$message.success('保存成功')
                  this.dialogFormVisible = false
                } else {
                  this.$message.error('请重试' + res.data.message)
                }
              })
              .catch(() => {
                this.dialogFormVisible = false
                this.$message.error('网咯超时请检查网咯')
              })
          } else {
            return false
          }
        })
      } else if (this.end === 2) {
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
                taskId: taskId,
                taskName: this.namelist,
                procInstId: this.procInstId
              }
            }
            this.fullscreenLoading = true
            axios.post('/api/qar/complete', qarVo)
              .then(res => {
                this.dialogFormVisible = false
                if (res.data.error === 0) {
                  this.$router.back(0)
                  this.$message.success('已结束流程')
                  this.dialogFormVisible = false
                } else {
                  this.$message.error('请重试' + res.data.message)
                }
              })
              .catch(() => {
                this.dialogFormVisible = false
                this.$message.error('网咯超时请检查网咯')
              })
          } else {
            return false
          }
        })
      } else if (this.end === 1) {
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
              result: 1,
              taskInfo: {
                taskId: taskId,
                taskName: this.namelist,
                procInstId: this.procInstId
              }
            }
            this.fullscreenLoading = true
            axios.post('/api/qar/complete', qarVo)
              .then(res => {
                this.dialogFormVisible = false
                if (res.data.error === 0) {
                  this.$router.back(0)
                  this.$message.success('发送成功')
                  this.dialogFormVisible = false
                } else {
                  this.$message.error('请重试' + res.data.message)
                }
              })
              .catch(()=>{
                this.dialogFormVisible = false
                this.$message.error('网咯超时请检查网咯')
              })
          } else {
            return false
          }
        })
      }
    },
    Return (form) {
      this.dialogFormVisible = false
      this.$refs[form].resetFields()
    },
    dialogFormVisibleback (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            let eventid = parseInt(this.$route.params.id)
            let taskId = this.$route.params.taskId
            let qarVo = {
              qarAuditDO: {
                reportNumber: eventid,
                auditComment: this.form.auditComment,
                auditUserName: this.$store.state.user.userName
              },
              result: 3,
              taskInfo: {
                taskId: taskId,
                taskName: this.namelist,
                procInstId: this.procInstId
              }
            }
            this.fullscreenLoading = true
            axios.post('/api/qar/complete', qarVo)
              .then(res => {
                this.fullscreenLoading =false
                if (res.data.error === 0) {
                  this.$router.back(0)
                  this.$message.success('驳回成功')
                  this.dialogFormVisible = false
                  this.$refs[form].resetFields()
                } else {
                  this.$message.error('请重试' + res.data.message)
                  this.$message.error('网咯超时请检查网咯')
                }
              })
              .catch(() => {
                this.fullscreenLoading = false
              })
          } else {
            return false
          }
        })
    },
    tiggleActions () {
      if (this.$refs.upDowns.className === 'icon-arrow-down') {
        this.$refs.upDowns.className = 'icon-arrow-up'
      } else {
        this.$refs.upDowns.className = 'icon-arrow-down'
      }
    },
    scheme (index, len, obj) {
      this.valueid = index
      let data = {
        label: obj.plan_dept_name,
        value: obj.plan_dept_name
      }
      this.deptNameList.push(data)
      this.newadded.planDate = obj.plan_date
      this.newaddeds.planDeptName.push(obj.plan_dept_name)
      this.newadded.planDeptName = obj.plan_dept_name
      this.newadded.planId = obj.plan_id
      this.newadded.planDept = obj.plan_dept
      this.dialogFormVisibles = true
      this.obj = obj
      this.userName1 = obj.qarPlanVozz
      this.userName2 = obj.qarPlanVozy
      axios.get('/api/system/user/dept?' + 'deptId=' + obj.plan_dept)
        .then(res => {
          if (res.data.error === 0) {
            let data = res.data.data.map(item => {
              return {
                name: item.userName,
                id: item.userId
              }
            })
            this.statuss = data
          } else if (res.data.data.length === 0) {
            this.$message.warning('此部门没有资料')
          }
        })
    },
    deletelist (index, params) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/api/qar/plan/deleteQarPlanDO?' + 'caseId=' + params.plan_id)
          .then(res => {
            if (res.data.error === 0) {
              axios.get('/api/qar/plan/listQarPlanDO?' + 'reportNumber=' + this.$route.params.id)
                .then(res => {
                  if (res.data.data.length < 1) {
                    this.showslist = 'true'
                    this.isshow = true
                  }
                  this.programme = res.data.data
                })
            }
          })
      }).catch(() => {
      })
    },
    postlist () {
      this.$confirm('是否进行下一步', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let eventid = parseInt(this.$route.params.id)
        let taskId = this.$route.params.taskId
        let qarVo = {
          qarAuditDO: {
            reportNumber: eventid,
            auditComment: this.form.auditComment,
            auditUserName: this.$store.state.user.userName
          },
          result: 1,
          taskInfo: {
            taskId: taskId,
            taskName: this.namelist,
            procInstId: this.procInstId
          }
        }
        this.fullscreenLoading = true
        axios.post('/api/qar/complete', qarVo)
          .then(res => {
            this.fullscreenLoading = false
            this.$message.success('发送成功')
            this.$router.back(-1)
          })
          .catch(error => {
            console.log(error)
            this.fullscreenLoading = false
            this.$message.error('网咯超时请检查网咯')
          })
      })
    },
    postlist1 () {
      if (this.num1 === 0) {
          this.$message.error('清先填写原因分类')
        } else if(this.num2 === 0) {
          this.$message.error('请先填写责任划分')
        } else {
          this.postlist()
        }
    },
    dialogFormVisibleslist (value) {
      this.valueid = value
      this.dialogFormVisibles = true
    },
    handleChangebtn (params) {
      if (this.newaddeds.planDeptName.length === 1) {
        this.newaddeds.planDeptName = []
      } else {
        let len = getCascaderOb(this.newaddeds.planDeptName, this.deptNameList).length
        let id = getCascaderOb(this.newaddeds.planDeptName, this.deptNameList)[len - 1].deptCode
        this.newadded.planDeptName = params[params.length - 1]
        this.newadded.planDept = id
        this.userName1 = []
        this.userName2 = []
        this.statelist = 1
        axios.get('/api/system/user/dept?' + 'deptId=' + id)
          .then(res => {
            if (res.data.error === 0) {
              let data = res.data.data.map(item => {
                return {
                  name: item.userName,
                  id: item.userId
                }
              })
              this.statuss = data
            } else if (res.data.data.length === 0) {
              this.$message.warning('此部门没有资料')
            }
          })
      }
    },
    dialogFormVisibless () {
      this.valueid = 0
      this.newadded.planDate = ''
      this.newaddeds.planDeptName = []
      this.userName1 = []
      this.userName2 = []
      this.newadded.planId = 0
      this.newadded.planDept = 0
      this.dialogFormVisibles = false
    },
    toid (name) {
      
    },
    toid1 () {
      
    },
    sendout (newadded) {

      if (this.valueid === 0) {
        this.userName1.map(item => {
          this.newadded.qarPlanVo.push({
            name: item.name,
            id: item.id,
            memberType: 0
          })
        })
        this.userName2.map(item => {
          this.newadded.qarPlanVo.push({
            name: item.name,
            id: item.id,
            memberType: 1
          })
        })
        this.$refs[newadded].validate((valid) => {
          if (valid) {
            if (this.newaddeds.planDeptName.length === 0) {
              this.$message.warning('请先填写调查部门')
            } else if (this.userName1.length === 0) {
              this.$message.warning('请先填写调查组组长')
            } else if (this.userName2.length === 0) {
              this.$message.warning('请先填写调查组组员')
            } else {
              let QarPlanDO = this.newadded
              this.fullscreenLoading = true
              axios.post('/api/qar/plan/addQarPlan', QarPlanDO)
                .then(res => {
                  this.fullscreenLoading = false
                  if (res.data.error === 0) {
                    axios.get('/api/qar/plan/listQarPlanDO?' + 'reportNumber=' + this.$route.params.id)
                      .then(res => {
                        this.fullscreenLoading = false
                        if (res.data.data.length > 0) {
                          this.showslist = 'false'
                          this.isshow = false
                        }
                        let item = res.data.data[0]
                        let arr = [{
                          plan_complete_date: item.plan_complete_date,
                          plan_dept_name: item.plan_dept_name,
                          plan_date: item.plan_date,
                          plan_id: item.plan_id,
                          plan_user_name: item.plan_user_name,
                          plan_dept: item.plan_dept,
                          zz: '',
                          zy: '',
                          qarPlanVozz: [],
                          qarPlanVozy: [],
                        }]
                        let data = res.data.data.map(item => {
                          if (item.member_type === false) {
                            arr[0].zz += item.user_name + ','
                            arr[0].qarPlanVozz.push({
                              name:item.user_name,
                              id: item.user_id
                            })
                          } else {
                            arr[0].zy += item.user_name + ','
                            arr[0].qarPlanVozy.push({
                              name:item.user_name,
                              id: item.user_id
                            })
                          }
                        })
                        arr[0].zz = arr[0].zz.substring(0, arr[0].zz.lastIndexOf(','))
                        arr[0].zy = arr[0].zy.substring(0, arr[0].zy.lastIndexOf(','))
                        this.programme = arr
                      })
                      .catch(error => {
                        console.log(error)
                        this.fullscreenLoading = false
                      })
                    this.$message.success('保存成功')
                    this.dialogFormVisibles = false
                    this.userName1 = []
                    this.userName2 = []
                    this.statuss = []
                    this.valueid = 0
                    this.newadded.planDate = ''
                    this.newaddeds.planDeptName = []
                    this.newadded.planId = 0
                    this.newadded.planDept = 0
                    this.statelist = 0
                  } else if (res.data.error !== 0) {
                    this.$message.error('保存失败，请重试：' + res.data.message)
                    this.userName1 = []
                    this.userName2 = []
                    this.statuss = []
                    this.dialogFormVisibles = false
                  }
                })
                .catch(error => {
                  console.log(error)
                  this.fullscreenLoading = false
                  this.statuss = []
                  this.$message.error('网咯超时请检查网咯')
                })
            }
          } else {
            return false
          }
        })
      } else if (this.valueid === 1) {
        if (this.statelist === 1) {
          this.userName1.map(item => {
          this.newadded.qarPlanVo.push({
              name: item.name,
              id: item.id,
              memberType: 0
            })
          })
          this.userName2.map(item => {
            this.newadded.qarPlanVo.push({
              name: item.name,
              id: item.id,
              memberType: 1
            })
          })
          this.$refs[newadded].validate((valid) => {
            if (valid) {
              if (this.newaddeds.planDeptName.length === 0) {
                this.$message.warning('请先填写调查部门')
              } else if (this.userName1.length === 0) {
                this.$message.warning('请先填写调查组组长')
              } else if (this.userName2.length === 0) {
                this.$message.warning('请先填写调查组组员')
              } else {
                let QarPlanDO = this.newadded
                this.fullscreenLoading = true
                axios.post('/api/qar/plan/updateQarPlanDO', QarPlanDO)
                  .then(res => {
                    this.fullscreenLoading = false
                    if (res.data.error === 0) {
                      axios.get('/api/qar/plan/listQarPlanDO?' + 'reportNumber=' + this.$route.params.id)
                        .then(res => {
                          this.fullscreenLoading = false
                          if (res.data.data.length > 0) {
                            this.showslist = 'false'
                          }
                          let item = res.data.data[0]
                          let arr = [{
                          plan_complete_date: item.plan_complete_date,
                          plan_dept_name: item.plan_dept_name,
                          plan_date: item.plan_date,
                          plan_id: item.plan_id,
                          plan_user_name: item.plan_user_name,
                          plan_dept: item.plan_dept,
                          zz: '',
                          zy: '',
                          qarPlanVozz: [],
                          qarPlanVozy: [],
                        }]
                        let data = res.data.data.map(item => {
                          if (item.member_type === false) {
                            arr[0].zz += item.user_name + ','
                            arr[0].qarPlanVozz.push({
                              name:item.user_name,
                              id: item.user_id
                            })
                          } else {
                            arr[0].zy += item.user_name + ','
                            arr[0].qarPlanVozy.push({
                              name:item.user_name,
                              id: item.user_id
                            })
                          }
                        })
                        arr[0].zz = arr[0].zz.substring(0, arr[0].zz.lastIndexOf(','))
                        arr[0].zy = arr[0].zy.substring(0, arr[0].zy.lastIndexOf(','))
                        this.programme = arr
                        })
                        .catch(error => {
                          console.log(error)
                          this.fullscreenLoading = false
                        })
                      this.$message.success('修改成功')
                      this.dialogFormVisibles = false
                      this.userName1 = []
                      this.userName2 = []
                      this.valueid = 0
                      this.newadded.planDate = ''
                      this.newaddeds.planDeptName = []
                      this.newadded.planId = 0
                      this.newadded.planDept = 0
                      this.statelist = 0
                    }
                  })
                  .catch(error => {
                    console.log(error)
                    this.fullscreenLoading = false
                    this.$message.error('网咯超时请检查网咯')
                  })
              }
            } else {
              return false
            }
          })
        } else if (this.statelist === 0) {
          this.userName1.map(item => {
          this.newadded.qarPlanVo.push({
              name: item.name,
              id: item.id,
              memberType: 0
            })
          })
          this.userName2.map(item => {
            this.newadded.qarPlanVo.push({
              name: item.name,
              id: item.id,
              memberType: 1
            })
          })
          this.$refs[newadded].validate((valid) => {
            if (valid) {
              if (this.newaddeds.planDeptName.length === 0) {
                this.$message.warning('请先填写调查部门')
              } else if (this.userName1.length === 0) {
                this.$message.warning('请先填写调查组组长')
              } else if (this.userName2.length === 0) {
                this.$message.warning('请先填写调查组组员')
              } else {
                let QarPlanDO = this.newadded
                this.fullscreenLoading = true
                axios.post('/api/qar/plan/updateQarPlanDO', QarPlanDO)
                  .then(res => {
                    this.fullscreenLoading = false
                    if (res.data.error === 0) {
                      axios.get('/api/qar/plan/listQarPlanDO?' + 'reportNumber=' + this.$route.params.id)
                        .then(res => {
                          this.fullscreenLoading = false
                          if (res.data.data.length > 0) {
                            this.showslist = 'false'
                          }
                          let item = res.data.data[0]
                          let arr = [{
                          plan_complete_date: item.plan_complete_date,
                          plan_dept_name: item.plan_dept_name,
                          plan_date: item.plan_date,
                          plan_id: item.plan_id,
                          plan_user_name: item.plan_user_name,
                          plan_dept: item.plan_dept,
                          zz: '',
                          zy: '',
                          qarPlanVozz: [],
                          qarPlanVozy: [],
                        }]
                        let data = res.data.data.map(item => {
                          if (item.member_type === false) {
                            arr[0].zz += item.user_name + ','
                            arr[0].qarPlanVozz.push({
                              name:item.user_name,
                              id: item.user_id
                            })
                          } else {
                            arr[0].zy += item.user_name + ','
                            arr[0].qarPlanVozy.push({
                              name:item.user_name,
                              id: item.user_id
                            })
                          }
                        })
                        arr[0].zz = arr[0].zz.substring(0, arr[0].zz.lastIndexOf(','))
                        arr[0].zy = arr[0].zy.substring(0, arr[0].zy.lastIndexOf(','))
                        this.programme = arr
                        })
                        .catch(error => {
                          console.log(error)
                          this.fullscreenLoading = false
                        })
                      this.$message.success('修改成功')
                      this.dialogFormVisibles = false
                      this.userName1 = []
                      this.userName2 = []
                      this.valueid = 0
                      this.newadded.planDate = ''
                      this.newaddeds.planDeptName = []
                      this.newadded.planId = 0
                      this.newadded.planDept = 0
                      this.statelist = 0
                    }
                  })
                  .catch(error => {
                    console.log(error)
                    this.fullscreenLoading = false
                    this.$message.error('网咯超时请检查网咯')
                  })
              }
            } else {
              return false
            }
          })
        }
      }
    },
    activelist (index, params) {
      if (params.length > 1) {
        params.shift()
      }
      this.caseId = index.caseId
      //  原因分类请求
      axios.get('/api/qar/case/listQarCaseAnalysisDO?' + 'caseid=' + index.caseId)
        .then(item => {
          if (item.data.data.length === 0) {
            this.eventsui = false
          } else {
            this.eventsui = true
          }
          this.getreason = item.data.data
        })
      //  责任划分
      axios.get('/api/qar/case/listQarCaseResponsibilityDO?' + 'caseid=' + index.caseId)
        .then(item => {
          if (item.data.data.length === 0) {
            this.sibility = false
          } else {
            this.sibility = true
          }
          this.EventFormResponsibility = item.data.data
        })
    },
    getevent (index, params, array) {
      this.classification = true
      this.causeclassification.resonNature = array.resonNature
      this.causeclassification.resonId1 = array.resonId1
      this.causeclassification.resonDetailId = array.resonDetailId
      this.causeclassification.resonAnalysis = array.resonAnalysis
      this.causeclassification.caseId = array.caseId
      this.causeclassification.annlysisId = array.annlysisId
      this.modliycauseclassification = index
    },
    removelist (params) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/api/qar/case/deleteQarCaseAnalysisDO?' + 'annlysisId=' + params.annlysisId)
          .then(res => {
            if (res.data.error === 0) {
              axios.get('/api/qar/case/listQarCaseAnalysisDO?' + 'caseid=' + this.caseId)
                .then(item => {
                  if (item.data.data.length === 0) {
                    this.eventsui = false
                  } else {
                    this.eventsui = true
                  }
                  this.getreason = item.data.data
                })
            }
          })
      }).catch(() => {
      })
    },
    getevents (index, params, array) {
      this.TypeOfResponsibility.caseId = array.caseId
      this.TypeOfResponsibility.resType = array.resType
      this.TypeOfResponsibility.resDeptName = array.resDeptName
      this.submitDeptNameLists.resDeptName = array.resDeptName
      this.TypeOfResponsibility.resDeptId = array.resDeptId
      this.submitDeptNameLists.resUserName = array.resUserName
      this.TypeOfResponsibility.resUserName = array.resUserName
      this.TypeOfResponsibility.resUserId = array.resUserId
      this.TypeOfResponsibility.responId = array.responId
      this.modliyTypeOfResponsibility = index
      this.responsibility = true
    },
    removelists (params) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/api/qar/case/deleteQarCaseResponsibilityDO?' + 'responId=' + params.responId)
          .then(res => {
            if (res.data.error === 0) {
              axios.get('/api/qar/case/listQarCaseResponsibilityDO?' + 'caseid=' + this.caseId)
                .then(item => {
                  if (item.data.data.length === 0) {
                    this.sibility = false
                  } else {
                    this.sibility = true
                  }
                  this.EventFormResponsibility = item.data.data
                })
            }
          })
      }).catch(() => {
      })
    },
    classifications (id, index, params) {
      this.modliycauseclassification = id
      this.causeclassification.caseId = params.caseId
      this.classification = true
    },
    classificationslist (id, index, params) {
      this.modliyTypeOfResponsibility = id
      this.TypeOfResponsibility.caseId = params.caseId
      this.responsibility = true
    },
    modelyclassifications (id, index, row) {
      if (id === 1) {
        if (row.reportToUp === '是') {
          row.reportToUp = 'true'
        } else if (row.reportToUp === '否') {
          row.reportToUp = 'false'
        }
        this.$watch('dialogFormVisibleadd', () => {
          if (this.dialogFormVisibleadd === false) {
            if (row.reportToUp === 'true') {
              row.reportToUp = '是'
            } else if (row.reportToUp === 'false') {
              row.reportToUp = '否'
            }
          }
        })
        console.log(row)
        if (row.reportToUp === 'false') {
          this.prescription = false
        } else if (row.reportToUp === 'true') {
          this.prescription = true
        }
        this.newaddedlist = row
        this.dialogFormVisibleaddss = id
        this.dialogFormVisibleadd = true
      }
    },
    removeclassificationslist (index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/api/qar/case/deleteQarCaseDO?' + 'caseId=' + row.caseId)
          .then(item => {
            if (item.data.error === 0) {
              axios.get('/api/qar/case/listQarCaseDO?' + 'qarNumber=' + this.$route.params.id)
                .then(item => {
                  if (item.data.data.length < 1) {
                    this.showslists = 'true'
                  }
                  item.data.data.map(items => {
                    if (items.reportToUp === true) {
                      items.reportToUp = '是'
                    } else if (items.reportToUp === false) {
                      items.reportToUp = '否'
                    }
                  })
                  this.Eventlevel = item.data.data
                })
              this.Eventlevel = item.data.data
              this.yesno = false
              this.dialogFormVisibleadd = false
            }
          })
      }).catch(() => {
      })
    },
    dialogFormVisibleadds (id) {
      this.dialogFormVisibleadd = true
      this.prescription = true
      this.dialogFormVisibleaddss = id
    },
    handleChange (value) {
      let len = getCascaderOb(this.caseHazard, this.optionslist).length
      let id = getCascaderOb(this.caseHazard, this.optionslist)[len - 1].id
      this.newaddedlist.caseHazard = ''
      axios.get('/api/risk_source/category/' + id)
        .then(res => {
          if (res.data.error === 0) {
            this.DANGER = res.data.data
          }
        })
    },
    investigationsendout (newaddedlist) {
      if (this.dialogFormVisibleaddss === 0) {
        this.$refs[newaddedlist].validate((valid) => {
          if (valid) {
            let QarCaseDO = this.newaddedlist
            axios.post('/api/qar/case/addQarCase', QarCaseDO)
              .then(item => {
                if (item.data.error === 0) {
                  axios.get('/api/qar/case/listQarCaseDO?' + 'qarNumber=' + this.$route.params.id)
                    .then(item => {
                      if (item.data.data.length > 0) {
                        this.showslists = 'false'
                      }
                      item.data.data.map(items => {
                        if (items.reportToUp === true) {
                          items.reportToUp = '是'
                        } else if (items.reportToUp === false) {
                          items.reportToUp = '否'
                        }
                      })
                      this.Eventlevel = item.data.data
                    })
                  this.$message.success('保存成功')
                  this.yesno = false
                  this.dialogFormVisibleadd = false
                  this.shows = 'fasle'
                  this.$refs[newaddedlist].resetFields()
                  this.newaddedlist.caseHazard = ''
                  this.caseHazard = []
                } else {
                  this.$message.warning('保存失败' + item.data.error)
                }
              })
          } else {
            return false
          }
        })
      } else if (this.dialogFormVisibleaddss === 1) {
        this.$refs[newaddedlist].validate((valid) => {
          if (valid) {
            let QarCaseDO = this.newaddedlist
            axios.post('/api/qar/case/updateQarCaseDO', QarCaseDO)
              .then(res => {
                if (res.data.error === 0) {
                  axios.get('/api/qar/case/listQarCaseDO?' + 'qarNumber=' + this.$route.params.id)
                    .then(item => {
                      if (item.data.data.length > 0) {
                        this.showslists = 'false'
                      }
                      item.data.data.map(items => {
                        if (items.reportToUp === true) {
                          items.reportToUp = '是'
                        } else if (items.reportToUp === false) {
                          items.reportToUp = '否'
                        }
                      })
                      this.Eventlevel = item.data.data
                    })
                  this.$message.success('修改成功')
                  this.dialogFormVisibleadd = false
                  this.shows = 'fasle'
                  this.$refs[newaddedlist].resetFields()
                  this.newaddedlist = {}
                  this.newaddedlist.caseHazard = ''
                  this.caseHazard = []
                }
              })
          } else {
            return false
          }
        })
      }
    },
    dialogFormVisibleaddsui (newaddedlist) {
      this.$refs[newaddedlist].resetFields()
      this.dialogFormVisibleadd = false
      this.caseHazard = []
      axios.get('/api/qar/case/listQarCaseDO?' + 'qarNumber=' + this.$route.params.id)
        .then(item => {
          if (item.data.data.length > 0) {
            this.showslists = 'false'
          }
          item.data.data.map(items => {
            if (items.reportToUp === true) {
              items.reportToUp = '是'
            } else if (items.reportToUp === false) {
              items.reportToUp = '否'
            }
          })
          this.Eventlevel = item.data.data
        })
    },
    handleChanges (params) {
      this.causeclassification.resonId2 = params[0]
      let data = params[params.length - 1]
      this.causeclassification.resonId1 = data
      let len = getCascaderOb(this.resonId1s, this.resonId1).length
      let id = getCascaderOb(this.resonId1s, this.resonId1)[len - 1].id
      getspecific(id).then(item => {
        this.resonDetailId = item.data.data
      })
    },
    Preservation (causeclassification) {
      if (this.modliycauseclassification === 0) {
        this.$refs[causeclassification].validate((valid) => {
          if (valid) {
            this.fullscreenLoading = true
            axios.post('/api/qar/case/addQarCaseAnalysis', this.causeclassification)
              .then(item => {
                this.fullscreenLoading = false
                if (item.data.error === 0) {
                  axios.get('/api/qar/case/listQarCaseDO?' + 'qarNumber=' + this.$route.params.id)
                    .then(item => {
                      if (item.data.data.length > 0) {
                        this.showslists = 'false'
                      }
                      item.data.data.map(items => {
                        if (items.reportToUp === true) {
                          items.reportToUp = '是'
                        } else if (items.reportToUp === false) {
                          items.reportToUp = '否'
                        }
                      })
                      this.Eventlevel = item.data.data
                    })
                  this.$message.success('保存成功')
                  this.yesno = true
                  this.num1 = 1
                  this.resonId1s = []
                  this.$refs[causeclassification].resetFields()
                  this.classification = false
                }
              })
              .catch(error => {
                console.log(error)
                this.fullscreenLoading = false
                this.$message.error('网咯超时请检查网咯')
              })
          } else {
            return false
          }
        })
      }
      if (this.modliycauseclassification === 1) {
        axios.post('/api/qar/case/updatQarCaseAnalysisDO', this.causeclassification)
          .then(res => {
            if (res.data.error === 0) {
              this.$message.success('修改成功')
              this.resonId1s = []
              this.$refs[causeclassification].resetFields()
              axios.get('/api/qar/case/listQarCaseAnalysisDO?' + 'caseid=' + this.caseId)
                .then(item => {
                  if (item.data.data.length === 0) {
                    this.eventsui = false
                  } else {
                    this.eventsui = true
                  }
                  this.getreason = item.data.data
                })
              this.classification = false
            }
          })
      }
    },
    classificationslists (causeclassification) {
      this.resonId1s = []
      this.classification = false
      this.$refs[causeclassification].resetFields()
    },
    evevtsubmit (value) {
      //  let deptId = value.deptId
      if (this.caseHazardlist.length === 1) {
        this.caseHazardlist = []
      } else {
        let len = getCascaderOb(this.caseHazardlist, this.deptNameList).length
        let id = getCascaderOb(this.caseHazardlist, this.deptNameList)[len - 1].deptCode
        this.submitDeptNameLists.resDeptName = getCascaderOb(this.caseHazardlist, this.deptNameList)[len - 1].label
        this.TypeOfResponsibility.resDeptId = id
        this.TypeOfResponsibility.resDeptName = getCascaderOb(this.caseHazardlist, this.deptNameList)[len - 1].label
        axios.get('/api/system/user/dept?' + 'deptId=' + id)
          .then(res => {
            if (res.data.error === 0) {
              this.Personliable = res.data.data
            }
          })
      }
      
    },
    evevtsubmis (value) {
      this.TypeOfResponsibility.resUserId = this.submitDeptNameLists.resUserName.userId
      this.TypeOfResponsibility.resUserName = this.submitDeptNameLists.resUserName.userName
    },
    Liability () {
      if (this.modliyTypeOfResponsibility === 0) {
        if (this.submitDeptNameLists.resDeptName === '') {
          this.$message.error('请填写责任单位')
        } else if (this.submitDeptNameLists.resUserName === '') {
          this.$message.error('请填写责任人')
        } else if (this.TypeOfResponsibility.resType === '') {
          this.$message.error('请填写责任类型')
        } else {
          this.fullscreenLoading = true
          axios.post('/api/qar/case/addCaseResponsibility', this.TypeOfResponsibility)
            .then(res => {
              this.fullscreenLoading = false
              axios.get('/api/qar/case/listQarCaseDO?' + 'qarNumber=' + this.$route.params.id)
                .then(item => {
                  if (item.data.data.length > 0) {
                    this.showslists = 'false'
                  }
                  item.data.data.map(items => {
                    if (items.reportToUp === true) {
                      items.reportToUp = '是'
                    } else if (items.reportToUp === false) {
                      items.reportToUp = '否'
                    }
                  })
                  this.Eventlevel = item.data.data
                })
                .catch(error => {
                  console.log(error)
                  this.fullscreenLoading = false
                })
              this.$message.success('保存成功')
              this.caseHazardlist = []
              this.submitDeptNameLists.resUserName = ""
              this.TypeOfResponsibility.resType = ""
              this.num2 = 1
              this.responsibility = false
            })
            .catch(error => {
              console.log(error)
              this.fullscreenLoading = false
              this.$message.error('网咯超时请检查网咯')
            })
        }
      }
      if (this.modliyTypeOfResponsibility === 1) {
        axios.post('/api/qar/case/updateQarCaseResponsibility', this.TypeOfResponsibility)
          .then(res => {
            if (res.data.error === 0) {
              this.$message.success('修改成功')
              axios.get('/api/qar/case/listQarCaseResponsibilityDO?' + 'caseid=' + this.caseId)
                .then(item => {
                  if (item.data.data.length === 0) {
                    this.sibility = false
                  } else {
                    this.sibility = true
                  }
                  this.EventFormResponsibility = item.data.data
                })
              this.responsibility = false
            }
          })
      }
    },
    dialogFormVisibleRejects (form) {
      this.dialogFormVisibleReject = false
      this.$refs[form].resetFields()
    },
    clickitem (e) {
      e === this.startRisk ? this.startRisk = e : this.startRisk = e
      if (e === 'true') {
        this.cation = false
      } else if (e === 'false') {
        this.cation = true
      }
    },
    riskpreservation () {
      if (this.eventDOS.startSafetyNotice === '') {
        this.$message.error('请先选择下发整改')
      } else if (this.eventDOS.startRisk === '') {
        this.$message.error('请选择风险管理')
      } else {
        let qarDo = this.eventDOS
        axios.post('/api/qar/event/updateQar', qarDo)
          .then(item => {
            if (item.data.error === 0) {
              this.$message.success('保存成功')
              this.update = 1
            } else {
              this.$message.error('请重试' + item.data.message)
            }
          })
      }
    },
    Newviewss (id, index, params) {
      if (id === 1) {
        this.Newviewssid = id
        this.teventqarannoucement.improveType = ''
      }
      if (id === 2) {
        this.Newviewssid = id
        this.submitDeptNameLists.resDeptName = params.deptName
        this.teventqarannoucement.deptName = params.deptName
        this.teventqarannoucement.deptId = params.deptId
        if (params.improveType === '整改项') {
          this.teventqarannoucement.improveType = 'true'
        } else if (params.improveType === '建议项') {
          this.teventqarannoucement.improveType = 'false'
        }
        this.teventqarannoucement.id = params.id
        this.teventqarannoucement.improveContent = params.improveContent
      }
      this.Newviews = true
    },
    removeeventDOS (index, params) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/api/qar/event/deleteQarAnnoucement?' + 'id=' + params.id)
          .then(res => {
            if (res.data.error === 0) {
              axios.get('/api/qar/event/selectQarAnnoucement?' + 'qarNumber=' + this.$route.params.id)
                .then(item => {
                  if (item.data.error === 0) {
                    item.data.data.map(result => {
                      if (result.improveType === 'true') {
                        result.improveType = '整改项'
                      } else if (result.improveType === 'false') {
                        result.improveType = '建议项'
                      }
                    })
                    this.transformRequest = item.data.data
                  }
                })
            }
          })
      }).catch(() => {
      })
    },
    postlists () {
      if (this.startRisk === 'true') {
        if (this.transformRequest.length === 0) {
          this.$message.error('请填写整改意见')
        } else {
          if (this.eventDOS.startSafetyNotice === '') {
        this.$message.error('请先选择下发整改')
      } else if (this.eventDOS.startRisk === '') {
        this.$message.error('请先选择风险管理')
      } else if (this.update === 0) {
        this.$message.error('请先保存')
      } else {
        this.$confirm('是否进行下一步', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let eventid = parseInt(this.$route.params.id)
          let taskId = this.$route.params.taskId
          let qarVo = {
            qarAuditDO: {
              reportNumber: eventid,
              auditComment: this.form.auditComment,
              auditUserName: this.$store.state.user.userName
            },
            result: 1,
            taskInfo: {
              taskId: taskId,
              taskName: this.namelist,
              procInstId: this.procInstId
            }
          }
          this.fullscreenLoading = true
          axios.post('/api/qar/complete', qarVo)
            .then(res => {
              this.fullscreenLoading = false
              this.$message.success('发送成功')
              this.$router.back(-1)
            })
            .catch(error => {
              console.log(error)
              this.fullscreenLoading = false
              this.$message.error('网咯超时请检查网咯')
            })
        })
      }
        }
      } else if (this.startRisk === 'false'){
        if (this.eventDOS.startSafetyNotice === '') {
        this.$message.error('请先选择下发整改')
      } else if (this.eventDOS.startRisk === '') {
        this.$message.error('请先选择风险管理')
      } else if (this.update === 0) {
        this.$message.error('请先保存')
      } else {
        this.$confirm('是否进行下一步', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let eventid = parseInt(this.$route.params.id)
          let taskId = this.$route.params.taskId
          let qarVo = {
            qarAuditDO: {
              reportNumber: eventid,
              auditComment: this.form.auditComment,
              auditUserName: this.$store.state.user.userName
            },
            result: 1,
            taskInfo: {
              taskId: taskId,
              taskName: this.namelist,
              procInstId: this.procInstId
            }
          }
          this.fullscreenLoading = true
          axios.post('/api/qar/complete', qarVo)
            .then(res => {
              this.fullscreenLoading = false
              this.$message.success('发送成功')
              this.$router.back(-1)
            })
            .catch(error => {
              console.log(error)
              this.fullscreenLoading = false
              this.$message.error('网咯超时请检查网咯')
            })
        })
      }
      }
    },
    evevtsubmits (name) {
      if (this.submitDeptNameListsresDeptName.length === 1) {
        this.submitDeptNameListsresDeptName = []
      } else {
        let len = getCascaderOb(this.submitDeptNameListsresDeptName, this.deptNameList).length
        let id = getCascaderOb(this.submitDeptNameListsresDeptName, this.deptNameList)[len - 1].deptCode
        this.teventqarannoucement.deptId = id
        //this.teventqarannoucement.deptName = this.submitDeptNameLists.resDeptName.deptName
        this.teventqarannoucement.deptName = name[name.length-1]
        this.submitDeptNameLists.resDeptName = name[name.length-1]
      }
      
    },
    CloseNewviews () {
      this.submitDeptNameLists.resDeptName = ''
      this.teventqarannoucement.improveType = ''
      this.teventqarannoucement.improveContent = ''
      this.Newviews = false
    },
    teventsendout () {
      if (this.startRisk === 'true' && this.Newviewssid === 1) {
        if (this.submitDeptNameLists.resDeptName === '') {
          this.$message.error('请先选择责任单位')
        } else if (this.teventqarannoucement.improveType === '') {
          this.$message.error('请先选择正改项')
        } else if (this.teventqarannoucement.improveContent === '') {
          this.$message.error('请先填写建议要求')
        } else {
          axios.post('/api/qar/event/addQarAnnoucement', this.teventqarannoucement)
            .then(res => {
              if (res.data.error === 0) {
                axios.get('/api/qar/event/selectQarAnnoucement?' + 'qarNumber=' + this.$route.params.id)
                  .then(item => {
                    if (item.data.error === 0) {
                      item.data.data.map(result => {
                        if (result.improveType === 'true') {
                          result.improveType = '整改项'
                        } else if (result.improveType === 'false') {
                          result.improveType = '建议项'
                        }
                      })
                      this.transformRequest = item.data.data
                    }
                  })
                this.$message.success('保存成功')
                this.Newviews = false
                this.submitDeptNameListsresDeptName = []
                this.teventqarannoucement.improveContent = ''
                this.submitDeptNameLists.resDeptName = ''
              } else {
                this.$message.error('保存失败' + res.data.message)
              }
            })
        }
      } else if (this.startRisk === 'false') {
        if (this.Newviewssid === 1) {
          if (this.submitDeptNameLists.resDeptName === '') {
            this.$message.error('请先选择责任单位')
          } else if (this.teventqarannoucement.improveContent === '') {
            this.$message.error('请先填写建议要求')
          } else {
            axios.post('/api/qar/event/addQarAnnoucement', this.teventqarannoucement)
              .then(res => {
                if (res.data.error === 0) {
                  axios.get('/api/qar/event/selectQarAnnoucement?' + 'qarNumber=' + this.$route.params.id)
                    .then(item => {
                      if (item.data.error === 0) {
                        item.data.data.map(result => {
                          if (result.improveType === 'true') {
                            result.improveType = '整改项'
                          } else if (result.improveType === 'false') {
                            result.improveType = '建议项'
                          }
                        })
                        this.transformRequest = item.data.data
                      }
                    })
                  this.$message.success('保存成功')
                  this.Newviews = false
                } else {
                  this.$message.error('保存失败' + res.data.message)
                }
              })
          }
        }
      }
      //  修改
      if (this.Newviewssid === 2) {
        if (this.submitDeptNameLists.resDeptName === '') {
          this.$message.error('请先选择责任单位')
        } else if (this.teventqarannoucement.improveContent === '') {
          this.$message.error('请先填写建议要求')
        } else {
          axios.post('/api/qar/event/updateQarAnnoucement', this.teventqarannoucement)
            .then(res => {
              if (res.data.error === 0) {
                axios.get('/api/qar/event/selectQarAnnoucement?' + 'qarNumber=' + this.$route.params.id)
                  .then(item => {
                    if (item.data.error === 0) {
                      item.data.data.map(result => {
                        if (result.improveType === 'true') {
                          result.improveType = '整改项'
                        } else if (result.improveType === 'false') {
                          result.improveType = '建议项'
                        }
                      })
                      this.transformRequest = item.data.data
                    }
                  })
                this.$message.success('修改成功')
                this.Newviews = false
              } else {
                this.$message.error('修改失败' + res.data.message)
              }
            })
        }
      }
    },
    fou () {
      this.prescription = false
      this.newaddedlist.reportDependent = ''
    },
    yes () {
      this.prescription = true
    },
    tiggleAclisst () {
      if (this.$refs.upDownlist.className === 'icon-arrow-down') {
        this.$refs.upDownlist.className = 'icon-arrow-up'
      } else {
        this.$refs.upDownlist.className = 'icon-arrow-down'
      }
    },
    tiggleAclissts () {
      if (this.$refs.upDownlists.className === 'icon-arrow-down') {
        this.$refs.upDownlists.className = 'icon-arrow-up'
      } else {
        this.$refs.upDownlists.className = 'icon-arrow-down'
      }
    }
  },
  computed: {
    ALL_SELECT_DATA () {
      return this.$store.state.ALL_SELECT_DATA
    }
  },
  mounted () {
    this.$watch('dialogFormVisibles', () => {
      if (this.dialogFormVisibles === false) {
        this.userName1 = []
        this.userName2 = []
        this.newadded.qarPlanVo = []
      }
    },{
      deep: true
    })
    this.$watch('getreason', () => {
      if(this.getreason.length === 0) {
        this.yesno = false
        this.num1 = 0
      } else {
        this.yesno = true
        this.num1 = 1
      }
    },{
      deep: true
    })
    this.$watch('EventFormResponsibility', () => {
      if(this.EventFormResponsibility.length === 0) {
        this.num2 = 0
      } else {
        this.num2 = 1
      }
    },{
      deep: true
    })
  }
}
</script>
