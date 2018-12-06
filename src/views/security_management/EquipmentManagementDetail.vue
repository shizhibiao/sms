<template>
  <div class='animated fadeIn'>
    <b-card no-body>
      <div slot='header'>
        <div class="float-right">
          <el-button size="small" type="primary" class="mt-1" @click="addNew()"><i class='fa fa-edit'></i> 新增</el-button>
          <el-button size="small" type="info" class='mt-1' @click="$router.back(-1)" ><i class="fa fa-back"></i> 返回</el-button>
        </div>
      </div>
      <b-card-body>
        <el-form :model="managementForm" ref="managementForm" status-icon size="medium" label-width="120px" inline-message>
          <div class="row">
            <div class="col-sm-12">
              <strong style="margin-left: 50px;margin-bottom: 20px">设备使用情况</strong>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="批次编号:" prop="tesmBatch">
                <span><strong>{{managementForm.tesmBatch}}</strong></span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="设备类型:" prop="tesmType" style="width: auto">
                <span><strong>{{managementForm.tesmType}}</strong></span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="设备名称:" prop="tesmName" style="width: auto">
                <span><strong>{{managementForm.tesmName}}</strong></span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="设备型号:" prop="tesmModel">
                <span><strong>{{managementForm.tesmModel}}</strong></span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="数量:" prop="tesmNumber">
                <span><strong>{{managementForm.tesmNumber}}</strong></span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="生成厂商:" prop="tesmCreator">
                <span><strong>{{managementForm.tesmCreator}}</strong></span>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </b-card-body>
    </b-card>
    <b-card>
      <adjunct
        ref='adjunct'
        :action="uploadUrl"
        :safetyId ='this.tesmId'
        tableName='t_sequipment_management'
        :flag="this.jumpflag === 1 ? 2 : ''"
        :uploadFile="this.jumpflag === 2 ? true : false"
      >
      </adjunct>
    </b-card>
    <b-card>
      <div class="col-sm-12" style="margin-top: 20px">
        <strong style="margin-left: 0px">设备使用情况</strong>
      </div>
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
            prop='tesmdNumber'
            label='设备编号'>
          </el-table-column>
          <el-table-column
            prop='tesmdLocation'
            label='所在位置'
            width='150px'>
          </el-table-column>
          <el-table-column
            prop='user.deptName'
            label='责任部门'>
          </el-table-column>
          <el-table-column
            prop='user.userName'
            label='责任人'>
          </el-table-column>
          <el-table-column
            prop='tesmdBegindate'
            label='启用日期'>
          </el-table-column>
          <el-table-column
            prop='tesmdStatusName'
            label='状态'>
          </el-table-column>
          <el-table-column
            prop='tesmdYearcheckdate'
            label='年检日期'>
          </el-table-column>
          <el-table-column
            prop='tesmdTearcheckdescName'
            label='年检情况'>
          </el-table-column>
          <el-table-column
            prop='tesmdIsconsumable'
            label='是否耗材'
            :formatter="formatterData">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200px">
            <template slot-scope="scope">
              <el-button  type="text" size="small" @click="editInfo(scope.row)">
                <i class="fa fa-edit"></i> 编辑</el-button>
              <el-button type="text" size="small"  @click="deleteInfo(scope.row.tsemdId)">
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
    </b-card>
    <el-dialog :close-on-click-modal="false" @close='closeDialog' :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="managementDetailForm" :rules="rules" ref="managementDetailForm" status-icon size="medium" label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备编号" prop="tesmdNumber">
              <el-input v-model="managementDetailForm.tesmdNumber" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="启用日期" prop="tesmdBegindate">
              <el-date-picker v-model="managementDetailForm.tesmdBegindate" type="datetime" style="width: 100%"
                              format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
            <el-form-item label="所在位置" prop="tesmdLocation">
              <el-input v-model="managementDetailForm.tesmdLocation" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任部门" prop="tesmdDutydept">
              <el-select v-model="managementDetailForm.tesmdDutydept" filterable clearable @change="getDeptUserList(managementDetailForm.tesmdDutydept)">
                <el-option
                  v-for="item in deptList"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="责任人" prop="tesmdDutypeople">
              <el-select v-model="managementDetailForm.tesmdDutypeople" filterable clearable>
                <el-option
                  v-for="item in deptUserList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="tesmdStatus">
              <el-select v-model="managementDetailForm.tesmdStatus" filterable clearable>
                <el-option
                  v-for="item in statusList"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode">
                </el-option>
              </el-select>
            </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="年检日期" prop="tesmdYearcheckdate">
              <el-date-picker v-model="managementDetailForm.tesmdYearcheckdate" type="datetime" style="width: 100%"
                              format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
            <el-form-item label="年检情况" prop="tesmdTearcheckdesc">
              <el-select v-model="managementDetailForm.tesmdTearcheckdesc" filterable clearable>
                <el-option
                  v-for="item in yearCheckList"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否耗材" prop="tesmdIsconsumable">
              <el-switch
                v-model="managementDetailForm.tesmdIsconsumable"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
              >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="background-color: #0081CC"
                   @click="submitData()"
                   element-loading-text="正在保存..."
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(0, 0, 0, 0.1)"
                   v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        <el-button @click="dialogFormVisible = false" style="background-color: #0081CC">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import { formatDate } from '../../utils/index.js'
  import adjunct from "../../components/System/security_notice/SecurityNoticeAdjunct";
  export default {
    name: 'management-detail',
    components: {
      adjunct
    },
    data () {
      return {
        items: [],
        deptList: [],
        deptUserList: [],
        statusList: [],
        yearCheckList: [],
        tesmId: 0,
        userId: 0,
        check: 0,
        flag: 0,
        saveFlag: 0,
        jumpflag: 0,
        fullscreenLoading: false,
        dialogTitle: '新增设备详情',
        dialogFormVisible: false,
        managementForm: {
          tesmdNumber: '',
          tesmdLocation: '',
          tesmdDutydept: 0,
          tesmdDutypeople: 0,
          tesmdBegindate: '',
          tesmdStatus: '',
          tesmdYearcheckdate: '',
          tesmdTearcheckdesc: '',
          tesmdIsconsumable: 0,
          tesmdCreateby: 0,
          tesmdCreatedept: 0,
          tesmdCreatetime: '',
          tesmdStatusName: '',
          tesmdTearcheckdescName: ''
        },
        managementDetailForm: {
          tsemdId: 0,
          tesmId: 0,
          tesmdNumber: '',
          tesmdLocation: '',
          tesmdDutydept: 0,
          tesmdDutypeople: 0,
          tesmdBegindate: '',
          tesmdStatus: '',
          tesmdYearcheckdate: '',
          tesmdTearcheckdesc: '',
          tesmdCreateby: 0,
          tesmdCreatedept: 0,
          tesmdCreatetime: '',
          tesmdStatusName: '',
          tesmdTearcheckdescName: '',
          user: {}
        },
        rules: {
          tesmdDutydept: [
            { required: true, message: '请选择责任部门', trigger: 'blur' }
          ],
          tesmdDutypeople: [
            { required: true, message: '请选择责任人', trigger: 'blur' }
          ],
          tesmdStatus: [
            { required: true, message: '请选择状态', trigger: 'blur' }
          ],
          tesmdTearcheckdesc: [
            { required: true, message: '请选择年间情况', trigger: 'blur' }
          ],
          tesmdNumber: [
            { required: true, message: '请输入设备编号', trigger: 'blur' }
          ]
        },
        total: 0,
        curPage: 1,
        pageSize: 20,
        totalPages: 1
      }
    },
    methods: {
      getData () {
        axios.get('/api/security_management/' + this.tesmId)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.managementForm = data.data
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      watch: {
        curPage: function (newValue, oldValue) {
          this.getCheckData()
        }
      },
      getTableData () {
        let pageNo = this.curPage - 1
        axios.get('/api/security_detail/' + this.tesmId + '?pageNum=' + pageNo + '&pageSize=' + this.pageSize)
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
      closeDialog () {
        this.$refs.managementDetailForm.resetFields()
      },
      addNew () {
        this.flag = 1
        this.dialogTitle = '新增设备使用详情'
        this.managementDetailForm = {}
        this.managementDetailForm.tsemdId = 0
        this.managementDetailForm.tesmId = this.tesmId
        this.managementDetailForm.tesmdNumber = ''
        this.managementDetailForm.tesmdLocation = ''
        this.managementDetailForm.tesmdCreateby = this.user.userId
        this.managementDetailForm.tesmdCreatedept = this.user.deptId
        this.managementDetailForm.tesmdCreatetime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        this.managementDetailForm.tesmdStatusName = ''
        this.managementDetailForm.tesmdTearcheckdescName = ''
        this.check = -1
        this.dialogFormVisible = true
        if (this.$refs && this.$refs.managementDetailForm && this.$refs.managementDetailForm.hasOwnProperty('resetFields')) {
          this.$refs.managementDetailForm.resetFields()
        }
        this.getDeptUserList(this.managementDetailForm.tesmdDutydept)
      },
      editInfo (Detail) {
        this.flag = 2
        if (this.$refs && this.$refs.managementDetailForm && this.$refs.managementDetailForm.hasOwnProperty('resetFields')) {
          this.$refs.managementDetailForm.resetFields()
        }
        this.dialogTitle = '修改设备使用详情'
        this.managementDetailForm = JSON.parse(JSON.stringify(Detail))
        if (this.managementDetailForm.tesmdIsconsumable === 0) {
          this.managementDetailForm.tesmdIsconsumable = false
        } else {
          this.managementDetailForm.tesmdIsconsumable = true
        }
        this.check = this.managementDetailForm.tesmdDutydept
        this.managementDetailForm.tesmdCreateby = this.user.userId
        this.managementDetailForm.tesmdCreatedept = this.user.deptId
        this.managementDetailForm.tesmdCreatetime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        this.dialogFormVisible = true
        this.getDeptUserList(this.managementDetailForm.tesmdDutydept)
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
      formatterData: function (row, column) {
        var value = row[column.property]
        if (column.label === '是否耗材') {
          if (parseInt(value) === 0) {
            return '否'
          } else if (parseInt(value) === 1) {
            return '是'
          }
        }
        return value
      },
      submitData () {
        if (this.saveFlag === 1) {
          this.$message({type: 'error', message: '请勿重复保存！'})
          return
        }
        this.fullscreenLoading = true
        this.$refs.managementDetailForm.validate((valid) => {
          if (valid) {
            if (this.managementDetailForm.tesmdIsconsumable === false) {
              this.managementDetailForm.tesmdIsconsumable = 0
            } else if (this.managementDetailForm.tesmdIsconsumable === true) {
              this.managementDetailForm.tesmdIsconsumable = 1
            } else if (this.managementDetailForm.tesmdIsconsumable === undefined) {
              this.managementDetailForm.tesmdIsconsumable = 0
            }
            console.log(this.managementDetailForm)
            axios.post('/api/security_detail', this.managementDetailForm)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                  this.$message({type: 'success', message: this.flag === 1 ? '新增设备使用详情成功' : '修改设备使用详情成功'})
                  this.saveFlag = 1
                  this.dialogFormVisible = false
                  this.flag = 0
                  this.getTableData()
                } else {
                  let msg = {type: 'error', message: (this.flag === 1 ? '新增设备使用详情失败:' : '修改设备使用详情失败:') + data.message}
                  this.$message(msg)
                }
              })
              .catch(response => {
                this.$message({type: 'error', message: '服务器或网络异常'})
              })
          } else {
            return false
          }
          this.fullscreenLoading = false
        })
      },
      deleteInfo (tsemdId) {
        this.$confirm('确定删除该条设备使用详情？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/api/security_detail/' + tsemdId)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.$message({type: 'success', message: '设备使用详情删除成功'})
                this.getTableData()
              } else {
                let msg = {type: 'error', message: '设备使用详情删除失败:' + data.message}
                this.$message(msg)
              }
            })
            .catch(response => {
              this.$message({type: 'error', message: '服务器或网络异常'})
            })
        })
      },
      getDeptUserList (deptId) {
        if (this.managementDetailForm.tesmdDutydept === 0 || deptId === undefined) {
          axios.get('/api/system/user/all')
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                let page = data.data
                this.deptUserList = page || []
              } else {
                alert(data.message)
              }
            })
            .catch(response => {
              alert(response)
            })
        } else {
          if (this.check !== this.managementDetailForm.tesmdDutydept) {
            this.managementDetailForm.tesmdDutypeople = ''
          }
          axios.get('/api/system/user/dept?deptId=' + deptId)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                let page = data.data
                this.deptUserList = page || []
              } else {
                alert(data.message)
              }
            })
            .catch(response => {
              alert(response)
            })
        }
      },
      getStatusList () {
        axios.get('/api/system/dictionary/by_type?dictType=EQUIPMENT_STATUS')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.statusList = page
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      getYearCheckList () {
        axios.get('/api/system/dictionary/by_type?dictType=ANNUAL_INSPECTION')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.yearCheckList = page
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      getDeptList () {
        axios.get('/api/system/dept/children')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              let page = data.data
              this.deptList = page || []
            } else {
              alert(data.message)
            }
          })
          .catch(response => {
            alert(response)
          })
      },
      resetInfo () {
        this.managementForm = {}
      }
    },
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    created () {
      if (process.env.NODE_ENV === 'production') {
        this.uploadUrl = 'http://' + window.location.hostname + ':' + window.location.port + '/file/upload'
      } else {
        this.uploadUrl = 'http://47.98.173.73:8080/file/upload'
      }
      this.tesmId = +this.$route.params.tesmId
      this.jumpflag = +this.$route.params.flag
      this.getData()
      this.getDeptList()
      this.getYearCheckList()
      this.getTableData()
      this.getStatusList()
      this.getDeptUserList()
    }
  }
</script>

<style scoped>
  .el-table th {
    background-color: #0081CC !important;
    color: white;
  }
</style>
