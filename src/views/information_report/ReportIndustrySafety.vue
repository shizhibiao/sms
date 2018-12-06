<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <el-row :gutter="12">
          <el-col :span="20">
            <el-form inline>
              <el-form-item label="发生日期">
                <el-date-picker
                  :clearable="false"
                  v-model="valueTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="标题">
                <el-input
                  clearable
                  placeholder='请输入标题'
                  v-model='selectTitle'>
                </el-input>
              </el-form-item>
              <el-form-item label="归属地">
                <el-select v-model="belongAddress" filterable clearable placeholder="请选择归属地">
                  <el-option
                    v-for="item in belongList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="报告人" v-if="showMore">
                <el-input
                  clearable
                  placeholder='请输入报告人'
                  prefix-icon='el-icon-search'
                  v-model='selectReporter'>
                </el-input>
              </el-form-item>
              <el-form-item label="事发地点" v-if="showMore">
                <el-input
                  clearable
                  placeholder='请输入事发地点'
                  prefix-icon='el-icon-search'
                  v-model='selectAddress'>
                </el-input>
              </el-form-item>
              <el-form-item label="是否匿名" v-if="showMore">
                <el-select v-model="selectAnonymous" filterable clearable placeholder="请选择是否匿名">
                  <el-option
                    v-for="item in AnonymousList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="事件类型" v-if="showMore">
                <el-select v-model="type" filterable clearable placeholder="请选择事件类型">
                  <el-option
                    v-for="item in typeList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="报告部门" v-if="showMore">
                <el-cascader :options="deptNameList" v-model="submitDeptName" :props='{value:"value"}' :show-all-levels="false" :clearable='true' :change-on-select="true"  @change="cascaderHandel"></el-cascader>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button size='small' type="warning" @click="showMoreHandle">{{showMoreLabel}}</el-button>
            <el-button size='small' type="primary" @click="refresh()">重置</el-button>
            <el-button size="small" type="primary" class="mt-1" @click="getCheckData()">查询</el-button>
            <el-button size="small" type="success" class="mt-1" @click="addNew()">新增</el-button>
          </el-col>
        </el-row>
      </div>
      <b-card-body>
        <el-table stripe
                  size="small"
                  style="width: 100%"
                  :data='items'>
          <el-table-column
            label='#'
            width='50px'>
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column
            prop='title'
            label='标题'>
          </el-table-column>
          <el-table-column
            prop='occurDate'
            label='发生日期'>
          </el-table-column>
          <el-table-column
            prop='occurAddress'
            label='发生地点'>
          </el-table-column>
          <el-table-column
            prop='acType'
            label='机型'>
          </el-table-column>
          <el-table-column
            prop='eventGradeName'
            label='事件等级'>
          </el-table-column>
          <el-table-column
            prop='infoBelong'
            label='归属地'
            :formatter="formatterData">
          </el-table-column>
          <el-table-column
            label="操作"
            width='300px'>
            <template slot-scope="scope">
              <el-button type="primary" size='mini'
                @click="editInfo(scope.row.reportNumber)">编辑</el-button>
              <el-button type="danger" size='mini'
                @click="deleteInfo(scope.row.reportNumber)">删除</el-button>
              <el-button size='mini' type="success"
                @click="sendMail(scope.row.reportNumber)">发送邮件</el-button>
              <el-button type="default" size='mini'
                @click="getShow(scope.row.reportNumber)">查看</el-button>
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
  import { getBeforeWeeks, ransfromProcessState } from '../../filter/reportFilter.js'
  import { getDepartmentList } from '../../services/safety_notice'
  export default {
    name: 'news',
    data () {
      return {
        operationType: 0,
        items: [],
        valueTime: [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')],
        selectReporter: '',
        reportNumber: 0,
        selectBelong: 0,
        selectTitle: '',
        selectAddress: '',
        belongAddress: '',
        selectAnonymous: '',
        type: '',
        dept: '',
        dictName: '',
        typeList: [],
        deptList: [],
        // 获取部门
        deptNameList: [],
        submitDeptName: [],
        total: 0,
        curPage: 1,
        pageSize: 15,
        totalPages: 1,
        belongList: [
          {
            value: 0,
            label: '国内'
          }, {
            value: 1,
            label: '国外'
          }
        ],
        AnonymousList: [
          {
            value: 0,
            label: '非匿名'
          }, {
            value: 1,
            label: '匿名'
          }
        ],
      showMore: false,
      showMoreLabel: '更多'
      }
    },
    watch: {
      curPage: function (newValue, oldValue) {
        this.getCheckData()
      }
    },
    methods: {
      // 报告部门不能取一级数据
      cascaderHandel () {
        let deptName = this.submitDeptName && this.submitDeptName.length > 0 ? this.submitDeptName[this.submitDeptName.length - 1] : ''
        if (deptName.length === 1) {
          this.submitDeptName = []
        }
      },
      showMoreHandle () {
        this.showMore = !this.showMore
        if (this.showMore) {
          this.showMoreLabel = '隐藏'
        } else {
          this.showMoreLabel = '更多'
        }
      },
      getData () {
        let pageNo = this.curPage - 1
        let startTime = this.valueTime[0]
        let endTime = this.valueTime[1]
        startTime = parseInt(startTime.toString().replace(/-/g, ''))
        endTime = parseInt(endTime.toString().replace(/-/g, ''))
        axios.get('/api/reportIndustrySafety?pageNum=' + pageNo + '&pageSize=' + this.pageSize + '&startTime=' + startTime + '&endTime=' + endTime)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.total = page.totalElements || 0
              this.totalPages = page.totalPages || 0
              this.items = page.content || []
            } else {
              this.$message({
                type: 'error',
                message: '请求失败：' + data.message
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '请求失败：' + error
            })
          })
      },
      sendMail (id) {
        let url = '/mail/send-mail/1/'+ id
        this.$router.push({path: url})
      },
      getTypeList () {
        axios.get('/api/system/dictionary/by_type?dictType=EVENT_TYEP')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.typeList = page
            } else {
              this.$message({
                type: 'error',
                message: '请求失败：' + data.message
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '请求失败：' + error
            })
          })
      },
      getShow (reportNumber) {
        this.operationType = 1
        let flag = this.operationType
        let url = '/report/news_edit/' + reportNumber + '/' + flag
        this.$router.push({path: url})
      },
      editInfo (reportNumber) {
        this.operationType = 2
        let flag = this.operationType
        let url = '/report/news_edit/' + reportNumber + '/' + flag
        this.$router.push({path: url})
      },
      addNew () {
        this.operationType = 3
        let flag = this.operationType
        let url = '/report/news_edit/' + 0 + '/' + flag
        this.$router.push({path: url})
      },
      getDeptList () {
        axios.get('/api/system/dept/children')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              let list = []
              for (var i = 0; i < page.length; i++) {
                list[i] = page[i].deptName
              }
              this.deptList = list
              // console.log('====' + page)
            } else {
              this.$message({
                type: 'error',
                message: '请求失败：' + data.message
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '请求失败：' + error
            })
          })
      },
      formatterData: function (row, column) {
        var value = row[column.property]
        if (column.label === '是否匿名') {
          if (parseInt(value) === 0) {
            return '匿名'
          } else if (parseInt(value) === 1) {
            return '非匿名'
          }
        } else if (column.label === '归属地') {
          if (parseInt(value) === 0) {
            return '国内'
          } else if (parseInt(value) === 1) {
            return '国外'
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
      deleteInfo (reportNumber) {
        this.$confirm('确定删除该条行业安全信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/api/reportIndustrySafety/' + reportNumber)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.$message({type: 'success', message: '行业安全信息删除成功'})
                this.getData()
              } else {
                let msg = {type: 'error', message: '行业安全信息删除失败:' + data.message}
                this.$message(msg)
              }
            })
            .catch(response => {
              this.$message({type: 'error', message: '服务器或网络异常'})
            })
        })
      },
      getCheckData () {
        if (this.valueTime === null) {
          alert('请选择起始年月')
          return
        }
        let startTime = this.valueTime[0]
        let endTime = this.valueTime[1]
        if (startTime === null || startTime === '') {
          alert('请选择起始年月')
          return
        }
        if (this.endValue === null || this.endValue === '') {
          this.endValue = formatDate(new Date(), 'yyyy-MM-dd')
        }
        startTime = parseInt(startTime.toString().replace(/-/g, ''))
        endTime = parseInt(endTime.toString().replace(/-/g, ''))
        let pageNo = this.curPage - 1
        this.dept = this.submitDeptName && this.submitDeptName.length > 0 ? this.submitDeptName[this.submitDeptName.length - 1] : ''
        let url = '/api/reportIndustrySafety/byCondition?&pageNum=' + pageNo + '&pageSize=' + this.pageSize + '&startDate=' + startTime + '&endDate=' + endTime + '&anonymous=' +
          this.selectAnonymous + '&reporterName=' + this.selectReporter + '&deptName=' + this.dept + '&occurAddress=' + this.selectAddress + '&title=' + this.selectTitle + '&eventType=' + this.type + '&infoBelong=' + this.belongAddress
        axios.get(url)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.total = page.totalElements || 0
              this.totalPages = page.totalPages || 0
              this.items = page.content || []
            } else {
              this.$message({
                type: 'error',
                message: '请求失败：' + data.message
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '请求失败：' + error
            })
          })
      },
      refresh () {
        this.valueTime = [getBeforeWeeks(new Date(), 'yyyy-MM-dd'), formatDate((new Date()), 'yyyy-MM-dd')]
        this.selectReporter = ''
        this.selectBelong = ''
        this.selectTitle = ''
        this.selectAddress = ''
        this.belongAddress = ''
        this.selectAnonymous = ''
        this.type = ''
        this.dept = ''
        this.submitDeptName = []
        this.getData()
        // 重置后重新查询数据
        this.getCheckData()
      }
    },
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    created () {
      this.getData()
      this.getTypeList()
      this.getDeptList()
      // 获取部门信息
      getDepartmentList().then(result => {
        // console.log(result)
        this.deptNameList = result
      })
    }
  }
</script>

<style scoped>

</style>
