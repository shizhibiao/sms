<template>
    <div class="animated fadeIn">
        <b-card no-body>
            <div slot="header" class='risk-header'>
                <el-row :gutter="5">
                    <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                        <el-form :inline="true" :model="risk" class="form-title">
                                <el-form-item label="立项日期">
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
                                <el-form-item label="立项等级">
                                    <el-select v-model="risk.projectLevel" class='select' :clearable='true'>

                                    <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.ANNOUNCEMENT_LEVEL.dicts" :key ='index'></el-option>

                                    </el-select>
                                </el-form-item>
                                <el-form-item label="立项部门">
                                    <el-cascader :options="submitDeptNameList" v-model="submitDeptName" :props='{value:"value"}' change-on-select :show-all-levels='false':clearable='true' @change="changeClassDept"></el-cascader>
                                </el-form-item>

                                <el-form-item label="项目来源" v-if='showMore'>
                                    <el-select v-model="risk.projectSrc" :clearable='true'>
                                      <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.PROJECT_SOURCE.dicts" :key ='index'></el-option>

                                    </el-select>
                                </el-form-item>

                                <el-form-item label="项目名称" v-if='showMore'>
                                    <el-input v-model="risk.riskTitle"></el-input>
                                </el-form-item>
<!--
                                <el-form-item label="状态" v-if='showMore'>
                                    <el-select v-model="risk.procStatus" :clearable='true'>
                                    <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.RISKSOURCE_STATUS.dicts" :key ='index'></el-option>
                                    </el-select>
                                </el-form-item> -->
                        </el-form>
                    </el-col>
                    <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" align="right">
                            <el-button type="warning" size='small'  @click="showMoreHandle()">{{showMoreLabel}}</el-button>
                            <el-button type="primary" @click="refresh()" size='small'>查询</el-button>
                            <el-button type="primary" @click="clearForm()" size='small'>重置</el-button>
                            <el-button type="success" @click="addNew()" size='small'>新增</el-button>
                    </el-col>
                </el-row>

            </div>
            <b-card-body style="min-height:56vh;">
                    <template>
                    <el-table
                        :stripe="true"
                        :highlight-current-row ="true"
                        :data="datas"
                        size="small"

                        @expand-change='handleUnfold'>
                    <!-- 内部表 -->
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <el-card v-if="props.row.rmDepartmentDOList && props.row.rmDepartmentDOList.length > 0">
                                        <el-table size="mini"
                                            :data="props.row.rmDepartmentDOList"
                                            style="width: 100%">
                                            <el-table-column
                                            fixed

                                            label="责任部门">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{ scope.row.processDeptName}}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                            label="风险分析员">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{ scope.row.processUserName}}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                            label="风险分析时间">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{ scope.row.processDate}}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                            label="控制部门">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{ scope.row.controlDeptName}}
                                                    </div>

                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                            label="控制人">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{ scope.row.controlUserName}}
                                                    </div>

                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                            label="风险等级">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{ scope.row.riskLevel}}
                                                    </div>

                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="评估人">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{ scope.row.verifierName}}
                                                    </div>

                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="评估时间">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{ scope.row.verifyDate}}
                                                    </div>

                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="评估结果">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{ resultFilter(scope.row.effectEvaluate)}}
                                                    </div>

                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="流程状态">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{ scope.row.statusDesc}}
                                                    </div>

                                                </template>
                                            </el-table-column>

                                    </el-table>
                                    </el-card>
                                </template>
                            </el-table-column>

                    <!-- 外部表 -->

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
                        show-overflow-tooltip
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
                        prop="procStatusDesc"

                        >
                        </el-table-column>
                        <el-table-column

                        label="操作"
                        width="190px"
                        >
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-button type="success" size='mini' v-if='scope.row&&(scope.row.flag==0)'
                                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                    <el-button type="disabled" size='mini'
                                    @click="handleLook(scope.$index, scope.row)" v-if='scope.row&&(scope.row.flag==2)'>查看</el-button>
                                    <el-button type="danger" size='mini'
                                    @click="handleDelete(scope.$index, scope.row)" v-if='scope.row&&(scope.row.flag==0)'>删除</el-button>
                                    <el-button type="primary" size='mini'
                                    @click="handleSend(scope.$index, scope.row)" v-if='scope.row&&scope.row.procStatus==-1&&scope.row.flag==0'>发送</el-button>
                                    <el-button type="primary" size='mini' v-if='(scope.row.taskInfo&&scope.row.taskInfo.assignee!=null&& scope.row.flag < 2)'
                                    @click="handleStart(scope.$index, scope.row)"
                                    v-loading.fullscreen.lock="fullscreenLoading"
                                    >办理</el-button>
                                    <el-button type="primary" size='mini'  v-if='scope.row.taskInfo&&scope.row.taskInfo.assignee==null'
                                    @click="signForHandle(scope.$index, scope.row)">签收</el-button>
                                    <el-button type="success" size='mini' v-if='scope.row.taskInfo&& scope.row.taskInfo.assignee!=null'
                                    @click="cancelSignForHandle(scope.$index, scope.row)">取消签收</el-button>

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

