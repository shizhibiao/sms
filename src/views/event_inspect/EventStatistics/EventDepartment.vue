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
                <el-form-item label="部门">
                    <el-select v-model="queryParams.resDeptName"  style="width:100%" clearable multiple >
                    <el-option v-for="(item, index) in resDeptName" :key="index" :label="item.res_dept_name" :value="item.res_dept_name"></el-option>
                    </el-select>
                </el-form-item>
              <el-form-item label="事件等级">
                <el-select v-model="queryParams.caseLevel"  style="width:100%" clearable multiple>
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
import { getDepartmentList, getCascaderOb } from '../../../services/event_query'
import axios from 'axios'
export default {
    created () {
        this.EVENT_LEVEL = this.ALL_SELECT_DATA.EVENT_LEVEL.dicts
        this.querylist()
        getDepartmentList().then(result => {
            this.deptNameList = result
        })
        axios.get('/api/incdent/event/selectdept?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1])
            .then(res => {
                this.resDeptName = res.data.data
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
            EVENT_LEVEL: [],
            deptNameList: [],
            resDeptName: [],
            queryParams: {
                occurDate: [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')],
                caseLevel: [],
                resDeptName: []
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
        shijian () {
            axios.get('/api/incdent/event/selectdept?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1])
            .then(res => {
                this.resDeptName = res.data.data
            })
        },
        querylist() {
            if (this.queryParams.caseLevel === "" || this.queryParams.caseLevel == undefined) {
                axios.get('/api/incdent/event/selectEvetnStatisticdept?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&resDeptName=' + this.queryParams.resDeptName)
                .then(res => {
                    if(res.data.error === 0) {
                        let data = res.data.data
                        if (data.length > 0) {
                            let obj = {}
                            data.forEach(item => {
                                if (!obj[item.resDeptName]){
                                    obj[item.resDeptName]={}
                                }
                                if(!obj[item.resDeptName][item.caseLevel]){
                                    obj[item.resDeptName][item.caseLevel] = item.hj
                                }
                            })
                            let rows = []
                            for (var i in obj ) {
                                let arr = {}
                                arr.resDeptName = i
                                arr['总计'] = null
                                for(var k in obj[i]){
                                    arr[k] = obj[i][k]
                                    arr['总计'] += obj[i][k]
                                }
                                rows.push(arr)
                            }
                            let caseLevel = data.map(item =>{
                                return item.caseLevel
                            })
                            let columns = ['resDeptName', ...new Set(caseLevel), '总计']
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
            } else {
                axios.get('/api/incdent/event/selectEvetnStatisticdept?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&eventGrade=' + this.queryParams.caseLevel + '&resDeptName=' + this.queryParams.resDeptName)
                .then(res => {
                    if(res.data.error === 0) {
                        let data = res.data.data
                        if (data.length > 0) {
                            let obj = {}
                            data.forEach(item => {
                                if (!obj[item.resDeptName]){
                                    obj[item.resDeptName]={}
                                }
                                if(!obj[item.resDeptName][item.caseLevel]){
                                    obj[item.resDeptName][item.caseLevel] = item.hj
                                }
                            })
                            let rows = []
                            for (var i in obj ) {
                                let arr = {}
                                arr.resDeptName = i
                                arr['总计'] = null
                                for(var k in obj[i]){
                                    arr[k] = obj[i][k]
                                    arr['总计'] += obj[i][k]
                                }
                                rows.push(arr)
                            }
                            let caseLevel = data.map(item =>{
                                return item.caseLevel
                            })
                            let columns = ['resDeptName', ...new Set(caseLevel), '总计']
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
            }
            
        },
        handleChangebtn() {
            let len = getCascaderOb(this.queryParams.caseLevel, this.deptNameList).length
            let id = getCascaderOb(this.queryParams.caseLevel, this.deptNameList)[len - 1].deptCode
        },
        Reset () {
            this.queryParams.caseLevel = []
            this.queryParams.resDeptName = []
            this.queryParams.occurDate = [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
            this.querylist()
        },
        exports () {
            if (this.queryParams.caseLevel === "" || this.queryParams.caseLevel == undefined) {
                this.downLoad(
                'get',
                '/api/incdent/exporce/selectEvetnStatisticdept?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&resDeptName=' + this.queryParams.resDeptName,
                false,
                '责任部门-事件等级统计'
                )
            } else {
                this.downLoad(
                'get',
                '/api/incdent/exporce/selectEvetnStatisticdept?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&eventGrade=' + this.queryParams.caseLevel + '&resDeptName=' + this.queryParams.resDeptName,
                false,
                '责任部门-事件等级统计'
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
    computed: {
      ALL_SELECT_DATA () {
       return this.$store.state.ALL_SELECT_DATA
      }
    }
}
</script>
