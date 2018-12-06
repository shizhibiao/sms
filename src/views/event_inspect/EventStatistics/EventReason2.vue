<template>
    <div class="animated fadeIn">
        <el-row :gutter="12">
        <el-col :span="20">
        <el-form :inline="true" :model="queryParams"  ref="queryParams" status-icon>
             <el-form-item label="发生日期" prop="occurDate">
                <el-date-picker
                :clearable='false'
                @change="shijian"
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
                <el-form-item label="机型">
                    <el-select v-model="queryParams.airNumber"  style="width:100%" multiple>
                    <el-option v-for="(item, index) in airNumbe" :key="index" :label="item.number" :value="item.number"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="一级原因">
                    <el-select v-model="causeType"  style="width:100%" multiple>
                    <el-option v-for="(item, index) in REASON_TYEP" :key="index" :label="item.dictName" :value="item.dictName"></el-option>
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
        axios.get('/api/incdent/event/listResonId2?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&causeType=' + this.causeType)
            .then(res => {
                let data = res.data.data.map(item => {
                    return {
                        dictName: item.resonId2
                    }
                })
                this.REASON_TYEP = data
            })
        axios.get('/api/incdent/event/listType?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1])
            .then(res => {
                this.airNumbe = res.data.data
            })
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
            queryParams: {
                occurDate: [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')],
                airNumber: []
            },
            airNumbe: [],
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
            causeType: [],
            REASON_TYEP: [],
            chartData: {
                columns: [],
                rows: []
            }
        }
    },
    methods: {
        shijian () {
            axios.get('/api/incdent/event/listResonId2?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&causeType=' + this.causeType)
            .then(res => {
                let data = res.data.data.map(item => {
                    return {
                        dictName: item.resonId2
                    }
                })
                this.REASON_TYEP = data
            })
        axios.get('/api/incdent/event/listType?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1])
            .then(res => {
                this.airNumbe = res.data.data
            })
        },
        querylist() {
            axios.get('/api/incdent/event/listStatisticType?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&causeType=' + this.causeType + '&airNumber=' + this.queryParams.airNumber)
                .then(res => {
                    if(res.data.error === 0) {
                        let data = res.data.data
                        if (data.length > 0) {
                            let obj = {}
                            data.forEach(item => {
                                if (item.number === null) {
                                    return ""
                                }
                                if (!obj[item.number]){
                                    obj[item.number]={}
                                }
                                if(!obj[item.number][item.name]){
                                    obj[item.number][item.name] = item.hj
                                }
                            })
                            let rows = []
                            for (var i in obj ) {
                                let arr = {}
                                arr.number = i
                                for(var k in obj[i]){
                                    arr[k] = obj[i][k]
                                }
                                rows.push(arr)
                            }
                            let name = data.map(item =>{
                                return item.name
                            })
                            let columns = ['number', ...new Set(name)]
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
        Reset () {
            this.queryParams.airNumbe = []
            this.queryParams.occurDate = [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
            this.causeType = []
            this.querylist()
        },
        exports () {
            if (this.causeType === "" || this.causeType === undefined) {
                this.downLoad(
                'get',
                '/api/incdent/exporce/listStatisticType?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1],
                false,
                '机型-原因分析一级统计'
                )
            } else {
                this.downLoad(
                'get',
                '/api/incdent/exporce/listStatisticType?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&causeType=' + this.causeType,
                false,
                '机型-原因分析一级统计'
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
