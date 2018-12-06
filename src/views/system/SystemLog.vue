<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <el-date-picker
          v-model="value"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <button class="btn btn-info btn-sm float-right mt-1" @click="refresh()"><i class="fa fa-search"></i> 查询</button>
      </div>
      <b-card-body>
        <div class="table-responsive-sm">
          <table class="table table-striped table-condensed table-hover">
            <thead>
            <tr>
              <th style="width: 4%">#</th>
              <th style="width: 12%">时间</th>
              <th style="width: 14%">调用接口</th>
              <th style="width: 14%">接口描述</th>
              <th style="width: 8%">用户</th>
              <th style="width: 8%">设备</th>
              <th style="width: 20%">参数</th>
              <th style="width: 5%">结果</th>
              <th style="width: 6%">耗时(ms)</th>
              <th style="width: 9%">附加信息</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(log, index) in logs" :key="index">
              <td>{{index + 1}}</td>
              <td>{{log.logTime}}</td>
              <td style="word-wrap:break-word; min-width: 100px; max-width: 200px">{{log.callApi}}</td>
              <td style="word-wrap:break-word; min-width: 100px; max-width: 200px">{{log.apiDesc}}</td>
              <td>{{log.userNo}}</td>
              <td>{{log.remoteHost}}</td>
              <td style="word-wrap:break-word; min-width: 100px; max-width: 200px">{{log.inputParams}}</td>
              <td>{{log.error}}</td>
              <td>{{log.timeConsuming}}</td>
              <td>{{log.remark}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <b-row>
          <b-col sm="12" v-if="totalPages>1">
            <b-pagination size="md" :total-rows="total" v-model="curPage" :per-page="pageSize" :limit="5"
                          align="right"></b-pagination>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
  import axios from 'axios'
  import { formatDate } from '../../utils/index.js'

  export default {
    name: 'system-log',
    data () {
      return {
        pickerOptions2: {
          shortcuts: [{
            text: '最近一天',
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
        value: [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
        total: 0,
        curPage: 1,
        pageSize: 20,
        totalPages: 1,
        logs: []
      }
    },
    watch: {
      curPage: function (newValue, oldValue) {
        this.getData()
      }
    },
    methods: {
      refresh () {
        this.curPage = 1
        this.getData()
      },
      getData () {
        if (!this.value.hasOwnProperty('length') || this.value.length < 2) {
          alert('请选择日期范围')
          return
        }

        let start = this.value[0]
        let end = this.value[1]
        let pageNo = this.curPage - 1
        axios.get('/api/system/log?startDate=' + start + '&endDate=' + end + '&pageNum=' + pageNo + '&pageSize=' + this.pageSize)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.total = page.totalElements
              this.totalPages = page.totalPages
              this.logs = page.content
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      }
    },
    created () {
      this.refresh()
    }
  }
</script>

<style scoped>

</style>
