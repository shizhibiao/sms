<template>
  <div class="animated fadeIn">
      <b-card no-body>
          <b-card-header>
              <el-row :gutter="12">
                  <el-col :span="18">
                      <el-form :inline="true" :model="autoIncrement" ref="autoIncrement" label-width="120px" status-icon>
                    <el-form-item label="事件信息"  prop="eventInstance">
                        <el-input v-model="autoIncrement.eventInstance" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="飞机号" prop="aircraft">
                        <el-input v-model="autoIncrement.aircraft" placeholder=""></el-input>
                    </el-form-item>
                  <el-form-item label="处理状态" v-model="radio2" prop="disposeStart">
                    <el-radio v-model="autoIncrement.disposeStart" @change="lookup" :label="1" >已报告</el-radio>
                    <el-radio v-model="autoIncrement.disposeStart" @change="lookup" :label="2">不是事件</el-radio>
                    <el-radio v-model="autoIncrement.disposeStart" @change="lookup" :label="0">未处理</el-radio>
                  </el-form-item>
                   </el-form>
                </el-col>
                 <el-col :span="6" class="text-right">
                    <el-button type="primary" size='small'  @click="resetForm('autoIncrement')">重置</el-button>
                    <el-button type="primary" size='small'  @click="querylist">查询</el-button>
                </el-col>
              </el-row>
            </b-card-header>
        <el-form :model="queryParams" label-width="120px" style="height:75vh; overflow-y: auto">
             <b-card-body>
                 <el-table
                    :stripe="true"
                    :data="formlist"
                    size='small'
                    :highlight-current-row ="true"
                    style="width: 100%">
                    <el-table-column label='#'  width='60px'>
                        <template slot-scope="scope">
                            {{scope.$index + 1}}
                        </template>
                    </el-table-column>
                     <el-table-column
                        label="事件信息"
                        prop="eventInstance">
                    </el-table-column>
                     <el-table-column
                        label="飞机号"
                        prop="aircraft">
                    </el-table-column>
                     <el-table-column
                        label="事件等级"
                        prop="severity">
                    </el-table-column>
                     <el-table-column
                        label="事件编号"
                        prop="eventCode">
                    </el-table-column>
                     <el-table-column
                        label="起飞机场"
                        prop="toAirport">
                    </el-table-column>
                     <el-table-column
                        label="着陆机场"
                        prop="tdAirport">
                    </el-table-column>
                     <el-table-column
                        label="机型"
                        prop="aircraftType">
                    </el-table-column>
                     <el-table-column
                        label="事件类型"
                        prop="eventType">
                    </el-table-column>
                     <el-table-column
                        label="飞行阶段"
                        prop="stateName">
                    </el-table-column>
                    <el-table-column
                        label="处理状态"
                        prop="disposeStart">
                    </el-table-column>
                     <el-table-column  label="操作" >
                         <template slot-scope="scope" >
                        <el-button size="mini" type="success" @click="qareventreport(scope.$index, scope.row, formlist)" :disabled="scope.row.disposeStart !== '未处理'">事件报告</el-button>
                        <el-button size="mini" type="primary" @click="qarnotanevent(scope.$index, scope.row)"  :disabled="scope.row.disposeStart !== '未处理'">不是事件</el-button>
                         </template>
                    </el-table-column>
                 </el-table>
                <b-row>
                <b-col md="12" class="my-1 mt-1" v-if="totalPages > 1">
                  <el-pagination
                    background
                    :pager-count="5"
                    v-model="curPage"
                    :current-page.sync="curPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="total"
                    align="right">
                  </el-pagination>
                </b-col>
              </b-row>
             </b-card-body>
        </el-form>
      </b-card>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  created () {
    this.querylist()
  },
  watch: {
      curPage: function (newval, oldval) {
        this.querylist()
      }
    },
  data () {
    return {
      total: 0,
      pageSize: 15,
      curPage: 1,
      totalPages: 1,
      radio2: 0,
      autoIncrement: {
        //  事件信息
        eventInstance: '',
        //  飞机号
        aircraft: '',
        //  处理状态
        disposeStart: null
      },
      //  表格
      queryParams: {},
      formlist: [],
      onshow: true
    }
  },
  methods: {
    lookup () {
      this.querylist()
    },
    resetForm (autoIncrement) {
      this.$refs[autoIncrement].resetFields()
      this.querylist()
    },
    //  查询
    querylist () {
      let data = {
        pageNum: this.curPage - 1,
        pageSize: this.pageSize,
        queryItems: [{
          fieldName: 'eventInstance',
          value: this.autoIncrement.eventInstance
        }, {
          fieldName: 'aircraft',
          value: this.autoIncrement.aircraft
        }, {
          fieldName: 'disposeStart',
          value: this.autoIncrement.disposeStart
        }]
      }
      axios.post('/api/qar/event/listQarEvent', data)
        .then(res => {
          if (res.data.data === null) {
            this.formlist = []
          }
          this.total = res.data.data.totalElements
          this.totalPages = res.data.data.totalPages
          let Data = res.data.data.content.map(item => {
            if (item.disposeStart === 0) {
              item.disposeStart = '未处理'
            } else if (item.disposeStart === 1) {
              item.disposeStart = '已报告'
            } else if (item.disposeStart === 2) {
              item.disposeStart = '不是事件'
            }
            return item
          })
          this.formlist = Data
        })
    },
    //  事件报告
    qareventreport (index, rows) {
      this.$router.push({ path: 'start/' + rows.id })
    },
    //  不是事件
    qarnotanevent (index, rows) {
      this.$confirm('是否确认不是事件?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
        id: rows.id,
        disposeStart: 2
      }
      axios.post('/api/qar/event/updateQarEvent', obj)
        .then(res => {
          if (res.data.error === 0) {
            this.$message.success('保存成功')
            this.querylist()
          } else {
            this.$message.error('保存失败' + res.data.message)
          }
        })
      }).catch(() => {
      })


      
    }
  }
}
</script>
