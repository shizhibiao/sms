<template>
  <b-card no-body>
    <div slot="header">
      各部门确认
      <div class="card-actions">
        <b-btn class="btn btn-minimize"
               v-b-toggle.collapse26>
          <i class="icon-arrow-up"></i>
        </b-btn>
      </div>
    </div>
    <b-collapse id="collapse26"
                :visible='true'>
      <b-card-body>
        <el-tabs type="border-card"
                 style="margin-bottom:24px"
                 v-model="activeName">
          <el-tab-pane :label="item.deptName"
                       :name="item.deptName"
                       v-for='(item,index) in rmDepartmentDOList2'
                       :key='index'>
            <el-form label-width="110px"
                     inline-message
                     label-position="left"
                     size="medium"
                     :model="item.form">
              <div class="row">
                <div class="col-lg-4 col-md-6 col-sm-12">
                  <el-form-item label="部门">
                    <span>{{item.form.deptName}}</span>
                  </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                  <el-form-item label="部门负责人">
                    <span>{{item.form.operator2}}</span>
                  </el-form-item>
                </div>
              </div>
              <div class="row hr">
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
                    <el-table-column label="结果"
                                     prop="itemResult2"
                                     align="center">
                    </el-table-column>
                  </el-table>
                </template>
              </div>
              <div class="row hr">
                <div class="col-lg-3 col-md-3 col-sm-3">
                  <el-form-item label="符合">
                    <span>{{item.quantity.suggestItems}}</span>
                  </el-form-item>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-3">
                  <el-form-item label="不符合">
                    <span>{{item.quantity.observationItems}}</span>
                  </el-form-item>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-3">
                  <el-form-item label="未检查">
                    <span>{{item.quantity.seriousFails}}</span>
                  </el-form-item>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-3">
                  <el-form-item label="不适用">
                    <span>{{item.quantity.commonFails}}</span>
                  </el-form-item>
                </div>
              </div>
              <div class="row hr">
                <div class="col-lg-8 col-md-6 col-sm-12">
                  <el-form-item label="意见">
                    <el-input type="textarea"
                              :rows="4"
                              disabled
                              style="width:100%;"
                              v-model="item.form.textarea">
                    </el-input>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import Vuex from 'vuex'
import bus from './bus'
import { findDepartmentConfirm, getRecord, TESTMODE, checkResult } from '../../services/safety_supervision'
export default {
  name: 'LookConfirm',
  props: {
    manId: Number,
    depmentlist: Array
  },
  data () {
    return {
      rmDepartmentDOList2: [],
      activeName: '',
      quantity: {
        suggestItems: '',
        observationItems: '',
        commonFails: '',
        seriousFails: ''
      },
      resultList: [],
      inspect: [],
      form: {
        textarea: ''
      },
      tableData: [],
      operator2: ''
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
    },
    operator () {
      return bus.queren
    }
  },
  created () {
    TESTMODE().then(res => {
      this.inspect = res
      // console.log(this.inspect)
    })
    checkResult().then(res => {
      this.resultList = res
    })
  },
  methods: {
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
  watch: {
    operator (newval) {
      this.$nextTick(() => {
        this.rmDepartmentDOList2.forEach(item => {
          item.deptId == newval.deptId ? item.form.operator = newval.name : null
        })
      })
    },
    rmDepartmentDOList (newval, old) {
      newval.forEach((item, index) => {
        item.tableData = []
        index == 0 ? this.activeName = item.deptName : null
        item.quantity = {
          suggestItems: '',
          observationItems: '',
          commonFails: '',
          seriousFails: ''
        }
        item.form = {
          textarea: '',
          operator: ''
        }
        if (item.status >= 5) {

          findDepartmentConfirm(this.$route.query.id, item.deptId).then(res => {
            // console.log(res)
            let data = res.data.data
            // console.log(data)
            item.form.textarea = data.confirmContent
            item.quantity = {
              suggestItems: data.suggestItems,
              observationItems: data.observationItems,
              commonFails: data.commonFails,
              seriousFails: data.seriousFails
            }
            item.form.deptName = item.deptName
            getRecord(this.$route.query.id, 0).then(res2 => {
              // console.log(res2)
              let datag = res2.data.data.auditDOs
              datag.forEach(itemg => {
                if (itemg.children) {
                  itemg.children.forEach(ch => {
                    ch.auditType == 4 && itemg.auditRole == item.deptId ? item.form.operator2 = ch.auditUserName : null
                  })
                }
              })
              data.billDOs.map(bi => {
                // console.log(item.detailDOs)
                bi.detailDOs.map(de => {
                  de.itemCheckType2 = this.filters(de.itemCheckType)
                  de.itemResult2 = this.resultList.filter(res => {
                    return de.itemResult === res.dictCode
                  })[0].dictName
                  item.tableData.push(de)
                })
              })
              this.rmDepartmentDOList2.push(item)
            })
            // data.billDOs.map(bi => {
            //   // console.log(item.detailDOs)
            //   bi.detailDOs.map(de => {
            //     de.itemCheckType2 = this.filters(de.itemCheckType)
            //     de.itemResult2 = this.resultList.filter(res => {
            //       return de.itemResult === res.dictCode
            //     })[0].dictName
            //     item.tableData.push(de)
            //   })
            // })
          })
        } else {
          this.rmDepartmentDOList2.push(item)
        }
        // this.rmDepartmentDOList2.push(item)
      })
    }
  },
  mounted () {
    // this.$sub.$on('queren', (operator) => {
    //   this.operator = operator
    //   if (this.rmDepartmentDOList2.length) {
    //     this.rmDepartmentDOList2.forEach(item => {
    //       item.deptId == operator.deptId ? item.form.operator = operator.name : null
    //     })
    //   }
    // })
    // findDepartmentConfirm(this.$route.query.id, this.deptId).then(res => {
    //   // console.log(res)
    //   let data = res.data.data
    //   console.log(data)
    //   this.form.textarea = data.confirmContent
    //   this.quantity = {
    //     suggestItems: data.suggestItems,
    //     observationItems: data.observationItems,
    //     commonFails: data.commonFails,
    //     seriousFails: data.seriousFails
    //   }
    //   data.billDOs.map(item => {
    //     // console.log(item.detailDOs)
    //     item.detailDOs.map(de => {
    //       de.itemCheckType2 = this.filters(de.itemCheckType)
    //       de.itemResult2 = this.resultList.filter(res => {
    //         return de.itemResult === res.dictCode
    //       })[0].dictName
    //       this.tableData.push(de)
    //     })
    //   })
    // })
  }
}
</script>

<style>
</style>

