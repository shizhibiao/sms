<template>
  <b-card no-body>
    <div slot="header">
      {{tit}}
      <div class="card-actions">
        <b-btn class="btn btn-minimize"
               v-b-toggle.collapse28>
          <i class="icon-arrow-up"></i>
        </b-btn>
      </div>
    </div>
    <b-collapse id="collapse28"
                :visible='true'>
      <b-card-body>
        <el-form label-width="150px"
                 inline-message
                 status-icon
                 label-position="left"
                 size="medium"
                 :model="form">
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="审核人">
                <span>{{form.userName}}</span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="审核日期">
                <span>{{form.time}}</span>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="审核结果">
                <el-radio v-model="form.radio"
                          disabled
                          label="1">是</el-radio>
                <el-radio v-model="form.radio"
                          disabled
                          label="0">否</el-radio>
              </el-form-item>
            </div>
          </div>
          <div class="row hr">
            <div class="col-lg-8 col-md-6 col-sm-12">
              <el-form-item label="审核意见">
                <el-input type="textarea"
                          :rows="4"
                          style="width:100%;"
                          disabled
                          placeholder=""
                          v-model="form.textarea">
                </el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import axios from 'axios'
import Vuex from 'vuex'
export default {
  props: {
    tit: String,
  },
  data () {
    return {
      form: {
        textarea: '',
        radio: '',
        userName: '',
        time: ''
      }
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  watch: {
  },
  methods: {
  },
  mounted () {
    axios.get('/api/performance_evaluetion/findHisById/' + this.$route.query.id).then(res => {
      // console.log(res)
      let data = res.data.data
      data.forEach(item => {
        if (this.tit == '单元审核' && item.processStatus == 1) {
          this.form.textarea = item.dealComment
          this.form.userName = item.dealUserName
          this.form.radio = item.dealResult ? '1' : '0'
          this.form.time = item.submitDate
        } else if (this.tit == '部门审核' && item.processStatus == 2) {
          this.form.textarea = item.dealComment
          this.form.userName = item.dealUserName
          this.form.radio = item.dealResult ? '1' : '0'
          this.form.time = item.submitDate
        } else if (this.tit == '公司批准' && item.processStatus == 3) {
          this.form.textarea = item.dealComment
          this.form.userName = item.dealUserName
          this.form.radio = item.dealResult ? '1' : '0'
          this.form.time = item.submitDate
        }
      })
    })
  }
}
</script>

<style>
#collapse8 .hr {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>

