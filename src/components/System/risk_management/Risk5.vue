<template>
  <b-card no-body>
        <div slot="header">
          措施验证
            <div class="card-actions">
              <b-btn class="btn btn-minimize" v-b-toggle.collapse5><i class="icon-arrow-up"></i></b-btn>
            </div>
        </div>
        <b-collapse id="collapse5" :visible='true'>
            <b-card-body>
              <el-table
                  :data="tableData"
                  style="width: 100%">
                  <el-table-column
                    prop="deptName"
                    label="责任部门"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="userName"
                    label="责任人"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="planDate"
                    label="计划日期"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="content"
                    label="控制措施"
                  >
                  </el-table-column>
                  <el-table-column
                    label="完成情况"
                  >
                      <template slot-scope="scopes">
                      
                        <el-switch
                        v-model="scopes.row.doneResult"
                        :active-value="1"
                        :inactive-value="0"
                        active-text="完成"
                        inactive-text="未完成"
                        disabled
                        >
                      </el-switch>
                      </template>
                  </el-table-column>
                  
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="100"
                  >
                      <template slot-scope="scope">
                            <el-button @click="addAdviseContent(scope.$index, scope.row)" type="success" size="mini" v-if='!noWritable'>编辑</el-button>
                      </template>
                  </el-table-column>
                
                </el-table>
            </b-card-body>
        </b-collapse>
        <el-dialog title="编辑" :visible.sync="dialogFormVisible" width='50%'  >
          <el-form :model="contentform" :rules="rules" inline-message ref='contentform' label-width="120px">
            <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="责任部门" >
                        <el-input :value="contentform.deptName" disabled></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="责任人">
                        <el-input :value="contentform.userName" disabled></el-input>
                    </el-form-item>
                </div>

                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="计划日期">
                        <el-input :value="contentform.planDate" disabled></el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <el-form-item label="控制措施">
                        <el-input :value="contentform.content" disabled></el-input>
                  </el-form-item>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <el-form-item label="完成情况" prop="doneResult">
                        <el-switch
                          v-model="contentform.doneResult"
                          active-text="完成"
                          inactive-text="未完成">
                        </el-switch>
                    </el-form-item>
                </div>

                <!-- <div class="col-lg-12 col-md-12 col-sm-12">
                    <el-form-item label="情况说明" label-width="120px" prop="description">
                        <el-input v-model="contentform.description" auto-complete="off"></el-input>
                    </el-form-item>
                </div> -->
          </div>


          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="agreeAddContent">保存</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
            
          </div>
      </el-dialog>
  </b-card>
</template>
<script>
import {
  searchRiskManageDeptSteps,
  modifyRiskManageStep
} from '../../../services/risk'
// import {
// // SafetyNoticeContent
// // saveSafetyNoticeContent
// } from '../../../services/safety_notice'
import PubSub from 'pubsub-js'
export default {
  data () {
    return {
      tableData: [
      ],
      rules: {
        doneResult: [
          { required: true, message: '必填', trigger: 'change' }
        ]
      },
      contentform: {

      },
      dialogFormVisible: false

    }
  },
  props: ['taskId', 'riskId','noWritable'],
  methods: {
    // 点击添加
    addAdviseContent (index, row) {
      this.contentform = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    agreeAddContent () {
      let params = JSON.parse(JSON.stringify(this.contentform))
      params.doneResult = Number(this.contentform.doneResult)
      modifyRiskManageStep(params).then(result => {
        if (result.data && result.data.error === 0) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.dialogFormVisible = false
          this.searchRiskSteps(this.riskDeptId)
        } else {
          this.$message({
            type: 'error',
            message: '保存失败，错误信息:' + result.data.message
          })
        }
      })
    },
    getRiskControlDeptObjHandle (message, data) {
      this.riskDeptId = data.rmDepartmentDOList[0].riskDeptId

      this.searchRiskSteps(this.riskDeptId)
    },
    searchRiskSteps (riskDeptId) {
      if (riskDeptId) {
        searchRiskManageDeptSteps(riskDeptId).then(result => {
         
          if (result.data && result.data.error === 0) {
            this.tableData = result.data.data
            
          }
        })
      }
    }
  },
  created () {
    this.unSubscribe = PubSub.subscribe('getRiskControlDeptObj', this.getRiskControlDeptObjHandle)
  },
  mounted () {
  },
  watch: {

  },
  destroyed () {
    PubSub.unsubscribe(this.unSubscribe)
  }

}
</script>
