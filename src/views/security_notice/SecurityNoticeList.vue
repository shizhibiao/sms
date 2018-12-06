<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header" class='notice-header'>

        <el-row :gutter="5">
          <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
              <el-form :inline="true" :model="notice" class="form-title">
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

                       <el-form-item label="通知等级">
                        <el-select v-model="notice.noticeLevel" class='select' :clearable='true'>

                          <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.ANNOUNCEMENT_LEVEL.dicts" :key ='index'></el-option>

                        </el-select>
                      </el-form-item>
                      <el-form-item label="立项部门">
                        <el-cascader :options="submitDeptNameList" v-model="submitDeptName" change-on-select :show-all-levels='false' :props='{value:"value"}' :clearable='true'
                        @change="changeClassDept"></el-cascader>
                      </el-form-item>
                      <el-form-item label="通知类型" v-if='showMore'>
                        <el-select v-model="notice.noticeType" class='select' :clearable='true'>
                          <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.ANNOUNCEMENT_TYPE.dicts" :key ='index'></el-option>

                        </el-select>
                      </el-form-item>
                      <el-form-item label="责任单位" v-if='showMore'>
                        <el-select v-model="notice.deptId" class='select' :clearable='true'>
                          <el-option :label="item.deptName" :value="item.deptId" v-for='(item,index) in deptNameList' :key='index'></el-option>
                        </el-select>
                      </el-form-item>




                      <el-form-item label="通知来源" v-if='showMore'>
                        <el-select v-model="notice.noticeSrcType" class='noticeScource' :clearable='true'>
                           <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.ANNOUNCE_RESOURCE.dicts" :key ='index'></el-option>
                        </el-select>
                      </el-form-item>



              </el-form>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" align="right">
                <el-button type="warning" size='small'  @click="showMoreHandle()">{{showMoreLabel}}</el-button>
                <el-button type="primary" @click="clearForm()" size='small'>重置</el-button>
                <el-button type="primary" @click="refresh()" size='small'>查询</el-button>
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
                  style="width: 100%"
                  @expand-change='handleUnfold'

              >
              <!-- 内部表 -->
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-card v-if="props.row.safetyDepartmentDOList && props.row.safetyDepartmentDOList.length > 0">
                          <el-table size="mini"
                            :data="props.row.safetyDepartmentDOList"
                            style="width: 100%">
                            <el-table-column
                              label="责任部门"
                              >
                              <template slot-scope="scope">
                                <div slot="reference" class="gist-wrapper">
                                  {{ scope.row.deptName}}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column
                              label="通知类型"
                              prop="noticeType"
                              :formatter="noticeTypeFiter"
                             >
                            </el-table-column>
                            <el-table-column
                              label="是否重复通知"
                            >
                              <template slot-scope="scope">
                                <div slot="reference" class="gist-wrapper">
                                  {{ scope.row.replayIssue?'是':'否'}}
                                </div>

                              </template>
                            </el-table-column>
                            <el-table-column
                              label="流程状态"
                          >
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
                  label="流程状态"
                  prop="procStatusDesc"

                  >
                  </el-table-column>
                  <el-table-column

                  label="操作"
                  width='190px'
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
                            @click="handleStart(scope.$index, scope.row)">办理</el-button>
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
                              align="right"></b-pagination>
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
import { AnnounceDataList, sourceDataFilter } from '../../tools'
// import axios from 'axios'
import {
   //  conditionGetDepartmentList,
   getDepartmentList,
   demandSafetyNoticeList,
   getSafetyNoticeChildrenList,
   deleteNoticeData,
   GetDepartmentListFromList,
   savetyNoticeStart,
   signForTask,
   activitiCancelClaim
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
       deptName: [],
       deptNameList1: [],
       deptNameList2: [],

       submitDeptNameList: [],
       submitDeptName: [],
       showMore: false,
       showMoreLabel: '更多'

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
       demandSafetyNoticeList(this.form).then(result => {
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
         .catch(response => {
           this.$message.error('')
         })
     },
     // 删除
     handleDelete (index, row) {
       this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       })
         .then(() => {
           // 删除
           deleteNoticeData(row.safetyId).then(result => {
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

         .catch(() => {
           this.$message({
             type: 'info',
             message: '已取消删除'
           })
         })
     },
     // 跳到新增页面
     addNew () {
       let url = '/notify/new'
       this.$router.push({path: url})
     },
     // 初始值
     initData () {
       this.form.queryItems = []
       this.datas = []
     },
     // 转换数据
     transformData () {
       this.notice.submitDateStart = this.daterange && this.daterange.length > 0 ? this.daterange[0] : ''
       this.notice.submitDateEnd = this.daterange && this.daterange.length > 1 ? this.daterange[1] : ''
       this.notice.submitDeptName = this.submitDeptName && this.submitDeptName.length > 0 ? this.submitDeptName[this.submitDeptName.length - 1] : ''
     },
     // 处理数据
     loadData () {
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
     },
     // 展开
     handleUnfold (row, expandedRows) {
       if (expandedRows.length > 1) {
         expandedRows.shift()
       }
       let safetyId = row.safetyId
       if (!row.safetyDepartmentDOList) {
         row.safetyDepartmentDOList = []
       }
       // 查询子表数据
       getSafetyNoticeChildrenList(safetyId).then(result => {
         console.log(result)
         if (result) {
           row.safetyDepartmentDOList = result
           setTimeout(this.$nextTick(() => {}), 0)
         }
       })
     },
     // 编辑
     handleEdit (index, row) {
       let safetyId = row.safetyId

       let flag = row.flag

       this.$router.push({
         path: '/notify/edit/' + flag,
         query: {
           safetyId: safetyId,
           theme: 'edit',
           flag
         }
       })
     },
     // 查看
     handleLook (index, row) {
       let safetyId = row.safetyId

       let flag = row.flag

       this.$router.push({
         path: '/notify/look/',
         query: {
           safetyId: safetyId,
           theme: 'look',
           flag
         }
       })
     },
     // 启动流程跳转相应的位置
     handleStart (index, row) {
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
         //  console.log(taskInfo.taskName)
         this.$router.push({
           name: `${taskInfo.taskName}`,
           query,
           params

         })
       }
     },
     handleSend (index, row) {
       let safetyId = row.safetyId
       //  console.log(safetyId)
       if (safetyId) {
         this.$confirm('是否确认发送', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
         }) // 点击确定
           .then(() => {
             // 启动流程
             savetyNoticeStart(safetyId).then(result => {
               if (result.data && +result.data.error === 0) {
                 this.$message({
                   type: 'success',
                   message: '发送成功!'
                 })
                 this.refresh()
               } else {
                 this.$message({
                   type: 'error',
                   message: '发送错误!' + result.data.message
                 })
               }
             })
           })
       }
     },
     // 等级过滤器
     noticeLevelFiter (alue, row, column) {
       let sourceData = this.ALL_SELECT_DATA.ANNOUNCEMENT_LEVEL

       let result = sourceDataFilter(sourceData, alue.noticeLevel)
       return result
     },
     // 来源过滤器
     noticeSrcTypeFiter (alue, row, column) {
       let sourceData = this.ALL_SELECT_DATA.ANNOUNCE_RESOURCE

       let result = sourceDataFilter(sourceData, alue.noticeSrcType)
       return result
     },
     noticeTypeFiter (alue) {
       let sourceData = this.ALL_SELECT_DATA.ANNOUNCEMENT_TYPE

       let result = sourceDataFilter(sourceData, alue.noticeType)
       return result
     },
     // 显示更多
     showMoreHandle () {
       this.showMore = !this.showMore

       this.showMoreLabel = this.showMore ? '隐藏' : '更多'
     },
     // 重置按钮
     clearForm () {
       this.notice = {
         noticeLevel: '',
         submitDateStart: '',
         submitDateEnd: '',
         noticeType: '',
         noticeSrcType: '',
         submitDeptName: '',
         deptId: ''

       }
       //  this.daterange = ''
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
         signForTask(taskId, userId).then(result => {
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
     },
     changeClassDept(arr){
       if(arr.length<2){
         this.submitDeptName =[]
       }
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
     },
     notice: {
       handler (data, newdata) {
         if (!newdata.noticeLevel) {
           // 请求的下拉数据
         } else if (newdata.noticeLevel === '1') {
           this.deptNameList = []

           setTimeout(() => {
             this.deptNameList = this.deptNameList1
           }, 0)
           // 请求的下拉数据
         } else if (newdata.noticeLevel === '2') {
           this.deptNameList = []
           setTimeout(() => {
             this.deptNameList = this.deptNameList2
           }, 0)
         }
       },

       deep: true
     }
   },
   created () {
     this.refresh()
   },
   mounted () {
     // 责任部门
     GetDepartmentListFromList(1).then(result => {
       this.deptNameList1 = result
       this.deptNameList = result
     })
     GetDepartmentListFromList(2).then(result => {
       this.deptNameList2 = result
     })
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
