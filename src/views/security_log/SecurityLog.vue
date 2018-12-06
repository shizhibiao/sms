<template>
    <div class="animated fadeIn">
        <b-card  no-body>
            <el-tabs  type="border-card"  v-model="activeName" @tab-click="handleClick">
                <el-form :inline="true" :model="searchForm" class="form-title" ref='searchForm' label-width="80px">
                    <el-row type="flex">

                        <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                          <el-form-item label="周期" >
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
                                <el-form-item label="业务类型">
                                    <el-select v-model="searchForm.taskType" :clearable='true' >
                                        <el-option :label="item.label" :value="item.value" v-for= "(item,index) in taskTypeArr" :key ='index'></el-option>
                                    </el-select>
                                </el-form-item>



                                <el-form-item label="关键字" >
                                    <el-input
                                        placeholder="请输入内容"
                                        v-model="searchForm.key"
                                        clearable>
                                    </el-input>
                                </el-form-item>

                                <el-form-item label="处理人" v-if="activeName==='user'">
                                    <el-select
                                        v-model="searchForm.userId"
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
                                <el-form-item label="部门" v-if="activeName==='dept'">
                                    <el-cascader
                                            :options="deptNameList"
                                            :show-all-levels="false"
                                            change-on-select
                                            v-model="deptName"
                                            :clearable='true'
                                            :props="{
                                                value:'deptId',
                                                label:'label',
                                                children:'children'
                                            }"
                                            @change="changeClassDept"
                                        ></el-cascader>
                                </el-form-item>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" align="right" justify="end">
                          <el-button type="primary" @click="clearForm()" size='small'>重置</el-button>
                                <el-button type="primary" @click="refresh()" size='small'>查询</el-button>

                                <el-button type="primary" @click="exportExcel()" size='small'>导出</el-button>
                        </el-col>

                    </el-row>
                </el-form>




                <el-tab-pane label="个人业务统计" name="user" :lazy="true">
                    <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
                        <el-table
                            :stripe="true"
                            :highlight-current-row ="true"
                            :data="datas"
                            size="small"
                            style="width: 100%"
                            id ='user'
                            >
                            <el-table-column
                            label="序号"
                            type="index"
                            width='40'
                            >
                            </el-table-column>
                            <el-table-column
                            label="业务类型"
                            prop="taskType"

                            >
                            </el-table-column>
                            <el-table-column
                            label="业务类型细分"
                            prop="taskName">
                            </el-table-column>
                            <el-table-column
                            label="项目名称"
                            prop="billTitle">
                            </el-table-column>
                            <el-table-column
                            label="状态"
                            >
                                <template slot-scope="scopes">
                                        {{+scopes.row.status===2?'已办理':'已签收'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                            label="处理人"
                            prop="processUserName"
                            >

                            </el-table-column>
                            <el-table-column
                            label="处理时间"
                            prop="logTime"
                            >
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


                </el-tab-pane>
                <el-tab-pane label="部门业务数据" name="dept" :lazy="true">
                    <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
                        <el-table
                            :stripe="true"
                            :highlight-current-row ="true"
                            :data="datas"
                            size="small"
                            style="width: 100%"
                            id ='dept'
                            >
                            <el-table-column
                            label="序号"
                            type="index"
                            width='40'
                            >
                            </el-table-column>
                            <el-table-column
                            label="业务类型"
                            prop="taskType"

                            >
                            </el-table-column>
                            <el-table-column
                            label="业务类型细分"
                            prop="taskName">
                            </el-table-column>
                            <el-table-column
                            label="处理部门"
                            prop="processDeptName">
                            </el-table-column>
                            <el-table-column
                            label="项目名称"
                            prop="billTitle">
                            </el-table-column>
                            <el-table-column
                            label="状态"
                            >
                                <template slot-scope="scopes">
                                        {{+scopes.row.status===2?'已办理':'已签收'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                            label="处理人"
                            prop="processUserName"
                            >

                            </el-table-column>
                            <el-table-column
                            label="处理时间"
                            prop="logTime"
                            >
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
                </el-tab-pane>
            </el-tabs>
        </b-card>
    </div>
</template>
<script>
import { formatDate } from '../../utils/index.js'
// import { API } from '@/api/index.js'
import axios from 'axios'
import Vuex from 'vuex'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { sourceDataFilter, monthData } from '../../tools'
import {
  getDepartmentList
} from '../../services/safety_notice'

var idTmr
function getExplorer () {
  var explorer = window.navigator.userAgent
  // ie
  if (explorer.indexOf('MSIE') >= 0) {
    return 'ie'
  }
  // firefox
  else if (explorer.indexOf('Firefox') >= 0) {
    return 'Firefox'
  }
  // Chrome
  else if (explorer.indexOf('Chrome') >= 0) {
    return 'Chrome'
  }
  // Opera
  else if (explorer.indexOf('Opera') >= 0) {
    return 'Opera'
  }
  // Safari
  else if (explorer.indexOf('Safari') >= 0) {
    return 'Safari'
  }
}
function method1 (tableid) { // 整个表格拷贝到EXCEL中
  if (getExplorer() == 'ie') {
    console.log(1)
    var curTbl = document.getElementById(tableid)
    var oXL = new ActiveXObject('Excel.Application')

    // 创建AX对象excel
    var oWB = oXL.Workbooks.Add()
    // 获取workbook对象
    var xlsheet = oWB.Worksheets(1)
    // 激活当前sheet
    var sel = document.body.createTextRange()
    sel.moveToElementText(curTbl)
    // 把表格中的内容移到TextRange中
    sel.select
    // 全选TextRange中内容
    sel.execCommand('Copy')
    // 复制TextRange中内容
    xlsheet.Paste()
    // 粘贴到活动的EXCEL中
    oXL.Visible = true
    // 设置excel可见属性

    try {
      var fname = oXL.Application.GetSaveAsFilename('Excel.xls', 'Excel Spreadsheets (*.xls), *.xls')
    } catch (e) {
      print('Nested catch caught ' + e)
    } finally {
      oWB.SaveAs(fname)

      oWB.Close(savechanges = false)
      // xls.visible = false;
      oXL.Quit()
      oXL = null
      // 结束excel进程，退出完成
      // window.setInterval("Cleanup();",1);
      idTmr = window.setInterval('Cleanup();', 1)
    }
  } else {
    let tab = document.getElementById(tableid)
    tableToExcel(tab, '')
  }
}
function Cleanup () {
  window.clearInterval(idTmr)
  CollectGarbage()
}
var tableToExcel = (function () {
  var uri = 'data:application/vnd.ms-excel;base64,',
    template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="https://www.w3.org/TR/html401"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
    base64 = function (s) {
      return window.btoa(unescape(encodeURIComponent(s)))
    },
    // 下面这段函数作用是：将template中的变量替换为页面内容ctx获取到的值
    format = function (s, c) {
      return s.replace(/{(\w+)}/g,
        function (m, p) {
          return c[p]
        }
      )
    }
  return function (table, name) {
    if (!table.nodeType) {
      table = document.getElementById(table)
    }
    // 获取表单的名字和表单查询的内容
    var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
    window.location.href = uri + base64(format(template, ctx))
  }
})()
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
      taskTypeArr: [{
        value: '信息上报',
        label: '信息上报'
      }, {
        value: '飞行品质',
        label: '飞行品质'
      }, {
        value: '事件调查',
        label: '事件调查'
      }, {
        value: '安全监察',
        label: '安全监察'
      }, {
        value: '安全通知',
        label: '安全通知'
      }, {
        value: '风险管理',
        label: '风险管理'
      }, {
        value: '危险源',
        label: '危险源'
      }],
      options4: [],
      loading: false,
      deptNameList: [],
      deptName: []

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
    // exportExcel () {
    //   if (this.activeName === 'user') {
    //     var wb = XLSX.utils.table_to_book(document.querySelector('#user'))
    //     var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
    //     try {
    //         FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '个人业务统计.xlsx')
    //     } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
    //     return wbout
    //     // 本期来源
    //   } else if (this.activeName === 'dept') {
    //     var wb = XLSX.utils.table_to_book(document.querySelector('#dept'))
    //     var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
    //     try {
    //         FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '部门业务数据.xlsx')
    //     } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
    //     return wbout
    //   }
    // },
    refresh () {
      this.initData()
      this.transformData()
      this.loadData()
      // 请求列表详情
      this.form.pageNum = this.curPage - 1
      this.form.pageSize = this.pageSize
      console.log(this.form)

      if (this.activeName === 'user') {
        axios.post('/api/securitylog/personal', this.form).then(result => {
          console.log(result)
          if (result && result.data && result.data.data && result.data.data.content && result.data.error === 0) {
            let data = result.data.data
            this.datas = data.content
            this.total = data.totalElements
            this.totalPages = data.totalPages
            //  console.log(result)
          } else {
            this.total = 0
            this.curPage = 1
            this.pageSize = 15
            this.totalPages = 1
          }
        })
        // 本期来源
      } else if (this.activeName === 'dept') {
        axios.post('/api/securitylog/depart', this.form).then(result => {
          console.log(result)
          if (result && result.data && result.data.data && result.data.data.content && result.data.error === 0) {
            let data = result.data.data
            this.datas = data.content
            this.total = data.totalElements
            this.totalPages = data.totalPages
            //  console.log(result)
          }
        })
      }
    },
    // 初始化
    initData () {
      this.form.queryItems = []
      this.datas = []
    },
    // 处理日期
    transformData () {
      this.searchForm.logTimeStart =
        this.daterange && this.daterange.length > 0 ? this.daterange[0] : ''
      this.searchForm.logTimeEnd =
        this.daterange && this.daterange.length > 1 ? this.daterange[1] : ''
      this.searchForm.processDeptName = this.deptName.length > 0 ? this.deptName[this.deptName.length - 1] : ''
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
        axios.get('/api/system/user/search?userNo=' + query).then(result => {
          this.loading = false
          console.log(result)
          if (result.data && result.data.error === 0 && result.data.data) {
            //   this.list =result.data.data
            this.options4 = result.data.data
          }
        }).catch(error => {
          this.loading = false
          console.log(error)
        })
      } else {
        this.options4 = []
      }
    },
    handleClick () {
      this.datas = []
      this.refresh()
    },
    clearForm () {
      this.searchForm = {
        logTimeStart: '',
        logTimeEnd: '',
        processDeptName: '',
        processUserName: '',
        key: ''
      }
      this.total = 0
      this.curPage = 1
      this.pageSize = 15
      this.totalPages = 1
      this.daterange = [
        formatDate(new Date(), 'yyyy-MM') + '-01',
        formatDate(new Date(), 'yyyy-MM-dd')
      ]
      this.refresh()
    },
    changeClassDept(arr){
      console.log(arr)
      if(arr.length<2){
        this.deptName =[]
      }
      if(arr.length>2){
        this.deptName.pop()
      }
    }
    // exportExcel () {
    //   if (this.activeName === 'user') {
    //     method1('user')
    //     // 本期来源
    //   } else if (this.activeName === 'dept') {
    //     method1('dept')
    //   }
    // }
  }
}
</script>
