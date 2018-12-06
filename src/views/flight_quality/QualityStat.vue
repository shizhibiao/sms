<template>
  <div class="animated fadeIn">
    <b-card no-body>
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" style="height:75vh; overflow-y: auto">
          <el-row :gutter="12">
          <el-col :span="18">
            <el-form :inline="true" :model="queryParams"  ref="querys" status-icon >
               <el-form-item label="发生日期" prop="occurDate" >
                  <el-date-picker
                    :clearable='false'
                    @change="shijian"
                    v-model="queryParams.createDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    auto-complete="off"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="事件等级" prop="eventGrade" v-if="activeName === 'statistics' || activeName === 'flightphase' || activeName === 'eventnamegrade'">
                    <el-select v-model="queryParams.eventGrade"  style="width:100%" multiple >
                    <el-option v-for="(item, index) in EVENT_LEVEL" :key="index" :label="item.dictName" :value="item.dictName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="事件名称" prop="title" v-if="activeName === 'eventname' || activeName === 'eventnamegrade'">
                    <el-select v-model="queryParams.title"  style="width:100%"  multiple >
                    <el-option v-for="(item, index) in titles" :key="index" :label="item.dictName" :value="item.dictName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="飞行阶段(QAR)" prop="flightPhaseQar" v-if="activeName === 'flightphase'"  >
                    <el-select v-model="queryParams.flightPhaseQar" multiple>
                    <el-option v-for="(item, index) in responsess" :key="index" :label="item.stateName" :value="item.stateName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机号" prop="airNumber" v-if="activeName === 'modelevent'">
                  <el-input v-model="queryParams.airNumber" clearable placeholder="请输入内容"></el-input>
                </el-form-item>
                
                <el-form-item label="机型" prop="acType" v-if="activeName !== 'flightphase' && activeName !== 'eventnamegrade'">
                  <el-input v-model="queryParams.acType" clearable placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6" class="text-right">
              <el-button type="primary" size='small'  @click="resetForm()">重置</el-button>
              <el-button type="primary" size='small'  @click="querylist">查询</el-button>
              <el-button type="primary" size='small'  @click="exportExcel">导出</el-button>
          </el-col>
        </el-row>
        <el-tab-pane label="统计" name="statistics" :lazy="true">
          <el-card style="margin-top:20px;border:none" shadow='never'>
            <el-table
              size='small'
              :data="postDta"
              style="width: 100%"
              label="原因分析">
              <el-table-column
                fixed
                label='#'
                width='60px'>
                <template slot-scope="scope">
                  {{scope.$index + 1}}
                </template>
              </el-table-column>
              <el-table-column
                prop="acType"
                label="机型"
                  >
              </el-table-column>
              <el-table-column
                prop="bqhj"
                label="本期">
              </el-table-column>

              <el-table-column
                prop="qntq"
                label="去年同期">
              </el-table-column>
              
              <el-table-column
                prop="tb"
                label="同比">
              </el-table-column>
              <el-table-column
                  prop="tbbhl"
                  label="同比变化率">
              </el-table-column>
               <el-table-column
                prop="eventGrade"
                label="事件等级">
              </el-table-column>
               <el-table-column
                prop="dnlj"
                label="当年累计">
              </el-table-column>
               <el-table-column
                prop="qnlj"
                label="去年累计">
              </el-table-column>
              <el-table-column
                prop="ljzj"
                label="累计增减">
              </el-table-column>
               <el-table-column
                  prop="ljbhl"
                  label="累计变化率">
              </el-table-column>
               
            </el-table>
          </el-card>
        </el-tab-pane>
          <el-tab-pane label="机型-机号-事件等级" name="modelevent" :lazy="true">
            <ve-histogram :data="chartData" :settings="chartSettings" :extend="extend" v-if="chartData.rows.length"></ve-histogram>
            <div v-if="!chartData.rows.length" style="text-align:center;">暂无数据</div>
          </el-tab-pane>
          <el-tab-pane label="事件名称-机型-事件等级" name="eventname" :lazy="true">
            <ve-histogram :data="chartData1" :settings="chartSettings" :extend="extend" v-if="chartData1.rows.length"></ve-histogram>
            <div v-if="!chartData1.rows.length" style="text-align:center;">暂无数据</div>
          </el-tab-pane>
          <el-tab-pane label="飞行阶段-事件等级" name="flightphase" :lazy="true">
            <ve-histogram :data="chartData2" :settings="chartSettings" :extend="extend"  v-if="chartData2.rows.length"></ve-histogram>
            <div v-if="!chartData2.rows.length" style="text-align:center;">暂无数据</div>
          </el-tab-pane>
          <el-tab-pane label="事件名称-事件等级" name="eventnamegrade" :lazy="true">
            <ve-histogram :data="chartData3" :settings="chartSettings"  :extend="extend" v-if="chartData3.rows.length"></ve-histogram>
            <div v-if="!chartData3.rows.length" style="text-align:center;">暂无数据</div>
          </el-tab-pane>
        </el-tabs>
    </b-card>
  </div>