import { formatDate } from '../../utils/index.js'
import {

   sourceDataFilter } from '../../tools'

import {

   getDepartmentList,
   signForTask,
   activitiCancelClaim
   //
 } from '../../services/safety_notice'

import {
   riskManageSearchList,
   deleteRiskManage,
   riskManageChildrenTab,
   startRiskManage
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
       this.risk.submitDateStart = this.daterange && this.daterange.length > 0 ? this.daterange[0] : ''
       this.risk.submitDateEnd = this.daterange && this.daterange.length > 1 ? this.daterange[1] : ''
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
       riskManageSearchList(this.form).then(result => {
         if (result && result.data && result.data.data && result.data.data.content && result.data.error === 0) {
           let data = result.data.data
           this.datas = data.content
           this.total = data.totalElements
           this.totalPages = data.totalPages
           this.roles = data.content
            console.log(result)
         }
       })
     },
     // 删除
     handleDelete (index, row) {
       //  console.log(row)
       this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       })
         .then(() => {
           // 删除
           deleteRiskManage(row.riskId).then(result => {
             if (result.data.data && +result.data.error === 0) {
               this.$message({
                 type: 'success',
                 message: '删除成功!'
               })
               this.refresh()
               setTimeout(this.$forceUpdate(), 0)
             }
           })
             .catch(() => {
               this.$message({
                 type: 'info',
                 message: '删除失败'
               })
             })
         })
     },
     // 跳到新增页面
     addNew () {
       let url = '/risk/new'
       this.$router.push({path: url})
     },

     // 展开
     handleUnfold (row, expandedRows) {
       if (expandedRows.length > 1) {
         expandedRows.shift()
       }

         let riskId = row.riskId
         if (!row.rmDepartmentDOList) {
           row.rmDepartmentDOList = []
         }
         // 查询子表数据
         riskManageChildrenTab(riskId).then(result => {
           if (result.data && result.data.error === 0) {
             let data = result.data.data
             row.rmDepartmentDOList = data
             //  console.log(data)
           }
         })

     },
     // 编辑按钮
     handleEdit (index, row) {
       let riskId = row.riskId
       let taskId = row.taskId
       let flag = row.flag

       this.$router.push({
         path: '/risk/edit/' + flag,
         query: {
           riskId: riskId,
           theme: 'edit',
           flag,
           taskId
         }
       })
     },
     // 查看按钮
     handleLook (index, row) {
       let riskId = row.riskId
       let taskId = row.taskId
       let flag = row.flag
       //  console.log(row)
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
     // 启动流程跳转相应的位置
     handleStart (index, row) {
       let flag = row.flag
       //  let procStatus = row.procStatus
       let riskId = row.riskId
       console.log(row)

       //  let taskId = row.taskInfo && row.taskInfo.taskId
       let taskInfo = row.taskInfo
       let path = ''
       if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('立项审批')) {
         path = '/risk/start0'
       } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('立项修改')) {
         path = '/risk/risk_transfer_stop'
       } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('风险分析')) {
         path = '/risk/start1'
       } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('风险控制措施')) {
         path = '/risk/start2'
       } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('部门审核')) {
         path = '/risk/start3'
       } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('级核准')) {
         path = '/risk/start4'
       } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('验证措施')) {
         path = '/risk/start5'
       } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('验证核准')) {
         path = '/risk/start6'
       } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('效果评估')) {
         path = '/risk/start7'
       } else if (row.taskInfo && row.taskInfo.taskName && row.taskInfo.taskName.includes('项目评价')) {
         path = '/risk/start8'
       }

       this.$router.push({
         path: path,
         query: {
           taskInfo,
           riskId,
           flag
         }
       })
     },
     handleSend (index, row) {
       let riskId = row.riskId

       if (riskId) {
         this.$confirm('是否确认发送', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
         }) // 点击确定
           .then(() => {
             // 启动流程
             this.fullscreenLoading = true
             startRiskManage(riskId).then(result => {
               this.fullscreenLoading = false
               if (result.data && result.data.error === 0) {
                 this.$message({
                   type: 'success',
                   message: '发送成功'
                 })

                 this.refresh()
               } else {
                 this.$message({
                   type: 'info',
                   message: '发送失败'
                 })
               }
             }).catch(error => {
               this.fullscreenLoading = false

               this.$message({
                 type: 'info',
                 message: '保存失败' + error
               })
             })
           })
       }
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
     },
     resultFilter(alue){
      let sourceData = this.ALL_SELECT_DATA.ASSESS_RESULT

       let result = sourceDataFilter(sourceData, alue)
       return result
    },
     // 显示更多
     showMoreHandle () {
       this.showMore = !this.showMore

       this.showMoreLabel = this.showMore ? '隐藏' : '更多'
     },
     // 重置按钮
     clearForm () {
       this.risk = {
         projectLevel: '',
         submitDateStart: '',
         submitDateEnd: '',
         noticeType: '',
         noticeSrcType: '',
         submitDeptName: '',
         deptId: ''

       }

       this.total = 0
       this.curPage = 1
       this.pageSize = 15
       this.submitDeptName = []
       this.daterange= [formatDate(new Date(new Date().getTime() - 3600 * 1000 * 24 * 6), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')]
       this.refresh()
     },
     // 签收按钮
     signForHandle (index, row) {
       let taskId = row.taskInfo && row.taskInfo.taskId
       let userId = this.userId

       this.$confirm('确定要签收吗?', '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       }).then(() => {
         //  console.log(taskId, userId)
         signForTask(taskId, userId).then(result => {
           //  console.log(result)
           if (result.data && result.data.error === 0) {
             this.$message({
               type: 'success',
               message: '签收成功'
             })
             this.handleStart(index, row)
           } else {
             this.$message({
               type: 'success',
               message: '签收失败'
             })
           }
         })
       })
     },
     changeClassDept(arr){
       if(arr.length<2){
         this.submitDeptName =[]
       }
     },

     // 取消签收
     cancelSignForHandle (index, row) {
       let taskId = row.taskInfo && row.taskInfo.taskId

       this.$confirm('确定要取消签收吗?', '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       }).then(() => {
         activitiCancelClaim(taskId).then(result => {
           if (result.data && result.data.error === 0) {
             this.$message({
               type: 'success',
               message: '取消签收成功'

             })
             this.refresh()
           } else {
             this.$message({
               type: 'success',
               message: '取消签收失败'
             })
           }
         })
       })
     }

   },
   computed: {
     submitDeptId () {
       return this.$store.state.user.deptId
     },
     userId () {
       return this.$store.state.user.userId
     },
     ALL_SELECT_DATA () {
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
     // 立项部门
     getDepartmentList().then(result => {
       this.submitDeptNameList = result
       //  console.log(result)
     })
   }
}
</script>

<style scoped>

</style>
