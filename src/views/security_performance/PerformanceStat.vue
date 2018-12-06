<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-row type="flex">
          <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
            <el-form :model="searchForm" class="form-title" ref='searchForm' label-width="80px" :rules="rules"
                     inline-message>
              <div class="row">

                <div class="col-lg-6 col-md-6 col-sm-12">
                  <el-form-item label="日期" prop="calcDate">
                    <el-date-picker

                      v-model="searchForm.calcDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd"
                      :clearable="false"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12" v-if="activeName!=='companyWarning'">
                  <el-form-item label="对应部门">
                    <el-select v-model="searchForm.deptId" class='select' :clearable='true' multiple>
                      <el-option :label="item.deptName" :value="item.deptId" v-for='(item,index) in deptNameList'
                                 :key='index'></el-option>
                    </el-select>
                  </el-form-item>
                </div>

              </div>


            </el-form>

          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" align="right" justify="end">
            <el-button type="primary" @click="refresh()" size='small'>查询</el-button>
          </el-col>

        </el-row>


        <el-tab-pane label="部门状态统计" name="deptStat" :lazy="true">
          <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
            <el-table
              :stripe="true"
              :highlight-current-row="true"
              :data="datas"
              size="small"
              style="width: 100%"
            >
              <el-table-column
                label="#"
                type="index"
                width='40'
              >
              </el-table-column>
              <el-table-column
                label="部门名称"
                prop="deptName"

              >
              </el-table-column>
              <el-table-column
                label="正常数量"
                prop="normalCount">
              </el-table-column>
              <el-table-column
                label="预警数量"
                prop="warningCount">
              </el-table-column>
              <el-table-column
                label="超标数量"
                prop="severityCount"
              >
              </el-table-column>
            </el-table>
          </el-card>


        </el-tab-pane>
        <el-tab-pane label="部门绩效预警" name="deptWarning" :lazy="true">
          <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
            <ve-histogram :data="chartData" :extend="chartExtend" :settings="chartSettings"
                          :colors="colors"></ve-histogram>
          </el-card>
          <div style="text-align:center" v-if="chartData.length>0">暂无数据</div>

        </el-tab-pane>
        <el-tab-pane label="公司绩效预警" name="companyWarning" :lazy="true">
          <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
            <ve-histogram :data="chartData2" :extend="chartExtend1" :settings="chartSettings"
                          :colors="colors"></ve-histogram>
          </el-card>
          <div style="text-align:center" v-if="chartData2.length>0">暂无数据</div>

        </el-tab-pane>

      </el-tabs>
    </b-card>
  </div>
