<template>
  <b-card no-body>
    <div slot="header">
      组长审核
      <div class="card-actions">
        <b-btn class="btn btn-minimize"
               v-b-toggle.collapse6>
          <i class="icon-arrow-up"></i>
        </b-btn>
      </div>
    </div>
    <b-collapse id="collapse6"
                :visible='true'>
      <b-card-body>
        <el-tabs type="border-card"
                 style="margin-bottom:24px"
                 v-model="activeName"
                 >
          <el-tab-pane :label="item.deptName"
                       :name="item.deptName"
                       v-for='(item,index) in rmDepartmentDOList2'
                       :key='index'>
            <el-form label-width="110px"
                     inline-message
                     status-icon
                     label-position="left"
                     size="medium"
                     :model="item.form">
              <div class="row">
                <div class="col-lg-4 col-md-6 col-sm-12">
                  <el-form-item label="检查单选择">
                    <el-select class='select'
                               @change="nameAction(index, $event)"
                               v-model="item.form.bill"
                               :clearable='true'>
                      <el-option v-for='bi in item.billList'
                                 :label="bi.label"
                                 :value="bi.value"
                                 :key='bi.value'></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-lg-5 col-md-6 col-sm-12 ml-auto">
                  <el-form-item label="组长">
                    <span>{{item.form.leaderUserName}}</span>
                  </el-form-item>
                </div>
              </div>
              <hr/>
              <div class="row hr">
                <div class="col-lg-4 col-md-6 col-sm-12">
                  <el-form-item label="检查结果">
                    <el-select class='select'
                               v-model="item.form.result"
                               @change="resAction(index, $event)"
                               :clearable='true'>
                      <el-option v-for='re in resultList'
                                 :label="re.dictName"
                                 :value="re.dictCode"
                                 :key='re.dictCode'></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-lg-5 col-md-6 col-sm-12 ml-auto">
                  <el-form-item label="执行人">
                    <span>{{item.form.Executor}}</span>
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
                <div class="col-lg-8 col-md-6 col-sm-12">
                  <el-form-item label="核准意见">
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
import { checkResult, findMonitorBillLoad, TESTMODE } from '../../services/safety_supervision'
export default {
  name: 'LookExamine',
  props: {
    depmentlist: Array
  },
  data () {
    return {
      rmDepartmentDOList2: [],
      activeName: '',
      inspect: [],
      result: '',
      form: {
        bill: '',
        result: '',
        Executor: '',
        textarea: ''
      },
      tableData: [],
      billList: [
      ],
      resultList: []
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
      // console.log(newval)
      newval.forEach((item, index) => {
        item.tableData = []
        item.billList = []
        index == 0 ? this.activeName = item.deptName : null
        item.form = {
          bill: '',
          result: '1',
          Executor: '',
          textarea: '',
          leaderUserName: ''
        }
        let obj = {
          monitorDeptId: item.deptId,
          monitorId: this.$route.query.id,
          status: 0
        }
        if (item.status >= 4) {
        findMonitorBillLoad(obj).then(res => {
          // console.log(res)
          let data = res.data.data
          // console.log(data)
          if (data) {
            data.map(da => {
              let obj1 = {
                label: da.billName,
                value: da.billName,
                id: da.billId
              }
              item.billList.push(obj1)
              item.form.bill = data[0].billName
              item.form.leaderUserName = data[0].leaderUserName
              item.form.Executor = item.form.bill.substring(0,item.form.bill.length-3)
              data[0].detailDOs.map(det => {
                det.itemCheckType2 = this.filters(det.itemCheckType)
                det.itemResult2 = this.resultList.filter(res => {
                  return det.itemResult === res.dictCode
                })[0].dictName
              })
              item.tableData = data[0].detailDOs
              item.form.textarea = data[0].auditContent
            })
          }
        })}
        this.rmDepartmentDOList2.push(item)
      })
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
    },
    resAction (i, val) {
      let target2 = {
        monitorDeptId: this.rmDepartmentDOList[i].deptId,
        monitorId: this.$route.query.id,
        billName: this.rmDepartmentDOList[i].form.bill,
        itemResult: val,
        status: 1
      }
      // console.log(target2)
      if (this.rmDepartmentDOList[i].form.bill) {
        findMonitorBillLoad(target2).then(res => {
          let data = res.data.data[0]
          if (data.detailDOs.length) {
            data.detailDOs.map(det => {
              det.itemCheckType2 = this.filters(det.itemCheckType)
              det.itemResult2 = this.resultList.filter(res => {
                return det.itemResult === res.dictCode
              })[0].dictName
            })
            this.rmDepartmentDOList[i].tableData = data.detailDOs
          } else {
            this.rmDepartmentDOList[i].tableData = data.detailDOs
          }
        })
      } else {
        // this.$message.error('请选择检查单')
      }
    },
    nameAction (i, val) {
      let target = {
        monitorDeptId: this.rmDepartmentDOList[i].deptId,
        monitorId: this.$route.query.id,
        billName: val,
        status: 1
      }
      if (val) {
        findMonitorBillLoad(target).then(res => {
          let data = res.data.data
          let tab = data[0]
          tab.detailDOs.map(det => {
            det.itemCheckType2 = this.filters(det.itemCheckType)
            det.itemResult2 = this.resultList.filter(res => {
              return det.itemResult === res.dictCode
            })[0].dictName
          })
          this.rmDepartmentDOList[i].tableData = tab.detailDOs
          this.rmDepartmentDOList[i].form.textarea = tab.auditContent
        })
        this.rmDepartmentDOList[i].form.Executor = val.substring(0,val.length-3)
      } else {
        this.rmDepartmentDOList[i].tableData = []
        this.rmDepartmentDOList[i].form.textarea = ''
        this.rmDepartmentDOList[i].form.Executor = ''
      }
    }
  },
  mounted () {
    // let obj = {
    //   monitorDeptId: this.user.deptId,
    //   monitorId: this.manId
    // }
    // findMonitorBillLoad(obj).then(res => {
    //   // console.log(res)
    //   let data = res.data.data
    //   data.map(item => {
    //     let obj1 = {
    //       label: item.billName,
    //       value: item.billName,
    //       id: item.billId
    //     }
    //     this.billList.push(obj1)
    //   })
    //   this.form.bill = data[0].billName
    //   data[0].detailDOs.map(det => {
    //     det.itemCheckType2 = this.filters(det.itemCheckType)
    //     det.itemResult2 = this.resultList.filter(res => {
    //       return det.itemResult === res.dictCode
    //     })[0].dictName
    //   })
    //   this.tableData = data[0].detailDOs
    //   this.form.textarea = data[0].auditContent
    // })
  }

}
</script>


<style scoped>
#collapse6 .hr {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>

