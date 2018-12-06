<template>
    <div class="animated fadeIn">
        <b-card no-body>
            <div slot="header">
              <el-form :inline="true" :model="searchForm" class="form-title" ref='searchForm' label-width="80px" >
                <el-row type="flex">

                  <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                    <el-form-item label="指标名称">
                      <el-input v-model='searchForm.indicatorName' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="责任部门" prop="deptName">
                      <el-cascader
                        :options="deptNameList"
                        change-on-select
                        :show-all-levels='false'
                        v-model="deptName"
                        :clearable='true'
                        :props="{
                                label:'label',
                                value:'deptId',
                                children:'children'
                            }"
                        @change='changeDept'
                      ></el-cascader>
                    </el-form-item>
                    <el-form-item label="指标类型">
                      <el-select v-model="searchForm.indicatorType" clearable>
                        <el-option v-for="(item, index) in ALL_SELECT_DATA.TARGET_TYPE.dicts" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="管理目的" v-if='showMore'>
                      <el-select v-model="searchForm.obejective" clearable>
                        <el-option :label="item.dictName" :value="item.dictCode"
                                   v-for="(item , index ) in ALL_SELECT_DATA.INDICATOR_OBJECTIVE.dicts"
                                   :key='index'></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="指标状态" clearable v-if='showMore'>
                      <el-select v-model="searchForm.status" clearable>
                        <el-option v-for="(item, index) in implementStatusArr" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" align="right" justify="end">
                    <el-button type="warning" size='small'  @click="showMoreHandle()">{{showMoreLabel}}</el-button>
                    <el-button type="primary" @click="clearForm()" size='small'>重置</el-button>
                    <el-button type="primary" @click="refresh()" size='small'>查询</el-button>

                    <el-button type="success" @click="newRepository()" size='small'>新增</el-button>
                  </el-col>

                </el-row>
              </el-form>
            </div>

            <el-card style="margin-top:20px;border:none;min-height:56vh;" shadow='never'>
                <el-table
                    :stripe="true"
                    :highlight-current-row ="true"
                    :data="datas"
                    size="small"
                    style="width: 100%"
                    >
                    <el-table-column
                    label="序号"
                    type="index"
                    width='40'
                    >
                    </el-table-column>
                    <el-table-column
                    label="管理目的"
                    prop="obejective"
                    :formatter="obejectiveFilter"
                    >
                    </el-table-column>
                    <el-table-column
                    label="指标名称"
                    prop="indicatorName">
                    </el-table-column>
                    <el-table-column
                    label="指标设置目的"
                    prop="purpose"
                    >
                    </el-table-column>
                    <el-table-column
                    label="指标来源"
                    prop="source"
                    >
                    </el-table-column>
                    <el-table-column
                    label="指标级别"
                    >
                      <template slot-scope="scope">
                        {{scope.row.indicatorRank?'部门':'公司'}}
                      </template>
                    </el-table-column>
                    <el-table-column
                    label="管理部门"
                    prop="deptName"
                    >
                    </el-table-column>
                    <el-table-column
                    label="状态"
                    prop="status"
                    >
                      <template slot-scope="scope">
                        {{scope.row.status?'正常':'无效'}}
                      </template>
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    width="200px"
                    >
                        <template slot-scope="scope">

                          <el-button type="primary" size='mini'
                          @click="editRow(scope.$index, scope.row)"
                          >编辑</el-button>
                          <el-button type="danger" size='mini'
                          @click="deleteRow(scope.$index, scope.row)"
                          >删除</el-button>
                          <el-button type="default" size='mini'
                          @click="lookRow(scope.$index, scope.row)">查看</el-button>
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
import { formatDate } from "../../utils/index.js";
// import { API } from '@/api/index.js'
import axios from "axios";
import Vuex from "vuex";
import { sourceDataFilter, monthData } from "../../tools";
import { getDepartmentList } from "../../services/safety_notice";

export default {
  data() {
    return {
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
      dialogFormVisible:false,
      contentform:{},
      implementStatusArr:[
        {
          label:'正常',
          value:1
        },
        {
          label:'无效',
          value:0
        }
      ],
      showMore: false,
      showMoreLabel: '更多'
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
    curPage: function(newValue, oldValue) {
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

      console.log(this.form);
      axios.post('/api/indicator/list',this.form).then(result=>{
        console.log(result)
        if(result.data&&result.data.error===0&&result.data.data){
          console.log(result)

           let data = result.data.data
           this.datas = data.content
           this.total = data.totalElements
           this.totalPages = data.totalPages
        }else{
          this.total = 0
          this.totalPages = 1
        }
      })
    },
    // 初始化
    initData() {
      this.form.queryItems = [];
      this.datas = [];
    },
    transformData() {
       this.searchForm.dutyDeptId = this.deptName && this.deptName.length > 0 ? this.deptName[this.deptName.length - 1] : ''
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
    // 改责任部门
    changeDept(arr){
      if(arr.length<2){
        this.deptName =[]
      }
    },
    newRepository() {
      this.$router.push({
        path:'/performance/new_repository'
      })
    },
    clearForm() {
      this.searchForm = {
        indicatorName: "",
        indicatorType:'',
        obejective:'',
        status:'',
        dutyDeptId:''
      };
      this.deptName = []
      this.total = 0;
      this.curPage = 1;
      this.pageSize = 15;
      this.totalPages = 1;
      this.refresh()
      console.log(this.searchForm);
    },
    lookRow(index , row){
      let id = row.id
      this.$router.push({
        path:'/performance/new_repository',
        query:{
          id,
          type:'look'
        }
      })
    },
    deleteRow(index , row){
      let id = row.id
      axios.delete('/api/indicator/'+id).then(result=>{
        if(result.data&&result.data.error===0){
          this.$message({
            type:'success',
            message:'删除成功'
          })
          this.refresh()
        }else{
          this.$message({
            type:'error',
            message:'删除失败'+result.data.message
          })
        }
      }).catch(error=>{
        this.$message({
            type:'error',
            message:'删除失败'+error
          })
      })
    },
    editRow(index , row){
      // console.log(row)
      let id = row.id
      this.$router.push({
        path:'/performance/new_repository',
        query:{
          id,
          type:'edit'
        }
      })
    },
    // 过滤器
    obejectiveFilter (alue, row, column) {
      let sourceData = this.ALL_SELECT_DATA.INDICATOR_OBJECTIVE

      let result = sourceDataFilter(sourceData, alue.obejective)
      return result
    },
    showMoreHandle(){
      this.showMore = !this.showMore

      this.showMoreLabel = this.showMore ? '隐藏' : '更多'
    }
  }
};
</script>
