<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="4">
        <b-card>
          <div slot="header">
            <strong>{{role.roleName}}</strong> 包含用户列表
            <button class="btn btn-info btn-sm float-right mt-0" @click="$router.back(-1)">
              <i class="fa fa-back"></i> 返回</button>
          </div>
          <!-- Main table element -->
          <b-table show-empty striped hover small
                   :items="items"
                   :fields="fields"
                   :current-page="currentPage"
                   :per-page="perPage">
            <template slot="actions" slot-scope="row">
              <b-button size="sm" class="btn-danger" v-if="roleId>1 || row.item.userId>1"
                        @click="deleteRoleUser(roleId, row.item.userId)"> 移除</b-button>
            </template>
          </b-table>

          <b-row>
            <b-col md="12" class="my-1" v-if="totalPage > 1">
              <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col sm="8">
        <b-card>
          <div slot="header">
            <strong>候选用户</strong>
            <button class="btn btn-info btn-sm float-right mt-0" @click="$router.back(-1)">
              <i class="fa fa-back"></i> 返回</button>
          </div>
          <b-tabs>
            <b-tab title="批量筛选" active>
              <b-row>
                <b-col md="6">
                  <b-card>
                    <div slot="header">
                      <button class="btn btn-info btn-sm float-right mt-0" @click="listDept()">
                        <i class="fa fa-refresh"></i> 获取部门</button>
                    </div>
                    <el-tree :data="depts" node-key="deptId" @node-click="handleNodeClick"
                             :props="treeProps" accordion class="scroll-bar">
                    </el-tree>
                  </b-card>
                </b-col>
                <b-col md="6">
                  <b-card>
                    <div slot="header">
                      <strong>{{curDept.deptName}}</strong>
                      <button class="btn btn-info btn-sm mt-0" @click="listDeptEmp(curDept.deptId)">
                        <i class="fa fa-refresh"></i> 获取部门员工</button>
                      <button class="btn btn-info btn-sm float-right mt-0" @click="batchAdd()">
                        <i class="fa fa-plus"></i> 批量增加</button>
                    </div>
                    <b-table show-empty striped hover small
                             :items="emps"
                             :fields="empFields"
                             :current-page="empCurPage"
                             :per-page="perPage">
                      <template slot="HEAD_checked" slot-scope="data">
                        <input type="checkbox" @click.stop="toggleSelected" v-model="allChecked">
                      </template>
                      <template slot="checked" slot-scope="row">
                        <input type="checkbox" @click.native.stop v-model="row.item.checked">
                      </template>
                      <template slot="actions" slot-scope="row">
                        <b-button size="sm" class="btn-info" @click="singleAdd(row.item)"> 增加</b-button>
                      </template>
                    </b-table>

                    <b-row>
                      <b-col md="12" class="my-1" v-if="empTotalPage>1">
                        <b-pagination :total-rows="empTotalRows" :per-page="perPage" v-model="empCurPage" class="my-0" />
                      </b-col>
                    </b-row>
                  </b-card>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="单个筛选" >
              <b-card>
                <div slot="header">
                  <el-input style="width: 200px"
                            placeholder="请输入账号、姓名"
                            prefix-icon="el-icon-search"
                            v-model="workNo">
                  </el-input>
                  <button class="btn btn-info mt-0" style="margin-top: 6px; background-color: #0081CC" :disabled="!workNoState" @click="listEmp()"> 获取</button>
                </div>
                <b-table show-empty striped hover small
                         :items="works"
                         :fields="workFields">
                  <template slot="actions" slot-scope="row">
                    <b-button size="sm" class="btn-info" @click="singleAdd(row.item)"> 增加</b-button>
                  </template>
                </b-table>
              </b-card>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'role-user-edit',
    data () {
      return {
        roleId: -1,
        role: {},
        items: [],
        fields: [
          {key: 'userNo', label: '账号', sortable: true},
          {key: 'userName', label: '姓名'},
          {key: 'deptName', label: '部门', sortable: true},
          {key: 'actions', label: '操作'}
        ],
        currentPage: 1,
        perPage: 15,
        depts: [],
        curDept: {},
        treeProps: {
          children: 'children',
          label: 'deptName'
        },
        emps: [],
        empFields: [
          {key: 'checked', label: '选择'},
          {key: 'userNo', label: '账号', sortable: true},
          {key: 'userName', label: '姓名'},
          {key: 'deptName', label: '部门', sortable: true},
          {key: 'actions', label: '操作'}
        ],
        empCurPage: 1,
        allChecked: false,
        works: [],
        workFields: [
          {key: 'userNo', label: '账号', sortable: true},
          {key: 'userName', label: '姓名'},
          {key: 'deptName', label: '部门', sortable: true},
          {key: 'actions', label: '操作'}
        ],
        workNo: ''
      }
    },
    methods: {
      getRole (roleId) {
        axios.get('/api/system/role/' + roleId)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.role = data.data
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      getRoleUser (roleId) {
        axios.get('/api/system/role/' + roleId + '/users')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.items = data.data
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      deleteRoleUser (roleId, userId) {
        axios.delete('/api/system/role/' + roleId + '/user/' + userId)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              // this.items = data.data
              this.getRoleUser(this.roleId)
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      listDept () {
        axios.get('/api/system/dept')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.depts = data.data
              console.log(this.depts)
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      handleNodeClick (data) {
        this.curDept = data
        // console.log(this.curDept)
      },
      listDeptEmp (deptId) {
        // if (this.curDept.children !== null && this.curDept.children.length > 0) {
        //   alert('请选择单元')
        //   return
        // }
        axios.get('/api/system/user/dept?deptId=' + deptId)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let empList = data.data
              for (let emp of empList) {
                emp.checked = false
              }
              this.emps = empList
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      toggleSelected () {
        this.allChecked = !this.allChecked
        let empList = []
        for (let emp of this.emps) {
          empList.push(emp)
        }
        this.emps = []
        for (let emp of empList) {
          emp.checked = this.allChecked
        }
        this.emps = empList
      },
      singleAdd (user) {
        axios.post('/api/system/role/' + this.roleId, user)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.items = data.data
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      batchAdd () {
        let users = []
        for (let emp of this.emps) {
          if (emp.checked) {
            users.push(emp)
          }
        }
        if (users.length === 0) {
          return
        }
        axios.post('/api/system/role/' + this.roleId + '/batch', users)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.items = data.data
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      listEmp () {
        axios.get('/api/system/user/search?userNo=' + this.workNo)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.works = data.data
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      }
    },
    computed: {
      totalPage () {
        return this.items.length / this.perPage
      },
      totalRows () {
        return this.items.length
      },
      empTotalPage () {
        return this.emps.length / this.perPage
      },
      empTotalRows () {
        return this.emps.length
      },
      workNoState () {
        return this.workNo.length > 2
      }
    },
    created () {
      this.roleId = +this.$route.params.id
      this.getRole(this.roleId)
      this.getRoleUser(this.roleId)
    }
  }
</script>

<style scoped>
  .el-tree.scroll-bar {
    min-height: 645px;
    overflow-y: auto;
    max-height: 645px;
  }
</style>
