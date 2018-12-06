<template>
<div class="animated fadeIn">
  <el-row :gutter="12">
    <el-col :span="18">
      <el-form inline :model="dataList" ref="dataList">
        <el-form-item label="日期范围">
            <el-date-picker
            :clearable="false"
            @change="clickDataAction"
            v-model="dataList.occurDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2"
            value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="报告类型" prop="cateGory">
          <el-select
            v-model="dataList.cateGory"
            :clearable='true'
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择">
            <el-option 
              v-for="(item, index) in ALL_SELECT_DATA.REPORT_TYPE.dicts"
              :key="index"
              :label="item.dictName"
              :value="item.dictCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报告部门" prop="identifyDept">
          <el-select
            class='select'
            v-model="dataList.identifyDept"
            :clearable='true'
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择">
            <el-option 
              v-for="(item, index) in deptNameList"
              :key="index"
              :label="item.dept_name"
              :value="item.dept_name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="6" class="text-right">
        <el-button size='small' type="primary" @click="resetBtnData()">重置</el-button>
        <el-button size='small' type="primary" @click="inquireDataList()"
          v-loading.fullscreen.lock="fullscreenLoading">查询</el-button>
        <el-button type="primary" @click="exportExcel()" size='small'>导出</el-button>
    </el-col>
  </el-row>
  <el-card shadow='never'>
    <ve-histogram :data="chartData" :extend="chartExtend" class="vChart" v-if="chartData.rows.length >= 1"></ve-histogram>
    <div v-if="chartData.rows.length < 1" style="text-align: center">暂无数据</div>
  </el-card>
</div>
</template>
<script>
import Vuex from 'Vuex'
import axios from 'axios'
import { getBeforeWeeks } from '../../filter/reportFilter.js'
import { formatDate, downLoad } from "../../utils/index.js"
// 获得部门
// import { GetDepartmentListFromList } from '../../services/safety_notice'

