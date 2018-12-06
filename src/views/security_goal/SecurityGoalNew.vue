<template>
    <div class="animated fadeIn">
        <b-card>
         
                <el-form :model="form" class="form-title" ref='form' :inline-message="true" label-width="120px" :rules="rules" :disabled='type ==="look"'>

                            <div class="row">
                                <div class="col-lg-4 col-md-6 col-sm-12" >
                                    <el-form-item  label="年度" prop="tyear">
                                        <el-date-picker
                                            v-model="form.tyear"
                                            type="year"
                                            placeholder="选择年"
                                            value-format='yyyy'
                                            >
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <el-form-item  label="季度" prop="tquarter">
                                        <el-select v-model="form.tquarter">
                                            <el-option :label="item.label" :value="item.value" v-for= "(item , index ) in tquarterList" :key ='index'></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <el-form-item label="部门" prop="dept">
                                        <el-cascader
                                                :options="deptNameList"
                                                :show-all-levels="false"
                                                v-model="form.dept"
                                                :clearable='true'
                                                :props="{
                                                    label:'label',
                                                    value:'deptId',
                                                    children:'children'
                                                }"
                                                @change = 'deptChange'
                                            ></el-cascader>
                                    </el-form-item>
                                </div>
                                <div class="col-lg-4 col-md-8 col-sm-12">
                                    <el-form-item label="项目名称" prop="projectName">
                                        <el-input v-model="form.projectName"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="col-lg-4 col-md-8 col-sm-12">
                                    <el-form-item label="指标比重" prop="proportion">
                                        <el-input v-model="form.proportion"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="col-lg-4 col-md-8 col-sm-12">
                                    <el-form-item label="考核周期" prop="tcycle">
                                        <el-select v-model="form.tcycle">
                                            <el-option :label="item.label" :value="item.value" v-for= "(item , index ) in tcycleList" :key ='index'></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                
                            </div>
                            <div class="row">
                                
                                <div class="col-lg-6 col-md-6 col-sm-12">
                                 
                                        <el-form-item  label="预算飞行小时(万)"
                                        prop="flightTime"
                                        :rules="[
                                        { required: true, message: '内容不能为空'},
                                        { type: 'number', message: '必须为数字值'}]"
                                        >
                                                <el-input
                                                    
                                                    style="width: 100%"
                                                    placeholder="请输入内容"
                                                    v-model.number="form.flightTime">
                                                </el-input>
                                        </el-form-item>

                                   
                                </div>
                            </div>
                            <div class="row">
                                
                                <div class="col-lg-6 col-md-6 col-sm-12">
                                 
                                        <el-form-item  label="年度局方指标"
                                        prop="localQuota"
                                        :rules="[
                                        { required: true, message: '内容不能为空'},
                                        { type: 'number', message: '必须为数字值'}]"
                                        
                                        >
                                                <el-input
                                                    placeholder="请输入内容"
                                                    v-model.number="form.localQuota">
                                                </el-input>
                                        </el-form-item>

                                   
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-12">
                                 
                                        <el-form-item label-width="0px">
                                                <el-input
                                                    v-model="localCount"
                                                    style="width: 100%"
                                                    disabled
                                                    >
                                                    
                                                    <template slot="append">次数</template>
                                                </el-input>
                                        </el-form-item>

                                   
                                </div>
                            </div>
                            <div class="row">
                                
                                <div class="col-lg-6 col-md-6 col-sm-12">
                                 
                                        <el-form-item  label="公司目标值"
                                        prop="target"
                                        :rules="[
                                        { required: true, message: '内容不能为空'},
                                        { type: 'number', message: '必须为数字值'}]"
                                        >
                                                <el-input
                                                    placeholder="请输入内容"
                                                    v-model.number="form.target">
                                                </el-input>
                                        </el-form-item>

                                   
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-12">
                                 
                                        <el-form-item label-width="0px">
                                                <el-input
                                                    v-model="targetCount"
                                                    style="width: 100%"
                                                    disabled
                                                    >

                                                    <template slot="append">次数</template>
                                                </el-input>
                                        </el-form-item>

                                   
                                </div>
                            </div>
                                
                </el-form>        
                    <el-card style="margin-top:20px;border:none;text-align:center" shadow='never'>
                         <el-button type="primary" @click="save()" size='small' v-if='type !=="look"'>保存</el-button>
                         <el-button type="danger" @click="$router.back()" size='small'>返回</el-button>
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
      form: {},
      deptNameList: [],
      deptName: [],
      tquarterList: [
        {
          label: "第一季度",
          value: 1
        },
        {
          label: "第二季度",
          value: 2
        },
        {
          label: "第三季度",
          value: 3
        },
        {
          label: "第四季度",
          value: 4
        }
      ],
      tcycleList: [
        {
          label: "年度",
          value: 1
        },
        {
          label: "季度",
          value: 2
        }
      ],
      rules: {
        tyear: [{ required: true, message: "必填", trigger: "change" }],
        tquarter: [{ required: true, message: "必填", trigger: "change" }],
        dept: [{ required: true, message: "必填", trigger: "change" }],
        projectName: [{ required: true, message: "必填", trigger: "blur" }],
        proportion: [{ required: true, message: "必填", trigger: "blur" }],
        tcycle: [{ required: true, message: "必填", trigger: "change" }]
      },
      type: ""
    };
  },
  computed: {
    ...Vuex.mapState(["ALL_SELECT_DATA", "user"]),
    localCount() {
      if (this.form.flightTime && this.form.localQuota) {
        let result = this.form.flightTime * this.form.localQuota;
        if (String(result) !== "NAN") {
          return result;
        } else {
          return "";
        }
      }
    },
    targetCount() {
      if (this.form.flightTime && this.form.target) {
        let result = this.form.flightTime * this.form.target;
        if (String(result) !== "NAN") {
          return result;
        } else {
          return "";
        }
      }
    }
  },
  created() {
    getDepartmentList().then(result => {
      this.deptNameList = result;
      console.log(result);
    });
    if (this.$route.query && this.$route.query.id) {
      let id = this.$route.query.id;
      this.type = this.$route.query.type;
      axios
        .get("/api/target/" + id)
        .then(result => {
          console.log(result);
          if (result.data && result.data.error === 0) {
            this.form = result.data.data;
            this.form.tyear = String(this.form.tyear);
          }
        })
        .then(() => {
          if (this.form.deptId) {
            axios
              .get("/api/system/dept/parents?deptId=" + this.form.deptId)
              .then(result => {
                if (result.data && result.data.error === 0) {
                  let arr = result.data.data;
                  if (arr.length > 0) {
                    console.log(arr);
                    this.form.dept = arr;
                  }
                }

                this.$forceUpdate();
              });
          }
        });
    }
  },
  watch: {},
  methods: {
    getCascaderObj(val, opt) {
      return val.map(function(value, index, array) {
        for (var itm of opt) {
          if (itm.deptId == value) {
            opt = itm.children;
            return itm;
          }
        }
        return null;
      });
    },
    deptChange() {
      //   console.log(this.deptName, this.deptNameList)
      let arr = this.getCascaderObj(this.form.dept, this.deptNameList);
      if (arr.length > 0) {
        console.log(arr);
        this.form.deptId = arr[arr.length - 1].deptId;
        this.form.deptName = arr[arr.length - 1].label;
      }
    },
    save() {
      this.form.localCount = this.localCount;
      this.form.targetCount = this.targetCount;
      this.form.createTime = formatDate(new Date(), "yyyy-MM-dd");
      this.$refs["form"].validate(valid => {
        if (!valid) {
          this.$message({
            type: "error",
            message: "内容不能为空"
          });
          return false;
        } else {
          if (this.type === "") {
              // 新增保存
            axios
              .post("/api/target/save", this.form)
              .then(result => {
                if (result.data && result.data.error === 0) {
                  this.$message({
                    type: "success",
                    message: "保存成功"
                  });
                  this.$router.back()
                } else {
                  this.$message({
                    type: "error",
                    message: "保存失败" + result.data.message
                  });
                }
              })
              .catch(error => {
                this.$message({
                  type: "error",
                  message: "保存失败" + error
                });
              });
          }else{
              // 编辑保存
            axios
              .put("/api/target/update", this.form)
              .then(result => {
                if (result.data && result.data.error === 0) {
                  this.$message({
                    type: "success",
                    message: "保存成功"
                  });
                  this.$router.back()
                } else {
                  this.$message({
                    type: "error",
                    message: "保存失败" + result.data.message
                  });
                }
              })
              .catch(error => {
                this.$message({
                  type: "error",
                  message: "保存失败" + error
                });
              });  
          }
        }
      });
    }
  }
};
</script>