</template>
<script>
import { getBeforeWeeks } from '../../filter/reportFilter.js'
import { formatDate } from '../../utils/index.js'
import axios from 'axios'
export default {
  computed: {
    },
  data () {
    this.chartSettings = {
        borderWidth: 20
      }
      this.extend = {
        series (v) {
          if (v.length > 0 && v.length < 5) {
            v.forEach(i => {
              i.barMaxWidth = 50
              i.label = {show: true, position: 'top'}
            })
          } else {
            v.forEach(i => {
              i.label = {show: true, position: 'top'}
            })
          }
          return v
        }
      }
      this.chartExtend = {
        
      }
    return {
      EVENT_LEVEL: [],
      titles: [],
      responsess: [],
      activeName: 'statistics',
      queryParams: {
        createDate: [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')],
        eventGrade: [],
        title: [],
        flightPhaseQar: [],
        acType: '',
        airNumber: ''
      },
      postDta: [],
      chartData: {
          columns: [],
          rows: []
        },
      chartData1: {
        columns: [],
        rows: []
      },
      chartData2: {
        columns: [],
        rows: []
      },
      chartData3: {
        columns: [],
        rows: []
      }
    }
  },
  methods: {
    shijian () {
      axios.get('/api/qar/event/selectEventGrade?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1])
      .then(res => {
        if (res.data.error === 0) {
          let data = res.data.data.map(item => {
            return {
              dictName: item.eventGrade
            }
          })
          this.EVENT_LEVEL = data
        }
      })
      axios.get('/api/qar/event/listTitle?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1])
        .then(res => {
          if(res.data.error === 0) {
            let data = res.data.data.map(item => {
              return {
                dictName: item.title
              }
            })
            this.titles = data
          }
        })
    },
    querylist () {
      if(this.activeName === 'statistics') {
        
        let url = 'api/qar/event/listQarStatistics?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1] + '&acType=' + this.queryParams.acType + '&eventGrade=' + this.queryParams.eventGrade
        axios.get(url)
          .then(res => {
            if (res.data.error === 0) {
              let data = res.data.data.map(item => {
                item.tbbhl = parseInt(item.tb/item.bqhj * 100) + '%'
                item.ljbhl = parseInt(item.ljzj/item.dnlj * 100) + '%'
                return item
              })
              this.postDta = data
            }
          })
      } else if (this.activeName === 'modelevent') {
        axios.get('/api/qar/event/listacTypeNumber?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1] + '&acType=' + this.queryParams.acType + '&airNumber=' + this.queryParams.airNumber)
          .then(res => {
            let data1 = res.data.data
            let obj = {}
            let data = data1.map(item => {
              return {
                acType: (item.airNumber + '/' + item.acType).replace('/', '\n\n'),
                eventGrade: item.eventGrade,
                hj:item.hj
              }
            })
            data.forEach(item => {
              if (!obj[item.acType]){
                obj[item.acType] = {}
              }
              if(!obj[item.acType][item.eventGrade]) {
                obj[item.acType][item.eventGrade] = item.hj
              }
            })
            let rows = []
            for (var i in obj) {
              let arr = {}
              arr.acType = i
              arr['总计'] = null
              for (var k in obj[i]) {
                arr[k] = obj[i][k]
                arr['总计'] += obj[i][k]
                rows.push(arr)
              }
            }
            let eventGrade = data.map(item => {
              return item.eventGrade
            })
            let name = ['acType', ...new Set(eventGrade), '总计']
            this.chartData.rows = rows
            this.chartData.columns = name
          })
      } else if (this.activeName === 'eventname') {
        axios.get('/api/qar/event/listacTitleAcType?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1] + '&acType=' + this.queryParams.acType + '&title=' + this.queryParams.title)
          .then(res => {
            let data1 = res.data.data
            let obj = {}
            let data = data1.map(item => {
              return {
                acType: (item.acType + '/' + item.title).replace('/', '\n\n'),
                eventGrade: item.eventGrade,
                hj:item.hj
              }
            })
            data.forEach(item => {
              if (!obj[item.acType]){
                obj[item.acType] = {}
              }
              if(!obj[item.acType][item.eventGrade]) {
                obj[item.acType][item.eventGrade] = item.hj
              }
            })
            let rows = []
            for (var i in obj) {
              let arr = {}
              arr.acType = i
              arr['总计'] = null
              for (var k in obj[i]) {
                arr[k] = obj[i][k]
                arr['总计'] += obj[i][k]
                rows.push(arr)
              }
            }
            let eventGrade = data.map(item => {
              return item.eventGrade
            })
            let name = ['acType', ...new Set(eventGrade), '总计']
            this.chartData1.rows = rows
            this.chartData1.columns = name
          })
      } else if (this.activeName === 'flightphase') {
        let url = ""
        if (this.queryParams.flightPhaseQar === "" && this.queryParams.eventGrade === "") {
          url = '/api/qar/event/listFlightPhaseQarEventGrade?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1]
        }
        if (this.queryParams.flightPhaseQar !== "" && this.queryParams.eventGrade !== "") {
          url = '/api/qar/event/listFlightPhaseQarEventGrade?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1] + '&flightPhaseQar=' + this.queryParams.flightPhaseQar + '&eventGrade=' + this.queryParams.eventGrade
        }
        if (this.queryParams.flightPhaseQar === "" && this.queryParams.eventGrade !== "") {
          url = '/api/qar/event/listFlightPhaseQarEventGrade?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1] + '&eventGrade=' + this.queryParams.eventGrade
        }
        if (this.queryParams.flightPhaseQar !== "" && this.queryParams.eventGrade === "") {
          url = '/api/qar/event/listFlightPhaseQarEventGrade?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1] + '&flightPhaseQar=' + this.queryParams.flightPhaseQar
        }
        axios.get(url)
          .then(res => {
            let data = res.data.data
            let obj = {}
            data.forEach(item => {
              if (!obj[item.flightPhaseQar]) {
                obj[item.flightPhaseQar] = {}
              }
              if (!obj[item.flightPhaseQar][item.eventGrade]) {
                obj[item.flightPhaseQar][item.eventGrade] = item.hj
              }
            })
            let rows = []
            for (var i in obj) {
              let arr = {}
              arr['总计'] = null
              arr.flightPhaseQar = i
              for (var k in obj[i]) {
                arr[k] = obj[i][k]
                arr['总计'] += obj[i][k]
              }
              rows.push(arr)
            }
            let eventGrade = data.map(item => {
              return item.eventGrade
            })
            let columns = ['flightPhaseQar', ...new Set(eventGrade), '总计']
            this.chartData2.rows = rows
            this.chartData2.columns = columns
          })
      } else if (this.activeName === 'eventnamegrade') {
        axios.get('/api/qar/event/listTitleEventGrade?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1] + '&title=' + this.queryParams.title + '&eventGrade=' + this.queryParams.eventGrade)
          .then(res => {
            let data = res.data.data
            let obj ={}
            data.forEach(item => {
              if(!obj[item.title]) {
                obj[item.title] = {}
              }
              if(!obj[item.title][item.eventGrade]) {
                obj[item.title][item.eventGrade] = item.hj
              }
            })
            let rows =[]
            for (var i in obj) {
              let arr = {}
              arr['总计'] = null
              arr.title = i
              for(var k in obj[i]) {
                arr[k] = obj[i][k]
                arr['总计'] += obj[i][k]
              }
              rows.push(arr)
            }
            let eventGrade = data.map(item => {
              return item.eventGrade
            })
            let column = ['title', ...new Set(eventGrade), '总计']
            this.chartData3.rows = rows
            this.chartData3.columns = column
          })
      }
    },
    handleClick (tab, event) {
      this.resetForm()
      this.querylist()
    },
    resetForm () {
      this.$refs['querys'].resetFields()
      this.queryParams.flightPhaseQar = []
      this.queryParams.title = []
      this.queryParams.eventGrade = []
      this.EVENT_LEVEL = []
      this.titles = []
      this.queryParams.acType = ''
      this.queryParams.airNumber = ''
      this.queryParams.createDate = [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
      this.querylist()
    },
    exportExcel () {
      if (this.activeName === 'statistics') {
        this.downLoad(
        'get',
        '/api/qar/export/listQarStatistics?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1] + '&acType=' + this.queryParams.acType + '&eventGrade=' + this.queryParams.eventGrade,
        false,
        '统计'
        )
      } else if (this.activeName === 'modelevent') {
        this.downLoad(
          'get',
          '/api/qar/export/listacTypeNumber?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1] + '&acType=' + this.queryParams.acType + '&airNumber=' + this.queryParams.airNumber,
          false,
          '机型-机号-事件等级统计'
        )
      } else if (this.activeName === 'eventname') {
        this.downLoad(
          'get',
          '/api/qar/export/listacTitleAcType?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1] + '&acType=' + this.queryParams.acType + '&title=' + this.queryParams.title,
          false,
          '事件名称-机型-事件等级统计'
        )
      } else if (this.activeName === 'flightphase') {
        this.downLoad(
          'get',
          '/api/qar/export/listFlightPhaseQarEventGrade?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1] + '&flightPhaseQar=' + this.queryParams.flightPhaseQar + '&eventGrade=' + this.queryParams.eventGrade,
          false,
          '飞行阶段-事件等级统计'
        )
      } else if (this.activeName === 'eventnamegrade') {
        this.downLoad(
          'get',
          '/api/qar/export/listTitleEventGrade?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1] + '&title=' + this.queryParams.title + '&eventGrade=' + this.queryParams.eventGrade,
          false,
          '事件名称-事件等级统计'
        )
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
  created () {
    axios.get('/api/qar/event/selectEventGrade?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1])
      .then(res => {
        if (res.data.error === 0) {
          let data = res.data.data.map(item => {
            return {
              dictName: item.eventGrade
            }
          })
          this.EVENT_LEVEL = data
        }
      })
      axios.get('/api/qar/event/listTitle?' + 'startDate=' + this.queryParams.createDate[0] + '&endDate=' + this.queryParams.createDate[1])
        .then(res => {
          if(res.data.error === 0) {
            let data = res.data.data.map(item => {
              return {
                dictName: item.title
              }
            })
            this.titles = data
          }
        })
      axios.get('/api/qar/event/listQars')
        .then(res => {
          if (res.data.error === 0) {
            this.responsess = res.data.data
          }
        })
      this.querylist()
  }
}
</script>
