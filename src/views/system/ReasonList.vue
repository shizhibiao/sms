<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-md-5">
        <b-card no-body>
          <div slot="header">
            <strong>原因类型</strong>
            <button class="btn btn-info btn-sm float-right mt-1" @click="refresh()"><i class="fa fa-refresh"></i> 刷新</button>
          </div>
          <b-card-body style="height:75vh; overflow-y:auto">
            <el-tree :data="reasons" :props="props" :default-expand-all="true" @node-click="handleNodeClick">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-button type="text" size="mini" @click.stop="addReasonChild(data)">添加子类型</el-button>
                  <el-button type="text" size="mini" v-if="data.children === null || data.children.length === 0"
                             @click.stop="deleteReason(data)">删除类型</el-button>
                </span>
              </span>
            </el-tree>
          </b-card-body>
        </b-card>
      </div>
      <div class="col-md-7">
        <b-card no-body>
          <div slot="header">
            <strong>{{curReason.reasonName}} 原因明细: </strong>
            <button class='btn btn-info btn-sm float-right mt-1' @click="addDetailChild()"><i class='fa fa-edit'></i> 新增</button>
          </div>
          <b-card-body>
            <b-table show-empty striped hover small
                     :items="reasonDetails"
                     :fields="fields"
                     :current-page="currentPage"
                     :per-page="perPage">
              <template slot="actions" slot-scope="row">
                <b-button size="sm" class="btn-primary" @click="editReasonDetail(row.item)"> 编辑</b-button>
                <b-button size="sm" class="btn-danger" @click="deleteDetail(row.item)"> 删除</b-button>
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
    <el-dialog :close-on-click-modal="false" :title="reasonTitle" :visible.sync="reasonFormVisible">
      <el-form :model="reasonForm" :rules="reasonRules" ref="reasonForm" status-icon size="medium" label-width="150px">
        <el-row>
          <el-col>
            <el-form-item label="类型名称" prop="reasonName">
              <el-input v-model="reasonForm.reasonName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="类型说明" prop="reasonDesc">
              <el-input v-model="reasonForm.reasonDesc" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveReason()">确 定</el-button>
        <el-button @click="reasonFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="detailTitle" :visible.sync="detailFormVisible">
      <el-form :model="detailForm" :rules="detailRules" ref="detailForm" status-icon :inline-message="true"
               size="medium" label-width="150px">
            <el-form-item label="原因名称" prop="reasonName">
              <el-input v-model="detailForm.reasonName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="原因说明" prop="reasonDesc">
              <el-input v-model="detailForm.reasonDesc" auto-complete="off"></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveReasonDetail()">确 定</el-button>
        <el-button @click="detailFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'ReasonList',
    data () {
      return {
        reasons: [],
        props: {
          label: 'reasonName',
          children: 'children'
        },
        reasonTitle: '新增原因类型',
        reasonFormVisible: false,
        reasonForm: {
          id: 0,
          reasonNum: '',
          reasonName: '',
          reasonDesc: '',
          parentId: 0,
          leafNode: 1
        },
        reasonRules: {
          reasonName: [
            { required: true, message: '请输入类型名称', trigger: 'blur' }
          ]
        },
        curReason: {},
        reasonDetails: [],
        fields: [
          {key: 'reasonName', label: '名称'},
          {key: 'reasonDesc', label: '描述'},
          {key: 'actions', label: '操作'}
        ],
        currentPage: 1,
        perPage: 15,
        detailTitle: '新增原因',
        detailFormVisible: false,
        detailForm: {
          id: 0,
          reasonName: '',
          reasonDesc: '',
          reasonId: 0
        },
        detailRules: {
          reasonName: [
            { required: true, message: '请输入原因名称', trigger: ['blur', 'change'] }
          ]
        }
      }
    },
    methods: {
      refresh () {
        this.getReason()
      },
      getReason () {
        axios.get('/api/reason')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.reasons = data.data
            }
          })
      },
      handleNodeClick (data) {
        this.curReason = data
        axios.get('/api/reason/detail/' + data.id)
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.reasonDetails = data.data
            }
          })
        window.scroll(0, 0)
      },
      addReasonChild (data) {
        this.reasonTitle = '新增原因类型'
        this.reasonForm.id = 0
        this.reasonForm.reasonName = ''
        this.reasonForm.reasonDesc = ''
        this.reasonForm.parentId = data.id
        this.reasonForm.leafNode = 1
        this.reasonFormVisible = true
        if (this.$refs && this.$refs.reasonForm && this.$refs.reasonForm.hasOwnProperty('resetFields')) {
          this.$refs.reasonForm.resetFields()
        }
      },
      saveReason () {
        this.$refs.reasonForm.validate((valid) => {
          if (valid) {
            axios.post('/api/reason', this.reasonForm)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                  this.$message({type: 'success', message: '原因类型新增成功'})
                  this.reasonFormVisible = false
                  this.refresh()
                } else {
                  let msg = {type: 'error', message: '原因类型新增失败:' + data.message}
                  this.$message(msg)
                }
              })
              .catch(response => {
                this.$message({type: 'error', message: '服务器或网络异常'})
              })
          }
        })
      },
      deleteReason (data) {
        this.$confirm('确定删除该原因分类？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/api/reason/' + data.id)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.$message({type: 'success', message: '数据删除成功'})
                this.refresh()
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
      addDetailChild () {
        this.detailTitle = '新增原因'
        this.detailForm.id = 0
        this.detailForm.reasonName = ''
        this.detailForm.reasonDesc = ''
        this.detailForm.reasonId = this.curReason.id
        this.detailFormVisible = true
        if (this.$refs && this.$refs.detailForm && this.$refs.detailForm.hasOwnProperty('resetFields')) {
          this.$refs.detailForm.resetFields()
        }
      },
      saveReasonDetail () {
        this.$refs.detailForm.validate((valid) => {
          if (valid) {
            axios.post('/api/reason/detail', this.detailForm)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                  this.$message({type: 'success', message: '新增原因成功'})
                  this.detailFormVisible = false
                  axios.get('/api/reason/detail/' + this.curReason.id)
                    .then(response => {
                      let data = response.data
                      if (data && data.error === 0) {
                        this.reasonDetails = data.data
                      }
                    })
                } else {
                  let msg = {type: 'error', message: '新增原因失败:' + data.message}
                  this.$message(msg)
                }
              })
              .catch(response => {
                this.$message({type: 'error', message: '服务器或网络异常'})
              })
          }
        })
      },
      editReasonDetail (item) {
        if (this.$refs && this.$refs.detailForm && this.$refs.detailForm.hasOwnProperty('resetFields')) {
          this.$refs.detailForm.resetFields()
        }
        this.detailTitle = '修改原因'
        this.detailForm = JSON.parse(JSON.stringify(item))
        this.detailFormVisible = true
      },
      deleteDetail (data) {
        this.$confirm('确定删除该原因？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/api/reason/detail/' + data.id)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.$message({type: 'success', message: '数据删除成功'})
                this.refresh()
              } else {
                let msg = {type: 'error', message: '数据删除失败:' + data.message}
                this.$message(msg)
              }
            })
            .catch(response => {
              this.$message({type: 'error', message: '服务器或网络异常'})
            })
        })
      }
    },
    computed: {
      totalPage () {
        return this.reasonDetails.length / this.perPage
      },
      totalRows () {
        return this.reasonDetails.length
      }
    },
    created () {
      this.getReason()
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
  >>>.el-dialog {
    width:500px !important;
  }
</style>
