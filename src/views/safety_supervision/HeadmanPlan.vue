<template>
  <b-card no-body>
    <div slot="header">
      组长安排
      <div class="card-actions">
          <b-btn class="btn btn-minimize"
                 v-b-toggle.collapse4>
            <i class="icon-arrow-up"></i>
          </b-btn>
        </div>
    </div>
    <b-collapse id="collapse4" :visible='true'>
    <b-card-body>
      <el-form label-width="110px"
               inline-message
                 status-icon
                 label-position="left"
                 size="medium"
               :model="Basics">
        <div class="row">
          <div class="col-lg-4 col-md-4 col-sm-12">
            <el-form-item label="组长">
              <span>{{user.userName}}</span>
            </el-form-item>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12">
             <el-form-item label="组员选择">
                <el-select
                    v-model="Basics.GroupName"
                    filterable
                    remote
                    multiple
                    :clearable='true'
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    value-key="userId">
                    <el-option
                        v-for="item in GroupList"
                        :value="item"
                        :key="item.userId"
                        :label="item.userName">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="组员选择">
              <el-select value-key="userId"
                         multiple
                         class='select'
                         v-model="Basics.GroupName"
                         :clearable='true'>
                <el-option v-for='item in GroupList'
                           :label="item.userName"
                           :value="item"
                           :key='item.userId'></el-option>
              </el-select>
            </el-form-item> -->
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12">
          <el-button type="primary"
                       size="small"
                       @click="foundAction">创建任务</el-button>
          </div>
        </div>
      </el-form>
      <div v-if="isShow">
        <div class="card-header"
             v-for="(form, index) in forms"
             :key='index'
             style="margin:40px 0 40px 0">
          <el-form label-width="110px"
                   inline-message
                    status-icon
                    label-position="left"
                    size="medium"
                   :model="form">
            <div class="row">
              <div class="col-lg-4 col-md-4 col-sm-12">
                <el-form-item label="监察部门">
                  <span>{{user.deptName}}</span>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-12">
                <el-form-item label="执行人">
                  <span>{{form.Executor}}</span>
                </el-form-item>
              </div>
              <div class="col-lg-2 col-md-2 col-sm-12">
                <el-button type="primary"
                             size="small"
                             @click="loadAction(index)">载入检查单</el-button>
              </div>
              <div class="col-lg-2 col-md-2 col-sm-12">
                <el-button type="danger"
                             size="small"
                             @click="deleteAction(index)">删除任务</el-button>
              </div>
               
            </div>
            <div class="row" style="margin:10px 0 30px 0">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="检查单所属部门">
                  <el-select value-key="deptName"
                             class='select'
                             v-model="form.department"
                             @change="optAction($event, index)"
                             :clearable='true'>
                    <el-option v-for='item in departmentList'
                               :label="item.deptName"
                               :value="item.deptId"
                               :key='item.deptId'></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="检查单项目">
                  <el-select value-key="deptName"
                             class='select'
                             v-model="form.projectName"
                             no-data-text="请选择部门"
                             :clearable='true'>
                    <el-option v-for='pro in projectList'
                               :label="pro.project"
                               :value="pro.project"
                               :key='pro.id'></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="row" v-if="form.isShow">
              <template>
                <el-table :stripe="true"
                          :highlight-current-row="true"
                          :data="form.tableData"
                          size="small"
                          style="width: 100%"
                          align="center">
                  <el-table-column label="序号"
                                   type=index
                                   align="center">
                  </el-table-column>
                  <el-table-column label="项目"
                                   prop="project"
                                   align="center">
                  </el-table-column>
                  <el-table-column label="条款号"
                                   prop="itemNo"
                                   align="center">
                  </el-table-column>
                  <el-table-column label="条款内容"
                                   prop="itemContent"
                                   align="center">
                  </el-table-column>
                  <el-table-column label="提示"
                                   prop="itemHint"
                                   align="center">
                  </el-table-column>
                  <el-table-column label="抽样数"
                                   prop="itemSampleSum"
                                   align="center">
                  </el-table-column>
                  <el-table-column label="检查方式"
                                   prop="itemCheckType2"
                                   align="center">
                  </el-table-column>
                  <el-table-column label="操作"
                       width="200">
                    <template slot-scope="scope">
                      <el-button size='mini'
                                type="danger"
                                @click="remove(index, scope.$index, scope.row)">
                        移除</el-button>
                    </template>
                </el-table-column>
                </el-table>
              </template>
            </div>
          </el-form>
        </div>
      </div>
    </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
import {conditionGetDepartmentList, getStaff, findMonitorItemByDeptId,
  findMonitorItem, findMonitorBill, TESTMODE} from '../../services/safety_supervision'
