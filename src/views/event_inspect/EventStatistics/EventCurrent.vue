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
                  @change="shijian"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  auto-complete="off"
                  :picker-options="pickerOptions2"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                </el-form-item>
                <el-form-item label="一级原因">
                         <el-select v-model="id" style="width:100%" multiple >
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
import { grtclassa, getCascaderOb } from '../../../services/event_query'
import axios from 'axios'
export default {
    created () {
        this.querylist()
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
            reasonss: [],
            resonId1: [],
            resonId1s: [],
            queryParams: {
                occurDate: [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
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
            },
            id: []
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
            if (this.id === null || this.id === undefined) {
                axios.get('/api/incdent/event/listStatisticCurrentPResponsible?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1])
                .then(res => {
                    if(res.data.error === 0) {
                        let data = res.data.data
                        
                            let obj = {}
                            data.forEach(item => {
                                if (!obj[item.reson_id1]){
                                    obj[item.reson_id1]={}
                                }
                                if(!obj[item.reson_id1][item.reson_id1]){
                                    obj[item.reson_id1][item.reson_id1] = item.hj
                                }
                            })
                            let rows = []
                            let num = 0
                            for (var i in obj ) {
                                let arr = {}
                                arr.reson_id1 = i
                                
                                for(var k in obj[i]){
                                    arr[k] = obj[i][k]
                                    num += obj[i][k]
                                }
                                rows.push(arr)
                            }
                            let reson_id1 = data.map(item =>{
                                return item.reson_id1
                            })
                            let columns = ['reson_id1', ...new Set(reson_id1), '总计']
                            this.chartData.rows = rows
                            this.chartData.columns = columns
                            this.chartData.rows.push({
                                'reson_id1': '总计',
                                '总计': num
                            })
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
                
            } else {
                axios.get('/api/incdent/event/listStatisticCurrentPResponsible?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&resonId1=' + this.id)
                .then(res => {
                    if(res.data.error === 0) {
                        let data = res.data.data
                        
                            let obj = {}
                            data.forEach(item => {
                                if (!obj[item.reson_id1]){
                                    obj[item.reson_id1]={}
                                }
                                if(!obj[item.reson_id1][item.reson_id1]){
                                    obj[item.reson_id1][item.reson_id1] = item.hj
                                }
                            })
                            let rows = []
                            let num = 0
                            for (var i in obj ) {
                                let arr = {}
                                arr.reson_id1 = i
                                
                                for(var k in obj[i]){
                                    arr[k] = obj[i][k]
                                    num += obj[i][k]
                                }
                                rows.push(arr)
                            }
                            let reson_id1 = data.map(item =>{
                                return item.reson_id1
                            })
                            let columns = ['reson_id1', ...new Set(reson_id1), '总计']
                            this.chartData.rows = rows
                            this.chartData.columns = columns
                            this.chartData.rows.push({
                                'reson_id1': '总计',
                                '总计': num
                            })
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
            }
        },
        handleChanges () {
            let len = this.resonId1s.length - 1
            this.id = this.resonId1s[len]
            // let len = getCascaderOb(this.resonId1s, this.resonId1).length
            // let id = getCascaderOb(this.resonId1s, this.resonId1)[len - 1].id
        },
        Reset () {
            this.resonId1s = []
            this.queryParams.occurDate = [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
            this.id = []
            this.querylist()
        },
        exports () {
            if (this.id === null || this.id === undefined) {
                this.downLoad(
                'get',
                '/api/incdent/exporce/listStatisticCurrentPResponsible?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1],
                false,
                '本期-原因分析一级统计'
                )
            } else {
                this.downLoad(
                'get',
                '/api/incdent/exporce/listStatisticCurrentPResponsible?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&resonId1=' + this.id,
                false,
                '本期-原因分析一级统计'
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
