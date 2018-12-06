<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <el-row :gutter="12">
          <el-col :span="20">
              <el-form inline>
                <el-form-item label="设备名称">
                  <el-input
                    clearable
                    placeholder='请输入设备名称'
                    v-model='selectTsesName'>
                  </el-input>
                </el-form-item>
                <el-form-item label="是否需要设备许可证书">
                  <el-select v-model="selectCertificate" filterable clearable placeholder="请选择是否需要设备许可证书">
                    <el-option
                      v-for="item in CertificateList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
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
              </el-form>
          </el-col>
          <el-col :span="4" class="text-right">
            <el-button size="small" type="primary" class="mt-1" @click="addNew()"><i class='fa fa-edit'></i> 新增</el-button>
            <el-button size="small" type="success" class="mt-1" @click="getCheckData()"><i class="fa fa-search"></i> 查询</el-button>
            <!--<el-button size="small" type="primary" class="mt-1" @click="this.refresh"><i class='fa fa-refresh'></i> 刷新</el-button>-->
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
            prop='tsesTypeName'
            label='设备类型'
            width='150px'>
          </el-table-column>
          <el-table-column
            prop='tsesName'
            label='设备名称'>
          </el-table-column>
          <el-table-column
            prop='tsesTecStandard'
            label='设备技术标准'>
          </el-table-column>
          <el-table-column
            prop='tsesScrappedStandard'
            label='设备报废标准'>
          </el-table-column>
          <el-table-column
            prop='tsesCertificatied'
            label='是否需要许可证书'
            :formatter="formatterData">
          </el-table-column>
          <el-table-column
            prop='tsesCreatetime'
            label='最后更新时间'>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200px">
            <template slot-scope="scope">
              <el-button  type="text" size="small" @click="getShow(scope.row.tsesId)">
                <i class="fa fa-shower" ></i> 查看</el-button>
              <el-button  type="text" size="small" @click="editInfo(scope.row.tsesId)">
                <i class="fa fa-edit"></i> 编辑</el-button>
              <el-button type="text" size="small"  @click="deleteInfo(scope.row.tsesId)">
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
  export default {
    name: 'equipment-standard',
    data () {
      return {
        operationType: 0,
        items: [],
        selectTsesName: '',
        selectCertificate: '',
        type: '',
        dictName: '',
        eqTypeList: [],
        total: 0,
        curPage: 1,
        pageSize: 20,
        totalPages: 1,
        CertificateList: [
          {
            value: 0,
            label: '否'
          }, {
            value: 1,
            label: '是'
          }
        ]
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
        axios.get('/api/eq_management/standard?pageNum=' + pageNo + '&pageSize=' + this.pageSize)
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
      getShow (tsesId) {
        this.operationType = 1
        let flag = this.operationType
        console.log('===================' + tsesId)
        let url = '/security/standard-edit/' + tsesId + '/' + flag
        this.$router.push({path: url})
      },
      editInfo (tsesId) {
        this.operationType = 2
        let flag = this.operationType
        let url = '/security/standard-edit/' + tsesId + '/' + flag
        this.$router.push({path: url})
      },
      addNew () {
        this.operationType = 3
        let flag = this.operationType
        let url = '/security/standard-edit/' + 0 + '/' + flag
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
      deleteInfo (tsesId) {
        this.$confirm('确定删除该条设备标准？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/api/eq_management/standard/' + tsesId)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.$message({type: 'success', message: '设备标准删除成功'})
                this.getData()
              } else {
                let msg = {type: 'error', message: '设备标准删除失败:' + data.message}
                this.$message(msg)
              }
            })
            .catch(response => {
              this.$message({type: 'error', message: '服务器或网络异常'})
            })
        })
      },
      getCheckData () {
        let pageNo = this.curPage - 1
        let url = '/api/eq_management/standard/byCondition?&pageNum=' + pageNo + '&pageSize=' + this.pageSize + '&tsesType=' +
          this.type + '&tsesName=' + this.selectTsesName + '&tsesCertificatied=' + this.selectCertificate
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
    }
  }
</script>

<style scoped>
</style>
