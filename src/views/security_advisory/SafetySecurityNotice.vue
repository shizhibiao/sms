<template>
<div class="animated fadeIn">
  <b-card nobody>
    <div slot="header">
      <div class="row">
        <div class="col-md-10 col-sm-9">
          <div class="search">
            <el-form inline>
              <el-form-item label="发生时间">
                <el-date-picker
                  v-model="valueTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="标题">
                <el-input
                  clearable
                  placeholder='请输入标题'
                  v-model='selectTitle'>
                </el-input>
              </el-form-item>
              <el-form-item label="公告类型">
                <el-select v-model="type" filterable clearable placeholder="请选择公告类型">
                  <el-option
                    v-for="item in typeList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="col-md-2 col-sm-3">
          <button class='btn btn-info mt-1' @click="addNew()"><i class='fa fa-edit'></i> 新增</button>
          <button class='btn btn-primary mt-1' @click="getCheckData()"><i class="fa fa-search"></i> 查询</button>
          <!--<button class='btn btn-primary mt-1' @click="this.refresh"><i class='fa fa-refresh'></i> 刷新</button>-->
        </div>
      </div>
    </div>

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
          label='标题'
          width='150px'>
        </el-table-column>
        <el-table-column
          prop='noticeTypeName'
          label='公告类型'>
        </el-table-column>
        <el-table-column
          prop='issueTime'
          label='发布日期'>
        </el-table-column>
        <el-table-column
          prop='issuerName'
          label='发布人'>
        </el-table-column>
        <el-table-column
          prop='isSend'
          label='状态'
          :formatter="formatterData">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200px">
          <template slot-scope="scope">
            <el-button  type="text" size="small" @click="getShow(scope.row.noticeId)">
              <i class="fa fa-edit" ></i> 查看</el-button>
            <el-button  type="text" size="small" @click="editInfo(scope.row.noticeId)">
              <i class="fa fa-edit"></i> 编辑</el-button>
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
    name: 'put',
    data () {
      return {
        operationType: 0,
        items: [],
        valueTime: [this.getDefaultTime(), new Date()],
        selectTitle: '',
        type: '',
        noticeTypeName: '',
        noticeId: 0,
        typeList: [],
        total: 0,
        curPage: 1,
        pageSize: 20,
        totalPages: 1
      }
    },
    watch: {
      curPage: function (newValue, oldValue) {
        this.getCheckData()
      }
    },
    methods: {
      getData () {
        let pageNo = this.curPage - 1
        let startTime = formatDate(this.valueTime[0], 'yyyy-MM-dd')
        let endTime = formatDate(new Date(this.valueTime[1].getTime() + 86400000), 'yyyy-MM-dd')
        startTime = parseInt(startTime.toString().replace(/-/g, ''))
        endTime = parseInt(endTime.toString().replace(/-/g, ''))
        axios.get('/api/securitynotice?pageNum=' + pageNo + '&pageSize=' + this.pageSize + '&startTime=' + startTime + '&endTime=' + endTime)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.total = page.totalElements || 0
              this.totalPages = page.totalPages || 0
              this.items = page.content || []
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      formatterData: function (row, column) {
        var value = row[column.property]
        if (column.label === '状态') {
          if (parseInt(value) === 0) {
            return '未发布'
          } else if (parseInt(value) === 1) {
            return '已发布'
          }
        }
        return value
      },
      getDefaultTime () {
        if (new Date().getMonth() - 1 === new Date().getMonth()) {
          return new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).getTime() - 86400000 * 5)
        } else {
          return new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      },
      refresh () {
        this.getData()
      },
      getTypeList () {
        axios.get('/api/system/dictionary/by_type?dictType=SECURITY_NOTICE')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.typeList = page
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      getShow (noticeId) {
        this.operationType = 1
        let flag = this.operationType
        console.log('===================' + noticeId)
        let url = '/proclamation/news_edit/' + noticeId + '/' + flag
        this.$router.push({path: url})
      },
      editInfo (noticeId) {
        this.operationType = 2
        let flag = this.operationType
        let url = '/proclamation/news_edit/' + noticeId + '/' + flag
        this.$router.push({path: url})
      },
      addNew () {
        this.operationType = 3
        let flag = this.operationType
        let url = '/proclamation/news_edit/' + 0 + '/' + flag
        this.$router.push({path: url})
      },
      getCheckData () {
        if (this.valueTime === null || this.valueTime === '') {
          alert('请选择起始年月')
          return
        }
        let startTime = formatDate(this.valueTime[0], 'yyyy-MM-dd')
        let endTime = formatDate(new Date(this.valueTime[1].getTime() + 86400000), 'yyyy-MM-dd')
        startTime = parseInt(startTime.toString().replace(/-/g, ''))
        endTime = parseInt(endTime.toString().replace(/-/g, ''))
        let pageNo = this.curPage - 1
        let url = '/api/securitynotice/byCondition?&pageNum=' + pageNo + '&pageSize=' + this.pageSize + '&title=' + this.selectTitle + '&type=' + this.type + '&startTime=' + startTime + '&endTime=' + endTime
        axios.get(url)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.total = page.totalElements || 0
              this.totalPages = page.totalPages || 0
              this.items = page.content || []
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      }
    },
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    created () {
      this.getTypeList()
      this.getData()
    }
  }
</script>

<style scoped>

</style>
