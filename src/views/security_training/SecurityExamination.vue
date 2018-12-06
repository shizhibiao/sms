<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <el-row :gutter="12">
          <el-col :span="20">
            <el-form inline>
              <el-form-item label="有效期">
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
              <el-form-item label="课程名称">
                <el-input
                  clearable
                  placeholder='请输入课程名称'
                  v-model='selectLessonName'>
                </el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="SelectIsPass" filterable clearable placeholder="请选择状态">
                  <el-option
                    v-for="item in selectIsPassList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="参考人">
                <el-input
                  clearable
                  placeholder='请输入参考人'
                  v-model='selectUser'>
                </el-input>
              </el-form-item>
              <el-form-item label="所属部门">
                <el-input
                  clearable
                  placeholder='请输入部门名称'
                  v-model='selectDeptName'>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="2" class="text-right">
            <el-button size="small" type="success" class="mt-1" @click="getCheckData()"><i class="fa fa-search"></i> 查询</el-button>
          </el-col>
        </el-row>
      </div>
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
            prop='lessonName'
            label='考试名称'>
          </el-table-column>
          <el-table-column
            prop='name'
            label='参考人'>
          </el-table-column>
          <el-table-column
            prop='department'
            label='所属部门'>
          </el-table-column>
          <el-table-column
            prop='examTime'
            label='考试日期'>
          </el-table-column>
          <el-table-column
            prop='recordStatus'
            label='录入状态'
            :formatter="formateRecord">
          </el-table-column>
          <el-table-column
            prop='isPass'
            label='状态'>
          </el-table-column>
          <el-table-column
            prop='examScore'
            label='成绩'>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.recordStatus === 0 && scope.row.roleId === 1" type="text" class="btn btn-sm btn-primary" @click="RecordDocument(scope.row)">
                <i class="fa fa-user-plus"></i> 录入档案</el-button>
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
      name: 'securityexamination',
      data () {
        return {
          valueTime: [this.getDefaultTime(), new Date()],
          selectLessonName: '',
          SelectIsPass: '',
          selectDeptName: '',
          selectIsPassList: [
            {
              value: '未交卷'
            }, {
              value: '不合格'
            }, {
              value: '等待阅卷'
            }, {
              value: '合格'
            }
          ],
          roleId: 0,
          selectUser: '',
          items: [],
          total: 0,
          curPage: 1,
          pageSize: 20,
          totalPages: 1,
          wat: 0
        }
      },
      watch: {
        curPage: function (newValue, oldValue) {
          if (newValue !== oldValue) {
            this.wat = 1
            this.getCheckData()
          }
        }
      },
      methods: {
        getData () {
          let pageNo = this.curPage - 1
          let startTime = formatDate(this.valueTime[0], 'yyyy-MM-dd')
          let endTime = formatDate(new Date(this.valueTime[1].getTime() + 86400000), 'yyyy-MM-dd')
          axios.get('/api/securityExam?pageNum=' + pageNo + '&pageSize=' + this.pageSize + '&startDay=' + startTime + '&endDay=' + endTime)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                let page = data.data
                this.total = page.totalElements || 0
                this.totalPages = page.totalPages || 0
                this.items = page.content || []
                for (var i = 0; i < this.items.length; i++) {
                  this.items[i].roleId = this.roleId
                }
              } else {
                alert(data.message)
              }
            })
            .catch(response => {
              alert(response)
            })
        },
        RecordDocument (Record) {
          let id = Record.id
          let flag = 3
          let url = '/training/documentAdd/' + id + '/' + flag
          this.$router.push({path: url})
        },
        formateRecord: function (row, column) {
          var record = row[column.property]
          if (record === 0) {
            return '未录入'
          } else if (record === 1) {
            return '已录入'
          }
          return ''
        },
        getCheckData () {
          if (this.wat === 0) {
            this.curPage = 1
          }
          if (this.valueTime === null) {
            alert('请选择起始年月')
            return
          }
          let startTime = formatDate(this.valueTime[0], 'yyyy-MM-dd')
          let endTime = formatDate(new Date(this.valueTime[1].getTime() + 86400000), 'yyyy-MM-dd')
          let pageNo = this.curPage - 1
          let url = '/api/securityExam/byCondition?&pageNum=' + pageNo + '&pageSize=' + this.pageSize + '&startDay=' +
            startTime + '&endDay=' + endTime + '&lessonName=' + this.selectLessonName + '&isPass=' +
            this.SelectIsPass + '&name=' + this.selectUser + '&department=' + this.selectDeptName
          axios.get(url)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                let page = data.data
                this.total = page.totalElements || 0
                this.totalPages = page.totalPages || 0
                this.items = page.content || []
                for (var i = 0; i < this.items.length; i++) {
                  this.items[i].roleId = this.roleId
                }
              } else {
                alert(data.message)
              }
            })
            .catch(response => {
              alert(response)
            })
          this.wat = 0
        },
        getRole () {
          axios.get('/api/system/role/byuser?userId=' + this.user.userId)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.role = data.data
                for (var i = 0; i < this.role.length; i++) {
                  if (this.role[i].roleId === 1) {
                    this.roleId = this.role[i].roleId
                    break
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
        getDefaultTime () {
          if (new Date().getMonth() - 1 === new Date().getMonth()) {
            return new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).getTime() - 86400000 * 5)
          } else {
            return new Date(new Date().setMonth(new Date().getMonth() - 1))
          }
        }
      },
      created () {
        this.user = this.$store.state.user
        this.getRole()
        this.getData()
      }
    }
</script>

<style scoped>

</style>
