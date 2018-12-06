<template>
  <b-card no-body>
    <div slot="header">
      立项审核
      <div class="card-actions">
          <b-btn class="btn btn-minimize"
                 v-b-toggle.collapse5>
            <i class="icon-arrow-up"></i>
          </b-btn>
        </div>
    </div>
    <b-collapse id="collapse5" :visible='true'>
    <b-card-body>
      <el-form label-width="110px"
               inline-message
                 status-icon
                 size="medium"
               :model="form">
        <el-row>
          <el-form-item label="接收角色">
            <span>立项审核</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="审核意见">
              <el-input type="textarea"
                        :rows="4"
                        :disabled="this.dis"
                        placeholder="请输入内容"
                        style="min-width:200%;"
                        v-model="form.textarea">
              </el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
export default {
  name: 'ProjectAudit',
  props: {
    dis: Boolean
  },
  data () {
    return {
      form: {
        textarea: ''
      }
    }
  },
  mounted () {
    if (this.dis > 0) {

    }
  }
}
</script>
