<template>
  <b-card no-body>
    <div slot="header">
        Attachment

      <div class="card-actions">
        <b-btn class="btn btn-minimize" v-b-toggle.collapse4><i class="icon-arrow-up"></i></b-btn>
      </div>
    </div>
    <b-collapse id="collapse4" :visible='true'>
    <b-card-body>
      <el-upload
        class="upload-notice-form"
		    :action="submitUrl ? submitUrl : uploadUrl"
        :on-change="handleChange"
        :file-list="fileList"
        :on-success="upLoadSuccessHandler"
        :on-remove="loadChangeHandler"
        >
        <el-button size="small" type="primary" v-if='isShow'>Uploading</el-button>

      </el-upload>
      <div class="mt-10">

        <el-col>
            <div v-for='(file,index) in fileInfo' :key='index'>
                  <el-tag type="success"  size='mini' @click='downLoadFile'>
                      {{file.fileName}}
                  </el-tag>
                  <el-button
                      @click.native.prevent="downLoadFile(file, index)"
                      type="text"
                      size="mini">
                        download
                  </el-button>
            </div>

        </el-col>

      </div>
    </b-card-body>
    </b-collapse>
  </b-card>
</template>
<script>
import {
  getAttachmentList,
  arrachSave
} from '../../../services/safety_notice'
import {API} from '../../../api/index.js'
import axios from 'axios'
export default {

  data () {
    return {
      fileList: [],
      fileForm: {
        fileName: '',
        fileExtName: '',
        fileUrl: '',
        id: 0,
        procStatus: 0,
        sourceTable: 'string',
        uploadTime: '',
        uploader: 0,
        uploaderName: ''
      },
      fileFormList: [],
      fileInfo: [],
      isShow: true,
      uploadUrl: ''
    }
  },
  props: ['safetyId', 'flag', 'taskId', 'tableName', 'submitUrl', 'uploadFile'],
  methods: {
    handleChange (file, fileList) {
      this.fileList = fileList.slice(-3)
    },
    // 上传赋值
    upLoadSuccessHandler (file, fileList) {
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
        sourceNumber: this.safetyId || '',
        sourceTable: this.tableName || 't_safety_annoucement'
      }

      this.fileFormList.push(fileForm)

      if (this.uploadFile && fileForm) {
        setTimeout(this.uploadFileForm(fileForm), 0)
      }
    },
    // 删除
    loadChangeHandler (data) {
      if (this.fileFormList.length > 0) {
        let index = this.fileFormList.findIndex(item => {
          return item.data === '' || item.data === null
        })
        this.fileFormList.splice(index, 1)
      }
    },
    // 单个上传
    uploadFileForm (fileForm) {
      if (fileForm) {
        let arrList = []
        arrList.push(fileForm)

        arrachSave(arrList).then(result => {
          this.arrList = []
        })
      }
    },
    // fileDownload文件下载
    downLoadFile (file, index) {
      let { fileName, fileUrl } = file
      axios({
        method: 'get',
        url: API.FILE_DOWNLOAD + '?filename=' + fileUrl,
        responseType: 'blob'
      }).then(res => {
        let headers = res.headers
        let blob = new Blob([res.data], {type: headers['content-type']})
        let title = fileName
        if ('msSaveOrOpenBlob' in navigator) {
          // Microsoft Edge and Microsoft Internet Explorer 10-11
          window.navigator.msSaveOrOpenBlob(blob, title)
        } else {
          // standard code for Google Chrome, Mozilla Firefox etc
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = title
          link.click()
        }
      })
    }
  },
  created () {
    if (+this.$route.query.flag === 2 || +this.flag === 2) {
      this.isShow = false
    } else {
      this.isShow = true
    }
    var tableName = ''
    if (this.tableName) {
      tableName = this.tableName
    } else {
      tableName = 't_safety_annoucement'
    }
    let safetyId = this.safetyId || this.$route.query.safetyId
    // console.log(safetyId)
    if (safetyId) {
      // console.log(this.safetyId, tableName)
      getAttachmentList(this.safetyId, tableName).then(result => {
        let data = result.data
        // console.log(data)
        if (+data.error === 0) {
          this.fileInfo = data.data.map(item => {
            return {
              fileName: item.fileName,
              fileExtName: item.fileExtName,
              fileUrl: item.fileUrl,
              id: item.id,
              procStatus: item.procStatus,
              uploader: item.uploader,
              uploaderName: item.uploaderName,
              sourceNumber: item.sourceNumber,
              sourceTable: item.sourceTable,
              uploadTime: item.uploadTime
            }
          })
          console.log(this.fileInfo)
        }
      })
    }

    if (process.env.NODE_ENV === 'production') {
      this.uploadUrl = 'http://' + window.location.hostname + ':' + window.location.port +  '/file/upload'
    } else {
      this.uploadUrl = 'http://47.98.173.73:8080/file/upload'
    }
  },
  mounted () {
 
  }
}
</script>

