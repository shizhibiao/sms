<template>
  <div class="animated fadeIn">
    <b-card no-body>
      <b-card-header>
        <el-row :gutter="12">
          <el-col :span="18">
            <el-form inline :model="dataList" ref="dataList">
              <el-form-item label="手册规章类型" prop="ruleType">
                <el-select v-model="dataList.ruleType" clearable>
                    <el-option v-for="(item, index) in rulesTypeData" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6" class="text-right">
            <el-button size='small' type="primary" @click="resetBtnData()">重置</el-button>
            <el-button size='small' type="primary" @click="inquireDataList">查询</el-button>
            <el-button size='small' type="success" @click="goReportStat">新增</el-button>
          </el-col>
        </el-row>
      </b-card-header>
      <b-card-body>
        <el-table
            size="small"
            :data="tableDataList"
            :stripe="true"
            :highlight-current-row ="true"
            style="width: 100%">
            <!-- 外部表 -->
            <el-table-column
                label="#"
                prop="index"
                width="50">
            </el-table-column>
            <el-table-column
                label="上传时间"
                prop="uploadTime">
            </el-table-column>
            <el-table-column
                label="上传人"
                prop="uploaderName">
            </el-table-column>
            <el-table-column
                label="手册规章名称"
                style="width: 100%"
                prop="ruleName">
            </el-table-column>
            <el-table-column
                label="大小"
                prop="fileSize">
            </el-table-column>
            <el-table-column
                label="所属类别"
                prop="ruleType">
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                <el-button type="danger" size='mini'
                    @click="listHandleRemove(scope.$index, scope.row)">删除</el-button>
                <el-button type="primary" size='mini'
                    @click="downloadAction(scope.$index, scope.row)">下载</el-button>
                </template>
            </el-table-column>
        </el-table>
      </b-card-body>
      <div class="block" style="margin-top: 16px;">
        <b-row>
          <b-col md="12" class="my-1 mt-1" v-if="totalPages > 1">
              <el-pagination
                  background
                  :pager-count="5"
                  :current-page.sync="pageNum"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="total"
                  align="right">
              </el-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
    <el-dialog title="新增规章" :visible.sync="adviceContentFormVisible" width="50%">
        <el-form :model="contentForm" ref='contentForm' inline-message :rules="rules">
            <el-form-item label="规章制度" prop="bylaws">
                <el-radio v-model="contentForm.bylaws" label='1'>局方规章</el-radio>
                <el-radio v-model="contentForm.bylaws" label='2'>公司规章</el-radio>
                <el-radio v-model="contentForm.bylaws" label='3'>公司制度</el-radio>
            </el-form-item>
        </el-form>
        <el-upload
            style="float: right;"
            class="upload-demo"
            :action="uploadUrl"
            :on-error="uploadError"
            :on-success="upLoadSuccessHandler"
            multiple
            :limit="1"
            :file-list="fileList"
            :show-file-list = false
            :disabled="disableds === false">
            <el-button size="small" type="primary" @click="handleClick" :disabled="disableds === false">上传文件</el-button>
        </el-upload>
        <el-table
            size="small"
            :data="tableData"
            :stripe="true"
            :highlight-current-row ="true"
            style="width: 100%">
            <el-table-column
                label="手册规章名称"
                prop="name">
            </el-table-column>
            <el-table-column
                label="大小"
                prop="size">
            </el-table-column>
            <el-table-column
                label="最后更新"
                prop="data">
            </el-table-column>
            <!-- <el-table-column
                label="操作">
                <template slot-scope="scope">
                <el-button type="danger" size='mini'
                    @click="handleRemove(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addRegulations"
              v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
            <el-button @click="hide">关闭</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import Vuex from "vuex"
import axios from 'axios'
import {API} from '../../api/index.js'
import { formatDate } from '../../utils/index.js'
import { addRulesRegulations, getListRulesRegulations, deleteRulesRegulations } from '../../services/security_training'
import { arrachSave } from '../../services/safety_notice'

