<template>
  <b-card no-body>
    <div slot="header">
      流程记录
      <div class="card-actions">
        <b-btn class="btn btn-minimize"
               v-b-toggle.collapse3>
          <i class="icon-arrow-up"></i>
        </b-btn>
      </div>
    </div>
    <b-collapse id="collapse3"
                :visible='true'>
      <!-- <b-card-body id="table">
      <template>
        <el-table :stripe="true"
                  :highlight-current-row="true"
                  :data="tableData"
                  style="width: 100%"
                  >
                  <el-table-column label="#"
                    type="index"
                    width="50">
                </el-table-column>
          <el-table-column label="流程节点"
                           prop="category"
                          >
          </el-table-column>
          <el-table-column label="审核日期"
                           prop="date"
                           >
          </el-table-column>
          <el-table-column label="操作人"
                           prop="operator"
                           >
          </el-table-column>
          <el-table-column label="结果"
                           prop="suggest"
                           >
          </el-table-column>
          <el-table-column label="操作"
                           >
            <template slot-scope="scope">
              <el-button type="success"
                         size='mini'
                         @click="lookAction(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <b-row>
        <b-col sm="12"
               v-if="totalPages>1">
          <b-pagination size="md"
                        :total-rows="total"
                        v-model="curPage"
                        :per-page="pageSize"
                        :limit="5"
                        align="right"></b-pagination>
        </b-col>
      </b-row>
    </b-card-body> -->
      <b-card-body>
        <tree-table :data="showData"
                    :columns="columns"
                    :expandAll="true" />
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
// getUser
import Vuex from 'vuex'
import { getRecord, getUser, dept } from '../../services/safety_supervision'
import { formatDate } from '../../utils/index.js'
import treeTable from '@/components/TreeTable'
import bus from './bus'
export default {
  name: 'FlowRecord',
  props: {
    id: Number,
    taskId: Object,
    look: Boolean,
    status: String
  },
  data () {
    return {
      columns: [
        {
          text: '流程节点',
          value: 'category',
          width: 250
        },
        {
          text: '审核日期',
          value: 'date'
        },
        {
          text: '办理人',
          value: 'operator'
        },
        {
          text: '办理意见',
          value: 'auditComment'
        },
        {
          text: '办理结果',
          value: 'suggest'
        }
      ],
      showData: [],
      // 表格数据
      tableData: [],
      // 分页数
      totalPages: 1,
      // 总数
      total: 0,
      // 页数
      curPage: 1,
      // 每页数据
      pageSize: 15,
      form: {
        orderby: '',
        pageNum: 0,
        pageSize: 15,
        queryItems: []
      }
    }
  },
  components: {
    treeTable
  },
  methods: {
    lookAction (index, row) {
      let url = '/monitor/start/' + 2
      this.$router.push({
        path: url,
        query: {
          id: row.auditId,
          status: row.auditType
        }
      })
    },
    filerTypeHandle (data) {
      switch (data) {
        case -2:
          return '关闭流程'
        case -1:
          return '新建'
        case 0:
          return '立项审核'
        case 1:
          return '监察审计计划'
        case 2:
          return '子流程'
        case 3:
          return '监察审查结果'
        case 4:
          return '流程结束'
        default:
          return ''
      }
    },
    filerTypeHandle2 (data) {
      switch (data) {
        case 0 :
          return '子流程启动'
        case 1:
          return '组长安排'
        case 2:
          return '工作执行'
        case 3:
          return '组长审核'
        case 4:
          return '各部门确认'
        case 5:
          return '监察审查结果'
        case 6:
          return '表单填写'
        default:
          return ''
      }
    }
  },
  watch: {
    curPage (newvalue, old) {
      this.form.pageNum = newvalue - 1
      this.tableData = []
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  mounted () {
    let id = this.$route.query.id
    let taskId = this.taskId ? this.taskId.taskId : 0
    // console.log(taskId, id)
    getRecord(id, taskId).then(res => {
      // console.log(res)
      let data = res.data.data.auditDOs
      // console.log(data)
      data.map(item => {
        let name = null
        // console.log(res.data.data)
        item.category = this.filerTypeHandle(item.auditType)
        // item.date = formatDate(new Date(item.submitDate), 'yyyy-MM-dd hh:mm:ss')
        item.date = item.submitDate
        item.operator = name
        item.suggest = item.auditResult ? '通过' : '未通过'
        if (item.auditType === 2 && item.auditRole !== this.user.deptId && !this.look && this.status != '监察审查结果') {
          return false
        } else {
          this.showData.push(item)
        }
        
      })
      this.showData.map((sh, index) => {
        // if (sh.auditType === 2 && sh.auditRole !== this.user.deptId && !this.look && this.status != 3) {
        //   this.showData.splice(index, 1)
        //   index = index - 1
        //   return false
        // }
        if (sh.auditType == 1) {
          this.$sub.$emit('shenji', sh.auditUserName)
        }
        if (sh.auditType == 3) {
          bus.$emit('jieguo', {Auditor: sh.auditUserName,deptId: sh.submitUser})
        }
        if (sh.submitUser) {
          // getUser(sh.submitUser).then(user => {
          //   sh.operator = user.data.data.userName
          //   if (sh.auditType == 1) {
          //     this.$sub.$emit('shenji', sh.operator)
          //   }
          // })
          sh.operator = sh.auditUserName
        } else {
          sh.auditComment = ''
          // console.log(sh.auditRole)
          dept(sh.auditRole).then(res => {
            if (res.data.data) {
              sh.category = res.data.data[0].deptName + '子流程'
            }
          })
          if (sh.children) {
            sh.children.map(ch => {
              ch.category = this.filerTypeHandle2(ch.auditType)
              // ch.date = formatDate(new Date(ch.submitDate), 'yyyy-MM-dd hh:mm:ss')
              ch.date = ch.submitDate
              ch.suggest = ch.auditResult ? '通过' : '未通过'
              ch.auditType == 4 ? bus.$emit('queren', {deptId: sh.auditRole,name: ch.auditUserName}) : null
              if (ch.submitUser) {
                // if (ch.auditType == 1) {
                //   console.log(ch.submitUser)
                // }
                ch.auditType == 1 ? this.$sub.$emit('anpai', ch.submitUser) : null
                // getUser(ch.submitUser).then(user => {
                //   ch.operator = user.data.data.userName
                // })
                ch.operator = ch.auditUserName
              } else {
                if (ch.children) {
                  ch.children.map(ch2 => {
                    ch2.category = this.filerTypeHandle2(ch2.auditType)
                    // ch2.date = formatDate(new Date(ch2.submitDate), 'yyyy-MM-dd hh:mm:ss')
                    ch2.date = ch2.submitDate
                    ch2.suggest = ch2.auditResult ? '通过' : '未通过'
                    // getUser(ch2.submitUser).then(user => {
                    //   ch2.operator = user.data.data.userName
                    // })
                    ch2.operator = ch2.auditUserName
                  })
                }
              }
            })
          }
        }
      })
      // console.log(this.showData)
    })
  }
}
</script>
