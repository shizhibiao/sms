<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
        <el-row>
          <el-col :span="20">
            <el-form :inline="true"
                     :model="info"
                     label-position="left"
                     class="form-title"
                     ref="query">
              <el-form-item label="计划实施时间"
                            prop="daterange">
                <el-date-picker v-model="daterange"
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
              <el-form-item label="标题"
                            prop="title">
                <el-input v-model="info.title"
                          placeholder=""
                          ></el-input>
              </el-form-item>
              <el-form-item label="处理状态"
                            prop="procStatus">
                <el-select v-model="info.procStatus"
                           class='select'
                           :clearable='true'>
                  <el-option v-for='item in stateList'
                               :label="item.deptName"
                               :value="item.deptId"
                               :key='item.deptId'></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"
                  class="text-right">
            <el-button type="info"
                       size='small'
                       @click="resetAction()"
                       v-if="true">
              重置</el-button>
            <el-button type="success"
                       @click="addNew()"
                       size='small'>
              新增</el-button>
            <el-button type="primary"
                       @click="refresh()"
                       size='small'>
              查询</el-button>
          </el-col>
        </el-row>
      </b-card-header>
      <b-card-body>
        <template>
          <el-table :stripe="true"
                    :highlight-current-row="true"
                    :data="tableData"
                    size="small"
                    style="width: 100%">
            <el-table-column label="#"
                             type="index"
                             width="50">
            </el-table-column>
            <el-table-column label="编号"
                             prop="number">
            </el-table-column>
            <el-table-column label="标题"
                             prop="title">
            </el-table-column>
            <el-table-column label="制定人"
                             prop="planners">
            </el-table-column>
            <el-table-column label="制定日期"
                             prop="settingDate">
            </el-table-column>
            <el-table-column label="计划实施时间"
                             prop="implementationTime">
            </el-table-column>
            <el-table-column label="处理状态"
                             prop="procStatus">
            </el-table-column>
            <el-table-column label="操作"
                             width="200">
              <template slot-scope="scope">
                <el-button size='mini'
                           v-if='scope.row.flag === 2'
                           @click="lookAction(scope.$index, scope.row)">
                  查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <b-row>
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
import axios from 'axios'
import { formatDate } from '../../utils/index.js'
export default {
  name: 'SecurityTestPlan',
  data () {
    return {
      info: {
        // 标题
        title: '',
        // 处理状态
        procStatus: '',
        // 开始日期
        submitDateStart: '',
        // 结束日期
        submitDateEnd: ''
      },
       // 日期表
      daterange: [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
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
      form: {
        orderby: '',
        pageNum: 0,
        pageSize: 15,
        queryItems: []
      }
    }
  },
  computed: {
     ...Vuex.mapState({
      user: 'user'
    })
  },
  watch: {
    curPage (newvalue, old) {
      this.form.pageNum = newvalue - 1
      this.queryList()
    }
  },
  methods: {
    resetAction () {
      this.$refs['query'].resetFields()
    },
    addNew () {
      // this.count++
      let url = '/security/testplan/edit'
      this.$router.push({ path: url })
    },
    // 查询按钮
    refresh () {
      let data = [
        {
          fieldName: 'title',
          value: this.info.title
        },
        {
          fieldName: 'procStatus',
          value: this.info.procStatus
        },
        {
          fieldName: 'projectStartDate',
          value: this.daterange ? this.daterange[0] : ''
        },
        {
          fieldName: 'projectEndDate',
          value: this.daterange ? this.daterange[1] : ''
        }
      ]
      this.form.queryItems = data
      this.queryList()
    },
    lookAction (index, row) {
      let url = '/security/testplan/look'
      this.$router.push({
        path: url,
        query: {
          id: row.id
        }
      })
    },
    queryList () {
      // 查询列表页
      axios.post(`${API.DEMAND_SECURITY_SUPERVISION_LIST}`, (this.userId, this.form))
        .then((response) => {
          // console.log(response)
          let data = response.data.data.content
          console.log(data)
          data.map((item, index) => {
            let monitoringType = this.monitoringList.find(type => {
              return type.dictId == item.monitorType//eslint-disable-line
            })
            let departmentList = item.monitorDept.split(',').map(name => {
              return name + '\n'
            })

            // console.log(item.monitorDept.split(','))
            item.entryName = item.projectName
            item.monitoringType = monitoringType ? monitoringType.dictName : ''  // monitoringType.dictName || ''
            item.monitoringGrade = item.projectLevel === '1' ? '公司' : '部门'
            item.establishmenDepartment = item.deptName
            item.dateTime = formatDate(new Date(item.projectStartDate), 'yyyy-MM-dd')
            item.supervisedDepartment = departmentList
            item.procStatus2 = this.filerTypeHandle(item.procStatus)
            item.rmDepartmentDOList = []
            this.datas.push(item)
            // if (item.procStatus === -1) {
            //   let temp = null
            //   temp = this.datas[index]
            //   this.datas[index] = this.datas[0]
            //   this.datas[0] = temp
            // }
          })
          this.total = response.data.data.totalElements
          this.totalPages = response.data.data.totalPages
          // console.log(this.datas)
        })
        .catch((error) => { console.log(error) })
    }
  },
  mounted() {
    this.queryList()
  },
}
</script>

