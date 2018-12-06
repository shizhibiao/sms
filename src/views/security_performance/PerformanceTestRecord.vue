<template>
  <b-card no-body>
    <div slot="header">
      流程记录
      <div class="card-actions">
        <b-btn class="btn btn-minimize"
               v-b-toggle.collapse3>
          <i class="icon-arrow-up"></i>
        </b-btn>
      </div>
    </div>
    <b-collapse id="collapse3"
                :visible='true'>
      <b-card-body>
        <tree-table :data="showData"
                    :columns="columns"
                    :expandAll="true" />
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
// getUser
import Vuex from 'vuex'
import axios from 'axios'
import { getRecord, getUser, dept } from '../../services/safety_supervision'
import { formatDate } from '../../utils/index.js'
import treeTable from '@/components/TreeTable'
import { filterReportType } from '../../tools';
export default {
  data () {
    return {
      columns: [
        {
          text: '流程节点',
          value: 'processStatus2',
          width: 250
        },
        {
          text: '审核日期',
          value: 'submitDate'
        },
        {
          text: '办理人',
          value: 'dealUserName'
        },
        {
          text: '办理意见',
          value: 'dealComment'
        },
        {
          text: '办理结果',
          value: 'dealResult2'
        }
      ],
      showData: [],
    }
  },
  components: {
    treeTable
  },
  methods: {
    lookAction (index, row) {
      let url = '/performance/testlook'
      this.$router.push({
        path: url,
        query: {
          id: row.evaluetionId,
          status: row.auditType
        }
      })
    },
    filerTypeHandle (data) {
      switch (data) {
        case -2:
          return '关闭流程'
        case -1:
          return '新建'
        case 0:
          return '表单填写'
        case 1:
          return '单元审核'
        case 2:
          return '部门审核'
        case 3:
          return '公司批准'
        case 4:
          return '流程结束'
        default:
          return ''
      }
    }
  },
  watch: {
  },
  computed: {
    ...Vuex.mapState({
      user: 'user'
    })
  },
  mounted () {
    axios.get('/api/performance_evaluetion/findHisById/' + this.$route.query.id).then(res => {
      // console.log(res)
      let data = res.data.data
      data.forEach(item => {
        item.dealResult2 = item.dealResult ? '通过' : '未通过'
        item.processStatus2 = this.filerTypeHandle(item.processStatus)
      })
      this.showData = data
    })
  }
}
</script>
