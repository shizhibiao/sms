<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-body>
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="风险矩阵法" name="fc">
            <b-card no-body v-for="(lecfcType, index) in fcTypes" :key="index">
              <div slot="header">
                <strong>{{lecfcType.name}}</strong>
              </div>
              <b-card-body>
                <div class="table-responsive-sm">
                  <table class="table table-striped table-condensed table-hover table-sm">
                    <thead>
                    <tr>
                      <th>#</th>
                      <th v-if="index===0">可能性(F)</th>
                      <th v-if="index===1">严重性(C)</th>
                      <th v-if="index===2">可接受程度</th>
                      <th v-if="index<2">参考值</th>
                      <th v-else>风险值(R)</th>
                      <th v-if="index<2">界定标准</th>
                      <th v-else>危险程度</th>
                      <th v-if="index===2">风险等级</th>
                      <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(lecfc, idx) in lecfcType.datas" :key='idx'>
                      <td>{{idx + 1}}</td>
                      <td>{{lecfc.grade}}</td>
                      <td>{{lecfc.refValue}}</td>
                      <td style="word-wrap:break-word; min-width: 100px; max-width: 300px">{{lecfc.standard}}</td>
                      <td v-if="index===2">{{lecfc.riskClass}}</td>
                      <td>
                        <button class="btn btn-sm btn-info" @click="editFcLec(lecfc)">
                          <i class="fa fa-edit"></i> 编辑</button>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </b-card-body>
            </b-card>
          </el-tab-pane>
          <el-tab-pane label="LEC法" name="lec">
            <b-card no-body v-for="(lecfcType, index) in lecTypes" :key="index">
              <div slot="header">
                <strong>{{lecfcType.name}}</strong>
              </div>
              <b-card-body>
                <div class="table-responsive-sm">
                  <table class="table table-striped table-condensed table-hover table-sm">
                    <thead>
                    <tr>
                      <th>#</th>
                      <th v-if="index===0">事故发生可能性(L)</th>
                      <th v-if="index===1">人员暴露于危险环境中频繁程度(E)</th>
                      <th v-if="index===2">事故发生可能造成的后果(C)</th>
                      <th v-if="index===3">可接受程度</th>
                      <th v-if="index<3">参考值</th>
                      <th v-else>风险值(D)</th>
                      <th v-if="index===3">危险程度</th>
                      <th v-if="index===3">风险等级</th>
                      <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(lecfc, idx) in lecfcType.datas" :key='idx'>
                      <td>{{idx + 1}}</td>
                      <td v-if="index===3">{{lecfc.grade}}</td>
                      <td v-if="index===3">{{lecfc.refValue}}</td>
                      <td style="word-wrap:break-word; min-width: 100px; max-width: 300px">{{lecfc.standard}}</td>
                      <td v-if="index<3">{{lecfc.refValue}}</td>
                      <td v-else>{{lecfc.riskClass}}</td>
                      <td>
                        <button class="btn btn-sm btn-info" @click="editFcLec(lecfc)">
                          <i class="fa fa-edit"></i> 编辑</button>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </b-card-body>
            </b-card>
          </el-tab-pane>
        </el-tabs>
      </b-card-body>
    </b-card>
    <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="fclecForm" :rules="rules" ref="fclecForm" status-icon :inline-message="true" size="medium" label-width="150px">
        <el-form-item :label="gradeLabel" prop="grade" v-if="fclecForm.fcLecType<11 || fclecForm.fcLecType===14">
          <el-input v-model="fclecForm.grade" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="refValueLabel" prop="refValue">
          <el-input v-model="fclecForm.refValue" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="standardLabel" prop="standard">
          <el-input type="textarea" v-model="fclecForm.standard" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="风险等级" prop="riskClass" v-if="fclecForm.fcLecType===10 || fclecForm.fcLecType===14">
          <el-input v-model="fclecForm.riskClass" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveFcLec">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'ThreatenFcLec',
    data () {
      return {
        activeName: 'fc',
        fcTypes: [],
        lecTypes: [],
        dialogTitle: '编辑威胁标准',
        dialogFormVisible: false,
        fclecForm: {
          id: 0,
          grade: '',
          refValue: '',
          standard: '',
          riskClass: '',
          fcLecType: 0,
          threatLevel: 0
        },
        rules: {
          grade: [
            { required: true, message: '请输入风险等级', trigger: 'blur' }
          ],
          refValue: [
            { required: true, message: '请输入参考值', trigger: 'blur' }
          ],
          standard: [
            { required: true, message: '请输入界定标准', trigger: 'blur' }
          ],
          riskClass: [
            { required: true, message: '请输入危险程度', trigger: 'blur' }
          ]
        },
        gradeLabel: '',
        refValueLabel: '',
        standardLabel: ''
      }
    },
    methods: {
      getData () {
        this.fcTypes = []
        this.lecTypes = []
        axios.get('/api/tlecfc')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let datas = data.data
              for (let lecfcType of datas) {
                if (+lecfcType.code < 11) {
                  this.fcTypes.push(lecfcType)
                } else if (+lecfcType.code < 15) {
                  this.lecTypes.push(lecfcType)
                }
              }
            }
          })
      },
      handleClick (tab, event) {

      },
      editFcLec (item) {
        if (this.$refs && this.$refs.fclecForm && this.$refs.fclecForm.hasOwnProperty('resetFields')) {
          this.$refs.fclecForm.resetFields()
        }
        this.dialogTitle = '修改威胁评估标准'
        this.fclecForm = JSON.parse(JSON.stringify(item))
        this.dialogFormVisible = true
        switch (item.fcLecType) {
          case 8:
            this.gradeLabel = '可能性(F)'
            this.refValueLabel = '参考值'
            this.standardLabel = '界定标准'
            break
          case 9:
            this.gradeLabel = '严重性(C)'
            this.refValueLabel = '参考值'
            this.standardLabel = '界定标准'
            break
          case 10:
            this.gradeLabel = '可接受程度'
            this.refValueLabel = '风险值(R)'
            this.standardLabel = '危险程度'
            break
          case 11:
            this.standardLabel = '事故发生可能性(L)'
            break
          case 12:
            this.standardLabel = '人员暴露危险环境中频繁程度(E)'
            break
          case 13:
            this.standardLabel = '事故发生可能造成的后果(C)'
            break
          case 14:
            this.gradeLabel = '可接受程度'
            this.refValueLabel = '风险值(D)'
            this.standardLabel = '危险程度'
            break
        }
      },
      saveFcLec () {
        this.$refs.fclecForm.validate((valid) => {
          if (valid) {
            axios.post('/api/lecfc', this.fclecForm)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                  this.$message({type: 'success', message: '保存成功'})
                  this.dialogFormVisible = false
                  this.getData()
                } else {
                  let msg = {type: 'error', message: '保存失败:' + data.message}
                  this.$message(msg)
                }
              })
              .catch(response => {
                this.$message({type: 'error', message: '服务器或网络异常'})
              })
          }
        })
      }
    },
    created () {
      this.getData()
    }
  }
</script>

<style scoped>

</style>
