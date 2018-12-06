<template>
    <div class="animated fadeIn">
        <el-row :gutter="12">
        <el-col :span="20">
        <el-form :inline="true" :model="queryParams"  ref="queryParams" status-icon>
             <el-form-item label="发生日期" prop="occurDate">
                <el-date-picker
                :clearable='false'
                  v-model="queryParams.occurDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  auto-complete="off"
                  :picker-options="pickerOptions2"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                </el-form-item>
                <el-form-item label="事件等级">
                    <el-select v-model="queryParams.caseLevel"  style="width:100%" clearable multiple >
                    <el-option v-for="(item, index) in EVENT_LEVEL" :key="index" :label="item.dictName" :value="item.dictName"></el-option>
                    </el-select>
                </el-form-item>
        </el-form>
        </el-col>
          <el-col :span="4" class="text-right">
              <el-button type="primary" size='small'   @click="Reset">重置</el-button>
              <el-button type="primary" size='small'  @click="querylist">查询</el-button>
              <el-button type="primary" size='small'  @click="exports">导出</el-button>

          </el-col>
        </el-row>
        <ve-histogram :data="chartData" :extend="extend" v-if="chartData.rows.length"></ve-histogram>
        <div v-if="!chartData.rows.length" style="text-align:center;">暂无数据</div>

    </div>
</template>
<script>
import { getBeforeWeeks } from '../../../filter/reportFilter.js'
import { formatDate } from '../../../utils/index.js'
import axios from 'axios'
export default {
    computed: {
      ALL_SELECT_DATA () {
       return this.$store.state.ALL_SELECT_DATA
      }
    },
    created () {
        this.querylist()
        this.EVENT_LEVEL = this.ALL_SELECT_DATA.EVENT_LEVEL.dicts
    },
    data () {
        this.extend = {
            // series: {
            //     label: { show: true, position: "top" },
            //     barMaxWidth: 50
            // }
            series (v) {
                if (v.length > 0 && v.length < 4) {
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
        return {
            EVENT_LEVEL: [],
            queryParams: {
                occurDate: [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')],
                caseLevel: []
            },
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一周',
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
            chartData: {
                columns: [],
                rows: []
            }
        }
    },
    methods: {
        querylist() {
            axios.get('/api/incdent/event/listStatisticMonth?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&eventGrade=' + this.queryParams.caseLevel)
                .then(res => {
                    if (res.data.error === 0) {
                        let data = res.data.data.map(item => {
                            let len = item.yearMonth.split('-').length - 1
                            let yearMonth = item.yearMonth.split('-')[len]
                            let month = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                            return {
                                yearMonth: month[Number(yearMonth) - 1],
                                caseLevel: item.caseLevel,
                                hj: item.hj
                            }
                        })
                        if (data.length > 0) {
                            let obj = {}
                            data.forEach(item => {
                                if (!obj[item.yearMonth]){
                                    obj[item.yearMonth] = {}
                                }
                                if (!obj[item.yearMonth][item.caseLevel]){
                                    obj[item.yearMonth][item.caseLevel] = item.hj
                                }
                            })
                            let rows = []
                            for (var i in obj) {
                                let arr = {}
                                arr.yearMonth = i
                                arr['总计'] = null
                                for (var k in obj[i]){
                                    arr[k] = obj[i][k]
                                    arr['总计'] += obj[i][k]
                                }
                                rows.push(arr)
                            }
                            let caseLevel = data.map(item =>{
                                return item.caseLevel
                            })
                            let columns = ['yearMonth', ...new Set(caseLevel), '总计']
                            this.chartData.rows = rows
                            this.chartData.columns = columns
                            
                        }
                        if (res.data.data.length === 0) {
                            this.chartData.columns = []
                            this.chartData.rows = []
                        }
                    } else {
                        this.$message.error('查询失败' + res.data.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.$message.error('网咯超时请检查网咯')
                })
        },
        Reset() {
            this.queryParams.occurDate = [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
            this.queryParams.caseLevel = []
            this.querylist()
        },
        exports () {
            if (this.queryParams.caseLevel === "" || this.queryParams.caseLevel === undefined ) {
                this.downLoad(
                'get',
                '/api/incdent/exporce/listStatisticMonth?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1],
                false,
                '月度-事件等级统计'
                )
            } else {
                this.downLoad(
                'get',
                '/api/incdent/exporce/listStatisticMonth?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&eventGrade=' + this.queryParams.caseLevel,
                false,
                '月度-事件等级统计'
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
    }
}
</script>