</template>
<script>
  import {formatDate} from "../../utils/index.js";
  import axios from "axios";
  import Vuex from "vuex";
  import {
    GetDepartmentListFromList
  } from "../../services/safety_notice";

  export default {
    name: "PerformanceStat",
    data() {
      this.chartExtend = {
        series(v) {
          if (v && v.length > 0&&v.length <3) {
            v.forEach(i => {
              i.barMaxWidth = 50;
            });

          }
          return v;
        },
        label: { show: true, position: "top" }
      };
      this.chartExtend1 = {
        'xAxis.0.axisLabel.rotate': 45
      };

      this.chartSettings = {
        metrics: ['normalCount', 'warningCount', 'severityCount'],
        labelMap: {
          normalCount: '正常',
          warningCount: '预警',
          severityCount: '超标'

        },
        label: { show: true, position: "top" }
      }
      this.colors = ['#096', 'rgb(255, 236, 187)', 'rgb(240, 128, 128)']
      return {
        searchForm: {
          calcDate: formatDate(new Date(new Date().getTime() - 3600 * 1000 * 24), 'yyyy-MM-dd'),
          deptId: []
        },
        deptNameList: [],
        datas: [],
        activeName: "deptStat",
        chartData: {
          columns: ['deptName', 'normalCount', 'severityCount', 'warningCount'],
          rows: []
        },
        chartData2: {
          columns: ['indicatorName', 'normalCount', 'severityCount', 'warningCount'],
          rows: []
        },
        rules: {
        }
      };
    },
    computed: {
      ...Vuex.mapState(["ALL_SELECT_DATA"])
    },
    created() {
      GetDepartmentListFromList(1).then(result => {
        this.deptNameList = result;
      })
      this.refresh();
    },
    watch: {},
    methods: {
      refresh() {
        // 请求列表详情
        if (this.activeName === "deptStat") {
          this.tabsLoadData1();
        } else if (this.activeName === "deptWarning") {
          this.tabsLoadData2();
        } else if (this.activeName === "companyWarning") {
          this.tabsLoadData3();
        }
      },
      // 切换tabs事件
      handleClick(tab, event) {
        if (this.activeName === "deptStat") {
          this.tabsLoadData1();
        } else if (this.activeName === "deptWarning") {
          this.tabsLoadData2();
        } else if (this.activeName === "companyWarning") {
          this.tabsLoadData3();
        }
      },
      //部门表
      tabsLoadData1() {
          if (!this.searchForm.calcDate) {
            this.$message({
              type: 'error',
              message: '日期不能为空'
            })
          } else {
            let calcDate = this.searchForm.calcDate
            let deptId = this.searchForm.deptId
            console.log(this.searchForm)
            let url = '/api/earlywarning/statis_dept?calcDate='+ calcDate
            let str = ''
            if (deptId.length>0) {

              deptId.forEach(item => {
                str += ',' + item
              })
              str = str.substr(1)
              url = url + '&deptIds=' + str
            }else{
              url = url + '&deptIds= '
            }

            axios.get(url).then(result => {
              console.log(result);
              if (result.data && result.data.error === 0 && result.data.data) {
                this.datas = result.data.data
                this.$forceUpdate()
              } else {
                this.$message({
                  type: 'error',
                  message: result.data.message
                })
              }

            });
          }


      },
      //部门图
      tabsLoadData2(form) {
        this.$refs["searchForm"].validate(valid => {
          if (!valid) {
            this.$message({
              type: 'error',
              message: '查询条件不能为空'
            })
          } else {

            let calcDate = this.searchForm.calcDate
            let deptId = this.searchForm.deptId


            let url = '/api/earlywarning/statis_dept?calcDate='+ calcDate
            let str = ''
            if (deptId.length>0) {

              deptId.forEach(item => {
                str += ',' + item
              })
              str = str.substr(1)
              url = url + '&deptIds=' + str
              console.log(url)
            }else{
              url = url + '&deptIds= '
            }

            axios.get(url).then(result => {
              console.log(result);
              if (result.data && result.data.error === 0 && result.data.data) {
                this.chartData.rows = result.data.data
              } else {
                this.$message({
                  type: 'error',
                  message: result.data.message
                })
              }

            });
          }
        })


      },
      // 第三页 公司
      tabsLoadData3(form) {
        this.$refs["searchForm"].validate(valid => {
          if (!valid) {
            this.$message({
              type: 'error',
              message: '查询条件不能为空'
            })
          } else {
            let calcDate = this.searchForm.calcDate
            console.log(this.searchForm)
            let url = '/api/earlywarning/statis_comp?calcDate=' + calcDate

            axios.get(url).then(result => {
              console.log(result);
              if (result.data && result.data.error === 0 && result.data.data) {
                let datas = result.data.data
                this.chartData2.rows = datas.map(item => {
                  if (item.calcResult === 0) {
                    return {
                      normalCount: item.calcValue,
                      indicatorName: item.indicatorName
                    }
                  } else if (item.calcResult === 1) {
                    return {
                      warningCount: item.calcValue,
                      indicatorName: item.indicatorName
                    }
                  } else if (item.calcResult === 2) {
                    return {
                      severityCount: item.calcValue,
                      indicatorName: item.indicatorName
                    }
                  }

                })
                console.log(this.chartData2)
              } else {
                this.$message({
                  type: 'error',
                  message: result.data.message
                })
              }

            });
          }
        })
      }
    }
  };
</script>
<style scoped>
</style>
