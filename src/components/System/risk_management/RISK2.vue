<template>
<!--控制措施-->

    <b-card no-body>
        <div slot="header">
          控制措施
          <div class="float-right" style="margin-right: 3em">
            <el-button type="primary" size="small" @click="addFormVisible = true" v-if='!noWritable'>新增</el-button>
          </div>
          <div class="card-actions">
            <b-btn class="btn btn-minimize" v-b-toggle.collapse4><i class="icon-arrow-up"></i></b-btn>
          </div>
        </div>
      <b-collapse id="collapse4" :visible='true'>
        <!--main-->
        <b-card-body>
            <el-form ref="riskForm" label-width="110px" label-position="left" :model="riskForm" :rules='riskFormRules' inline-message>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <el-form-item label="风险控制员">
                            <p>{{processDeptObj.processUserName}}</p>
                        </el-form-item>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <el-form-item label="受理部门">
                                <p>{{processDeptObj.controlDeptName}}</p>
                        </el-form-item>
                    </div>
                    
                </div>
            </el-form>
        

            <template>
                <el-table
                    :data="datas"
                    
                    >
                
                    <el-table-column
                    label="责任部门"
                    prop="deptName"

                    >
                    </el-table-column>
                    <el-table-column
                    label="责任人"
                    prop="userName">
                    </el-table-column>
                    <el-table-column
                    label="计划完成日期"
                    prop="planDate">
                    </el-table-column>
                    <el-table-column
                    label="控制措施"
                    prop="content">
                    </el-table-column>
                    <el-table-column label="操作" v-if='!noWritable'>
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                          
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            
            </template>
        </b-card-body>
      </b-collapse>
    <!-- 对话框 1-->
    <el-dialog title="新增" :visible.sync="addFormVisible" width='35%'>
        <el-form :model="addForm"  :rules="addRules" ref="addForm" inline-message label-width="120px">
            <el-form-item label="责任部门/单元" prop='deptId'>
               <el-select v-model="addForm.deptId" placeholder="请选择责任部门/单元" value-key='deptId'  >
                    <el-option :label="item.data.deptName" :value="item.data"  v-for="(item,index) in deptNameList" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="责任人"  prop='userId'>
               <el-select v-model="addForm.userId" placeholder="请选择责任人" value-key='userId' >
                    <el-option :label="item.userName" :value="item"  v-for="(item,index) in controlUserList" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="计划完成日期" prop='planDate'>
                <el-date-picker
                    v-model="addForm.planDate"
                    type="date"
                    style="width:100%"
                    placeholder="请选择计划完成日期" 
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="控制措施" prop='content'>
                <el-input v-model="addForm.content"></el-input>
            </el-form-item>
            
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="addFormVisible=false">取 消</el-button>
            <el-button type="primary" size="mini" @click='addActionHandle'>确 定</el-button>
        </div>
    </el-dialog>

    </b-card>


</template>


