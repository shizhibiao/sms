<template>
  <b-card no-body>
    <div slot="header">
      基本信息
      <div class="card-actions">
        <b-btn class="btn btn-minimize" v-b-toggle.collapse1><i class="icon-arrow-up"></i></b-btn>
      </div>
    </div>
    <b-collapse id="collapse1" :visible='true'>
        <b-card-body>

        <el-form ref="form" label-width="100px" label-position="left" :rules="rules" :model="notice">

          <div class="row mt-0 mb-0 pt-0 pb-0 ">
              <div class="col-lg-4 col-md-6 col-sm-12">
                  <el-form-item label="立项人">
                      <p>{{notice.submitUserName}}</p>
                  </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                  <el-form-item label="立项部门">
                      <p>{{notice.submitDeptName}}</p>
                  </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                  <el-form-item label="立项日期">
                      <p style="padding-left:28px">
                        {{notice.submitDate}}</p>
                  </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                  <el-form-item label="电话">
                      <p>{{notice.submitPhone}}</p>
                  </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                  <el-form-item label="通知等级" prop="noticeLevel">
                      <el-select :placeholder="notice.noticeLevel" class="level" v-model="notice.noticeLevel" :disabled ="isDisabled">
                          <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.ANNOUNCEMENT_LEVEL.dicts" :key ='index'></el-option>
                      </el-select>
                  </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="要求反馈日期" label-width="100px" >
                  <el-date-picker type="date" :placeholder="notice.mustReportDate" class="dateSelect" v-model="notice.mustReportDate" value-format ='yyyy-MM-dd' :disabled ="isDisabled" style='width:100%'></el-date-picker>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="标题" prop="noticeTitle">
                      <el-input  :placeholder="notice.noticeTitle" class="input-with-select" v-model="notice.noticeTitle" :disabled ="isDisabled">
                      </el-input>
                    </el-form-item>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <el-form-item label="通知来源" prop="noticeSrcType">
                      <el-select v-model="notice.noticeSrcType"
                      :disabled ="isDisabled">
                          <el-option
                            v-for="item in ALL_SELECT_DATA.ANNOUNCE_RESOURCE.dicts"
                            :key="item.dictCode"
                            :label="item.dictName"
                            :value="item.dictCode">
                          </el-option>
                      </el-select>
                    </el-form-item>
                </div>
          </div>


        </el-form>
      </b-card-body>
    </b-collapse>

  </b-card>
</template>

<script>
import Vuex from 'vuex'
import {formatDate} from '../../../utils'
import { getSafetyNoticeDetailList } from '../../../services/safety_notice'
import PubSub from 'pubsub-js'
export default {

  name: 'SecurityNoticeBase',
  data () {
    return {
      notice: {
      },
      headerTitle: '',
      rules: {
        noticeLevel: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        noticeTitle: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        noticeSrcType: [
          { required: true, message: '必填', trigger: 'change' }
        ]

      },
      options: [{
        value: '',
        label: ''
      }]

    }
  },
  props: [
    'safetyId', // 保存的数据id
    'flag', // 角色 id  权限控制区分
    'taskId', // 预埋的属性
    'isDisabled',
    'procStatus'// 状态值
  ],
  // 当前用户的信息
  computed: {...Vuex.mapState(['user']),
          ...Vuex.mapState(['ALL_SELECT_DATA'])
          }
  ,
  methods: {
    // 初始化数据
    initNotice () {
      let { deptId, deptName, userName, userPhone } = this.user
      let submitDate = formatDate(new Date(), 'yyyy-MM-dd')
      this.notice = {
        noticeSrcType: '1',
        mustReportDate: '',
        submitDeptName: deptName,
        noticeTitle: '',
        submitUserName: userName,
        submitDeptId: deptId,
        submitDate,
        submitPhone: userPhone,
        noticeLevel: '1'
      }
    }
  },
  created () {
    // 初始化
    this.initNotice()

    // 请求数据
    getSafetyNoticeDetailList(this.safetyId, this.taskId).then(result => {
      let data = result.data
      if (+data.error === 0 && data.data) {
        this.notice = data.data
      }
    })
  },
  watch: {
    // 发布消息通知  2是
    notice: {
      handler (data, newdata) {
        if (+newdata.noticeLevel === 2) {
          PubSub.publish('noticeLevel', '2')

        } else {
          PubSub.publish('noticeLevel', '1')
        }
        this.$emit('getBaseData', newdata)
      },
      deep: true

    }
  },
  mounted () {
    console.log(this.ALL_SELECT_DATA)
  }
}
</script>