export default {
  name: 'HeadmanPlan',
  props: {
    manId: Number,
    info: Object,
    saveHan: Boolean
  },
  data () {
    return {
      loading: false,
      member: [],
      inspect: [],
      // 基本信息
      Basics: {
        GroupName: []
      },
      // 组员列表
      GroupList: [
      ],
      // 表单数据
      forms: [],
      departmentList: [
      ],
      projectList: [
      ],
      isShow: false,
      isShow2: false
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  created () {
    TESTMODE().then(res => {
      this.inspect = res
      // console.log(this.inspect)
    })
  },
  filters: {
  },
  methods: {
    // 报告人
    remoteMethod(query) {
        if (query !== '') {
            this.loading = true
            axios.get('/api/system/user/search?userNo=' + query).then(result=>{
            this.loading = false
                if(result.data&&result.data.error===0&&result.data.data){
                //   this.list =result.data.data
                  this.GroupList = result.data.data
                   
                }
            }).catch(error=>{
            this.loading = false  
            console.log(error)
            })

        } else {
            this.options4 = [];
        }
    },
    deleteAction (i) {
      this.$confirm('确定删除该任务吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.forms.splice(i, 1)
          this.$emit('dis')
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除' 
          // })
        })
    },
    unique2 (arr) {
      var hash = []
      for (var i = 0; i < arr.length; i++) {
        if (arr.indexOf(arr[i]) === i) {
          hash.push(arr[i])
        }
      }
      return hash
    },
    filterData (data) {
      switch (data) {
        case this.inspect[0].dictCode:
          return this.inspect[0].dictName
        case this.inspect[1].dictCode:
          return this.inspect[1].dictName
        case this.inspect[2].dictCode:
          return this.inspect[2].dictName
        case this.inspect[3].dictCode:
          return this.inspect[3].dictName
        default:
          return ''
      }
    },
    foundAction () {
      let bast = true
      let name = this.Basics.GroupName.map(item => {
        return item.userName
      })
      if (this.forms.length) {
        this.forms.map(n => {
          n.Executor.split(',').map(ex => {
            if (this.member.indexOf(ex) === -1) {
              // console.log(ex, this.member)
            this.member.push(ex)
            }
          })
        })
        name.forEach(na => {
          if (this.member.indexOf(na) != -1) {
            bast = false
          }
        })
      } else {
        this.member = name
      }
      if (name.length) {
        if (bast) {
          this.forms.push({
            leaderUserId: this.user.userId,
            monitorDeptId: this.user.deptId,
            leaderUserName: this.user.userName,
            billName: name.join(',') + '检查单',
            childTaskStatus: 1,
            department: '',
            projectName: '',
            Executor: name.join(','),
            isShow: false,
            tableData: [],
            teamDOs: this.Basics.GroupName.map(item => {
              return {
                monitorId: this.manId,
                teamUserId: item.userId,
                teamUserName: item.userName,
                leaderUserId: this.user.userId,
                leaderUserName: this.user.userName
              }
            })
          })
          this.$emit('dis')
          this.isShow = true
        } else {
          this.$message.error('该组员已有任务')
        }
      } else {
        this.$message.error('请选择组员')
      }
      // console.log(this.forms)
    },
    loadAction (i) {
      if (this.forms[i].department && this.forms[i].projectName) {
        let params = {
          deptId: this.forms[i].department,
          project: this.forms[i].projectName
        }
        findMonitorItem(params).then(res => {
          let data = res.data.data
          data[0].monitorId = this.manId
          data[0].monitorDeptId = this.user.deptId
          data[0].itemCheckType2 = this.filterData(data[0].itemCheckType)
          this.forms[i].tableData.push(data[0])
        })
        this.forms[i].isShow = true
        this.$emit('dis')
      } else {
        this.$message.error('请选择部门和项目')
      }
    },
    optAction (id, index) {
      // console.log(index)
      findMonitorItemByDeptId(id).then(res => {
        let data = res.data.data
        // console.log(data)
        this.projectList = data
        this.forms[index].projectName = data[0] ? data[0].project : ''
      })
    },
    saveAction () {
      return this.forms
    },
    remove (i, index, row) {
      this.forms[i].tableData.splice(index, 1)
      this.$emit('dis')
    }
  },
  watch: {
    saveHan (newval, old) {
      if (newval) {
        findMonitorBill(this.manId, this.user.deptId, this.user.userId).then(res => {
        let data = res.data.data
        // console.log(data)
        data.map(item => {
          item.department = ''
          item.projectName = ''
          item.Executor = item.billName.substring(0, item.billName.length - 3)
          item.Executor.split(',').map(ex => {
            this.member.push(ex)
          })
          item.isShow = true
          item.detailDOs.map(de => {
            de.itemCheckType2 = this.filterData(de.itemCheckType)
          })
          item.tableData = item.detailDOs
          this.forms.push(item)
          // console.log(this.forms)
        })
        this.isShow = true
      })
      }
    }
  },
  mounted () {
    conditionGetDepartmentList(1).then(result => {
      // console.log(result)
      this.departmentList = result
    })
    getStaff(this.user.deptId).then(res => {
      let data = res.data.data
      // console.log(data)
      // this.GroupList = data.filter(item => {
      //   return item.userId !== this.user.userId
      // })
    })
    let localname = '组长安排' + this.manId + this.user.userId
    if (this.saveHan) {
      // findMonitorBill(this.manId, this.user.deptId, this.user.userId).then(res => {
      //   let data = res.data.data
      //   console.log(data)
      //   data.map(item => {
      //     item.department = ''
      //     item.projectName = ''
      //     item.Executor = item.billName.substring(0, item.billName.length - 3)
      //     item.Executor.split(',').map(ex => {
      //       this.member.push(ex)
      //     })
      //     item.isShow = true
      //     item.detailDOs.map(de => {
      //       de.itemCheckType2 = this.filterData(de.itemCheckType)
      //     })
      //     item.tableData = item.detailDOs
      //     this.forms.push(item)
      //     // console.log(this.forms)
      //   })
      //   this.isShow = true
      // })
    }
  }
}
</script>