<script>
import Vuex from 'vuex'
import PubSub from 'pubsub-js'
import {
  GetDepartmentListFromList,
  riskManageControlPerson,
  addRiskManageStep,
  searchRiskManageDeptSteps,
  deleteRiskManageStep,
  modifyRiskManageStep
} from '../../../services/risk'
export default {
  components: {},
  data () {
    return {
      datas: [],
      riskForm: {},
      riskFormRules: {

      },
      processDeptObj: {},
      addFormVisible: false,
      addForm: {},
      addRules: {
        deptId: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        userId: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        planDate: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        content: [
          { required: true, message: '必填', trigger: 'blur' }
        ]

      },
      deptNameList: [],
      controlUserList: [],
      type: 'add'
    }
  },

  props: {
    noWritable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...Vuex.mapState(['user']),
    ...Vuex.mapState(['ALL_SELECT_DATA'])
  },
  methods: {
    // 新增/修改  确定
    addActionHandle () {
      this.$refs.addForm.validate((valid) => {
        if (!valid) {
          this.$message({
            type: 'error',
            message: '不能为空'
          })
          return false
        } else {
          // 新增措施
          if (this.type === 'add') {
            let data = this.addForm
            let params = {
              deptId: data.deptId.deptId,
              deptName: data.deptId.deptName,
              planDate: data.planDate,
              userId: data.userId.userId,
              userName: data.userId.userName,
              content: data.content,
              riskDeptId: this.processDeptObj.riskDeptId

            }

            addRiskManageStep(params).then(result => {
              if (result.data && result.data.error === 0) {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                this.addFormVisible = false
                this.$emit('saveMessage')
                this.searchRiskSteps(this.processDeptObj.riskDeptId)
                this.$refs.addForm.resetFields()
              } else {
                this.$message({
                  type: 'error',
                  message: '新增错误'
                })
              }
            })
          } else if (this.type === 'modify') {
            let modifyData = JSON.parse(JSON.stringify(this.addForm))

            modifyData.deptId = this.addForm.deptId.deptId
            modifyData.deptName = this.addForm.deptId.deptName
            modifyData.userId = this.addForm.userId.userId
            modifyData.userName = this.addForm.userId.userName

            modifyRiskManageStep(modifyData).then(result => {
              if (result.data && result.data.error === 0) {
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
                this.addFormVisible = false
                this.$refs.addForm.resetFields()
                this.searchRiskSteps(this.processDeptObj.riskDeptId)
              } else {
                this.$message({
                  type: 'error',
                  message: '编辑错误'
                })
              }
              this.type = 'add'
            })
          }

          //
        }
      })
    },
    // 修改
    handleEdit (index, row) {
      // console.log(index, row)

      this.addForm = JSON.parse(JSON.stringify(row))
      // 因为绑定的是个对象
      this.addForm.userId = {
        userId: this.addForm.userId,
        userName: this.addForm.userName
      }
      this.addForm.deptId = {
        deptId: this.addForm.deptId,
        deptName: this.addForm.deptName
      }

      this.addFormVisible = true
      this.type = 'modify'
    },
    handleDelete (index, row) {
      // 删除
      deleteRiskManageStep(row.id).then(result => {
        if (result.data && result.data.error === 0) {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          // 查询
          this.searchRiskSteps(this.processDeptObj.riskDeptId)
        } else {
          this.$message({
            type: 'error',
            message: '编辑错误'
          })
        }
      })
    },
    // 查询
    searchRiskSteps (riskDeptId) {
      if (riskDeptId) {
        searchRiskManageDeptSteps(riskDeptId).then(result => {
          if (result.data && result.data.error === 0) {
            this.datas = result.data.data
            
          }
        })
      }
    },
    getRiskControlDeptObjHandle (meg, data) {
      // 部门等级
      // console.log(meg,data)
      if (data) {
        let projectLevel = data.projectLevel
        if (data.rmDepartmentDOList) {
          this.processDeptObj = data.rmDepartmentDOList[0]

          this.processDeptObj.processUserName = this.processDeptObj.processUserName ? this.processDeptObj.processUserName : this.user.userName
        }
        if (+projectLevel === 1) {
          // 1级部门
          GetDepartmentListFromList(1).then(result => {
            this.deptNameList = result
          })
          // 2级部门
        } else if (+projectLevel === 2) {
          GetDepartmentListFromList(2, this.user.deptId).then(result => {
            this.deptNameList = result
          })
        }
        // 请求控制人
        riskManageControlPerson(this.user.deptId).then(result => {
          if (result.data && result.data.error === 0) {
            this.controlUserList = result.data.data
          }
        })
        // 查询
        this.searchRiskSteps(this.processDeptObj.riskDeptId)
      }
    }
  },
  created () {
    this.unSubscribe = PubSub.subscribe('getRiskControlDeptObj', this.getRiskControlDeptObjHandle)
  },
  mounted () {

  },
  // 销毁监听
  destroyed () {
    PubSub.unsubscribe(this.unSubscribe)
  },
  watch:{
    datas:{
      handler(data, newdata){
       
        if(data.length>0){
            let arr = data.filter(item=>{
              return (item.checkDeptName||item.userName||item.content||item.planDate||item.userId||item.deptId)===null||''
            })
            if(arr.length===0){
               this.$emit('saveMessage','saveMessage')
            }else{
               this.$emit('deleteMessage','deleteMessage')
            }
        }else{
          this.$emit('deleteMessage','deleteMessage')
        }
      },
      deep:true
    }
  }
}
</script>
<style scoped>

</style>
