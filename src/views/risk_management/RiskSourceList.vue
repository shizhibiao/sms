<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-md-4">
        <b-card no-body>
          <div slot="header">
            <strong>过程</strong>
            <button class="btn btn-info btn-sm float-right mt-1" @click="findAll()"><i class="fa fa-refresh"></i> 刷新</button>
          </div>
          <b-card-body style="height:75vh; overflow-y:auto">
            <el-tree :data="categoryList" :props="props" @node-click="handleNodeClick">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-button type="text" size="mini" @click.stop="addChild(data)">添加子过程</el-button>
                  <el-button type="text" size="mini" @click.stop="editData(data)" v-if="data.levelId>1">编辑</el-button>
                  <el-button type="text" size="mini" v-if="data.levelId>1 && (data.children===null || data.children.length===0)"
                             @click.stop="deleteData(data)">删除</el-button>
                </span>
              </span>
            </el-tree>
          </b-card-body>
        </b-card>
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogFormVisible">
          <el-form :model="categoryForm" :rules="categoryRules" ref="categoryForm" status-icon size="medium" label-width="120px">
            <el-row>
              <el-col>
                <el-form-item label="过程名称" prop="categoryName">
                  <el-input v-model="categoryForm.categoryName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="过程说明" prop="categoryDesc">
                  <el-input v-model="categoryForm.categoryDesc" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save()">确 定</el-button>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="col-md-8">
        <b-card no-body>
          <div slot="header">
            <strong>{{curCategory.categoryName}} 危险源: </strong>
            <button class='btn btn-info btn-sm float-right mt-1' @click="addHazardAction"><i class='fa fa-edit'></i> 新增危险源</button>
          </div>
          <b-card-body>
            <b-table show-empty striped hover small
                     :items="riskSourceList"
                     :fields="fields"
                     :current-page="currentPage"
                     :per-page="perPage">
              <template slot="row-details" slot-scope="row">
                <b-card no-body>
                  <b-card-body>
                      <el-table
                          size="small"
                          :data="tableData">
                          <el-table-column
                              label="#"
                              prop="index"
                              width='50'
                              >
                          </el-table-column>
                          <el-table-column
                              label="根原因"
                              prop="resonName">
                          </el-table-column>
                          <el-table-column
                              label="根原因分析"
                              prop="resonDesc">
                          </el-table-column>
                      </el-table>
                  </b-card-body>
                </b-card>
              </template>
              <template slot="actions" slot-scope="row">

                <!-- <b-button size="sm" class="btn-info"> 编辑</b-button>
                <b-button size="sm" class="btn-danger"> 删除</b-button> -->
                <b-button size="sm" class="btn-default" @click="clickAction(row)" @click.stop="row.toggleDetails">根原因</b-button>
              </template>
            </b-table>
            <b-row>
              <b-col md="12" class="my-1 mt-1" v-if="totalPage > 1">
                <el-pagination
                  background
                  :pager-count="5"
                  :current-page.sync="currentPage"
                  :page-size="perPage"
                  layout="total, prev, pager, next, jumper"
                  :total="totalRows"
                  align="right">
                </el-pagination>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'RiskSourceList',
    data () {
      return {
        categoryList: [],
        props: {
          label: 'categoryName',
          children: 'children'
        },
        dialogTitle: '新增过程',
        dialogFormVisible: false,
        categoryForm: {
          id: 0,
          categoryName: '',
          categoryDesc: '',
          parentId: 0,
          levelId: 0
        },
        categoryRules: {
          categoryName: [
            { required: true, message: '请输入过程名称', trigger: ['blur', 'change'] }
          ]
        },
        curCategory: {},
        riskSourceList: [],
        fields: [
          {key: 'riskNo', label: '危险源编号'},
          {key: 'riskDesc', label: '危险源描述'},
          {key: 'riskResult', label: '可能导致的风险或结果'},
          {key: 'riskGrade', label: '风险等级'},
          {key: 'acception', label: '可接受程度'},
          {key: 'riskMeasure', label: '风险管控措施或对应规程编号'},
          {key: 'controlMeasure', label: '管控措施'},
          {key: 'actions', label: '操作'}
        ],
        currentPage: 1,
        perPage: 15,
        tableData: []
      }
    },
    methods: {
      findAll () {
        axios.get('/api/risk_category')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.categoryList = data.data
            }
          })
      },
      handleNodeClick (data) {
        this.curCategory = data
        this.riskSourceList = []
        this.findRiskSourceByCategoryId()
        window.scroll(0, 0)
      },
      addChild (data) {
        this.dialogTitle = '新增过程'
        this.categoryForm = {}
        this.categoryForm.id = 0
        this.categoryForm.categoryName = ''
        this.categoryForm.categoryDesc = ''
        this.categoryForm.parentId = data.id
        this.categoryForm.levelId = data.levelId + 1
        this.dialogFormVisible = true
        if (this.$refs && this.$refs.categoryForm && this.$refs.categoryForm.hasOwnProperty('resetFields')) {
          this.$refs.categoryForm.resetFields()
        }
      },
      editData (data) {
        if (this.$refs && this.$refs.categoryForm && this.$refs.categoryForm.hasOwnProperty('resetFields')) {
          this.$refs.categoryForm.resetFields()
        }
        this.dialogTitle = '修改过程'
        this.categoryForm = JSON.parse(JSON.stringify(data))
        this.dialogFormVisible = true
      },
      deleteData (data) {
        this.$confirm('确定删除该过程？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/api/risk_category/' + data.id)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.$message({type: 'success', message: '数据删除成功'})
                this.findAll()
              } else {
                let msg = {type: 'error', message: '数据删除失败:' + data.message}
                this.$message(msg)
              }
            })
            .catch(response => {
              this.$message({type: 'error', message: '服务器或网络异常'})
            })
        })
      },
      save () {
        this.$refs.categoryForm.validate((valid) => {
          if (valid) {
            axios.post('/api/risk_category', this.categoryForm)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                  this.$message({type: 'success', message: '新增过程成功'})
                  this.dialogFormVisible = false
                  this.findAll()
                } else {
                  let msg = {type: 'error', message: '新增过程失败:' + data.message}
                  this.$message(msg)
                }
              })
              .catch(response => {
                this.$message({type: 'error', message: '服务器或网络异常'})
              })
          }
        })
      },
      findRiskSourceByCategoryId () {
        axios.get('/api/risk_source/category/' + this.curCategory.id + '/all')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.riskSourceList = data.data
            }
          })
      },
      // 新增危险源
      addHazardAction () {
        this.$router.push({path: '/risk/add-hazard'})
      },
      // 点击根原因
      clickAction (row) {
        // if (expandedRows.length > 1) {
        //   expandedRows.shift()
        // }
        let riskId = row.item.riskId
        let url = '/api/risk_source/reasons'
        axios.get(url + '/' + riskId)
          .then(result => {
            if (result.data.error === 0 && result.data.data !== null) {
              this.tableData = result.data.data
              for (var i = 0; i < this.tableData.length; i++) {
                this.tableData[i].index = i + 1
              }
            }
          })
          .catch((error) => { console.log(error) })
      }
    },
    computed: {
      totalPage () {
        return this.riskSourceList.length / this.perPage
      },
      totalRows () {
        return this.riskSourceList.length
      }
    },
    created () {
      this.findAll()
    }
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-dialog {
    width:400px !important;
  }
</style>
