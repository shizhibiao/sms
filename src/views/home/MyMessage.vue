<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
        <el-row :gutter="12">
          <el-col :span="20">
            <el-form inline>
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
              <el-form-item label="阅读状态">
                <el-select v-model="processed" :clearable='true'>
                  <el-option label="未读" value="0"></el-option>
                  <el-option label="已读" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button type="primary" @click="getData()" size='small'>查询</el-button>
          </el-col>
        </el-row>
      </b-card-header>
      <b-card-body>
        <el-table stripe
                  size="small"
                  :data='items'>
          <el-table-column
            fixed
            label='#'
            width='60px'>
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column
            prop='title'
            label='标题'>
          </el-table-column>
          <el-table-column
            prop='content'
            label='内容'>
          </el-table-column>
          <el-table-column
            prop='createTime'
            label='报告日期'
            width='150px'>
          </el-table-column>
          <el-table-column
            prop='processedDesc'
            label='流程状态'
            width="120px">
          </el-table-column>
          <el-table-column
            prop='readFlagDesc'
            label='阅读状态'
            width="120px">
          </el-table-column>
          <el-table-column
            label="操作"
            width="60px">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.readFlag" type="text" size="small" @click="dealMsg(scope.row)">
                <i class="fa fa-edit"></i> 阅读</el-button>
            </template>
          </el-table-column>
        </el-table>
        <b-row>
          <b-col class="mt-1" v-if='totalPages>1'>
            <el-pagination
              background
              :pager-count="5"
              :current-page.sync="curPage"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="total"
              align="right">
            </el-pagination>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
  import { formatDate } from '../../utils/index.js'
  import axios from 'axios'

  export default {
    name: 'MyMessage',
    data () {
      return {
        processed: null,
        daterange: [formatDate(new Date(new Date().getTime() - 3600 * 1000 * 24 * 6), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
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
        items: [],
        total: 0,
        curPage: 1,
        pageSize: 15,
        totalPages: 1
      }
    },
    watch: {
      curPage: function (newValue, oldValue) {
        this.getData()
      }
    },
    methods: {
      getData () {
        if (!this.daterange.hasOwnProperty('length') || this.daterange.length < 2) {
          this.$message.warning('请选择日期范围')
          return
        }

        let start = this.daterange[0]
        let end = this.daterange[1]
        let pageNo = this.curPage - 1
        let url = '/api/msg/list?startDate=' + start + '&endDate=' + end + '&pageNum=' + pageNo + '&pageSize=' + this.pageSize
        if (this.processed !== null && this.processed !== '' && (+this.processed === 0 || +this.processed === 1)) {
          url += '&processed=' + this.processed
        }
        axios.get(url)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.total = page.totalElements
              this.totalPages = page.totalPages
              this.items = page.content || []
              if (this.items && this.items.length > 0) {
                for (let data of this.items) {
                  if (data.processed) {
                    if (+data.processed === 0) {
                      data.processedDesc = '未处理'
                    } else {
                      data.processedDesc = '已处理'
                    }
                  } else {
                    data.processedDesc = '未处理'
                  }
                  if (data.readFlag) {
                    if (+data.readFlag === 0) {
                      data.readFlagDesc = '未读'
                    } else {
                      data.readFlagDesc = '已读'
                    }
                  } else {
                    data.readFlagDesc = '未读'
                  }
                }
              }
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      dealMsg (msg) {
        // console.log(msg)
        this.readMessage(msg.id)
        this.$router.push({path: msg.sourceUrl})
      },
      readMessage (msgId) {
        axios.get('/api/msg/read?msgId=' + msgId)
          .then(response => {

          })
      }
    },
    created () {
      this.getData()
    }
  }
</script>

<style scoped>

</style>
