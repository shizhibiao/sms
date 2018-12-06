<template>
  <div class="animated fadeIn">
    <b-card no-body>
    <b-card-header>
        <el-row :gutter="12">
          <el-col :span="20">
            <el-form :inline="true" :model="queryParams">
                <el-form-item label="办理日期">
                <el-date-picker
                :clearable='false'
                    v-model="queryParams.occurDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions2"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" class="text-right">
             <el-button type="primary" size='small'   class='mt-1' @click="querylist">查询</el-button>
          </el-col>
        </el-row>
    </b-card-header>
      <!-- 已办的表格 -->
    <b-card-body>
        <el-form :inline="true" :model="queryParams" label-width="100px">
              <el-table stripe
              :data="datalist"
              size='small'
              style="width: 100%">
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
                label="标题"
                >
              </el-table-column>
              <el-table-column
                prop="reporterName"
                label="报告人"
              >
              </el-table-column>
              <el-table-column
                prop="createDate"
                label="报告日期"
                >
              </el-table-column>
              
              <el-table-column
                prop="occurAddress"
                label="发生地点"
                >
              </el-table-column>
              <el-table-column
                prop="status"
                label="处理状态"
                :formatter="treatmentStateFilter"
              >
              </el-table-column>
              <el-table-column
                prop="taskInfo.startTime"
                label="派发日期"
                >
              </el-table-column>
              <el-table-column
                prop="taskInfo.endTime"
                label="办理日期"
                >
              </el-table-column>
            
              <el-table-column
                fixed="right"
                label="操作"
                >
                <template slot-scope="scope">
                  <el-button  @click="handleClick(scope.$index, scope.row)" size='mini'>查看</el-button>
                </template>
              </el-table-column>
                </el-table>   
        </el-form>
      
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
    </b-card>
  </div>
</template>
<script>
  import axios from 'axios'
  import { sourceDataFilter } from '../../tools'
  import { getBeforeWeek, ransfromProcessState } from '../../filter/reportFilter.js'
  import { formatDate } from '../../utils/index.js'
  export default {
    created () {
      //  let id = this.$store.state.user.userId
      this.querylist()
    },
    methods: {
      reportTypeFiter (alue, row, column) {
        let sourceData = this.REPORT_TYPE
        let result = sourceDataFilter(sourceData, alue.category)
        return result
      },
      handleClick (index, paramas) {
        this.$router.push({path: '/event/modify/' + paramas.eventNumber + '/' + -1})
      },
      treatmentStateFilter (alue, row, column) {
        return ransfromProcessState(alue.status)
      },
      querylist () {
        let data = {
          pageNum: this.curPage - 1,
          pageSize: this.pageSize,
          queryItems: [{
            fieldName: 'startDate',
            value: this.queryParams.occurDate[0]
          }, {
            fieldName: 'endDate',
            value: this.queryParams.occurDate[1]
          }]
        }
        axios.post('/api/incdent/workflow/findEventDOByUser', data)
          .then(res => {
            if (res.data.data === []) {
              this.datalist = []
            }
            this.total = res.data.data.totalElements
            this.totalPages = res.data.data.totalPages
            if (res.data.error === 0) {
              this.datalist = res.data.data.content
            }
          })
      }
    },
    data () {
      return {
        //  总共的数据条数
        total: 0,
        //  每页显示多少数据
        pageSize: 15,
        //  当前页
        curPage: 1,
        totalPages: 1,
        REPORT_TYPE: {
          icts: []
        },
        datalist: [],
        queryParams: {
          occurDate: [getBeforeWeek(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
        },
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
        }
      }
    },
    watch: {
      curPage: function (newval, oldval) {
        this.querylist()
      }
    }
  }
</script>