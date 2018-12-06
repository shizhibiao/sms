<template>
        <el-dialog :title="$route.name||''" :visible.sync="dialogFormVisible"  width="30%">
        <el-form :model="form" :rules="rules" ref="form">
           <el-form-item label="评估结果" v-if='ALL_SELECT_DATA.ASSESS_RESULT && isResultPage' label-width="25%" prop="accessResult">
              <el-select v-model="form.accessResult" :clearable='true'>
                  <el-option :label="item.dictName" :value="item.dictCode" v-for= "(item , index ) in ALL_SELECT_DATA.ASSESS_RESULT.dicts" :key ='index' ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="意见" label-width="25%" prop="advise">
              <el-input v-model="form.advise" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="agreeAction">同意</el-button>
            <el-button type="danger" @click="cancelAction" v-if='!cancelHide'>驳回</el-button>
            <el-button @click="hide">关闭</el-button>
        </div>
        </el-dialog>

</template>
<script>
import Vuex from 'vuex'
export default{
  data () {
    return {
      dialogFormVisible: false,
      form: {
        advise: '',
        accessResult: ''

      },
      rules: {
        advise: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        accessResult: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      }

    }
  },
  props: ['cancelHide', 'isResultPage'],
  methods: {
    show () {
      this.dialogFormVisible = true
    },
    hide () {
      this.dialogFormVisible = false
    },
    agreeAction () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('agreeAction', this.form)
        } else {
          this.$message.error('不能为空')
        }
      })
    },
    cancelAction () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('rejectAction', this.form)
        } else {
          this.$message.error('不能为空')
        }
      })
      this.hide()
    }
  },
  computed: {
          ...Vuex.mapState(['ALL_SELECT_DATA'])
  },
  mounted () {
  }
}
</script>