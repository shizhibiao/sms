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
            <el-form ref="form"
                     inline-message
                     label-position="left"
                     status-icon
                     size="medium"
                     style="width:100%;"
                     :rules="info.rules"
                     :model="info">
              <el-table :stripe="true"
                        :highlight-current-row="true"
                        :data="info.tableData"
                        border
                        :default-sort="{prop: 'date', order: 'descending'}"
                        size="small"
                        style="width: 100%"
                        align="center">
                <el-table-column label="指标名称"
                                 prop="projectName"
                                 align="center">
                  <template slot-scope="scope">
                    <!-- 判断依据为最后两条 即12、13 -->
                    <el-form-item :prop="'tableData.' + scope.$index + '.projectName'"
                                  v-if="(scope.$index == 12 || scope.$index == 13)">
                      <el-input v-model="scope.row.projectName"
                                :disabled="!showEdit"
                                placeholder=""></el-input>
                    </el-form-item>
                    <span v-if="scope.$index != 12 && scope.$index != 13">{{scope.row.projectName}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="完成情况"
                                 prop="peojectActual"
                                 align="center">
                  <!-- <template slot-scope="scope">
                    <el-form-item :prop="'tableData.' + scope.$index + '.projectCompletion'"
                                  :rules="info.rules.projectCompletion"
                                  v-if="showEdit">
                      <el-input v-model="scope.row.projectCompletion"
                                placeholder=""></el-input>
                    </el-form-item>
                    <span v-if="!showEdit">{{scope.row.projectCompletion}}</span>
                  </template> -->
                </el-table-column>
                <el-table-column label="结果"
                                 align="center">
                  <template slot-scope="scope">
                    <el-form-item :prop="'tableData.' + scope.$index + '.projectCompletion'"
                                  :rules="scope.$index == 12 || scope.$index == 13 ? {} : info.rules.projectCompletion"
                                  v-if="showEdit">
                      <el-input v-model="scope.row.projectCompletion"
                                placeholder=""></el-input>
                    </el-form-item>
                    <span v-if="!showEdit">{{scope.row.projectCompletion}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="得分/扣分"
                                 align="center">
                  <template slot-scope="scope">
                    <el-form-item :prop="'tableData.' + scope.$index + '.projectScore'"
                                  :rules="scope.$index == 12 || scope.$index == 13 ? {type: 'number', required: false, message: '必须为数字值'} :info.rules.projectScore"
                                  v-if="showEdit">
                      <el-input type="age"
                                v-model.number="scope.row.projectScore"
                                placeholder=""></el-input>
                    </el-form-item>
                    <span v-if="!showEdit">{{scope.row.projectScore}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="评价标准"
                                 align="center">
                  <template slot-scope="scope">
                    <el-button size='mini'
                               @click="lookAction(scope.$index, scope.row)">
                      查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </template>
        </div>
        <div class="row"
             style="margin-top:20px;">
          <template>
            <el-col :span="20">
              <el-button type="primary"
                         v-if="showEdit"
                         @click="reckontion()">
                计算</el-button>
            </el-col>
            <el-col :span="4">
              <el-form>
                <el-form-item label="总分：">
                  <el-input placeholder="总分"
                            style="width:74%;"
                            v-model="total"
                            :disabled="true">
                  </el-input>
                </el-form-item>
                <!-- <el-form-item label="结果：">
                  <el-input placeholder="结果"
                            style="width:74%;"
                            v-model="result"
                            :disabled="true">
                  </el-input>
                </el-form-item> -->
              </el-form>
            </el-col>
          </template>
        </div>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
import { formatDate } from '../../utils'
export default {
  props: {
    show: Boolean
  },
  data () {
    return {
      status: false,
      btn1: true,
      total: 0,
      result: 'T1',
      info: {
        tableData: [],
        rules: {
          projectScore: [
            { required: true, message: '得分/扣分不能为空' },
            { type: 'number', message: '必须为数字值' }
          ],
          projectCompletion: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          projectResult: [
            { required: true, message: '必填', trigger: 'blur' }
          ]
        }
      },
      showEdit: true,
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  watch: {
  },
  methods: {
    // 计算
    reckontion () {
      this.Verification()
      if (this.status) {
        let count = 0
        this.info.tableData.forEach(item => {
          count += item.projectScore
        })
        this.total = count
      } else {
        this.$message.error('请填写必填项')
      }
    },
    // 查看按钮
    lookAction (index, row) {
      this.$alert(row.projectStandard,
        '评价标准', {
          confirmButtonText: '确定',
        });
      // this.$refs['form'].validate((valid) => {
      //   if (valid) {
      //     alert(11111)
      //   } else {
      //     alert(2222)
      //   }
      // })
    },
    // 表单验证
    Verification () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.status = true
        } else {
          this.status = false
        }
      })
      return this.status
    },
    queryList () {
      axios.get('/api/performance_evaluetion/formsFallIn/' + this.$route.query.id).then(res => {
        // console.log(res)
        let data = res.data.data
        // console.log(data)
        axios.get('/api/performance_evaluetion/fromsView/' + this.$route.query.id).then(res2 => {
          // console.log(res2)
          let data2 = res2.data.data.fromsDOs
          data2.forEach((item, index) => {
            if (index == 12 || index == 13) {
              data[index].projectName = item.projectName
            }
            data[index].projectCompletion = item.projectCompletion
            data[index].projectScore = item.projectScore
          })
          if (!this.showEdit) {
            this.total = res2.data.data.evaluetionScore
          }
          this.info.tableData = data
        })
      })
    },
    giveTab () {
      return this.info.tableData
    },
    giveFraction () {
      return {
        total: this.total,
        result: this.result
      }
    }
  },
  created () {
  },
  mounted () {
    if (this.show) {
      this.showEdit = false
    }
    this.queryList()
  }
}
</script>

<style scoped>
</style>
