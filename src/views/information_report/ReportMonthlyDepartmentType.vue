<template>
<div class="animated fadeIn">
  <el-row :gutter="12">
    <el-col :span="18">
      <el-form inline :model="dataList" ref="dataList">
        <el-form-item label="日期范围">
            <el-date-picker
            :clearable="false"
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
        cateGory: []
      },
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
      let cateGory = this.dataList.cateGory
      if (this.dataList.cateGory.length >= 1) {
        axios.get('/api/report/selectReportStatisticsMonthType?startDate=' + startDate + '&endDate=' + endDate + '&type=' + cateGory)
          .then(result => {
              if(result.data.error === 0) {
                let data = result.data.data
                // console.log(data)
                if (data.length > 0) {
                  let obj = {}
                  data.forEach(item => {
                    if (!obj[item.yearMonth]){
                      obj[item.yearMonth]={}
                    }
                    if(!obj[item.yearMonth][item.dict_name]){
                      obj[item.yearMonth][item.dict_name] = item.hj
                    }
                  })
                  let rows = []
                  for (var i in obj ) {
                      let arr = {}
                      arr.yearMonth = i
                      for(var k in obj[i]){
                          arr[k] = obj[i][k]
                      }
                      rows.push(arr)
                  }
                  let dict_name = data.map(item =>{
                      return item.dict_name
                  })
                  let columns = ['yearMonth', ...new Set(dict_name)]
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
        axios.get('/api/report/selectReportStatisticsMonthType?startDate=' + startDate + '&endDate=' + endDate)
        .then(result => {
            if(result.data.error === 0) {
              let data = result.data.data
              // console.log(data)
              if (data.length > 0) {
                let obj = {}
                data.forEach(item => {
                  if (!obj[item.yearMonth]){
                    obj[item.yearMonth]={}
                  }
                  if(!obj[item.yearMonth][item.dict_name]){
                    obj[item.yearMonth][item.dict_name] = item.hj
                  }
                })
                let rows = []
                for (var i in obj ) {
                    let arr = {}
                    arr.yearMonth = i
                    for(var k in obj[i]){
                        arr[k] = obj[i][k]
                    }
                    rows.push(arr)
                }
                let dict_name = data.map(item =>{
                    return item.dict_name
                })
                let columns = ['yearMonth', ...new Set(dict_name)]
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
      // 刷新页面数据
      this.inquireDataList()
    },
    // 导出
    exportExcel () {
      if (this.chartData.rows.length >= 1) {
        let startDate = this.dataList.occurDate !== null ? `${this.dataList.occurDate[0]}` : getBeforeWeeks(new Date(), 'yyyy-MM-dd')
        let endDate = this.dataList.occurDate !== null ? `${this.dataList.occurDate[1]}` : formatDate((new Date()), 'yyyy-MM-dd')
        let type = this.dataList.cateGory
        if (type.length >= 1) {
          downLoad(
            "get",
            "/api/report/export/selectReportStatisticsMonthType?startDate=" + startDate + "&endDate=" + endDate + "&type=" + type,
            false,
            "月度报告类型表"
          )
        } else {
          downLoad(
            "get",
            "/api/report/export/selectReportStatisticsMonthType?startDate=" + startDate + "&endDate=" + endDate,
            false,
            "月度报告类型表"
          )
        }
      } else {
        this.$message({
          type: 'info',
          message: '请确定图表中有数据再进行导出'
        })
      }
    }
  },
  created () {
    // 初始化数据
    this.inquireDataList()
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
