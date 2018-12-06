<template>
    <el-dialog title="添加责任部门" :visible.sync="dialogFormVisible" width='35%'>
        <el-form :model="form"  :rules="rules" ref="form" inline-message>
            <el-form-item label="选择部门" label-width="100px" prop='deptInfo'>
               <el-select v-model="form.deptInfo" placeholder="请选择部门" value-key='deptName' :disabled ='isDisabled' >
                    <el-option :label="item.deptName" :value="item"  v-for="(item,index) in deptNameList" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通知类型" label-width="100px" prop='noticeType'>
            <el-select v-model="form.noticeType" placeholder="请选择类型"  :disabled ='isDisabled' >
                <el-option :label="item.dictName" :value="item.dictCode"  v-for="(item,index) in ALL_SELECT_DATA.ANNOUNCEMENT_TYPE.dicts" :key="index"></el-option>
            </el-select>
            </el-form-item>
            <!-- 复选框  -是否选中 -->
            <el-form-item label-width="70px" >
                <el-checkbox v-model="form.replayIssue" :value='form.replayIssue' :disabled ='isDisabled'>是否重复性问题</el-checkbox>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="hide" size="mini" >取 消</el-button>
            <el-button type="primary" @click="confirm(form)" size="mini">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getAnnouncementType, conditionGetDepartmentList } from '../../../services/safety_notice'
import { sourceDataFilter } from '../../../tools'
import PubSub from 'pubsub-js'

export default {

  data () {
    return {
      deptContentDOList: [],
      noticeTypeList: [],
      dialogFormVisible: false,
      adviceContentFormVisible: false,

      form: {
        deptName: '',
        noticeType: '1',
        replayIssue: '',
        replayIssueName: '',
        deptInfo: ''
      },
      type: '',
      deptNameList: [],
      nodeTypeIndex: 1,
      rules: {
        deptInfo: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        noticeType: [
          { required: true, message: '必填', trigger: 'change' }
        ]
      },
      valid: false

    }
  },
  computed: {
  },
  props: ['isDisabled'],
  methods: {
    handleAddBtn () {
      // 显示弹出层
      this.show()
      // 打开时先清空对象
      if (this.$refs && this.$refs.form && this.$refs.form.hasOwnProperty('resetFields')) {
        this.$refs.form.resetFields()
      }
      this.type = 'add'
    },
    // 确认
    confirm (form) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.valid = true
        } else {
          this.valid = false
        }
      })

      let type = this.type
      // this.form.noticeTypeName = this.transformNoticeType(this.form.noticeType)
      if (this.valid) {
        if (type && type === 'add') {
          this.$emit('subConfirm', this.form)
          this.type = ''
        } else {
          this.$emit('editConfirm', this.form)
        }
        this.hide()
      } else {
        this.$message({
          type: 'error',
          message: '请填写必填内容'
        })
      }
    },
    // 监听获得通知等级
    getNoticeSrcTypeHandler (message, data) {
      this.nodeTypeIndex = data
    },
    hide () {
      this.dialogFormVisible = false
    },
    show () {
      this.dialogFormVisible = true
    },
    transformNoticeType (alue) {
       let sourceData = this.ALL_SELECT_DATA.ANNOUNCE_RESOURCE
       let result = sourceDataFilter(sourceData, alue)
       return result
    }
  },
  mounted () {
    conditionGetDepartmentList(1).then(result => {
      this.deptNameList = result
    })
    // 监听
    this.unsubscribe = PubSub.subscribe('noticeLevel', this.getNoticeSrcTypeHandler)
  },
  watch: {
    // 通知等级变化了 请求部门变化
    nodeTypeIndex: {

      handler (newdata) {
        let deptId = this.$store.state.user.deptId

        conditionGetDepartmentList(newdata, deptId).then(result => {
          this.deptNameList = result
        })
      },
      deep: true
    }
  },
  computed:{
    ALL_SELECT_DATA(){
      return this.$store.state.ALL_SELECT_DATA
    }
  },
  destoryed () {
    PubSub.unsubscribe(this.unsubscribe)
  }
}
</script>
