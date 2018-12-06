<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="6">
        <b-card>
          <div slot="header">
            角色权限列表
            <button class="btn btn-info btn-sm float-right mt-0" @click="save()">
              <i class="fa fa-back"></i> 保存</button>
            <button class="btn btn-info btn-sm float-right mt-0" @click="$router.back(-1)">
              <i class="fa fa-back"></i> 返回</button>
          </div>
          <el-tree :data="functions"
                   show-checkbox
                   node-key="funcId"
                   :default-checked-keys="checkedIds"
                   :default-expanded-keys="expandIds"
                   ref="myTree"
                   :props="props">
          </el-tree>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'role-rights-view',
    data () {
      return {
        roleId: -1,
        functions: [],
        checkedIds: [],
        expandIds: [],
        props: {
          label: 'funcName',
          children: 'children'
        }
      }
    },
    methods: {
      getRoleUser (roleId) {
        axios.get('/api/system/role/' + roleId + '/func')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let map = data.data
              this.dealFunc(map)
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      dealFunc (map) {
        let all = map.all
        let cur = map.cur
        let cache = {}
        let list = []
        for (let func of all) {
          // console.log(func)
          // func.disabled = true
          if (+func.parentId === 0) {
            list.push(func)
            cache[func.funcId.toString()] = func
          } else {
            let parent = cache[func.parentId.toString()]
            if (parent) {
              parent.children.push(func)
              cache[func.funcId.toString()] = func
            } else {
              list.push(func)
              cache[func.funcId.toString()] = func
            }
          }
          this.expandIds.push(func.funcId)
        }

        for (let obj of cur) {
          // console.log(obj)
          this.checkedIds.push(obj.funcId)
        }

        this.functions = list
      },
      save () {
        let funcList = this.$refs.myTree.getCheckedNodes(false)
        console.log(funcList)
        axios.post('/api/system/role/' + this.roleId + '/editRight', funcList)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              alert('保存成功')
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
      this.roleId = +this.$route.params.id
      console.log(this.roleId)
      this.getRoleUser(this.roleId)
    }
  }
</script>

<style scoped>

</style>


