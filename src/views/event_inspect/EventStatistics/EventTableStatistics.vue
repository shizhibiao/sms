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
                <el-form-item label="事件来源" prop="source">
                    <el-select clearable  v-model="queryParams.source" multiple >
                    <el-option  v-for="(item,index) in source"
                      :key="index"
                      auto-complete="off"
                      :label="item.dictName"
                      :value="item.dictCode">
                    </el-option>
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
       <el-form :model="queryParams" label-width="120px" >
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
                        prop="source"
                        label="事件来源">
                    </el-table-column>
                    <el-table-column
                        prop="beny"
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
  </el-form>
    </div>
    
</template>
<script>
import { getBeforeWeeks } from '../../../filter/reportFilter.js'
import { formatDate } from '../../../utils/index.js'
import axios from 'axios'
export default {
    created () {
        this.querylist()
    },
    data () {
        return {
            postDta: [],
            queryParams: {
                occurDate: [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')],
                source: []
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
            source: [
                {
                    dictName: '事件调查',
                    dictCode: 0
                },
                {
                    dictName: '信息报告',
                    dictCode: 1
                },
                {
                    dictName: '飞行品质',
                    dictCode: 2
                }
            ]
        }
    },
    methods: {
        querylist(){
            axios.get('/api/incdent/event/selectEvetnStatistics?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&source=' + this.queryParams.source)
                .then(res => {
                    if (res.data.error === 0) {
                        let data = res.data.data.map(item => {
                            if(item.source === '0') {
                                item.source = '事件调查'
                            } else if (item.source === '1') {
                                item.source = '信息报告'
                            } else if (item.source === '2') {
                                item.source = '飞行品质'
                            }
                            item.tbbhl = parseInt(item.tb/item.beny * 100) + '%'
                            item.ljbhl = parseInt(item.ljzj/item.dnlj * 100) + '%'
                            return item
                        })
                        this.postDta = data
                        if (res.data.data.length === 0) {
                        }
                    } else {
                        this.$message.error('查询失败' + res.data.message)
                    }
                })
        },
        Reset () {
            this.queryParams.source = []
            this.queryParams.occurDate = [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
            this.querylist()
        },
        exports() {
            this.downLoad(
                'get',
                '/api/incdent/exporce/selectEvetnStatistics?' + 'startDate=' + this.queryParams.occurDate[0] + '&endDate=' + this.queryParams.occurDate[1] + '&source=' + this.queryParams.source,
                false,
                '统计'
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
