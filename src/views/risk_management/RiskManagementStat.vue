<template>
    <div class="animated fadeIn">
        <b-card  no-body>
            <el-tabs  type="border-card"  v-model="activeName"  @tab-click="handleClick" >
                 <el-row type="flex">
                        <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                            <el-form :inline="true" :model="risk" class="form-title" ref='riskForm'>
                                    <el-form-item label="日期范围"  v-if='activeName!=="yearDept" && activeName!=="riskSource"'>
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

                                    <el-form-item label="立项等级">
                                        <el-select v-model="risk.projectLevel" class='select' :clearable='true'>

                                            <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.ANNOUNCEMENT_LEVEL.dicts" :key ='index'></el-option>

                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="责任部门" >
                                        <el-select v-model="risk.processDept" class='select' :clearable='true' multiple>
                                            <el-option :label="item.deptName" :value="item.deptId" v-for='(item,index) in deptNameList' :key='index'></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="项目来源" >
                                        <el-select v-model="risk.projectSrc" :clearable='true' multiple>
                                            <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.PROJECT_SOURCE.dicts" :key ='index'></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="立项部门">
                                       <el-cascader
                                            :options="submitDeptNameList"
                                            :show-all-levels="false"
                                            change-on-select
                                            v-model="submitDeptName"
                                            :clearable='true'
                                            :props="{
                                                value:'deptId',
                                                label:'label',
                                                children:'children'
                                            }"
                                            @change="changeClassDept"

                                        ></el-cascader>
                                    </el-form-item>



                            </el-form>

                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" align="right" justify="end">
                                <el-button type="primary" @click="refresh()" size='small'>查询</el-button>
                                <el-button type="primary" @click="clearForm()" size='small'>重置</el-button>
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
                            >
                                <el-table-column
                                label="#"
                                type="index"
                                width='40'
                                >
                                </el-table-column>
                                <el-table-column
                                label="项目来源"
                                prop="projectSrcDesc"

                                >
                                </el-table-column>
                                <el-table-column
                                label="本期"
                                prop="thisPeriodCount">
                                </el-table-column>
                                <el-table-column
                                label="去年同期"
                                prop="lastPeriodCount">
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
                <el-tab-pane label="年度-部门" name="yearDept" :lazy="true">
                    <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
                        <ve-histogram  :data = "chartData2" :extend="chartExtend" v-if='chartData2.rows.length>1'> </ve-histogram >
                    </el-card>
                    <div v-if='chartData2.rows.length<=1' style="text-align:center">暂无数据</div>

                </el-tab-pane>
                <el-tab-pane label="本期-部门" name="moonDept" :lazy="true">
                    <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
                        <ve-histogram  :data = "chartData3" :extend="chartExtend" v-if='chartData3.rows.length>1'> </ve-histogram >
                    </el-card>
                    <div v-if='chartData3.rows.length<=1' style="text-align:center">暂无数据</div>

                </el-tab-pane>
                <el-tab-pane label="危险源" name="riskSource" :lazy="true">
                    <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
                        <ve-histogram  :data = "chartData4" :extend="chartExtend" v-if='chartData4.rows.length>1'> </ve-histogram >
                    </el-card>
                    <div v-if='chartData4.rows.length<=1' style="text-align:center">暂无数据</div>
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
  SafetyNoticeSrcDepart,
  getDepartmentList
} from "../../services/safety_notice";
import {
  riskStatisList,
  riskStatisYearDepart,
  riskStatisPeriodDepart,
  riskStatisSourceYearDepart
} from "../../services/risk";
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
      }
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
      risk: {
        processDept:[],
        projectSrc:[]
      },
      deptNameList: [],
      deptNameList1: [],
      deptNameList2: [],
      submitDeptNameList: [],
      submitDeptName: [],
      datas: [],
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
    getDepartmentList().then(result => {
      this.submitDeptNameList = result;
      console.log(result);
    });
    this.refresh();
  },
  watch: {
    //  curPage: function (newValue, oldValue) {
    //    this.refresh()
    //  },
    risk: {
      handler(data, newdata) {
        if (!newdata.projectLevel) {
          // 请求的下拉数据
        } else if (newdata.projectLevel === "1") {
          this.deptNameList = [];

          setTimeout(() => {
            this.deptNameList = this.deptNameList1;
          }, 0);
          // 请求的下拉数据
        } else if (newdata.projectLevel === "2") {
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
        console.log(this.submitDeptName)
      if (this.activeName === "source-year") {
        this.tabsLoadData1(this.form);
        // 本期来源
      } else if (this.activeName === "yearDept") {
        this.tabsLoadData2(this.form);
      } else if (this.activeName === "moonDept") {
        this.tabsLoadData3(this.form);
      } else if (this.activeName === "riskSource") {
        this.tabsLoadData4(this.form);
      }
    },
    // 初始化
    initData() {
      this.form.queryItems = [];
      this.datas = [];
    },
    // 处理日期
    transformData() {
      if (this.activeName !== "yearDept" && this.activeName !== "riskSource") {
        this.risk.submitDateStart =
            this.daterange && this.daterange.length > 0 ? this.daterange[0] : "";
        this.risk.submitDateEnd =
            this.daterange && this.daterange.length > 1 ? this.daterange[1] : "";
      }else{
          this.risk.submitDateStart =""
          this.risk.submitDateEnd = ""
      }
      if(this.submitDeptName&&this.submitDeptName.length > 0){
        this.risk.submitDept = []
         this.risk.submitDept.push(this.submitDeptName[this.submitDeptName.length - 1])
      }else{
        this.risk.submitDept = []
      }

    },
    //  去重查询数据
    loadData() {
      let result = Object.keys(this.risk).filter(item => {
        if (this.risk[item] instanceof Array) {
          return this.risk[item].length > 0;
        } else {
          return this.risk[item] !== "" || undefined || null;
        }
      });
      result.forEach(item => {
        this.qItem = {
          fieldName: item,
          value: this.risk[item]
        };
        this.form.queryItems.push(this.qItem);
      });
    },
    // 切换tabs事件
    handleClick(tab, event) {
      if (tab.name === "yearDept") {
        // 年度来源
        this.tabsLoadData2();
      } else if (tab.name === "moonDept") {
        this.tabsLoadData3(this.form);
      } else if (tab.name === "riskSource") {
        console.log("riskSource");
        this.tabsLoadData4(this.form);
      } else if (tab.name === "source-year") {
        this.tabsLoadData1(this.form);
      }
    },
    // 第一页tabs加载数据方法
    tabsLoadData1(form) {
      // 同比
      riskStatisList(form).then(result => {
        console.log(result);
        if (!result) {
          return;
        }
        let data = result.data;
        if (data.data && data.error === 0) {
          this.datas = data.data;
        } else {
         this.$message.error(result.data.message)
        }
      });
    },
    tabsLoadData2(form) {
      if (!form) {
        form = {
          queryItems: []
        };
      }
      riskStatisYearDepart(form).then(result => {
        console.log(result);
        if (result.data && result.data.error === 0) {
          let data = result.data.data;
          //   console.log(data)
          if (data.length > 1) {
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

            this.chartData2 = {
              columns,
              rows
            };
            console.log(this.chartData2);
          }else{
            this.chartData2 = {
              columns:[],
              rows:[]
            };
          }
        }else{
          this.$message.error(result.data.message)
        }
      });
    },
    // 第三页 本期
    tabsLoadData3(form) {
      riskStatisPeriodDepart(form).then(result => {
        console.log(result);
        if (!result) {
          return;
        }
        if (result.data.data && result.data.error === 0) {
          let data = result.data.data;
          if (data.length > 1) {
            let columns = ["deptName", "本期"];
            let rows = data.map(item => {
              return {
                本期: item.count,
                id: item.id,
                deptName: item.deptName
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
        }else{
          this.$message.error(result.data.message)
        }
      });
    },
    // 第四页 年度部门
    tabsLoadData4(form) {
      riskStatisSourceYearDepart(form).then(result => {
        if (result.data && result.data.error === 0) {
          let data = result.data.data;
          console.log(data)
          if (data.length > 1) {
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
            console.log(this.chartData4)
          }else{
            this.chartData4 ={
              columns:[],
              rows:[]
            }
          }
        }else{
           this.$message.error(result.data.message)
        }
      });
    },
    clearForm() {
      this.risk = {
        projectLevel: "",
        submitDateStart: "",
        submitDateEnd: "",
        processDept: [],
        projectSrc: [],
        submitDept: []
      };
      this.submitDeptName = []
      this.daterange= [
        formatDate(new Date(), "yyyy-MM") + "-01",
        formatDate(new Date(), "yyyy-MM-dd")
      ]

    },
    changeClassDept(arr){
      if(arr.length<2){
        this.submitDeptName =[]
      }
    },
    exportExcel() {
      if (this.activeName === "source-year") {
        this.downLoad(
          "post",
          "/api/riskstatis/export/list",
          this.form,
          "项目来源同比表"
        );
        // 年度来源
      } else if (this.activeName === "yearDept") {
        this.downLoad(
          "post",
          "/api/riskstatis/export/year_depart",
          this.form,
          "年度部门对比表"
        );
      } else if (this.activeName === "moonDept") {
        this.downLoad(
          "post",
          "/api/riskstatis/export/period_depart",
          this.form,
          "本期部门对比表"
        );
      } else if (this.activeName === "riskSource") {
        this.downLoad(
          "post",
          "/api/riskstatis/export/rs_year_depart",
          this.form,
          "危险源对比表"
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
