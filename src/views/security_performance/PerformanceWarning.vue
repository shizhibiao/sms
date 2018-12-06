<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-lg-6 col-md-6 col-sm-12">
        <b-card no-body>
          <div slot="header">
            <strong>正常指标情况</strong>
          </div>
          <b-card-body style="height:75vh; overflow-y:auto">
            <el-table
              :data="normalTableData.slice((currentPage1-1)*perPage1,currentPage1*perPage1)" :cell-style="classNameFn">
               <el-table-column
                type="index"
                label="#">
              </el-table-column>
              <el-table-column
                prop="indicatorName"
                label="指标名称">
              </el-table-column>
              <el-table-column
                prop="deptName"
                label="责任部门">
              </el-table-column>
              <el-table-column
                label="指标类型">
                <template slot-scope="scope">
                  {{scope.row.indicatorRank?'部门级':'公司级'}}
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                  <el-button @click="lookImgHandler(scope.row,1)" type="text" size="small">查看趋势图</el-button>
                </template>
              </el-table-column>
            </el-table>
            <b-row>
              <b-col md="12" class="my-1 mt-1" v-if="totalPage1 > 1">
                <el-pagination
                  background
                  :current-page.sync="currentPage1"
                  :page-size="perPage1"
                  layout="total, prev, pager, next, jumper"
                  :total="totalRows1"
                  align="right">
                </el-pagination>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <b-card no-body>
              <div slot="header">
                <strong>超标指标情况</strong>
              </div>
              <b-card-body style="height:30vh; overflow-y:auto">
                <el-table
                  :data="overstepTableData.slice((currentPage2-1)*perPage2,currentPage2*perPage2)"
                  :cell-style="classNameFn"
                >
                  <el-table-column
                    type="index"
                    label="#">
                  </el-table-column>
                  <el-table-column
                    prop="indicatorName"
                    label="指标名称">
                  </el-table-column>
                  <el-table-column
                    prop="deptName"
                    label="责任部门">
                  </el-table-column>
                  <el-table-column
                    label="指标类型">
                    <template slot-scope="scope">
                      {{scope.row.indicatorRank?'部门级':'公司级'}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作">
                    <template slot-scope="scope">
                      <el-button @click="lookImgHandler(scope.row,2)" type="text" size="small">查看趋势图</el-button>
                      <el-button @click="lookPlanHandler(scope.row,2)" type="text" size="small">查看行动计划</el-button>
                      <el-button @click="noticeHandler(scope.row,2)" type="text" size="small">立项通知</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <b-row>
                  <b-col md="12" class="my-1 mt-1" v-if="totalPage2 > 1">
                    <el-pagination
                      background
                      :current-page.sync="currentPage2"
                      :page-size="perPage2"
                      layout="total, prev, pager, next, jumper"
                      :total="totalRows2"
                      align="right">
                    </el-pagination>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12">
            <b-card no-body>
              <div slot="header">
                <strong>预警指标情况</strong>
              </div>
              <b-card-body style="height:30vh; overflow-y:auto">
                <el-table
                  :data="warningTbleData.slice((currentPage3-1)*perPage3,currentPage3*perPage3)"
                  :cell-style="classNameFn"
                >
                  <el-table-column
                    type="index"
                    label="#">
                  </el-table-column>
                  <el-table-column
                    prop="indicatorName"
                    label="指标名称">
                  </el-table-column>
                  <el-table-column
                    prop="deptName"
                    label="责任部门">
                  </el-table-column>
                  <el-table-column
                    label="指标类型">
                    <template slot-scope="scope">
                      {{scope.row.indicatorRank?'部门级':'公司级'}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作">
                    <template slot-scope="scope">
                      <el-button @click="lookImgHandler(scope.row,3)" type="text" size="small">查看趋势图</el-button>
                      <el-button @click="lookPlanHandler(scope.row,3)" type="text" size="small">查看行动计划</el-button>
                      <el-button @click="noticeHandler(scope.row,3)" type="text" size="small">立项通知</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <b-row>
                  <b-col md="12" class="my-1 mt-1" v-if="totalPage3 > 1">
                    <el-pagination
                      background
                      :current-page.sync="currentPage3"
                      :page-size="perPage3"
                      layout="total, prev, pager, next, jumper"
                      :total="totalRows3"
                      align="right">
                    </el-pagination>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="查看趋势图" :visible.sync="dialogTableVisible">
      <!--<div ref="myChart" id="myChart" style="width:100% ;height:500px"></div>-->
      <ve-line :data ='chartData' :settings="chartSettings"  :colors="['#096']" v-if="visibleDialong==='chartData1'"></ve-line>
      <ve-line :data ='chartData' :settings="chartSettings"  :colors="['rgb(240, 128, 128)']" v-if="visibleDialong==='chartData2'"></ve-line>
      <ve-line :data ='chartData' :settings="chartSettings"  :colors="['rgb(255, 236, 187)']" v-if="visibleDialong==='chartData3'"></ve-line>
    </el-dialog>
    <el-dialog title="安全行动计划" :visible.sync="planVisible" width='70%'>
      <el-table :data="datas">
        <el-table-column label="安全绩效目标" prop="target"></el-table-column>
        <el-table-column label="安全行动/措施计划" prop="plan"></el-table-column>
        <el-table-column label="责任部门/人员">
          <template slot-scope="scope">
            {{scope.row.deptName&&scope.row.deptName+':'+scope.row.emplNames}}
          </template>
        </el-table-column>
        <el-table-column label="实施期限" prop="deadLine"></el-table-column>
        <el-table-column label="资源需求" prop="resources"></el-table-column>
        <el-table-column label="监管部门/人员">
          <template slot-scope="scope">
            {{scope.row.monitorDeptName&&scope.row.monitorDeptName+':'+scope.row.monitorNames}}
          </template>
        </el-table-column>
        <el-table-column label="实施状态" prop="implementStatus"></el-table-column>
        <el-table-column label="定期评估结果" prop="assessResult"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePlanDialong">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="立项通知" :visible.sync="noticeVisible" width='70%'>
      <el-form :model="noticeForm" inline-message ref='noticeForm' label-width="130px" disabled>
        <div class="row">

          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="类型">
              <el-input>
                <span slot="prefix">{{noticeForm.safetyIndicatorDO.indicatorRank?' &ensp;部门级':'&ensp;公司级'}}</span>
              </el-input>

            </el-form-item>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="责任部门">
              <el-input :value="noticeForm.dutyDept"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="考核周期">
              <el-input :value="noticeForm.safetyIndicatorDO.period"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="指标名称">
              <el-input :value="noticeForm.safetyIndicatorDO.indicatorName"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="记录状态">
              <el-input>
                <span slot="prefix">{{noticeForm.calcResult?(noticeForm.calcResult===1?'&ensp;预警':'&ensp;超标'):'&ensp;正常'}}</span>
              </el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="目标值">
              <el-input v-model="noticeForm.safetyIndicatorDO.dtarget"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="预警值">
              <el-input v-model="noticeForm.safetyIndicatorDO.dalert"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="实际值">
              <el-input v-model="noticeForm.calcValue"></el-input>
            </el-form-item>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <el-form-item label="发生时间">
              <el-input v-model="noticeForm.calcDate"></el-input>
            </el-form-item>
          </div>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="mailToHandler()">派发通知</el-button>
        <el-button @click="noticeVisible=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import {formatDate} from '../../utils/index.js'

export default {
    name: 'ReasonList',
    data () {
      this.visualMap = [
        {
          type: 'piecewise',
          splitNumber: 3,
          min: 0,
          max: 3,
          right: 0,
          top: '50%'
        }
      ]
      this.chartSettings = {
        scale: [true, true],
        metrics: ['calcValue'],
        labelMap: {
          calcValue: '数值'
        }
      }
      this.grid = {
        right: 60
      }
      this.chartExtend = {
        series (v) {
          if (v && v.length > 0) {
            v.forEach(i => {
              console.log(i)
            })
            return v
          }
        },
        visualMap: {
          show: false,
          dimension: 1,
          pieces: [],
          outOfRange: {
            color: 'green'
          }
        }
      }
      return {
        normalTableData: [],
        overstepTableData: [],
        warningTbleData: [],
        dialogTableVisible: false,
        currentPage1: 1,
        perPage1: 10,
        currentPage2: 1,
        perPage2: 5,
        currentPage3: 1,
        perPage3: 5,
        chartData: {
          columns: ['calcDate', 'calcValue'],
          rows: []
        },
        visibleDialong: '',
        planVisible: false,
        datas: [],
        noticeVisible: false,
        noticeForm: {
          safetyIndicatorDO: {}
        }
      }
    },
    methods: {
      refresh () {

        // this.getDataTable()
      },
      lookImgHandler (row, index) {
        let indicatorId = row.indicatorId
        let deptId = row.deptId
        let calcDateStart = row.periodFrom
        let calcDateEnd = row.periodEnd
        axios.get(`/api/earlywarning/history?indicatorId=${indicatorId}&deptId=
        ${deptId}&calcDateStart=${calcDateStart}&calcDateEnd=${calcDateEnd}`).then(result => {
          console.log(result)
          if (result.data && result.data.error === 0) {
            let rows = result.data.data.map(item => {
              return {
                calcDate: item.calcDate,
                calcResult: item.calcResult,
                calcValue: item.calcValue
              }
            })
            this.chartData.rows = rows
            console.log(this.chartData)
          }
          this.visibleDialong = 'chartData' + index
          this.dialogTableVisible = true
        })
      },
      getDataTable (calcDate, calcResult) {
        if (calcResult === 0) {
          axios.get(`/api/earlywarning/list?calcDate=${calcDate}&calcResult=${calcResult}`).then(result => {
            console.log(result)
            if (result.data && result.data.error === 0) {
              this.normalTableData = result.data.data
            }
          })
        } else if (calcResult === 1) {
          axios.get(`/api/earlywarning/list?calcDate=${calcDate}&calcResult=${calcResult}`).then(result => {
            console.log(result)
            if (result.data && result.data.error === 0) {
              this.warningTbleData = result.data.data
            }
          })
        } else if (calcResult === 2) {
          axios.get(`/api/earlywarning/list?calcDate=${calcDate}&calcResult=${calcResult}`).then(result => {
            console.log(result)
            if (result.data && result.data.error === 0) {
              this.overstepTableData = result.data.data
            }
          })
        }
      },
      lookPlanHandler (row, index) {
        console.log(row)
        let indicatorId = row.indicatorId
        axios.get('/api/earlywarning/action?indicatorId=' + indicatorId).then(result => {
          console.log(result)
          if (result.data && result.data.error === 0) {
            this.datas = result.data.data
            this.planVisible = true
          }
        })
      },
      closePlanDialong () {
        this.planVisible = false
        this.datas = []
      },
      noticeHandler (row, index) {
        let dayId = row.dayId
        axios.get(`/api/earlywarning/prepare/${dayId}`).then(result => {
          console.log(result)
          if (result.data && result.data.error === 0) {
            this.noticeForm = result.data.data
            if (this.noticeForm.safetyIndicatorDO && this.noticeForm.safetyIndicatorDO.dutyDeptList) {
              let str = ''
              this.noticeForm.safetyIndicatorDO.dutyDeptList.map(item => {
                str += ' ' + item.deptName
              })
              this.noticeForm.dutyDept = str
              console.log(this.noticeForm.dutyDept)
            }
            this.noticeVisible = true
          }
        })
      },
      mailToHandler () {
        let dayId = this.noticeForm.id
        this.$router.push({
          path: `/mail/send-mail/2/${dayId}`
        })
      },
      classNameFn (col) {
        if (col.columnIndex !== 4) {
          if (col.row.calcResult === 0) {
            return {'background-color': 'rgb(144, 238, 144)'}
          } else if (col.row.calcResult === 1) {
            return {'background-color': 'rgb(255, 236, 187)'}
          } else if (col.row.calcResult === 2) {
            return {'background-color': 'rgb(240, 128, 128)'}
          }
        }
      }
    },
    computed: {
      totalPage1 () {
        if (this.normalTableData) {
          return this.normalTableData.length / this.perPage1
        }
      },
      totalRows1 () {
        if (this.normalTableData) {
          return this.normalTableData.length
        }
      },
      totalPage2 () {
        if (this.overstepTableData) {
          return this.overstepTableData.length / this.perPage2
        }
      },
      totalRows2 () {
        if (this.overstepTableData) {
          return this.overstepTableData.length
        }
      },
      totalPage3 () {
        if (this.warningTbleData) {
          return this.warningTbleData.length / this.perPage3
        }
      },
      totalRows3 () {
        if (this.warningTbleData) {
          return this.warningTbleData.length
        }
      }
    },
    created () {
      let yesterday = formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
      this.getDataTable(yesterday, 0)
      this.getDataTable(yesterday, 1)
      this.getDataTable(yesterday, 2)
    },
    watch: {
    }
  }
</script>

<style scoped>

</style>
