<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <div slot="header">
        <button class="btn btn-info btn-sm float-right mt-1 ml-1" @click="refresh()"><i class="fa fa-refresh"></i> 刷新</button>
        <button class="btn btn-info btn-sm float-right mt-1 ml-1" @click="addNew()"><i class="fa fa-codepen"></i> 部署</button>
      </div>
      <b-card-body>
        <b-table show-empty striped hover
                 :items="flows"
                 :fields="fields"
                 :current-page="currentPage"
                 :per-page="perPage">
          <template slot="actions" slot-scope="row">
            <b-button size="sm" class="btn-primary" @click="showImage(row.item.deploymentId)"> 查看</b-button>
            <b-button size="sm" class="btn-danger" @click="deleteFlow(row.item.deploymentId)" v-loading.fullscreen.lock="fullscreenLoading"> 删除</b-button>
          </template>
        </b-table>
        <b-row>
          <b-col md="12" class="my-1 mt-1" v-if="totalPage > 1">
            <!--<b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />-->
            <el-pagination
              background
              :pager-count="5"
              :current-page.sync="curPage"
              :page-size="perPage"
              layout="total, prev, pager, next, jumper"
              :total="totalRows"
              align="right">
            </el-pagination>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
    <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" status-icon :inline-message="true"
               size="medium" label-width="150px">
        <el-form-item label="流程编码" prop="key">
          <el-input v-model="form.key" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="流程文件名" prop="fileName">
          <el-input v-model="form.fileName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deployFlowFile()" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'ActivitiManager',
    data () {
      return {
        flows: [],
        curFlow: {},
        fields: [
          {key: 'name', label: '流程名'},
          {key: 'key', label: '代码'},
          {key: 'version', label: '版本'},
          {key: 'deploymentId', label: '流程号'},
          {key: 'category', label: '类型'},
          {key: 'description', label: '流程描述'},
          // {key: 'resourceName', label: '流程文件'},
          // {key: 'diagramResourceName', label: '图文件'},
          {key: 'actions', label: '操作'}
        ],
        currentPage: 1,
        perPage: 15,
        dialogTitle: '部署流程',
        dialogFormVisible: false,
        form: {
          key: '',
          fileName: ''
        },
        rules: {
          key: [
            { required: true, message: '请输入流程代码', trigger: 'blur' },
            { min: 2, max: 50, message: '长度至少在 2 个字符', trigger: 'blur' }
          ],
          fileName: [
            { required: true, message: '请输入流程文件名', trigger: 'blur' },
            { min: 2, max: 50, message: '长度至少在 2 个字符', trigger: 'blur' }
          ]
        },
        fullscreenLoading: false
      }
    },
    methods: {
      refresh () {
        this.getDeployed()
      },
      getDeployed () {
        axios.get('/api/activiti/list')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.flows = data.data
            }
          })
      },
      addNew () {
        this.dialogTitle = '发布流程'
        this.form.key = ''
        this.form.fileName = ''
        this.dialogFormVisible = true
      },
      deployFlowFile () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.fullscreenLoading = true
            axios.get('/api/activiti/deploy?flowName=' + this.form.key + '&bpmnFile=' + this.form.fileName)
              .then(response => {
                this.fullscreenLoading = false
                let data = response.data
                if (data && data.error === 0) {
                  this.$message({type: 'success', message: '流程部署成功'})
                  this.dialogFormVisible = false
                  this.refresh()
                } else {
                  let msg = {type: 'error', message: '流程部署失败:' + data.message}
                  this.$message(msg)
                }
              })
              .catch(response => {
                this.fullscreenLoading = false
                this.$message({type: 'error', message: '服务器或网络异常'})
              })
          }
        })
      },
      deleteFlow (id) {
        this.$confirm('确定删除该流程？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fullscreenLoading = true
          axios.delete('/api/activiti/delete/' + id)
            .then(response => {
              this.fullscreenLoading = false
              let data = response.data
              if (data && data.error === 0) {
                this.refresh()
              } else {
                this.$message({type: 'info', message: '删除失败'})
              }
            })
            .catch(response => {
              this.fullscreenLoading = false
              this.$message({type: 'error', message: '服务器或网络异常'})
            })
        })
      },
      showImage (id) {
        let url = '/system/jbpm/' + id
        this.$router.push({path: url})
      }
    },
    computed: {
      totalPage () {
        return this.flows.length / this.perPage
      },
      totalRows () {
        return this.flows.length
      }
    },
    created () {
      this.getDeployed()
    }
  }
</script>

<style scoped>
  >>> .el-dialog {
    width:500px !important;
  }
</style>
