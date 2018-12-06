<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <el-row type="flex">
          <el-col  justify="start" :span="18">
            <el-form :inline="true" class="form-title" label-width="40px">
              <el-form-item label="用户">
                <el-input style="width: 200px"
                          placeholder="请输入账号、姓名"
                          prefix-icon="el-icon-search"
                          v-model="workNo">
                </el-input>
              </el-form-item>
              <el-form-item label="部门">
                <el-cascader
                  :show-all-levels="false"
                  :options="deptNameList"
                  change-on-select
                  v-model="deptName"
                  :clearable='true'
                  :props="{
                      label:'label',
                      value:'deptId',
                      children:'children'
                  }"
                  @change="changeClassDept"
                ></el-cascader>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col justify="end" :span="6">
            <div class="float-right">
              <button class="btn btn-info mt-1" @click="alertUserForm()"><i class="fa fa-edit"></i> 新增</button>
              <button class="btn btn-info mt-1" @click="clear()"><i class="fa fa-refresh"></i> 重置</button>
              <button class="btn btn-info mt-1" @click="refresh()"><i class="fa fa-search"></i> 查询</button>
            </div>
          </el-col>
        </el-row>
      </div>
      <b-card-body>
        <!-- Main table element -->
        <b-table show-empty striped hover
                 :items="items"
                 :fields="fields"
        >
          <template slot="userValid" slot-scope="row">{{row.item.userValid?'正常':'失效'}}</template>
          <template slot="actions" slot-scope="row">
            <button class="btn btn-sm btn-primary" @click="setterRole(row.item.userId)">
              <i class="fa fa-user-plus"></i> 分配角色
            </button>
            <button class="btn btn-sm btn-info" v-if="row.item.userId>1" @click="modifiyHandle(row.item.userId)">
              <i class="fa fa-legal"></i> 编辑
            </button>
            <button class="btn btn-sm btn-danger" v-if="row.item.userId>1" @click="deleteUser(row.item.userId)">
              <i class="fa fa-close"></i> 删除
            </button>
            <button class="btn btn-sm btn-warning" @click="chgPwd(row.item.userId)">
              <i class="fa fa-cog"></i> 更改密码
            </button>
          </template>
        </b-table>

        <b-row>
          <b-col sm="12" v-if="totalPages>1">
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
      </b-card-body>
    </b-card>
    <!--弹出新增用户组件-->
    <user-form ref='userForm'></user-form>
  </div>
</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'
  import AlertUserForm from '../../components/User/AlertUserForm.vue'
  import { getDepartmentList } from '@/services/safety_notice';

  export default {
    name: 'user-list',
    components: {
      'user-form': AlertUserForm
    },
    data () {
      return {
        items: [],
        fields: [
          {key: 'userNo', label: '工号', sortable: true},
          {key: 'loginName', label: '账号', sortable: true},
          {key: 'userName', label: '姓名'},
          {key: 'deptName', label: '部门', sortable: true},
          {key: 'userPhone', label: '手机'},
          {key: 'userMail', label: '邮箱'},
          {key: 'userValid', label: '状态'},
          {key: 'actions', label: '操作'}
        ],
        total: 0,
        curPage: 1,
        pageSize: 15,
        totalPages: 1,
        workNo: '',
        deptNameList: [],
        deptName: []

      }
    },
    methods: {
      refresh () {
        this.getData()
      },
      getData () {
        let pageNo = this.curPage - 1

        let url = 'api/system/user?pageNum=' + pageNo + '&pageSize=' + this.pageSize

        if (this.workNo.length > 0) {
          url += '&userNo=' + this.workNo
        }
        if (this.deptName.length > 0) {
          let deptId = this.deptName[this.deptName.length - 1]
          url += '&deptId=' + deptId
        }
        console.log(url)
        axios.get(url)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.total = page.totalElements
              this.totalPages = page.totalPages
              this.items = page.content
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      clear () {
        this.workNo = ''
        this.curPage = 1
        this.deptName = []
        this.debouncedGetDataByWorkNo()
      },
      deleteUser (userId) {
        this.$confirm('确定删除该用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/api/system/user/' + userId)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.refresh()
              } else {
                this.$message({
                  type: 'info',
                  message: '删除失败'
                })
              }
            })
            .catch(response => {
              alert(response)
            })
        }).catch(() => {
        })
      },
      setterRole (userId) {
        let url = '/system/user-role/' + userId
        this.$router.push({path: url})
      },
      chgPwd (userId) {
        let url = '/system/change-password/' + userId
        this.$router.push({path: url})
      },
      alertUserForm () {
        this.$refs.userForm.addUser()
      },
      modifiyHandle (userId) {
        this.$refs.userForm.modifiyHandle(userId)
      },
      changeClassDept (arr) {
        if (arr.length < 2) {
          this.deptName = []
        }
      }
    },
    watch: {
      curPage: function (newValue, oldValue) {
        this.getData()
      }
      // workNo: function (newValue, oldValue) {
      //   if (newValue !== oldValue && newValue !== null) {
      //     if (this.curPage > 1) {
      //       this.curPage = 1
      //     }
      //
      //   }
      // }
    },
    created () {
      this.getData()
      this.debouncedGetDataByWorkNo = _.debounce(this.getData, 500)
      getDepartmentList().then(result => {
        this.deptNameList = result
      // console.log(result);
    })
  }
  }
</script>

<style scoped>
  >>> .el-dialog {
    width: 800px !important;
  }
</style>
