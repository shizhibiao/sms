<template>
  <b-card no-body>
    <div slot="header">
      各部门确认
      <div class="card-actions">
        <b-btn class="btn btn-minimize"
               v-b-toggle.collapse7>
          <i class="icon-arrow-up"></i>
        </b-btn>
      </div>
    </div>
    <b-collapse id="collapse7"
                :visible='true'>
      <b-card-body>
        <el-form label-width="110px"
                 inline-message
                 label-position="left"
                 status-icon
                 size="medium"
                 :model="form">
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="部门">
                <span>{{user.deptName}}</span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="部门负责人">
                <span>{{user.userName}}</span>
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
            <div class="col-lg-3 col-md-3 col-sm-3">
              <el-form-item label="符合">
                <span>{{quantity.suggestItems}}</span>
              </el-form-item>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3">
              <el-form-item label="不符合">
                <span>{{quantity.observationItems}}</span>
              </el-form-item>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3">
              <el-form-item label="未检查">
                <span>{{quantity.seriousFails}}</span>
              </el-form-item>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3">
              <el-form-item label="不适用">
                <span>{{quantity.commonFails}}</span>
              </el-form-item>
            </div>
          </div>
          <div class="row hr">
            <div class="col-lg-8 col-md-6 col-sm-12">
              <el-form-item label="意见">
                <el-input type="textarea"
                          :rows="4"
                          style="width:100%;"
                          @change="inAction"
                          placeholder="请输入内容"
                          maxlength="200"
                          v-model="form.textarea">
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
import { findDepartmentConfirm, TESTMODE, checkResult } from '../../services/safety_supervision'
export default {
  name: 'Confirm',
  props: {
    manId: Number
  },
  data () {
    return {
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
      tableData: []
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
    checkResult().then(res => {
      this.resultList = res
    })
  },
  methods: {
    getInt () {
      return this.form.textarea
    },
    inAction (val) {
      this.$emit('dis')
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
  mounted () {
    findDepartmentConfirm(this.$route.query.id, this.user.deptId).then(res => {
      // console.log(res)
      let data = res.data.data
      // console.log(data)
      this.form.textarea = data.confirmContent
      this.quantity = {
        suggestItems: data.suggestItems,
        observationItems: data.observationItems,
        commonFails: data.commonFails,
        seriousFails: data.seriousFails
      }
      data.billDOs.forEach(item => {
        item.detailDOs.forEach(de => {
          de.itemCheckType2 = this.filters(de.itemCheckType)
          de.itemResult2 = this.resultList.filter(res => {
            return de.itemResult === res.dictCode
          })[0].dictName
          this.tableData.push(de)
        })
      })
    })
  }
}
</script>

<style>
#collapse7 .hr {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>

