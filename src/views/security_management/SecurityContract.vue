<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <el-row :gutter="12">
          <el-col :span="20">
            <el-form inline>
              <el-form-item label="签订日期">
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
              <el-form-item label="到期日期">
                <el-date-picker
                  v-model="valueendtime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="签约方">
                <el-input
                  clearable
                  placeholder='请输入签约方'
                  v-model='selectContracter'>
                </el-input>
              </el-form-item>
              <el-form-item label="服务项目">
                <el-input
                  clearable
                  placeholder='请输入服务项目'
                  prefix-icon='el-icon-search'
                  v-model='selectService'>
                </el-input>
              </el-form-item>
              <el-form-item label="涉及国家">
                <el-input
                  clearable
                  placeholder='请输入涉及国家'
                  prefix-icon='el-icon-search'
                  v-model='selectCountry'>
                </el-input>
              </el-form-item>
              <el-form-item label="协议种类">
                <el-select v-model="type" filterable clearable placeholder="请选择协议种类">
                  <el-option
                    v-for="item in typeList"
                    :key="item.dictCode"
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
            <!--<el-button size="small" @click="this.refresh"><i class='fa fa-refresh'></i> 刷新</el-button>-->
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
            prop='tscCountry'
            label='涉及国家'
            width='150px'>
          </el-table-column>
          <el-table-column
            prop='tscTypeName'
            label='协议种类'>
          </el-table-column>
          <el-table-column
            prop='tscContracter'
            label='签约方'>
          </el-table-column>
          <el-table-column
            prop='tscService'
            label='服务项目'>
          </el-table-column>
          <el-table-column
            prop='tscContractdate'
            label='签约日期'>
          </el-table-column>
          <el-table-column
            prop='tscEnddate'
            label='到期日期'>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200px">
            <template slot-scope="scope">
              <el-button  type="text" size="small" @click="getShow(scope.row.tscId)">
                <i class="fa fa-shower" ></i> 查看</el-button>
              <el-button  type="text" size="small" @click="editInfo(scope.row.tscId)">
                <i class="fa fa-edit"></i> 编辑</el-button>
              <el-button type="text" size="small"  @click="deleteInfo(scope.row.tscId)">
                <i class="fa fa-remove"></i> 过期归档</el-button>
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
      name: 'contract',
      data () {
        return {
          operationType: 0,
          items: [],
          valueTime: [this.getDefaultTime(), new Date()],
          valueendtime: [this.getDefaultTime(), new Date()],
          selectContracter: '',
          selectCountry: '',
          selectService: '',
          type: '',
          tscTypeName: '',
          tscId: 0,
          typeList: [],
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
          axios.get('/api/securitycontract?pageNum=' + pageNo + '&pageSize=' + this.pageSize + '&startTime=' + startTime + '&endTime=' + endTime)
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
        getTypeList () {
          axios.get('/api/system/dictionary/by_type?dictType=SECURITY_CONTRACT')
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                let page = data.data
                this.typeList = page
              } else {
                alert(data.message)
              }
            })
            .catch(response => {
              alert(response)
            })
        },
        getShow (tscId) {
          this.operationType = 1
          let flag = this.operationType
          console.log('===================' + tscId)
          let url = '/security/news_edit/' + tscId + '/' + flag
          this.$router.push({path: url})
        },
        editInfo (tscId) {
          this.operationType = 2
          let flag = this.operationType
          let url = '/security/news_edit/' + tscId + '/' + flag
          this.$router.push({path: url})
        },
        addNew () {
          this.operationType = 3
          let flag = this.operationType
          let url = '/security/news_edit/' + 0 + '/' + flag
          this.$router.push({path: url})
        },
        deleteInfo (tscId) {
          this.$confirm('确定归档该安保协议？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.put('/api/securitycontract/' + tscId)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                  this.$message({type: 'success', message: '归档成功'})
                  this.getData()
                } else {
                  let msg = {type: 'error', message: '归档失败:' + data.message}
                  this.$message(msg)
                }
              })
              .catch(response => {
                this.$message({type: 'error', message: '服务器或网络异常'})
              })
          })
        },
        getCheckData () {
          if (this.valueTime == null || this.valueTime === 0 || this.valueendtime == null || this.valueendtime === 0) {
            alert('请选择起始年月')
            return
          }
          let startTime = formatDate(this.valueTime[0], 'yyyy-MM-dd')
          let endTime = formatDate(new Date(this.valueTime[1].getTime() + 86400000), 'yyyy-MM-dd')
          let startvaluetime = formatDate(this.valueendtime[0], 'yyyy-MM-dd')
          let endvaluetime = formatDate(new Date(this.valueendtime[1].getTime() + 86400000), 'yyyy-MM-dd')
          startTime = parseInt(startTime.toString().replace(/-/g, ''))
          endTime = parseInt(endTime.toString().replace(/-/g, ''))
          startvaluetime = parseInt(startvaluetime.toString().replace(/-/g, ''))
          endvaluetime = parseInt(endvaluetime.toString().replace(/-/g, ''))
          let pageNo = this.curPage - 1
          let url = '/api/securitycontract/byCondition?&pageNum=' + pageNo + '&pageSize=' + this.pageSize + '&tscCountry=' + this.selectCountry + '&tscContracter=' + this.selectContracter + '&startTime=' + startTime + '&endTime=' + endTime +
            '&tscType=' + this.type + '&tscService=' + this.selectService + '&startDate=' + startvaluetime + '&endDate=' + endvaluetime
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
        }
      },
      computed: {
        user () {
          return this.$store.state.user
        }
      },
      created () {
        this.getTypeList()
        this.getData()
      }
    }
</script>

<style scoped>

</style>
