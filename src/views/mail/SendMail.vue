<template>
  <div class="animated fadeIn">
    <div class="email-app">
      <main>
        <form class="mt-2">
          <div class="form-row mb-3">
            <label class="col-2 col-sm-1 col-form-label">收件人:</label>
            <b-col cols="12" sm="11">
              <b-input-group> 
                <b-form-input id="to" class="form-control" v-model="mail.toUser" placeholder="收件人,多个用分号';'隔开" required></b-form-input>
                <div class="input-group-append" >
                  <b-btn variant="default" @click="selectSender(1)"> 选择 ... </b-btn>
                </div>
              </b-input-group>
            </b-col>
          </div>
          <div class="form-row mb-3">
            <label class="col-2 col-sm-1 col-form-label">抄送:</label>
            <b-col cols="12" sm="11">
              <b-input-group>
                <b-form-input id="cc" class="form-control" v-model="mail.ccUser" placeholder="抄送人,多个用分号';'隔开" required></b-form-input>
                <div class="input-group-append">
                  <b-btn variant="default" @click="selectSender(2)"> 选择 ... </b-btn>
                </div>
              </b-input-group>
            </b-col>
          </div>
          <div class="form-row mb-3">
            <label for="topic" class="col-2 col-sm-1 col-form-label">主题:</label>
            <b-col cols="12" sm="11">
              <input type="text" class="form-control" id="topic" v-model="mail.topic" placeholder="请输入邮件主题" required>
            </b-col>
          </div>
          <div class="form-row mb-3">
            <label for="content" class="col-2 col-sm-1 col-form-label">内容:</label>
            <b-col cols="12" sm="11">
              <quill-editor id="content" :content="content" style="min-height: 300px"></quill-editor>
            </b-col>
          </div>
        </form>
        <b-row>
          <b-col sm="11" class="ml-auto">
            <div class="form-group">
              <b-button type="submit" @click="sendMail()" variant="success">发送</b-button>
              <b-button type="submit" @click="$router.back(-1)" variant="danger">放弃</b-button>
            </div>
          </b-col>
        </b-row>
      </main>
    </div>
    <el-dialog @close='closeDialog' :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="按部门筛选" name="first">
          <div class="animated fadeIn">
            <b-row>
              <b-col sm="4">
                <b-card>
                  <div slot="header">
                    <strong>已选抄送人</strong>
                    <button class="btn btn-info btn-sm float-right mt-0" @click="getMailPoeple">
                      <i class="fa fa-back"></i>确认</button>
                  </div>
                  <!-- Main table element -->
                  <b-table show-empty striped hover small
                           :items="items"
                           :fields="fields"
                           :current-page="currentPage"
                           :per-page="perPage">
                    <template slot="actions" slot-scope="row">
                      <b-button size="sm" class="btn-danger" v-if="row.item.userId >=1"
                                @click="deleteRoleUser(row.item.userId)"> 移除</b-button>
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
                  </div>
                  <b-tabs>
                    <b-tab title="筛选用户" active>
                      <b-row>
                        <b-col md="6">
                          <b-card>
                            <div slot="header">
                              <button class="btn btn-info btn-sm float-right mt-0" @click="listDept()">
                                <i class="fa fa-refresh"></i> 获取部门</button>
                            </div>
                            <el-tree :data="depts" node-key="deptId" @node-click="handleNodeClick"
                                     :default-expanded-keys="['CFCD208495D565EF66E7DFF9F98764DA']"
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
                  </b-tabs>
                </b-card>
              </b-col>
            </b-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="按角色筛选" name="second">
          <div class="animated fadeIn">
            <b-row>
              <b-col sm="4">
                <b-card>
                  <div slot="header">
                    <strong>已选抄送人</strong>
                    <button class="btn btn-info btn-sm float-right mt-0" @click="getMailPoeple">
                      <i class="fa fa-back"></i>确认</button>
                  </div>
                  <!-- Main table element -->
                  <b-table show-empty striped hover small
                           :items="items"
                           :fields="fields"
                           :current-page="currentPage"
                           :per-page="perPage">
                    <template slot="actions" slot-scope="row">
                      <b-button size="sm" class="btn-danger" v-if="row.item.userId>=1"
                                @click="deleteRoleUser(row.item.userId)"> 移除</b-button>
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
                  </div>
                  <b-tabs>
                    <b-tab title="筛选用户" active>
                      <b-row>
                        <b-col md="6">
                          <b-card>
                              <div slot="header">
                                <button class="btn btn-info btn-sm float-right mt-0" @click="listRole()">
                                  <i class="fa fa-refresh"></i> 获取角色组</button>
                              </div>
                            <b-table show-empty striped hover small
                                     :items="roles"
                                     :fields="roleFields">
                              <template slot="HEAD_checked" slot-scope="data">
                                <input type="checkbox" @click.stop="toggleSelected3" v-model="allChecked3">
                              </template>
                              <template slot="checked" slot-scope="row">
                                <input type="checkbox" @click.native.stop v-model="row.item.checked">
                              </template>
                              <template slot="actions" slot-scope="row">
                                <b-button size="sm" class="btn-info" @click="singleAdd(row.item)"> 增加</b-button>
                              </template>
                            </b-table>

                          </b-card>
                        </b-col>
                        <b-col md="6">
                          <b-card>
                            <div slot="header">
                              <button class="btn btn-info btn-sm mt-0" @click="roleList()">
                                <i class="fa fa-refresh"></i> 获取角色组员工</button>
                              <button class="btn btn-info btn-sm float-right mt-0" @click="batchAdd2()">
                                <i class="fa fa-plus"></i> 批量增加</button>
                            </div>
                            <b-table show-empty striped hover small
                                     :items="emps2"
                                     :fields="empFields2"
                                     :current-page="empCurPage2"
                                     :per-page="perPage2">
                              <template slot="HEAD_checked" slot-scope="data">
                                <input type="checkbox" @click.stop="toggleSelected2" v-model="allChecked2">
                              </template>
                              <template slot="checked" slot-scope="row">
                                <input type="checkbox" @click.native.stop v-model="row.item.checked">
                              </template>
                              <template slot="actions" slot-scope="row">
                                <b-button size="sm" class="btn-info" @click="singleAdd(row.item)"> 增加</b-button>
                              </template>
                            </b-table>

                            <b-row>
                              <b-col md="12" class="my-1" v-if="empTotalPage2>1">
                                <b-pagination :total-rows="empTotalRows2" :per-page="perPage2" v-model="empCurPage2" class="my-0" />
                              </b-col>
                            </b-row>
                          </b-card>
                        </b-col>
                      </b-row>
                    </b-tab>
                  </b-tabs>
                </b-card>
              </b-col>
            </b-row>
          </div>
        </el-tab-pane>
      </el-tabs>

    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import Vue from 'vue'
  import VueQuillEditor from 'vue-quill-editor'

  // require styles
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  // mount with global
  Vue.use(VueQuillEditor)

  export default {
    name: 'send-mail',
    data () {
      return {
        activeName: "first",
        mail: {},
        type: 0,
        id: 0,
        roles: [],
        selectRoleName: [],
        emps: [],
        emps2: [],
        content: '',
        curDept: {},
        items: [],
        depts: [],
        toUsers: [],
        ccUsers: [],
        fields: [
          {key: 'loginName', label: '账号', sortable: true},
          {key: 'userName', label: '姓名'},
          {key: 'userMail', label: 'E-Mail'},
          {key: 'actions', label: '操作'}
        ],
        allChecked: false,
        allChecked2: false,
        allChecked3: false,
        treeProps: {
          children: 'children',
          label: 'deptName'
        },
        perPage: 12,
        perPage2: 12,
        empCurPage: 1,
        currentPage: 1,
        empCurPage2: 1,
        currentPage2: 1,
        roleFields: [
          {key: 'checked', label: '选择'},
          {key: 'roleName', label: '角色组', sortable: true},
        ],
        empFields: [
          {key: 'checked', label: '选择'},
          {key: 'loginName', label: '账号', sortable: true},
          {key: 'userName', label: '姓名'},
          {key: 'deptName', label: '部门', sortable: true},
          {key: 'userMail', label: 'E-Mail'},
          {key: 'actions', label: '操作'}
        ],
        empFields2: [
          {key: 'checked', label: '选择'},
          {key: 'loginName', label: '账号', sortable: true},
          {key: 'userName', label: '姓名'},
          {key: 'userMail', label: 'E-Mail'},
          {key: 'actions', label: '操作'}
        ],
        dialogTitle: '',
        dialogFormVisible: false,
        selectType: 0
      }
    },
    methods: {
      getContent () {
        axios.get('/api/mail/content?type=' + this.type + '&id=' + this.id)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.mail = data.data
              this.content = this.mail.content
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      selectSender (type) {
        this.activeName = 'first'
        this.selectType = type
        if (type === 1) {
          if (this.mail.toUser != null && this.mail.toUser != '') {
            let mails = this.mail.toUser.split(';')
            console.log('==' + mails)
            let UUsers = [];
            for (var i = 0; i < this.toUsers.length; i++) {
              for (var j = 0; j < mails.length; j++) {
                if (this.toUsers[i].userMail=== mails[j]) {
                  UUsers.push(this.toUsers[i])
                  break
                }
              }
            }
            this.toUsers = UUsers
          }
          this.items = this.toUsers
          this.dialogTitle = '选择收件人'
          this.dialogFormVisible = true
        } else {
          this.items = this.ccUsers
          this.dialogTitle = '选择抄送人'
          this.dialogFormVisible = true
        }
      },
      listDept () {
        axios.get('/api/system/dept')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.depts = data.data
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      roleList () {
        this.allChecked2 = false
        this.getSelectRoles()
        if (this.selectRoleName === null || this.selectRoleName.length === 0) {
          alert('请选择角色组')
          return
        }
        let roleString = ''
        for (var i = 0; i < this.selectRoleName.length; i++) {
          roleString += this.selectRoleName[i] + ','
        }
        axios.get('/api/system/role/roles?roleString=' + roleString.slice(0, roleString.length - 1))
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let empList = data.data
              for (let emp of empList) {
                emp.checked = false
              }
              this.emps2 = empList
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      deleteRoleUser (userId) {
        for (var i = 0; i < this.items.length; i++) {
          if (this.items[i].userId === userId) {
            this.items.splice(i, 1)
          }
        }
      },
      handleNodeClick (data) {
        this.curDept = data
      },
      getMailPoeple () {
          if (this.mail.toUser === null) {
            this.mail.toUser = ''
          }
          if (this.mail.ccUser === null) {
            this.mail.ccUser = ''
          }
        if (this.selectType === 1) {
            for (var i = 0; i < this.items.length; i++) {
               if (this.toUsers.indexOf(this.items[i]) < 0) {
                 this.toUsers.push(this.items[i])
               }
            }
            // this.toUsers = this.toUsers.concat(this.items)
          this.mail.toUser = ''
        } else if (this.selectType === 2) {
            this.mail.ccUser = ''
          for (var i = 0; i < this.items.length; i++) {
            if (this.ccUsers.indexOf(this.items[i]) < 0) {
              this.ccUsers.push(this.items[i])
            }
          }
            // this.ccUsers = this.ccUsers.concat(this.items)
        }
        for (var i = 0; i < this.items.length; i++) {
          if (this.selectType === 1) {
            for (var i = 0; i < this.items.length; i++) {
              this.mail.toUser += this.items[i].userMail + ';'
            }
          } else if (this.selectType === 2) {
            for (var i = 0; i < this.items.length; i++) {
              this.mail.ccUser += this.items[i].userMail + ';'
            }
          }
        }
        this.dialogFormVisible = false
        this.closeDialog()
      },
      listDeptEmp (deptId) {
        this.allChecked = false
       
        if (!this.curDept.children) {
          alert('请选择单元')
          return
        }
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
      toggleSelected2 () {
        this.allChecked2 = !this.allChecked2
        let empList = []
        for (let emp of this.emps2) {
          empList.push(emp)
        }
        this.emps2 = []
        for (let emp of empList) {
          emp.checked = this.allChecked2
        }
        this.emps2 = empList
      },
      toggleSelected3 () {
        this.allChecked3 = !this.allChecked3
        let roleList = []
        for (let role of this.roles) {
          roleList.push(role)
        }
        this.roles = []
        for (let role of roleList) {
          role.checked = this.allChecked3
        }
        this.roles = roleList
      },
      closeDialog () {
        this.depts = []
        this.curDept = {}
        this.emps = []
        this.emps2 = []
        this.items = []
        this.roles = []
        this.allChecked = false
        this.allChecked2 = false
        this.allChecked3 = false
      },
      listRole () {
        this.allChecked3 = false
        axios.get('/api/system/role/all')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.roles = data.data
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      singleAdd (user) {
        if (user.userMail && user.userMail.length > 0) {
          if (this.items !== null && this.items.length > 0) {
            for (var i = 0; i < this.items.length; i++) {
              if (this.items[i].userId === user.userId) {
                alert('该用户已被添加')
                break
              }
              if (i === this.items.length - 1 && this.items[i].userId !== user.userId ) {
                this.items.push(user)
                break
              }
            }
          } else {
            this.items.push(user)
          }
        } else {
          user.checked = false
          alert('该用户不能发送邮件！')
        }
        user.checked = false
      },
      getSelectRoles () {
        let roles = []
        for (let role of this.roles) {
          if (role.checked) {
            roles.push(role.roleId)
          }
        }
        if (roles.length === 0) {
          alert('请选择角色组！')
          return
        } else {
        this.selectRoleName = roles
        }
      },
      batchAdd () {
        let users = []
        for (let emp of this.emps) {
          if (emp.checked && emp.userMail && emp.userMail.length > 0) {
            users.push(emp)
          }
        }
        if (users.length === 0) {
          alert('请选择要添加的用户！')
          return
        } else {
          if (this.items !== null && this.items.length > 0) {
            out:
              for (var i = 0; i < users.length; i++) {
                for (var j = 0; j < this.items.length; j++) {
                  if (users[i].userId === this.items[j].userId) {
                    // alert('存在已添加用户，添加失败')
                    // break out
                    continue;
                  }
                  if (i === users.length - 1 && j === this.items.length - 1 && users[i].userId !== this.items[j].userId) {
                    this.items = this.items.concat(users)
                    break out
                  }
                }
              }
          } else {
            this.items = this.items.concat(users)
          }
        }
        for (let emp of this.emps) {
          if (emp.checked) {
              emp.checked = false
          }
        }
        this.allChecked = false
      },
      batchAdd2 () {
        let users = []
        for (let emp of this.emps2) {
          if (emp.checked && emp.userMail && emp.userMail.length > 0) {
            users.push(emp)
          }
        }
        if (users.length === 0) {
          alert('请选择要添加的用户！')
          return
        } else {
          if (this.items !== null && this.items.length > 0) {
            out:
              for (var i = 0; i < users.length; i++) {
                for (var j = 0; j < this.items.length; j++) {
                  if (users[i].userId === this.items[j].userId) {
                    // alert('存在已添加用户，添加失败')
                    // break out
                    continue;
                  }
                  if (i === users.length - 1 && j === this.items.length - 1 && users[i].userId !== this.items[j].userId) {
                    this.items = this.items.concat(users)
                    break out
                  }
                }
              }
          } else {
            this.items = this.items.concat(users)
          }
        }
        for (let emp of this.emps2) {
          if (emp.checked) {
            emp.checked = false
          }
        }
        this.allChecked2 = false
      },
      sendMail () {
        if (this.mail.toUser === null || this.mail.toUser.length === 0) {
          this.$message.error('请选择或输入收件人地址')
          return
        }
        if (this.mail.topic === null || this.mail.topic.length === 0) {
          this.$message.error('请输入邮件主题')
          return
        }
        if (this.content === null || this.content.length === 0) {
          this.$message.error('请输入邮件内容')
          return
        }
        this.mail.content = this.content
        axios.post('/api/mail/send', this.mail)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.$router.back(-1)
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      }
    },
    watch: {
    },
    computed: {
      totalPage () {
        return this.items.length / this.perPage
      },
      totalRows () {
        return this.items.length
      },
      user () {
        return this.$store.state.user
      },
      empTotalPage () {
        return this.emps.length / this.perPage
      },
      empTotalRows () {
        return this.emps.length
      },
      empTotalPage2 () {
        return this.emps2.length / this.perPage2
      },
      empTotalRows2 () {
        return this.emps2.length
      }
    },
    created () {
      this.type = +this.$route.params.type
      this.id = +this.$route.params.id
      this.getContent()
    }
  }
</script>

<style scoped>
  >>> .el-dialog {
    width:1500px !important;
  }
  .el-tree >>> .scroll-bar {
    min-height: 535px;
    overflow-y: auto;
    max-height: 535px;
  }
</style>
