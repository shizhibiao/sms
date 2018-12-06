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
                  <el-form-item label="事件等级">
                    <el-select v-model="caseLevel"  style="width:100%" multiple >
                    <el-option v-for="(item, index) in EVENT_LEVEL" :key="index" :label="item.dictName" :value="item.dictName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="一级原因">
                         <el-select v-model="resonId1" style="width:100%" multiple >
                        <el-option v-for="(item, index) in reasonss"
                        :key="index" :label="item.reasonName" :value='item.reasonName'></el-option>
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
import { getCascaderOb } from '../../../services/event_query'
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
        axios.get('/api/incdent/event/listResonId2?' +  'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1])
            .then(res => {
                let data = res.data.data.map(item => {
                    return {
                        reasonName: item.resonId2
                    }
                })
                this.reasonss = data
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
            reasonss:[],
            resonId1s: [],
            resonId1: [],
            queryParams: {
                occurDate: [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
            },
            caseLevel: [],
            EVENT_LEVEL: [],
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
            },
            id: null
        }
    },
    methods: {
        shijian () {
            axios.get('/api/incdent/event/listResonId2?' +  'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1])
            .then(res => {
                let data = res.data.data.map(item => {
                    return {
                        reasonName: item.resonId2
                    }
                })
                this.reasonss = data
            })
        },
        querylist() {
                axios.get('/api/incdent/event/listStatisticCurrentPRyj?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&causeType=' + this.caseLevel + '&resonId1=' + this.resonId1)
                .then(res => {
                    if(res.data.error === 0) {
                        let data = res.data.data
                        if (data.length > 0) {
                            let obj = {}
                            data.forEach(item => {
                                if (!obj[item.caseLevel]){
                                    obj[item.caseLevel]={}
                                }
                                if(!obj[item.caseLevel][item.reson_id1]){
                                    obj[item.caseLevel][item.reson_id1] = item.hj
                                }
                            })
                            let rows = []
                            for (var i in obj ) {
                                let arr = {}
                                arr.caseLevel = i
                                for(var k in obj[i]){
                                    arr[k] = obj[i][k]
                                }
                                rows.push(arr)
                            }
                            let reson_id1 = data.map(item =>{
                                return item.reson_id1
                            })
                            let columns = ['caseLevel', ...new Set(reson_id1)]
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
        handleChanges () {
            let len = this.resonId1s.length - 1
            this.id = this.resonId1s[len]
        },
        Reset () {
            this.caseLevel = []
            this.resonId1 = []
            this.queryParams.occurDate = [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
            this.querylist()
        },
        
        exports () {
                this.downLoad(
                'get',
                '/api/incdent/exporce/listStatisticCurrentPRyj?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&resonId1=' + this.caseLevel,
                false,
                '事件等级-原因分析一级统计'
                )
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
