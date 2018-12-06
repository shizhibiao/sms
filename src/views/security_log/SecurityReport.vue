<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <el-form :inline="true" :model="searchForm" class="form-title" ref='searchForm' label-width="80px">
          <el-row type="flex">

            <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
              <el-form-item label="周期">
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
              <el-form-item label="日志类型">
                <el-select v-model="searchForm.reportType" :clearable='true'>
                  <el-option :label="item.label" :value="item.value" v-for="(item,index) in reportTypeArr"
                             :key='index'></el-option>
                </el-select>
              </el-form-item>



              <el-form-item label="关键字">
                <el-input
                  placeholder="请输入内容"
                  v-model="searchForm.key"
                  clearable>
                </el-input>
              </el-form-item>

              <el-form-item label="上报人">
                <el-select
                  v-model="searchForm.reportUser"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="remoteMethod"
                  :loading="loading">
                  <el-option
                    v-for="item in options4"
                    :key="item.userId"
                    :clearable='true'
                    :label="item.userName"
                    :value="item.userId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" align="right" justify="end">
              <el-button type="primary" @click="clearForm()" size='small'>重置</el-button>
              <el-button type="primary" @click="refresh()" size='small'>查询</el-button>

              <el-button type="primary" @click="exportExcel()" size='small'>导出</el-button>
              <el-button type="success" @click="newReport()" size='small'>新增</el-button>
            </el-col>

          </el-row>
        </el-form>
      </div>

      <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
        <el-table
          :stripe="true"
          :highlight-current-row="true"
          :data="datas"
          size="small"
          style="width: 100%"
          id='user'
        >
          <el-table-column
            label="序号"
            type="index"
            width='40'
          >
          </el-table-column>
          <el-table-column
            label="日志类型"
          >
            <template slot-scope="scopes">
              {{+scopes.row.reportType===1?'部门':'个人'}}
            </template>
          </el-table-column>
          <el-table-column
            label="上报人"
            prop="reportUserName">
          </el-table-column>
          <el-table-column
            label="上报部门"
            prop="reportDeptName"
            v-if='searchForm.reportType==="部门日志"'
          >
          </el-table-column>
          <el-table-column
            label="上报日期"
            prop="reportDate">
          </el-table-column>
          <el-table-column
            label="查看内容"
          >
            <template slot-scope="scope">
              <el-button type="default" size='mini'
                         @click="look(scope.$index, scope.row)">查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
      </el-card>
      <el-dialog title="内容" :visible.sync="dialogFormVisible">
        <el-form :model="contentform">
          <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12">
              <el-form-item label="报告人">
                <el-input disabled v-model="contentform.reportUserName"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
              <el-form-item label="报告日期">
                <el-input disabled v-model="contentform.reportDate"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
              <el-form-item label="报告类型">
                <el-input disabled :value="contentform.reportType===1?'部门':'个人'"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12" v-if='contentform.reportType ===1'>
              <el-form-item label="上报部门">
                <el-input disabled v-model="contentform.reportDeptName"></el-input>
              </el-form-item>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12">

            </div>
            <div class="col-lg-12 col-md-12 col-sm-12">

              <el-form-item label="内容">

                <el-input
                  type="textarea"
                  style="width: 100%"
                  :autosize="{ minRows: 2, maxRows: 20 }"
                  :placeholder="contentform.content"

                  disabled
                >
                </el-input>

              </el-form-item>


            </div>

          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>


    </b-card>
  </div>
</template>
<script>
  import {formatDate} from '../../utils/index.js'
// import { API } from '@/api/index.js'
import axios from 'axios'
import Vuex from 'vuex'
import {sourceDataFilter, monthData} from '../../tools'
import {getDepartmentList} from '../../services/safety_notice'

