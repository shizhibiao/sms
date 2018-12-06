<template>
    <div class="animated fadeIn">
        <b-card  no-body>
            <el-tabs  type="border-card"  v-model="activeName"  @tab-click="handleClick" >
                 <el-row type="flex">
                        <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                            <el-form :inline="true" :model="notice" class="form-title" ref='noticeForm' v-show='activeName!=="yearSource"'>
                                    <el-form-item label="日期范围"  v-show='activeName!=="yearDept"'>
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

                                    <el-form-item label="通知等级">
                                        <el-select v-model="notice.noticeLevel" class='select' :clearable='true' >
                                            <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.ANNOUNCEMENT_LEVEL.dicts" :key ='index'></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="通知类型" >
                                        <el-select v-model="notice.noticeType" class='select' :clearable='true' multiple>
                                            <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.ANNOUNCEMENT_TYPE.dicts" :key ='index'></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="责任单位" >
                                        <el-select v-model="notice.deptId" class='select' :clearable='true' multiple>
                                            <el-option :label="item.deptName" :value="item.deptId" v-for='(item,index) in deptNameList' :key='index'></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="通知来源" >
                                        <el-select v-model="notice.noticeSrcType" class='noticeScource' :clearable='true' multiple>
                                            <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.ANNOUNCE_RESOURCE.dicts" :key ='index'></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="评估结果">
                                        <el-select v-model="notice.accessResult" class='noticeScource' :clearable='true'>
                                            <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.ASSESS_RESULT.dicts" :key ='index'></el-option>
                                        </el-select>
                                    </el-form-item>



                            </el-form>

                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" align="right" justify="end">
                                <el-button type="primary" @click="clearForm()" size='small'  v-show='activeName!=="yearSource"'>重置</el-button>
                                <el-button type="primary" @click="refresh()" size='small'>查询</el-button>

                                <el-button type="primary" @click="exportExcel()" size='small'>导出</el-button>
                        </el-col>

                    </el-row>




                <el-tab-pane label="来源-同比" name="source-year" :lazy="true">
                    <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
                        <el-table
                            :stripe="true"
                            :highlight-current-row ="true"
                            :data="datas"
                            size="small"
                            style="width: 100%"
                            id ='ta'
                            >
                                <el-table-column
                                label="#"
                                type="index"
                                width='40'
                                >
                                </el-table-column>
                                <el-table-column
                                label="通知来源"
                                prop="noticeSrcTypeDesc"

                                >
                                </el-table-column>
                                <el-table-column
                                label="本期"
                                prop="thisPeriodCount">
                                </el-table-column>
                                <el-table-column
                                label="去年同期"
                                prop="lastYearPeriodCount">
                                </el-table-column>
                                <el-table-column
                                label="同比"
                                prop="periodCompareCount"
                                >
                                </el-table-column>
                                <el-table-column
                                label="同比变化率"
                                >
                                    <template slot-scope="scopes">
                                          {{parseInt((scopes.row.periodCompareCount/scopes.row.thisPeriodCount)*100)+'%'}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                label="当年累计"
                                prop="thisYearCount"
                                >
                                </el-table-column>
                                <el-table-column
                                label="去年同期累计"
                                prop="lastYearCount"
                                >
                                </el-table-column>
                                <!-- <el-table-column
                                label="累计增减"
                                prop=" yearCompareCount"
                                >
                                </el-table-column> -->
                                <el-table-column
                                label="累计变化率"
                                >
                                    <template slot-scope="scopes">
                                          {{parseInt((scopes.row.yearCompareCount/scopes.row.thisYearCount)*100)+'%'}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-card>


                </el-tab-pane>
                <el-tab-pane label="年度-来源" name="yearSource" :lazy="true">
                    <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
                        <ve-histogram  :data = "chartData2" :extend="chartExtend" v-if='chartData2.rows.length>1'> </ve-histogram >
                    </el-card>
                    <div v-if='chartData2.rows.length<=1' style="text-align:center">暂无数据</div>


                </el-tab-pane>
                <el-tab-pane label="本期-来源" name="moonSource" :lazy="true">
                    <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
                        <ve-histogram  :data = "chartData3" :extend="chartExtend" v-if='chartData3.rows.length>1'> </ve-histogram >
                    </el-card>
                    <div v-if='chartData3.rows.length<=1' style="text-align:center">暂无数据</div>

                </el-tab-pane>
                <el-tab-pane label="年度-部门" name="yearDept" :lazy="true">
                    <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
                        <ve-histogram  :data = "chartData4" :extend="chartExtend"  v-if='chartData4.rows.length>1'> </ve-histogram >
                    </el-card>
                    <div v-if='chartData4.rows.length<=1' style="text-align:center">暂无数据</div>

                </el-tab-pane>
                <el-tab-pane label="本期-部门" name="moonDept" :lazy="true">
                    <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never' >
                        <ve-histogram  :data = "chartData5" :extend="chartExtend" v-if='chartData5.rows.length>1'> </ve-histogram >
                    </el-card>
                    <div v-if='chartData5.rows.length<=1' style="text-align:center">暂无数据</div>
                </el-tab-pane>
                <el-tab-pane label="月度-数量" name="moonNum" :lazy="true">
                    <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'  >
                        <ve-histogram  :data = "chartData6" :extend="chartExtend" v-if='chartData6.rows.length>0'> </ve-histogram >
                    </el-card>
                    <div v-if='chartData6.rows.length<1' style="text-align:center">暂无数据</div>
                </el-tab-pane>
                <el-tab-pane label="部门-类型" name="deptType" :lazy="true">
                    <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never' >
                        <ve-histogram  :data = "chartData7" :extend="chartExtend"  v-if='chartData7.rows.length>0'> </ve-histogram >
                    </el-card>
                    <div v-if='chartData7.rows.length<1' style="text-align:center">暂无数据</div>
                </el-tab-pane>
            </el-tabs>
        </b-card>
    </div>
</template>
<script>
import { formatDate } from "../../utils/index.js";
// import { API } from '@/api/index.js'
import axios from "axios";
import Vuex from "vuex";
import { sourceDataFilter, monthData } from "../../tools";
import {
  GetDepartmentListFromList,
  searchSavetyNoticeStatList,
  searchSavetyNoticeStatYearSrcType,
  searchSavetyNoticePeriodSrcType,
  SafetyNoticeYearDepart,
  SafetyNoticePeriodDepart,
  SafetyNoticeStatMonth,
  SafetyNoticeSrcDepart
} from "../../services/safety_notice";
export default {
  data() {
    this.chartExtend = {
      series(v) {
        if (v && v.length > 0) {
          v.forEach(i => {
            i.barMaxWidth = 50;
          });
          return v;
        }
      },
      label: { show: true, position: "top" }
    };
    return {
      daterange: [
        formatDate(new Date(), "yyyy-MM") + "-01",
        formatDate(new Date(), "yyyy-MM-dd")
      ],
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      notice: {
        noticeType:[],
        deptId:[],
        noticeSrcType:[]
      },
      deptNameList: [],
      deptNameList1: [],
      deptNameList2: [],
      datas: [],
      total: 0,
      curPage: 1,
      pageSize: 15,
      totalPages: 1,
      roles: [],
      form: {
        queryItems: []
      },
      qItem: {
        fieldName: "",
        value: ""
      },
      activeName: "source-year",
      chartData2: {
        columns: [],
        rows: []
      },
      chartData3: {
        columns: [],
        rows: []
      },
      chartData4: {
        columns: [],
        rows: []
      },
      chartData5: {
        columns: [],
        rows: []
      },
      chartData6: {
        columns: [],
        rows: []
      },
      chartData7: {
        columns: [],
        rows: []
      }
    };
  },
  computed: {
    ...Vuex.mapState(["ALL_SELECT_DATA"])
  },
  created() {
    GetDepartmentListFromList(1).then(result => {
      this.deptNameList1 = result;
      this.deptNameList = result;
    });
    GetDepartmentListFromList(2).then(result => {
      this.deptNameList2 = result;
    });
    this.refresh()
  },
  watch: {
    //  curPage: function (newValue, oldValue) {
    //    this.refresh()
    //  },
    notice: {
      handler(data, newdata) {
        if (!newdata.noticeLevel) {
          // 请求的下拉数据
        } else if (newdata.noticeLevel === "1") {
          this.deptNameList = [];

          setTimeout(() => {
            this.deptNameList = this.deptNameList1;
          }, 0);
          // 请求的下拉数据
        } else if (newdata.noticeLevel === "2") {
          this.deptNameList = [];
          setTimeout(() => {
            this.deptNameList = this.deptNameList2;
          }, 0);
        }
      },

      deep: true
    }
  },
  methods: {
    refresh() {
      this.initData();
      this.transformData();
      this.loadData();
      // 请求列表详情
      console.log(this.form);

      if (this.activeName === "source-year") {
        this.tabsLoadData1(this.form);
        // 本期来源
      } else if (this.activeName === "moonSource") {
        this.tabsLoadData3(this.form);
      } else if (this.activeName === "yearDept") {
        this.tabsLoadData4(this.form);
      } else if (this.activeName === "moonDept") {
        this.tabsLoadData5(this.form);
      } else if (this.activeName === "moonNum") {
        this.tabsLoadData6(this.form);
      } else if (this.activeName === "deptType") {
        this.tabsLoadData7(this.form);
      } else if (this.activeName === "yearSource") {
        this.tabsLoadData2();
      }
    },
    // 初始化
    initData() {
      this.form.queryItems = [];
      this.datas = [];
    },
    // 处理日期
    transformData() {
      this.notice.submitDateStart =
        this.daterange && this.daterange.length > 0 ? this.daterange[0] : "";
      this.notice.submitDateEnd =
        this.daterange && this.daterange.length > 1 ? this.daterange[1] : "";
    },
    //  去重查询数据
    loadData() {
      let result = Object.keys(this.notice).filter(item => {
        if (this.notice[item] instanceof Array) {
          return this.notice[item].length > 0;
        } else {
          return this.notice[item] !== "" || undefined || null;
        }
      });
      result.forEach(item => {
        this.qItem = {
          fieldName: item,
          value: this.notice[item]
        };
        this.form.queryItems.push(this.qItem);
      });
    },
    // 切换tabs事件
    handleClick(tab, event) {
      if (tab.name === "yearSource") {
        // 年度来源
        this.tabsLoadData2();
      } else if (tab.name === "moonSource") {
        this.tabsLoadData3(this.form);
      } else if (tab.name === "yearDept") {
        console.log("yearDept");
        this.tabsLoadData4(this.form);
      } else if (tab.name === "moonDept") {
        console.log("moonDept");
        this.tabsLoadData5(this.form);
      } else if (tab.name === "moonNum") {
        console.log("moonNum");
        this.tabsLoadData6(this.form);
      } else if (tab.name === "deptType") {
        console.log("deptType");
        this.tabsLoadData7(this.form);
      } else if (tab.name === "source-year") {
        this.tabsLoadData1(this.form);
      }
    },
    // 处理tabs统计表数据
    transformTabsData(data) {
      let yearArr = data.map(item => {
        return item.year;
      });

      let columns = ["noticeSrcTypeDesc", String(...new Set(yearArr))];
      let rows = data.map(item => {
        return {
          count: item.count,
          id: item.id,
          noticeSrcType: item.noticeSrcType,
          noticeSrcTypeDesc: item.noticeSrcTypeDesc,
          [item.year]: item.count
        };
      });
      let obj = {
        columns,
        rows
      };
      return obj;
    },
    // 第一页tabs加载数据方法
    tabsLoadData1(form) {
      // 同比
      searchSavetyNoticeStatList(form).then(result => {
        console.log(result);
        if (!result) {
          return;
        }
        let data = result.data;
        if (data.data && data.error === 0) {
          this.datas = data.data;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    tabsLoadData2() {
      searchSavetyNoticeStatYearSrcType().then(result => {
        if (result.data && result.data.error === 0) {
          let data = result.data.data;
          console.log(data);
          if (data.length > 1) {
            let data = result.data.data;

            let obj = {};

            data.forEach(item => {
              if (!obj[item.noticeSrcTypeDesc]) {
                obj[item.noticeSrcTypeDesc] = {};
              }

              if (!obj[item.noticeSrcTypeDesc][item.year]) {
                obj[item.noticeSrcTypeDesc][item.year] = item.count;
              }
            });
            let rows = [];
            for (var i in obj) {
              let o = {};
              o.noticeSrcTypeDesc = i;
              for (var k in obj[i]) {
                o[k] = obj[i][k];
              }
              rows.push(o);
            }

            let year = data.map(item => {
              return item.year;
            });

            let columns = ["noticeSrcTypeDesc", String(...new Set(year))];
            this.chartData2 = {
              columns,
              rows
            };
            console.log(this.chartData2);
          }else{
            this.chartData2 = {};
          }
        }
      });
    },
    // 第三页 本期
    tabsLoadData3(form) {
      searchSavetyNoticePeriodSrcType(form).then(result => {
        console.log(result);
        if (!result) {
          return;
        }
        if (result.data.data && result.data.error === 0) {
          let data = result.data.data;
          if (data.length > 1) {
            let columns = ["noticeSrcTypeDesc", "本期"];
            let rows = data.map(item => {
              return {
                本期: item.count,
                id: item.id,
                noticeSrcType: item.noticeSrcType,
                noticeSrcTypeDesc: item.noticeSrcTypeDesc
              };
            });
            this.chartData3 = {
              columns,
              rows
            };
          }else{
            this.chartData3 = {
              columns:[],
              rows:[]
            };
          }
        } else {
          this.$message.error(result.data.message);
        }
      });
    },
    // 第四页 年度部门
    tabsLoadData4(form) {
      SafetyNoticeYearDepart(form).then(result => {
        if (result.data && result.data.error === 0) {
          let data = result.data.data;
          console.log(data);
          if (data.length > 1) {
            let data = result.data.data;

            let obj = {};

            data.forEach(item => {
              if (!obj[item.deptName]) {
                obj[item.deptName] = {};
              }

              if (!obj[item.deptName][item.year]) {
                obj[item.deptName][item.year] = item.count;
              }
            });
            let rows = [];
            for (var i in obj) {
              let o = {};
              o.deptName = i;
              for (var k in obj[i]) {
                o[k] = obj[i][k];
              }
              rows.push(o);
            }

            let year = data.map(item => {
              return item.year;
            });

            let columns = ["deptName", String(...new Set(year))];
            this.chartData4 = {
              columns,
              rows
            };
          }else{
            this.chartData4 = {
              columns:[],
              rows:[]
            };
          }
        }else{
          this.$message.error(result.data.message);
        }
      });
    },
    // 第五页 本期部门
    tabsLoadData5(form) {
      SafetyNoticePeriodDepart(form).then(result => {
        if (result.data && result.data.error === 0) {
          let data = result.data.data;
          console.log(data);
          if (data.length > 1) {
            let columns = ["deptName", "本期"];
            let rows = data.map(item => {
              return {
                本期: item.count,
                id: item.id,
                deptName: item.deptName,
                deptId: item.deptId
              };
            });
            this.chartData5 = {
              columns,
              rows
            };
          }else{
            this.chartData5 = {
              columns:[],
              rows:[]
            };
          }
        }else{
          this.$message.error(result.data.message);
        }
      });
    },
    tabsLoadData6(form) {
      // 月度部门
      SafetyNoticeStatMonth(form).then(result => {
        if (result.data && result.data.error === 0) {
          let data = result.data.data;
          console.log(data);
          if (data.length > 0) {
            let columns = ["月份", "报告数量"];
            let rows = data.map(item => {
              return {
                报告数量: item.count,
                id: item.id,
                月份: monthData(item.yearMonth.toString().substr(4))
              };
            });
            this.chartData6 = {
              columns,
              rows
            };
          }else{
            this.chartData6 = {
              columns:[],
              rows:[]
            };
          }
        }else{
          this.$message.error(result.data.message);
        }
      });
    },
    tabsLoadData7(form) {
      SafetyNoticeSrcDepart(form).then(result => {
        if (result.data && result.data.error === 0) {
          let data = result.data.data;
          console.log(data);
          if (data.length > 0) {
            let obj = {};

            data.forEach(item => {
              if (!obj[item.deptName]) {
                obj[item.deptName] = {};
              }

              if (!obj[item.deptName][item.noticeTypeDesc]) {
                obj[item.deptName][item.noticeTypeDesc] = item.count;
              }
            });
            let rows = [];
            for (var i in obj) {
              let o = {};
              o.deptName = i;
              for (var k in obj[i]) {
                o[k] = obj[i][k];
              }
              rows.push(o);
            }

            let noticeTypeDesc = data.map(item => {
              return item.noticeTypeDesc;
            });

            let columns = ["deptName", ...new Set(noticeTypeDesc)];
            this.chartData7 = {
              columns,
              rows
            };
            console.log(this.chartData7);
          }else{
            this.chartData7 = {
              columns:[],
              rows:[]
            };
          }
        }else{
           this.$message.error(result.data.message);
        }
      });
    },
    clearForm() {
      this.notice = {
        noticeLevel: "",
        submitDateStart: "",
        submitDateEnd: "",
        accessResult: "",
        deptId: [],
        noticeSrcType: [],
        noticeType: []
      };
      console.log(this.notice);
    },
    exportExcel() {
      if (this.activeName === "source-year") {
        this.downLoad(
          "post",
          "/api/safetynoticestatis/export/list",
          this.form,
          "通知来源同比表"
        );
        // 本期来源
      } else if (this.activeName === "moonSource") {
        this.downLoad(
          "post",
          "/api/safetynoticestatis/export/period_srctype",
          this.form,
          "本期来源对比表"
        );
      } else if (this.activeName === "yearDept") {
        this.downLoad(
          "post",
          "/api/safetynoticestatis/export/year_depart",
          this.form,
          "年度部门对比表"
        );
      } else if (this.activeName === "moonDept") {
        this.downLoad(
          "post",
          "/api/safetynoticestatis/export/period_depart",
          this.form,
          "本期部门对比表"
        );
      } else if (this.activeName === "moonNum") {
        this.downLoad(
          "post",
          "/api/safetynoticestatis/export/month",
          this.form,
          "月度数量对比表"
        );
      } else if (this.activeName === "deptType") {
        this.downLoad(
          "post",
          "/api/safetynoticestatis/export/depart",
          this.form,
          "部门通知类型对比表"
        );
      } else if (this.activeName === "yearSource") {
        this.downLoad(
          "get",
          "/api/safetynoticestatis/export/year_srctype",
          false,
          "年度来源对比表"
        );
      }
    },
    downLoad(method, url, params, fileName) {
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
        console.log(res);
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
  }
};
</script>
