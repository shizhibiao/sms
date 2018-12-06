<template>
  <b-card no-body>
    <div slot="header">
      表单填写
      <div class="card-actions">
        <b-btn class="btn btn-minimize"
               v-b-toggle.collapse5>
          <i class="icon-arrow-up"></i>
        </b-btn>
      </div>
    </div>
    <b-collapse id="collapse5"
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
                               align="center">
                <template slot-scope="scope">
                  <el-select class='select'
                             v-model="tableData[scope.$index].itemResult"
                             @change="chaAction($event,scope.$index, scope.row)"
                             :clearable='true'>
                    <el-option v-for='res in ResultList'
                               :label="res.dictName"
                               :value="res.dictCode"
                               :key='res.dictCode'></el-option>
                  </el-select>
                </template>
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
import bus from './bus'
import { findMonitorBillLoad, checkResult, TESTMODE } from '../../services/safety_supervision'
export default {
  name: 'SupervisionFilling',
  props: {
    manId: Number
  },
  data () {
    return {
      Result: '',
      ResultList: [
      ],
      tableData: [],
      inspect: []
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  methods: {
    chaAction (val, index, row) {
      // console.log(val, index, row)
      this.tableData[index].itemResult = val
      this.$emit('dis')
      // console.log(this.tableData)
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
    },
    getTab () {
      return this.tableData
    }
  },
  created () {
    TESTMODE().then(res => {
      this.inspect = res
      // console.log(this.inspect)
    })
  },
  mounted () {
    checkResult().then(res => {
      this.ResultList = res
    })
    let obj = {
      monitorId: this.manId,
      monitorDeptId: this.user.deptId,
      status: 0
    }
    // console.log(obj)
    findMonitorBillLoad(obj).then(res => {
      let data = res.data.data
      // console.log(data)
      data.forEach((item,index) => {
        item.teamDOs.forEach(team => {
          if (team.teamUserId == this.user.userId) {
            this.$emit('billId', data[index].billId)
            item.detailDOs.map(de => {
              de.itemCheckType2 = this.filters(de.itemCheckType)
              this.tableData.push(de)
            })
            return false
          }
        })
      })
    })
  }
}
</script>
