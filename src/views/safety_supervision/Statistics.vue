<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <!-- <b-card-body> -->
      <el-tabs v-model="activeName"
               type="border-card"
               @tab-click="handleClick">
        <el-row :gutter="5">
          <el-col :xs="20"
                  :sm="20"
                  :md="20"
                  :lg="20"
                  :xl="20">
            <el-form :inline="true"
                     ref="query"
                     :model="notice"
                     class="form-title">
              <el-form-item label="日期">
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
              <el-form-item label="监察/审计类型"
                            prop="noticeType"
                            v-show="activeName != 'departmentResult'">
                <el-select v-model="notice.noticeType"
                           class='select'
                           collapse-tags
                           :clearable='true'
                           multiple>
                  <el-option v-for="item in monitoringList"
                             :key="item.dictId"
                             :label="item.dictName"
                             :value="item.dictId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="被检查单位"
                            prop="company">
                <el-select v-model="notice.company"
                           collapse-tags
                           class='select'
                           :clearable='true'
                           multiple>
                  <el-option v-for='item in submitDeptNameList'
                             :label="item.deptName"
                             :value="item.deptId"
                             :key='item.deptId'>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="监察/审计等级"
                            prop="noticeLevel">
                <el-select v-model="notice.noticeLevel"
                           class='select'
                           :clearable='true'>
                  <el-option v-for="item in leaveList"
                             :key="item.dictId"
                             :label="item.dictName"
                             :value="item.dictCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :xs="4"
                  :sm="4"
                  :md="4"
                  :lg="4"
                  :xl="4"
                  align="right">
            <el-button type="primary"
                       @click="refresh()"
                       size='small'>查询</el-button>
            <el-button type="primary"
                       @click="clearForm()"
                       size='small'>重置</el-button>
            <el-button type="primary"
                       @click="exportExcel()"
                       size='small'>导出</el-button>
          </el-col>

        </el-row>
        <el-tab-pane label="来源-同比"
                     name="source"
                     :lazy="true">
          <el-card style="margin-top:20px;border:none"
                   shadow='never'>
            <el-table :stripe="true"
                      :highlight-current-row="true"
                      :data="tableData"
                      size="small"
                      style="width: 100%"
                      align="center">
              <el-table-column label="#"
                               type="index"
                               width='40'>
              </el-table-column>
              <el-table-column label="监察/审计类型"
                               prop="monitorTypeDesc"
                               align="center">
              </el-table-column>
              <el-table-column label="本期"
                               prop="thisPeriodCount"
                               align="center">
              </el-table-column>
              <el-table-column label="去年同期"
                               prop="lastYearPeriodCount"
                               align="center">
              </el-table-column>
              <el-table-column label="同比"
                               prop="periodCompareCount"
                               align="center">
              </el-table-column>
              <el-table-column label="同比变化率"
                               align="center">
                <template slot-scope="scopes">
                  {{parseInt((scopes.row.periodCompareCount/scopes.row.thisPeriodCount)*100)+'%'}}
                </template>
              </el-table-column>
              <el-table-column label="当年累计"
                               prop="thisYearCount"
                               align="center">
              </el-table-column>
              <el-table-column label="去年同期累计"
                               prop="lastYearCount"
                               align="center">
              </el-table-column>
              <!-- <el-table-column
                        label="累计增减"
                        prop="yearCompareCount"
                        >
                        </el-table-column> -->
              <el-table-column label="累计变化率"
                               align="center">
                <template slot-scope="scopes">
                  {{parseInt((scopes.row.yearCompareCount/scopes.row.thisYearCount)*100)+'%'}}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="本期-来源"
                     name="yearType"
                     :lazy="true">
          <el-card style="margin-top:20px;border:none"
                   shadow='never'>
            <ve-histogram :data="chartData"
                          :extend="extend"
                          v-if="chartData.rows.length > 1"></ve-histogram>
          </el-card>
          <div v-if="chartData.rows.length <=1"
               style="text-align:center;">暂无数据</div>
        </el-tab-pane>
        <el-tab-pane label="部门-类型"
                     name="departmentType"
                     :lazy="true">
          <el-card style="margin-top:20px;border:none"
                   shadow='never'>
            <ve-histogram :data="chartData2"
                          :extend="extend"
                          v-if="chartData2.rows.length"></ve-histogram>
          </el-card>
          <div v-if="!chartData2.rows.length"
               style="text-align:center;">暂无数据</div>
        </el-tab-pane>
        <el-tab-pane label="部门-结果"
                     name="departmentResult"
                     :lazy="true">
          <el-card style="margin-top:20px;border:none"
                   shadow='never'>
            <ve-histogram :data="chartData3"
                          :extend="extend"
                          v-if="chartData3.rows.length"></ve-histogram>
          </el-card>
          <div v-if="!chartData3.rows.length"
               style="text-align:center;">暂无数据</div>
        </el-tab-pane>
      </el-tabs>
      <!-- </b-card-body> -->
    </b-card>
  </div>
