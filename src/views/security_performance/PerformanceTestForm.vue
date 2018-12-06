<template>
  <div class="animated fadeIn">
    <test-basic />
    <b-card no-body>
      <div slot="header">
        填写信息
        <div class="card-actions">
          <b-btn class="btn btn-minimize"
                 v-b-toggle.collapse1>
            <i class="icon-arrow-up"></i>
          </b-btn>
        </div>
      </div>
      <b-collapse id="collapse1"
                  :visible='true'>
        <b-card-body>
          <el-form label-width="110px"
                   label-position="left"
                   :model="boot"
                   size="medium">
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="考核员">
                  <span>{{user.userName}}</span>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="填写时间">
                  <span>{{boot.evaluetionTime}}</span>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </b-card-body>
      </b-collapse>
    </b-card>
    <security-notice-adjunct ref='adjunct'
                             :safetyId="this.$route.query.id"
                             :tableName="tableName"
                             :uploadFile='true'>
    </security-notice-adjunct>
    <test-form ref="testform" />
    <performance-test-record />
    <b-card no-body>
      <b-card-body>
        <el-steps :active="1"
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
          <el-button type="success"
                     :disabled="dis"
                     v-loading.fullscreen.lock="fullscreenLoading"
                     @click="saveDataAction">保存</el-button>
          <el-button :disabled="!dis"
                     @click="sendAction"
                     v-loading.fullscreen.lock="fullscreenLoading2"
                     type="primary">发送</el-button>
          <el-button @click="backAction">返回</el-button>
          <el-button type="danger"
                     @click="handleClose()">
            驳回</el-button>
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
import TestBasic from './PerformanceTestBasic.vue'
import PerformanceTestRecord from './PerformanceTestRecord.vue'
import { SecurityNoticeAdjunct } from '../../components/System/security_notice/index.js'
export default {
  components: {
    SecurityNoticeAdjunct,
    TestForm,
    TestBasic,
    PerformanceTestRecord
  },
  data () {
    return {
      dis: false,
      fullscreenLoading: false,
      fullscreenLoading2: false,
      // 附件表名
      tableName: 't_performance_evaluetion',
      boot: {
        // 填写日期
        evaluetionTime: formatDate(new Date(), 'yyyy-MM-dd'),
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
    // 返回按钮
    backAction () {
      this.$router.back()
    },
    // 保存按钮事件
    saveDataAction () {
      this.fullscreenLoading = true
      if (this.$refs.testform.Verification()) {
        this.fullscreenLoading = false
        let fraction = this.$refs.testform.giveFraction()
        if (fraction.total && fraction.result) {
          let form = {
            basicDOs: this.$refs.testform.giveTab(),
            evaluetionId: this.$route.query.id,
            evaluetionLevel: fraction.result,
            evaluetionScore: fraction.total
          }
          // console.log(form)
          axios.post('/api/performance_evaluetion/saveForms', form).then(res => {
            // console.log(res)
            if (res.data.data) {
              this.dis = !this.dis
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          this.$message.error('请计算总分')
        }
      } else {
        this.$message.error('请填写必填项')
        this.fullscreenLoading = false
      }
    },
    // 关闭事件
    handleClose () {
      let data = {
        status: '',
        evaluetionDO: {
          evaluetionId: this.$route.query.id
        },
        recordDO: {
          dealResult: 0,
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
            message: '驳回成功'
          })
          this.backAction()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 发送事件
    sendAction () {
      this.fullscreenLoading2 = true
      let data = {
        evaluetionDO: {
          evaluetionId: this.$route.query.id
        },
        recordDO: {
          dealResult: 1,
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
          this.fullscreenLoading2 = false
          this.backAction()
        } else {
          this.fullscreenLoading2 = false
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
