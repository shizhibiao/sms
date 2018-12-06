<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="6">
        <b-card>
          <div slot="header">
            <strong>{{user.userName}}</strong> 已分配角色
            <button class="btn btn-info btn-sm float-right mt-0" @click="$router.back(-1)">
              <i class="fa fa-back"></i> 返回</button>
          </div>
          <!-- Main table element -->
          <b-table show-empty striped hover small
                   :items="items"
                   :fields="fields">
            <template slot="actions" slot-scope="row">
              <b-button size="sm" class="btn-danger" v-if="user.userId>1 || row.item.roleId>1" @click="deleteUserRole(row.item.roleId)">移除</b-button>
            </template>
          </b-table>
        </b-card>
      </b-col>
      <b-col sm="6">
        <b-card>
          <div slot="header">
            <strong>候选角色</strong>
            <button class="btn btn-info btn-sm float-right mt-0" @click="$router.back(-1)">
              <i class="fa fa-back"></i> 返回</button>
          </div>
          <b-table show-empty striped hover small
                   :items="roles"
                   :fields="fields">
            <template slot="actions" slot-scope="row">
              <b-button size="sm" class="btn-info" @click="singleAdd(row.item.roleId)"> 增加</b-button>
            </template>
          </b-table>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'user-role-edit',
    data () {
      return {
        userId: -1,
        user: {},
        items: [],
        fields: [
          {key: 'roleName', label: '角色名称', sortable: true},
          {key: 'roleDesc', label: '描述'},
          {key: 'actions', label: '操作'}
        ],
        roles: []
      }
    },
    methods: {
      getUser (userId) {
        axios.get('/api/system/user/' + userId)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.user = data.data
              this.items = this.user.sysRoles
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      deleteUserRole (roleId) {
        axios.delete('/api/system/role/' + roleId + '/user/' + this.userId)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.getUser(this.userId)
              // this.items = data.data
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      singleAdd (roleId) {
        axios.get('/api/system/user/' + this.userId + '/role/' + roleId)
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
      listAllRole () {
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
      }
    },
    created () {
      this.userId = +this.$route.params.id
      this.listAllRole()
      this.getUser(this.userId)
    }
  }
</script>

<style scoped>

</style>
