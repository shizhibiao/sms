<template>
  <b-card no-body>
    <div slot="header">
      监察审查结果
      <div class="card-actions">
          <b-btn class="btn btn-minimize"
                 v-b-toggle.collapse8>
            <i class="icon-arrow-up"></i>
          </b-btn>
        </div>
    </div>
    <b-collapse id="collapse8" :visible='true'>
    <b-card-body>
        <el-form 
               label-width="150px"
               inline-message
                 status-icon
                 label-position="left"
                 size="medium"
               :model="form">
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="检查审核人">
                  <span>{{user.userName}}</span>
                </el-form-item>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="部门">
                  <span>{{user.deptName}}</span>
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
                  <el-radio @change="change1" v-model="form.radio" label="1">是</el-radio>
                  <el-radio @change="change1" v-model="form.radio" label="0">否</el-radio>
                </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4 col-md-6 col-sm-12">
                <el-form-item label="是否启用风险管理">
                  <el-radio @change="change2" v-model="form.radio2" label="1">是</el-radio>
                  <el-radio @change="change2" v-model="form.radio2" label="0">否</el-radio>
                </el-form-item>
              </div>
            </div>
            <div class="row hr">
              <div class="col-lg-8 col-md-6 col-sm-12">
                <el-form-item label="检查结论"
                        >
                  <el-input type="textarea"
                      :rows="4"
                      @change="inAction"
                      style="width:100%;"
                      placeholder="请输入内容"
                      v-model="form.textarea"
                      maxlength="200"
                      >
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
export default {
  name: 'MonResult',
  props: {
    departmentDOs: Array,
    revResult: Object
  },
  data () {
    return {
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
    })
  },
  watch: {
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
    }
  },
  methods: {
    getForms () {
      return this.form
    },
    change1 () {
      this.$emit('dis')
    },
    change2 () {
      this.$emit('dis')
    },
    inAction () {
      this.$emit('dis')
    }
  },
  mounted () {
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
  }
}
</script>

<style>
#collapse8 .hr {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>

