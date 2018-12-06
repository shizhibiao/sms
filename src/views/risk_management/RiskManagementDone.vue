<template>
    <div class="animated fadeIn">
        <b-card no-body>
            <div slot="header" class='risk-header'>
                <el-row :gutter="5">
                    <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                        <el-form :inline="true" :model="risk" class="form-title">
                                <el-form-item label="办理日期">
                                    <el-date-picker
                                    v-model="daterange"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    id='dataSelect'

                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions2"

                                    value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                               
                        </el-form>
                    </el-col>
                    <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" align="right">
                            <!-- <el-button type="warning" size='small'  @click="showMoreHandle()">{{showMoreLabel}}</el-button> -->
                            <el-button type="primary" @click="refresh()" size='small'>查询</el-button>
                    </el-col>
                </el-row>

            </div>
            <b-card-body>
                    <template>
                    <el-table
                        :stripe="true"
                        :highlight-current-row ="true"
                        :data="datas"
                        size="small">
                

                        <el-table-column
                        label="#"
                        width='40'>
                            <template slot-scope="scope">
                              {{scope.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column
                        label="标题"
                        prop="riskTitle">
                        </el-table-column>
                        
                        <el-table-column
                        label="项目来源"
                        prop="projectSrc"
                        :formatter="projectSrcFilter"
                        >
                        </el-table-column>
                        <el-table-column
                        label="立项等级"
                        prop="projectLevel"
                        :formatter="projectLevelFilter"
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
                        
                        <!-- <el-table-column
                        label="责任部门"
                        prop="rmDepartmentDOList">
                            <template slot-scope="">

                            </template>
                        </el-table-column> -->
                        <el-table-column
                        label="状态"
                        >
                            <template slot-scope="scope">
                                {{scope.row.taskInfo.taskName}}
                            </template>
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
                                <el-button type="disabled" size='mini'
                                    @click="handleLook(scope.$index, scope.row)" v-if='scope.row&&(scope.row.flag==2)'>查看</el-button>
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
   sourceDataFilter } from '../../tools'
import {
   getDepartmentList,
   getAllDataAction
//    signForTask,
//    activitiCancelClaim
 //
 } from '../../services/safety_notice'
import {
//    riskManageSearchList,
   riskManageFlowDone
}
   from '../../services/risk'
export default {
   name: 'SecurityNoticeList',
   data () {
     return {
       risk: {},
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
       deptName: [],

       submitDeptNameList: [],
       submitDeptName: [],
       ALL_SELECT_DATA: {
         ANNOUNCEMENT_LEVEL: {
           dicts: []
         },
         ANNOUNCEMENT_TYPE: {
           dicts: []
         },
         ANNOUNCE_RESOURCE: {
           dicts: []
         }
       },
       showMore: false,
       showMoreLabel: '更多',
       isUnfold: false,
       fullscreenLoading: false

     }
   },
   methods: {
     // 初始值
     initData () {
       this.form.queryItems = []
       this.datas = []
     },
     // 转换数据
     transformData () {
       this.risk.startDate = this.daterange && this.daterange.length > 0 ? this.daterange[0] : ''
       this.risk.endDateEnd = this.daterange && this.daterange.length > 1 ? this.daterange[1] : ''
       this.risk.submitDeptName = this.submitDeptName && this.submitDeptName.length > 0 ? this.submitDeptName[this.submitDeptName.length - 1] : ''
     },
     // 处理数据
     loadData () {
       let result = Object.keys(this.risk).filter(item => {
         return this.risk[item] !== '' || undefined || null
       })

       result.forEach(item => {
         this.qItem = {
           fieldName: item,
           matchType: '',
           value: this.risk[item]
         }
         this.form.queryItems.push(this.qItem)
       })
     },
     // 请求数据
     refresh () {
       this.initData()
       this.transformData()
       this.loadData()
       this.form.pageNum = this.curPage - 1
       this.form.pageSize = this.pageSize
       riskManageFlowDone(this.form).then(result => {
         if (result && result.data && result.data.data && result.data.data.content && result.data.error === 0) {
           let data = result.data.data
           this.datas = data.content
           this.total = data.totalElements
           this.totalPages = data.totalPages
           this.roles = data.content
           //  console.log(result)
         }
       })
     },

     // 查看按钮
     handleLook (index, row) {
       let riskId = row.riskId
       let taskId = row.taskId
       let flag = row.flag
       //    console.log(row)
       this.$router.push({
         path: '/risk/look',
         query: {
           riskId,
           theme: 'look',
           flag,
           taskId
         }
       })
     },

     // 等级过滤器
     projectLevelFilter (alue, row, column) {
       let sourceData = this.ALL_SELECT_DATA.ANNOUNCEMENT_LEVEL

       let result = sourceDataFilter(sourceData, alue.projectLevel)
       return result
     },
     // 来源过滤器
     projectSrcFilter (alue, row, column) {
       let sourceData = this.ALL_SELECT_DATA.PROJECT_SOURCE

       let result = sourceDataFilter(sourceData, alue.projectSrc)
       return result
     }
     // 显示更多
     //  showMoreHandle () {
     //    this.showMore = !this.showMore
 
     //    this.showMoreLabel = this.showMore ? '隐藏' : '更多'
     //  }
 
   },
   computed: {
     submitDeptId () {
       return this.$store.state.user.deptId
     },
     userId () {
       return this.$store.state.user.userId
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
     // 立项部门
     getDepartmentList().then(result => {
       this.submitDeptNameList = result
       //  console.log(result)
     })
     getAllDataAction().then(result => {
       this.ALL_SELECT_DATA = result
       console.log(this.ALL_SELECT_DATA)
     })
   }
}
</script>

<style scoped>

</style>
