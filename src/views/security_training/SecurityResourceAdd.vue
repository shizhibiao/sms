<template>
    <div class="animated fadeIn">
        <b-card no-body>
            <div slot="header">
                基本信息
                <div class="card-actions">
                    <b-btn class="btn btn-minimize" v-b-toggle.collapse1><i class="icon-arrow-up"></i></b-btn>
                </div>
            </div>
            <b-collapse id="collapse1" :visible='true'>
                <b-card style="border:none">
                    <el-form :model="form" class="form-title" ref='form' label-width="80px" :inline-message="true" :rules='rules' :disabled="isDisabled">
                
                        <div class="row">
                            <div class="col-lg-4 col-md-6 col-sm-12">
                                <el-form-item label="课程名称" prop="scoreName">
                                    <el-input v-model='form.scoreName'></el-input>
                                </el-form-item>
                            </div>
                            <div class="col-lg-4 col-md-6 col-sm-12">
                                <el-form-item label="上传人" >
                                    <el-input v-model='form.uploaderName ' readonly></el-input>
                                </el-form-item>
                            </div>
                            
                            <!-- <div class="col-lg-4 col-md-6 col-sm-12" v-if='type ===""||"edit"'>
                                <el-form-item label="学员" prop="students">
                                    <el-select v-model="form.students" :clearable='true' multiple value-key="userId">
                                        <el-option 
                                        :label="item.userName" 
                                        :value="item" 
                                        v-for='(item,index) in studentArr'
                                       
                                        :key="index"></el-option>
                                    </el-select>
                                    
                                </el-form-item>
                            </div> -->
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <el-form-item label="部门" prop="deptIdArr">
                                        <el-cascader
                                            :options="DeptNameList"
                                            :show-all-levels="false"
                                            v-model="form.deptIdArr"
                                            :clearable='true'
                                            :props="{
                                                label:'label',
                                                value:'deptId',
                                                children:'children'
                                            }"
                                        @change='changeDept'
                                        ></el-cascader>
                                </el-form-item>
                            </div>
                            
                            
                            
                            
                        </div>
                        <div class="row">
                            <div class="col-lg-8 col-md-8 col-sm-12">
                                <el-form-item label="学员" prop="students">
                                    <el-select v-model="form.students" :clearable='true' multiple value-key="studentId">
                                        <el-option 
                                        :label="item.studentName" 
                                        :value="item" 
                                        v-for='(item,index) in studentArr'
                                        
                                        :key="index"></el-option>
                                    </el-select>
                                    
                                </el-form-item>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-12">
                                <el-form-item label="正文内容" prop="content">
                                    <el-input type="textarea" v-model="form.content" style="width: 100%" :autosize ="{ minRows: 8, maxRows: 20 }"></el-input>
                                </el-form-item>
                            </div>

                        </div>
                
                    </el-form>
                </b-card>
            </b-collapse>
            
        </b-card>
        <adjunct
            ref='adjunct'
            :safetyId ='id'
            tableName='t_train_score'
            :flag="type==='look'?2:''"
            :uploadFile="type==='edit'?true:false"
            >
        </adjunct>

        <b-card>
            <div style='text-align:center'>
                <el-button type="success"  @click ='saveBtnAction' :disabled="isDisabledSaveBtn" v-if='type !=="look"'>保存</el-button>
                <el-button type="primary"  @click ='sendBtnAction' :disabled="!isDisabledSaveBtn" v-if='type !=="look"'>发布</el-button>
                <el-button @click ='goBack()'>返回</el-button>
            </div>
        </b-card>
                   
        
    </div>
