<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <el-row :gutter="12">
          <el-col :span="20">
              <el-form inline>
                <el-form-item label="有效期">
                  <el-date-picker
                    v-model="valueTime"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="批次编号">
                  <el-input
                    clearable
                    placeholder='请输入批次编号'
                    v-model='selectTesmBatch'>
                  </el-input>
                </el-form-item>
                <el-form-item label="设备型号">
                  <el-input
                    clearable
                    placeholder='请输入设备型号'
                    v-model='selectTsesName'>
                  </el-input>
                </el-form-item>
                <el-form-item label="生产厂商">
                  <el-input
                    clearable
                    placeholder='请输入生产厂商'
                    v-model='selectTesmCreator'>
                  </el-input>
                </el-form-item>
                <el-form-item label="设备类型">
                  <el-select v-model="type" filterable clearable placeholder="请选择设备类型">
                    <el-option
                      v-for="item in eqTypeList"
                      :key="item.dictName"
                      :label="item.dictName"
                      :value="item.dictCode">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="设备名称">
                  <el-select v-model="name" filterable clearable placeholder="请选择设备名称">
                    <el-option
                      v-for="item in eqNameList"
                      :key="item.tsesName"
                      :label="item.tsesName"
                      :value="item.tsesName">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button size="small" type="primary" class="mt-1" @click="addNew()"><i class='fa fa-edit'></i> 新增</el-button>
            <el-button size="small" type="success" class="mt-1" @click="getCheckData()"><i class="fa fa-search"></i> 查询</el-button>
           <!-- <el-button class='btn btn-primary mt-1' @click="this.refresh"><i class='fa fa-refresh'></i> 刷新</el-button>-->
          </el-col>
        </el-row>
      </div>
      <b-card-body>
        <el-table stripe
                  size="small"
                  :data='items'>
          <el-table-column
            fixed
            label='#'
            width='60px'>
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column
            prop='tesmName'
            label='设备名称'>
          </el-table-column>
          <el-table-column
            prop='tesmTypeName'
            label='设备类型'
            width='150px'>
          </el-table-column>
          <el-table-column
            prop='tesmBatch'
            label='批次编号'>
          </el-table-column>
          <el-table-column
            prop='tesmCreator'
            label='生产厂商'>
          </el-table-column>
          <el-table-column
            prop='tesmModel'
            label='设备型号'
            :formatter="formatterData">
          </el-table-column>
          <el-table-column
            prop='tesmNumber'
            label='数量'>
          </el-table-column>
          <el-table-column
            prop='tesmEnddate'
            label='有效期'>
          </el-table-column>
          <el-table-column
            prop='tesmCreatedate'
            label='更新日期'>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200px">
            <template slot-scope="scope">
              <el-button  type="text" size="small" @click="getShow(scope.row.tesmId)">
                <i class="fa fa-shower" ></i> 批次明细</el-button>
              <el-button  type="text" size="small" @click="editInfo(scope.row.tesmId)">
                <i class="fa fa-edit"></i> 编辑</el-button>
              <el-button type="text" size="small"  @click="deleteInfo(scope.row.tesmId)">
                <i class="fa fa-remove"></i> 删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <b-row>
          <b-col sm='11' v-if='totalPages>1'>
            <el-pagination
              background
              :pager-count="5"
              :current-page.sync="curPage"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="total"
              align="right">
            </el-pagination>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
  import axios from 'axios'
  import { formatDate } from '../../utils/index.js'
  export default {
    name: 'equipment-management',
    data () {
      return {
        valueTime: [this.getDefaultTime(), new Date()],
        operationType: 0,
        items: [],
        eqNameList: [],
        tesmId: 0,
        selectTesmCreator: '',
        name: '',
        tsesName: '',
        selectTesmBatch: '',
        selectTsesName: '',
        type: '',
        dictName: '',
        eqTypeList: [],
        total: 0,
        curPage: 1,
        pageSize: 20,
        totalPages: 1
      }
    },
    watch: {
      curPage: function (newValue, oldValue) {
        this.getCheckData()
      }
    },
    methods: {
      getData () {
        let pageNo = this.curPage - 1
        let startTime = formatDate(this.valueTime[0], 'yyyy-MM-dd')
        let endTime = formatDate(new Date(this.valueTime[1].getTime() + 86400000), 'yyyy-MM-dd')
        startTime = parseInt(startTime.toString().replace(/-/g, ''))
        endTime = parseInt(endTime.toString().replace(/-/g, ''))
        axios.get('/api/security_management?pageNum=' + pageNo + '&pageSize=' + this.pageSize + '&startTime=' + startTime + '&endTime=' + endTime)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.total = page.totalElements || 0
              this.totalPages = page.totalPages || 0
              this.items = page.content || []
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      getDefaultTime () {
        if (new Date().getMonth() - 1 === new Date().getMonth()) {
          return new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).getTime() - 86400000 * 5)
        } else {
          return new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      },
      getCheckData () {
        if (this.valueTime === null) {
          alert('请选择起始年月')
          return
        }
        let startTime = formatDate(this.valueTime[0], 'yyyy-MM-dd')
        let endTime = formatDate(new Date(this.valueTime[1].getTime() + 86400000), 'yyyy-MM-dd')
        startTime = parseInt(startTime.toString().replace(/-/g, ''))
        endTime = parseInt(endTime.toString().replace(/-/g, ''))
        let pageNo = this.curPage - 1
        let url = '/api/security_management/byCondition?&pageNum=' + pageNo + '&pageSize=' + this.pageSize + '&tesmBatch=' +
          this.selectTesmBatch + '&tesmCreator=' + this.selectTesmCreator + '&tesmType=' + this.type + '&tesmName=' +
          this.name + '&tesmModel=' + this.selectTsesName + '&startTime=' + startTime + '&endTime=' + endTime
        axios.get(url)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.total = page.totalElements || 0
              this.totalPages = page.totalPages || 0
              this.items = page.content || []
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      getEqTypeList () {
        axios.get('/api/system/dictionary/by_type?dictType=EQUIPMENT_TYPE')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.eqTypeList = page
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      getShow (tesmId) {
        this.operationType = 1
        let flag = this.operationType
        let url = '/security/management-detail/' + tesmId + '/' + flag
        this.$router.push({path: url})
      },
      editInfo (tesmId) {
        this.operationType = 2
        let flag = this.operationType
        let url = '/security/management-edit/' + tesmId + '/' + flag
        this.$router.push({path: url})
      },
      addNew () {
        this.operationType = 3
        let flag = this.operationType
        let url = '/security/management-edit/' + 0 + '/' + flag
        this.$router.push({path: url})
      },
      formatterData: function (row, column) {
        var value = row[column.property]
        if (column.label === '是否需要许可证书') {
          if (parseInt(value) === 0) {
            return '否'
          } else if (parseInt(value) === 1) {
            return '是'
          }
        }
        return value
      },
      getEqNameList () {
        axios.get('/api/eq_management/standard/allName')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.eqNameList = page || []
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      deleteInfo (tesmId) {
        this.$confirm('确定删除该条设备管理？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/api/security_management/' + tesmId)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.$message({type: 'success', message: '设备管理删除成功'})
                this.getData()
              } else {
                let msg = {type: 'error', message: '设备管理删除失败:' + data.message}
                this.$message(msg)
              }
            })
            .catch(response => {
              this.$message({type: 'error', message: '服务器或网络异常'})
            })
        })
      },
      refresh () {
        this.selectTsesName = ''
        this.selectCertificate = ''
        this.type = ''
        this.getData()
      }
    },
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    created () {
      this.getData()
      this.getEqTypeList()
      this.getEqNameList()
    }
  }
</script>

<style scoped>
  .el-table th {
    background-color: #0081CC !important;
    color: white;
  }

</style>

