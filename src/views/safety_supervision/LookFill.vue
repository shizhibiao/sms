<template>
  <b-card no-body>
    <div slot="header">
      表单填写
      <div class="card-actions">
        <b-btn class="btn btn-minimize"
               v-b-toggle.collapse14>
          <i class="icon-arrow-up"></i>
        </b-btn>
      </div>
    </div>
    <b-collapse id="collapse14"
                :visible='true'>
      <b-card-body>
        <!-- <div class="row"> -->
          <el-tabs type="border-card"
                 style="margin-bottom:24px"
                 v-model="activeName">
                 <!-- @tab-click='handleTabsClick' -->
          <el-tab-pane :label="item.deptName"
                        :name="item.deptName"
                       v-for='(item,index) in rmDepartmentDOList'
                       :key='index'>
          <template>
            <el-table :stripe="true"
                      :highlight-current-row="true"
                      :data="item.tableData"
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
              <el-table-column label="组长"
                               prop="leaderUserName"
                               align="center">
              </el-table-column>
              <el-table-column label="执行人"
                               prop="billName"
                               align="center">
              </el-table-column>
              <el-table-column label="结果"
                              prop="result2"
                               align="center">
                
              </el-table-column>
            </el-table>
          </template>
          </el-tab-pane>
          </el-tabs>
        <!-- </div> -->
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import Vuex from 'vuex'
import { findMonitorBillLoad, checkResult, TESTMODE } from '../../services/safety_supervision'
export default {
  name: 'LookFill',
  props: {
    depmentlist: Array
  },
  data () {
    return {
      // tab切换
      activeName: '',
      inspect: [],
      ResultList: []
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    }),
    rmDepartmentDOList () {
      return this.depmentlist.map(item => {
        return {
          deptId: item.deptId,
          deptName: item.deptName,
          status: item.status
        }
      })
    }
  },
  watch: {
    rmDepartmentDOList (newval, old) {
      newval.forEach((item, index) => {
        item.tableData = []
        index == 0 ? this.activeName = item.deptName : null
        let obj = {
          monitorId: this.$route.query.id,
          monitorDeptId: item.deptId,
          status: 0
        }
        if (item.status >= 3) {
        findMonitorBillLoad(obj).then(res => {
          let data = res.data.data
          // console.log(data)
          if (data) {
            data.forEach(da => {
              da.detailDOs.map(de => {
                de.itemCheckType2 = this.filters(de.itemCheckType)
                let result2 = this.ResultList.find(re => {
                  return de.itemResult == re.dictCode
                })
                de.result2 = result2.dictName ? result2.dictName : ''
                de.billName = da.billName.substring(0, da.billName.length - 3)
                de.leaderUserName = da.leaderUserName
                item.tableData.push(de)
              })
            })
          }
        })}
      })
    }
  },
  methods: {
    handleTabsClick (tab, e) {
      // console.log(tab, e)
      // console.log('选项卡')
    },
    filters (data) {
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
    }
  },
  created () {
    TESTMODE().then(res => {
      this.inspect = res
    })
    checkResult().then(res => {
      this.ResultList = res
    })
  },
  mounted () {
    // let obj = {
    //   monitorId: this.manId,
    //   monitorDeptId: this.deptId
    // }
    // // console.log(obj)
    // findMonitorBillLoad(obj).then(res => {
    //   let data = res.data.data
    //   // console.log(data)
    //   data.map(item => {
    //     item.detailDOs.map(de => {
    //       de.itemCheckType2 = this.filters(de.itemCheckType)
    //       this.tableData.push(de)
    //     })
    //   })
    // })
  }
}
</script>
