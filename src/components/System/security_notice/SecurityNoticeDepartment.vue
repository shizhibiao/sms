<template>
<!--新增时显示-->

    <b-card no-body>
        <div slot="header">
          责任部门
          <div class="float-right" style="margin-right: 3em" v-if='!isDisabled'>
            <el-button type="primary" size="small" @click="handleAddBtn()" >新增</el-button>
            <el-button type="primary" size="small" @click="batchAddBtn()" >批量新增</el-button>
          </div>
          <div class="card-actions">
            <b-btn class="btn btn-minimize" v-b-toggle.collapse2><i class="icon-arrow-up"></i></b-btn>
          </div>
        </div>
      <b-collapse id="collapse2" :visible='true'>
        <!--main-->
        <template>
            <el-table
                :data="form.safetyDepartmentDOList"
                @expand-change='handleUnfold'
                row-key="deptId" :expand-row-keys="expands"
                style="width: 100%">
                <!--内容建议-->
                <el-table-column type="expand">
                  <template slot-scope="props">
                      <el-form label-position="left" inline>

                          <el-card v-if="props.row.deptContentDOList && props.row.deptContentDOList.length > 0">
                              <el-table style="width: 100%"
                              :data="props.row.deptContentDOList || []"

                              >
                                <el-table-column
                                  label="依据"
                                  >
                                  <template slot-scope="scope">
                                      <div slot="reference" class="gist-wrapper">
                                        {{ scope.row.dictName }}
                                      </div>
                                  </template>
                                  </el-table-column>
                                  <el-table-column
                                  label="内容"
                                  >
                                  <template slot-scope="scope">
                                      <div slot="reference" class="gist-wrapper">
                                        {{ scope.row.noticeContent }}
                                      </div>
                                  </template>
                                  </el-table-column>
                                  <el-table-column
                                  label="建议"
                                  >
                                  <template slot-scope="scope">
                                      <div slot="reference" class="gist-wrapper">
                                          {{ scope.row.noticeSuggest }}
                                      </div>

                                  </template>
                                  </el-table-column>
                                  <el-table-column
                                  label="纠正措施"
                                  >
                                  <template slot-scope="scope">
                                      <div slot="reference" class="gist-wrapper">
                                        {{ scope.row.correctContent }}
                                      </div>
                                  </template>
                                  </el-table-column>
                                  <el-table-column
                                  label="计划完成时间"
                                  >
                                  <template slot-scope="scope">
                                      <div slot="reference" class="gist-wrapper">
                                        {{ scope.row.planFinishDate }}
                                      </div>
                                  </template>
                                  </el-table-column>
                                  <el-table-column
                                  label="是否通过"
                                  >
                                  <template slot-scope="scope">
                                      <div slot="reference" class="gist-wrapper">
                                        {{ scope.row.passed?'是':'否' }}
                                      </div>
                                  </template>
                                  </el-table-column>
                                  <el-table-column
                                  label="是否完成"
                                  >
                                  <template slot-scope="scope">
                                      <div slot="reference" class="gist-wrapper">
                                        {{ scope.row.completed?'是':(scope.row.completed===false?'否':'无') }}
                                      </div>
                                  </template>
                                  </el-table-column>
                                  <el-table-column
                                  label="完成情况"
                                  >
                                  <template slot-scope="scope">
                                      <div slot="reference" class="gist-wrapper">
                                        {{ scope.row.description }}
                                      </div>
                                  </template>
                                  </el-table-column>

                                  <el-table-column label="操作" v-if='!isDisabled'>
                                  <template slot-scope="scope">
                                      <el-button
                                      size="mini"
                                      :disabled='isDisabled'
                                      @click="handleEditContent(scope.$index, scope.row,props.$index)">编辑</el-button>
                                      <el-button
                                      size="mini"
                                      type="danger"
                                      :disabled='isDisabled'
                                      @click="handleDeleteContent(scope.$index, scope.row ,props.$index)">删除</el-button>
                                  </template>
                                  </el-table-column>
                              </el-table>
                          </el-card>

                      </el-form>
                  </template>
                </el-table-column>
                <!--添加表   -->
                <el-table-column
                label="责任部门"
                prop="deptName"

                >
                </el-table-column>
                <el-table-column
                label="通知类型"
                prop="noticeType"
                :formatter="noticeTypeFilter"
                >
                </el-table-column>
                <el-table-column
                label="是否重复性通知"
                >
                    <template slot-scope="scopes">
                        {{scopes.row.replayIssue? '是' : '否'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" v-if='!isDisabled' width="210">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        :disabled='isDisabled'
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        :disabled='isDisabled'
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button
                        type="primary"
                        size="mini"
                        :disabled='isDisabled'
                        @click="showAddSuggest(scope.$index, scope.row )">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--添加责任部门弹出层-->
              <alertOutTable ref="outTable" @subConfirm ="confirm" @editConfirm ='modifyData' @userCanel='cancel' :isDisabled ='isDisabled'/>
              <!-- 添加内容建议弹出层-->
              <alertAddEdit ref="addAdvise"
               @subConfirmContent ='addAdviseHandler'
               @editConfirmContent ='modifyContentData'
               @userCanel='cancel'
               @batchAddContent='batchAddActionHandler'
               @batchEditContent ='batchEditContentHandle'
               />
        </template>

        <!--批量新增  -->

  <template>
    <el-dialog title="批量添加责任部门" :visible.sync="batchDialogFormVisible" width='50%'>
        <el-form :model="batchAddform"  :rules="batchAddformRules" ref="batchAddform" inline-message>
            <el-form-item label="选择部门" label-width="100px" prop='deptInfo'>
               <el-select v-model="batchAddform.deptInfo" placeholder="请选择部门" value-key='deptId' multiple :clearable='true' >
                    <el-option :label="item.deptName"
                               :value="item"
                               v-for="(item,index) in deptNameList"
                               :key="index">
                   </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通知类型" label-width="100px" prop='noticeType'>
            <el-select v-model="batchAddform.noticeType" placeholder="请选择类型" @change="noticeTypeChange">
                <el-option :label="item.dictName" :value="item.dictCode"  v-for="(item,index) in noticeTypeList" :key="index"></el-option>
            </el-select>
            </el-form-item>
            <!-- 复选框  -是否选中 -->
            <el-form-item label-width="70px" prop='replayIssue'>
                <el-checkbox v-model="batchAddform.replayIssue" :value='batchAddform.replayIssue'>是否重复性问题</el-checkbox>
                <el-button type="primary" size="small" @click="batchAddTabHandle()" class="pull-right">新增</el-button>
            </el-form-item>

        </el-form>
          <!-- 表 -->
         <el-table style="width: 100%"
                              :data="batchAddTab">
                                <el-table-column
                                  label="依据"
                                  prop='dictName'
                                  >
                                  </el-table-column>
                                  <el-table-column
                                  label="内容"
                                   prop='noticeContent'
                                  >
                                  </el-table-column>
                                  <el-table-column
                                  label="建议"
                                   prop='noticeSuggest'
                                  >
                                  </el-table-column>
                                  <el-table-column
                                  label="编辑"
                                  >
                                  <template slot-scope="scope">
                                      <div slot="reference" class="gist-wrapper">
                                          <el-button
                                          size="mini"

                                          @click="batchAddformEdit(scope.$index, scope.row)">编辑</el-button>
                                          <el-button
                                          size="mini"
                                          type="danger"

                                          @click="batchAddformDelete(scope.$index, scope.row)">删除</el-button>
                                      </div>
                                  </template>
                                  </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
            <el-button @click="batchDialogFormVisible=false" size="mini" >关 闭</el-button>
            <el-button type="primary"  size="mini" @click='batchAddAction'>确 定</el-button>
        </div>
    </el-dialog>
</template>

        <!--  -->
      </b-collapse>
    </b-card>


</template>


<script>
import { getAnnouncementType, getSafetyNoticeDetailList, getAllDataAction, getSafetyNoticeDepts, conditionGetDepartmentList } from '../../../services/safety_notice'
import { sourceDataFilter } from '../../../tools'
import alertAddEdit from './alertAddEdit'
import alertOutTable from './alertOutTable'
import Vuex from 'vuex'

// import { transformNoticeType } from '../../../tools'
import PubSub from 'pubsub-js'
export default {
  components: {
    alertAddEdit,
    alertOutTable

  },
  data () {
    return {
      noticeTypeList: [],
      dialogFormVisible: false,
      adviceContentFormVisible: false,
      form: {
        safetyDepartmentDOList: [
        ]
      },
      //  外部的表
      batchAddform:{
        deptInfo:[],
        noticeType:'1'
      },
      batchAddTab:[
      ],
      batchAddformRules:{
        deptInfo:[
          { required: true, message: '必填', trigger: 'change' }
        ],
        noticeType:[
          { required: true, message: '必填', trigger: 'change' }
        ]
      },
      deptNameList: [],
      editIndex: -1,
      editContentIndex: -1,
      addContentIndex: -1,
      batchAddIndex:-1,
      batchDialogFormVisible:false,
      nodeTypeIndex:0,
      expands: []
    }
  },

  props: ['safetyId', 'flag', 'taskId', 'isDisabled'],
  methods: {

    // 内部表 点击新增
    handleEditContent (index, row, parentIndex) {
      this.editContentIndex = index
      this.editIndex = parentIndex
      this.$refs.addAdvise.show()
    },
    // 修改
    modifyContentData (params) {
      let editContentIndex = this.editContentIndex

      if (editContentIndex >= 0) {
        let data = JSON.parse(JSON.stringify(params))

        let sourceData = this.ALL_SELECT_DATA.DEPEND_ON
        data.dictName = sourceDataFilter(sourceData, data.noticeDepend)
        this.form.safetyDepartmentDOList[this.editIndex].deptContentDOList.splice(editContentIndex, 1, data)
      }
      this.cancel()
    },
    // 删除
    handleDeleteContent (index, row, parentIndex) {
      this.form.safetyDepartmentDOList[parentIndex].deptContentDOList.splice(index, 1)
    },

    showAddSuggest (index, row) {
      this.addContentIndex = index

      this.$refs.addAdvise.handlerAddBtn()
    },

    addAdviseHandler (params) {
      if (!this.form.safetyDepartmentDOList[this.addContentIndex].deptContentDOList) {
        this.form.safetyDepartmentDOList[this.addContentIndex].deptContentDOList = []
      }
      let data = JSON.parse(JSON.stringify(params))

      let sourceData = this.ALL_SELECT_DATA.DEPEND_ON

      data.dictName = sourceDataFilter(sourceData, data.noticeDepend)

      this.form.safetyDepartmentDOList[this.addContentIndex].deptContentDOList.push(data)
      this.$forceUpdate()
    },
    // 外部表的添加
    handleAddBtn () {
      // 显示弹出层
      this.$refs.outTable.handleAddBtn('add')
    },
    confirm (params) {
      // 添加责任部门
      // console.log(params)

      let data = JSON.parse(JSON.stringify(params))
      // console.log(data)
      data.deptId = data.deptInfo && data.deptInfo.deptId
      data.deptName = data.deptInfo && data.deptInfo.deptName

      this.form.safetyDepartmentDOList.push(data)
      // 去重
      this.duplicateRemoval()

      this.$forceUpdate()
      // this.form = data
      // 隐藏弹出框
      this.$refs.outTable.hide()
    },
    handleDelete (index, row) {
      this.form.safetyDepartmentDOList.splice(index, 1)
    },
    handleEdit (index, row, params) {
      this.$refs.outTable.show()
      this.editIndex = index
    },
    modifyData (params) {
      let editIndex = this.editIndex
      let data = JSON.parse(JSON.stringify(params))
      if (editIndex >= 0) {
        this.form.safetyDepartmentDOList[editIndex].deptId = data.deptInfo && data.deptInfo.deptId
        this.form.safetyDepartmentDOList[editIndex].deptName = data.deptInfo && data.deptInfo.deptName
        this.form.safetyDepartmentDOList[editIndex].noticeType = data.noticeType
        this.form.safetyDepartmentDOList[editIndex].replayIssue = data.replayIssue
      }
    },
    cancel () {
      this.editIndex = -1
      this.editContentIndex = -1
    },
    // 展开时触发
    handleUnfold (row, expandedRows) {
      // 保证只有一个展开
      if (expandedRows.length > 1) {
        expandedRows.shift()
      }
    },
    // 格式化数据
    formattedData () {
      if (this.form.safetyDepartmentDOList) {
        let list = this.form.safetyDepartmentDOList
        list.forEach(item => {
          // item.noticeTypeName = this.noticeTypeFilter(item.noticeType)
          // item.replayIssueName = item.replayIssue ? '是' : '否'
          item.deptContentDOList = item.deptContentDOList.map((content) => {
            return {
              dictName: this.transformDictName(content.noticeDepend),
              noticeContent: content.noticeContent,
              noticeDepend: content.noticeDepend,
              noticeSuggest: content.noticeSuggest,
              passed: content.passed,
              replayIssue: content.replayIssue,
              safetyDeptId: content.safetyDeptId,
              correctContent: content.correctContent,
              planFinishDate: content.planFinishDate,
              description: content.description,
              completed: content.completed

            }
          })
        })
      }
    },
    // 批量新增
    batchAddBtn(){
      if (this.$refs && this.$refs.batchAddform && this.$refs.batchAddform.hasOwnProperty('resetFields')) {
        this.$refs.batchAddform.resetFields()
      }
      this.batchDialogFormVisible =true
    },
    // 批量新增确定
    batchAddAction(){
     this.$refs.batchAddform.validate((valid) => {
          if (!valid) {
            this.$message({
              type:'error',
              message:'不能为空'
            })
          } else {
            let arr = this.batchAddform.deptInfo.map(item=>{
                    return {
                      deptContentDOList:this.batchAddTab,
                      deptName:item.deptName,
                      deptId:item.deptId,
                      noticeType:this.batchAddform.noticeType,
                      // noticeTypeName:this.noticeTypeFilter(this.batchAddform.noticeType),
                      replayIssue:this.batchAddform.replayIssue,
                      // replayIssueName:this.batchAddform.replayIssue? '是' : '否'
                    }
                })
            this.form.safetyDepartmentDOList=this.form.safetyDepartmentDOList.concat(arr)
            // 去重
            this.duplicateRemoval()
            this.batchDialogFormVisible =false
          }
     })

    },
    // 批量新增编辑
    batchAddformEdit(index,row){
     this.$refs.addAdvise.handleBatchEditContent('batchEditContent')

      this.batchAddIndex = index
    },
    // 执行编辑
    batchEditContentHandle(content){
      console.log(content)
      let batchAddIndex = this.batchAddIndex

      if (batchAddIndex >= 0) {
        let data = JSON.parse(JSON.stringify(content))

        let sourceData = this.ALL_SELECT_DATA.DEPEND_ON
        data.dictName = sourceDataFilter(sourceData, data.noticeDepend)
        this.batchAddTab.splice(batchAddIndex, 1, data)
      }
      // 隐藏
       this.$refs.addAdvise.hide()
       this.batchAddIndex = -1
    },
    // 批量新增删除
    batchAddformDelete(index,row){

       this.batchAddTab.splice(index,1)
    },
    // 点击批量里的添加按钮
    batchAddTabHandle(){
      this.$refs.addAdvise.handlerBatchAddBtn('batchAdd')
    },
    // 获得依据内容
    batchAddActionHandler(content){
       let advise = JSON.parse(JSON.stringify(content))
       // 添加属性
       let sourceData = this.ALL_SELECT_DATA.DEPEND_ON
       advise.dictName = sourceDataFilter(sourceData, content.noticeDepend)
       // 加入数组
       this.batchAddTab.push(advise)
       // 隐藏
       this.$refs.addAdvise.hide()

    },
    // 去重
    duplicateRemoval(){
        if(this.form.safetyDepartmentDOList.length>0){
          let hash = {};
          let arr = this.form.safetyDepartmentDOList.reduce((preVal, curVal) => {
            hash[curVal.deptId] ? '' : hash[curVal.deptId] = true && preVal.push(curVal);
            return preVal
          }, [])
          this.form.safetyDepartmentDOList =arr
        }
    },
    // 过滤器
    noticeTypeFilter(vue){
      let sourceData = this.ALL_SELECT_DATA.ANNOUNCEMENT_TYPE
      let filter = ''
      if(!vue.noticeType){
         filter = sourceDataFilter(sourceData, vue)
      }else{
         filter = sourceDataFilter(sourceData, vue.noticeType)
      }
      return filter
    },
    transformDictName(vue){
      let sourceData = this.ALL_SELECT_DATA.DEPEND_ON
       let filter = sourceDataFilter(sourceData, vue)
       return filter
    },
    noticeTypeChange(){
      console.log(this.batchAddform)
      this.$forceUpdate()
    }
  },
  created () {
    // 启动流程后有taskId
    if(this.safetyId){
      getSafetyNoticeDepts(this.safetyId).then(result => {
        if (result && result.data && result.data.error === 0) {
          this.form.safetyDepartmentDOList = result.data.data

          if(this.form.safetyDepartmentDOList[0]&&this.form.safetyDepartmentDOList[0].deptContentDOList.length===1){
            this.expands.push(this.form.safetyDepartmentDOList[0].deptId)
          }

          this.formattedData()
        }
      })
      if (this.taskId) {
        getSafetyNoticeDetailList(this.safetyId, this.taskId).then(result => {
          let data = result.data
          if (+data.error === 0 && data.data) {
            this.form = data.data
            this.formattedData()
          }
        })
      }

    }
    conditionGetDepartmentList(1).then(result => {
      this.deptNameList = result
    })
    // 根据等级请求部门
    this.unsubscribe = PubSub.subscribe('noticeLevel', (message, data)=>{
       let deptId = this.$store.state.user.deptId
         conditionGetDepartmentList(data, deptId).then(result => {
          this.deptNameList = result
        })
    })
  },
  mounted () {
    //
    getAnnouncementType().then(result => {
      this.noticeTypeList = result
    })


  },
  computed: {
      ...Vuex.mapState(['ALL_SELECT_DATA'])
  },
  watch: {
    form: {
      handler (data, newdata) {
        this.$emit('getDeptData', newdata)

      },
      deep: true
    }
  },
  destoryed () {
    PubSub.unsubscribe(this.unsubscribe)
  }
}
</script>
<style scoped>

</style>