export default {
    data () {
      return {
        daterange: [
          formatDate(new Date(), 'yyyy-MM') + '-01',
          formatDate(new Date(), 'yyyy-MM-dd')
        ],
        pickerOptions2: {
          shortcuts: [
            {
              text: '最近一天',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近三天',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近一周',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近一月',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        },
        searchForm: {},
        datas: [],
        total: 0,
        curPage: 1,
        pageSize: 15,
        totalPages: 1,
        form: {
          queryItems: []
        },
        qItem: {
          fieldName: '',
          value: ''
        },
        activeName: 'user',
        reportTypeArr: [
          {
            value: 0,
            label: '个人日志'
          },
          {
            value: 1,
            label: '部门日志'
          }
        ],
        options4: [],
        loading: false,
        deptNameList: [],
        deptName: [],
        dialogFormVisible: false,
        contentform: {}
      }
  },
    computed: {
      ...Vuex.mapState(['ALL_SELECT_DATA'])
    },
    created () {
      getDepartmentList().then(result => {
        this.deptNameList = result
        console.log(result)
      })
      this.refresh()
  },
    watch: {
      curPage: function (newValue, oldValue) {
        this.refresh()
      }
    },
    methods: {
      refresh () {
        this.initData()
        this.transformData()
        this.loadData()
        // 请求列表详情
        this.form.pageNum = this.curPage - 1
        this.form.pageSize = this.pageSize
        axios.post('/api/securitylog/list', this.form).then(result => {
          if (result.data && result.data.error === 0 && result.data.data) {
            // console.log(result)
            let data = result.data.data
            this.datas = data.content
            this.total = data.totalElements
            this.totalPages = data.totalPages
          } else {
            this.total = 0
            this.curPage = 1
            this.pageSize = 15
            this.totalPages = 1
          }
        })
      },
      // 初始化
      initData () {
        this.form.queryItems = []
        this.datas = []
      },
      // 处理日期
      transformData () {
        this.searchForm.reportDateStart =
          this.daterange && this.daterange.length > 0 ? this.daterange[0] : ''
        this.searchForm.reportDateEnd =
          this.daterange && this.daterange.length > 1 ? this.daterange[1] : ''
      },
      //  去重查询数据
      loadData () {
        let result = Object.keys(this.searchForm).filter(item => {
          if (this.searchForm[item] instanceof Array) {
            return this.searchForm[item].length > 0
          } else {
            return this.searchForm[item] !== '' || undefined || null
          }
        })
        result.forEach(item => {
          this.qItem = {
            fieldName: item,
            value: this.searchForm[item]
          }
          this.form.queryItems.push(this.qItem)
        })
      },
      remoteMethod (query) {
        if (query !== '') {
          this.loading = true
          console.log('chufale')
          axios
            .get('/api/system/user/search?userNo=' + query)
            .then(result => {
              this.loading = false
              console.log(result)
              if (result.data && result.data.error === 0 && result.data.data) {
                //   this.list =result.data.data
                this.options4 = result.data.data
              }
            })
            .catch(error => {
              this.loading = false
              console.log(error)
            })
        } else {
          this.options4 = []
        }
      },
      handleClick () {
        this.datas = []
        this.total = 0
        this.curPage = 1
        this.pageSize = 15
        this.totalPages = 1
      },
      newReport () {
        this.$router.push({
          path: '/log/new'
        })
      },
      clearForm () {
        this.searchForm = {
          reportType: '',
          reportUser: '',
          reportDateStart: '',
          reportDateEnd: '',
          key: ''
        }
        this.total = 0
        this.curPage = 1
        this.pageSize = 15
        this.totalPages = 1
        this.refresh()
  
        this.daterange = [
          formatDate(new Date(), 'yyyy-MM') + '-01',
          formatDate(new Date(), 'yyyy-MM-dd')
        ]
        this.refresh()
      },
      exportExcel () {
        axios({
          method: 'post',
          url: '/api/securitylog/export',
          responseType: 'blob',
          data: this.form
        }).then(res => {
          let blob = new Blob([res.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          })
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = '日志下载' + '.xls' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href)
        })
      },
      look (index, row) {
        // console.log(row)
        this.contentform = row
        this.$nextTick(() => {
          // console.log(this.contentform)
          this.dialogFormVisible = true
        })
      },
      endLook () {
        this.dialogFormVisible = false
        this.contentform = {}
      }
    }
  }
</script>
