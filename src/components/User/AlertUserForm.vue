<template>
    <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogFormVisible" v-model ='dialogFormVisible'>
      <el-form :model="staffForm" :rules="rules" ref="staffForm" status-icon :inline-message="true"
               size="medium" label-width="120px">
        <el-row>
          <el-col>
            <el-form-item label="工号" prop="userNo" class='item'>
              <el-input v-model="staffForm.userNo" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="loginName" class='item'>
              <el-input v-model="staffForm.loginName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="userName" class='item'>
              <el-input v-model="staffForm.userName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="部门" prop="deptIds" class='item'>
              <el-cascader :options="departmentOptions" v-model="staffForm.deptIds"
                           @change="departBlur" :show-all-levels="false"
                           class="width100"></el-cascader>
            </el-form-item>

            <el-form-item
              label="手机"
              prop="userPhone"
              class='item'
              :rules="[
                { required: true, message: '手机号不能为空', trigger: 'blur'}
              ]"
            >
              <el-input v-model="staffForm.userPhone" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item
              class='item'
              prop="userMail"
              label="邮箱"
              :rules="[
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['change', 'blur'] }
              ]"
            >
            <el-input v-model="staffForm.userMail" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="状态" prop="userValid" class='item'>
              <el-switch
                v-model="toggle"
                active-text="启用"
                inactive-text="禁用">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitData('staffForm')">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>


</template>
<script>
import axios from 'axios'
import { API } from '../../api'

export default {
  data () {
    return {
      dialogTitle: '新增角色',
      dialogFormVisible: false,
      staffForm: {
        userNo: '', // 工号
        userId: 0,
        userName: '',
        loginName: '',
        deptId: '',
        deptName: '',
        password: '123456',
        userPhone: '',
        userMail: '',
        userValid: false,
        deptIds: []
      },
      toggle: true,
      rules: {
        userNo: [
          { required: true, message: '请输入工号', trigger: ['blur', 'change'] }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: ['blur', 'change'] }
        ],
        loginName: [
          { required: true, message: '请输入登录名', trigger: ['blur', 'change'] }
        ],
        deptIds: [
          { required: true, message: '请选择部门', trigger: ['blur', 'change'] }
        ]
      },
      departmentOptions: []
    }
  },
  methods: {
    addUser () {
      this.dialogTitle = '新增账号'

      this.staffForm.userNo = ''
      this.staffForm.userId = 0
      this.staffForm.userName = ''
      this.staffForm.loginName = ''
      this.staffForm.deptName = ''
      this.staffForm.deptId = ''
      this.staffForm.password = '123456'
      this.staffForm.userPhone = ''
      this.staffForm.userMail = ''
      this.staffForm.userValid = true
      this.dialogFormVisible = true
      if (this.$refs && this.$refs.staffForm && this.$refs.staffForm.hasOwnProperty('resetFields')) {
        this.$refs.staffForm.resetFields()
      }
    },
    submitData () {
      if (this.staffForm.deptName === null || this.staffForm.deptName === '') {
        this.$message({type: 'error', message: '请选择用户部门'})
        return
      }
      console.log(this.staffForm)
      this.$refs.staffForm.validate((valid) => {
        if (valid && this.toggle) {
          if (+this.staffForm.userId === 0) {
            axios.post('/api/system/user', {...this.staffForm, userValid: this.toggle})
              .then(response => {
                let data = response.data

                if (data && data.error === 0) {
                  this.$message({type: 'success', message: '用户信息新增成功'})
                  this.dialogFormVisible = false
                  this.$parent.getData()
                }
              })
              .catch(response => {
                this.$message({type: 'error', message: '服务器或网络异常'})
              })
          }
        } else {
          axios.put('/api/system/user', {...this.staffForm, userValid: this.toggle})
            .then(response => {
              let data = response.data

              if (data && data.error === 0) {
                this.$message({type: 'success', message: '用户信息修改成功'})
                this.dialogFormVisible = false
                this.$parent.getData()
              }
            })
            .catch(response => {
              this.$message({type: 'error', message: '服务器或网络异常'})
            })
        }
      })
    },
    modifiyHandle (userId) {
      this.dialogTitle = '编辑用户'
      if (this.$refs && this.$refs.staffForm && this.$refs.staffForm.hasOwnProperty('resetFields')) {
        this.$refs.staffForm.resetFields()
      }
      axios.get('/api/system/user/' + userId)
        .then(response => {
          let data = response.data
          if (data && data.error === 0) {
            this.staffForm = data.data
            this.staffForm.deptIds = []
            this.toggle = this.staffForm.userValid

            if (this.departmentOptions && this.departmentOptions.length > 0) {
              axios.get('/api/system/dept/parents?deptId=' + this.staffForm.deptId)
                .then(response => {
                  let data = response.data
                  if (data && data.error === 0) {
                    for (let obj of data.data) {
                      this.staffForm.deptIds.push(obj)
                    }
                    // this.staffForm.deptIds = data.data
                    console.log(this.staffForm.deptIds)
                  }
                })
            } else {
              console.log('this.departmentOptions null')
            }

            this.dialogFormVisible = true
          }
        })
    },
    getDepartmentList () {
      axios.get(`${API.DEPARTMENT_LIST}`)
        .then((response) => {
          let data = response.data.data
          let newData = data.map(item => {
            return {
              label: item.deptName,
              value: item.deptId,
              children: item.children ? item.children.map(cItem => {
                return {
                  value: cItem.deptId,
                  label: cItem.deptName,
                  children: cItem.children ? cItem.children.map(children => {
                    return {
                      value: children.deptId,
                      label: children.deptName
                    }
                  }) : null
                }
              }) : null
            }
          })
          this.departmentOptions = newData
          if (this.staffForm.deptId > 0) {
            axios.get('/api/system/dept/parents?deptId=' + this.staffForm.deptId)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                  this.staffForm.deptIds = data.data
                }
              })
          } else {
            console.log('this.staffForm.deptId===0')
          }
        })
        .catch((error) => { console.log(error) })
    },
    departBlur (value) {
      console.log(this.staffForm.deptIds)
      let objs = this.getCascaderObj(value, this.departmentOptions)
      let label = objs[objs.length - 1].label
      let val = objs[objs.length - 1].value
      this.staffForm.deptName = label
      this.staffForm.deptId = val
      console.log(this.staffForm)
    },
    getCascaderObj (val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.value === value) {
            opt = itm.children
            return itm
          }
        }
        return null
      })
    }
  },
  created () {
    this.getDepartmentList()
  }
}
</script>
<style scoped>
.width100{
  width:100%;
}
.item{
    width:50%
}
.item:nth-child(odd){
    float:left;
}
.item:nth-child(even){
    float:right;
}

</style>