</template>
<script>
import Vuex from "vuex";
import axios from "axios";
import adjunct from "../../components/System/security_notice/SecurityNoticeAdjunct";
import { getDepartmentList } from "../../services/safety_notice";
export default {
  components: {
    adjunct
  },
  data() {
    return {
      DeptNameList: [],
      deptIdArr: [],
      form: {},
      studentArr: [],
      fullscreenLoading: false,
      rules: {
        scoreName: [{ required: true, message: "必填", trigger: "blur" }],
        deptIdArr: [{ required: true, message: "必填", trigger: "change" }],
        students: [{ required: true, message: "必填", trigger: "change" }],
        content: [{ required: true, message: "必填", trigger: "blur" }]
      },
      isDisabledSaveBtn: false,
      id: "",
      isDisabled: false,
      type: "",
      count: 0
    };
  },
  computed: {
    ...Vuex.mapState(["ALL_SELECT_DATA", "user"])
  },
  created() {
    getDepartmentList().then(result => {
      this.DeptNameList = result;
    });
    if (this.$route.query && this.$route.query.id) {
      this.id = this.$route.query.id;
      let type = this.$route.query.type;
      this.type = type;
      axios
        .get("/api/train/score/" + this.id)
        .then(result => {
          console.log(result);
          if (result.data && result.data.error === 0 && result.data.data) {
            this.form = result.data.data;
            console.log(this.form);
          }
        })
        .then(() => {
          // 根据 当前部门获得上级部门
          if (this.form.deptId) {
            axios
              .get("/api/system/dept/parents?deptId=" + this.form.deptId)
              .then(result => {
                if (result.data && result.data.error === 0) {
                  let arr = result.data.data;
                  if (arr.length > 0) {
                    console.log(arr);
                    this.form.deptIdArr = arr;
                    // this.form.deptIdArr=this.getCascaderObj2(arr,this.DeptNameList)
                  }
                }
                // this.studentArr = this.form.students;

                this.$forceUpdate();
              });
            axios
                .get("/api/system/user/dept?deptId=" + this.form.deptId)
                .then(result => {
                    if(result.data&&result.data.error===0&&result.data.data){
                        let arr = result.data.data
                        let newarr = arr.map(item=>{
                            return {
                                userId:item.userId,
                                userName:item.userName,
                                studentName:item.userName,
                                studentId:item.userId
                            }
                        })  
                        this.studentArr = newarr
                    }
                    this.$forceUpdate()
                });
          }
        });
      if (type === "look") {
        this.isDisabled = true;
      }
    } else {
      this.form.uploader = this.user.userId;
      this.form.uploaderName = this.user.userName;
    }
  },
  methods: {
    changeDept() {
    this.form.students=[]
      this.studentArr=[]
      let arr1 = this.getCascaderObj(this.form.deptIdArr, this.DeptNameList);

      if (arr1.length > 0) {

        this.form.deptId = arr1[arr1.length - 1].deptId;
        this.form.deptName = arr1[arr1.length - 1].label;

        axios
          .get("/api/system/user/dept?deptId=" + this.form.deptId)
          .then(result => {
            console.log(result);
            if (result.data && result.data.error === 0) {
              let arr = result.data.data
                if(arr.length>0){
                    let newarr = arr.map(item=>{
                    return {
                        userId:item.userId,
                        userName:item.userName,
                        studentName:item.userName,
                        studentId:item.userId
                        }   
                    })  
                    this.studentArr = newarr
                    console.log(newarr)
                }
                
            }
          });
      }
    },
    goBack() {
      this.$router.back();
    },
    saveBtnAction() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          this.valid = false;
          this.$message({
            type: "error",
            message: "不能为空"
          });
          return false;
        } else {
          this.valid = true;
        }
      });

      if (this.valid) {
        if (this.form.students && this.form.students.length > 0) {
          let arr = this.form.students.map(item => {
            return {
              studentId: item.studentId,
              studentName: item.studentName
            };
          });
          this.form.students = arr;
        }
        let params = {
          trainScoreDO: this.form,
          attachementList: this.$refs.adjunct.fileFormList
        };
        console.log(params);
        // 新增
        if (this.type === "") {
          axios
            .post("/api/train/score/save", params)
            .then(result => {
              console.log(result);
              if (result.data && result.data.error === 0) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.isDisabledSaveBtn = true;
                this.id = result.data.data.id;
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
          // 其他
        } else {
            console.log(this.form)
          axios
            .put("/api/train/score/update", this.form)
            .then(result => {
              console.log(result);
              if (result.data && result.data.error === 0) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.isDisabledSaveBtn = true;
                this.id = result.data.data.id;
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
    },
    sendBtnAction() {
      if (this.id || this.id === 0) {
        axios
          .get("/api/train/score/publish/" + this.id)
          .then(result => {
            if (result.data && result.data.error === 0) {
              this.$message({
                type: "success",
                message: "发布成功"
              });
              this.goBack();
            } else {
              this.$message({
                type: "error",
                message: "发布失败" + result.data.message
              });
            }
          })
          .catch(error => {
            this.$message({
              type: "error",
              message: "发布失败" + error
            });
          });
      }
    },
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
    }
  },
  watch: {
    form: {
      handler(newdata, olddata) {
          
        if (this.type === "edit") {
          this.count++;
          this.isDisabledSaveBtn = true;
          if (this.count > 2) {
            this.isDisabledSaveBtn = false;
          }
        }
      },
      deep: true
    }
  }
};
</script>
