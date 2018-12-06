<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-md-12">
        <b-card no-body>
          <div slot="header">
            <strong>部门</strong>
            <button class='btn btn-primary mt-1 float-right' @click="addRootDept()" style="margin-left: 5px"><i class='fa fa-plus'></i> 新增顶级部门</button>
            <button class='btn btn-primary mt-1 float-right' @click="findAll()"><i class='fa fa-refresh'></i> 刷新</button>
          </div>
          <b-card-body style="height:75vh; overflow-y:auto">
            <el-tree :data="deptList" :props="props" :default-expand-all="true">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{getLabel(data, node)}}</span>
                <span>
                  <el-button type="text" size="mini" @click.stop="addDept(data)" v-if="data.levelId < 2">添加下级部门</el-button>
                  <el-button type="text" size="mini" @click.stop="editData(data)">编辑部门</el-button>
                  <el-button type="text" size="mini" v-if="(data.children===null || data.children.length===0)"
                             @click.stop="deleteData(data)">删除部门</el-button>
                </span>
              </span>
            </el-tree>
          </b-card-body>
        </b-card>
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogFormVisible">
          <el-form :model="deptForm" :rules="deptRules" ref="deptForm" status-icon size="medium" label-width="120px">
            <el-row>
              <el-col>
                <el-form-item label="部门名称" prop="deptName">
                  <el-input v-model="deptForm.deptName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="部门编号" prop="deptCode">
                  <el-input v-model="deptForm.deptCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" v-model="deptForm.remark" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save()">确 定</el-button>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name: 'DepartmentList',
    data () {
      return {
        deptList: [],
        props: {
          label: 'deptName',
          children: 'children'
        },
        dialogTitle: '新增部门',
        dialogFormVisible: false,
        deptForm: {
          deptId: 0,
          deptName: '',
          deptCode: '',
          parentId: 0,
          parentCode: '',
          parentName: '',
          levelId: 0,
          remark: ''
        },
        deptRules: {
          deptName: [
            { required: true, message: '请输入部门名称', trigger: 'blur' }
          ],
          deptCode: [
            { required: true, message: '请输入部门名称', trigger: 'blur' }
          ]
        },
        curDept: {}
      }
    },
    methods: {
      getLabel (data, node) {
        return data.deptCode + ' - ' + data.deptName
      },
      findAll () {
        axios.get('/api/system/dept')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.deptList = data.data
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      addRootDept () {
        this.dialogTitle = '新增部门'
        this.deptForm = {}
        this.deptForm.deptId = 0
        this.deptForm.remark = ''
        this.deptForm.parentId = 0
        this.deptForm.parentName = ''
        this.deptForm.parentCode = ''
        this.deptForm.levelId = 0
        this.dialogFormVisible = true
        if (this.$refs && this.$refs.deptForm && this.$refs.deptForm.hasOwnProperty('resetFields')) {
          this.$refs.deptForm.resetFields()
        }
      },
      addDept (data) {
        this.dialogTitle = '新增部门'
        this.deptForm = {}
        this.deptForm.deptId = 0
        this.deptForm.remark = ''
        this.deptForm.parentId = data.deptId
        this.deptForm.parentName = data.deptName
        this.deptForm.parentCode = data.deptCode
        this.deptForm.levelId = data.levelId + 1
        this.dialogFormVisible = true
        if (this.$refs && this.$refs.deptForm && this.$refs.deptForm.hasOwnProperty('resetFields')) {
          this.$refs.deptForm.resetFields()
        }
      },
      editData (data) {
        if (this.$refs && this.$refs.deptForm && this.$refs.deptForm.hasOwnProperty('resetFields')) {
          this.$refs.deptForm.resetFields()
        }
        this.dialogTitle = '编辑部门'
        this.deptForm = JSON.parse(JSON.stringify(data))
        this.dialogFormVisible = true
      },
      save () {
        this.$refs.deptForm.validate((valid) => {
          if (valid) {
            axios.post('/api/system/dept', this.deptForm)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                  this.$message({type: 'success', message: this.deptForm.deptId === 0 ? '新增部门成功' : '修改部门成功'})
                  this.dialogFormVisible = false
                  this.findAll()
                } else {
                  let msg = {type: 'error', message: (this.deptForm.deptId === 0 ? '新增部门失败:' : '修改部门失败:') + data.message}
                  this.$message(msg)
                }
              })
              .catch(response => {
                this.$message({type: 'error', message: '服务器或网络异常'})
              })
          }
        })
      },
      deleteData (data) {
        this.$confirm('确定删除该部门？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/api/system/dept/' + data.deptId)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.$message({type: 'success', message: '部门删除成功'})
                this.findAll()
              } else {
                let msg = {type: 'error', message: '部门删除失败:' + data.message}
                this.$message(msg)
              }
            })
            .catch(response => {
              this.$message({type: 'error', message: '服务器或网络异常'})
            })
        })
      }
    },
    created () {
      this.findAll()
    }
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  >>> .el-dialog {
    width:600px !important;
  }
</style>
