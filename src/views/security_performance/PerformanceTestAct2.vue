<template>
  <div class="animated fadeIn">
    <test-basic />
    <security-notice-adjunct ref='adjunct'
                             :safetyId="this.$route.query.id"
                             :tableName="tableName"
                             :uploadFile='true'>
    </security-notice-adjunct>
    <test-form ref="testform"
               :show="true" />
    <performance-test-record />
    <opinion ref="opinion"
             :tit="title"
             @send="send" />
    <b-card no-body>
      <b-card-body>
        <el-steps :active="4"
                  align-center>
          <el-step title="新建">
          </el-step>
          <el-step title="表单填写"
                   description="受理的考核员"></el-step>
          <el-step title="单元审核"
                   description="安技部-安全管理经理"></el-step>
          <el-step title="部门审核"
                   description="安技部-部门管理团队"></el-step>
          <el-step title="公司批准"
                   description="公司领导"></el-step>
          <el-step title="结束"></el-step>
        </el-steps>
        <div class="text-center">
          <el-button @click="sendAction"
                     type="primary">发送</el-button>
          <el-button @click="backAction">返回</el-button>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
import { formatDate } from '../../utils'
import TestForm from './TestForm.vue'
import Opinion from './Opinion.vue'
import TestBasic from './PerformanceTestBasic.vue'
import PerformanceTestRecord from './PerformanceTestRecord.vue'
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
export default {
  components: {
    SecurityNoticeAdjunct,
    TestForm,
    Opinion,
    TestBasic,
    PerformanceTestRecord
  },
  data () {
    return {
      title: '公司批准',
      // 附件表名
      tableName: 't_performance_evaluetion',
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
    // 返回按钮
    backAction () {
      this.$router.back()
    },
    // 发送事件
    sendAction () {
      this.$refs.opinion.show()
    },
    send (form) {
      this.$refs.opinion.hide()
      let data = {
        status: '',
        evaluetionDO: {
          evaluetionId: this.$route.query.id
        },
        recordDO: {
          dealComment: form.textarea,
          dealResult: parseInt(form.radio),
          submitUser: this.user.userId
        },
        taskInfo: this.$route.query.taskInfo
      }
      // console.log(data)
      axios.post('/api/performance_evaluetion/process/sendTask', (this.user.userId, data)).then(res => {
        // console.log(res)
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: '发送成功'
          })
          this.backAction()
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style scoped>
</style>
