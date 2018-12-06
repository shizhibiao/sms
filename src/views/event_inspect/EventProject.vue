<template>
<div class="animated fadeIn">
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
                      <el-form-item label="事件来源">
                      {{sourecelist(eventDO.source)}}
                      </el-form-item>
                    </div>
                   <div class="col-lg-4 col-md-6 col-sm-12">
                      <el-form-item label="报告人">
                        {{eventDO.reporterName}}
                      </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                      <el-form-item label="报告时间">
                        {{eventDO.createDate}}
                      </el-form-item>
                    </div>
                 <div class="col-lg-4 col-md-6 col-sm-12">
                      <el-form-item label="所在部门">
                        {{eventDO.repDeptName}}
                      </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="联系电话">
                      {{eventDO.phone}}
                      </el-form-item>
                    </div>
                    <div class="col-lg-4 col-md-6 col-sm-12">
                      <el-form-item label="发生时间">
                      {{eventDO.occurDate}}
                      </el-form-item>
                    </div>
                 
                  <div class="col-lg-4 col-md-6 col-sm-12">
                      <el-form-item label="发生地点">
                        {{eventDO.occurAddress}}
                      </el-form-item>
                    </div>
                   <div class="col-lg-4 col-md-6 col-sm-12" v-if="cate">
                    <el-form-item label="报告类型">
                        {{projectLevelFilter(eventDO.category)}}
                      </el-form-item>
                    </div>
                   <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="是否QAR分析">
                        {{eventDO.qarNeeded}}
                      </el-form-item>
                    </div>
                <div class="col-lg-12 col-md-6=12 col-sm-12">
                    <el-form-item label="标题">
                      {{eventDO.title}}
                    </el-form-item>
                </div>
          </div>
                  
          </b-card-body>
        </b-collapse>
          </b-card>
            <b-card no-body>
              <div slot="header">
                  专业类型：{{eventDO.majorType}}
                  <div class="card-actions">
                    <b-btn class="btn btn-minimize" @click="tiggleAction" v-b-toggle.collapse1>
                      <i class="icon-arrow-down" ref="upDown"></i>
                    </b-btn>
                  </div>
              </div>
             <b-collapse id="collapse1" visible>
              <Eventlistquery v-if="1 == radio2" ref="eventlist" :byData="groundList"/>
              <Eventground v-if="2 == radio2" ref="groundlists" :byData="groundList"/>
              <Eventsecurity v-if="3 == radio2" ref="curity" :byData="groundList"/>
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
                      prop="submitDate"
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
              <b-card-body >
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
                          <EventForm1 :postDta="getreason"/>
                        </div>
                     </el-card>
                        <div style="padding:10px 0"></div>
                       <el-card no-body v-if="sibility">
                         <b-card-header>责任划分</b-card-header>
                        <div>
                          <EventFormResponsibility1 :postDta="EventFormResponsibility"/>
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
               <!-- 立项审核 -->
            <b-card-header>{{examinename}} </b-card-header>
            <b-card-body v-if="status === 0 ">
                <el-table
                    :data="aproject"
                       >
                    <el-table-column
                    prop="submitDate"
                    label="审核时间"
                     >
                    </el-table-column>
                    <el-table-column
                    prop="auditUserName"
                    label="审核人"
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
                <el-steps :active="1" align-center style="margin-top:40px" v-if="sou === 0">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description="安技部-部门管理团队"></el-step>
                  <el-step title="调查方案" description="安技部-安全管理经理"></el-step>
                  <el-step title="调查情况" description="安技部-安全监察组"></el-step>
                  <el-step title="验证核准" description="安技部-安全管理经理"></el-step>
                  <el-step title="处理改进" description="安技部-部门管理团队"></el-step>
                  <el-step title="结束"></el-step>
                </el-steps>
                <el-steps :active="1" align-center style="margin-top:40px" v-if="sou === 1">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description="部门管理团队（非安技部）"></el-step>
                  <el-step title="调查方案" description="SMS对接经理"></el-step>
                  <el-step title="调查情况" description="SMS对接成员"></el-step>
                  <el-step title="验证核准" description="SMS对接经理"></el-step>
                  <el-step title="处理改进" description="部门管理团队（非安技部）"></el-step>
                  <el-step title="结束"></el-step>
                </el-steps>
                <div class="text-center" style="padding-top:30px">
                  <el-button type="primary" size='small' v-if="visible === 0" @click="proces(0)">发送</el-button>
                  <el-button size='small'  v-if="visible === 0" @click="gobacklist">返回</el-button>
                  
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
                   <el-steps :active="2" align-center style="margin-top:40px" v-if="sou === 0">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description="安技部-部门管理团队"></el-step>
                  <el-step title="调查方案" description="安技部-安全管理经理"></el-step>
                  <el-step title="调查情况" description="安技部-安全监察组"></el-step>
                  <el-step title="验证核准" description="安技部-安全管理经理"></el-step>
                  <el-step title="处理改进" description="安技部-部门管理团队"></el-step>
                  <el-step title="结束"></el-step>
                </el-steps>
                <el-steps :active="2" align-center style="margin-top:40px" v-if="sou === 1">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description="部门管理团队（非安技部）"></el-step>
                  <el-step title="调查方案" description="SMS对接经理"></el-step>
                  <el-step title="调查情况" description="SMS对接成员"></el-step>
                  <el-step title="验证核准" description="SMS对接经理"></el-step>
                  <el-step title="处理改进" description="部门管理团队（非安技部）"></el-step>
                  <el-step title="结束"></el-step>
                </el-steps>
                  <div class="text-center" style="padding-top:30px">
                     <el-button v-if="isshow" type="primary" size='small' @click="dialogFormVisibleslist(0)">新增</el-button>
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
                   <el-steps :active="3" align-center style="margin-top:40px" v-if="sou === 0">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description="安技部-部门管理团队"></el-step>
                  <el-step title="调查方案" description="安技部-安全管理经理"></el-step>
                  <el-step title="调查情况" description="安技部-安全监察组"></el-step>
                  <el-step title="验证核准" description="安技部-安全管理经理"></el-step>
                  <el-step title="处理改进" description="安技部-部门管理团队"></el-step>
                  <el-step title="结束"></el-step>
                </el-steps>
                <el-steps :active="3" align-center style="margin-top:40px" v-if="sou === 1">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description="部门管理团队（非安技部）"></el-step>
                  <el-step title="调查方案" description="SMS对接经理"></el-step>
                  <el-step title="调查情况" description="SMS对接成员"></el-step>
                  <el-step title="验证核准" description="SMS对接经理"></el-step>
                  <el-step title="处理改进" description="部门管理团队（非安技部）"></el-step>
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
                          <EventForm1 :postDta="getreason"/>
                        </div>
                     </el-card>
                        <div style="padding:10px 0"></div>
                       <el-card no-body v-if="sibility">
                         <b-card-header>责任划分</b-card-header>
                        <div>
                          <EventFormResponsibility1 :postDta="EventFormResponsibility"/>
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
                   <el-steps :active="4" align-center style="margin-top:40px" v-if="sou === 0">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description="安技部-部门管理团队"></el-step>
                  <el-step title="调查方案" description="安技部-安全管理经理"></el-step>
                  <el-step title="调查情况" description="安技部-安全监察组"></el-step>
                  <el-step title="验证核准" description="安技部-安全管理经理"></el-step>
                  <el-step title="处理改进" description="安技部-部门管理团队"></el-step>
                  <el-step title="结束"></el-step>
                </el-steps>
                <el-steps :active="4" align-center style="margin-top:40px" v-if="sou === 1">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description="部门管理团队（非安技部）"></el-step>
                  <el-step title="调查方案" description="SMS对接经理"></el-step>
                  <el-step title="调查情况" description="SMS对接成员"></el-step>
                  <el-step title="验证核准" description="SMS对接经理"></el-step>
                  <el-step title="处理改进" description="部门管理团队（非安技部）"></el-step>
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
                          <EventForm1  :postDta="getreason"/>
                        </div>
                     </el-card>
                        <div style="padding:10px 0"></div>
                       <el-card no-body v-if="sibility">
                         <b-card-header>责任划分</b-card-header>
                        <div>
                          <EventFormResponsibility1 :postDta="EventFormResponsibility"/>
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
                        <el-button size='small' type="primary"  :disabled="cation" @click="Newviewss(1)">整改建议新增</el-button>
                    </div>
                  </div>
                        
                  <div class="row" v-if="startRisk === 'true'">
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
                   <el-steps :active="5" align-center style="margin-top:40px" v-if="sou === 0">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description="安技部-部门管理团队"></el-step>
                  <el-step title="调查方案" description="安技部-安全管理经理"></el-step>
                  <el-step title="调查情况" description="安技部-安全监察组"></el-step>
                  <el-step title="验证核准" description="安技部-安全管理经理"></el-step>
                  <el-step title="处理改进" description="安技部-部门管理团队"></el-step>
                  <el-step title="结束"></el-step>
                </el-steps>
                <el-steps :active="5" align-center style="margin-top:40px" v-if="sou === 1">
                  <el-step title="新建"></el-step>
                  <el-step title="立项核准" description="部门管理团队（非安技部）"></el-step>
                  <el-step title="调查方案" description="SMS对接经理"></el-step>
                  <el-step title="调查情况" description="SMS对接成员"></el-step>
                  <el-step title="验证核准" description="SMS对接经理"></el-step>
                  <el-step title="处理改进" description="部门管理团队（非安技部）"></el-step>
                  <el-step title="结束"></el-step>
                </el-steps>
                  <div class="text-center" style="padding-top:30px">
                    <el-button size='small' type="primary" @click="riskpreservation">保 存</el-button>
                    <el-button @click="postlists" v-loading.fullscreen.lock="fullscreenLoading" size='small'  type="success">发 送</el-button>
                  </div>
                
            </b-card-body>
        </b-card>
        <!-- 调查新增的弹框 -->
         <el-dialog title="调查新增" :visible.sync="dialogFormVisibleadd">
            <el-form :model="newaddedlist"  ref="newaddedlist">
                <div class="row">
                    <div class="col">
                        <el-form-item label="事件性质" :label-width="formLabelWidth" :rules="[{ required: true, message: '请选择事件性质'}]" prop="caseNature">
                            <el-select v-model="newaddedlist.caseNature" style="width:100%" >
                            <el-option v-for="(item, index) in REASON_CHARACTER"
                            :key="index" :label="item.dictName" :value='item.dictName'></el-option>
                          </el-select>
                        </el-form-item>
                    </div>
                    <div class="col">
                        <el-form-item label="事件等级细分" :label-width="formLabelWidth" :rules="[{ required: true, message: '请选择事件等级细分'}]" prop="caseLevelDetail">
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
                      <el-radio v-model="newaddedlist.reportToUp" @change="yes" label='true'>是</el-radio>
                      <el-radio v-model="newaddedlist.reportToUp" @change="fou" label='false'>否</el-radio>
                    </el-form-item>
                  </div>
                  <div class="col">
                     <el-form-item v-if="prescription" label="依据选择" :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]"  prop="reportDependent">
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
                  <el-form-item label="责任单位" :label-width="formLabelWidth" :rules="[{ required: true, message: '不能为空'}]">
                
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
                  <el-form-item label="责任人" :label-width="formLabelWidth" :rules="[{ required: true, message: '请选择责任人'}]">
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
            <!-- 审核的弹框 -->
        <el-dialog title="审核" :visible.sync="dialogFormVisible">
          <el-form :model="form"  ref="form">
            <el-form-item label="意见" :label-width="formLabelWidth" :rules="[{ required: true, message: '审核意见不能为空'}]" prop="auditComment">
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
            <el-button size='mini' @click="Return('form')">返 回</el-button>
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
              </el-form-item>
              </div>
              <div class="col">
                  <el-form-item label="调查组组长" :label-width="formLabelWidth">
                    <el-select v-model="userName1" multiple style="width:100%" value-key='id' @change="toid">
                      <el-option v-for="(item,index) in statuss"
                        :key="index"
                        :label="item.name"
                        :value="item"></el-option>
                    </el-select>
                  </el-form-item>
              </div>
            </div>
            <div class="row">
                <div class="col">
                    <el-form-item label="调查组组员" :label-width="formLabelWidth">
                    <el-select v-model="userName2" multiple style="width:100%"  value-key='id'>
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
         <!-- 建议整改新增的弹框 -->
        <el-dialog title="添加意见" :visible.sync="Newviews">
          <el-form :model="teventqarannoucement"  ref="teventqarannoucement">
            <div class="row">
              <div class="col">
                  <el-form-item label="责任单位" :label-width="formLabelWidth">
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
             <el-form-item label="整改/建议要求" :label-width="formLabelWidth" :rules="[{ required: true, message: '审核意见不能为空'}]" prop="improveContent">
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
</div>
</template>
<script>
import axios from 'axios'
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
import Eventlistquery from '../common/eventlistquery'
import Eventground from '../common/eventground'
import Eventsecurity from '../common/eventsecurity'
import EventForm from './EeventForm'
import EventFormResponsibility from './EventFormResponsibility'
import EventForm1 from './EeventForm1'
import EventFormResponsibility1 from './EventFormResponsibility1'
//  下拉框
import { getAllDataAction } from '../../services/information_report'
//  获取部门
import { conditionGetDepartmentList } from '../../services/safety_supervision'
import { sourceDataFilter } from '../../tools'
import {
  getscrik, //  危险源关联的接口
  getCascaderOb, //  过滤器
  getInvestigation, //  新增的接口
  getEventlevel, //  事件等级单个接口
  geteventdata, //  调查情况新增页面
  getCause, //  原因分类
  getReason,
  getEventReason, //  原因分类页面数据请求
  grtclassa, //  一级原因
  getspecific, //  具体原因
  getResponsibility, //  责任单位
  getCaseResponsibilityDO, //  责任单位字表展示
  getmanagement, //  处理改进中的更新
  getqueries //  处理改进的查询接口
} from '../../services/event_query'
import { getDepartmentList } from '../../services/event_query'
export default {
  components: {
    SecurityNoticeAdjunct,
    Eventlistquery,
    Eventground,
    Eventsecurity,
    EventForm,
    EventFormResponsibility,
    EventForm1,
    EventFormResponsibility1
  },
  created () {
    getDepartmentList().then(result => {
      this.deptNameList = result
    })
    this.safetyId = this.$route.params.id
    this.newadded.planUserName = this.$store.state.user.userName
    this.newadded.planUser = this.$store.state.user.userId
    //  获取部门
    conditionGetDepartmentList(1).then(result => {
      result.map(item => {
        this.submitDeptNameList.push(item)
      })
    })
    getAllDataAction().then(result => {
      this.groundList = result
    })
    this.userId = this.$store.state.user.userId
    this.userName = this.$store.state.user.userName
    this.eventid = this.$route.params.id
    this.eventDOS.userId = this.$store.state.user.userId
    this.eventDOS.name = this.$store.state.user.userName
    this.eventDOS.deptId = this.$store.state.user.deptId
    this.eventDOS.deptName = this.$store.state.user.deptName
    axios.get('/api/attach/list_all?' + 'tableName=' + 't_event&' + 'sourceNumber=' + this.$route.params.id)
      .then(res => {
        if (res.data.error === 0) {
        }
      })
    this.taskId = this.$route.params.taskId
    //  事件新增复制
    this.newaddedlist.eventNumber = this.eventid
    this.newaddedlist.caseUser = this.userId
    this.newaddedlist.caseUserName = this.userName
    //  建议意见新增
    this.eventDOS.eventNumber = this.$route.params.id
    //  处理保存
    this.teventqarannoucement.eventNumber = this.$route.params.id
    //  调查方案查询
    axios.get('/api/incdent/plan/listEventQarPlanDO?' + 'eventNumber=' + this.eventid)
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
    axios.get('/api/incdent/event/listeventNumbler?' + 'eventNumber=' + this.eventid)
      .then(res => {
        let data = res.data.data
        if (data.repDeptName.substring(0,2) === '安全') {
          this.sou = 0
        } else {
          this.sou = 1
        }
        console.log(data.repDeptName.substring(0,2))
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
        this.procInstId = res.data.data.procInstId
        this.eventNumber = data.eventNumber
        this.newadded.eventNumber = data.eventNumber
        this.status = data.status
        if (data.status === 0) {
          this.examinename = '立项核准'
          this.namelist = '立项核准'
          this.bntshow = false
        }
        axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'EVENT_SOURCE')
          .then(res => {
            if (res.data.error === 0) {

              this.source = res.data.data
            }
          })
        this.eventDO.source = data.source
        if (data.majorType === 1) {
          this.radio2 = 1
          this.eventDO.majorType = '飞行'
          axios.get('/api/common/fly/listReportFlyDO' + '?reportNumber' + '=' + this.eventNumber)
            .then(res => {
              let data1 = res.data.data[0]
              this.$refs.eventlist.common = 'false'
              this.$refs.eventlist.num = 0
              this.$refs.eventlist.operation.flightDate = data1.flightDate
              this.$refs.eventlist.operation.flightNo = data1.flightNo
              this.$refs.eventlist.operation.airNumber = data1.airNumber
              this.$refs.eventlist.operation.acType = data1.acType
              this.$refs.eventlist.operation.flightLeg = data1.flightLeg
              this.$refs.eventlist.operation.flightCrew = data1.flightCrew
              this.$refs.eventlist.operation.flightName = data1.flightName
              this.$refs.eventlist.operation.flightPhase = data1.flightPhase
              this.$refs.eventlist.operation.lightCondition = data1.lightCondition
              this.$refs.eventlist.operation.weatherCondition = data1.weatherCondition
              this.$refs.eventlist.operation.eventType = data1.eventType
              this.$refs.eventlist.operation.causeType = data1.causeType
              this.$refs.eventlist.operation.eventGrade = data1.eventGrade
              this.$refs.eventlist.operation.aircraftDamage = data1.aircraftDamage
              this.$refs.eventlist.operation.flightDelay = data1.flightDelay
              this.$refs.eventlist.operation.eventDescription = data1.eventDescription
            })
        } else if (data.majorType === 2) {
          this.radio2 = 2
          this.eventDO.majorType = '地面'
          axios.get('/api/common/fly/listReportGound' + '?reportNumber' + '=' + this.eventNumber)
            .then(res => {
              let data1 = res.data.data[0]
              this.$refs.groundlists.common = 'false'
              this.$refs.groundlists.num = 0
              this.$refs.groundlists.operation.deviceName = data1.deviceName
              this.$refs.groundlists.operation.causeType = data1.causeType
              this.$refs.groundlists.operation.deviceCompany = data1.deviceCompany
              this.$refs.groundlists.operation.eventGrade = data1.eventGrade
              this.$refs.groundlists.operation.flightDelay = data1.flightDelay
              this.$refs.groundlists.operation.eventType = data1.eventType
              this.$refs.groundlists.operation.aircraftDamage = data1.aircraftDamage
              this.$refs.groundlists.operation.eventDescription = data1.eventDescription
              this.$refs.groundlists.operation.acType1 = data1.acType1
              this.$refs.groundlists.operation.acNo1 = data1.acNo1
              this.$refs.groundlists.operation.acCompany1 = data1.acCompany1
              this.$refs.groundlists.operation.acType2 = data1.acType2
              this.$refs.groundlists.operation.acNo2 = data1.acNo2
              this.$refs.groundlists.operation.acCompany2 = data1.acCompany2
              this.$refs.groundlists.operation.runPhase1 = data1.runPhase1
              this.$refs.groundlists.operation.runPhase2 = data1.runPhase2
              this.$refs.groundlists.operation.carType1 = data1.carType1
              this.$refs.groundlists.operation.carType2 = data1.carType2
              this.$refs.groundlists.operation.carCompany1 = data1.carCompany1
              this.$refs.groundlists.operation.carCompany2 = data1.carCompany2
              if (data1.relAircraft === true) {
                this.$refs.groundlists.relAircrafts = 'false'
              } else if (data1.relAircraft === false) {
                this.$refs.groundlists.display = 0
                this.$refs.groundlists.operation.relAircraft = 'false'
              }
              if (data1.relCar === true) {
                this.$refs.groundlists.relCar = 'false'
              } else if (data1.relCar === false) {
                this.$refs.groundlists.dispaly2 = 0
                this.$refs.groundlists.operation.relCar = 'false'
              }
              if (data1.relGroundDevice === true) {
                this.$refs.groundlists.relGroundDevices = 'false'
              } else if (data1.relGroundDevice === false) {
                this.$refs.groundlists.dispaly1 = 0
                this.$refs.groundlists.operation.relGroundDevice = 'false'
              }
              if (data1.acCompany2 === 'null') {
                this.$refs.groundlists.operation.acCompany2 = ''
              }
              if (data1.carCompany2 === 'null') {
                this.$refs.groundlists.operation.carCompany2 = ''
              }
            })
        } else if (data.majorType === 3) {
          this.radio2 = 3
          this.eventDO.majorType = '安保'
          axios.get('/api/common/fly/listReportSecurity' + '?reportNumber' + '=' + this.eventNumber)
            .then(res => {
              let data = res.data.data[0]
              if (data.relAircraft === true) {
                this.$refs.curity.relAircrafts = 'false'
              } else if (data.relAircraft === false) {
                this.$refs.curity.dispaly = 0
                this.$refs.curity.operation.relAircraft = 'false'
              }
              this.$refs.curity.common = 'false'
              this.$refs.curity.num = 0
              this.$refs.curity.operation.flightDate = data.flightDate
              this.$refs.curity.operation.flightCrew = data.flightCrew
              this.$refs.curity.operation.flightLeg = data.flightLeg
              this.$refs.curity.operation.secEventType1 = data.secEventType1
              this.$refs.curity.operation.secEventType2 = data.secEventType2
              this.$refs.curity.operation.airNumber = data.airNumber
              this.$refs.curity.operation.secEventCategory = data.secEventCategory
              this.$refs.curity.operation.acType = data.acType
              this.$refs.curity.operation.eventGrade = data.eventGrade
              this.$refs.curity.operation.flightDelay = data.flightDelay
              this.$refs.curity.operation.aircraftDamage = data.aircraftDamage
              this.$refs.curity.operation.eventDescription = data.eventDescription
            })
        }
        if (res.data.error === 0) {
          this.eventDO.source = data.source
          this.eventDO.reporterName = data.reporterName
          this.eventDO.createDate = data.createDate
          this.eventDO.repDeptName = data.repDeptName
          this.eventDO.phone = data.phone
          this.eventDO.occurDate = data.occurDate
          this.eventDO.occurAddress = data.occurAddress
          this.eventDOS.title = data.title
          this.eventDO.category = data.category
          if (data.category === null) {
            this.cate = false
          } else if (data.category === '1') {
            this.cate = true
          }
          if (data.qarNeeded === true) {
            this.official = 'true'
            this.eventDO.qarNeeded = '是'
          } else if (data.qarNeeded === false) {
            this.eventDO.qarNeeded = '否'
            this.official = 'false'
          }
          this.eventDO.title = data.title
        }
        if (data.status === 1) {
          this.examinename = '调查方案'
          this.namelist = '调查方案'
        }
        if (data.status === 2) {
          this.namelist = '调查情况'
          this.examinename = '调查情况'
          //  事件性质下拉框的接口
          axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'REASON_CHARACTER')
            .then(res => {
              if (res.data.error === 0) {
                this.REASON_CHARACTER = res.data.data
              }
            })
            //  事件等级细分的接口
          axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'EVENT_LEVEL_DETAIL')
            .then(res => {
              if (res.data.error === 0) {
                this.EVENT_LEVEL_DETAIL = res.data.data
              }
            })
            //  依据的接口
          axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'EVENT_LEVEL_DETAILA')
            .then(res => {
              if (res.data.error === 0) {
                this.EVENT_LEVEL_DETAILA = res.data.data
              }
            })
            //  依据选择
          axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'EVENT_LEVEL_JF')
            .then(res => {
              if (res.data.error === 0) {
                this.EVENT_LEVEL_JF = res.data.data
              }
            })
            //  危险关联
          getscrik().then(item => {
            this.optionslist = item
          })
          //  事件等级
          getEventlevel().then(item => {
            this.EVENT_LEVEL = item.data.data
          })
          //  原因性质
          getCause().then(item => {
            this.REASON_DUTY = item.data.data
          })
          //  一级原因
          grtclassa().then(item => {
            this.resonId1 = item
          })
          //  单个责任类型
          axios.get('/api/system/dictionary/by_type?' + 'dictType=' + 'DUTY_TYPE')
            .then(res => {
              if (res.data.error === 0) {
                this.DUTY_TYPE = res.data.data
              }
            })
          getResponsibility().then(item => {
            if (item.data.error === 0) {
              this.Responsibilityunit = item.data.data
            }
          })
        }
        if (data.status === 3) {
          this.examinename = '验证核准'
          this.namelist = '验证核准'
        }
        if (data.status === 4) {
          this.examinename = '处理改进'
          this.namelist = '处理改进'
          getResponsibility().then(item => {
            if (item.data.error === 0) {
              this.Responsibilityunit = item.data.data
            }
          })
          //  处理
          getqueries(data.eventNumber).then(item => {
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
        //  调查情况页面
        geteventdata(data.eventNumber).then(item => {
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
            getEventReason(item.data.data[0].caseId).then(item => {
            if (item.data.data.length === 0) {
              this.eventsui = false
            } else {
              this.eventsui = true
              this.yesno = true
            } 
            
            this.getreason = item.data.data
          })
          //  责任划分
            getCaseResponsibilityDO(item.data.data[0].caseId).then(item => {
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
      })
      //  立即审核查询
    axios.get('/api/incdent/Audit/listEventAuditDO?' + 'eventNumber=' + this.eventid)
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
            if (item.auditResult === 0) {
              item.auditResult = '驳回'
            } else if (item.auditResult === 1) {
              item.auditResult = '通过'
            }
            return item
          })
          this.aproject = Data
        }
      })
    //  立即审核最新唯一数据查询
    axios.get('/api/incdent/Audit/findEventAuditDO?' + 'eventNumber=' + this.eventid)
      .then(res => {
        if (res.data.error === 0) {
          this.auditResult = res.data.data.auditResult
        }
      })
  },
  data () {
    return {
      sou: 0,
      yesno: true,
      num1: 0,
      num2: 0,
      getRowKeys(row) {
        return row.caseId;
      },
      namelist: '',
      procInstId: '',
      expands: [],
      caseHazardlist: [],
      submitDeptNameListsresDeptName: [],
      deptNameList: [],
      uploadFile: true,
      tableName: 't_event',
      cation: true,
      source: 0,
      fullscreenLoading: false,
      prescription: true,
      cate: true,
      caseId: 0,
      examinename: '',
      eventNumber: 0,
      status: 0,
      eventid: 0,
      taskId: 0,
      userId: 0,
      radio2: 0,
      auditResult: 0,
      display: 0,
      showslist: 'true',
      showslists: 'true',
      list: false,
      showname: '显示审核记录',
      visible: 0,
      bntshow: true,
      //  是否报告局方的判断显示
      official: 'true',
      //  立项审核
      aproject: [],
      //  审核页面新增
      Eventlevel: [],
      //  调查新增
      programme: [],
      userName: '',
      //  获取部门
      submitDeptNameList: [],
      //  组长和组员
      statuss: [],
      //  事件性质
      REASON_CHARACTER: [],
      //  事件等级细分
      EVENT_LEVEL_DETAIL: [],
      //  依据
      EVENT_LEVEL_DETAILA: [],
      //  依据选择
      EVENT_LEVEL_JF: [],
      //  危险关联
      optionslist: [],
      //  危险源
      DANGER: [],
      //  事件等级
      EVENT_LEVEL: [],
      //  原因性质
      REASON_DUTY: [],
      //  责任类型
      DUTY_TYPE: [],
      //  责任单位
      Responsibilityunit: [],
      //  责任人
      Personliable: [],
      //  处理改进新增
      transformRequest: [],
      //  基本信息
      eventDO: {
        //  报告人ID
        reporter: 0,
        //  报告人名字
        reporterName: '',
        //  报告部门的id
        repDept: 0,
        //  所在部门
        repDeptName: '',
        //  报告日期
        createDate: '',
        //  手机号码
        phone: '',
        //  发生日期
        occurDate: '',
        //  标题
        title: '',
        //  发生地点
        occurAddress: '',
        //  是否开启QAR分析0-否 1-是
        qarNeeded: 'true',
        //  专业类型 1-飞行 2-地面 3-安保
        majorType: 0,
        //  报告类别
        category: null,
        //  事件类别
        source: null
      },
      eventDOS: {
        //  是否下发整改
        startSafetyNotice: '',
        //  风险
        startRisk: '',
        eventNumber: 0,
        userId: 0,
        name: '',
        deptId: 0,
        deptName: '',
        title: ''
      },
      noticeLevelList: [],
      //  审核
      form: {
        auditComment: ''
      },
      //  新增
      newaddeds: {planDeptName: []},
      userName1: [],
      userName2: [],
      newadded: {
        eventNumber: 0,
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
      //  危险源关联
      caseHazard: [],
      //  调查新增
      newaddedlist: {
        eventNumber: this.eventid,
        caseUser: this.userId,
        caseUserName: this.userName,
        //  事件轻质
        caseNature: '',
        //  事件等级细分
        caseLevelDetail: '',
        //  依据
        dependent: '',
        //  事件结论
        caseResult: '',
        //  依据选择
        reportDependent: '',
        //  是否上报警方
        reportToUp: 'true',
        //  危险关联
        caseHazard: '',
        //  事件概要
        title: '',
        //  事情经过
        caseContent: '',
        //  QAR
        qarResult: '',
        //  事件等级
        caseLevel: ''
      },
      //  调查新增里面的原因分类
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
      //  责任划分
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
      //  责任单位
      submitDeptNameLists: {
        resDeptName: '',
        resUserName: ''
      },
      formLabelWidth: '120px',
      //  审核
      dialogFormVisible: false,
      //  新增
      dialogFormVisibles: false,
      //  调差情况新增
      dialogFormVisibleadd: false,
      //  原因分类新增
      classification: false,
      //  责任划分
      responsibility: false,
      dialogFormVisibleReject: false,
      //  建议整改新增
      Newviews: false,
      textarea: '',
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
      //  传去form的数据
      getreason: [],
      eventsui: true,
      EventFormResponsibility: [],
      sibility: true,
      //  一级原因
      resonId1: [],
      resonId1s: [],
      isshow: true,
      //  具体原因
      resonDetailId: [],
      //  处理改进的整改单位
      teventqarannoucement: {
        eventNumber: 0,
        //  单位id
        deptId: 0,
        //  单位名称
        deptName: '',
        //  建议整改内容
        improveContent: '',
        //  选项
        improveType: ''
      },
      //  判断表格是否显示
      startRisk: 'false',
      //  处理改进修改字表的id
      Newviewssid: 0,
      //  修改愿意分析
      modliycauseclassification: 0,
      modliyTypeOfResponsibility: 0,
      //  修改调查方案
      valueid: 0,
      //  结束流程
      end: 0,
      //  调查请款的修改保存id
      dialogFormVisibleaddss: 0,
      obj: {},
      update: 0,
      statelist: 0
    }
  },
  methods: {
    Actions () {
      if (this.$refs.upDow.className === 'icon-arrow-down') {
          this.$refs.upDow.className = 'icon-arrow-up'
        } else {
          this.$refs.upDow.className = 'icon-arrow-down'
        }
    },
    sourecelist (alue) {
      let sourceData = this.source
      let result = sourceDataFilter(sourceData, alue)
      return result
    },
    projectLevelFilter (alue) {
      let sourceData = this.groundList.REPORT_TYPE
      let result = sourceDataFilter(sourceData, alue)
      return result
    },
    //  审核
    project (formName) {
      if (this.end === 0) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let eventid = parseInt(this.eventid)
            let taskId = this.taskId
            let eventAuditVo = {
              eventAuditDO: {
                eventNumber: eventid,
                auditComment: this.form.auditComment,
                auditResult: 1,
                auditUserName: this.userName
              },
              taskInfo: {
                taskId: taskId,
                taskName: this.namelist,
                procInstId: this.procInstId
              }
            }
            this.fullscreenLoading = true
            axios.post('/api/incdent/workflow/complete', eventAuditVo)
              .then(res => {
                this.fullscreenLoading = false
                if (res.data.error === 0) {
                  this.$router.back(0)
                  this.$message.success('保存成功')
                } else {
                  this.$message.error('请重试' + res.data.message)
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
      } else if (this.end === 2) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let eventid = parseInt(this.eventid)
            let taskId = this.taskId
            let eventAuditVo = {
              eventAuditDO: {
                eventNumber: eventid,
                auditComment: this.form.auditComment,
                auditResult: 2,
                auditUserName: this.userName
              },
              taskInfo: {
                taskId: taskId,
                taskName: this.namelist,
                procInstId: this.procInstId
              }
            }
            this.fullscreenLoading = true
            axios.post('/api/incdent/workflow/complete', eventAuditVo)
              .then(res => {
                this.fullscreenLoading = false
                if (res.data.error === 0) {
                  this.$router.back(0)
                  this.$message.success('已结束流程')
                } else {
                  this.$message.error('请重试' + res.data.message)
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
      } else if (this.end === 1) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let eventid = parseInt(this.eventid)
            let taskId = this.taskId
            let eventAuditVo = {
              eventAuditDO: {
                eventNumber: eventid,
                auditComment: this.form.auditComment,
                auditResult: 1,
                auditUserName: this.userName
              },
              taskInfo: {
                taskId: taskId,
                taskName: this.namelist,
                procInstId: this.procInstId
              }
            }
            this.fullscreenLoading = true
            axios.post('/api/incdent/workflow/complete', eventAuditVo)
              .then(res => {
                this.fullscreenLoading = false
                if (res.data.error === 0) {
                  this.$router.back(0)
                  this.$message.success('发送成功')
                } else {
                  this.$message.error('请重试' + res.data.message)
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
    },
    gobacklist () {
      this.$router.back(-1)
    },
    //  结束流程
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
    //  调查部门
    handleChangebtn (params) {
      if(this.newaddeds.planDeptName.length === 1) {
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
    //  多级连选框
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
    toid() {
    },
    //  保存
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
              let eventQarPlanDO = this.newadded
              this.fullscreenLoading = true
              axios.post('/api/incdent/plan/addEventQarPlan', eventQarPlanDO)
                .then(res => {
                  this.fullscreenLoading = false
                  if (res.data.error === 0) {
                    axios.get('/api/incdent/plan/listEventQarPlanDO?' + 'eventNumber=' + this.eventid)
                      .then(res => {
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
                        this.$message.error('网咯超时请检查网咯')
                      })
                    this.$message.success('保存成功')
                    this.newadded.qarPlanVo = []
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
                    this.newadded.qarPlanVo = []
                    this.userName1 = []
                    this.userName2 = []
                    this.statuss = []
                    this.fullscreenLoading = false
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
                let eventQarPlanDO = this.newadded
                this.fullscreenLoading = true
                axios.post('/api/incdent/plan/updateEventQarPlanDO', eventQarPlanDO)
                  .then(res => {
                    this.fullscreenLoading = false
                    if (res.data.error === 0) {
                      axios.get('/api/incdent/plan/listEventQarPlanDO?' + 'eventNumber=' + this.eventid)
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
                          this.$message.error('网咯超时请检查网咯')
                        })
                      this.$message.success('修改成功')
                      this.newadded.qarPlanVo = []
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
                let eventQarPlanDO = this.newadded
                this.fullscreenLoading = true
                axios.post('/api/incdent/plan/updateEventQarPlanDO', eventQarPlanDO)
                  .then(res => {
                    this.fullscreenLoading = false
                    if (res.data.error === 0) {
                      axios.get('/api/incdent/plan/listEventQarPlanDO?' + 'eventNumber=' + this.eventid)
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
                          this.$message.error('网咯超时请检查网咯')
                        })
                      this.$message.success('修改成功')
                      this.dialogFormVisibles = false
                      this.newadded.qarPlanVo = []
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
                  })
              }
            } else {
              return false
            }
          })
        }
      }
    },
    //  发送的按钮
    postlist () {
      this.$confirm('是否进行下一步', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let eventid = parseInt(this.eventid)
        let taskId = this.taskId
        let eventAuditVo = {
          eventAuditDO: {
            eventNumber: eventid,
            auditResult: 1,
            auditUserName: this.userName
          },
          taskInfo: {
            taskId: taskId,
            taskName: this.namelist,
            procInstId: this.procInstId
          }
        }
        this.fullscreenLoading = true
        axios.post('/api/incdent/workflow/complete', eventAuditVo)
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
      .catch(error => {
        this.fullscreenLoading = false
        console.log(error)
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
    //  处理改进的发送
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
          let eventAuditVo = {
              eventAuditDO: {
                eventNumber: eventid,
                auditComment: this.form.auditComment,
                auditResult: 1,
                auditUserName: this.userName
              },
              taskInfo: {
                taskId: taskId,
                taskName: this.namelist,
                procInstId: this.procInstId
              }
            }
          this.fullscreenLoading = true
          axios.post('/api/incdent/workflow/complete', eventAuditVo)
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
      } else if (this.startRisk === 'false') {
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
          let eventid = parseInt(this.eventid)
          let taskId = this.taskId
          let eventAuditVo = {
              eventAuditDO: {
                eventNumber: eventid,
                auditComment: this.form.auditComment,
                auditResult: 1,
                auditUserName: this.userName
              },
              taskInfo: {
                taskId: taskId,
                taskName: this.namelist,
                procInstId: this.procInstId
              }
            }
          this.fullscreenLoading = true
          axios.post('/api/incdent/workflow/complete', eventAuditVo)
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
    //  调查新增保存
    investigationsendout (newaddedlist) {
      if (this.dialogFormVisibleaddss === 0) {
        this.$refs[newaddedlist].validate((valid) => {
          if (valid) {
            getInvestigation(this.newaddedlist).then(item => {
              if (item.data.error === 0) {
                geteventdata(this.eventNumber).then(item => {
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
              }
            })
          } else {
            return false
          }
        })
      } else if (this.dialogFormVisibleaddss === 1) {
        this.$refs[newaddedlist].validate((valid) => {
          if (valid) {
            axios.post('/api/incdent/case/updateEventQarCaseDO', this.newaddedlist)
              .then(res => {
                if (res.data.error === 0) {
                  geteventdata(this.eventNumber).then(item => {
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
      geteventdata(this.$route.params.id).then(item => {
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
    //  显示隐藏 后期可以删除
    lists () {
      axios.get('/api/incdent/Audit/listEventAuditDO?' + 'eventNumber=' + this.eventNumber)
        .then(res => {
          if (res.data.error === 0) {
            let Data = res.data.data.map(item => {
              return item
            })
            this.aproject = Data
          }
        })
      this.visible = 1
      this.list = !this.list
      if (this.list) {
        this.showname = '隐藏审核记录'
      } else {
        this.showname = '显示审核记录'
      }
    },
    //  原因分类的按钮
    classifications (id, index, params) {
      this.modliycauseclassification = id
      this.causeclassification.caseId = params.caseId
      this.classification = true
    },
    //  责任划分按钮
    classificationslist (id, index, params) {
      this.modliyTypeOfResponsibility = id
      this.TypeOfResponsibility.caseId = params.caseId
      this.responsibility = true
    },
    dialogFormVisibleadds (id) {
      this.dialogFormVisibleadd = true
      this.dialogFormVisibleaddss = id
      this.prescription = true
    },
    //  调查情况修改
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
    //  调查情况删除
    removeclassificationslist (index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/api/incdent/case/deleteEventQarCaseDO?' + 'caseId=' + row.caseId)
          .then(res => {
            geteventdata(this.eventNumber).then(item => {
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
              this.yesno = false
              this.dialogFormVisibleadd = false
            })
          })
      }).catch(() => {
      })
    },
    //  原因分类保存
    Preservation (causeclassification) {
      if (this.modliycauseclassification === 0) {
        this.$refs[causeclassification].validate((valid) => {
          if (valid) {
            this.fullscreenLoading = true
            getReason(this.causeclassification).then(item => {
              this.fullscreenLoading = false
              if (item.data.error === 0) {
                geteventdata(this.eventNumber).then(item => {
                  this.fullscreenLoading = false
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
        axios.post('/api/incdent/case/updateEventCaseAnalysisDO', this.causeclassification)
          .then(res => {
            if (res.data.error === 0) {
              this.$message.success('修改成功')
              this.resonId1s = []
              this.$refs[causeclassification].resetFields()
              getEventReason(this.caseId).then(item => {
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
    //  表格
    activelist (index, params) {
      if (params.length > 1) {
        params.shift()
      }
      this.caseId = index.caseId
      //  原因分类请求
      getEventReason(index.caseId).then(item => {
        if (item.data.data.length === 0) {
          this.eventsui = false
        } else {
          this.eventsui = true
        }
        this.getreason = item.data.data
      })
      //  责任划分
      getCaseResponsibilityDO(index.caseId).then(item => {
        if (item.data.data.length === 0) {
          this.sibility = false
        } else {
          this.sibility = true
        }
        this.EventFormResponsibility = item.data.data
      })
    },
    //  一级原因
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
    //  责任划分保存
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
          axios.post('/api/incdent/case/addEventCaseResponsibility', this.TypeOfResponsibility)
            .then(res => {
              this.fullscreenLoading = false
              geteventdata(this.eventNumber).then(item => {
                this.fullscreenLoading = false
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
        axios.post('/api/incdent/case/updateEventCaseResponsibility', this.TypeOfResponsibility)
          .then(res => {
            if (res.data.error === 0) {
              this.$message.success('修改成功')
              getCaseResponsibilityDO(this.caseId).then(item => {
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
    //  责任单位
    evevtsubmit (value) {
      if (this.caseHazardlist.length === 1) {
        this.caseHazardlist = []
      } else {
        let len = getCascaderOb(this.caseHazardlist, this.deptNameList).length
        let id = getCascaderOb(this.caseHazardlist, this.deptNameList)[len - 1].deptCode
        this.submitDeptNameLists.resDeptName = getCascaderOb(this.caseHazardlist, this.deptNameList)[len - 1].label
        this.TypeOfResponsibility.resDeptId = id
        this.TypeOfResponsibility.resDeptName = getCascaderOb(this.caseHazardlist, this.deptNameList)[len - 1].label
        //  let deptId = value.deptId
        axios.get('/api/system/user/dept?' + 'deptId=' + id)
          .then(res => {
            if (res.data.error === 0) {
              this.Personliable = res.data.data
            }
          })
      }
      
    },
    //  处理改进中的责任人
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
    //  责任人
    evevtsubmis (value) {
      this.TypeOfResponsibility.resUserId = this.submitDeptNameLists.resUserName.userId
      this.TypeOfResponsibility.resUserName = this.submitDeptNameLists.resUserName.userName
    },
    //  是否下发整改，是否启动风险管理保存按钮
    riskpreservation () {
      if (this.eventDOS.startSafetyNotice === '') {
        this.$message.error('请先选择下发整改')
      } else if (this.eventDOS.startRisk === '') {
        this.$message.error('请选择风险管理')
      } else {
        getmanagement(this.eventDOS).then(item => {
          if (item.data.error === 0) {
            this.$message.success('保存成功')
            this.update = 1
          } else {
            this.$message.error('请重试：' + item.data.message)
          }
        })
      }
    },
    //  处理改进中的保存
    teventsendout () {
      if (this.startRisk === 'true' && this.Newviewssid === 1) {
        if (this.submitDeptNameLists.resDeptName === '') {
          this.$message.error('请先选择责任单位')
        } else if (this.teventqarannoucement.improveType === '') {
          this.$message.error('请先选择正改项')
        } else if (this.teventqarannoucement.improveContent === '') {
          this.$message.error('请先填写建议要求')
        } else {
          axios.post('/api/incdent/annoucement/addEventQarAnnoucement', this.teventqarannoucement)
            .then(res => {
              if (res.data.error === 0) {
                getqueries(this.eventNumber).then(item => {
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
                this.submitDeptNameListsresDeptName = []
                this.teventqarannoucement.improveContent = ''
                this.submitDeptNameLists.resDeptName = ''
                this.Newviews = false
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
            axios.post('/api/incdent/annoucement/addEventQarAnnoucement', this.teventqarannoucement)
              .then(res => {
                if (res.data.error === 0) {
                  getqueries(this.eventNumber).then(item => {
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
        } else if (this.teventqarannoucement.improveType === '') {
          this.$message.error('请先选择风险管理')
        } else if (this.teventqarannoucement.improveContent === '') {
          this.$message.error('请先填写建议要求')
        } else {
          axios.post('/api/incdent/annoucement/updateEventQarAnnoucement', this.teventqarannoucement)
            .then(res => {
              if (res.data.error === 0) {
                getqueries(this.eventNumber).then(item => {
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
    //  处理关闭的按钮
    CloseNewviews () {
      this.submitDeptNameLists.resDeptName = ''
      this.teventqarannoucement.improveType = ''
      this.teventqarannoucement.improveContent = ''
      this.Newviews = false
    },
    //  修改
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
    //  处理改进中的删除
    removeeventDOS (index, params) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/api/incdent/annoucement/deleteEventQarAnnoucement?' + 'id=' + params.id)
          .then(res => {
            if (res.data.error === 0) {
              getqueries(this.eventNumber).then(item => {
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
    clickitem (e) {
      e === this.startRisk ? this.startRisk = e : this.startRisk = e
      if (e === 'true') {
        this.cation = false
      } else if (e === 'false') {
        this.cation = true
      }
    },
    //  自定义事件
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
    //  自定义删除
    removelist (params) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/api/incdent/case/deleteEventCaseAnalysisDO?' + 'annlysisId=' + params.annlysisId)
          .then(res => {
            if (res.data.error === 0) {
              getEventReason(this.caseId).then(item => {
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
    removelists (params) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/api/incdent/case/deleteEventCaseResponsibilityDO?' + 'responId=' + params.responId)
          .then(res => {
            if (res.data.error === 0) {
              getCaseResponsibilityDO(this.caseId).then(item => {
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
    //  调查方案修改
    scheme (index, len, obj) {
      this.valueid = index
      this.newadded.planDate = obj.plan_date
      let data = {
        label: obj.plan_dept_name,
        value: obj.plan_dept_name
      }
      this.deptNameList.push(data)
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
    //  调查方案新增
    dialogFormVisibleslist (value) {
      this.valueid = value
      this.dialogFormVisibles = true
    },
    //  返回按钮
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
    //  调查方案删除
    deletelist (index, params) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete('/api/incdent/plan/deleteEventQarPlanDO?' + 'caseId=' + params.plan_id)
          .then(res => {
            if (res.data.error === 0) {
              axios.get('/api/incdent/plan/listEventQarPlanDO?' + 'eventNumber=' + this.eventid)
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
    tiggleAction () {
      if (this.$refs.upDown.className === 'icon-arrow-down') {
        this.$refs.upDown.className = 'icon-arrow-up'
      } else {
        this.$refs.upDown.className = 'icon-arrow-down'
      }
    },
    tiggleActions () {
      if (this.$refs.upDowns.className === 'icon-arrow-down') {
        this.$refs.upDowns.className = 'icon-arrow-up'
      } else {
        this.$refs.upDowns.className = 'icon-arrow-down'
      }
    },
    dialogFormVisibleRejects (form) {
      this.dialogFormVisibleReject = false
      this.$refs[form].resetFields()
    },
    Return (form) {
      this.dialogFormVisible = false
      this.$refs[form].resetFields()
    },
    dialogFormVisibleback (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            let eventid = parseInt(this.eventid)
            let taskId = this.taskId
            let eventAuditVo = {
              eventAuditDO: {
                eventNumber: eventid,
                auditComment: this.form.auditComment,
                auditResult: 3,
                auditUserName: this.userName
              },
              taskInfo: {
                taskId: taskId,
                taskName: this.namelist,
                procInstId: this.procInstId
              }
            }
            this.fullscreenLoading = true
            axios.post('/api/incdent/workflow/complete', eventAuditVo)
              .then(res => {
                this.fullscreenLoading = false
                if (res.data.error === 0) {
                  this.$message.success('驳回成功')
                  this.$router.back(0)
                  this.dialogFormVisible = false
                } else {
                  this.$message.error('请重试'+ res.data.message)
                }
              })
              .catch(() => {
                this.fullscreenLoading = false
                this.$message.error('网咯超时请检查网咯')
              })
          } else {
            return false
          }
        })
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
  mounted () {
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
    this.$watch('EventFormResponsibility', ()=>{
      if (this.EventFormResponsibility.length === 0) {
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
