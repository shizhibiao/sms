<template>
  <b-card no-body>
    <div slot="header">
      监察审查结果
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
              <el-form-item label="检查审核人">
                <!-- <span>{{userName2.Auditor ? userName2.Auditor: ''}}</span> -->
                <span>{{userName}}</span>
              </el-form-item>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="部门">
                <!-- <span>{{deptName}}</span> -->
                <span>{{deptName33}}</span>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="被监察部门">
                <span>{{form.deptName}}</span>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="是否下发安全通知">
                <el-radio v-model="form.radio"
                          disabled
                          label="1">是</el-radio>
                <el-radio v-model="form.radio"
                          disabled
                          label="0">否</el-radio>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <el-form-item label="是否启用风险管理">
                <el-radio v-model="form.radio2"
                          disabled
                          label="1">是</el-radio>
                <el-radio v-model="form.radio2"
                          disabled
                          label="0">否</el-radio>
              </el-form-item>
            </div>
          </div>
          <div class="row hr">
            <div class="col-lg-8 col-md-6 col-sm-12">
              <el-form-item label="检查结论">
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
import Vuex from 'vuex'
import { lookUser, getRecord } from '../../services/safety_supervision'
import bus from './bus'
export default {
  name: 'LookMonResult',
  props: {
    departmentDOs: Array,
    revResult: Object,
    status: Number
  },
  data () {
    return {
      userName: '',
      deptName: '',
      deptName33: '',
      form: {
        textarea: '',
        radio2: '',
        radio: '',
        deptName: ''
      }
    }
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    }),
    userName2 () {
      return bus.jieguo
    },
    deptName2 () {
      return bus.jieguo.deptId
    }
  },
  watch: {
    deptName2 (newval) {
      // alert(newval)
      lookUser(newval).then(res => {
        if (res.data.data) {
          this.deptName = res.data.data.deptName
        }
      })
    },
    departmentDOs (newval, old) {
      let str = ''
      // console.log(newval)
      newval.map((item, index) => {
        if (index !== newval.length - 1) {
          str += item.deptName + '、'
        } else {
          str += item.deptName
        }
      })
      this.form.deptName = str
    },
    status (newval, old) {
      if (newval == 4) {
        this.form.radio2 = this.revResult.risk ? '1' : '0'
        this.form.radio = this.revResult.safetyNotice ? '1' : '0'
        this.form.textarea = this.revResult.monitorResult
        let str = ''
        this.departmentDOs.map((item, index) => {
          if (index !== this.departmentDOs.length - 1) {
            str += item.deptName + '、'
          } else {
            str += item.deptName
          }
        })
        this.form.deptName = str
        getRecord(this.$route.query.id, 0).then(res => {
          let dataG = res.data.data.auditDOs
          dataG.forEach(item => {
            if (item.auditType == 3) {
              lookUser(item.submitUser).then(res2 => {
                if (res2.data.data) {
                  this.deptName33 = res2.data.data.deptName
                  this.userName = item.auditUserName
                }
              })
            }
          })
        })
      }
    }
  },
  methods: {
    getForms () {
      return this.form
    }
  },
  mounted () {
    // if (this.status == 4) {
    //   console.log('监听到')
    //   this.$sub.$on('jieguo', (obj) => {
    //     this.userName = obj.Auditor
    //     lookUser(obj.deptId).then(res => {
    //       if (res.data.data) {
    //         this.deptName = res.data.data.deptName
    //       }
    //     })
    //   })
    //   this.form.radio2 = this.revResult.risk ? '1' : '0'
    //   this.form.radio = this.revResult.safetyNotice ? '1' : '0'
    //   this.form.textarea = this.revResult.monitorResult
    //   let str = ''
    //   this.departmentDOs.map((item, index) => {
    //     if (index !== this.departmentDOs.length - 1) {
    //       str += item.deptName + '、'
    //     } else {
    //       str += item.deptName
    //     }
    //   })
    //   this.form.deptName = str
    // }
    lookUser(this.deptName2).then(res => {
      if (res.data.data) {
        this.deptName = res.data.data.deptName
      }
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

