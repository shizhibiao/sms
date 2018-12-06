<template>
        <el-dialog :title="this.tit||'措施建议'" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="form">
            <el-form-item label="意见" label-width="20%">
              <el-input v-model="form.advise" auto-complete="off" maxlength="200"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="agreeAction">同意</el-button>
            <el-button type="danger"  @click="cancelAction" v-if='cancelHide'>驳回</el-button>
            <el-button @click="hide">关闭</el-button>
        </div>
        </el-dialog>

</template>

<script>
export default{
  name: 'Opinion',
  data () {
    return {
      dialogFormVisible: false,
      form: {
        advise: ''
      }
    }
  },
  props: ['cancelHide', 'tit'],
  methods: {
    show () {
      this.dialogFormVisible = true
    },
    hide () {
      this.dialogFormVisible = false
    },
    agreeAction () {
      this.$emit('agreeAction', this.form)
    },
    cancelAction () {
      this.$emit('rejectAction', this.form)
      this.hide()
    }
  }
}
</script>
