<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header"
           >
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
            <el-table-column label="项目名称"
                             prop="entryName">
            </el-table-column>
            <el-table-column label="监察审计类型"
                             prop="monitorType">
            </el-table-column>
            <el-table-column label="监察审计等级"
                             prop="monitorGrade">
            </el-table-column>
            <el-table-column label="立项部门"
                             prop="establishmenDepartment">
            </el-table-column>
            <el-table-column label="立项日期"
                             prop="dateTime">
            </el-table-column>
            <el-table-column label="状态"
                             prop="procStatus2">
            </el-table-column>
            <el-table-column label="派发日期"
                             prop="taskInfo.startTime">
            </el-table-column>
            <el-table-column label="办理日期"
                             prop="taskInfo.endTime">
            </el-table-column>
            <el-table-column label="操作"
                             >
              <template slot-scope="scope">
                <el-button size='mini'
                           @click="lookAction(scope.$index, scope.row)">
                  查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <b-row>
          <!-- <b-col sm="12"
                 v-if="totalPages>1">
            <b-pagination size="md"
                          :total-rows="total"
                          v-model="curPage"
                          :per-page="pageSize"
                          :limit="5"
                          align="right">
            </b-pagination>
          </b-col> -->
          <b-col md="12" class="my-1 mt-1"
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
import { formatDate } from '../../utils/index.js'
import { done, getMonitoringType } from '../../services/safety_supervision'
export default {
  name: 'SupervisionDone',
  data () {
    return {
      notice: {
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
  methods: {
    lookAction (index, row) {
      let url = '/monitor/look/' + 2
      this.$router.push({
        path: url,
        query: {
          id: row.id,
          status: row.procStatus
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
      this.tableData = []
      this.queryList()
    },
    filerTypeHandle (data) {
      switch (data) {
        case -2:
          return '驳回'
        case -1:
          return '新建'
        case 0:
          return '立项审核'
        case 1:
          return '监察审计计划'
        case 2:
          return '子流程'
        case 3:
          return '监察审计结果'
        case 4:
          return '结束'
        default:
          return ''
      }
    },
    // 查询列表信息
    queryList () {
      done(this.user.userId, this.page)
        .then(res => {
          // console.log(res)
          let data = res.data.data.content
          if (data) {
            data.map(item => {
              let monitoringType = this.monitorList.find(type => {
                return type.dictId == item.monitorType//eslint-disable-line
              })
              item.entryName = item.projectName
              item.monitorType = monitoringType.dictName
              item.monitorGrade = item.projectLevel === '1' ? '公司' : '部门'
              item.establishmenDepartment = item.deptName
              item.dateTime = formatDate(new Date(item.projectStartDate), 'yyyy-MM-dd')
              item.procStatus2 = this.filerTypeHandle(item.procStatus)
              this.tableData.push(item)
            })
            this.total = res.data.data.totalElements
            this.totalPages = res.data.data.totalPages
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
      this.tableData = []
      this.queryList()
    }
  },
  mounted () {
    // console.log(this.user.deptId)
    getMonitoringType().then(result => {
      // console.log(result)
      this.monitorList = result
      return done(this.userId, this.page)
    })
      .then(res => {
        // console.log(res)
        let data = res.data.data.content
        if (data) {
          data.map(item => {
            let monitoringType = this.monitorList.find(type => {
              return type.dictId == item.monitorType//eslint-disable-line
            })
            item.entryName = item.projectName
            item.monitorType = monitoringType.dictName
            item.monitorGrade = item.projectLevel === '1' ? '公司' : '部门'
            item.establishmenDepartment = item.deptName
            item.dateTime = formatDate(new Date(item.projectStartDate), 'yyyy-MM-dd')
            item.procStatus2 = this.filerTypeHandle(item.procStatus)
            this.tableData.push(item)
          })
          this.total = res.data.data.totalElements
          this.totalPages = res.data.data.totalPages
        }
      })
  }
}
</script>

<style scoped>
</style>