</template>


<script>
import axios from 'axios'
import { formatDate } from "../../utils/index.js"
import { chartList, checkResult, currentType, departmentType1, departmentResult1, getMonitoringType, getNotificationLevel, conditionGetDepartmentList2, conditionGetDepartmentList } from '../../services/safety_supervision'
export default {
  data () {
    this.extend = {
      series (v) {
        if (v && v.length > 0) {
          v.forEach(i => {
            i.barMaxWidth = 50;
          });
          return v;
        }
      },
      // label: {show: true, position: 'top'}
    }
    return {
      monitoringList: [],
      leaveList: [],
      submitDeptNameList: [],
      activeName: 'source',
      daterange: [
        formatDate(
          new Date(),
          "yyyy-MM"
        ) + '-01',
        formatDate(new Date(), "yyyy-MM-dd")
      ],
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一天",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三天",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一月",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      company: [],
      unitList: [],
      notice: {
        noticeLevel: '',
        noticeType: [],
        company: []
      },
      form: {
        queryItems: []
      },
      tableData: [],
      chartData: {
        columns: ["类型", "本期"],
        rows: [
        ]
      },
      chartData2: {
        columns: ["来源"],
        rows: [
        ]
      },
      chartData3: {
        columns: ["部门"],
        rows: []
      },
      // chartSettings: {
      //    stack: { '结果': ["合格", "一般合格", "一般不合格", "严重不合格"] }
      // },
      // extend: {
      //   series: {
      //     label: { show: true, position: 'inside', color: '#000' },
      //     barWidth: 40
      //   },
      // },
    }
  },
  created () {
    checkResult().then(res => {
      res.forEach(item => {
        this.chartData3.columns.push(item.dictName)
      })
    })
  },
  methods: {
    handleClick (tab, event) {
      this.clearForm()
      if (tab.name == 'yearType') {
        this.refresh()
      } else if (tab.name == 'departmentType') {
        this.refresh()
      } else if (tab.name == 'departmentResult') {
        this.refresh()
      }
    },
    clearForm () {
      this.$refs['query'].resetFields()
    },
    refresh () {
      if (this.activeName == 'source') {
        this.query1()
        this.queryList()
      } else if (this.activeName == 'yearType') {
        this.query1()
        this.queryYear()
      } else if (this.activeName == 'departmentType') {
        this.query1()
        this.queryType()
      } else if (this.activeName == 'departmentResult') {
        this.query1()
        this.queryResult()
      }
    },
    queryResult () {
      departmentResult1(this.form).then(res => {
        let data = res.data.data
        // console.log(data)
        this.chartData3.rows = data.map(item => {
          return {
            "部门": item.deptName,
            "符合": item.suggestItems,
            "不符合": item.observationItems,
            "未检查": item.seriousFails,
            "不适用": item.commonFails
          }
        })
        // console.log(this.chartData3)
      })
    },
    queryType () {
      departmentType1(this.form).then(res => {
        let data = res.data.data
        this.chartData2.columns = ["来源"]
        // console.log(data)
        let obj = {};
        data.forEach(item => {
          if (this.chartData2.columns.indexOf(item.monitorTypeName) == -1) {
            this.chartData2.columns.push(item.monitorTypeName)
          }
          // return {
          //   来源: item.deptName, 
          //   [item.monitorTypeName]: item.count, 
          // }
          if (!obj[item.deptName]) {
            obj[item.deptName] = {};
          }

          if (!obj[item.deptName][item.monitorTypeName]) {
            obj[item.deptName][item.monitorTypeName] = item.count;
          }
        })
        let rows = [];
        for (var i in obj) {
          let o = {};
          o["来源"] = i;
          for (var k in obj[i]) {
            o[k] = obj[i][k];
          }
          rows.push(o);
        }
        this.chartData2.rows = rows
        // console.log(this.chartData2)
      })
    },
    query1 () {
      let data = [
        {
          fieldName: 'monitorType',
          value: this.notice.noticeType.map(String)
        },
        {
          fieldName: 'projectLevel',
          value: this.notice.noticeLevel ? parseInt(this.notice.noticeLevel) : 0
        },
        {
          fieldName: 'monitorDeptId',
          value: this.notice.company
        },
        {
          fieldName: 'projectStartDate',
          value: this.daterange ? this.daterange[0] : null
        },
        {
          fieldName: 'projectEndDate',
          value: this.daterange ? this.daterange[1] : null
        }
      ]
      this.form.queryItems = data
    },
    queryList () {
      // console.log(obj)
      chartList(this.form).then(res => {
        // console.log(res)
        let result = res.data.data
        this.tableData = result
      })
    },
    queryYear () {
      currentType(this.form).then(res => {
        let data = res.data.data
        // console.log(data)
        this.chartData.columns = ['类型', "本期"]
        this.chartData.rows = data.map(item => {
          return {
            "类型": item.montiorTypeName,
            "本期": item.count
          }
        })
      })
    },
    exportExcel () {
      this.query1()
      if (this.activeName === "source") {
        this.downLoad(
          "post",
          "/api/securitymonitor/chart_export/list_export",
          this.form,
          "来源同比表"
        );
        // 本期来源
      } else if (this.activeName === "yearType") {
        this.downLoad(
          "post",
          "/api/securitymonitor/chart_export/currentType_export",
          this.form,
          "本期来源对比表"
        );
      } else if (this.activeName === "departmentType") {
        this.downLoad(
          "post",
          "/api/securitymonitor/chart_export/departmentType_export",
          this.form,
          "部门类型对比表"
        );
      } else if (this.activeName === "departmentResult") {
        this.downLoad(
          "post",
          "/api/securitymonitor/chart_export/departmentResult",
          this.form,
          "部门结果对比表"
        );
      }
    },
    downLoad (method, url, params, fileName) {
      if (!params) {
        params = {};
      }
      axios({
        method,
        url,
        responseType: "blob",
        data: params
      }).then(res => {
        let headers = res.headers;
        // console.log(res);
        let blob = new Blob([res.data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = fileName + ".xls"; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href);
      });
    }
  },
  watch: {
    notice: {
      handler (newval, old) {
        if (newval.noticeLevel == '') {
          this.submitDeptNameList = this.company
        }
        else if (newval.noticeLevel == 1) {
          this.submitDeptNameList = this.company
        } else {
          this.submitDeptNameList = this.unitList
        }
      },
      deep: true
    }
  },
  mounted () {
    getMonitoringType().then(result => {
      // console.log(result)
      this.monitoringList = result
    })
    conditionGetDepartmentList(1).then(result => {
      // console.log(result)
      this.company = result
      this.submitDeptNameList = result
    })
    conditionGetDepartmentList2(2).then(result => {
      this.unitList = result
    })
    getNotificationLevel().then(result => {
      // console.log(result)
      this.leaveList = result
    })
    this.refresh()
  }

}
</script>


<style scoped>
</style>
