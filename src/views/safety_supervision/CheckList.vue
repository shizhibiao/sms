<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
        <el-row>
          <el-col :span="20">
            <el-form :inline="true"
                     :model="info"
                     label-position="left"
                     class="form-title"
                     ref="query">
              <el-form-item label="监察部门"
                            prop="dept">
                <el-select v-model="info.dept"
                           value-key='deptId'
                           :clearable='true'>
                  <el-option :label="item.deptName"
                             :value="item"
                             v-for="(item,index) in deptNameList"
                             :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目"
                            prop="project">
                <el-input v-model="info.project"
                          clearable
                          placeholder=""></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"
                  class="text-right">
            <el-button type="primary"
                       @click="refresh()"
                       size='small'>
              查询</el-button>
            <el-button type="primary" @click="exportExcel()" size='small'>导出</el-button>
            <el-button type="success"
                       @click="addNew()"
                       size='small'>
              新增</el-button>
          </el-col>
        </el-row>
      </b-card-header>
      <b-card-body>
        <template>
          <el-table :stripe="true"
                    :highlight-current-row="true"
                    :data="tableData"
                    size="small"
                    style="width: 100%"
                    id ='dept'>
            <el-table-column label="#"
                             type="index"
                             width="50">
            </el-table-column>
            <el-table-column label="部门"
                             prop="deptName">
            </el-table-column>
            <el-table-column label="项目"
                             prop="project">
            </el-table-column>
            <el-table-column label="条款号"
                             prop="itemNo">
            </el-table-column>
            <el-table-column label="条款内容"
                             prop="itemContent">
                             <!-- :show-overflow-tooltip="true" -->
            </el-table-column>
            <el-table-column label="提示"
                             prop="itemHint">
            </el-table-column>
            <el-table-column label="抽样数"
                             prop="itemSampleSum">
            </el-table-column>
            <el-table-column label="检查方式"
                             prop="itemCheckType">
            </el-table-column>
            <el-table-column label="创建时间"
                             prop="createTime">
            </el-table-column>
            <el-table-column label="操作"
                             width="280">
              <template slot-scope="scope">
                <el-button size='mini'
                           type="primary"
                           @click="EditAction(scope.$index, scope.row)">
                  编辑</el-button>
                <el-button type="danger"
                           size='mini'
                           @click="handleDelete(scope.$index, scope.row)">
                  删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <b-row>
          <b-col md="12"
                 class="my-1 mt-1"
                 v-if="totalPages>1">
            <el-pagination background
                           layout="total, prev, pager, next, jumper"
                           :total="total"
                           :current-page.sync="curPage"
                           :page-size="pageSize"
                           :pager-count="5"
                           align="right"></el-pagination>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { formatDate, downLoad } from "../../utils/index.js"
import { conditionGetDepartmentList, claim, unClaim, TESTMODE } from '../../services/safety_supervision'
export default {
  data () {
    return {
      inspect: [],
      deptNameList: [],
      info: {
        // 项目
        project: '',
        // 监察部门
        dept: '',
      },
      tableData: [],
      total: 0,
      curPage: 1,
      pageSize: 15,
      totalPages: 1,
      form: {
        pageNum: 0,
        pageSize: 30,
        queryItems: []
      }
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  filters: {
    str1 (val) {
      let val1 = val.replace(/\"/g, "")
      return val1.replace(/\[|]/g, '')
    }
  },
  watch: {
    curPage (newvalue, old) {
      this.form.pageNum = newvalue - 1
      this.queryList()
    }
  },
  created () {
  },
  methods: {
    exportExcel () {
      // 前端导出
      // var wb = XLSX.utils.table_to_book(document.querySelector('#dept'))
      // var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      // try {
      //     FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '监察单数据.xlsx')
      // } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      // return wbout
      this.datas = {
        pageNum: 1,
        pageSize: 15,
        queryItems: [
          {
            fieldName: 'project',
            value: this.info.project
          },
          {
            fieldName: 'deptId',
            value: this.info.dept ? this.info.dept.deptId : ''
          }
        ]
      }
      downLoad(
        "post",
        "api/securitymonitor/export",
        this.datas,
        "监察单数据"
      )
    },
    // 删除
    handleDelete (index, row) {
      let id = row.id
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios.delete('/api/securitymonitor/delItem/' + id)
            .then(response => {
              // console.log(response)
              if (response.data.data) {
                this.queryList()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              } else if (response.data.error !== 0) {
                this.$message.error(response.data.message)
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    resetAction () {
      this.$refs['query'].resetFields()
    },
    addNew () {
      let url = '/monitor/billadd'
      this.$router.push({ path: url })
    },
    // 查询按钮
    refresh () {
      let data = [
        {
          fieldName: 'project',
          value: this.info.project
        },
        {
          fieldName: 'deptId',
          value: this.info.dept ? this.info.dept.deptId : ''
        }
      ]
      this.form.queryItems = data
      this.queryList()
    },
    EditAction (index, row) {
      let url = '/monitor/billedit'
      this.$router.push({
        path: url,
        query: {
          id: row.id
        }
      })
    },
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 20) {
        return value.slice(0,20) + '...'
      }
      return value
    },
    queryList () {
      // 查询列表页
      // console.log(this.form)
      axios.post('/api/securitymonitor/findAllItem', this.form)
        .then((res) => {
          // console.log(res)
          if (res.data.data) {
            let data = res.data.data.content
            TESTMODE().then(te => {
              data.forEach(item => {
                 item.itemCheckType2 = te.find(sp => {
                  return sp.dictCode == item.itemCheckType
                })
               item.itemCheckType = item.itemCheckType2 ?  item.itemCheckType2.dictName : ''
               item.itemContent = this.ellipsis(item.itemContent)
                // item.itemCheckType = te.find(sp => {
                //   return sp.dictCode == item.itemCheckType
                // }).dictName
              })
              this.tableData = data
            })
           
            this.total = res.data.data.totalElements
            this.totalPages = res.data.data.totalPages
          } else {
            this.tableData = []
          }
        })
        .catch((error) => { console.log(error) })
    }
  },
  mounted () {
    conditionGetDepartmentList(1).then(result => {
      // console.log(result)
      this.deptNameList = result
    })
    this.queryList()
  },
}
</script>