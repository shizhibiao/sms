<template>
  <b-card no-body>
    <div slot="header">
      监察审计计划
      <div class="card-actions">
        <b-btn class="btn btn-minimize"
               v-b-toggle.collapse2>
          <i class="icon-arrow-up"></i>
        </b-btn>
      </div>
    </div>
    <b-collapse id="collapse2"
                :visible='true'>
      <b-card-body>
        <el-form label-width="110px"
                 inline-message
                 label-position="left"
                 status-icon
                 size="medium"
                 :model="notice">
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="计划指定人">
                <span>{{user.userName}}</span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="处理日期">
                <span>{{notice.dateTime}}</span>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div v-for="(item, index) in divisionList"
                 :key="index"
                 class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item :label="item.deptName">
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div v-for="(item, index) in deptId"
                 class="col-lg-4 col-md-6 col-sm-12"
                 :key="index">
              <el-form-item label="组长"
                            :rules="{ required: true, message: '请选择组长', trigger: 'change' }">
                <el-select value-key="userId"
                           multiple
                           filterable
                           remote
                           reserve-keyword
                           :disabled="dis"
                           placeholder="请输入工号、姓名"
                           @change="chAction"
                           class='select'
                           :loading="loading"
                           :remote-method="((val) => {remoteMethod(val, index)})"
                           v-model="item.leader"
                           :clearable='true'
                           ref="cascader">
                  <el-option v-for='pro in item.leaderList'
                             :label="pro.userName"
                             :value="pro"
                             :key='pro.userId'></el-option>
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
import axios from 'axios'
import Vuex from 'vuex'
import { getStaff } from '../../services/safety_supervision'
import { formatDate } from '../../utils'
export default {
  name: 'AuditPlan',
  props: {
    deptId: Array,
    dis: Boolean
  },
  data () {
    return {
      loading: false,
      notice: {
        dateTime: formatDate(new Date(), 'yyyy-MM-dd'),
        leader: []
      },
      divisionList: null,
      leaderList: []
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  watch: {
    deptId () {
      this.getData()
    }
  },
  methods: {
    remoteMethod (query, index) {
      if (query !== '') {
        this.loading = true
        axios.get('/api/system/user/search?userNo=' + query).then(res => {
          this.loading = false
          this.deptId[index].leaderList = res.data.data
        })
      } else {
        this.deptId[index].leaderList = [];
      }
    },
    chAction () {
      this.$emit('dis')
    },
    // 获取数据
    getData () {
      this.divisionList = this.deptId
      // this.deptId.map(item => {
      //   getStaff(item.deptId).then(res => {
      //     let data = res.data.data
      //     // console.log(data)
      //     item.leaderList = data
      //   })
      // })
      // console.log(this.deptId)
      this.deptId.forEach(item => {
        axios.get('/api/system/user/all').then(res => {
          let data = res.data.data
          item.leaderList = data
        })
      })
    }
  },
  mounted () {
    // console.log(this.deptId)
    this.getData()
  }
}
</script>


