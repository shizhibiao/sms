<template>
    <div class="animated fadeIn">
        <b-card>
         
                <el-form :model="searchForm" class="form-title" ref='searchForm' :inline-message="true" label-width="80px">

                            <div class="row">
                                <div class="col-lg-4 col-md-6 col-sm-12" >
                                    <el-form-item  label="报告人">
                                        <el-input
                                                disabled
                                                v-model="searchForm.reportUserName">
                                            </el-input>
                                    </el-form-item>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <el-form-item  label="报告日期">
                                        <el-input
                                                disabled
                                                v-model="searchForm.reportDate">
                                        </el-input>
                                    </el-form-item>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <el-form-item label="报告类型">
                                        <el-select v-model="searchForm.reportType" :clearable='true' >
                                            <el-option :label="item.label" :value="item.value" v-for= "(item,index) in reportTypeArr" :key ='index'></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12" v-if='searchForm.reportType ===1'>
                                    <el-form-item label="上报部门" >
                                        <el-cascader
                                                :options="deptNameList"
                                                :show-all-levels="false"
                                                v-model="deptName"
                                                :clearable='true'
                                               
                                                @change = 'deptChange'
                                            ></el-cascader>
                                    </el-form-item>
                                </div>
                                <div class="col-lg-8 col-md-8 col-sm-12">
                                    <el-form-item label="周期" >
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
                                        <el-button type="primary" @click="load()" size='small'>统计</el-button>
                                    </el-form-item>
                                </div>
                                
                            </div>
                            <div class="row">
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                 
                                        <el-form-item  label="内容">
                                                <el-input
                                                    type="textarea"
                                                    style="width: 100%"
                                                    :autosize ="{ minRows: 2, maxRows: 20 }"
                                                    placeholder="请输入内容"
                                                    v-model="searchForm.content">
                                                </el-input>
                                        </el-form-item>

                                   
                                </div>
                            </div>
                                
                </el-form>        
                    <el-card style="margin-top:20px;border:none;text-align:center" shadow='never'>
                         <el-button type="primary" @click="save()" size='small'>保存</el-button>
                        
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
      activeName: "user",
      reportTypeArr: [
        {
          value: 0,
          label: "个人"
        },
        {
          value: 1,
          label: "部门"
        }
      ],
      options4: [],
      loading: false,
      deptNameList: [],
      deptName: []
    };
  },
  computed: {
    ...Vuex.mapState(["ALL_SELECT_DATA"]),
    ...Vuex.mapState(['user'])
  },
  created() {
    getDepartmentList().then(result => {
      this.deptNameList = result;
      console.log(result);
    });
    this.searchForm.reportUserName = this.user.userName
    this.searchForm.reportDate = formatDate(new Date(),'yyyy-MM-dd')
  },
  watch: {
  },
  methods: {
    load() {
      this.initData();
      this.transformData();
      this.loadData();
      
      let params = this.searchForm
      if(this.searchForm.reportType===0){
          delete params.reportDeptName
          delete params.reportDept
      }
      params.reportUser = this.user.userId
      axios.post('/api/securitylog/statis',params).then(result=>{
          if(result.data&&result.data.error===0){
              this.searchForm.content = result.data.data.content        
              this.$forceUpdate()
              console.log(this.searchForm.content)
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
      this.searchForm.fromDate =
        this.daterange && this.daterange.length > 0 ? this.daterange[0] : "";
      this.searchForm.toDate =
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
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        console.log("chufale");
        axios
          .get("/api/system/user/search?userNo=" + query)
          .then(result => {
            this.loading = false;
            console.log(result);
            if (result.data && result.data.error === 0 && result.data.data) {
              //   this.list =result.data.data
              this.options4 = result.data.data;
            }
          })
          .catch(error => {
            this.loading = false;
            console.log(error);
          });
      } else {
        this.options4 = [];
      }
    },
    getCascaderObj(val,opt) {
        return val.map(function (value, index, array) {
            for (var itm of opt) {
                if (itm.value == value) { opt = itm.children; return itm; }
            }
            return null;
        });
    },
    deptChange(){
      console.log(this.deptName, this.deptNameList)
       let arr = this.getCascaderObj(this.deptName, this.deptNameList)
       if(arr.length>0){
         console.log(arr)
        this.searchForm.reportDept = arr[arr.length - 1].deptId
        this.searchForm.reportDeptName = arr[arr.length - 1].label
       }
    },
    save(){
      
        this.initData();
        this.transformData();
        this.loadData();
        
        let params = this.searchForm
        if(this.searchForm.reportType===0){
            delete params.reportDeptName
            delete params.reportDept
        }
        params.reportUser = this.user.userId
        axios.post('/api/securitylog/save',this.searchForm).then(result=>{
            if(result.data&&result.data.error===0){
                this.$message({
                    message: '保存成功',
                    type: 'success'
                })
                this.$router.back()
            }else{
                this.$message({
                    message: '保存失败'+ result.data.error,
                    type: 'error'
                })
            }
        }).catch(error=>{
            this.$message({
                    message: '保存失败'+ error,
                    type: 'error'
            })
        })
    }
  }
};
</script>

