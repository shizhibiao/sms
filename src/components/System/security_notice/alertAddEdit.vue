<template>
    <el-dialog title="新增建议" :visible.sync="adviceContentFormVisible" width='35%'>
        <el-form :model="contentForm" :rules="rules" ref='contentForm' inline-message label-width="100px" >
            <el-form-item label="依据" prop="noticeDepend">
                <el-select v-model="contentForm.noticeDepend" placeholder="请选择依据">
                    <el-option :label="item.dictName" :value="item.dictCode" v-for ='(item , index) in ALL_SELECT_DATA.DEPEND_ON.dicts' :key='index'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="noticeContent">
                <el-input v-model="contentForm.noticeContent"></el-input>
            </el-form-item>
            <el-form-item label="建议" prop="noticeSuggest">
                <el-input v-model="contentForm.noticeSuggest"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelHandle">取 消</el-button>
            <el-button type="primary" @click="confirmContent">确 定</el-button>
        </div>
    </el-dialog>

</template>
<script>

export default {

  data () {
    return {

      adviceContentFormVisible: false,
      contentForm: {
        deptContentId: 0,
        safetyDeptId: 0,
        safetyId: 0,
        noticeDepend: '1',
        replayIssue: true,
        noticeContent: '',
        noticeSuggest: ''
      },
      type: '',
      rules: {
        noticeDepend: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        noticeContent: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        noticeSuggest: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      valid: false
    }
  },
  computed:{
    ALL_SELECT_DATA(){
      return this.$store.state.ALL_SELECT_DATA
    }
  },
  methods: {
    show () {
      this.adviceContentFormVisible = true
    },
    hide () {
      this.adviceContentFormVisible = false
    },
    confirmContent () {
      let type = this.type
      this.$refs.contentForm.validate((valid) => {
        if (valid) {
          this.valid = true
        } else {
          this.valid = false
        }
      })
      if (this.valid) {
        // 新增
        if (type && type === 'add') {
          this.$emit('subConfirmContent', this.contentForm)
          this.type = ''
        // 批量新增
        }else if(type && type === 'batchAdd'){
          this.$emit('batchAddContent', this.contentForm)
        }else if(type && type ==="batchEditContent"){
        // 批量新增里修改
           this.$emit('batchEditContent', this.contentForm)
        }else {
        // 修改
          this.$emit('editConfirmContent', this.contentForm)
        }
        this.hide()
      } else {
        this.$message({
          type: 'error',
          message: '请填写必填内容'
        })
      }
    },
    handleBatchEditContent(){
      this.type = 'batchEditContent'
      this.show()
    },
    handleEditContent (index, params) {
      this.type = ''
      this.show()
    },
    handlerAddBtn () {
      this.show()
      if (this.$refs && this.$refs.contentForm && this.$refs.contentForm.hasOwnProperty('resetFields')) {
        this.$refs.contentForm.resetFields()
      }
      this.type = 'add'
    },
    cancelHandle () {
      this.adviceContentFormVisible = false
      this.$emit('userCanel')
    },
    // 多选添加
    handlerBatchAddBtn () {
      this.show()
      // 再次打开清空
      if (this.$refs && this.$refs.contentForm && this.$refs.contentForm.hasOwnProperty('resetFields')) {
        this.$refs.contentForm.resetFields()
      }
      this.type = 'batchAdd'
    },
  }

}
</script>
<style>

