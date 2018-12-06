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
                    <!-- <el-form-item label="事件等级" prop="eventType">
                        <el-select v-model="dataList.eventType">
                            <el-option v-for="(item, index) in ALL_SELECT_DATA.EVENT_LEVEL.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="合并/筛选" prop="merge">
                      <el-radio v-model="dataList.merge" :label='1'>合并主动报告</el-radio>
                      <el-radio v-model="dataList.merge" :label='2'>筛选强制报告</el-radio>
                      <el-radio v-model="dataList.merge" :label='3'>筛选匿名报告</el-radio>
                    </el-form-item> -->
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
          <el-table
            size="small"
            :data="tableData"
            :stripe="true"
            :highlight-current-row ="true"
            style="width: 100%">
            <!-- 外部表 -->
            <el-table-column
              label="#"
              prop="index"
              width="50">
            </el-table-column>
            <el-table-column
              label="报告类型"
              prop="dict_name">
            </el-table-column>
            <el-table-column
              label="本期"
              prop="bqhj">
            </el-table-column>
            <el-table-column
              label="去年同期"
              style="width: 100%"
              prop="qntq">
            </el-table-column>
            <el-table-column
              label="同比"
              prop="tb">
            </el-table-column>
            <el-table-column
              label="同比变化率"
              >
              <template slot-scope="scopes">
                    {{parseInt((scopes.row.tb/scopes.row.bqhj)*100)+'%'}}
              </template>
            </el-table-column>
            <el-table-column
              label="当年累计"
              prop="dnlj">
            </el-table-column>
            <el-table-column
              label="去年同期累计"
              prop="qnlj">
            </el-table-column>
            <el-table-column
              label="累计增减"
              prop="ljzj">
            </el-table-column>
            <el-table-column
              label="累计变化率"
              >
              <template slot-scope="scopes">
                    {{parseInt((scopes.row.ljzj/scopes.row.dnlj)*100)+'%'}}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
    </div>
</template>
<script>
import Vuex from 'Vuex'
import { getReportCurrentPeriodData } from '../../services/information_report'
import { getBeforeWeeks } from '../../filter/reportFilter.js'
import { formatDate, downLoad } from "../../utils/index.js"

export default {
  data () {
    return {
      // 查询条件数据  
      dataList: {
        occurDate: [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')],
        // 报告类型
        cateGory: [],
        // 事件等级
        eventType: '',
        // 合并、筛选
        merge: 0
      },
      // 表格数据
      tableData: [],
      fullscreenLoading: false,
      // 处理状态
      statuss: {},
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
      }
    }
  },
  computed: {
    ...Vuex.mapState(["ALL_SELECT_DATA"])
  },
  created () {
    // 初始化数据
    this.inquireDataList()
  },
  methods: {
    // 点击查询获取信息
    inquireDataList () {
      let startDate = this.dataList.occurDate !== null ? `${this.dataList.occurDate[0]}` : getBeforeWeeks(new Date(), 'yyyy-MM-dd')
      let endDate = this.dataList.occurDate !== null ? `${this.dataList.occurDate[1]}` : formatDate((new Date()), 'yyyy-MM-dd')
      let category = this.dataList.cateGory
      getReportCurrentPeriodData(startDate, endDate, category).then(result => {
        if (result.data.error === 0 && result.data.data !== null) {
          this.tableData = result.data.data
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].index = i + 1
          }
        } else {
          this.tableData = []
        }
      })
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
      if (this.tableData.length >= 1) {
        let startDate = this.dataList.occurDate !== null ? `${this.dataList.occurDate[0]}` : getBeforeWeeks(new Date(), 'yyyy-MM-dd')
        let endDate = this.dataList.occurDate !== null ? `${this.dataList.occurDate[1]}` : formatDate((new Date()), 'yyyy-MM-dd')
        let category = this.dataList.cateGory
        downLoad(
          "get",
          "/api/report/export/selectReportStatistics?startDate=" + startDate + "&endDate=" + endDate + "&category=" + category,
          false,
          "月度报告类型表"
        )
      } else {
        this.$message({
          type: 'info',
          message: '请确定表格中有数据再进行导出'
        })
      }
    }
  }
}
</script>