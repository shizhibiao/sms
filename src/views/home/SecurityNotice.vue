<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
        安全公告
      </b-card-header>
      <b-card-body>
        <el-table stripe
                  size="small"
                  :data='items'
                  style='width: 100%'>
          <el-table-column
            fixed
            label='序号'
            width='80px'>
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column
            prop='noticeTitle'
            label='标题'>
          </el-table-column>
          <el-table-column
            fixed="right"
            prop='issueTime'
            label='发布日期'
            width="150px">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="60px">
            <template slot-scope="scope">
              <el-button  type="text" size="small" @click="getShow(scope.row.noticeId)">
                <i class="fa fa-edit" ></i> 查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <b-row>
          <b-col sm='11' v-if='totalPages>1'>
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
  import axios from 'axios'
  import { formatDate } from '../../utils/index.js'

  export default {
    name: 'SecurityNotice',
    data () {
      return {
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
        let page = this.curPage - 1
        let startTime = formatDate(new Date(new Date().getTime() - 3600 * 1000 * 24 * 14), 'yyyy-MM-dd')
        let endTime = formatDate(new Date(new Date().getTime() + 86400000), 'yyyy-MM-dd')
        startTime = parseInt(startTime.toString().replace(/-/g, ''))
        endTime = parseInt(endTime.toString().replace(/-/g, ''))
        axios.get('/api/securitynotice/published?pageNum=' + page + '&pageSize=' + this.pageSize + '&startTime=' + startTime + '&endTime=' + endTime)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.total = page.totalElements || 0
              this.totalPages = page.totalPages || 0
              this.items = page.content || []
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      getShow (noticeId) {
        let flag = 1
        let url = '/proclamation/news_edit/' + noticeId + '/' + flag
        this.$router.push({path: url})
      }
    },
    created () {
      this.getData()
    }
  }
</script>

<style scoped>

</style>
