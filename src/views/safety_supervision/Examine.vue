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
    <b-collapse id="collapse6" :visible='true'>
    <b-card-body>
      <el-form label-width="110px"
               inline-message
                 status-icon
                 label-position="left"
                 size="medium"
               :model="form">
        <div class="row">
          <div class="col-lg-4 col-md-6 col-sm-12">
            <el-form-item label="检查单选择">
              <el-select 
                          class='select'
                          @change="nameAction"
                          v-model="form.bill"
                          :clearable='true'>
                  <el-option v-for='item in billList'
                            :label="item.label"
                            :value="item.value"
                            :key='item.value'></el-option>
                </el-select>
            </el-form-item>
          </div>
        </div>
        <hr/>
        <div class="row hr">
          <div class="col-lg-4 col-md-6 col-sm-12">
            <el-form-item label="检查结果">
              <el-select 
                          class='select'
                          v-model="form.result"
                          @change="resAction"
                          :clearable='true'>
                  <el-option v-for='item in resultList'
                            :label="item.dictName"
                            :value="item.dictCode"
                            :key='item.dictCode'></el-option>
                </el-select>
            </el-form-item>
          </div>
          <div class="col-lg-5 col-md-6 col-sm-12 ml-auto">
            <el-form-item label="执行人">
              <span>{{form.Executor}}</span>
            </el-form-item>
          </div>
        </div>
            <div class="row hr">
              <template>
                <el-table :stripe="true"
                          :highlight-current-row="true"
                          :data="tableData"
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
                <el-form-item label="核准意见"
                        >
                  <el-input type="textarea"
                      :rows="4"
                      style="width:100%;"
                      @change="inAction"
                      placeholder="请输入内容"
                      v-model="form.textarea"
                      maxlength="200"
                      >
                  </el-input>
              </el-form-item>
              </div>
            </div>
            </el-form>
    </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import Vuex from 'vuex'
import {checkResult, findMonitorBillLoad, TESTMODE} from '../../services/safety_supervision'
export default {
  name: 'Examine',
  props: {
    manId: Number
  },
  data () {
    return {
      inspect: [],
      result: '',
      form: {
        bill: '',
        result: '1',
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
    bill () {
      return this.form.bill
    }
  },
  watch: {
    bill (newval, old) {
      this.form.Executor = newval.substring(0, newval.length - 3)
    }
  },
  created () {
    TESTMODE().then(res => {
      this.inspect = res
      // console.log(this.inspect)
    })
    checkResult().then(res => {
      // console.log(res)
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
    getData () {
      return this.billList
    },
    getName () {
      return {
        billName: this.form.bill,
        textarea: this.form.textarea
      }
    },
    resAction (val) {
      let target2 = {
        monitorDeptId: this.user.deptId,
        monitorId: this.manId,
        billName: this.form.bill,
        itemResult: val,
        status: 1
      }
      // console.log(target2)
      if (this.form.bill) {
        findMonitorBillLoad(target2).then(res => {
          let data = res.data.data[0]
          if (data.detailDOs.length) {
            data.detailDOs.map(det => {
              det.itemCheckType2 = this.filters(det.itemCheckType)
              det.itemResult2 = this.resultList.filter(res => {
                return det.itemResult === res.dictCode
              })[0].dictName
            })
            this.tableData = data.detailDOs
          } else {
            this.tableData = data.detailDOs
          }
        })
      } else {
        this.$message.error('请选择检查单')
      }
    },
    inAction (val) {
      this.$emit('dis')
    },
    nameAction (val) {
      let target = {
        monitorDeptId: this.user.deptId,
        monitorId: this.manId,
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
          this.tableData = tab.detailDOs
          this.form.textarea = tab.auditContent
        })
      } else {
        this.tableData = []
        this.form.textarea = ''
      }
    }
  },
  mounted () {
    let obj = {
      monitorDeptId: this.user.deptId,
      monitorId: this.manId,
      status: 0
    }
    findMonitorBillLoad(obj).then(res => {
      // console.log(res)
      let data = res.data.data
      data.map(item => {
        let obj1 = {
          label: item.billName,
          value: item.billName,
          id: item.billId
        }
        this.billList.push(obj1)
      })
      this.form.bill = data[0].billName
      data[0].detailDOs.map(det => {
        det.itemCheckType2 = this.filters(det.itemCheckType)
        det.itemResult2 = this.resultList.filter(res => {
          return det.itemResult === res.dictCode
        })[0].dictName
      })
      this.tableData = data[0].detailDOs
      this.form.textarea = data[0].auditContent
    })
  }

}
</script>


<style scoped>
#collapse6 .hr {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>

