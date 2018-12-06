<template>
  <el-dialog :title="tit"
             :visible.sync="dialogFormVisible"
             width="30%">
    <el-form :model="form"
             inline-message
             label-width="110px"
             size="medium"
             label-position="left">
      <div class="row">
        <div class="col-6">
          <el-form-item label="审核人">
            <span>{{user.userName}}</span>
          </el-form-item>
        </div>
        <div class="col-6">
          <el-form-item label="审核日期">
            <span>{{form.time}}</span>
          </el-form-item>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <el-form-item label="审核结果">
            <el-radio v-model="form.radio"
                      label="1">同意</el-radio>
            <el-radio v-model="form.radio"
                      label="0">退回</el-radio>
          </el-form-item>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <el-form-item label="审核意见">
            <el-input type="textarea"
                      :rows="4"
                      style="width:100%;"
                      placeholder="请输入内容"
                      v-model="form.textarea">
            </el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="sendAction">发送</el-button>
      <el-button @click="hide">关闭</el-button>
    </div>
  </el-dialog>

</template>

<script>
import Vuex from 'vuex'
import { formatDate } from '../../utils'
export default {
  name: 'Opinion',
  data () {
    return {
      dialogFormVisible: false,
      form: {
        time: formatDate(new Date(), 'yyyy-MM-dd'),
        radio: '1',
        textarea: ''
      }
    }
  },
  props: ['tit'],
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  methods: {
    show () {
      this.dialogFormVisible = true
    },
    hide () {
      this.dialogFormVisible = false
    },
    sendAction () {
      this.$emit('send', this.form)
    }
  }
}
</script>
