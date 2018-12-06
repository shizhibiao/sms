<template>
  <b-card no-body>
    <div slot="header">
      监察审计计划
      <div class="card-actions">
        <b-btn class="btn btn-minimize"
               v-b-toggle.collapse12>
          <i class="icon-arrow-up"></i>
        </b-btn>
      </div>
    </div>
    <b-collapse id="collapse12"
                :visible='true'>
      <b-card-body>
        <div class="row">
          <template>
            <el-table :stripe="true"
                      :highlight-current-row="true"
                      :data="tableData"
                      size="small"
                      style="width: 100%"
                      align="center">
              <el-table-column label="被监察部门"
                               prop="division"
                               >
              </el-table-column>
              <el-table-column label="指定组长"
                               prop="leader"
                               >
              </el-table-column>
              <el-table-column label="计划指定人"
                               prop="Nominee"
                               >
              </el-table-column>
              <el-table-column label="流程状态"
                               prop="status2"
                               >
              </el-table-column>
            </el-table>
          </template>
        </div>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import Vuex from 'vuex'
import { findSupervisionAuditPlan } from '../../services/safety_supervision'
export default {
  name: 'LookAudit',
  // props: {
  //   operator: String
  // },
  data () {
    return {
      operator: '',
      tableData: [],
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  methods: {
  },
  created () {
  },
  watch: {
    operator (newval, old) {
      // console.log(1111)
      this.tableData.forEach(item => {
        item.Nominee = newval
      })
    }
  },
  mounted () {
    this.$sub.$on('shenji', (operator) => {
      this.operator = operator
    })
    findSupervisionAuditPlan(this.$route.query.id).then(res => {
      let data = res.data.data
      // console.log(data)
      data.forEach(item => {
        let bast = false
        if (item.status >= 1) {
          item.division = item.deptName
          item.leader = item.handManName
          item.Nominee = this.operator ? this.operator : ''
          item.status2 = '监察审计计划'
          this.tableData.forEach(tab => {
            tab.deptId == item.deptId ? bast = true : null
          })
          !bast ? this.tableData.push(item) : null
        }
      })
    })
  }
}
</script>
