<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
        <el-row :gutter="12">
          <el-col :span="18">
            <el-form inline :model="dataList" ref="dataList">
              <el-form-item label="报告日期" prop="trReportorDate">
                <el-date-picker
                  :clearable="false"
                  v-model="dataList.trReportorDate"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions2"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="收到威胁日期" prop="trCreateTime">
                <el-date-picker
                  v-model="dataList.trCreateTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions2"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item> -->
              <el-form-item label="信息类别" prop="trCategory">
                <el-select v-model="dataList.trCategory" clearable>
                  <el-option v-for="(item, index) in ALL_SELECT_DATA.THREATEN_INFO_TYPE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="标题" prop="title">
                <el-input v-model="dataList.title" clearable></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6" class="text-right">
            <!-- <el-button size='small' type="warning" @click="showMoreHandle">{{showMoreLabel}}</el-button> -->
            <el-button size='small' type="primary" @click="resetBtnData()">重置</el-button>
            <el-button size='small' type="primary" @click="inquireDataList">查询</el-button>
            <el-button size='small' type="success" @click="goReportStat">新增</el-button>
          </el-col>
        </el-row>
      </b-card-header>
      <b-card-body>
        <template>
          <el-table
            size="small"
            :data="tableData"
            :stripe="true"
            :highlight-current-row ="true"
            style="width: 100%">
            <el-table-column
                label="#"
                prop="index"
                width="50">
            </el-table-column>
            <el-table-column
              label="标题"
              prop="trTitle">
            </el-table-column>
            <el-table-column
              label="报告人"
              prop="trReportorName">
            </el-table-column>
            <el-table-column
              label="报告日期"
              style="width: 100%"
              prop="trReportorDate">
            </el-table-column>
            <el-table-column
              label="收到威胁日期"
              prop="trAcceptDate">
            </el-table-column>
            <el-table-column
              label="信息类别"
              prop="trCategory">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size='mini'
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size='mini'
                  @click="handleRemove(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div class="block" style="margin-top: 16px;">
          <b-row>
            <b-col md="12" class="my-1 mt-1" v-if="totalPages > 1">
              <el-pagination
                background
                :pager-count="5"
                :current-page.sync="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="total"
                align="right">
              </el-pagination>
            </b-col>
          </b-row>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
import Vuex from 'Vuex'
import axios from 'axios'
// 过滤日期
import { formatDate } from '../../utils/index.js'
import { sourceDataFilter } from '../../tools'
import { getBeforeWeek } from '../../filter/reportFilter.js'
import { getMenaceListInquireData } from '../../services/security_management'

export default {
    data () {
        return {
            dataList: {
                // 报告日期
                trReportorDate: [getBeforeWeek(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
                // 受到威胁日期
                // trCreateTime: [getBeforeWeek(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
                // 信息类别
                trCategory: '',
                // 标题
                title: '',
                // 区分是威胁信息报告(0)还是威胁评估报告(1)
                trType: 0
            },
            // 时间数据
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
            // 查询条件是否显示更多
            // showMore: false,
            // showMoreLabel: '更多',
            // 查询列表数据
            tableData: [],
            // 分页数据
            total: 0,
            pageNum: 1,
            pageSize: 15,
            totalPages: 1,
        }
    },
    computed: {
        // 从stort中获取所有下拉数据
        ...Vuex.mapState(["ALL_SELECT_DATA"])
    },
    methods: {
        // 将code值转为name值
        dataFilter (avlue, type) {
          let sourceData = this.ALL_SELECT_DATA[type]
          let result = sourceDataFilter(sourceData, avlue)
          return result
        },
        // 点击显示更多查询条件
        // showMoreHandle () {
        //     this.showMore = !this.showMore
        //         if (this.showMore) {
        //         this.showMoreLabel = '隐藏'
        //     } else {
        //         this.showMoreLabel = '更多'
        //     }
        // },
        // 重置
        resetBtnData () {
            this.$refs.dataList.resetFields()
            this.dataList.trReportorDate = [getBeforeWeek(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')]
            this.pageNum = 1
            // 重置后更新列表数据
            this.inquireDataList()
        },
        // 查询
        inquireDataList () {
            let { trReportorDate, trCategory, title, trType } = this.dataList
            let obj = {}
            obj.pageNum = this.pageNum - 1
            obj.pageSize = this.pageSize
            obj.queryItems = [
                {
                    fieldName: 'title',
                    value: title
                },{
                    fieldName: 'trReportorDateStart',
                    value: trReportorDate !== null ? `${trReportorDate[0]} 00:00:00` : getBeforeWeek(new Date(), 'yyyy-MM-dd')
                },{
                    fieldName: 'trReportorDateEnd',
                    value: trReportorDate !== null ? `${trReportorDate[1]} 23:59:59` : formatDate(new Date(), 'yyyy-MM-dd')
                },
                // {
                //     fieldName: 'trCreateTimeStart',
                //     value: `${trCreateTime[0]} 00:00:00`
                // },{
                //     fieldName: 'trCreateTimeEnd',
                //     value: `${trCreateTime[1]} 23:59:59`
                // },
                {
                    fieldName: 'trCategory',
                    value: trCategory
                },{
                  fieldName: 'trType',
                  value: trType
                }
            ]
            getMenaceListInquireData(obj).then(result => {
              if (result.data.data && result.data.error === 0) {
                this.total = result.data.data.totalElements
                this.totalPages = result.data.data.totalPages
                this.tableData = result.data.data.content
                for (var i = 0; i < this.tableData.length; i++) {
                  this.tableData[i].index = i + 1
                  this.tableData[i].trCategory = this.dataFilter(this.tableData[i].trCategory, 'THREATEN_INFO_TYPE')
                }
              } else {
                this.tableData = []
              }
            })
              .catch(error => {
                this.$message({
                  type: 'error',
                  message: '查询失败：' + error
                })
              })
        },
        // 新增
        goReportStat () {
            // 跳转到新增页面
            this.$router.push('/security/add-treport')
        },
        // 编辑
        handleEdit (index, row) {
          let url = '/security/compile-treport/'
          this.$router.push({
            path: url,
            query: {
              id: row.id
            }
          })
        },
        // 删除
        handleRemove (index, row) {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.delete('/api/treport/' + row.id).then(result => {
              if (result.data.error === 0 && result.data.data === true) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                // 刷新列表数据
                this.inquireDataList()
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败：' + response.data.message
                })
              }
            })
          })
            .catch((error) => {
              console.log(error)
            })
        }
    },
    created () {
      // 初始化列表数据
      this.inquireDataList()
    }
}
</script>

