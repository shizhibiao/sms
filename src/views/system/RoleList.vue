<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <div class="float-right">
          <button class='btn btn-info mt-1' @click="addNew()"><i class='fa fa-edit'></i> 新增</button>
          <button class="btn btn-info mt-1" @click="refresh()"><i class="fa fa-refresh"></i> 刷新</button>
        </div>
      </div>
      <b-card-body>
        <div class="table-responsive-sm">
          <table class="table table-striped table-condensed table-hover">
            <thead>
            <tr>
              <th>#</th>
              <th>角色名称</th>
              <th>角色说明</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(role, index) in roles" :key='index'>
              <td>{{index + 1}}</td>
              <td>{{role.roleName}}</td>
              <td>{{role.roleDesc}}</td>
              <td>
                <button class="btn btn-sm btn-primary" @click="manageUser(role)">
                  <i class="fa fa-user-plus" ></i> 成员管理</button>
                <button class="btn btn-sm btn-info" @click="editRight(role.roleId)">
                  <i class="fa fa-edit"></i> 编辑权限</button>
                <button class="btn btn-sm btn-info" v-if="role.roleId>1" @click="delRole(role.roleId)">
                  <i class="fa fa-remove"></i> 删除角色</button>
              </td>
            </tr>
            </tbody>
          </table>
          <b-row>
            <b-col sm="12" class="mt-1" v-if="totalPages>1">
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
        </div>
      </b-card-body>
    </b-card>
    <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="roleForm" :rules="rules" ref="roleForm" status-icon :inline-message="true"
               size="medium" label-width="150px">
        <el-row>
          <el-col>
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色说明" prop="roleDesc">
              <el-input v-model="roleForm.roleDesc" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitData()">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'role-list',
    data () {
      return {
        roleId: 0,
        roles: [],
        dialogTitle: '新增角色',
        dialogFormVisible: false,
        roleForm: {
          roleId: 0,
          roleName: '',
          roleDesc: ''
        },
        rules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ]
        },
        total: 0,
        curPage: 1,
        pageSize: 15,
        totalPages: 1
      }
    },
    methods: {
      refresh () {
        this.curPage = 1
        this.getData()
      },
      getData () {
        let pageNo = this.curPage - 1
        axios.get('/api/system/role/page?pageNum=' + pageNo + '&pageSize=' + this.pageSize)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.total = page.totalElements
              this.totalPages = page.totalPages
              this.roles = page.content
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      manageUser (role) {
        let url = '/system/role-user/' + role.roleId
        this.$router.push({path: url})
      },
      addNew () {
        this.dialogTitle = '新增角色'
        this.roleForm = {}
        this.roleForm.roleId = 0
        this.roleForm.roleName = ''
        this.roleForm.roleDesc = ''
        this.dialogFormVisible = true
        if (this.$refs && this.$refs.roleForm && this.$refs.roleForm.hasOwnProperty('resetFields')) {
          this.$refs.roleForm.resetFields()
        }
      },
      editRight (id) {
        let url = '/system/role-rights/' + id
        this.$router.push({path: url})
      },
      delRole (id) {
        this.$confirm('确定删除该角色组信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/api/system/role/' + id)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.$message({type: 'success', message: '数据删除成功'})
                this.getData()
              } else {
                let msg = {type: 'error', message: '数据删除失败:' + data.message}
                this.$message(msg)
              }
            })
            .catch(response => {
              this.$message({type: 'error', message: '服务器或网络异常'})
            })
        })
      },
      submitData () {
        console.log(this.roleForm)
        this.$refs.roleForm.validate((valid) => {
          if (valid) {
            if (+this.roleForm.roleId === 0) {
              axios.post('/api/system/role/addRole', this.roleForm)
                .then(response => {
                  let data = response.data
                  if (data && data.error === 0) {
                    this.$message({type: 'success', message: '角色信息新增成功'})
                    this.dialogFormVisible = false
                    this.getData()
                  } else {
                    let msg = {type: 'error', message: '角色信息新增失败:' + data.message}
                    this.$message(msg)
                  }
                })
                .catch(response => {
                  this.$message({type: 'error', message: '服务器或网络异常'})
                })
            }
          } else {
            return false
          }
        })
      }
    },
    watch: {
      curPage: function (newValue, oldValue) {
        this.getData()
      }
    },
    created () {
      this.getData()
    }
  }
</script>

<style scoped>
  >>> .el-dialog {
    width:500px !important;
  }
</style>
