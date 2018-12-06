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
              <el-form-item label="实际实施时间"
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
              <el-form-item label="测试项目"
                            prop='sapdProname'>
                <el-select v-model="info.sapdProname"
                           :clearable='true'>
                  <el-option :label="item.dictName"
                             :value="item.dictName"
                             v-for="(item,index) in noticeTypeList"
                             :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="被测试部门"
                            prop="sapdDeptName">
                <el-select v-model="info.sapdDeptName"
                           value-key='deptId'
                           :clearable='true'>
                  <el-option :label="item.deptName"
                             :value="item"
                             v-for="(item,index) in deptNameList"
                             :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="结论"
                            label-width="100px"
                            prop="sapdResult">
                <el-select v-model="info.sapdResult"
                           :clearable='true'>
                  <el-option :label="item.dictName"
                             :value="item.dictName"
                             v-for="(item,index) in resultList"
                             :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"
                  class="text-right">
            <!-- <el-button type="info"
                       size='small'
                       @click="resetAction()"
                       v-if="true">
              重置</el-button> -->
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
            <el-table-column label="测试项目"
                             prop="sapdProname">
            </el-table-column>
            <el-table-column label="测试要点"
                             prop="sapdDesc1">
            </el-table-column>
            <el-table-column label="涉及部门"
                             prop="sapdRedeptName">
            </el-table-column>
            <el-table-column label="测试人"
                             prop="sapdCheckerName">
            </el-table-column>
            <el-table-column label="结论"
                             prop="sapdResult">
            </el-table-column>
            <el-table-column label="测试情况简述"
                             prop="sapdDesc2">
            </el-table-column>
            <el-table-column label="操作"
                             width="200">
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
import { conditionGetDepartmentList, getTestConclusion, getTestProject } from '../../services/safety_supervision'
export default {
  name: 'SecurityTest',
  data () {
    return {
      deptNameList: [],
      resultList: [],
      noticeTypeList: [],
      info: {
        // 测试项目
        sapdProname: '',
        // 处理状态
        procStatus: '',
        // 开始日期
        submitDateStart: '',
        // 结束日期
        submitDateEnd: '',
        // 被测试部门
        sapdDeptName: '',
        // 结论
        sapdResult: ''
      },
      // 日期表
      daterange: [formatDate(
        new Date(),
        "yyyy-MM"
      ) + '-01',
      formatDate(new Date(), "yyyy-MM-dd")],
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
    lookAction (index, row) {
      let lookUrl = '/security/testlook'
      this.$router.push({
        path: lookUrl,
        query: {
          id: row.sapdSapId
        }
      })
    },
    resetAction () {
      this.$refs['query'].resetFields()
    },
    // 查询按钮
    refresh () {
      let data = [
        {
          fieldName: 'sapdProname',
          value: this.info.sapdProname ? this.info.sapdProname : null
        },
        {
          fieldName: 'sapdDealdateStart',
          value: this.daterange ? this.daterange[0] : null
        },
        {
          fieldName: 'sapdDealdateEnd',
          value: this.daterange ? this.daterange[1] : null
        },
        {
          fieldName: 'sapdDept',
          value: this.info.sapdDeptName ? this.info.sapdDeptName.deptId : null
        },
        {
          fieldName: 'sapdResult',
          value: this.info.sapdResult ? this.info.sapdResult : null
        }
      ]
      this.form.queryItems = data
      this.queryList()
    },
    queryList () {
      // 查询列表页
      // console.log(this.form)
      axios.post('/api/securitytest/detail/list', (this.form))
        .then((res) => {
          // console.log(res)
          if (res.data.data) {
            let data = res.data.data.content
            // data.forEach(item => {
            //   // item.sapdChecker = this.ax(item.sapdChecker)
            //   axios.get('/api/system/user/' + item.sapdChecker).then(user => {
            //     item.sapdChecker = user.data.data.userName
            //   })  
            // })
            this.tableData = data
            this.total = res.data.data.totalElements
            this.totalPages = res.data.data.totalPages
          } else {
            this.tableData = []
            this.total = 0
            this.totalPages = 1
          }
        })
        .catch((error) => { console.log(error) })
    }
  },
  mounted () {
    conditionGetDepartmentList(1).then(result => {
      // console.log(result)
      this.deptNameList = result
    })
    getTestConclusion().then(res => {
      this.resultList = res
    })
    getTestProject().then(res => {
      this.noticeTypeList = res
    })
    this.queryList()
  },
}
</script>

