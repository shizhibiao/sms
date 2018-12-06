<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <el-form :inline="true"
                 :model="notice"
                 class="form-title">
          <el-row :gutter="5">
            <el-col :xs="22"
                    :sm="22"
                    :md="22"
                    :lg="22"
                    :xl="22">
              <el-form-item label="办理日期"
                            style="width: auto">
                <el-date-picker v-model="daterange"
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
            <el-col :xs="2"
                    :sm="2"
                    :md="2"
                    :lg="2"
                    :xl="2"
                    align="right">
              <el-button type="primary"
                         @click="refresh()"
                         size='small'
                         class='mt-1'>查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <b-card-body>
        <template>
          <el-table :stripe="true"
                    size="small"
                    :highlight-current-row="true"
                    :data="tableData"
                    style="width: 100%">
            <el-table-column label="#"
                             type="index"
                             width="50">
            </el-table-column>
            <el-table-column label="责任部门"
                             prop="deptName">
            </el-table-column>
            <el-table-column label="项目名称"
                             prop="evaluetionName">
            </el-table-column>
            <el-table-column label="考核时间"
                             prop="evaluetionTime">
            </el-table-column>
            <el-table-column label="考核分数"
                             prop="evaluetionScore">
            </el-table-column>
            <!-- <el-table-column label="分数级别"
                             prop="evaluetionLevel">
            </el-table-column> -->
            <el-table-column label="评审人"
                             prop="evaluetionUserName">
              <template slot-scope="scope">
                <span>{{scope.row.evaluetionUserName | str1}}</span>
              </template>
            </el-table-column>
            <el-table-column label="考核周期开始时间"
                             prop="evaluetioinStartTime">
            </el-table-column>
            <el-table-column label="考核周期结束时间"
                             prop="evaluetionEndTime">
            </el-table-column>
            <el-table-column label="派发日期"
                             prop="taskInfo.startTime">
            </el-table-column>
            <el-table-column label="办理日期"
                             prop="taskInfo.endTime">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size='mini'
                           @click="lookAction(scope.$index, scope.row)">
                  查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <b-row>
          <b-col md="12"
                 class="my-1 mt-1"
                 v-if="totalPages>1">
            <el-pagination background
                           layout="total, prev, pager, next, jumper"
                           :total="total"
                           :current-page.sync="curPage"
                           :page-size="pageSize"
                           :pager-count="5"
                           align="right"></el-pagination>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>

  </div>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
import { formatDate } from '../../utils/index.js'
import { done } from '../../services/safety_supervision'
export default {
  data () {
    return {
      notice: {},
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
      tableData: [],
      total: 0,
      curPage: 1,
      pageSize: 15,
      totalPages: 1,
      page: {
        orderby: '',
        pageNum: 0,
        pageSize: 15,
        queryItems: []
      },
      qItem: {
        fieldName: '',
        matchType: '',
        value: ''
      }
    }
  },
  filters: {
    str1 (val) {
      let val1 = val.replace(/\"/g, "")
      return val1.replace(/\[|]/g, '')
    }
  },
  methods: {
    lookAction (index, row) {
      let lookUrl = '/performance/testlook'
      this.$router.push({
        path: lookUrl,
        query: {
          id: row.evaluetionId
        }
      })
    },
    refresh () {
      let data = [{
        fieldName: 'projectStartDate',
        value: this.daterange ? this.daterange[0] : ''
      },
      {
        fieldName: 'projectEndDate',
        value: this.daterange ? this.daterange[1] : ''
      }]
      this.page.queryItems = data
      this.queryList()
    },
    filerTypeHandle (data) {
      switch (data) {
        case -2:
          return '关闭流程'
        case -1:
          return '新建'
        case 0:
          return '表单填写'
        case 1:
          return '单元审核'
        case 2:
          return '部门审核'
        case 3:
          return '公司批准'
        case 4:
          return '结束'
        default:
          return ''
      }
    },
    // 查询列表信息
    queryList () {
      axios.post('/api/performance_evaluetion/process/done', (this.user.userId, this.page))
        .then(res => {
          // console.log(res)
          if (res.data.data) {
            this.tableData = res.data.data.content
            this.total = res.data.data.totalElements
            this.totalPages = res.data.data.totalPages
          } else {
            this.tableData = []
          }
        })
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  watch: {
    curPage (newvalue, old) {
      this.page.pageNum = newvalue - 1
      this.queryList()
    }
  },
  mounted () {
    this.queryList()
  }
}
</script>

<style scoped>
</style>