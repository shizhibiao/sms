<template>
  <b-card no-body>
    <div slot="header">
      组长安排
      <div class="card-actions">
        <b-btn class="btn btn-minimize"
               v-b-toggle.collapse13>
          <i class="icon-arrow-up"></i>
        </b-btn>
      </div>
    </div>
    <b-collapse id="collapse13"
                :visible='true'>
      <b-card-body>
        <el-tabs type="border-card"
                 style="margin-bottom:24px"
                 v-model="activeName">
                 <!-- >   @tab-click='handleTabsClick' -->
          <el-tab-pane :label="item.deptName"
                        :name="item.deptName"
                       v-for='(item,index) in rmDepartmentDOList'
                       :key='index'>
            <template>
              <el-card>
                <el-table :stripe="true"
                          :highlight-current-row="true"
                          size="small"
                          :data="item.tableData"
                          style="width: 100%">
                          <!-- @expand-change='handleUnfold' -->
                          <!-- 内部表 -->
                          <el-table-column type="expand">
                                <template slot-scope="props">
                                    <el-card id="elcard">
                                        <el-table size="mini"
                                            :data="props.row.internal"
                                            style="width: 100%"
                                            >
                                            <el-table-column label="序号"
                                                            type=index
                                                            width="100%"
                                                            align="center"
                                                            >
                                            </el-table-column>
                                            <el-table-column
                                            label="项目"
                                            align="center">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{ scope.row.project }}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                            label="条款号"
                                            align="center">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{ scope.row.itemNo}}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                            label="条款内容"
                                            align="center">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{scope.row.itemContent}}
                                                    </div>

                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                            label="提示"
                                            align="center">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{scope.row.itemHint}}
                                                    </div>

                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                            label="抽样数"
                                            align="center">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{scope.row.itemSampleSum}}
                                                    </div>

                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                            align="center"
                                            label="检查方式">
                                                <template slot-scope="scope">
                                                    <div slot="reference" class="gist-wrapper">
                                                        {{scope.row.itemCheckType2}}
                                                    </div>

                                                </template>
                                            </el-table-column>
                                    </el-table>
                                    </el-card>
                                </template>
                            </el-table-column>
                  <el-table-column 
                                   label="监察部门">
                    <template slot-scope="scope">
                      <div slot="reference"
                           class="gist-wrapper">
                        {{ scope.row.department}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="组长">
                    <template slot-scope="scope">
                      <div slot="reference"
                           class="gist-wrapper">
                        {{ scope.row.leaderUserName}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="指定组员">
                    <template slot-scope="scope">
                      <div slot="reference"
                           class="gist-wrapper">
                        {{ scope.row.billName.substring(0, scope.row.billName.length - 3)}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="检查单">
                    <template slot-scope="scope">
                      <div slot="reference"
                           class="gist-wrapper">
                        {{ scope.row.billName}}
                      </div>

                    </template>
                  </el-table-column>
                  <el-table-column label="流程状态">
                    <template slot-scope="scope">
                      <div slot="reference"
                           class="gist-wrapper">
                        组长安排
                      </div>

                    </template>
                  </el-table-column>
                </el-table>
              </el-card>

            </template>
          </el-tab-pane>
        </el-tabs>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import Vuex from 'vuex'
import { findMonitorBill, findByIdForHandMan, TESTMODE } from '../../services/safety_supervision'
export default {
  name: 'LookHeadman',
  props: ['depmentlist', 'operator', 'status'],
  data () {
    return {
      operator2: 0,
      // tab切换
      activeName: '',
      inspect: [],
    }
  },
  created () {
    TESTMODE().then(res => {
      this.inspect = res
    })
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
  methods: {
    handleUnfold (row, expandedRows) {
        // console.log('内部表')
    },
    handleTabsClick (tab, e) {
      // console.log(tab, e)
      // console.log('选项卡')
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
    }
  },
  watch: {
    operator (newval, old) {
    },  
    depmentlist (newval, old) {
      // console.log(newval)
    },
    rmDepartmentDOList (newval, old) {
      newval.forEach((item, index) => {
        item.tableData = []
        index == 0 ? this.activeName = item.deptName : null
        let querySave = {
              deptId: item.deptId,
              id: this.$route.query.id
            }
        findByIdForHandMan(querySave).then(res => {
          let data = res.data.data ? res.data.data : {}
          if (data.handManUserId && item.status >= 2) {
            // console.log(item.status)
            findMonitorBill(this.$route.query.id, item.deptId, data.handManUserId).then(res2 => {
              let tab = res2.data.data
              // console.log(tab)
              if (tab) {
                tab.forEach(ta => {
                  ta.internal = ta.detailDOs
                  ta.department = item.deptName
                  ta.internal.forEach(int => {
                    int.itemCheckType2 = this.filterData(int.itemCheckType)
                  })
                  item.tableData.push(ta)
                })
              }
            })
          }
        })
        
      });
    }
  },
  mounted () {
  }
}
</script>
