<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-md-3" ref="dictTypeList">
        <b-card no-body>
          <div slot="header">
            <strong>字典类型</strong>
            <button class="btn btn-info btn-sm float-right mt-1" @click="refresh()"><i class="fa fa-refresh"></i> 刷新</button>
          </div>
          <b-card-body style="height:75vh; overflow-y:auto">
            <b-list-group  v-for="(dictType, index) in dictTypes" :key="index">
              <b-list-group-item button @click="setActiveDictType(dictType)">{{dictType.dictTypeDesc}}</b-list-group-item>
            </b-list-group>
          </b-card-body>
        </b-card>
      </div>
      <div class="col-md-9">
        <b-card no-body>
          <div slot="header">
            <strong>字典项 {{curDict.dictTypeDesc}}</strong>
            <button class='btn btn-info btn-sm float-right mt-1' @click="addNew()"><i class='fa fa-edit'></i> 新增</button>
         </div>
          <b-card-body>
            <b-table show-empty striped hover small
                     :items="dictItems"
                     :fields="fields"
                     :current-page="currentPage"
                     :per-page="perPage">
              <template slot="enableState" slot-scope="row">{{row.item.enableState ? '正常' : '失效'}}</template>
              <template slot="actions" slot-scope="row">
                <b-button size="sm" class="btn-primary" @click="editItem(row.item)"> 编辑</b-button>
                <b-button size="sm" class="btn-danger" @click="deleteItem(row.item.dictId)"> 删除</b-button>
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
    <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="dictForm" :rules="rules" ref="dictForm" status-icon :inline-message="true"
               size="medium" label-width="150px">
          <el-form-item label="数据编码" prop="dictCode">
            <el-input v-model="dictForm.dictCode" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="数据名称" prop="dictName">
            <el-input v-model="dictForm.dictName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="英文名称" prop="dictNameEn">
            <el-input v-model="dictForm.dictNameEn" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="字典类型" prop="dictType">
            <el-input v-model="dictForm.dictType" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="字典类型说明" prop="dictTypeDesc">
            <el-input v-model="dictForm.dictTypeDesc" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="启用" prop="enableState">
            <el-switch v-model="dictForm.enableState" active-text="启用" inactive-text="禁用"></el-switch>
          </el-form-item>
          <el-form-item label="排序序号" prop="orderNo">
            <el-input type="number" v-model.number="dictForm.orderNo" auto-complete="off"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveItem()">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Dictionary',
    data () {
      return {
        dictTypes: [],
        curDict: {},
        dictItems: [],
        fields: [
          {key: 'dictCode', label: '编码', sortable: true},
          {key: 'dictName', label: '名称'},
          {key: 'dictNameEn', label: '英文名称'},
          {key: 'enableState', label: '状态'},
          {key: 'orderNo', label: '排序号'},
          {key: 'actions', label: '操作'}
        ],
        currentPage: 1,
        perPage: 15,
        dialogTitle: '新增数据项',
        dialogFormVisible: false,
        dictForm: {
          dictId: 0,
          dictCode: '',
          dictName: '',
          dictNameEn: '',
          dictType: '',
          dictTypeDesc: '',
          parentDictId: 0,
          enableState: true,
          orderNo: 1
        },
        rules: {
          dictCode: [
            { required: true, message: '请输入数据项编码', trigger: 'blur' },
            { min: 1, max: 20, message: '长度至少在 1 个字符', trigger: 'blur' }
          ],
          dictName: [
            { required: true, message: '请输入数据项名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度至少在 2 个字符', trigger: 'blur' }
          ],
          dictType: [
            { required: true, message: '请输入字典类型', trigger: 'blur' },
            { min: 2, max: 20, message: '长度至少在 2 个字符', trigger: 'blur' }
          ],
          dictTypeDesc: [
            { required: true, message: '请输入字典类型说明', trigger: 'blur' },
            { min: 2, max: 50, message: '长度至少在 2 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      refresh () {
        this.getDictType()
      },
      getDictType () {
        axios.get('/api/system/dictionary/all')
          .then(response => {
            let data = response.data
            if (data && data.error === 0) {
              this.dictTypes = data.data
              if (this.dictTypes.length > 0) {
                this.curDict = this.dictTypes[0]
                this.dictItems = this.curDict.dicts
              }
            }
          })
      },
      setActiveDictType (dictType) {
        this.curDict = dictType
        this.dictItems = this.curDict.dicts
        window.scroll(0, 0)
      },
      addNew () {
        this.dialogTitle = '新增数据项'
        this.dictForm.dictId = 0
        this.dictForm.dictCode = ''
        this.dictForm.dictName = ''
        this.dictForm.dictNameEn = ''
        this.dictForm.dictType = this.curDict.dictType
        this.dictForm.dictTypeDesc = this.curDict.dictTypeDesc
        this.dictForm.enableState = true
        this.dictForm.orderNo = 10
        this.dialogFormVisible = true
        if (this.$refs && this.$refs.dictForm && this.$refs.dictForm.hasOwnProperty('resetFields')) {
          this.$refs.dictForm.resetFields()
        }
      },
      editItem (item) {
        if (this.$refs && this.$refs.dictForm && this.$refs.dictForm.hasOwnProperty('resetFields')) {
          this.$refs.dictForm.resetFields()
        }
        this.dialogTitle = '修改数据项'
        this.dictForm = JSON.parse(JSON.stringify(item))
        this.dialogFormVisible = true
      },
      saveItem () {
        // if (this.dictForm.dictCode === '')
        this.$refs.dictForm.validate((valid) => {
          if (valid) {
            axios.post('/api/system/dictionary/item', this.dictForm)
              .then(response => {
                let data = response.data
                if (data && data.error === 0) {
                  this.$message({type: 'success', message: '保存数据项成功'})
                  this.dialogFormVisible = false
                  this.refresh()
                } else {
                  let msg = {type: 'error', message: '保存数据项失败:' + data.message}
                  this.$message(msg)
                }
              })
              .catch(response => {
                this.$message({type: 'error', message: '服务器或网络异常'})
              })
          }
        })
      },
      deleteItem (itemId) {
        this.$confirm('确定删除该数据项？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/api/system/dictionary/item/' + itemId)
            .then(response => {
              let data = response.data
              if (data && data.error === 0) {
                this.refresh()
              } else {
                this.$message({
                  type: 'info',
                  message: '删除失败'
                })
              }
            })
            .catch(response => {
              alert(response)
            })
        }).catch(() => {
        })
      }
    },
    computed: {
      totalPage () {
        return this.dictItems.length / this.perPage
      },
      totalRows () {
        return this.dictItems.length
      }
    },
    created () {
      this.getDictType()
    }
  }
</script>

<style scoped>
  >>> .el-dialog {
    width:500px !important;
  }
</style>
