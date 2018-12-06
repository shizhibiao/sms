<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header" class='notice-header'>

              <el-form :inline="true" :model="notice" class="form-title">
                  <el-row :gutter="5">
                      <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22">
                          <el-form-item label="办理日期" style="width: auto">
                            <el-date-picker
                              v-model="daterange"
                              type="daterange"
                              align="right"
                              unlink-panels
                              id='dataSelect'
                              style="width:100%"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :picker-options="pickerOptions2"

                              value-format="yyyy-MM-dd">
                            </el-date-picker>
                          </el-form-item>
                      </el-col>
                      <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" align="right">
                            <el-button type="primary" @click="refresh()" size='small' class='mt-1' >查询</el-button>
                      </el-col>
                  </el-row>
              </el-form>
      </div>
      <b-card-body>
            <template>
              <el-table
                  :stripe="true"
                  :highlight-current-row ="true"
                  :data="datas"
              >
                 <el-table-column
                  label="#"
                  prop="id"
                  width='40'
                  >
                  </el-table-column>
                  <el-table-column
                  label="标题"
                  prop="noticeTitle">
                  </el-table-column>
                  <el-table-column
                  label="通知来源"
                  prop="noticeSrcType"
                  :formatter="noticeSrcTypeFiter"
                  >
                  </el-table-column>
                  <el-table-column
                  label="通知等级"
                  prop="noticeLevel"
                  :formatter="noticeLevelFiter"
                  >
                  </el-table-column>
                  <el-table-column
                  label="立项部门"
                  prop="submitDeptName">
                  </el-table-column>
                  <el-table-column
                  label="立项日期"
                  prop="submitDate">
                  </el-table-column>
                  <el-table-column
                  label="流程节点"
                  prop="taskInfo"
                  :formatter="procDefFilter"
                  >
                  </el-table-column>
                  <el-table-column
                  label="派发日期"
                  >
                      <template slot-scope="scopes">
                            {{scopes.row.taskInfo.startTime}}
                      </template>
                  </el-table-column>
                  <el-table-column
                  label="办理日期"
                  >
                      <template slot-scope="scopes">
                            {{scopes.row.taskInfo.endTime}}
                      </template>
                  </el-table-column>
                  <el-table-column

                  label="操作">
                      <template slot-scope="scope">
                        <el-button-group>
                            <!-- <el-button type="success" size='small'
                            @click="handleStart(scope.$index, scope.row)" v-if='Number(scope.row.procStatus)!==3'>办理</el-button> -->
                            <el-button size='mini'
                            @click="handleLook(scope.$index, scope.row)">查看</el-button>
                       </el-button-group>
                      </template>

                  </el-table-column>
              </el-table>
           </template>
            <!-- <b-row>
              <b-col sm="12" v-if="totalPages>1">
                <b-pagination size="md" :total-rows="total" v-model="curPage" :per-page="pageSize" :limit="5"
                              align="right">
                </b-pagination>
              </b-col>
          </b-row> -->
          <b-row>
            <b-col md="12" class="my-1 mt-1" v-if="totalPages > 1">
              <!--<b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />-->
              <el-pagination
                background
                :pager-count="5"
                :current-page.sync="curPage"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="total"
                align="right">
              </el-pagination>
            </b-col>
          </b-row>
      </b-card-body>
    </b-card>

  </div>
</template>

<script>
 //
import { formatDate } from '../../utils/index.js'
import {
   AnnounceDataList,
   sourceDataFilter
   //  transformNoticeProcStatusFilter
 } from '../../tools'
// import axios from 'axios'
import {
   getSavetyNoticeFlowDone
   //
 } from '../../services/safety_notice'
export default {
   name: 'SecurityNoticeList',
   data () {
     return {
       notice: {
         noticeLevel: '',
         submitDateStart: '',
         submitDateEnd: '',
         noticeType: '',
         noticeSrcType: '',
         submitDeptName: '',
         deptId: ''

       },
       daterange: [formatDate(new Date(new Date().getTime() - 3600 * 1000 * 24 * 6), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
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
       datas: [],
       total: 0,
       curPage: 1,
       pageSize: 15,
       totalPages: 1,
       roles: [],
       form: {
         orderby: '',
         pageNum: 1,
         pageSize: 0,
         queryItems: []
       },
       qItem: {
         fieldName: '',
         matchType: '',
         value: ''
       },
       noticeLevelId: 1,
       deptNameList: [],
       submitDeptNameList: [],
       submitDeptName: []

     }
   },
   methods: {
     refresh () {
       this.initData()
       this.transformData()
       this.loadData()
       this.form.pageNum = this.curPage - 1
       this.form.pageSize = this.pageSize
       // 请求列表详情
       console.log(this.form)
       getSavetyNoticeFlowDone(this.form).then(result => {
         if (!result) {
           return
         }
         let data = result.data
         if (data.data && data.error === 0) {
           this.datas = AnnounceDataList(result)
           let page = data.data
           this.total = page.totalElements
           this.totalPages = page.totalPages
           this.roles = page.content
         } else {
           alert(data.message)
         }
       })
     },

     // 初始值
     initData () {
       this.form.queryItems = []
       this.datas = []
     },
     // 转换数据
     transformData () {
       this.notice.startDate = this.daterange && this.daterange.length > 0 ? this.daterange[0] : ''
       this.notice.endDate = this.daterange && this.daterange.length > 1 ? this.daterange[1] : ''
       //  this.notice.submitDeptName = this.submitDeptName && this.submitDeptName.length > 0 ? this.submitDeptName[this.submitDeptName.length - 1] : ''
     },
     // 处理数据
     loadData () {
       if (this.notice) {
         let result = Object.keys(this.notice).filter(item => {
           return this.notice[item] !== '' || undefined || null
         })

         result.forEach(item => {
           this.qItem = {
             fieldName: item,
             matchType: '',
             value: this.notice[item]
           }
           this.form.queryItems.push(this.qItem)
         })
       }
     },
     // 等级过滤器
     noticeLevelFiter (alue, row, column) {
       let sourceData = this.ALL_SELECT_DATA.ANNOUNCEMENT_LEVEL

       let result = sourceDataFilter(sourceData, alue.noticeLevel)
       return result
     },
     //  来源过滤器
     noticeSrcTypeFiter (alue, row, column) {
       let sourceData = this.ALL_SELECT_DATA.ANNOUNCE_RESOURCE

       let result = sourceDataFilter(sourceData, alue.noticeSrcType)
       return result
     },
     procDefFilter (alue, row, column) {
       if (alue && alue.taskInfo) {
         return alue.taskInfo.taskName
       }
     },
     handleLook (index, row) {
       let safetyId = row.safetyId
       let flag = row.flag

       let taskId = row.taskInfo && row.taskInfo.taskId
       let taskInfo = row.taskInfo
       let procStatus = row.procStatus
       if (safetyId && row.taskInfo) {
         let query = {
           safetyId: safetyId,
           theme: 'start',
           flag,
           taskId,
           auditType: procStatus

         }
         let params = {
           id: flag,
           taskInfo: taskInfo
         }
         console.log(taskInfo.taskName)
         this.$router.push({
           name: '查看',
           query,
           params

         })
       }
     }

   },
   computed: {
     submitDeptId () {
       return this.$store.state.user.deptId
     },
     ALL_SELECT_DATA(){
       return this.$store.state.ALL_SELECT_DATA
     }
   },
   watch: {
     curPage: function (newValue, oldValue) {
       this.refresh()
     }
   },
   created () {
     this.refresh()
   },
   mounted () {
   }
}
</script>

<style scoped>

</style>