export default {
  data () {
    this.chartExtend = {
      series(v) {
        if (v && v.length > 0) {
          v.forEach(i => {
            i.barMaxWidth = 50;
            i.label = { show: true, position: "top" }
          });
          return v;
        }
      }
    }
    return {
      dataList: {
        occurDate: [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')],
        cateGory: [],
        identifyDept: []
      },
      // 部门数据
      deptNameList: [],
      fullscreenLoading: false,
      // 时间控件
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
      // 图表数据
      chartData: {
        columns: [],
        rows: []
      }
    }
  },
  computed: {
    ...Vuex.mapState(["ALL_SELECT_DATA"])
  },
  methods: {
    inquireDataList () {
      let startDate = this.dataList.occurDate !== null ? `${this.dataList.occurDate[0]}` : getBeforeWeeks(new Date(), 'yyyy-MM-dd')
      let endDate = this.dataList.occurDate !== null ? `${this.dataList.occurDate[1]}` : formatDate((new Date()), 'yyyy-MM-dd')
      let type = this.dataList.cateGory
      let dept = this.dataList.identifyDept
      // console.log(type, dept)
      if (type.length >= 1 && dept.length >= 1) {
        axios.get('/api/report/selectReportStatisticsdepttype?startDate=' + startDate + '&endDate=' + endDate + '&type=' + type + '&dept=' + dept)
        .then(result => {
          if(result.data && result.data.error === 0) {
            let data = result.data.data
            if (data.length > 0) {
              let obj = {}
              data.forEach(item => {
                if (!obj[item.dept_name]){
                  obj[item.dept_name]={}
                }
                if(!obj[item.dept_name][item.dict_name]){
                  obj[item.dept_name][item.dict_name] = item.hj
                }
              })
              let rows = []
              for (var i in obj ) {
                  let arr = {}
                  arr.dept_name = i
                  arr['总计'] = null
                  for(var k in obj[i]){
                      arr[k] = obj[i][k]
                      arr['总计'] += obj[i][k]
                  }
                  rows.push(arr)
              }
              let dict_name = data.map(item =>{
                  return item.dict_name
              })
              let columns = ['dept_name', ...new Set(dict_name), '总计']
              this.chartData = {
                columns,
                rows
              }
            } else {
              this.chartData.columns = []
              this.chartData.rows = []
            }
          } else {
              this.$message.error('查询失败' + result.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
      } else if (type.length >= 1 && dept.length < 1) {
        // console.log(11)
        axios.get('/api/report/selectReportStatisticsdepttype?startDate=' + startDate + '&endDate=' + endDate + '&type=' + type)
        .then(result => {
          if(result.data && result.data.error === 0) {
            let data = result.data.data
            if (data.length > 0) {
              let obj = {}
              data.forEach(item => {
                if (!obj[item.dept_name]){
                  obj[item.dept_name]={}
                }
                if(!obj[item.dept_name][item.dict_name]){
                  obj[item.dept_name][item.dict_name] = item.hj
                }
              })
              let rows = []
              for (var i in obj ) {
                  let arr = {}
                  arr.dept_name = i
                  arr['总计'] = null
                  for(var k in obj[i]){
                      arr[k] = obj[i][k]
                      arr['总计'] += obj[i][k]
                  }
                  rows.push(arr)
              }
              let dict_name = data.map(item =>{
                  return item.dict_name
              })
              let columns = ['dept_name', ...new Set(dict_name), '总计']
              this.chartData = {
                columns,
                rows
              }
              console.log(this.chartData)
            } else {
              this.chartData.columns = []
              this.chartData.rows = []
            }
          } else {
              this.$message.error('查询失败' + result.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
      } else if (type.length < 1 && dept.length >= 1) {
        axios.get('/api/report/selectReportStatisticsdepttype?startDate=' + startDate + '&endDate=' + endDate + '&dept=' + dept)
        .then(result => {
          if(result.data && result.data.error === 0) {
            let data = result.data.data
            if (data.length > 0) {
              let obj = {}
              data.forEach(item => {
                if (!obj[item.dept_name]){
                  obj[item.dept_name]={}
                }
                if(!obj[item.dept_name][item.dict_name]){
                  obj[item.dept_name][item.dict_name] = item.hj
                }
              })
              let rows = []
              for (var i in obj ) {
                  let arr = {}
                  arr.dept_name = i
                  arr['总计'] = null
                  for(var k in obj[i]){
                      arr[k] = obj[i][k]
                      arr['总计'] += obj[i][k]
                  }
                  rows.push(arr)
              }
              let dict_name = data.map(item =>{
                  return item.dict_name
              })
              let columns = ['dept_name', ...new Set(dict_name), '总计']
              this.chartData = {
                columns,
                rows
              }
            } else {
              this.chartData.columns = []
              this.chartData.rows = []
            }
          } else {
              this.$message.error('查询失败' + result.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
      } else {
        axios.get('/api/report/selectReportStatisticsdepttype?startDate=' + startDate + '&endDate=' + endDate)
        .then(result => {
          if(result.data && result.data.error === 0) {
            let data = result.data.data
            if (data.length > 0) {
              let obj = {}
              data.forEach(item => {
                if (!obj[item.dept_name]){
                  obj[item.dept_name]={}
                }
                if(!obj[item.dept_name][item.dict_name]){
                  obj[item.dept_name][item.dict_name] = item.hj
                }
              })
              let rows = []
              for (var i in obj ) {
                  let arr = {}
                  arr.dept_name = i
                  arr['总计'] = null
                  for(var k in obj[i]){
                      arr[k] = obj[i][k]
                      arr['总计'] += obj[i][k]
                  }
                  rows.push(arr)
              }
              let dict_name = data.map(item =>{
                  return item.dict_name
              })
              let columns = ['dept_name', ...new Set(dict_name), '总计']
              this.chartData = {
                columns,
                rows
              }
            } else {
              this.chartData.columns = []
              this.chartData.rows = []
            }
          } else {
              this.$message.error('查询失败' + result.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
      }
      
    },
    // 重置
    resetBtnData () {
      this.$refs.dataList.resetFields()
      this.dataList.occurDate = [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
      // 更新页面数据
      this.inquireDataList()
    },
    // 导出
    exportExcel () {
      if (this.chartData.rows.length >= 1) {
        let startDate = this.dataList.occurDate !== null ? `${this.dataList.occurDate[0]}` : getBeforeWeeks(new Date(), 'yyyy-MM-dd')
        let endDate = this.dataList.occurDate !== null ? `${this.dataList.occurDate[1]}` : formatDate((new Date()), 'yyyy-MM-dd')
        let type = this.dataList.cateGory
        let dept = this.dataList.identifyDept
        if (type.length >= 1 && dept.length >= 1) {
          downLoad(
            "get",
            "/api/report/export/selectReportStatisticsdepttype?startDate=" + startDate + "&endDate=" + endDate + "&type=" + type + "&dept=" + dept,
            false,
            "本期报告类型表"
          )
        } else if (type.length >= 1 && dept.length < 1) {
          downLoad(
            "get",
            "/api/report/export/selectReportStatisticsdepttype?startDate=" + startDate + "&endDate=" + endDate + "&type=" + type,
            false,
            "本期报告类型表"
          )
        } else if (type.length < 1 && dept.length >= 1) {
          downLoad(
            "get",
            "/api/report/export/selectReportStatisticsdepttype?startDate=" + startDate + "&endDate=" + endDate + "&dept=" + dept,
            false,
            "本期报告类型表"
          )
        } else {
          downLoad(
            "get",
            "/api/report/export/selectReportStatisticsdepttype?startDate=" + startDate + "&endDate=" + endDate,
            false,
            "本期报告类型表"
          )
        }
        
      } else {
        this.$message({
          type: 'info',
          message: '请确定图表中有数据再进行导出'
        })
      }
    },
    // 点击时间获取到所有表格数据
    clickDataAction () {
      let startDate = this.dataList.occurDate !== null ? `${this.dataList.occurDate[0]}` : getBeforeWeeks(new Date(), 'yyyy-MM-dd')
      let endDate = this.dataList.occurDate !== null ? `${this.dataList.occurDate[1]}` : formatDate((new Date()), 'yyyy-MM-dd')
      axios.get('/api/report/selectReportStatisticsdepttype?startDate=' + startDate + '&endDate=' + endDate)
        .then(result => {
          if (result.data.error === 0 && result.data.data.length >= 1) {
            let arr = result.data.data
            var hash = {}; 
            arr = arr.reduce(function(item, next) { 
            hash[next.dept_name] ? '' : hash[next.dept_name] = true && item.push(next); 
            return item 
            }, [])
            this.deptNameList = arr
          } else {
            this.deptNameList = []
          }
        })
        .catch(error => {
          this.$message.error('查询失败' + error)
        })
    }
  },
  created () {
    // 初始化数据
    this.inquireDataList()
    // 根据时间获取部门数据
    this.clickDataAction()
    // 立项部门
    // GetDepartmentListFromList(1).then(result => {
    //   this.deptNameList = result
    // })
  }
}
</script>
<style scoped>
/* .vChart{
  position:absolute;
  left:50%;
  transform:translate(-50%,0)
} */
</style>
