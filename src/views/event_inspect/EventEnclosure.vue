<template>
  <b-card no-body>
    <div slot="header">
        附件

    </div>
    <b-card-body>
      <el-upload
        class="upload-notice-form"
        :action="submitUrl ? submitUrl : uploadUrl"
        :on-change="handleChange"
        :file-list="fileList"
        :on-success="upLoadSuccessHandler"
        :on-remove="loadChangeHandler"
        >
        <el-button size="small" type="primary" v-if='isShow'>点击上传</el-button>

      </el-upload>
       <div class="mt-10">
        
        <el-col>
            <div v-for='(file,index) in fileInfoInfo' :key='index'>
                  <el-tag type="success"  size='mini' >
                      {{file.fileName}}
                  </el-tag>
                  <el-button
                      @click.native.prevent="deleteRow(file, index)"
                      type="text"
                      size="mini">
                        下载
                  </el-button>
            </div>
            
        </el-col>
        
      </div>
    </b-card-body>
  </b-card>
</template>
<script>
import { getAttachmentList } from '../../services/safety_notice'
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
      fileInfoInfo: [],
      isShow: true,
      eventNumber: 0,
      procStatus: 0,
      uploadUrl: ''
    }
  },
  props: ['safetyId', 'flag', 'taskId', 'tableName', 'submitUrl'],
  methods: {
    handleChange (file, fileList) {
      this.fileList = fileList.slice(-3)
    },
    upLoadSuccessHandler (file, fileList) {
      let user = this.$store.state.user
      let index = fileList.name.lastIndexOf('.') + 1
      let fileForm = {
        fileName: fileList.name,
        fileExtName: fileList.name.substr(index),
        fileUrl: fileList.response.data,
        id: 0,
        procStatus: this.procStatus,
        uploader: user.userId,
        uploaderName: user.userName
      }

      this.fileFormList.push(fileForm)
      let data = {
        attachmentDOList: [],
        eventNumber: this.eventNumber
      }
      data.attachmentDOList = this.fileFormList
      axios.post('/api/incdent/event/addAccessory', data)
        .then(res => {
        })
    },
    loadChangeHandler (data) {
      if (this.fileFormList.length > 0) {
        let index = this.fileFormList.findIndex(item => {
          return item.data === '' || item.data === null
        })
        this.fileFormList.splice(index, 1)
      }
    },
    deleteRow (file, index) {
      axios({
        method: 'get',
        url: '/file/download?' + 'filename=' + file.fileUrl,
        responseType: 'blob'
      })
        .then(res => {
          let headers = res.headers
          let blob = new Blob([res.data], { type: headers['content-type'] })
          let title = file.fileName
          if ('msSaveOrOpenBlob' in navigator) {
            window.navigator.msSaveOrOpenBlob(blob, title)
          } else {
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = title
            link.click()
          }
        })
    }
  },
  created () {
    if (+this.$route.query.flag === 2) {
      this.isShow = false
    } else {
      this.isShow = true
    }
    if (this.tableName) {
      var tableName = this.tableName
    } else {
      tableName = 't_safety_annoucement'
    }
    let safetyId = this.safetyId || this.$route.query.safetyId
    if (safetyId) {
      getAttachmentList(this.safetyId, tableName).then(result => {
        let data = result.data
        if (+data.error === 0) {
          this.fileInfoInfo = data.data.map(item => {
            return {
              fileName: item.fileName,
              fileUrl: item.fileUrl
            }
          })
        }
      })
    }
    if (process.env.NODE_ENV === 'production') {
      this.uploadUrl = 'http://' + window.location.hostname + ':' + window.location.port +  '/file/upload'
    } else {
      this.uploadUrl = 'http://47.98.173.73:8080/file/upload'
    }
  }
}
</script>