export default {
  data () {
    return {
      dataList: {
        ruleType: ''
      },
      tableDataList: [],
      tableData: [],
      // 弹框
      adviceContentFormVisible: null,
      // 分页数据
      total: 0,
      pageNum: 1,
      pageSize: 15,
      totalPages: 1,
      // 弹框数据
      contentForm: {
        bylaws: 0
      },
      fileList: [],
      // 手册规章类型
      rulesTypeData: [
        {
          dictName: '局方规章',
          dictCode: 1
        },
        {
          dictName: '公司规章',
          dictCode: 2
        },
        {
          dictName: '公司制度',
          dictCode: 3
        }
      ],
      // 上传文件
      disableds: true,
      // 新增参数
      addParams: {},
      // loading
      fullscreenLoading: false,
      rules: {
        bylaws: [
          { required: true, required: true, message: '请选择规章制度', trigger: 'change' }
        ]
      },
      uploadUrl: ''
    }
  },
  computed: {
    ...Vuex.mapState(["ALL_SELECT_DATA"])
  },
  methods: {
    // 文件上传失败时
    uploadError(err, file, fileList) {
      this.$message({
        type: 'error',
        message: '文件上传失败' + err
      })
    },
    // 点击上传文件
    handleClick () {
      // 监听data变化，如果触发多次则必须保存
      this.$watch('tableData', () => {
        if (this.tableData.length >= 1) {
          this.disableds = false
        } else if (this.tableData.length < 1) {
          this.disableds = true
        }
      }, {
        deep: true
      })
    },
    // 上传文件取出相对应的值
    upLoadSuccessHandler (file, fileList) {
      // console.log(file, fileList, 'upLoadSuccessHandler')
      let obj = {}
      obj.name = fileList.name
      const kb = 1024
      const mb = kb * 1024
      const gb = mb * 1024
      if (+fileList.size >= mb) {
        obj.size = (fileList.size / 1024 / 1024).toFixed(1) + 'MB'
      } else if (+fileList.size >= kb) {
        obj.size = (fileList.size / 1024).toFixed(1) + 'KB'
      } else {
        obj.size = fileList.size + 'B'
      }
      obj.data = formatDate(new Date(), 'yyyy-MM-dd')
      if (obj !== null) {
        this.tableData.push(obj)
      }
      // 列表的index
      // if (this.tableData.length) {
      //   for (var i = 0; i < this.tableData.length; i++) {
      //     this.tableData[i].index = i + 1
      //   }
      // }
      let user = this.$store.state.user
      let index = fileList.name.lastIndexOf('.') + 1
      let fileForm = {
        fileName: fileList.name,
        fileExtName: fileList.name.substr(index),
        fileUrl: fileList.response.data,
        id: 0,
        procStatus: -1,
        uploader: user.userId,
        uploaderName: user.userName,
        sourceNumber: 0,
        sourceTable: 't_security_training'
      }
      this.uploadFileForm(fileForm)
      // 保存新增所需的参数
      this.addParams = {
        filePath: fileList.response.data,
        fileSize: fileList.size,
        id: 0,
        remark: "",
        ruleName: fileList.name,
        uploadTime: formatDate(new Date(), 'yyyy-MM-dd'),
        uploader: user.userId,
        uploaderName: user.userName
      }
    },
    // 单个文件上传
    uploadFileForm (fileForm) {
      if (fileForm) {
        let arrList = []
        arrList.push(fileForm)
        arrachSave(arrList).then(result => {
          this.arrList = []
        })
      }
    },
    // 隐藏弹框
    hide () {
      this.adviceContentFormVisible = false
      // 初始化弹框数据
      this.contentForm.bylaws = 0
      this.fileList = []
      // 清空表格数据
      this.tableData = []
    },
    // 显示弹框
    show () {
      this.adviceContentFormVisible = true
    },
    // 查询列表
    inquireDataList () {
      let ruleType = this.dataList.ruleType ? this.dataList.ruleType : 0
      let pageSize = this.pageSize
      let pageNo = this.pageNum - 1
      getListRulesRegulations(ruleType, pageSize, pageNo).then(result => {
        // console.log(result)
        if (result.data.error === 0 && result.data.data) {
          this.tableDataList = result.data.data.content
          for (var i = 0; i < this.tableDataList.length; i++) {
            this.tableDataList[i].index = i + 1
            const kb = 1024
            const mb = kb * 1024
            const gb = mb * 1024
            if (+this.tableDataList[i].fileSize >= mb) {
              this.tableDataList[i].fileSize = (this.tableDataList[i].fileSize / 1024 / 1024).toFixed(1) + 'MB'
            } else if (+this.tableDataList[i].fileSize >= kb) {
              this.tableDataList[i].fileSize = (this.tableDataList[i].fileSize / 1024).toFixed(1) + 'KB'
            } else {
               this.tableDataList[i].fileSize = this.tableDataList[i].fileSize + 'B'
            }
            let ruleType = this.tableDataList[i].ruleType
            if (ruleType === 1) {
              this.tableDataList[i].ruleType = '局方规章'
            } else if (ruleType === 2) {
              this.tableDataList[i].ruleType = '公司规章'
            } else if (ruleType === 3) {
              this.tableDataList[i].ruleType = '公司制度'
            }
            this.tableDataList[i].uploadTime = this.tableDataList[i].uploadTime.slice(0, 10)
          }
        } else {
          this.tableDataList = []
        }
      })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '查询列表' + error
          })
        })
    },
    // 新建
    goReportStat () {
      this.show()
    },
    // 重置
    resetBtnData () {
      this.$refs.dataList.resetFields()
      // 重置后刷新列表数据
      this.inquireDataList()
    },
    // 列表删除
    listHandleRemove (index, row) {
      // 提示用户是否删除该文件
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(row)
        deleteRulesRegulations(row.id).then(result => {
          if (result.data.error === 0 && result.data.data === true) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              // 查询数据,重新刷新列表
              this.inquireDataList()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败' + result.data.message
              })
            }
          })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '删除失败' + error
              })
            })
      })
        .catch((error) => {
          console.log(error)
        })
    },
    // 下载
    downloadAction (index, row) {
      // console.log(row)
      let { ruleName, filePath } = row
      axios({
        method: 'get',
        url: API.FILE_DOWNLOAD + '?filename=' + filePath,
        responseType: 'blob'
      }).then(res => {
        let headers = res.headers
        let blob = new Blob([res.data], {type: headers['content-type']})
        let title = ruleName
        if ('msSaveOrOpenBlob' in navigator) {
          window.navigator.msSaveOrOpenBlob(blob, title)
        } else {
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = title
          link.click()
        }
      })
    },
    // 新增规章
    addRegulations () {
      if (this.contentForm.bylaws !== 0 && this.tableData.length > 0) {
        let data = {};
        data = this.addParams
        data.ruleType = this.contentForm.bylaws
        // 显示loading
        this.fullscreenLoading = true
        addRulesRegulations(data).then(result => {
          // 关闭loading
          this.fullscreenLoading = false
          if (result.data.error === 0) {
            this.$message({
              type: 'success',
              message: '新增规章成功'
            })
            // 关闭弹框
            this.hide()
            // 查询列表数据
            this.resetBtnData()
          }
        })
          .catch(error => {
            // 关闭loading
            this.fullscreenLoading = false
            this.$message({
              type: 'error',
              message: '新增规章失败：' + error
            })
          })
      } else {
        this.$message({
          type: 'info',
          message: '请选择规章制度并上传一个文件'
        })
      }

    }
  },
  created () {
    // 初始化列表数据
    this.inquireDataList()
    if (process.env.NODE_ENV === 'production') {
      this.uploadUrl = 'http://' + window.location.hostname + ':' + window.location.port + '/file/upload'
    } else {
      this.uploadUrl = 'http://47.98.173.73:8080/file/upload'
    }
  }
}
</script>

