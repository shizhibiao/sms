<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <el-row :gutter="12">
          <el-col :span="20">
            <el-form inline>
              <el-form-item label="考试日期">
                <el-date-picker
                  v-model="examTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="有效日期">
                <el-date-picker
                  v-model="validTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="考试名称">
                <el-input
                  clearable
                  placeholder='请输入考试名称'
                  v-model='lessonName'>
                </el-input>
              </el-form-item>
              <el-form-item label="人员姓名">
                <el-input
                  clearable
                  placeholder='请输入人员姓名'
                  v-model='name'>
                </el-input>
              </el-form-item>
              <el-form-item label="人员类型">
                <el-select v-model="staffType" filterable clearable placeholder="请选择人员类型">
                  <el-option
                    v-for="item in staffTypeList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="培训类型">
                <el-select v-model="trainingType" filterable clearable placeholder="请选择培训类型">
                  <el-option
                    v-for="item in trainingTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="培训类别">
                <el-select v-model="trainingCate" filterable clearable placeholder="请选择培训类别">
                  <el-option
                    v-for="item in trainingCateList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所在部门">
                <el-cascader :options="submitDeptNameList" v-model="department" change-on-select :show-all-levels='false':clearable='true' @change="changeClassDept"></el-cascader>
                <!--<el-input-->
                  <!--clearable-->
                  <!--placeholder='请输入所在部门'-->
                  <!--v-model='department'>-->
                <!--</el-input>-->
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button size="small" type="primary" class="mt-1" @click="addNew()"><i class='fa fa-edit'></i> 新增</el-button>
            <el-button size="small" type="success" class="mt-1" @click="getCheckData()"><i class="fa fa-search"></i> 查询</el-button>
            <!--<el-button size="small" @click="this.refresh"><i class='fa fa-refresh'></i> 刷新</el-button>-->
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
            prop='name'
            label='人员姓名'>
          </el-table-column>
          <el-table-column
            prop='staffTypeName'
            label='人员类型'
            width='130px'>
          </el-table-column>
          <el-table-column
            prop='lessonName'
            label='考试名称'>
          </el-table-column>
          <el-table-column
            prop='department'
            label='部门'>
          </el-table-column>
          <el-table-column
            prop='outside'
            label='是否外委'
            :formatter="formatterData">
          </el-table-column>
          <el-table-column
            prop='examTime'
            label='考试日期'
            width="150px">
          </el-table-column>
          <el-table-column
            prop='validTime'
            label='到期日期'>
          </el-table-column>
          <el-table-column
            prop='trainingCateName'
            label='培训类别'>
          </el-table-column>
          <el-table-column
            prop='trainingType'
            label='培训类型'
            :formatter="formatterData">
          </el-table-column>
          <el-table-column
            prop='examScore'
            label='考试成绩'>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="getShow(scope.row.id)">
                <i class="fa fa-shower" ></i> 查看</el-button>
              <el-button type="text" size="small" v-if="scope.row.roleId === 1" @click="editInfo(scope.row.id)">
                <i class="fa fa-edit"></i> 编辑</el-button>
              <el-button type="text" size="small" v-if="scope.row.roleId === 1" @click="deleteInfo(scope.row.id)">
                <i class="fa fa-remove"></i> 删除</el-button>
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
  import {
    getDepartmentList
  } from '../../services/safety_notice'
    export default {
      name: 'SecurityTrainingDocument',
      data() {
        return{
          checkDep: [],
          submitDeptNameList: [],
          operationType: 0,
          items: [],
          user: {},
          roleId: 0,
          role: [],
          examTime: [this.getDefaultTime(), new Date()],
          validTime: [],
          lessonName: '',
          staffTypeList: [],
          trainingType: '',
          type: 1,
          trainingCateList: [],
          staffType: '',
          staffTypeName:'',
          trainingTypeList: [{
          value: '0',
          label: '日常'
        }, {
            value: '1',
          label: '初训'
        }, {
            value: '2',
          label: '复训'
        }, {
            value: '3',
          label: '其他'
        }
        ],
          trainingCate: '',
          trainingCateName: '',
          name:'',
          department: '',
          total: 0,
          curPage: 1,
          pageSize: 20,
          totalPages: 1,
          examScore: 0,
          outside: true,
        }
      },
      watch: {
        curPage: function (newValue, oldValue) {
          this.getCheckData()
        }
      },
      methods: {
        addNew () {
          this.operationType = 4
          let flag = this.operationType
          let url = '/training/documentAdd/' + 0 + '/' + flag
          this.$router.push({path: url})
        },
        getShow (documentId) {
          this.operationType = 1
          let flag = this.operationType
          let url = '/training/documentAdd/' + documentId + '/' + flag
          this.$router.push({path: url})
        },
        editInfo (documentId) {
          this.operationType = 2
          let flag = this.operationType
          let url = '/training/documentAdd/' + documentId + '/' + flag
          this.$router.push({path: url})
        },
        formatterData: function (row, column) {
          var value = row[column.property]
          if (column.label === '是否外委') {
            if (parseInt(value) === 0) {
              return '是'
            } else if (parseInt(value) === 1) {
              return '否'
            }
          }
          else if (column.label === '培训类型') {
            if (parseInt(value) === 0) {
              return '日常'
            }
            else if (parseInt(value) === 1) {
              return '初训'
            }
            else if (parseInt(value) === 2) {
              return '复训'
            }
            else if (parseInt(value) === 3) {
              return '其他'
            }
          }
          return value
        },
        changeClassDept(arr){
          if(arr.length<2){
            this.submitDeptName =[]
          }
        },
        getData () {
          let pageNo = this.curPage - 1
          let startTime = formatDate(this.examTime[0], 'yyyy-MM-dd')
          let endTime = formatDate(new Date(this.examTime[1].getTime() + 86400000), 'yyyy-MM-dd')
          axios.get('/api/securityDocument?pageNum=' + pageNo + '&pageSize=' + this.pageSize + '&startTime=' + startTime + '&endTime=' + endTime)
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
        getDefaultTime () {
          if (new Date().getMonth() - 1 === new Date().getMonth()) {
            return new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).getTime() - 86400000 * 5)
          } else {
            return new Date(new Date().setMonth(new Date().getMonth() - 1))
          }
        },
        getstaffTypeList () {
          axios.get('/api/system/dictionary/by_type?dictType=STAFF_TYPE')
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                let page = data.data
                this.staffTypeList = page
              } else {
                alert(data.message)
              }
            })
            .catch(response => {
              alert(response)
            })
        },
        deleteInfo (documentId) {
          this.$confirm('确定删除该条档案？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.delete('/api/securityDocument/' + documentId)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                  this.$message({type: 'success', message: '档案删除成功'})
                  this.getData()
                } else {
                  let msg = {type: 'error', message: '档案删除失败:' + data.message}
                  this.$message(msg)
                }
              })
              .catch(response => {
                this.$message({type: 'error', message: '服务器或网络异常'})
              })
          })
        },
        getCateTypeList () {
          axios.get('/api/system/dictionary/by_type?dictType=TRAINING_CATE')
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                let page = data.data
                this.trainingCateList = page
              } else {
                alert(data.message)
              }
            })
            .catch(response => {
              alert(response)
            })
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
        getCheckData () {
          if (this.examTime[0] === null || this.examTime[0] === '') {
            alert('请选择起始年月')
            return
          }
          if (this.department !== null && this.department.length > 0 && this.department !== undefined) {
            this.checkDep =  this.department;
            this.department = this.department[this.department.length - 1]
          } else {
            this.checkDep =  []
            this.department = ''
          }
          let startTime = formatDate(this.examTime[0], 'yyyy-MM-dd')
          let endTime = formatDate(new Date(this.examTime[1].getTime() + 86400000), 'yyyy-MM-dd')
          let startvaluetime = ''
          let endvaluetime = ''
          if (this.validTime[0] !== null && this.validTime[0] !== '' && this.validTime[0] !== undefined) {
            startvaluetime = formatDate(this.validTime[0], 'yyyy-MM-dd')
            endvaluetime = formatDate(new Date(this.validTime[1].getTime() + 86400000), 'yyyy-MM-dd')
            startvaluetime = parseInt(startvaluetime.toString().replace(/-/g, ''))
            endvaluetime = parseInt(endvaluetime.toString().replace(/-/g, ''))
          }
          let pageNo = this.curPage - 1
          let url = '/api/securityDocument/byCondition?&pageNum=' + pageNo + '&pageSize=' + this.pageSize + '&name=' + this.name + '&staffType=' + this.staffType + '&startTime=' + startTime + '&endTime=' + endTime +
            '&department=' + this.department + '&lessonName=' + this.lessonName + '&startDate=' + startvaluetime + '&endDate=' + endvaluetime+'&trainingType='+this.trainingType+'&trainingCate='+this.trainingCate
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
          this.department = this.checkDep;
        }
      },
      mounted () {
        // 立项部门
        getDepartmentList().then(result => {
          this.submitDeptNameList = result
          //  console.log(result)
        })
      },
      created () {
        this.user = this.$store.state.user
        this.getRole()
        this.getData()
        this.getCateTypeList()
        this.getstaffTypeList()
      }
    }
</script>

<style scoped>

</style>
