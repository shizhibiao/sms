<template>
    <el-table
      size='small'
      :data="postDta"
      style="width: 100%"
      label="原因分析">
      <el-table-column
        fixed
        label='#'
        width='60px'>
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="resonId1"
        label="一级原因"
          >
      </el-table-column>
      <el-table-column
        prop="resonDetailId"
        label="具体原因">
      </el-table-column>
      <el-table-column
        prop="resonNature"
        label="原因性质">
      </el-table-column>
      <el-table-column
        prop="resonAnalysis"
        label="事实分析">
      </el-table-column>
    </el-table>
</template>
  <script>
    export default {
      props: {
        postDta: Array
      },
      data () {
        return {
        }
      },
      methods: {
        Newviewss (index, params, array) {
          this.$emit('getevent', index, params, array)
        },
        removeeventDOS (index, params) {
          this.$emit('getremove', params)
        }
      }
    }
  </script>