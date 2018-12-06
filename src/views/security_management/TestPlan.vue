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
                          clearable
                          placeholder=""></el-input>
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
            <el-button type="success"
                       @click="addNew()"
                       size='small'>
              新增</el-button>
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
            <el-table-column label="标题"
                             prop="sapTitile">
            </el-table-column>
            <el-table-column label="制定人"
                             prop="sapCreatebyName">
            </el-table-column>
            <el-table-column label="制定日期"
                             prop="sapCreateDate">
            </el-table-column>
            <el-table-column label="计划实施时间"
                             prop="sapDate">
            </el-table-column>
            <el-table-column label="处理状态"
                             prop="sapStatus">
            </el-table-column>
            <el-table-column label="操作"
                             width="200">
              <template slot-scope="scope">
                <el-button size='mini'
                           @click="lookAction(scope.$index, scope.row)">
                  查看</el-button>
                <el-button size='mini'
                           type="success"
                           @click="EditAction(scope.$index, scope.row)">
                  编辑</el-button>
                <el-button type="danger"
                           size='mini'
                           @click="handleDelete(scope.$index, scope.row)">
                  删除</el-button>
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
export default {
  name: 'TestPlan',
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
          id: row.sapId
        }
      })
    },
    handleDelete (index, row) {
      let id = row.sapId
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios.delete('/api/securitytest/' + id)
            .then(response => {
              // console.log(response)
              if (response.data.data) {
                this.queryList()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              } else if (response.data.error !== 0) {
                this.$message.error(response.data.message)
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
    },
    resetAction () {
      this.$refs['query'].resetFields()
    },
    addNew () {
      // this.count++
      let url = '/security/testadd'
      this.$router.push({ path: url })
    },
    // 查询按钮
    refresh () {
      let data = [
        {
          fieldName: 'sapTitile',
          value: this.info.title
        },
        {
          fieldName: 'sapDateStart',
          value: this.daterange ? this.daterange[0] : null
        },
        {
          fieldName: 'sapDateEnd',
          value: this.daterange ? this.daterange[1] : null
        }
      ]
      this.form.queryItems = data
      this.queryList()
    },
    EditAction (index, row) {
      let url = '/security/testedit'
      this.$router.push({
        path: url,
        query: {
          id: row.sapId
        }
      })
    },
    queryList () {
      // 查询列表页
      // console.log(this.form)
      axios.post('/api/securitytest/list', (this.form))
        .then((res) => {
          // console.log(res)
          if (res.data.data) {
            this.tableData = res.data.data.content
            this.tableData.forEach(item => {
              item.sapStatus = item.sapStatus == 0 ? '编辑' : ''
            })
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
    this.queryList()
  },
}
</script>

