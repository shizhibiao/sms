<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <el-form :inline="true" :model="searchForm" class="form-title" ref='searchForm' label-width="80px">
          <el-row type="flex">

            <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
              <el-form-item label="上传日期">
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
              </el-form-item>

              <el-form-item label="课程名称">
                <el-input v-model='searchForm.scoreName'></el-input>
              </el-form-item>



            </el-col>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" align="right" justify="end">

              <el-button type="primary" @click="clearForm()" size='small'>重置</el-button>
              <el-button type="primary" @click="refresh()" size='small'>查询</el-button>
              <el-button type="success" @click="newResource()" size='small'>新增</el-button>
            </el-col>

          </el-row>
        </el-form>
      </div>

      <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
        <el-table
          :stripe="true"
          :highlight-current-row="true"
          :data="datas"
          size="small"
          id='user'
        >
          <el-table-column
            label="序号"
            type="index"
            width='40'
          >
          </el-table-column>
          <el-table-column
            label="课程名称"
            prop="scoreName"
          >
          </el-table-column>
          <el-table-column
            label="上传日期"
            prop="uploadTime">
          </el-table-column>
          <el-table-column
            label="上传人"
            prop="uploaderName"
          >
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              {{scope.row.status===1?'发布':'新建'}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200px"
          >
            <template slot-scope="scope">

              <el-button type="primary" size='mini'
                         @click="editRow(scope.$index, scope.row)"
                         v-if='scope.row.status!=1'
              >编辑
              </el-button>
              <el-button type="danger" size='mini'
                         @click="deleteRow(scope.$index, scope.row)"
                         v-if='scope.row.status!=1'
              >删除
              </el-button>
              <el-button type="default" size='mini'
                         @click="lookRow(scope.$index, scope.row)">查看
              </el-button>
            </template>

          </el-table-column>
        </el-table>
        <b-row>
          <b-col md="12" class="my-1 mt-1" v-if="totalPages > 1">
            <!--<b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />-->
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
      </el-card>


    </b-card>
  </div>
</template>
<script>
  import {formatDate} from "../../utils/index.js";
  // import { API } from '@/api/index.js'
  import axios from "axios";
  import Vuex from "vuex";
  import {sourceDataFilter, monthData} from "../../tools";
  import {getDepartmentList} from "../../services/safety_notice";

  export default {
    data() {
      return {
        daterange: [
          formatDate(new Date(), "yyyy-MM") + "-01",
          formatDate(new Date(), "yyyy-MM-dd")
        ],
        pickerOptions2: {
          shortcuts: [
            {
              text: "最近一天",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三天",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        searchForm: {},
        datas: [],
        total: 0,
        curPage: 1,
        pageSize: 15,
        totalPages: 1,
        form: {
          queryItems: []
        },
        qItem: {
          fieldName: "",
          value: ""
        },
        deptNameList: [],
        deptName: [],
        dialogFormVisible: false,
        contentform: {}
      };
    },
    computed: {
      ...Vuex.mapState(["ALL_SELECT_DATA"])
    },
    created() {
      getDepartmentList().then(result => {
        this.deptNameList = result;
        console.log(result);
      });
      this.refresh()
    },
    watch: {
      curPage: function (newValue, oldValue) {
        this.refresh();
      }
    },
    methods: {
      refresh() {
        this.initData();
        this.transformData();
        this.loadData();
        // 请求列表详情
        this.form.pageNum = this.curPage - 1;
        this.form.pageSize = this.pageSize;
        axios.post('/api/train/score/list', this.form).then(result => {
          console.log(result)
          if (result.data && result.data.error === 0 && result.data.data) {
            console.log(result)

            let data = result.data.data
            this.datas = data.content
            this.total = data.totalElements
            this.totalPages = data.totalPages
          }
        })
      },
      // 初始化
      initData() {
        this.form.queryItems = [];
        this.datas = [];
      },
      // 处理日期
      transformData() {
        this.searchForm.uploadTimeStart =
          this.daterange && this.daterange.length > 0 ? this.daterange[0] : "";
        this.searchForm.uploadTimeEnd =
          this.daterange && this.daterange.length > 1 ? this.daterange[1] : "";

      },
      //  去重查询数据
      loadData() {
        let result = Object.keys(this.searchForm).filter(item => {
          if (this.searchForm[item] instanceof Array) {
            return this.searchForm[item].length > 0;
          } else {
            return this.searchForm[item] !== "" || undefined || null;
          }
        });
        result.forEach(item => {
          this.qItem = {
            fieldName: item,
            value: this.searchForm[item]
          };
          this.form.queryItems.push(this.qItem);
        });
      },
      newResource() {
        this.$router.push({
          path: '/training/new_resource'
        })
      },
      clearForm() {
        this.searchForm = {
          scoreName: "",
          uploadTimeStart: "",
          uploadTimeEnd: ""
        };
        this.total = 0;
        this.curPage = 1;
        this.pageSize = 15;
        this.totalPages = 1;
        this.refresh()
        console.log(this.searchForm);
      },
      lookRow(index, row) {
        let id = row.id
        this.$router.push({
          path: '/training/new_resource',
          query: {
            id,
            type: 'look'
          }
        })
      },
      deleteRow(index, row) {
        let id = row.id
        axios.delete('/api/train/score/' + id).then(result => {
          if (result.data && result.data.error === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.refresh()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败' + result.data.message
            })
          }
        }).catch(error => {
          this.$message({
            type: 'error',
            message: '删除失败' + error
          })
        })
      },
      editRow(index, row) {
        let id = row.id
        this.$router.push({
          path: '/training/new_resource',
          query: {
            id,
            type: 'edit'
          }
        })
      }
    }
  };
</script>
